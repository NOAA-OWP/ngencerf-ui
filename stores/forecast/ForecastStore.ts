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

function capitalCase(str: string) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const useForecastStore = defineStore('ForecastStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { 
    userCalibrationRunData, 
    uiGageId, 
    uiGageList, 
    createdAtStart,
    createdAtEnd,
    minCreatedAt,
    maxCreatedAt,
    jobIdStart,
    jobIdEnd,
    minJobId,
    maxJobId,
    statusTypeFilterList,
    ngenLogLevel, 
    forcingLogLevel, 
    logLevels
  } = storeToRefs(useUserDataStore());
  const {
    getAccessToken,
    fetchUserCalibrationRunData,
    clearUserCalibrationRunData } = useUserDataStore();
  const { calibrationJobId } = storeToRefs(generalStore());
  // refs
  const calibrationRunsForForecastListPageSize = ref<number>(50);
  const calibrationRunsForForecastListCurrentPage = ref<number>(1);
  const calibrationRunsForForecastListTotalPages = ref<number>(0);
  const calibrationRunsForForecastListTotalSize = ref<number>(0);
  const calibrationRunsForForecastListStartRow = ref<number>(1);
  const calibrationRunsForForecastListEndRow = ref<number>(calibrationRunsForForecastListPageSize.value);
  const calibrationRunsForForecastListSort = ref<DynamicObject>({'field': 'calibration_run_id', 'direction': -1});
  const forecastRunListPageSize = ref<number>(50);
  const forecastRunListCurrentPage = ref<number>(1);
  const forecastRunListTotalPages = ref<number>(0);
  const forecastRunListTotalSize = ref<number>(0);
  const forecastRunListStartRow = ref<number>(1);
  const forecastRunListEndRow = ref<number>(forecastRunListPageSize.value);
  const forecastRunListSort = ref<DynamicObject>({'field': 'forecast_run_id', 'direction': -1});
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

  const forecastRuns = ref<ForecastJob[]>([]);
  const selectedForecastJob = ref<ForecastJob>();

  const forecastJobNgenGlobalLogging = ref<boolean>(true);

  const logList = ref<any[]>([]);
  const logListDefault = ref<string>('Select an option');
  const logs = ref<APIResponse>({});
  const logDataPageSize = ref<number>(1000);
  const logLists = ref<DynamicObject>({});
  const logListOptions = ref<any[]>([]);
  const selectedLogCategory = ref<string>('');
  const selectedLogList = ref<any[]>([]);
  const selectedLogName = ref<string>('');
  const selectedLogDisplay = ref<string>('');
  const selectedLogTotalSize = ref<number>(0);
  const selectedLogCurrentPage = ref<number>(1);
  const selectedLogTotalPages = ref<number>(1);
  const selectedLogStartRow = ref<number>(1);
  const selectedLogEndRow = ref<number>(logDataPageSize.value);
  const selectedLogFilePath = ref<string>('');
  const selectedLogByteOffset = ref<number>(0);
  const selectedLogStatus = ref<DynamicObject>({});

  const isForecastLoading = ref<boolean>(false);
  
  let logTimeout;

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
    let requestBody = {
      limit: forecastRunListPageSize.value,
      offset: (forecastRunListCurrentPage.value - 1) * forecastRunListPageSize.value,
      sort: {
        field: forecastRunListSort.value.field.split(".").at(-1),
        direction: forecastRunListSort.value.direction === -1 ? 'desc' : 'asc'
      },
      filters: {
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
        status: statusTypeFilterList.value
      }
    }
    const runListDataResult = await makeProtectedApiCall<ForecastJobs>(`${ngencerfBaseUrl}/calibration/get_forecast_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    forecastRuns.value = runListDataResult?._data?.forecast_jobs ?? [];
    forecastRunListTotalSize.value = runListDataResult?._data?.total_count ?? 0;
    forecastRunListTotalPages.value = Math.ceil(forecastRunListTotalSize.value / forecastRunListPageSize.value);
    forecastRunListStartRow.value = (forecastRunListPageSize.value * (forecastRunListCurrentPage.value - 1)) + 1;
    forecastRunListEndRow.value = Math.min(forecastRunListStartRow.value + (forecastRunListPageSize.value - 1), forecastRunListTotalSize.value);
    
    if (forecastRuns.value && forecastRuns.value.length > 0) {
      forecastRuns.value.forEach((jobItem: ForecastJob) => {
        if (jobItem.cold_start?.cold_start_status && jobItem.cold_start.cold_start_status !== 'Done') {
          jobItem.forecast_status = 'Cold Start ' + jobItem.cold_start.cold_start_status;
        }
        if (jobItem.cold_start?.cold_start_submit_date && jobItem.cold_start.cold_start_submit_date !== '') {
          jobItem.submit_date = jobItem.cold_start.cold_start_submit_date;
        }
      });
    }
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
   * Load Forecast Run/Status tab data
   */
  const loadForecastRunStatusTabData = async (): Promise<string[]> => {
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

        // set forecastConfiguration, forecastJobStatus, elapsedTime, submitTime, and resultsPathname
        forecastConfigurationName.value = forecastJob?.configuration;
        forecastJobStatus.value = forecastJob?.status;
        coldStartJobStatus.value = forecastJob?.cold_start_run?.status;
        failureMessages.value = forecastJob?.failure_messages;

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
    const rawLogLevels = toRaw(logLevels.value);

    // transform module ref values to their actual values to be sent to the backend
    const serializedModules: Record<string, LogLevel> | undefined =
      Object.entries(rawLogLevels).reduce((acc, [key, val]) => {
        if (val && typeof val === 'object' && 'value' in val) {
          acc[key] = val.value;
        }
        return acc;
      }, {} as Record<string, LogLevel>);
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
        cold_start_date: coldStartDate ? formatISOStringOrDateToYYYYMMDDHHMM(coldStartDate) : null,
        logging_config: {
          logging_enabled: forecastJobNgenGlobalLogging.value,
          ...(serializedModules && {
            // add ngenLogLevel and forcingLogLevel to beginning of the object
            modules: {
              'ngen': ngenLogLevel.value,
              'forcing': forcingLogLevel.value,
              ...serializedModules
            }
          })
        },
      })
    });
  };

  /**
    * Get Forecast Log Names
    * @return {any}
    */
  const queryGetLogNames = async (forecast_run_id: number): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        forecast_run_id: forecast_run_id
      })
    });
  };

  /**
    * Get Forecast Log Data
    * @return {any}
    */
  const queryGetLogData = async (
    log_category: string,
    log_name: string,
    forecast_run_id: number,
    start?: number,
    limit?: number
  ): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        log_category: log_category,
        log_name: log_name,
        forecast_run_id: forecast_run_id,
        start: start !== undefined ? start : 0,
        limit: limit !== undefined ? limit : 1000
      })
    });
  };

  /** 
   * Get Forecast Log Status
   * @return {any}
   */
  const queryGetLogStatus = async (
    forecast_run_id: number,
    log_path: string,
    byte_offset: number
  ): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        forecast_run_id: forecast_run_id,
        log_path: log_path,
        byte_offset: byte_offset,
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
    let requestBody = {
      limit: calibrationRunsForForecastListPageSize.value,
      offset: (calibrationRunsForForecastListCurrentPage.value - 1) * calibrationRunsForForecastListPageSize.value,
      sort: {
        field: calibrationRunsForForecastListSort.value.field,
        direction: calibrationRunsForForecastListSort.value.direction === -1 ? 'desc' : 'asc'
      },
      filters: {
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
        include_archived: false
      },
      get_gages: uiGageList.value.length === 0
    }
    const runListDataResult = await makeProtectedApiCall<CalibrationRunsForForecast>(`${ngencerfBaseUrl}/calibration/get_calibration_jobs_for_forecast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    calibrationRunsForForecast.value = runListDataResult._data.jobs ?? [];
    calibrationRunsForForecastListTotalSize.value = runListDataResult?._data?.total_count ?? 0;
    calibrationRunsForForecastListTotalPages.value = Math.ceil(calibrationRunsForForecastListTotalSize.value / calibrationRunsForForecastListPageSize.value);
    calibrationRunsForForecastListStartRow.value = (calibrationRunsForForecastListPageSize.value * (calibrationRunsForForecastListCurrentPage.value - 1)) + 1;
    calibrationRunsForForecastListEndRow.value = Math.min(calibrationRunsForForecastListStartRow.value + (calibrationRunsForForecastListPageSize.value - 1), calibrationRunsForForecastListTotalSize.value);
    
    if (runListDataResult?._data?.gages) {
      uiGageList.value = runListDataResult?._data?.gages;
      uiGageList.value.sort();
    }
    if (runListDataResult?._data?.date_range && runListDataResult?._data?.date_range.length === 2) {
      minCreatedAt.value = runListDataResult?._data?.date_range[0];
      maxCreatedAt.value = runListDataResult?._data?.date_range[1];
    }
    if (runListDataResult?._data?.id_range && runListDataResult?._data?.id_range.length === 2) {
      minJobId.value = runListDataResult?._data?.id_range[0];
      maxJobId.value = runListDataResult?._data?.id_range[1];
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
    
    calibrationRunForForecast.value = (forecast_row_data as any as CalibrationRunForForecast);
    forecastJobStatus.value = (forecast_row_data as any as CalibrationRunForForecast).status;
    forecastConfigurationName.value = forecast_row_data.configuration;
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
   * populate log list options
   */
  const populateLogListOptions = async(plotListOptions: [] = []) => {
    if (forecastJobId.value && !['Submitted','Validating and Preparing Job Data'].includes(overallColdStartForecastStatus.value)) {
      logList.value = [];
      logList.value.push({ name: '', display_name: logListDefault.value });
      logListOptions.value = plotListOptions ?? [];

      nextTick(async () => {
        // Get Names of available Logs
        logs.value = await queryGetLogNames(forecastJobId.value);
        if (logs.value?._data?.log_names) {
          for (let l = 0; l < logs.value?._data?.log_names.length; l++) {
            Object.keys(logs.value?._data?.log_names[l]).forEach(key => {
              let logNameList = [];
              for (let n = 0; n < logs.value?._data?.log_names[l][key].length; n++) {
                logNameList.push({ 'name': logs.value?._data?.log_names[l][key][n] });
              }
              logLists.value[key] = logNameList;
            });
          }
        }
        
        // Add Log Options to the dropdown
        Object.keys(logLists.value).forEach(key => {
          logListOptions.value.push({ name: key, display_name: capitalCase(key) + ' Logs' });
        });
        for (const option of logListOptions.value) {
          if (!(logList.value.find(obj => obj.name === option.name))) {
            logList.value.push(option);
          }
        }

        if ((coldStartJobStatus.value == 'Failed' || forecastJobStatus.value == 'Failed') && logListOptions.value.length > 0) {
          // Skip directly to ngen log if status is Failed
          selectedLogCategory.value = (logListOptions.value.at(-1)).name;
          nextTick(async () => {
            if (selectedLogList.value.length > 1) {
                selectedLogName.value = selectedLogList.value.at(-1).name;
            }
          });
        } else if (!selectedLogCategory.value) {
          // Start with first option
          selectedLogCategory.value = logListOptions.value[0].name;
        }
      });
    }
  }

  // Reset refs when selectedLogName changes
  const resetUserLogRefs = (): void => {
    // log refs
    selectedLogCategory.value = '';
    selectedLogList.value = [];
    selectedLogName.value = '';
    selectedLogDisplay.value = '';
    selectedLogTotalSize.value = 0;
    selectedLogCurrentPage.value = 1;
    selectedLogTotalPages.value = 0;
    selectedLogStartRow.value = 1;
    selectedLogEndRow.value = logDataPageSize.value;
    selectedLogFilePath.value = '';
    selectedLogByteOffset.value = 0;
    selectedLogStatus.value = {};
    clearTimeout(logTimeout);
  }

  const updateLogRefs = async(getLogData: boolean) => {
    if (getLogData) {
      const response: any = await queryGetLogData(
        selectedLogCategory.value, // log_category
        selectedLogName.value, // log_name
        forecastJobId.value, // forecast_run_id
        overallColdStartForecastStatus.value === 'Done' ? 0 : -1, // start from first page if done, else last page
        logDataPageSize.value // limit
      );
      if (response?._data?.log_data) {
        let logText = '';
        for (let t = 0; t < response?._data.log_data.length; t++) {
          logText += response?._data.log_data[t] + '<br/>\n';
        }
        selectedLogDisplay.value = logText;
        selectedLogTotalSize.value = response?._data.pagination_metadata?.count;
        // only show one page for running jobs (this disables paging)
        selectedLogTotalPages.value = 
          (['Submitted','Running'].includes(coldStartJobStatus.value) || 
            ['Submitted','Running'].includes(forecastJobStatus.value)
          ) ? 1 : Math.ceil(selectedLogTotalSize.value / logDataPageSize.value);
        selectedLogEndRow.value = response?._data.pagination_metadata?.count;
        if (logDataPageSize.value < selectedLogTotalSize.value) {
          selectedLogStartRow.value = (selectedLogTotalSize.value - logDataPageSize.value) + 1;
        } else {
          selectedLogStartRow.value = 1;
        }
        selectedLogFilePath.value = response?._data.log_path;
        selectedLogByteOffset.value = response?._data?.byte_offset;
        if (document.getElementById('selectedLogDisplay')) {
          nextTick(async () => {
            document.getElementById('selectedLogDisplay').style.height = (Math.max((document.getElementById('MainLeftDataParent') as HTMLElement).getBoundingClientRect().bottom
            - (document.getElementById('selectedLogDisplay') as HTMLElement).getBoundingClientRect().top, 250) + 'px');
          });
        }
      } else {
        selectedLogDisplay.value = '';
        selectedLogFilePath.value = '';
      }
    }
    if ((coldStartJobStatus.value === 'Running' || forecastJobStatus.value === 'Running') && selectedLogFilePath.value) {
      // watch status every 10 seconds to see if log file changes
      clearTimeout(logTimeout);
      logTimeout = setTimeout(async() => {
        const status_response: any = await queryGetLogStatus(
          forecastJobId.value, // forecast_run_id
          selectedLogFilePath.value, // log_path
          selectedLogByteOffset.value // byte_offset
        )
        if (status_response._data) {
          selectedLogStatus.value = status_response._data;
        }
      }, 10000);
    }
  }

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

    forecastJobNgenGlobalLogging.value = true;
  };

  /**
   * reset job filters
   */
  const resetFilters = () => {
    uiGageId.value = 'All';
    statusTypeFilterList.value = [];
    createdAtStart.value = null;
    createdAtEnd.value = null;
    minCreatedAt.value = null;
    maxCreatedAt.value = null;
    jobIdStart.value = null;
    jobIdEnd.value = null;
    minJobId.value = null;
    maxJobId.value = null;
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
    calibrationRunsForForecastListPageSize,
    calibrationRunsForForecastListCurrentPage,
    calibrationRunsForForecastListTotalPages,
    calibrationRunsForForecastListTotalSize,
    calibrationRunsForForecastListStartRow,
    calibrationRunsForForecastListEndRow,
    calibrationRunsForForecastListSort,
    forecastRunListPageSize,
    forecastRunListCurrentPage,
    forecastRunListTotalPages,
    forecastRunListTotalSize,
    forecastRunListStartRow,
    forecastRunListEndRow,
    forecastRunListSort,
    forecastRuns,
    selectedForecastJob,
    isForecastLoading,
    overallColdStartForecastStatus,
    forecastJobNgenGlobalLogging,
    logList,
    logListDefault,
    logs,
    logDataPageSize,
    logLists,
    logListOptions,
    selectedLogCategory,
    selectedLogList,
    selectedLogName,
    selectedLogDisplay,
    selectedLogTotalSize,
    selectedLogCurrentPage,
    selectedLogTotalPages,
    selectedLogStartRow,
    selectedLogEndRow,
    selectedLogFilePath,
    selectedLogByteOffset,
    selectedLogStatus,
    getForecastJobs,
    loadForecastRunStatusTabData,
    loadForecastResultsTabData,
    loadForecastTab,
    createAndRunForecastJob,
    cancelForecastJob,
    queryGetLogNames,
    queryGetLogData,
    queryGetLogStatus,
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
    populateLogListOptions,
    resetUserLogRefs,
    updateLogRefs,
    hardResetForecastRunStatusStore,
    resetFilters
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