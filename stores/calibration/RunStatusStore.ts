// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import type { CalibrationStatus, CalibrationPlotListNamesData } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { isValidDate, isCalibrationJobFinished } from '~/utils/CommonHelpers';
import { convertTimeZone } from '~/utils/TimeHelpers';

export const useRunStatusStore = defineStore('RunStatusStore', () => {
  const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const { userCalibrationRunData } = storeToRefs(useUserDataStore());
  
  // refs
  const elapsedTime = ref();
  const startTimeDate = ref();
  const startTime = ref();

  const plotNames = ref();
  const plotList = ref<any[]>([]);
  const selectedPlotName = ref();
  const selectedPlotFilename = ref();
  const selectedPlotFileUrl = ref();
  const iteration = ref();

  const stopCriteria = ref();
  const stopCriteriaMet = ref(false);
  const elapsedTimeIntervalId = ref();
  const calibrationStatusIntervalId = ref();
  const validationsStatusIntervalId = ref();
  const allValidationsDone = ref(false);
  const resultsPathname = ref();

  /** 
   * Load RunStatusStore
   */
  const loadRunStatusStore = async (): Promise<void> => {
    // load stopCriteria, startTimeDate, and startTime from load_calibration_run
    stopCriteria.value = userCalibrationRunData?.value?.stop_criteria;

    if (isCalibrationJobFinished(userCalibrationRunData?.value?.status)) {
      startTimeDate.value = new Date(userCalibrationRunData.value?.run_date as string);
      if (isValidDate(startTimeDate.value)) {
        startTime.value = convertTimeZone(startTimeDate.value);
      }
    }

    // load elapsedTime, allValidationsDone from get_status. 
    // Calibration must be Done to get validations
    // Calibration and Validations must be Done to get completed elapsedTime
    const getStatusResponse = await queryGetCalibrationStatus();
    const validations = getStatusResponse?._data?.validations;
    // valid_control and valid_best are the only validations right?
    if (validations && validations.length === 2) {
      allValidationsDone.value = validations?.every((validation: any) => validation.status === 'Done');
      // get elapsed times from validations
      const elapsedTimes = validations
        .map((validation: any) => validation.elapsed_time)
        .filter((eTime: any) => eTime !== null && eTime !== undefined);

      // if there are elapsed times, get the max elapsed time
      // we will only have elapsed times if server is running on Parallel Works
      if (elapsedTimes.length > 0) {
        elapsedTime.value = Math.max(...elapsedTimes);
      }
    }

    // load plotNames and plotList from get_plot_names
    plotNames.value = await queryGetPlotNames();
    plotList.value = plotNames?.value?._data?.plot_names;

    // load iteration from get_iteration.
    const getIterationResponse = await queryGetIteration();
    iteration.value = getIterationResponse?._data?.iteration;

    // load resultsPathname from get_job_data_dir. Calibration must be Done, Running, or Failed to get resultsPathname
    const getJobDataDirectoryResponse = await queryGetJobDataDirectory();
    resultsPathname.value = getJobDataDirectoryResponse?._data?.data_dir;
  };

  /**
   * Get Calibration Status
   * @return {any}
   */
  const queryGetCalibrationStatus = async (): Promise<any> => {
    let apiCallBody: DynamicObject = {};
    if (evaluateValidationRunId.value) {
      apiCallBody['validation_run_id'] = evaluateValidationRunId.value;
    } else {
      apiCallBody['calibration_run_id'] = calibrationJobId.value;
    }
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(apiCallBody)
    });
  };

  /**
   * Get Calibration Plot Names
   * @return {any}
   */
  const queryGetPlotNames = async (): Promise<any> => {
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
  const queryGetPlot = async (plotName: string, include_data=false): Promise<any> => {
    let apiCallBody: DynamicObject = {plot_name: plotName, include_data: include_data};
    if (evaluateValidationRunId.value) {
      apiCallBody['validation_run_id'] = evaluateValidationRunId.value;
    } else {
      apiCallBody['calibration_run_id'] = calibrationJobId.value;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(apiCallBody)
    });
  };

  /**
   * Run Calibration
   * @return {any}
   */
  const runCalibrationJob = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/run_calibration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({calibration_run_id: calibrationJobId.value})
    });
  }

  /**
   * Get Calibration Iteration
   * @returns {any}
   */
  const queryGetIteration = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_iteration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({calibration_run_id: calibrationJobId.value})
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
      body: JSON.stringify({calibration_run_id: calibrationJobId.value})
    });
  };

  /**
   * Get Job Data Directory
   * @returns {any}
   */
  const queryGetJobDataDirectory = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_job_data_dir/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Hard Reset Run/Status Store
   */
  const hardResetRunStatusStore = (): void => {
    elapsedTime.value = "";
    startTimeDate.value = "";
    startTime.value = "";
    plotNames.value = "";
    plotList.value = [];
    selectedPlotName.value = "";
    selectedPlotFilename.value = "";
    selectedPlotFileUrl.value = "";
    iteration.value = undefined;
    stopCriteria.value = "";
    stopCriteriaMet.value = false;
    allValidationsDone.value = false;
    resultsPathname.value = undefined;

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

    console.log("RunStatusStore has been hard reset");
  };

  return {
    startTimeDate,
    startTime,
    elapsedTime,
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
    allValidationsDone,
    resultsPathname,
    loadRunStatusStore,
    queryGetCalibrationStatus,
    queryGetPlotNames,
    queryGetPlot,
    runCalibrationJob,
    queryGetIteration,
    queryGetJobDataDirectory,
    cancelCalibrationJob,
    hardResetRunStatusStore
  };
},
{
  persist: {
    storage: persistedState.localStorage
  },
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRunStatusStore, import.meta.hot));
}