import { defineStore, storeToRefs } from "pinia";
import { Duration } from "luxon";


import type { SelectOption, CalibrationRunForForecast, CalibrationRunsForForecast, ForecastCycle, ForecastJob, ForecastJobs } from "@/composables/NgencerfModels";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { isValidDate } from '@/utils/CommonHelpers';
import { formatElapsedTime, convertTimeZone } from '@/utils/TimeHelpers';

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
  const forecastCycles = ref<ForecastCycle[]>();
  const forecastCycle = ref<ForecastCycle>();
  const forecastCycleName = ref<string>();
  const forecastJobStatus = ref<string>();
  const forcingDownloadStatus = ref<string>();
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
   * Compute Overall Forcing Download and Forecast status
   */
  const overallForcingDownloadForecastStatus = computed<string>(() => {
    if (
      [
        "Submitted",
        "Saved",
        "Ready",
        "Running",
        "Cancelled",
        "Failed",
        "Server error",
      ].includes(forcingDownloadStatus.value as string)
    ) {
      return `Forcing Download ${forcingDownloadStatus.value as string}`;
    } else if (forcingDownloadStatus.value === "Done") {
      if (
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
        return `Forcing Download Done, Forecast ${forecastJobStatus.value as string}`;
      } else if (forecastJobStatus.value === "Done") {
        return "Done";
      } else {
        return "Unknown";
      }
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
    forecastCycles.value = loadForecastTabResponse?._data?.forecast_cycle_values;
  };

  /**
   * Load Forecast Run/Status tab data
   */
  const loadForecastStatusRunTabData = async (): Promise<string[]> => {
    let errorMessages: string[] = [];
    // get forecast job data
    if (forecastJobId?.value) {
      // query get_status endpoint
      const getStatusResponse: any = await getStatus();

      if (getStatusResponse.status === 200) {
        // TODO: create forecastJob interface
        const forecastJob: any = getStatusResponse?._data?.forecasts.find((forecast: any) => forecast.forecast_run_id === forecastJobId.value);

        if (!forecastJob) {
          return ['No forecast job found'];
        }

        // set forecastCycle, forecastJobStatus, elapsedTime, submitTime, and resultsPathname
        forecastCycleName.value = forecastJob?.cycle;
        forecastJobStatus.value = forecastJob?.status;
        forcingDownloadStatus.value = forecastJob?.forcing_download?.status;
        // set elapsedTime
        setElapsedTime(forecastJob);

        if (forecastJob?.submit_date) {
          submitTimeDate.value = new Date(forecastJob?.submit_date as string);
          if (isValidDate(submitTimeDate.value)) {
            submitTime.value = convertTimeZone(submitTimeDate.value);
          } else {
            errorMessages.push(`Invalid submit date: ${forecastJob?.submit_date}`);
          }
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
    if (forecastJob?.forcing_download?.elapsed_time) {
      if (forecastJob?.elapsed_time) {
        const elapsedTimeArray: string[] = [];
        elapsedTimeArray.push(forecastJob?.forcing_download?.elapsed_time);
        elapsedTimeArray.push(forecastJob?.elapsed_time);

        // sume and format forecast and forcing download elapsed times
        elapsedTime.value = sumAndFormatElapsedTimes(elapsedTimeArray);
      } else {
        // format the forcing download elapsed time to a string in 'hh:mm:ss' or 'd 'Days,' hh:mm:ss' format
        elapsedTime.value = formatElapsedTime(forecastJob?.forcing_download?.elapsed_time);
      }
    }

  };

  /**
   * Load Forecast Results tab data
   */
  const loadForecastResultsTabData = async (): Promise<string[]> => {
    const errorMessages: string[] = [];

    // load forecast Run/Status tab data
    const loadForecastErrors: string[] = await loadForecastStatusRunTabData();
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
      }
    });
  };

  /**
   * Create and Run Forecast Job by querying create_and_run_forecast endpoint
   */
  const createAndRunForecastJob = async (calibrationRunId: number, forecastCycleName: string): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/create_and_run_forecast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationRunId, cycle_name: forecastCycleName })
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
   * Query get_calibration_jobs_for_forecast endpoint
   */
  const getCalibrationJobsForForecast = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationRunsForForecast>(`${ngencerfBaseUrl}/calibration/get_calibration_jobs_for_forecast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: ""
    }).then((result) => {
      calibrationRunsForForecast.value = result._data.jobs;
    });
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
   * Get Forecast Plots
   */
  const getForecastPlotNames = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ forecast_run_id: forecastJobId.value })
    });
  };

  /**
   * Get Forecast Plot
   */
  const getForecastPlot = async ({
    plotName,
    include_data = false,
    force_include_plot = false,
  }: {
    plotName: string;
    include_data?: boolean;
    force_include_plot?: boolean;
  }): Promise<any> => {
    if (forecastJobId.value) {
      const params = new URLSearchParams({
        plot_name: plotName,
        include_data: include_data.toString(),
        force_include_plot: force_include_plot.toString(),
        forecast_run_id: forecastJobId.value.toString(),
      });

      return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot/?${params.toString()}`, {
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

    /// load forecastCycles
    await loadSetupForecastTabData();

    forecastCycle.value = forecastCycles.value?.find((forecast_cycle_data: ForecastCycle) =>
      forecast_cycle_data.name === forecast_row_data.cycle
    );

    /*
     * the follow is hack to get around the fact that we are using calibrationRunForForecast to check for calibration_run_id, but it's only set on calibration run tab
     * user should be able to go straight to forecast runs and view results so this is a easy way to provide it.
     */
    calibrationRunForForecast.value = (forecast_row_data as any as CalibrationRunForForecast);
    forecastJobStatus.value = (forecast_row_data as any as CalibrationRunForForecast).status;
  }

  const resetSelectedForecastRunData = (): void => {
    forecastJobId.value = undefined;
    forecastJobStatus.value = undefined;
    forecastCycle.value = undefined;
    resetSelectedCalibrationRunId();
  }

  /**
   * Set forecastPlot
   */
  const setForecastPlot = async (): Promise<string[]> => {
    if (forecastJobId?.value) {
      const getForecastPlotNamesResponse: any = await getForecastPlotNames();

      // set forecastPlotNamesList
      if (getForecastPlotNamesResponse.status === 200) {
        if (getForecastPlotNamesResponse?._data?.plot_names) {
          const forecastPlotNamesList: any[] = getForecastPlotNamesResponse._data.plot_names;

          // there should only be one forecast plot
          if (forecastPlotNamesList.length === 1) {
            forecastPlotName.value = forecastPlotNamesList[0];
            const getForecastPlotResponse: any = await getForecastPlot({
              plotName: (forecastPlotName?.value?.name as string),
              include_data: true,
              force_include_plot: true
            });

            if (getForecastPlotResponse.status === 200) {
              forecastPlot.value = getForecastPlotResponse._data;
              return [];
            } else {
              return useApiErrorResponsePreprocess(getForecastPlotResponse);
            }
          } else {
            return [`${forecastPlotNamesList.length} forecast plots found. Only one forecast plot is expected.`];
          }
        } else {
          return ['Could not get forecast plot names from get_plot_names endpoint'];
        }
      } else {
        return useApiErrorResponsePreprocess(getForecastPlotNamesResponse);
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
    forecastCycles.value = [];
    forecastCycle.value = undefined;
    forecastCycleName.value = undefined;
    forecastJobStatus.value = undefined;
    forcingDownloadStatus.value = undefined;
    elapsedTime.value = undefined;
    submitTimeDate.value = undefined;
    submitTime.value = undefined;
    forecastPlotName.value = undefined;
    forecastPlot.value = undefined;
    calibrationRunForForecast.value = undefined;

    if (elapsedTimeIntervalId.value) {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }

    if (forecastJobStatusIntervalId.value) {
      clearInterval(forecastJobStatusIntervalId.value);
      forecastJobStatusIntervalId.value = undefined;
    }
    isForecastLoading.value = false;

    clearUserCalibrationRunData();
  }


  return {
    forecastJobId,
    forecastCycles,
    forecastCycle,
    forecastCycleName,
    forecastJobStatus,
    forcingDownloadStatus,
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
    overallForcingDownloadForecastStatus,
    getForecastJobs,
    loadSetupForecastTabData,
    loadForecastStatusRunTabData,
    loadForecastResultsTabData,
    loadForecastTab,
    createAndRunForecastJob,
    cancelForecastJob,
    getCalibrationJobsForForecast,
    resetUserSelectedForecastCalibrationRun,
    loadSelectedCalibrationRun,
    setSelectedCalibrationRunId,
    resetSelectedCalibrationRunId,
    setForecastPlot,
    setElapsedTime,
    getStatus,
    getForecastPlotNames,
    getForecastPlot,
    setSelectedForecastRunId,
    resetSelectedForecastRunData,
    setSelectedForecastRowData
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