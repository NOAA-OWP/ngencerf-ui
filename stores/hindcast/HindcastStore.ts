import { defineStore, storeToRefs } from "pinia";
import { DateTime, Duration } from "luxon";


import type { SelectOption, CalibrationRunForHindcast, CalibrationRunsForHindcast, HindcastConfiguration, HindcastJob, HindcastJobs } from "@/composables/NgencerfModels";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { isValidDate } from '@/utils/CommonHelpers';
import { formatElapsedTime, formatDateForRunOnString } from '@/utils/TimeHelpers';

export const useHindcastStore = defineStore('HindcastStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { 
    userCalibrationRunData, 
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
  const calibrationRunsForHindcastListPageSize = ref<number>(50);
  const calibrationRunsForHindcastListCurrentPage = ref<number>(1);
  const calibrationRunsForHindcastListTotalPages = ref<number>(0);
  const calibrationRunsForHindcastListTotalSize = ref<number>(0);
  const calibrationRunsForHindcastListStartRow = ref<number>(1);
  const calibrationRunsForHindcastListEndRow = ref<number>(calibrationRunsForHindcastListPageSize.value);
  const calibrationRunsForHindcastListSort = ref<DynamicObject>({'field': 'calibration_run_id', 'direction': -1});
  const hindcastRunListPageSize = ref<number>(50);
  const hindcastRunListCurrentPage = ref<number>(1);
  const hindcastRunListTotalPages = ref<number>(0);
  const hindcastRunListTotalSize = ref<number>(0);
  const hindcastRunListStartRow = ref<number>(1);
  const hindcastRunListEndRow = ref<number>(hindcastRunListPageSize.value);
  const hindcastRunListSort = ref<DynamicObject>({'field': 'hindcast_run_id', 'direction': -1});
  const hindcastJobId = ref<number>();
  const cycleDate = ref<any>();
  const coldStartDate = ref<any>();
  const hindcastConfigurations = ref<HindcastConfiguration[]>();
  const hindcastConfiguration = ref<HindcastConfiguration>();
  const hindcastConfigurationName = ref<string>();
  const coldStartRunsForHindcast = ref<ColdStartRun[]>();
  const coldStartJobId = ref<number>();
  const intervalCycle = ref<number>();
  const numIterations = ref<number>();
  const hindcastJobStatus = ref<string>();
  const coldStartJobStatus = ref<string>();
  const failureMessages = ref<any>();;
  const elapsedTime = ref<string>();
  const submitTimeDate = ref<Date>();
  const submitTime = ref<string>();
  const elapsedTimeIntervalId = ref<number>();
  const hindcastJobStatusIntervalId = ref<number>();
  const hindcastPlotName = ref<any>(); // TODO: create hindcastPlotName interface
  const hindcastPlot = ref<any>(); // TODO: create hindcastPlot interface

  const calibrationRunsForHindcast = ref<calibrationRunsForHindcast>([]);
  const calibrationRunForHindcast = ref<calibrationRunForHindcast>();

  const hindcastRuns = ref<HindcastJob[]>([]);
  const SelectedHindcastJob = ref<HindcastJob>();

  const hindcastJobNgenGlobalLogging = ref<boolean>(true);
  const hindcastJobLogFileMode = ref<boolean>(false);
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
   * Compute Overall Cold Start and Hindcast status
   */
  const overallColdStartHindcastStatus = computed<string>(() => {
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
      ].includes(hindcastJobStatus.value as string)
    ) {
      if (coldStartJobStatus.value === "Done") {
        return `Cold Start Done, Hindcast ${hindcastJobStatus.value as string}`;
      } else {
        return hindcastJobStatus.value as string;
      }
    } else if (hindcastJobStatus.value === "Done") {
      return "Done";
    } else {
      return "Unknown";
    }
  });

  /**
   * fetch get_hindcast_jobs
   * @return {void}
   */
  const getHindcastJobs = async (): Promise<any> => {
    hindcastRuns.value = [];
    let requestBody = {
      limit: hindcastRunListPageSize.value,
      offset: (hindcastRunListCurrentPage.value - 1) * hindcastRunListPageSize.value,
      sort: {
        field: hindcastRunListSort.value.field.split(".").at(-1),
        direction: hindcastRunListSort.value.direction === -1 ? 'desc' : 'asc'
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
    const runListDataResult = await makeProtectedApiCall<HindcastJobs>(`${ngencerfBaseUrl}/calibration/get_hindcast_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    hindcastRuns.value = runListDataResult?._data?.hindcast_jobs ?? [];
    hindcastRunListTotalSize.value = runListDataResult?._data?.total_count ?? 0;
    hindcastRunListTotalPages.value = Math.ceil(hindcastRunListTotalSize.value / hindcastRunListPageSize.value);
    hindcastRunListStartRow.value = (hindcastRunListPageSize.value * (hindcastRunListCurrentPage.value - 1)) + 1;
    hindcastRunListEndRow.value = Math.min(hindcastRunListStartRow.value + (hindcastRunListPageSize.value - 1), hindcastRunListTotalSize.value);
    
    if (hindcastRuns.value && hindcastRuns.value.length > 0) {
      hindcastRuns.value.forEach((jobItem: HindcastJob) => {
        if (jobItem.cold_start?.cold_start_status && jobItem.cold_start.cold_start_status !== 'Done') {
          jobItem.hindcast_status = 'Cold Start ' + jobItem.cold_start.cold_start_status;
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
  const hindcastRunGageList = computed(() => {
    let gageOptionList = <SelectOption[]>[];
    gageOptionList.push({
      'name': "All",
      'description': "All"
    });
    calibrationRunsForHindcast.value.forEach(runItem => {
      const checkGageIndex = gageOptionList.findIndex(
        (gageOption) =>
          gageOption.name === (runItem as any as calibrationRunForHindcast).gage_id
      ) !== -1;
      if (!checkGageIndex) {
        gageOptionList.push({
          'name': (runItem as any as calibrationRunForHindcast).gage_id,
          'description': (runItem as any as calibrationRunForHindcast).gage_id
        });
      }
    });
    return gageOptionList;
  });

  /**
   * Load Hindcast Run/Status tab data
   */
  const loadHindcastRunStatusTabData = async (): Promise<string[]> => {
    let errorMessages: string[] = [];
    // get hindcast job data
    if (hindcastJobId?.value) {
      // query get_status endpoint
      const getStatusResponse: any = await getStatus();

      if (getStatusResponse.status === 200) {
        // set hindcastConfiguration, hindcastJobStatus, elapsedTime, submitTime, and resultsPathname
        hindcastConfigurationName.value = getStatusResponse?._data?.configuration;
        hindcastJobStatus.value = getStatusResponse?._data?.status;
        coldStartJobStatus.value = getStatusResponse?._data?.cold_start_run?.status;
        failureMessages.value = getStatusResponse?._data?.failure_messages;

        if (getStatusResponse?._data?.cold_start_run?.submit_date) {
          submitTimeDate.value = new Date(getStatusResponse?._data?.cold_start_run.submit_date as string);
        } else if (getStatusResponse?._data?.submit_date) {
          submitTimeDate.value = new Date(getStatusResponse?._data?.submit_date as string);
        }
        if (isValidDate(submitTimeDate.value)) {
          submitTime.value = formatDateForRunOnString(submitTimeDate.value);
          if (overallColdStartHindcastStatus.value === 'Done' && getStatusResponse?._data?.run_end) {
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
  const setElapsedTime = (hindcastJob: any): void => {
    const elapsedTimeArray: string[] = [];

    if (hindcastJob?.cold_start_run?.elapsed_time) {
      elapsedTimeArray.push(hindcastJob?.cold_start_run?.elapsed_time);
    }
    if (hindcastJob?.elapsed_time) {
      elapsedTimeArray.push(hindcastJob?.elapsed_time);
    }
    
    // sum and format hindcast and cold start elapsed times
    elapsedTime.value = sumAndFormatElapsedTimes(elapsedTimeArray);
  };

  /**
   * Load Hindcast Results tab data
   */
  const loadHindcastResultsTabData = async (): Promise<string[]> => {
    const errorMessages: string[] = [];

    // load Hindcast Run/Status tab data
    const loadHindcastErrors: string[] = await loadHindcastRunStatusTabData();
    if (loadHindcastErrors.length > 0) {
      errorMessages.push(...loadHindcastErrors);
    }
    const sethindcastPlotErrors: string[] = await sethindcastPlot() // set hindcastPlot
    if (sethindcastPlotErrors.length > 0) {
      errorMessages.push(...sethindcastPlotErrors);
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
  const loadHindcastTab = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/load_forecast_tab/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ 
        calibration_run_id: calibrationRunForHindcast?.value?.calibration_run_id,
        hindcast_only: true 
      })
    });
  };

  /**
   * Query get_cold_start_jobs_for_configuration endpoint
   */
  const getColdStartJobsForConfiguration = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_cold_start_jobs_for_configuration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ 
        configuration_name: hindcastConfiguration?.value?.name
      })
    });
  };

  /**
   * Create and Run Hindcast Job by querying create_and_run_hindcast endpoint
   */
  const createAndRunHindcastJob = async (
    calibrationRunId: number, 
    hindcastConfigurationName: string,
    cycleDate: DateTime,
    coldStartDate: DateTime | null,
    coldStartJobId: number | null,
    intervalCycle: number,
    numIterations: number
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
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/create_and_run_hindcast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        calibration_run_id: calibrationRunId, 
        configuration_name: hindcastConfigurationName,
        cycle_date: cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) : null,
        cold_start_date: (!coldStartJobId && coldStartDate) ? formatISOStringOrDateToYYYYMMDDHHMM(coldStartDate) : null,
        cold_start_run_id: coldStartJobId ?? null,
        interval_cycle: intervalCycle,
        num_iterations: numIterations,
        logging_config: {
          logging_enabled: hindcastJobNgenGlobalLogging.value,
          split_logs_by_module: hindcastJobLogFileMode.value,
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
   * Cancel Hindcast Job by querying cancel_job endpoint
   */
  const cancelHindcastJob = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ hindcast_run_id: hindcastJobId.value })
    });
  };

  /**
  * Delete a job
  * If a single job comes in, make sure we put it into an array.
  * Otherwise, it is an array.
  */
  async function deleteHindcastJob(runId: number) {
    return await makeProtectedApiCall<HindcastJob>(`${ngencerfBaseUrl}/calibration/delete_hindcast_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ hindcast_run_id: runId })
    });
  };

  /**
   * Query get_calibration_jobs_for_hindcast endpoint
   */
  const getCalibrationJobsForHindcast = async (): Promise<any> => {
    calibrationRunsForHindcast.value = [];
    let requestBody = {
      limit: calibrationRunsForHindcastListPageSize.value,
      offset: (calibrationRunsForHindcastListCurrentPage.value - 1) * calibrationRunsForHindcastListPageSize.value,
      sort: {
        field: calibrationRunsForHindcastListSort.value.field,
        direction: calibrationRunsForHindcastListSort.value.direction === -1 ? 'desc' : 'asc'
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
    const runListDataResult = await makeProtectedApiCall<calibrationRunsForHindcast>(`${ngencerfBaseUrl}/calibration/get_calibration_jobs_for_forecast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    calibrationRunsForHindcast.value = runListDataResult._data.jobs ?? [];
    calibrationRunsForHindcastListTotalSize.value = runListDataResult?._data?.total_count ?? 0;
    calibrationRunsForHindcastListTotalPages.value = Math.ceil(calibrationRunsForHindcastListTotalSize.value / calibrationRunsForHindcastListPageSize.value);
    calibrationRunsForHindcastListStartRow.value = (calibrationRunsForHindcastListPageSize.value * (calibrationRunsForHindcastListCurrentPage.value - 1)) + 1;
    calibrationRunsForHindcastListEndRow.value = Math.min(calibrationRunsForHindcastListStartRow.value + (calibrationRunsForHindcastListPageSize.value - 1), calibrationRunsForHindcastListTotalSize.value);
    
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
   * fetch list of gage IDs for hindcast runs
   * @return {void}
   */
  async function fetchHindcastGageList() {
    // only apply domain and archived filters
    let requestBody = {
      domain_name: uiDomainName.value && uiDomainName.value !== "All" ? uiDomainName.value : "",
      include_archived: false
    }
    const gageListResult =
      await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/get_hindcast_gages/`,
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
   * Call get_status endpoint with calibrationRunForHindcast.value.calibration_run_id
   * @return {any}
   */
  const getStatus = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ hindcast_run_id: hindcastJobId.value })
    });
  };

  /**
   * Get Hindcast Plot
   */
  const getHindcastPlot = async (): Promise<any> => {
    if (hindcastJobId.value) {
      const params = new URLSearchParams({
        hindcast_run_id: hindcastJobId.value.toString(),
      });

      return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_hindcast_timeseries_data/?${params.toString()}`, {
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

  const setSelectedHindcastRunId = (hindcast_job_id: number): void => {
    hindcastJobId.value = hindcast_job_id;
  }

  const setSelectedHindcastRowData = async (hindcast_row_data: HindcastJob): Promise<void> => {
    setSelectedHindcastRunId(hindcast_row_data.hindcast_run_id);
    setSelectedCalibrationRunId(hindcast_row_data.calibration_run_id);
    
    calibrationRunForHindcast.value = (hindcast_row_data as any as calibrationRunForHindcast);
    hindcastJobStatus.value = (hindcast_row_data as any as calibrationRunForHindcast).status;
    hindcastConfigurationName.value = hindcast_row_data.configuration;
  }

  const resetSelectedHindcastRunData = (): void => {
    hindcastJobId.value = undefined;
    hindcastJobStatus.value = undefined;
    hindcastConfiguration.value = undefined;
    resetSelectedCalibrationRunId();
  }

  /**
   * Set hindcastPlot
   */
  const sethindcastPlot = async (): Promise<string[]> => {
    if (hindcastJobId?.value) {
      const getHindcastPlotResponse: any = await getHindcastPlot();

      if (getHindcastPlotResponse.status === 200) {
        hindcastPlot.value = getHindcastPlotResponse._data;
        return [];
      } else {
        return useApiErrorResponsePreprocess(getHindcastPlotResponse);
      }
    } else {
      return ['No hindcast job id found'];
    }
  };

  /**
   * reset user-selected hindcast data
   */
  const resetUserSelectedHindcastCalibrationRun = (): void => {
    hindcastJobId.value = undefined;
    cycleDate.value = undefined;
    coldStartDate.value = undefined;
    hindcastConfigurations.value = [];
    hindcastConfiguration.value = undefined;
    hindcastConfigurationName.value = undefined;
    hindcastJobStatus.value = undefined;
    coldStartJobStatus.value = undefined;
    failureMessages.value = undefined;
    elapsedTime.value = undefined;
    submitTimeDate.value = undefined;
    submitTime.value = undefined;
    hindcastPlotName.value = undefined;
    hindcastPlot.value = undefined;
    calibrationRunForHindcast.value = undefined;

    clearInterval(elapsedTimeIntervalId.value);
    elapsedTimeIntervalId.value = undefined;
    clearInterval(hindcastJobStatusIntervalId.value);
    hindcastJobStatusIntervalId.value = undefined;

    clearUserCalibrationRunData();
  }

  /**
   * Hard Reset Hindcast Store
   */
  const hardResetHindcastStore = (): void => {
    hindcastJobId.value = undefined;
    coldStartDate.value = undefined;
    cycleDate.value = undefined;
    coldStartJobId.value = undefined;
    intervalCycle.value = undefined;
    numIterations.value = undefined;
    hindcastJobStatus.value = "";
    coldStartJobStatus.value = "";
    elapsedTime.value = undefined;
    submitTime.value = undefined;

    if (elapsedTimeIntervalId.value) {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }

    if (hindcastJobStatusIntervalId.value) {
      clearInterval(hindcastJobStatusIntervalId.value);
      hindcastJobStatusIntervalId.value = undefined;
    }

    hindcastJobNgenGlobalLogging.value = true;
    hindcastJobLogFileMode.value = false;
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
    hindcastJobId,
    cycleDate,
    coldStartDate,
    hindcastConfigurations,
    hindcastConfiguration,
    hindcastConfigurationName,
    coldStartRunsForHindcast,
    coldStartJobId,
    intervalCycle,
    numIterations,
    hindcastJobStatus,
    coldStartJobStatus,
    failureMessages,
    elapsedTime,
    submitTimeDate,
    submitTime,
    elapsedTimeIntervalId,
    hindcastJobStatusIntervalId,
    resultsPathname,
    hindcastPlotName,
    hindcastPlot,
    hindcastRunGageList,
    calibrationRunsForHindcast,
    calibrationRunForHindcast,
    calibrationRunsForHindcastListPageSize,
    calibrationRunsForHindcastListCurrentPage,
    calibrationRunsForHindcastListTotalPages,
    calibrationRunsForHindcastListTotalSize,
    calibrationRunsForHindcastListStartRow,
    calibrationRunsForHindcastListEndRow,
    calibrationRunsForHindcastListSort,
    hindcastRunListPageSize,
    hindcastRunListCurrentPage,
    hindcastRunListTotalPages,
    hindcastRunListTotalSize,
    hindcastRunListStartRow,
    hindcastRunListEndRow,
    hindcastRunListSort,
    hindcastRuns,
    SelectedHindcastJob,
    overallColdStartHindcastStatus,
    hindcastJobNgenGlobalLogging,
    hindcastJobLogFileMode,
    getHindcastJobs,
    loadHindcastRunStatusTabData,
    loadHindcastResultsTabData,
    loadHindcastTab,
    getColdStartJobsForConfiguration,
    createAndRunHindcastJob,
    cancelHindcastJob,
    deleteHindcastJob,
    getCalibrationJobsForHindcast,
    resetUserSelectedHindcastCalibrationRun,
    loadSelectedCalibrationRun,
    setSelectedCalibrationRunId,
    resetSelectedCalibrationRunId,
    sethindcastPlot,
    setElapsedTime,
    getStatus,
    getHindcastPlot,
    setSelectedHindcastRunId,
    resetSelectedHindcastRunData,
    setSelectedHindcastRowData,
    hardResetHindcastStore,
    resetFilters,
    fetchGageList,
    fetchHindcastGageList
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHindcastStore, import.meta.hot));
}