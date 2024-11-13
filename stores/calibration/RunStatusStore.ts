// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import type { CalibrationStatus, CalibrationPlotListNamesData } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import type { i } from "vitest/dist/reporters-yx5ZTtEV.js";

export const useRunStatusStore = defineStore('RunStatusStore', () => {
  const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  
  // refs
  const runningTime = ref();
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
  const runningTimeIntervalId = ref();
  const calibrationStatusIntervalId = ref();
  const validationsStatusIntervalId = ref();
  const allValidationsDone = ref(false);

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
  const executeRunCalibration = async (): Promise<any> => {
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
  const queryIteration = async (): Promise<any> => {
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
   * Hard Reset Run/Status Store
   */
  const hardResetRunStatusStore = (): void => {
    runningTime.value = "";
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

    if (runningTimeIntervalId.value) {
      clearInterval(runningTimeIntervalId.value);
      runningTimeIntervalId.value = '';
    }

    if (calibrationStatusIntervalId.value) {
      clearInterval(calibrationStatusIntervalId.value);
      calibrationStatusIntervalId.value = '';
    }

    if (validationsStatusIntervalId.value) {
      clearInterval(validationsStatusIntervalId.value);
      validationsStatusIntervalId.value = '';
    }

    console.log("RunStatusStore has been hard reset");
  };

  return {
    startTimeDate,
    startTime,
    runningTime,
    plotNames,
    plotList,
    selectedPlotName,
    selectedPlotFilename,
    selectedPlotFileUrl,
    iteration,
    stopCriteria,
    stopCriteriaMet,
    runningTimeIntervalId,
    calibrationStatusIntervalId,
    validationsStatusIntervalId,
    allValidationsDone,
    queryGetCalibrationStatus,
    queryGetPlotNames,
    queryGetPlot,
    executeRunCalibration,
    queryIteration,
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