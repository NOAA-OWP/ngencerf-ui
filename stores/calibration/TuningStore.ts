// @ts-check

import { defineStore } from "pinia";
import { isValidDateTime } from "~/utils/CommonHelpers";
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

  const calibrationTuningModules = ref<any>();
  const calibrationTuningParameters = ref<any[]>([]);
  const userSelectedCalibrationTuningParameters = ref<any[]>([]);
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
   * Load Tuning Tab data
   * @returns {Promise<any>}
   */
  async function loadTuningTabStaticData(): Promise<any> {
    tuningStore_data_loading.value = true;

    loadTuningTabData.value =  await makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/load_tuning_tab/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });

    tuningStore_data_loading.value = false;

    // set time range
    const timeRange = loadTuningTabData.value?._data?.time_range;
    // check if timeRange is provided and not empty
    if (timeRange?.start_time && timeRange?.end_time) {
      rangeDateFrom.value = timeRange?.start_time;
      rangeDateTo.value = timeRange?.end_time;
      console.log("rangeDateFrom:", rangeDateFrom.value);
      console.log("rangeDateTo:", rangeDateTo.value);
    }

    calibrationTuningModules.value = loadTuningTabData.value?._data?.modules;
    console.log("calibrationTuningModules:", calibrationTuningModules.value);

    if (calibrationTuningModules?.value.length > 0) {
      // set calibration tuning parameters dropdown if not already set
      if (!calibrationTuningParameters.value || calibrationTuningParameters.value.length === 0) {
        calibrationTuningParameters.value = calibrationTuningModules?.value?.flatMap((module: any) => module?.parameters?.map((param: any) => ({
          name: param.name,
          minimum: param.minimum,
          maximum: param.maximum,
          initial_value: param.initial_value,
          user_selected_for_tuning: param.user_selected_for_tuning,
          module: module.name,
          output: `${param.name} (${module.name})`,
        }))) || [];
        console.log("calibrationTuningParameters:", calibrationTuningParameters.value);
      }

      // set calibration tuning parameters data table with user-selected parameters set to true if not already set, but without the user_selected_for_tuning flag
      if (!userSelectedCalibrationTuningParameters.value || userSelectedCalibrationTuningParameters.value.length === 0) {
        userSelectedCalibrationTuningParameters.value = calibrationTuningParameters.value?.filter((param: any) => param?.user_selected_for_tuning)?.map((param: any) => ({
          name: param.name,
          minimum: param.minimum,
          maximum: param.maximum,
          initial_value: param.initial_value,
          module: param.module,
        })) || [];
        console.log("userSelectedCalibrationTuningParameters:", userSelectedCalibrationTuningParameters.value);
      }

      // set output variables if not already set
      if (!outputVariables.value || outputVariables.value.length === 0) {
        outputVariables.value = calibrationTuningModules?.value?.flatMap((module: any) => module?.output_variables?.map((outputVar: any) => ({
          name: outputVar.name,
          description: outputVar.description,
          module: module.name,
          output: `${outputVar.name} (${module.name})`,
        }))) || [];
        console.log("outputVariables:", outputVariables.value);
      }
    }

    return loadTuningTabData.value;
  };

  /**
   * Save Tuning Tab data
   * @returns {Promise<any>} SaveTuningTab data
   */
  async function saveTuningTabData(): Promise<any> {
    const requestBody: any = {}; // store all the data to be sent to the server

    // add Tuning Tab data to request body
    requestBody.calibration_run_id = calibrationJobId.value;

    // add calibration times if they are provided
    if (isValidDateTime(simStartTime.value) && isValidDateTime(simEndTime.value) && isValidDateTime(calStartTime.value) && isValidDateTime(calEndTime.value)) {
      requestBody.calibration_times = {
        simulation_start_time: simStartTime.value,
        simulation_end_time: simEndTime.value,
        calibration_start_time: calStartTime.value,
        calibration_end_time: calEndTime.value
      };
    }

    // add user calibration tuning parameters if they are provided
    if (userSelectedCalibrationTuningParameters.value && userSelectedCalibrationTuningParameters.value.length > 0) {
      requestBody.parameters = userSelectedCalibrationTuningParameters.value;
    }

    // add user output variable to calibrate if it is provided
    if (userOutputVariableToCalibrate.value.name && userOutputVariableToCalibrate.value.module) {
      requestBody.output_variable_to_calibrate = userOutputVariableToCalibrate.value;
    }

    requestBody.automatic_validation = automatic_validation.value;

    // add validation times if automatic validation is enabled and the times are provided
    if (automatic_validation.value && isValidDateTime(avSimStartTime.value) && isValidDateTime(avSimEndTime.value) && isValidDateTime(avCalStartTime.value) && isValidDateTime(avCalEndTime.value)) {
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
    calibrationTuningParameters.value = [];
    userSelectedCalibrationTuningParameters.value = [];
    userOutputVariableToCalibrate.value.name = '';
    userOutputVariableToCalibrate.value.module = null;
    outputVariables.value = [];
    automatic_validation.value = true;
    avSimStartTime.value = "";
    avSimEndTime.value = "";
    avCalStartTime.value = "";
    avCalEndTime.value = "";
    console.log("Tuning Store Reset")
  };

  return {
    tuningStore_data_loading,
    loadTuningTabStaticData,
    loadTuningTabData,
    simStartTime,
    simEndTime,
    calStartTime,
    calEndTime,
    calibrationTuningParameters,
    userSelectedCalibrationTuningParameters,
    userOutputVariableToCalibrate,
    outputVariables,
    automatic_validation,
    avSimStartTime,
    avSimEndTime,
    avCalStartTime,
    avCalEndTime,
    rangeDateFrom,
    rangeDateTo,
    saveTuningTabData,
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
