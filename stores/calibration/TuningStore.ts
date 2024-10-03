// @ts-check

import { defineStore } from "pinia";
import { generalStore } from "~/stores/common/GeneralStore";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { useUserDataStore } from "@/stores/common/UserDataStore";

export const useTuningStore = defineStore('TuningStore', () => {
  // server-data properties
  const userDataStore = useUserDataStore();
  const loadTuningTabData = ref<any>(); // TODO: update to use LoadTuningTabResponse type
  // const saveTuningTabData = ref<SaveTuningTabRequestBody>()
  const { calibrationJobId } = storeToRefs(generalStore())
  const { getAccessToken } = userDataStore;
  const { ngencerfBaseUrl } = useBackendConfig();

  // user-data properties
  const simStartTime = ref<any>("");
  const simEndTime = ref<any>("");
  const calStartTime = ref<any>("");
  const calEndTime = ref<any>("");

  const userCalibrationTuningParameters = ref<any[]>([]);
  const userOutputVariableToCalibrate = ref<{ name: string; module: string | null }>({
    name: '',
    module: null,
  });
  const outputVariables = ref<any[]>([]);
  const automatic_validation = ref<boolean>(true);

  const avSimStartTime = ref<any>("");
  const avSimEndTime = ref<any>("");
  const avCalStartTime = ref<any>("");
  const avCalEndTime = ref<any>("");

  const rangeDateFrom = ref<any>();
  const rangeDateTo = ref<any>();

  const tuningStore_data_loading = ref(true);

  /**
   * Get Tuning Tab data
   * @returns {Promise<any>}
   */
  async function fetchTuningTabData(): Promise<any> {
    tuningStore_data_loading.value = true;

    const fetchTuningTabDataOutput =  makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/load_tuning_tab/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });

    tuningStore_data_loading.value = false;
    return fetchTuningTabDataOutput;
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
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

    return saveTuningTabOutput;
  };


  useLogoutListen('logoutEvent', () => {
    hardResetTuningStore();
  })

  /**
   * Hard Reset Tuning Store
   */
  const hardResetTuningStore = (): void => {
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
    tuningStore_data_loading,
    fetchTuningTabData,
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
