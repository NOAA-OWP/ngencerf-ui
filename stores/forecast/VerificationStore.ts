import { defineStore, storeToRefs } from "pinia";


import type { VerificationJob, VerificationJobs } from "@/composables/NgencerfModels";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { useHindcastStore } from "@/stores/hindcast/HindcastStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { isValidDate } from '@/utils/CommonHelpers';
import { formatElapsedTime, formatDateForRunOnString } from '@/utils/TimeHelpers';

export const useVerificationStore = defineStore('VerificationStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const { 
    uiGageId,
    uiDomainName,
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

  const forecastStore = useForecastStore();
  const { 
    forecastJobId,
    selectedForecastJob,
    failureMessages,
    elapsedTime,
    submitTimeDate,
    submitTime
  } = storeToRefs(forecastStore);

  const hindcastStore = useHindcastStore();
  const { 
    hindcastJobId,
    selectedHindcastJob
  } = storeToRefs(hindcastStore);

  // refs
  const verificationJobId = ref<number>();
  const verificationJobs = ref<VerificationJob[]>([]);
  const verificationJobType = ref<string>('forecast');
  const selectedVerificationJob = ref<VerificationJob>();
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
  const verificationStatusCheckingInterval = ref<any>();
  const verificationRunningTimeInterval = ref<any>();
  const verificationPlotNames = ref<any>(); // TODO: create verificationPlotNames interface
  const verificationPlot = ref<any>(); // TODO: create verificationPlot interface

  /**
   * fetch get_verification_jobs
   * @return {void}
   */
  const getVerificationJobs = async (): Promise<any> => {
    verificationJobs.value = [];
    let requestBody = {
      verification_job_type: verificationJobType.value === 'hindcast' ? 'hindcast' : 'forecast',
      limit: verificationRunListPageSize.value,
      offset: (verificationRunListCurrentPage.value - 1) * verificationRunListPageSize.value,
      sort: {
        field: verificationRunListSort.value.field,
        direction: verificationRunListSort.value.direction === -1 ? 'desc' : 'asc'
      },
      filters: {
        domain_name: uiDomainName.value && uiDomainName.value !== "All" ? uiDomainName.value : "",
        gage_id: uiGageId.value && uiGageId.value !== "All" ? uiGageId.value: "",
        date_filter:
            (createdAtStart.value && createdAtEnd.value) ? {
              start_date: formatISOStringOrDateToYYYYMMDD(createdAtStart.value) + 'T00:00:00',
              end_date: formatISOStringOrDateToYYYYMMDD(createdAtEnd.value) + 'T23:59:59',
              operator: "between"
            } : createdAtStart.value ? {
              create_date: formatISOStringOrDateToYYYYMMDD(createdAtStart.value) + 'T00:00:00',
              operator: "after"
            } : createdAtEnd.value ? {
              create_date: formatISOStringOrDateToYYYYMMDD(createdAtEnd.value) + 'T23:59:59',
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
        status: statusTypeFilterList.value,
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
   * fetch list of gage IDs for verification runs
   * @return {void}
   */
  async function fetchVerificationGageList() {
    // only apply domain and archived filters
    let requestBody = {
      verification_job_type: verificationJobType.value === 'hindcast' ? 'hindcast' : 'forecast',
      domain_name: uiDomainName.value && uiDomainName.value !== "All" ? uiDomainName.value : "",
      include_archived: false
    }
    const gageListResult =
      await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/get_verification_gages/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
    
    if (gageListResult?._data?.gages) {
      return gageListResult._data.gages.sort();
    }
    return [];
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
          submitTimeDate.value = new Date(getVerificationStatusResponse._data.submit_date);
          submitTime.value = formatDateForRunOnString(getVerificationStatusResponse._data.submit_date);
        }

        if (['Submitted','Running'].includes(verificationJobStatus?.value)) {
          if (verificationStatusCheckingInterval.value) {
            clearInterval(verificationStatusCheckingInterval.value);
          }
          if (verificationRunningTimeInterval.value) {
            clearInterval(verificationRunningTimeInterval.value);
          }
          verificationStatusCheckingInterval.value = setInterval(loadVerificationStatusInformation, 10000);
          verificationRunningTimeInterval.value = setInterval(updateRunningTime, 1000);
        }

        // set elapsedTime
        if (getVerificationStatusResponse?._data?.elapsed_time) {
          elapsedTime.value = formatElapsedTime(getVerificationStatusResponse._data.elapsed_time);
        } else {
          updateRunningTime();
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
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_run_id: verificationJobId.value })
    });
  };

  const setSelectedVerificationJobId = async(verification_run_id: number): Promise<void> => {
    verificationJobId.value = verification_run_id;
    if (selectedVerificationJob?.value?.hindcast_run_id) {
      hindcastJobId.value = selectedVerificationJob.value.hindcast_run_id;
    } else if (selectedVerificationJob?.value?.forecast_run_id) {
      forecastJobId.value = selectedVerificationJob.value.forecast_run_id;
    }
  }

  const setSelectedVerificationRowData = async (verification_row_data: VerificationJob): Promise<void> => {
    setSelectedVerificationJobId(verification_row_data.verification_run_id);
    verificationJobStatus.value = (verification_row_data as VerificationJob).status;
  }

  const resetSelectedVerificationJobData = (): void => {
    // clear previously selected forecast/hindcast/verification jobs
    selectedForecastJob.value = undefined;
    forecastJobId.value = undefined;
    selectedHindcastJob.value = undefined;
    hindcastJobId.value = undefined;
    selectedVerificationJob.value = undefined;
    verificationJobId.value = undefined;
  }
  
  /**
   * Create and Run Verification Job
   */
  const createAndRunVerificationJob = (): Promise<any> => {
    let requestBody = {};
    if (selectedHindcastJob?.value) {
      requestBody.hindcast_run_id = selectedHindcastJob?.value?.hindcast_run_id;
    } else if (selectedForecastJob?.value) {
      requestBody.forecast_run_id = selectedForecastJob?.value?.forecast_run_id;
    }
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/create_and_run_verification_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  };
  
  const loadVerificationStatusInformation = async () => {
    getVerificationStatus().then( response => {
      if ( response._data.status ) {
        selectedVerificationJob.value = response._data;
        verificationJobStatus.value = response._data.status;
        failureMessages.value = response._data.failure_messages;
        if (response._data.submit_date) {
          submitTimeDate.value = new Date(response._data.submit_date);
          if (isValidDate(submitTimeDate.value)) {
            submitTime.value = formatDateForRunOnString(submitTimeDate.value);
          }
          if (!['Submitted','Running'].includes(verificationJobStatus?.value) ) {
            elapsedTime.value = response._data.elapsed_time ? formatElapsedTime(response._data.elapsed_time) : '';
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
    verificationJobId,
    verificationJobStatus,
    verificationStatusCheckingInterval,
    verificationRunningTimeInterval,
    verificationJobs,
    verificationJobType,
    verificationRunListPageSize,
    verificationRunListCurrentPage,
    verificationRunListTotalPages,
    verificationRunListTotalSize,
    verificationRunListStartRow,
    verificationRunListEndRow,
    verificationRunListSort,
    selectedVerificationJob,
    verificationDate,
    yamlConfigData,
    verificationPlotNames,
    verificationPlot,
    getVerificationJobs,
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
    deleteVerificationJob,
    fetchVerificationGageList
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