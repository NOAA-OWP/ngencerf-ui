// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import type { CalibrationIsReadyResponse, CalibrationPlotListNamesData } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";

export const useRunStatusStore = defineStore('RunStatusStore', () => {
  /**
   * default ref section
   */
  const { calibrationJobId } = storeToRefs(generalStore())
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore()
  const userDataStore = useUserDataStore()
  /**
   * ref ui user input
   */
  const data_loading = ref<boolean>(true)
  const calibrationIsReady = ref<boolean>(false)
  const calibrationStatus = ref<string>();
  const runningTime = ref();
  const startTimeDate = ref();
  const startTime = ref();

  /**
   * Check if Calibration is in 'Ready' state
   * @return {any}
   */
  const queryCalibrationIsReady = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationIsReadyResponse>(`${ngencerfBaseUrl}/calibration/is_ready/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
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

  const executeRunCalibration = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/run_calibration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  }

  const queryIteration = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_iteration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

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

  return {
    calibrationIsReady,
    calibrationStatus,
    runningTime,
    startTimeDate,
    startTime,
    queryCalibrationIsReady,
    queryGetPlotNames,
    executeRunCalibration,
    queryIteration,
    cancelCalibrationJob,
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