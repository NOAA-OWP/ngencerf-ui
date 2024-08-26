// @ts-check

import { defineStore } from "pinia";
import type { LoadTuningTabResponse, SaveTuningTabRequestBody } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { useUserDataStore } from "@/stores/common/UserDataStore";


export const useTuningStore = defineStore('TuningStore', () => {
  // state properties
  const loadCalibrationRunData = ref<any>() // TODO: update to use LoadCalbrationRunData type
  const loadTuningTabData = ref<any>() // TODO: update to use LoadTuningTabResponse type
  // const saveTuningTabData = ref<SaveTuningTabRequestBody>()
  const isDataFetched = ref(false);

  const { ngencerfBaseUrl } = useBackendConfig();
  const userDataStore = useUserDataStore();

  /**
   * get LoadCalibrationRun data
   * @returns {any} LoadCalibrationRun data
   */
  function getLoadCalibrationRunData(): any {
    return loadCalibrationRunData.value;
  }

  /** 
   * get LoadTuningTabResponse data
   * @returns {LoadTuningTabResponse | undefined} LoadTuningTabResponse data
   */
  function getLoadTuningTabData(): LoadTuningTabResponse | undefined {
    return loadTuningTabData.value;
  }

  // /**
  //  * get SaveTuningTabResponse data
  //  * @returns {SaveTuningTabResponse | undefined} SaveTuningTabResponse data
  //  */
  // function getSaveTuningTabData(): SaveTuningTabRequestBody | undefined {
  //   return saveTuningTabData.value;
  // }

  // /**
  //  * set save tuning tab data
  //  * @param {SaveTuningTabRequestBody} data - SaveTuningTabRequestBody data
  //  */
  // function setSaveTuningTabData(data: SaveTuningTabRequestBody) {
  //   saveTuningTabData.value = data
  // }

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
  //     return saveTuningTabOutput;
  //   }


  return {
    isDataFetched,
    getLoadCalibrationRunData,
    getLoadTuningTabData,
    fetchTuningTabData
  }
}, {
  persist: {
    storage: sessionStorage
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
