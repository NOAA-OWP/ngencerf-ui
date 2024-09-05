// @ts-check

import { defineStore } from "pinia";
import type { CalibrationTimes, ModuleParameter, LoadTuningTabResponse, OutputVariable, SaveTuningTabRequestBody } from "~/composables/NextGenModel";
import { generalStore } from "~/stores/common/GeneralStore";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { useUserDataStore } from "@/stores/common/UserDataStore";


export const useTuningStore = defineStore('TuningStore', () => {
  // server-data properties
  const { calibrationJobId } = storeToRefs( generalStore() )
  const loadCalibrationRunData = ref<any>(); // TODO: update to use LoadCalbrationRunData type
  const loadTuningTabData = ref<any>(); // TODO: update to use LoadTuningTabResponse type
  // const saveTuningTabData = ref<SaveTuningTabRequestBody>()

  // track if data has been fetched already
  const isDataFetched = ref(false);

  // user-data properties
  const userCalibrationTimes = ref<any>();
  const userCalibrationTuningParameters = ref<any[]>([]);
  const userOutputVariableToCalibrate = ref<{ name: string; module: string | null }>({
    name: '',
    module: null,
  });
  const automatic_validation = ref<boolean>(false);
  const userValidationTimes = ref<any>({});

  const { ngencerfBaseUrl } = useBackendConfig();
  const userDataStore = useUserDataStore();

  /**
   * fetch Tuning Tab data
   */
  async function fetchTuningTabData(): Promise<void> {
    const loadCalibrationRunOutput: string | null = await makeProtectedApiCall(
      `${ngencerfBaseUrl}/calibration/load_calibration_run/?calibration_run_id=${calibrationJobId.value}`,
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
      `${ngencerfBaseUrl}/calibration/load_tuning_tab/?calibration_run_id=${calibrationJobId.value}`,
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

  /**
   * post SaveTuningTab data
   * @returns {Promise<any>} SaveTuningTab data
   */
  async function postSaveTuningTabData(): Promise<any> {
    console.log("saveTuningTabData:", JSON.stringify({
      calibration_run_id: calibrationJobId.value,
      calibration_times: userCalibrationTimes.value,
      parameters: userCalibrationTuningParameters.value,
      output_variable_to_calibrate: userOutputVariableToCalibrate.value,
      automatic_validation: automatic_validation.value,
      validation_times: userValidationTimes.value
    }));

    const saveTuningTabOutput: string | null = await makeProtectedApiCall(
      `${ngencerfBaseUrl}/calibration/save_tuning_tab/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userDataStore.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          calibration_run_id: calibrationJobId.value,
          calibration_times: userCalibrationTimes.value,
          parameters: userCalibrationTuningParameters.value,
          output_variable_to_calibrate: userOutputVariableToCalibrate.value,
          automatic_validation: automatic_validation.value,
          validation_times: userValidationTimes.value
        })
      });
      console.log("saveTuningTabOutput:", saveTuningTabOutput);
    }


  return {
    fetchTuningTabData,
    loadCalibrationRunData,
    loadTuningTabData,
    isDataFetched,
    userCalibrationTimes,
    userCalibrationTuningParameters,
    userOutputVariableToCalibrate,
    automatic_validation,
    userValidationTimes,
    postSaveTuningTabData
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
