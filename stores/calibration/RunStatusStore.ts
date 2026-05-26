// @ts-check

import { defineStore, storeToRefs } from "pinia";

import type {
  CalibrationStatus,
  CalibrationPlotListNamesData,
  BestIterationData,
  LogLevel
} from "@/composables/NgencerfModels";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import {
  isValidDate,
  isCalibrationJobFinished,
  getValidControlAndValidBestStatus
} from '@/utils/CommonHelpers';
import { formatDateForRunOnString } from '@/utils/TimeHelpers';

export const useRunStatusStore = defineStore('RunStatusStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const {
    userCalibrationRunData,
    calibrationJobNgenGlobalLogging,
    calibrationJobLogFileMode,
    ngenLogLevel,
    forcingLogLevel,
    logLevels,
  } = storeToRefs(useUserDataStore());

  // refs
  const calibrationElapsedTime = ref<string>();
  const submitTimeDate = ref<Date>();
  const submitTime = ref<string>();

  const plotNames = ref({});
  const plotList = ref<any[]>([]);
  const selectedPlotName = ref<string | null>(null);
  const selectedPlotFilename = ref<string | null>(null);
  const selectedPlotFileUrl = ref<string | null>(null);
  const iteration = ref<number>();

  const stopCriteria = ref<number>();
  const stopCriteriaMet = ref<boolean>(false);
  const elapsedTimeIntervalId = ref<number>();
  const calibrationStatusIntervalId = ref<number>();
  const validationsStatusIntervalId = ref<number>();
  const validationControlStatus = ref<string>();
  const validationBestStatus = ref<string>();
  const validControlAndValidBestStatus = ref<string>();
  const validationBestAchieved = ref<BestIterationData>({ iteration: 0, isBest: false });
  const failureMessages = ref<any>();

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
   * Compute Overall Calibration Validation Status
   */
  const overallCalibrationValidationStatus = computed<string>(() => {
    if (userCalibrationRunData?.value?.status === 'Validating and Preparing Job Data') {
      return userCalibrationRunData.value.status;
    } else if (userCalibrationRunData?.value?.status !== 'Done') {
      return `Calibration ${userCalibrationRunData?.value?.status}`;
    } else if (userCalibrationRunData?.value?.status === 'Done' && validationControlStatus?.value === 'Running') {
      return `Calibration Done, Validation Control Running`;
    } else if (userCalibrationRunData?.value?.status === 'Done' && validationBestStatus?.value === 'Running') {
      return `Calibration Done, Validation Best Running`;
    } else if (
      userCalibrationRunData?.value.status === 'Done' &&
      validationControlStatus?.value === 'Done' &&
      validationBestStatus?.value === 'Done'
    ) {
      return 'Done';
    } else if (userCalibrationRunData.value.status === 'Done' && validControlAndValidBestStatus?.value) {
      return `Calibration Done, Validation ${validControlAndValidBestStatus.value}`;
    }
    return '';
  });

  /** 
  * Load RunStatusStore
  */
  const loadRunStatusStore = async (): Promise<void> => {
    // load stopCriteria, submitTimeDate, and submitTime from load_calibration_run
    stopCriteria.value = userCalibrationRunData?.value?.stop_criteria;

    if (isCalibrationJobFinished(userCalibrationRunData?.value?.status)) {
      submitTimeDate.value = new Date(userCalibrationRunData.value?.submit_date as string);
      if (isValidDate(submitTimeDate.value)) {
        submitTime.value = formatDateForRunOnString(submitTimeDate.value);
      }
    }

    // load validControlAndValidBestStatus and calibrationElapsedTime from queryGetCalibrationStatus
    // Calibration must be Done to get validations
    // Calibration and Validations must be Done and run on Parallel Works to get completed calibrationElapsedTime
    const getStatusResponse = await queryGetCalibrationStatus(calibrationJobId.value);
    const validations = getStatusResponse?._data?.validations;
    const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
    const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');

    if (validControl?.status) {
      validationControlStatus.value = validControl.status;
    }
    if (validBest?.status) {
      validationBestStatus.value = validBest.status;
    }
    if (validationControlStatus?.value && validationBestStatus?.value) {
      validControlAndValidBestStatus.value = getValidControlAndValidBestStatus(validationControlStatus.value, validationBestStatus.value);
    }

    // load plotNames and plotList from get_plot_names
    plotNames.value = await queryGetPlotNames();
    plotList.value = ((plotNames?.value as any)?._data as PlotNames)?.plot_names;

    // load iteration from get_iteration.
    const getIterationResponse = await queryGetIteration();
    iteration.value = getIterationResponse?._data?.iteration;
  };

  /**
   * Get Calibration Status
   * @return {any}
   */
  const queryGetCalibrationStatus = async (calibrationJobId: number): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId })
    });
  };

  /**
   * Get Calibration Plot Names
   * @return {any}
   */
  const queryGetPlotNames = async (): Promise<any> => {
    if (!calibrationJobId.value) {
      return null;
    }
    return makeProtectedApiCall<CalibrationPlotListNamesData>(`${ngencerfBaseUrl}/calibration/get_plot_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Get Calibration Plot
   * @return {any}
   */
  const queryGetPlot = async (
    plotName: string,
    include_data: boolean = false,
    force_include_plot: boolean = true,
    calibration_run_id: number = calibrationJobId.value,
    validation_run_id: number = 0,
    start?: number,
    limit?: number
  ): Promise<any> => {
    const params = new URLSearchParams({
      plot_name: plotName,
      include_data: include_data.toString(),
      force_include_plot: force_include_plot.toString()
    });
    if (validation_run_id > 0) {
      params.set('validation_run_id', validation_run_id.toString());
    } else {
      params.set('calibration_run_id', calibration_run_id.toString());
    }
    if (include_data) {
      params.set('start', start !== undefined ? start : 0);
      params.set('limit', limit !== undefined ? limit : 100);
    }

    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot/?${params.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      }
    });
  };

  /**
   * Run Calibration
   * @return {any}
   * NOTE: outside CalibrationJobStore, access logLevels WITH .value
   * when a reactive property is imported into a different file,
   * it becomes a ref object, so you need to access the value with .value
   * https://vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive
   */
  const runCalibrationJob = async (): Promise<any> => {
    const rawLogLevels = toRaw(logLevels.value);

    // transform module ref values to their actual values to be sent to the backend
    const serializedModules: Record<string, LogLevel> | undefined =
      Object.entries(rawLogLevels).reduce((acc, [key, val]) => {
        if (val && typeof val === 'object' && 'value' in val) {
          acc[key] = val.value;
        }
        return acc;
      }, {} as Record<string, LogLevel>);

    // store the payload body
    const bodyData: {
      calibration_run_id: number;
      logging_config?: {
        logging_enabled?: boolean;
        modules?: Record<string, LogLevel>;
        split_logs_by_module?: boolean;
      }
    } = {
      calibration_run_id: calibrationJobId.value,
      ...(calibrationJobNgenGlobalLogging.value !== undefined && {
        logging_config: {
          logging_enabled: calibrationJobNgenGlobalLogging.value,
          split_logs_by_module: calibrationJobLogFileMode.value,
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
    };

    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/run_calibration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(bodyData),
    });
  }

  /**
   * Get Calibration Iteration
   * @returns {any}
   */
  const queryGetIteration = async (): Promise<any> => {
    if (!calibrationJobId.value) {
      return null;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_iteration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Cancel Calibration Job
   * @returns {any}
   */
  const cancelCalibrationJob = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Cancel Validation Job
   * @returns {any}
   */
  const cancelValidationJob = async (validation_run_id: number): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ validation_run_id: validation_run_id })
    });
  };
  
  /**
    * Get Calibration Log Names
    * @return {any}
    */
  const queryGetLogNames = async (calibration_run_id: number): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        calibration_run_id: calibration_run_id
      })
    });
  };

  /**
    * Get Calibration Log Data
    * @return {any}
    */
  const queryGetLogData = async (
    log_name: string,
    calibration_run_id: number,
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
        log_name: log_name,
        calibration_run_id: calibration_run_id,
        start: start !== undefined ? start : 0,
        limit: limit !== undefined ? limit : 1000
      })
    });
  };

  /** 
   * Get Calibration Log Status
   * @return {any}
   */
  const queryGetLogStatus = async (
    calibration_run_id: number,
    log_name: string,
    byte_offset: number
  ): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        calibration_run_id: calibration_run_id,
        log_name: log_name,
        byte_offset: byte_offset,
      })
    });
  };

  /**
   * Hard Reset Run/Status Store
   */
  const hardResetRunStatusStore = (): void => {
    calibrationElapsedTime.value = "";
    submitTimeDate.value = undefined;
    submitTime.value = "";
    plotNames.value = {};
    plotList.value = [];
    selectedPlotName.value = null;
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    iteration.value = undefined;
    stopCriteria.value = undefined;
    stopCriteriaMet.value = false;
    validControlAndValidBestStatus.value = undefined;
    validationBestAchieved.value = { iteration: 0, isBest: false };

    if (elapsedTimeIntervalId.value) {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }

    if (calibrationStatusIntervalId.value) {
      clearInterval(calibrationStatusIntervalId.value);
      calibrationStatusIntervalId.value = undefined;
    }

    if (validationsStatusIntervalId.value) {
      clearInterval(validationsStatusIntervalId.value);
      validationsStatusIntervalId.value = undefined;
    }
  };

  return {
    submitTimeDate,
    submitTime,
    calibrationElapsedTime,
    plotNames,
    plotList,
    selectedPlotName,
    selectedPlotFilename,
    selectedPlotFileUrl,
    iteration,
    stopCriteria,
    stopCriteriaMet,
    elapsedTimeIntervalId,
    calibrationStatusIntervalId,
    validationsStatusIntervalId,
    validationControlStatus,
    validationBestStatus,
    validControlAndValidBestStatus,
    resultsPathname,
    overallCalibrationValidationStatus,
    validationBestAchieved,
    failureMessages,
    loadRunStatusStore,
    getValidControlAndValidBestStatus,
    queryGetCalibrationStatus,
    queryGetPlotNames,
    queryGetPlot,
    runCalibrationJob,
    queryGetIteration,
    cancelCalibrationJob,
    cancelValidationJob,
    queryGetLogNames,
    queryGetLogData,
    queryGetLogStatus,
    hardResetRunStatusStore
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRunStatusStore, import.meta.hot));
}