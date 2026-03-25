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
  const { 
    userCalibrationRunData, 
    uiGageId, 
    uiGageList, 
    uiDomainName,
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
  const forecastJobLogFileMode = ref<boolean>(false);

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
        // set forecastConfiguration, forecastJobStatus, elapsedTime, submitTime, and resultsPathname
        forecastConfigurationName.value = getStatusResponse?._data?.configuration;
        forecastJobStatus.value = getStatusResponse?._data?.status;
        coldStartJobStatus.value = getStatusResponse?._data?.cold_start_run?.status;
        failureMessages.value = getStatusResponse?._data?.failure_messages;

        if (getStatusResponse?._data?.cold_start_run?.submit_date) {
          submitTimeDate.value = new Date(getStatusResponse?._data?.cold_start_run.submit_date as string);
        } else if (getStatusResponse?._data?.submit_date) {
          submitTimeDate.value = new Date(getStatusResponse?._data?.submit_date as string);
        }
        if (isValidDate(submitTimeDate.value)) {
          submitTime.value = formatDateForRunOnString(submitTimeDate.value);
          if (overallColdStartForecastStatus.value === 'Done' && getStatusResponse?._data?.run_end) {
            elapsedTime.value = calculateElapsedTime(submitTimeDate.value as Date, new Date(getStatusResponse._data.run_end as string));
          }
        } else {
          errorMessages.push(`Invalid submit date: ${getStatusResponse?._data?.submit_date}`);
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
          split_logs_by_module: forecastJobLogFileMode.value,
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
        include_archived: false
      }
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
   * fetch list of gage IDs for calibration runs
   * @return {void}
   */
  async function fetchGageList() {
    // only apply domain and archived filters
    let requestBody = {
      domain_name: uiDomainName.value && uiDomainName.value !== "All" ? uiDomainName.value : "",
      include_archived: false
    }
    const gageListResult =
      await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/get_calibration_gages_for_forecast/`,
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
   * fetch list of gage IDs for forecast runs
   * @return {void}
   */
  async function fetchForecastGageList() {
    // only apply domain and archived filters
    let requestBody = {
      domain_name: uiDomainName.value && uiDomainName.value !== "All" ? uiDomainName.value : "",
      include_archived: false
    }
    const gageListResult =
      await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/get_forecast_gages/`,
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
      body: JSON.stringify({ forecast_run_id: forecastJobId.value })
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
    forecastJobLogFileMode.value = false;
  };

  /**
   * reset job filters
   */
  const resetFilters = () => {
    uiDomainName.value = 'All';
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
    overallColdStartForecastStatus,
    forecastJobNgenGlobalLogging,
    forecastJobLogFileMode,
    getForecastJobs,
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
    hardResetForecastRunStatusStore,
    resetFilters,
    fetchGageList,
    fetchForecastGageList
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