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
  const simStartTime = ref<string>("");
  const simEndTime = ref<string>("");
  const calStartTime = ref<string>("");
  const calEndTime = ref<string>("");

  const userCalibrationTimes = computed(() => ({
    simulation_start_time: simStartTime.value,
    simulation_end_time: simEndTime.value,
    calibration_start_time: calStartTime.value,
    calibration_end_time: calEndTime.value,
  }));

  const userCalibrationTuningParameters = ref<any[]>([]);
  const userOutputVariableToCalibrate = ref<{ name: string; module: string | null }>({
    name: '',
    module: null,
  });
  const outputVariables = ref<any[]>([]);
  const automatic_validation = ref<boolean>(false);

  const avSimStartTime = ref<string>("");
  const avSimEndTime = ref<string>("");
  const avCalStartTime = ref<string>("");
  const avCalEndTime = ref<string>("");
  const userValidationTimes = computed(() => ({
    simulation_start_time: avSimStartTime.value,
    simulation_end_time: avSimEndTime.value,
    validation_start_time: avCalStartTime.value,
    validation_end_time: avCalEndTime.value,
  }));

  const rangeDateFrom = ref<any>();
  const rangeDateTo = ref<any>();

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
    simStartTime,
    simEndTime,
    calStartTime,
    calEndTime,
    userCalibrationTimes,
    userCalibrationTuningParameters,
    userOutputVariableToCalibrate,
    outputVariables,
    automatic_validation,
    avSimStartTime,
    avSimEndTime,
    avCalStartTime,
    avCalEndTime,
    userValidationTimes,
    rangeDateFrom,
    rangeDateTo,
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
