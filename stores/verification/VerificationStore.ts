import { defineStore, storeToRefs } from "pinia";
import { Duration } from "luxon";


import type { SelectOption, VerificationJob, VerificationJobs } from "@/composables/NgencerfModels";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";
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
  const { verificationSetupHasChanged } = storeToRefs(generalStore());

  // refs
  const forecastJobId = ref<number>();
  const forecastRunsForVerification = ref<ForecastJob[]>([]);
  const filteredForecastRunsForVerification = ref<ForecastJob[]>([]);
  
  const verificationJobId = ref<number>();
  const verificationJobs = ref<VerificationJob[]>([]);
  const filteredVerificationJobs = ref<VerificationJob[]>([]);
  const selectedVerificationJob = ref<VerificationJob>();
  const userVerificationJobData = ref<VerificationJob>();
  
  const verificationDate = ref<any>();
  const selectedVerificationYamlFile = ref<string | undefined>();
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
    const runListDataResult = await makeProtectedApiCall<ForecastJobs>(`${ngencerfBaseUrl}/calibration/get_forecast_jobs_for_verification/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });

    if (runListDataResult?._data?.forecast_jobs.length > 0) {
      runListDataResult?._data?.forecast_jobs.forEach((jobItem: ForecastJob) => {
        forecastRunsForVerification.value.push(jobItem);
      });
      // maintain an original forecastRuns so we can revert to it when we clear the Forecast Runs filter
      filteredForecastRunsForVerification.value = [...forecastRunsForVerification.value];
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
    const runListDataResult = await makeProtectedApiCall<VerificationJobs>(`${ngencerfBaseUrl}/calibration/get_verification_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });

    if (runListDataResult?._data?.verification_jobs.length > 0) {
      runListDataResult?._data?.verification_jobs.forEach((jobItem: VerificationJob) => {
        if (jobItem.forecast_run_id) {
          jobItem.data_source = 'ngen'
        } else {
          jobItem.data_source = 'nwm'
        }
        verificationJobs.value.push(jobItem);
      });
      // maintain an original verificationJobs so we can revert to it when we clear the Verification Runs filter
      filteredVerificationJobs.value = [...verificationJobs.value];
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
   * Call get_status endpoint with selectedVerificationJob.value.verification_job_id
   * @return {any}
   */
  const getVerificationStatus = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_verification_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_job_id: selectedVerificationJob.value?.verification_job_id })
    });
  };
  
  /**
   * Load Selected Verification Run
   */
  const loadSelectedVerificationJob = async (verification_job_id: number): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/load_verification_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_job_id: verification_job_id })
    });
  };

  const setSelectedVerificationJobId = async(verification_job_id: number): Promise<void> => {
    verificationJobId.value = verification_job_id;
    let response = await loadSelectedVerificationJob(verificationJobId.value);
    userVerificationJobData.value = response._data;
  }

  const setSelectedVerificationRowData = async (verification_row_data: VerificationJob): Promise<void> => {
    setSelectedVerificationJobId(verification_row_data.verification_job_id);
    verificationJobStatus.value = (verification_row_data as VerificationJob).status;
  }

  const resetSelectedVerificationJobData = (): void => {
    verificationJobId.value = undefined;
    selectedVerificationJob.value = undefined;
    userVerificationJobData.value = undefined;
  }

  /**
 * return a new verification run id generated from the server
 * @returns {CreatedVerificationJob}
 */
  async function fetchNewVerificationJobId() {
    let requestBody = {};
    if (selectedForecastJob?.value?.forecast_run_id) {
      requestBody = {forecast_run_id: selectedForecastJob.value.forecast_run_id};
    }
    return await makeProtectedApiCall<CreatedVerificationJob>(`${ngencerfBaseUrl}/calibration/create_verification_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  }

  /**
   * return saving verification setup tab response from the server
   * @returns {GeneralApiSaveResponse | GeneralErrorResponse}
   */
  async function saveVerificationSetupData() {
    const saveVerificationSetupResponse =
      await makeProtectedApiCall<GeneralApiSaveResponse | GeneralErrorResponse>(
        `${ngencerfBaseUrl}/calibration/save_verification_setup/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            'verification_job_id': verificationJobId.value,
            'verification_yaml_file_path': selectedVerificationYamlFile.value
          }),
        }
      );
    return saveVerificationSetupResponse;
  }

  /**
   * Run Verification Job
   */
  const runVerificationJob = async (verificationJobId: number): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/run_verification/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_job_id: verificationJobId })
    });
  };

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
      body: JSON.stringify({ verification_job_id: verificationJobId.value })
    });
  };
  
  /**
   * Get Verification Plot Names
   */
  const getVerificationPlotNames = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_job_id: verificationJobId.value })
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
      verification_job_id: verificationJobId.value ? verificationJobId.value.toString() : ''
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
      body: JSON.stringify({ verification_job_id: runId })
    });
  };

  /**
   * Run Verification Job
   */
  const runVerificationJob = async (verificationJobId: number): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/run_verification/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_job_id: verificationJobId })
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
            loadSelectedVerificationJob(selectedVerificationJob.value?.verification_job_id);
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
      body: JSON.stringify({ verification_job_id: verificationJobId.value })
    });
  };
  
  /**
   * Get Verification Plot Names
   */
  const getVerificationPlotNames = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ verification_job_id: verificationJobId.value })
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
      verification_job_id: verificationJobId.value ? verificationJobId.value.toString() : ''
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
      body: JSON.stringify({ verification_job_id: runId })
    });
  };

  /**
   * Compute resultsPathname based on userCalibrationRunData.value.job_data_dir
   */
  const resultsPathname = computed<string>(() => {
    if (userVerificationJobData?.value?.job_data_dir) {
      return userVerificationJobData.value.job_data_dir;
    } else {
      return "";
    }
  });


  return {
    forecastJobId,
    forecastRunsForVerification,
    filteredForecastRunsForVerification,
    verificationJobId,
    verificationJobStatus,
    failureMessages,
    elapsedTime,
    submitTimeDate,
    submitTime,
    verificationStatusCheckingInterval,
    verificationRunningTimeInterval,
    verificationJobs,
    filteredVerificationJobs,
    selectedVerificationJob,
    userVerificationJobData,
    verificationDate,
    selectedVerificationYamlFile,
    yamlConfigData,
    resultsPathname,
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
    saveVerificationSetupData,
    runVerificationJob,
    cancelVerificationJob,
    updateRunningTime,
    getVerificationStatus,
    loadVerificationStatusInformation,
    setSelectedVerificationJobId,
    resetSelectedVerificationJobData,
    setSelectedVerificationRowData,
    fetchNewVerificationJobId,
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