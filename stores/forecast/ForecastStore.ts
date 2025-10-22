import { defineStore, storeToRefs } from "pinia";
import { DateTime, Duration } from "luxon";


import type { SelectOption, CalibrationRunForForecast, CalibrationRunsForForecast, ForecastConfiguration, ForecastJob, ForecastJobs } from "@/composables/NgencerfModels";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { isValidDate } from '@/utils/CommonHelpers';
import { formatElapsedTime, formatDateForRunOnString } from '@/utils/TimeHelpers';

export const useForecastStore = defineStore('ForecastStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { userCalibrationRunData } = storeToRefs(useUserDataStore());
  const {
    getAccessToken,
    fetchUserCalibrationRunData,
    clearUserCalibrationRunData } = useUserDataStore();
  const { calibrationJobId } = storeToRefs(generalStore());
  // refs
  const forecastJobId = ref<number>();
  const cycleDate = ref<any>();
  const coldStartDate = ref<any>();
  const forecastConfigurations = ref<ForecastConfiguration[]>();
  const forecastConfiguration = ref<ForecastConfiguration>();
  const forecastConfigurationName = ref<string>();
  const forecastJobStatus = ref<string>();
  const coldStartJobStatus = ref<string>();
  const failureMessages = ref<any>();;
  const elapsedTime = ref<string>();
  const submitTimeDate = ref<Date>();
  const submitTime = ref<string>();
  const elapsedTimeIntervalId = ref<number>();
  const forecastJobStatusIntervalId = ref<number>();
  const forecastPlotName = ref<any>(); // TODO: create forecastPlotName interface
  const forecastPlot = ref<any>(); // TODO: create forecastPlot interface

  const calibrationRunsForForecast = ref<CalibrationRunsForForecast>([]);
  const calibrationRunForForecast = ref<CalibrationRunForForecast>();

  const uiGageId = ref<string>("");

  const forecastRuns = ref<ForecastJob[]>([]);
  const filteredForecastRuns = ref<ForecastJob[]>([]);
  const selectedForecastJob = ref<ForecastJob>();

  const isForecastLoading = ref<boolean>(false);

  /**
   * Compute resultsPathname based on userCalibrationRunData.value.job_data_dir
   */
  const resultsPathname = computed<string>(() => {
    if (userCalibrationRunData?.value?.job_data_dir) {
      return userCalibrationRunData.value.job_data_dir;
    } else {
      return "";
    }
  });

  /**
   * Compute Overall Cold Start and Forecast status
   */
  const overallColdStartForecastStatus = computed<string>(() => {
    if (
      [
        "Submitted",
        "Saved",
        "Ready",
        "Running",
        "Cancelled",
        "Failed",
        "Server error",
      ].includes(coldStartJobStatus.value as string)
    ) {
      return `Cold Start ${coldStartJobStatus.value as string}`;
    } else if (
      [
        "Submitted",
        "Saved",
        "Ready",
        "Running",
        "Cancelled",
        "Failed",
        "Server error",
      ].includes(forecastJobStatus.value as string)
    ) {
      if (coldStartJobStatus.value === "Done") {
        return `Cold Start Done, Forecast ${forecastJobStatus.value as string}`;
      } else {
        return forecastJobStatus.value as string;
      }
    } else if (forecastJobStatus.value === "Done") {
      return "Done";
    } else {
      return "Unknown";
    }
  });

  /**
   * fetch get_forecast_jobs
   * @return {void}
   */
  const getForecastJobs = async (): Promise<any> => {
    forecastRuns.value = [];
    const runListDataResult = await makeProtectedApiCall<ForecastJobs>(`${ngencerfBaseUrl}/calibration/get_forecast_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });

    if (runListDataResult?._data?.forecast_jobs.length > 0) {
      runListDataResult?._data?.forecast_jobs.forEach((jobItem: ForecastJob) => {
        if (jobItem.cold_start?.cold_start_status && jobItem.cold_start.cold_start_status !== 'Done') {
          jobItem.forecast_status = 'Cold Start ' + jobItem.cold_start.cold_start_status;
        }
        if (jobItem.cold_start?.cold_start_submit_date && jobItem.cold_start.cold_start_submit_date !== '') {
          jobItem.submit_date = jobItem.cold_start.cold_start_submit_date;
        }
        forecastRuns.value.push(jobItem);
      });
      // maintain an original forecastRuns so we can revert to it when we clear the Forecast Runs filter
      filteredForecastRuns.value = [...forecastRuns.value];
    }
  }

  /**
  * @returns {SelectOption[]}
  */
  const forecastRunGageList = computed(() => {
    let gageOptionList = <SelectOption[]>[];
    gageOptionList.push({
      'name': "All",
      'description': "All"
    });
    calibrationRunsForForecast.value.forEach(runItem => {
      const checkGageIndex = gageOptionList.findIndex(
        (gageOption) =>
          gageOption.name === (runItem as any as CalibrationRunForForecast).gage_id
      ) !== -1;
      if (!checkGageIndex) {
        gageOptionList.push({
          'name': (runItem as any as CalibrationRunForForecast).gage_id,
          'description': (runItem as any as CalibrationRunForForecast).gage_id
        });
      }
    });
    return gageOptionList;
  });

  /**
   * Load Setup Forecast Tab data
   */
  const loadSetupForecastTabData = async (): Promise<void> => {
    // load forecast cycles
    const loadForecastTabResponse: any = await loadForecastTab();
    forecastConfigurations.value = loadForecastTabResponse?._data?.forecast_configuration_values;
  };

  /**
   * Load Forecast Run/Status tab data
   */
  const loadForecastRunStatusTabData = async (): Promise<string[]> => {
    let errorMessages: string[] = [];
    // get forecast job data
    if (forecastJobId?.value) {
      // query get_status endpoint
      const getStatusResponse: any = await getStatus();

      if (getStatusResponse.status === 200) {
        failureMessages.value = getStatusResponse?._data?.failure_messages;

        // TODO: create forecastJob interface
        const forecastJob: any = getStatusResponse?._data?.forecasts.find((forecast: any) => forecast.forecast_run_id === forecastJobId.value);
        
        if (!forecastJob) {
          return ['No forecast job found'];
        }

        // set forecastConfiguration, forecastJobStatus, elapsedTime, submitTime, and resultsPathname
        forecastConfigurationName.value = forecastJob?.configuration;
        forecastJobStatus.value = forecastJob?.status;
        coldStartJobStatus.value = forecastJob?.cold_start_run?.status;

        if (forecastJob?.cold_start_run?.submit_date) {
          submitTimeDate.value = new Date(forecastJob?.cold_start_run.submit_date as string);
        } else if (forecastJob?.submit_date) {
          submitTimeDate.value = new Date(forecastJob?.submit_date as string);
        }
        if (isValidDate(submitTimeDate.value)) {
          submitTime.value = formatDateForRunOnString(submitTimeDate.value);
        } else {
          errorMessages.push(`Invalid submit date: ${forecastJob?.submit_date}`);
        }
        
        if (forecastJob?.cold_start_run?.elapsed_time || forecastJob?.elapsed_time) {
          // set elapsedTime
          setElapsedTime(forecastJob);
        }
      } else {
        return useApiErrorResponsePreprocess(getStatusResponse);
      }
    }
    return errorMessages;
  };

  /**
   * Set elapsedTime
   */
  const setElapsedTime = (forecastJob: any): void => {
    const elapsedTimeArray: string[] = [];

    if (forecastJob?.cold_start_run?.elapsed_time) {
      elapsedTimeArray.push(forecastJob?.cold_start_run?.elapsed_time);
    }
    if (forecastJob?.elapsed_time) {
      elapsedTimeArray.push(forecastJob?.elapsed_time);
    }
    
    // sum and format forecast and cold start elapsed times
    elapsedTime.value = sumAndFormatElapsedTimes(elapsedTimeArray);
  };

  /**
   * Load Forecast Results tab data
   */
  const loadForecastResultsTabData = async (): Promise<string[]> => {
    const errorMessages: string[] = [];

    // load forecast Run/Status tab data
    const loadForecastErrors: string[] = await loadForecastRunStatusTabData();
    if (loadForecastErrors.length > 0) {
      errorMessages.push(...loadForecastErrors);
    }
    const setForecastPlotErrors: string[] = await setForecastPlot() // set forecastPlot
    if (setForecastPlotErrors.length > 0) {
      errorMessages.push(...setForecastPlotErrors);
    }
    if (errorMessages.length > 0) {
      return errorMessages;
    } else {
      return [];
    }
  };

  /**
   * Query load_forecast_tab endpoint
   */
  const loadForecastTab = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/load_forecast_tab/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationRunForForecast?.value?.calibration_run_id })
    });
  };

  /**
   * Create and Run Forecast Job by querying create_and_run_forecast endpoint
   */
  const createAndRunForecastJob = async (
    calibrationRunId: number, 
    forecastConfigurationName: string,
    cycleDate: DateTime,
    coldStartDate: DateTime | null
  ): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/create_and_run_forecast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        calibration_run_id: calibrationRunId, 
        configuration_name: forecastConfigurationName,
        cycle_date: cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) : null,
        cold_start_date: coldStartDate ? formatISOStringOrDateToYYYYMMDDHHMM(coldStartDate) : null
      })
    });
  };

  /**
   * Cancel Forecast Job by querying cancel_job endpoint
   */
  const cancelForecastJob = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ forecast_run_id: forecastJobId.value })
    });
  };

  /**
  * Delete a job
  * If a single job comes in, make sure we put it into an array.
  * Otherwise, it is an array.
  */
  async function deleteForecastJob(runId: number) {
    return await makeProtectedApiCall<ForecastJob>(`${ngencerfBaseUrl}/calibration/delete_forecast_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ forecast_run_id: runId })
    });
  };

  /**
   * Query get_calibration_jobs_for_forecast endpoint
   */
  const getCalibrationJobsForForecast = async (): Promise<any> => {
    calibrationRunsForForecast.value = [];
    const runListDataResult = await makeProtectedApiCall<CalibrationRunsForForecast>(`${ngencerfBaseUrl}/calibration/get_calibration_jobs_for_forecast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: ""
    });

    if (runListDataResult?._data?.jobs.length > 0) {
      runListDataResult?._data?.jobs.forEach((runItem: ValidatedCalibrationRunListItem) => {
        calibrationRunsForForecast.value.push(runItem);
      });
    }
  };

  /**
   * Call get_status endpoint with calibrationRunForForecast.value.calibration_run_id
   * @return {any}
   */
  const getStatus = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationRunForForecast.value?.calibration_run_id })
    });
  };

  /**
   * Get Forecast Plot
   */
  const getForecastPlot = async (): Promise<any> => {
    if (forecastJobId.value) {
      const params = new URLSearchParams({
        forecast_run_id: forecastJobId.value.toString(),
      });

      return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_forecast_timeseries_data/?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        }
      });
    }
  };

  const loadSelectedCalibrationRun = async (calibration_run_id: number) => {
    setSelectedCalibrationRunId(calibration_run_id);
    await fetchUserCalibrationRunData();
  }

  const setSelectedCalibrationRunId = (calibration_run_id: number): void => {
    calibrationJobId.value = calibration_run_id;
  }

  const resetSelectedCalibrationRunId = (): void => {
    calibrationJobId.value = 0;
  }

  const setSelectedForecastRunId = (forecast_job_id: number): void => {
    forecastJobId.value = forecast_job_id;
  }

  const setSelectedForecastRowData = async (forecast_row_data: ForecastJob): Promise<void> => {
    setSelectedForecastRunId(forecast_row_data.forecast_run_id);
    setSelectedCalibrationRunId(forecast_row_data.calibration_run_id);
    loadSelectedCalibrationRun(forecast_row_data.calibration_run_id);
    
    calibrationRunForForecast.value = (forecast_row_data as any as CalibrationRunForForecast);
    forecastJobStatus.value = (forecast_row_data as any as CalibrationRunForForecast).status;

    // load forecastConfigurations
    await loadSetupForecastTabData();

    forecastConfiguration.value = forecastConfigurations.value?.find((forecast_configuration_data: ForecastConfiguration) =>
      forecast_configuration_data.name === forecast_row_data.configuration
    );
  }

  const resetSelectedForecastRunData = (): void => {
    forecastJobId.value = undefined;
    forecastJobStatus.value = undefined;
    forecastConfiguration.value = undefined;
    resetSelectedCalibrationRunId();
  }

  /**
   * Set forecastPlot
   */
  const setForecastPlot = async (): Promise<string[]> => {
    if (forecastJobId?.value) {
      const getForecastPlotResponse: any = await getForecastPlot();

      if (getForecastPlotResponse.status === 200) {
        forecastPlot.value = getForecastPlotResponse._data;
        return [];
      } else {
        return useApiErrorResponsePreprocess(getForecastPlotResponse);
      }
    } else {
      return ['No forecast job id found'];
    }
  };


  /**
   * reset user-selected forecast data
   */
  const resetUserSelectedForecastCalibrationRun = (): void => {
    forecastJobId.value = undefined;
    cycleDate.value = undefined;
    coldStartDate.value = undefined;
    forecastConfigurations.value = [];
    forecastConfiguration.value = undefined;
    forecastConfigurationName.value = undefined;
    forecastJobStatus.value = undefined;
    coldStartJobStatus.value = undefined;
    failureMessages.value = undefined;
    elapsedTime.value = undefined;
    submitTimeDate.value = undefined;
    submitTime.value = undefined;
    forecastPlotName.value = undefined;
    forecastPlot.value = undefined;
    calibrationRunForForecast.value = undefined;

    clearInterval(elapsedTimeIntervalId.value);
    elapsedTimeIntervalId.value = undefined;
    clearInterval(forecastJobStatusIntervalId.value);
    forecastJobStatusIntervalId.value = undefined;
    
    isForecastLoading.value = false;

    clearUserCalibrationRunData();
  }

  /**
   * Hard Reset Run/Status Store
   */
  const hardResetForecastRunStatusStore = (): void => {
    forecastJobStatus.value = "";
    coldStartJobStatus.value = "";
    elapsedTime.value = undefined;
    submitTime.value = undefined;

    if (elapsedTimeIntervalId.value) {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }

    if (forecastJobStatusIntervalId.value) {
      clearInterval(forecastJobStatusIntervalId.value);
      forecastJobStatusIntervalId.value = undefined;
    }
  };

  return {
    forecastJobId,
    cycleDate,
    coldStartDate,
    forecastConfigurations,
    forecastConfiguration,
    forecastConfigurationName,
    forecastJobStatus,
    coldStartJobStatus,
    failureMessages,
    elapsedTime,
    submitTimeDate,
    submitTime,
    elapsedTimeIntervalId,
    forecastJobStatusIntervalId,
    resultsPathname,
    forecastPlotName,
    forecastPlot,
    forecastRunGageList,
    calibrationRunsForForecast,
    calibrationRunForForecast,
    uiGageId,
    forecastRuns,
    filteredForecastRuns,
    selectedForecastJob,
    isForecastLoading,
    overallColdStartForecastStatus,
    getForecastJobs,
    loadSetupForecastTabData,
    loadForecastRunStatusTabData,
    loadForecastResultsTabData,
    loadForecastTab,
    createAndRunForecastJob,
    cancelForecastJob,
    deleteForecastJob,
    getCalibrationJobsForForecast,
    resetUserSelectedForecastCalibrationRun,
    loadSelectedCalibrationRun,
    setSelectedCalibrationRunId,
    resetSelectedCalibrationRunId,
    setForecastPlot,
    setElapsedTime,
    getStatus,
    getForecastPlot,
    setSelectedForecastRunId,
    resetSelectedForecastRunData,
    setSelectedForecastRowData,
    hardResetForecastRunStatusStore
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useForecastStore, import.meta.hot));
}