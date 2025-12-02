import { defineStore, storeToRefs } from "pinia";


import type { VerificationJob, VerificationJobs } from "@/composables/NgencerfModels";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useForecastStore } from "@/stores/forecast/ForecastStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { isValidDate } from '@/utils/CommonHelpers';
import { formatElapsedTime, formatDateForRunOnString } from '@/utils/TimeHelpers';

const forecastStore = useForecastStore();
const { selectedForecastJob } = storeToRefs(forecastStore);

export const useVerificationStore = defineStore('VerificationStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const { 
    createdAtStart,
    createdAtEnd,
    minCreatedAt,
    maxCreatedAt,
    jobIdStart,
    jobIdEnd,
    minJobId,
    maxJobId,
    statusTypeFilterList 
  } = storeToRefs(useUserDataStore());

  // refs
  const forecastJobId = ref<number>();
  const forecastRunsForVerification = ref<ForecastJob[]>([]);
  const forecastRunsForVerificationListPageSize = ref<number>(50);
  const forecastRunsForVerificationListCurrentPage = ref<number>(1);
  const forecastRunsForVerificationListTotalPages = ref<number>(0);
  const forecastRunsForVerificationListTotalSize = ref<number>(0);
  const forecastRunsForVerificationListStartRow = ref<number>(1);
  const forecastRunsForVerificationListEndRow = ref<number>(forecastRunsForVerificationListPageSize.value);
  const forecastRunsForVerificationListSort = ref<DynamicObject>({'field': 'forecast_run_id', 'direction': -1});
  
  const verificationJobId = ref<number>();
  const verificationJobs = ref<VerificationJob[]>([]);
  const selectedVerificationJob = ref<VerificationJob>();
  const userVerificationJobData = ref<VerificationJob>();
  const verificationRunListPageSize = ref<number>(50);
  const verificationRunListCurrentPage = ref<number>(1);
  const verificationRunListTotalPages = ref<number>(0);
  const verificationRunListTotalSize = ref<number>(0);
  const verificationRunListStartRow = ref<number>(1);
  const verificationRunListEndRow = ref<number>(verificationRunListPageSize.value);
  const verificationRunListSort = ref<DynamicObject>({'field': 'verification_run_id', 'direction': -1});
  
  const verificationDate = ref<any>();
  const yamlConfigData = ref<DynamicObject>({});

  const verificationJobStatus = ref<string>();
  const failureMessages = ref<any>();
  const elapsedTime = ref<string>();
  const submitTimeDate = ref<Date>();
  const submitTime = ref<string>();
  const verificationStatusCheckingInterval = ref<any>();
  const verificationRunningTimeInterval = ref<any>();
  const verificationPlotNames = ref<string[]>(); // TODO: create verificationPlotNames interface
  const verificationPlot = ref<any>(); // TODO: create verificationPlot interface

  const isVerificationLoading = ref<boolean>(false);

  /**
   * fetch get_forecast_jobs_for_verification
   * @return {void}
   */
  const getForecastRunsForVerification = async (): Promise<any> => {
    forecastRunsForVerification.value = [];
    let requestBody = {
      limit: forecastRunsForVerificationListPageSize.value,
      offset: (forecastRunsForVerificationListCurrentPage.value - 1) * forecastRunsForVerificationListPageSize.value,
      sort: {
        field: forecastRunsForVerificationListSort.value.field,
        direction: forecastRunsForVerificationListSort.value.direction === -1 ? 'desc' : 'asc'
      },
      filters: {
        date_filter:
          (createdAtStart.value && createdAtEnd.value) ? {
            start_date: formatISOStringOrDateToYYYYMMDD(createdAtStart.value),
            end_date: formatISOStringOrDateToYYYYMMDD(createdAtEnd.value),
            operator: "between"
          } : createdAtStart.value ? {
            create_date: formatISOStringOrDateToYYYYMMDD(createdAtStart.value),
            operator: "after"
          } : createdAtEnd.value ? {
            create_date: formatISOStringOrDateToYYYYMMDD(createdAtEnd.value),
            operator: "before"
          } : {}
        ,
        id_filter:
          (jobIdStart.value && jobIdEnd.value) ? {
            start_id: jobIdStart.value,
            end_id: jobIdEnd.value,
            operator: "between"
          } : jobIdStart.value ? {
            id: jobIdStart.value,
            operator: "after"
          } : jobIdEnd.value ? {
            id: jobIdEnd.value,
            operator: "before"
          } : {}
        ,
        status: statusTypeFilterList.value
      }
    }
    const runListDataResult = await makeProtectedApiCall<ForecastJobs>(`${ngencerfBaseUrl}/calibration/get_forecast_jobs_for_verification/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    forecastRunsForVerification.value = runListDataResult?._data?.forecast_jobs ?? [];
    forecastRunsForVerificationListTotalSize.value = runListDataResult?._data?.total_count ?? 0;
    forecastRunsForVerificationListTotalPages.value = Math.ceil(forecastRunsForVerificationListTotalSize.value / forecastRunsForVerificationListPageSize.value);
    forecastRunsForVerificationListStartRow.value = (forecastRunsForVerificationListPageSize.value * (forecastRunsForVerificationListCurrentPage.value - 1)) + 1;
    forecastRunsForVerificationListEndRow.value = Math.min(forecastRunsForVerificationListStartRow.value + (forecastRunsForVerificationListPageSize.value - 1), forecastRunsForVerificationListTotalSize.value);
    
    if (runListDataResult?._data?.date_range && runListDataResult?._data?.date_range.length === 2) {
      minCreatedAt.value = runListDataResult?._data?.date_range[0];
      maxCreatedAt.value = runListDataResult?._data?.date_range[1];
    }
    if (runListDataResult?._data?.id_range && runListDataResult?._data?.id_range.length === 2) {
      minJobId.value = runListDataResult?._data?.id_range[0];
      maxJobId.value = runListDataResult?._data?.id_range[1];
    }
  }

  const setSelectedForecastRunId = (forecast_job_id: number): void => {
    forecastJobId.value = forecast_job_id;
  }

  const setSelectedForecastRowData = async (forecast_row_data: ForecastJob): Promise<void> => {
    setSelectedForecastRunId(forecast_row_data.forecast_run_id);
  }

  /**
   * fetch get_verification_jobs
   * @return {void}
   */
  const getVerificationJobs = async (): Promise<any> => {
    verificationJobs.value = [];
    let requestBody = {
      limit: verificationRunListPageSize.value,
      offset: (verificationRunListCurrentPage.value - 1) * verificationRunListPageSize.value,
      sort: {
        field: verificationRunListSort.value.field,
        direction: verificationRunListSort.value.direction === -1 ? 'desc' : 'asc'
      },
      filters: {
        date_filter:
          (createdAtStart.value && createdAtEnd.value) ? {
            start_date: formatISOStringOrDateToYYYYMMDD(createdAtStart.value),
            end_date: formatISOStringOrDateToYYYYMMDD(createdAtEnd.value),
            operator: "between"
          } : createdAtStart.value ? {
            create_date: formatISOStringOrDateToYYYYMMDD(createdAtStart.value),
            operator: "after"
          } : createdAtEnd.value ? {
            create_date: formatISOStringOrDateToYYYYMMDD(createdAtEnd.value),
            operator: "before"
          } : {}
        ,
        id_filter:
          (jobIdStart.value && jobIdEnd.value) ? {
            start_id: jobIdStart.value,
            end_id: jobIdEnd.value,
            operator: "between"
          } : jobIdStart.value ? {
            id: jobIdStart.value,
            operator: "after"
          } : jobIdEnd.value ? {
            id: jobIdEnd.value,
            operator: "before"
          } : {}
        ,
        status: statusTypeFilterList.value
      }
    }
    const runListDataResult = await makeProtectedApiCall<VerificationJobs>(`${ngencerfBaseUrl}/calibration/get_verification_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    verificationJobs.value = runListDataResult?._data?.verification_jobs ?? [];
    verificationRunListTotalSize.value = runListDataResult?._data?.total_count ?? 0;
    verificationRunListTotalPages.value = Math.ceil(verificationRunListTotalSize.value / verificationRunListPageSize.value);
    verificationRunListStartRow.value = (verificationRunListPageSize.value * (verificationRunListCurrentPage.value - 1)) + 1;
    verificationRunListEndRow.value = Math.min(verificationRunListStartRow.value + (verificationRunListPageSize.value - 1), verificationRunListTotalSize.value);

    if (runListDataResult?._data?.date_range && runListDataResult?._data?.date_range.length === 2) {
      minCreatedAt.value = runListDataResult?._data?.date_range[0];
      maxCreatedAt.value = runListDataResult?._data?.date_range[1];
    }
    if (runListDataResult?._data?.id_range && runListDataResult?._data?.id_range.length === 2) {
      minJobId.value = runListDataResult?._data?.id_range[0];
      maxJobId.value = runListDataResult?._data?.id_range[1];
    }
  }

  /**
   * Load Verification Run/Status tab data
   */
  const loadVerificationRunStatusTabData = async (): Promise<string[]> => {
    let errorMessages: string[] = [];
    // get verification job data
    if (verificationJobId?.value) {
      // query get_status endpoint
      const getVerificationStatusResponse: any = await getVerificationStatus();

      if (getVerificationStatusResponse.status === 200) {
        // set verificationJobStatus, elapsedTime and submitTime
        verificationJobStatus.value = getVerificationStatusResponse?._data?.status;
        if (isValidDate(getVerificationStatusResponse?._data?.submit_date)) {
          submitTime.value = formatDateForRunOnString(getVerificationStatusResponse._data.submit_date);
        }

        if (verificationJobStatus?.value?.toLocaleUpperCase() === "RUNNING") {
          if (verificationStatusCheckingInterval.value) {
            clearInterval(verificationStatusCheckingInterval.value);
          }
          if (verificationRunningTimeInterval.value) {
            clearInterval(verificationRunningTimeInterval.value);
          }
          verificationStatusCheckingInterval.value = setInterval(loadVerificationStatusInformation, 10000);
          verificationRunningTimeInterval.value = setInterval(updateRunningTime, 1000);
        }

        if (selectedVerificationJob?.value?.submit_date) {
          submitTimeDate.value = new Date(selectedVerificationJob.value.submit_date as string);
          if (isValidDate(submitTimeDate.value)) {
            submitTime.value = formatDateForRunOnString(submitTimeDate.value);
            // set elapsedTime
            updateRunningTime();
          } else {
            errorMessages.push(`Invalid submit date: ${selectedVerificationJob.value.submit_date}`);
          }
        }
      } else {
        return useApiErrorResponsePreprocess(getVerificationStatusResponse);
      }
    }
    return errorMessages;
  };

  const updateRunningTime = (): void => {
    if (submitTimeDate.value) {
      elapsedTime.value = calculateElapsedTime( submitTimeDate.value, new Date() );
    }
  }

  /**
   * Load Verification Results tab data
   */
  const loadVerificationResultsTabData = async (): Promise<string[]> => {
    const errorMessages: string[] = [];

    // load verification Run/Status tab data
    const loadVerificationErrors: string[] = await loadVerificationRunStatusTabData();
    if (loadVerificationErrors.length > 0) {
      errorMessages.push(...loadVerificationErrors);
    }
    if (errorMessages.length > 0) {
      return errorMessages;
    } else {
      return [];
    }
  };

  /**
   * Query load_verification_tab endpoint
   */
  const loadVerificationTab = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/load_verification_tab/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });
  };

  /**
   * Call get_status endpoint with verificationJobId
   * @return {any}
   */
  const getVerificationStatus = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_verification_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_run_id: verificationJobId.value })
    });
  };
  
  /**
   * Load Selected Verification Run
   */
  const loadSelectedVerificationJob = async (verification_run_id: number): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/load_verification_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_run_id: verification_run_id })
    });
  };

  const setSelectedVerificationJobId = async(verification_run_id: number): Promise<void> => {
    verificationJobId.value = verification_run_id;
    let response = await loadSelectedVerificationJob(verificationJobId.value);
    userVerificationJobData.value = response._data;
    forecastJobId.value = userVerificationJobData.value?.forecast_run.forecast_run_id;
  }

  const setSelectedVerificationRowData = async (verification_row_data: VerificationJob): Promise<void> => {
    setSelectedVerificationJobId(verification_row_data.verification_run_id);
    verificationJobStatus.value = (verification_row_data as VerificationJob).status;
  }

  const resetSelectedVerificationJobData = (): void => {
    // clear previously selected forecast/verification jobs
    selectedForecastJob.value = undefined;
    forecastJobId.value = undefined;
    selectedVerificationJob.value = undefined;
    verificationJobId.value = undefined;
    userVerificationJobData.value = undefined;
  }
  
  /**
   * Create and Run Verification Job
   */
  const createAndRunVerificationJob = (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/create_and_run_verification_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ forecast_run_id: selectedForecastJob?.value?.forecast_run_id })
    });
  };
  
  const loadVerificationStatusInformation = async () => {
    getVerificationStatus().then( response => {
      if ( response._data.status ) {
        verificationJobStatus.value = response._data.status;
        failureMessages.value = response._data.failure_messages;
        if (response._data.submit_date) {
          submitTimeDate.value = new Date(response._data.submit_date);
          if (isValidDate(submitTimeDate.value)) {
            submitTime.value = formatDateForRunOnString(submitTimeDate.value);
          }
          if ( verificationJobStatus?.value?.toLocaleUpperCase() !== "RUNNING" ) {
            elapsedTime.value = response._data.elapsed_time ? formatElapsedTime(response._data.elapsed_time) : '';
            loadSelectedVerificationJob(userVerificationJobData?.value ? userVerificationJobData?.value?.verification_run_id : verificationJobId?.value);
            clearInterval(verificationStatusCheckingInterval.value);
            clearInterval(verificationRunningTimeInterval.value);
            verificationStatusCheckingInterval.value = undefined;
            verificationRunningTimeInterval.value = undefined;
          }
        }
      } else {
        clearInterval(verificationStatusCheckingInterval.value);
        clearInterval(verificationRunningTimeInterval.value);
        verificationStatusCheckingInterval.value = undefined;
        verificationRunningTimeInterval.value = undefined;
      }
    })
  }

  /**
   * Cancel Verification Job by querying cancel_job endpoint
   */
  const cancelVerificationJob = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_run_id: verificationJobId.value })
    });
  };
  
  /**
   * Get Verification Plot Names
   */
  const getVerificationPlotNames = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_verification_plot_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_run_id: verificationJobId.value })
    });
  };

  /**
   * Get Verification Plot
   */
  const getVerificationPlot = async (
    plotName: string
  ): Promise<any> => {
    const params = new URLSearchParams({
      plot_name: plotName,
      verification_run_id: verificationJobId.value ? verificationJobId.value.toString() : ''
    });
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_verification_plot/?${params.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      }
    });
  };
  
  /**
  * Delete a job
  * If a single job comes in, make sure we put it into an array.
  * Otherwise, it is an array.
  */
  async function deleteVerificationJob(runId: number) {
    return await makeProtectedApiCall<VerificationJob>(`${ngencerfBaseUrl}/calibration/delete_verification_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_run_id: runId })
    });
  };


  return {
    forecastJobId,
    forecastRunsForVerification,
    forecastRunsForVerificationListPageSize,
    forecastRunsForVerificationListCurrentPage,
    forecastRunsForVerificationListTotalPages,
    forecastRunsForVerificationListTotalSize,
    forecastRunsForVerificationListStartRow,
    forecastRunsForVerificationListEndRow,
    forecastRunsForVerificationListSort,
    verificationJobId,
    verificationJobStatus,
    failureMessages,
    elapsedTime,
    submitTimeDate,
    submitTime,
    verificationStatusCheckingInterval,
    verificationRunningTimeInterval,
    verificationJobs,
    verificationRunListPageSize,
    verificationRunListCurrentPage,
    verificationRunListTotalPages,
    verificationRunListTotalSize,
    verificationRunListStartRow,
    verificationRunListEndRow,
    verificationRunListSort,
    selectedVerificationJob,
    userVerificationJobData,
    verificationDate,
    yamlConfigData,
    verificationPlotNames,
    verificationPlot,
    isVerificationLoading,
    getForecastRunsForVerification,
    setSelectedForecastRunId,
    setSelectedForecastRowData,
    getVerificationJobs,
    loadSelectedVerificationJob,
    loadVerificationRunStatusTabData,
    loadVerificationResultsTabData,
    loadVerificationTab,
    createAndRunVerificationJob,
    cancelVerificationJob,
    updateRunningTime,
    getVerificationStatus,
    loadVerificationStatusInformation,
    setSelectedVerificationJobId,
    resetSelectedVerificationJobData,
    setSelectedVerificationRowData,
    getVerificationPlotNames,
    getVerificationPlot,
    deleteVerificationJob
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVerificationStore, import.meta.hot));
}