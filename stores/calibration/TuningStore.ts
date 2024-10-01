// @ts-check

import { defineStore } from "pinia";
import { generalStore } from "~/stores/common/GeneralStore";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { useUserDataStore } from "@/stores/common/UserDataStore";

export const useTuningStore = defineStore('TuningStore', () => {
  // server-data properties
  const { calibrationJobId } = storeToRefs(generalStore())
  const loadCalibrationRunData = ref<any>(); // TODO: update to use LoadCalbrationRunData type
  const loadTuningTabData = ref<any>(); // TODO: update to use LoadTuningTabResponse type
  // const saveTuningTabData = ref<SaveTuningTabRequestBody>()

  // user-data properties
  const simStartTime = ref<string>("");
  const simEndTime = ref<string>("");
  const calStartTime = ref<string>("");
  const calEndTime = ref<string>("");

  const userCalibrationTuningParameters = ref<any[]>([]);
  const userOutputVariableToCalibrate = ref<{ name: string; module: string | null }>({
    name: '',
    module: null,
  });
  const outputVariables = ref<any[]>([]);
  const automatic_validation = ref<boolean>(true);

  const avSimStartTime = ref<string>("");
  const avSimEndTime = ref<string>("");
  const avCalStartTime = ref<string>("");
  const avCalEndTime = ref<string>("");


  const rangeDateFrom = ref<any>();
  const rangeDateTo = ref<any>();

  const { ngencerfBaseUrl } = useBackendConfig();
  const userDataStore = useUserDataStore();

  /**
   * fetch Tuning Tab data
   */
  async function fetchTuningTabData(): Promise<void> {
    const loadCalibrationRunOutput: any = await makeProtectedApiCall(
      `${ngencerfBaseUrl}/calibration/load_calibration_run/?calibration_run_id=${calibrationJobId.value}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userDataStore.getAccessToken()}`
        }
      });
    // console.log("loadCalibrationRunOutput:", loadCalibrationRunOutput);

    if (loadCalibrationRunOutput?._data) {
      loadCalibrationRunData.value = loadCalibrationRunOutput?._data;
    }

    const loadTuningTabOutput: any = await makeProtectedApiCall(
      `${ngencerfBaseUrl}/calibration/load_tuning_tab/?calibration_run_id=${calibrationJobId.value}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userDataStore.getAccessToken()}`
        }
      });
    // console.log("loadTuningTabOutput:", loadTuningTabOutput);

    if (loadTuningTabOutput?._data) {
      loadTuningTabData.value = loadTuningTabOutput?._data;
    }
  };

  /**
   * post SaveTuningTab data
   * @returns {Promise<any>} SaveTuningTab data
   */
  async function postSaveTuningTabData(): Promise<any> {
    const requestBody: any = {}; // store all the data to be sent to the server

    // add Tuning Tab data to request body
    requestBody.calibration_run_id = calibrationJobId.value;
    requestBody.calibration_times = {
      simulation_start_time: simStartTime.value,
      simulation_end_time: simEndTime.value,
      calibration_start_time: calStartTime.value,
      calibration_end_time: calEndTime.value
    };
    requestBody.parameters = userCalibrationTuningParameters.value;
    requestBody.output_variable_to_calibrate = userOutputVariableToCalibrate.value;
    requestBody.automatic_validation = automatic_validation.value;

    // add validation times if automatic validation is enabled
    if (automatic_validation.value) {
      requestBody.validation_times = {
        simulation_start_time: avSimStartTime.value,
        simulation_end_time: avSimEndTime.value,
        validation_start_time: avCalStartTime.value,
        validation_end_time: avCalEndTime.value
      };
    }

    console.log("saveTuningTabData:", JSON.stringify(requestBody));

    const saveTuningTabOutput: any = await makeProtectedApiCall(
      `${ngencerfBaseUrl}/calibration/save_tuning_tab/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userDataStore.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
    console.log("saveTuningTabOutput:", saveTuningTabOutput?._data);

    return saveTuningTabOutput?._data;
  };


  useLogoutListen('logoutEvent', () => {
    hardResetTuningStore();
  })

  /**
   * Hard Reset Tuning Store
   */
  const hardResetTuningStore = (): void => {
    loadCalibrationRunData.value = null;
    loadTuningTabData.value = null;
    simStartTime.value = "";
    simEndTime.value = "";
    calStartTime.value = "";
    calEndTime.value = "";
    userCalibrationTuningParameters.value = [];
    userOutputVariableToCalibrate.value.name = '';
    userOutputVariableToCalibrate.value.module = null;
    outputVariables.value = [];
    automatic_validation.value = true;

    avSimStartTime.value = "";
    avSimEndTime.value = "";
    avCalStartTime.value = "";
    avCalEndTime.value = "";
    rangeDateFrom.value = null;
    rangeDateTo.value = null;
    console.log("Tuning Store Reset")
  };

  return {
    fetchTuningTabData,
    loadCalibrationRunData,
    loadTuningTabData,
    simStartTime,
    simEndTime,
    calStartTime,
    calEndTime,
    userCalibrationTuningParameters,
    userOutputVariableToCalibrate,
    outputVariables,
    automatic_validation,
    avSimStartTime,
    avSimEndTime,
    avCalStartTime,
    avCalEndTime,
    rangeDateFrom,
    rangeDateTo,
    postSaveTuningTabData,
    hardResetTuningStore
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
