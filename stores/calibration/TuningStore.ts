// @ts-check

import { defineStore } from "pinia";
import type { CalibrationTimes, ModuleParameter, LoadTuningTabResponse, OutputVariable, SaveTuningTabRequestBody } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { useUserDataStore } from "@/stores/common/UserDataStore";


export const useTuningStore = defineStore('TuningStore', () => {
  // server-data properties
  const loadCalibrationRunData = ref<any>(); // TODO: update to use LoadCalbrationRunData type
  const loadTuningTabData = ref<any>(); // TODO: update to use LoadTuningTabResponse type
  // const saveTuningTabData = ref<SaveTuningTabRequestBody>()

  // track if data has been fetched already
  const isDataFetched = ref(false);

  // user-data properties
  const userCalibrationTimes = ref<any>();
  const userCalibrationTuningParameters = ref<any[]>();
  const userOuptutVariableToCalibrate = ref<any[]>();

  const { ngencerfBaseUrl } = useBackendConfig();
  const userDataStore = useUserDataStore();

  /**
   * fetch Tuning Tab data
   */
  async function fetchTuningTabData(): Promise<void> {
    const loadCalibrationRunOutput: string | null = await makeProtectedApiCall(
      `${ngencerfBaseUrl}/calibration/load_calibration_run/?calibration_run_id=6`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userDataStore.getAccessToken()}`
        }
      });
      // console.log("loadCalibrationRunOutput:", loadCalibrationRunOutput);

    if (loadCalibrationRunOutput) {
      loadCalibrationRunData.value = loadCalibrationRunOutput;
    }

    const loadTuningTabOutput: string | null = await makeProtectedApiCall(
      `${ngencerfBaseUrl}/calibration/load_tuning_tab/?calibration_run_id=6`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userDataStore.getAccessToken()}`
        }
      });
      // console.log("loadTuningTabOutput:", loadTuningTabOutput);

    if (loadTuningTabOutput) {
      loadTuningTabData.value = loadTuningTabOutput;
    }

    if (loadCalibrationRunData.value && loadTuningTabData.value) {
      isDataFetched.value = true;
    }
  };

  // /**
  //  * post SaveTuningTab data
  //  * @returns {Promise<any>} SaveTuningTab data
  //  */
  // async function postSaveTuningTabData(): Promise<any> {
  //   const saveTuningTabOutput: string | null = await makeProtectedApiCall(
  //     `${ngencerfBaseUrl}/calibration/save_tuning_tab/`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${userDataStore.getAccessToken()}`
  //       }
  //     });
  //     console.log("saveTuningTabOutput:", saveTuningTabOutput);
  //   }


  return {
    fetchTuningTabData,
    loadCalibrationRunData,
    loadTuningTabData,
    isDataFetched,
    userCalibrationTimes,
    userCalibrationTuningParameters,
    userOuptutVariableToCalibrate
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
  import.meta.hot.accept(acceptHMRUpdate(useTuningStore, import.meta.hot));
}
