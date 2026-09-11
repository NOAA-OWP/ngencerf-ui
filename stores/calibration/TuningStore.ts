// @ts-check
import { defineStore } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";

export const useTuningStore = defineStore(
  "TuningStore",
  () => {
    // server-data properties
    const userDataStore = useUserDataStore();
    const loadTuningTabData = ref<any>();

    const { calibrationJobId } = storeToRefs(generalStore());
    const { getAccessToken } = userDataStore;

    const dataStore = userDataStore;
    const { userCalibrationRunData } = storeToRefs(dataStore);
    const { ngencerfBaseUrl } = useBackendConfig();

    // user-data properties
    const calSimStartTime = ref<any>();
    const calSimEndTime = ref<any>();
    const calStartTime = ref<any>();
    const calEndTime = ref<any>();

    const calibrationTuningModules = ref<any>();
    const calibrationTuningParameters = ref<any[]>([]);
    const userSelectedCalibrationTuningParameters = ref<any[]>([]);

    const valSimStartTime = ref<any>();
    const valSimEndTime = ref<any>();
    const valStartTime = ref<any>();
    const valEndTime = ref<any>();

    const dateRangeBegin = ref<any>();
    const dateRangeEnd = ref<any>();

    const tuningStore_data_loading = ref(true);
    const validateTuningTimesRequestBody = ref<any>({});
    const saveTuningTabRequestBody = ref<any>({});

    const selectedOutputVariableToCalibrate = ref<string>("Streamflow");
    const calibratableParametersHaveChanged = ref<boolean>(false);
    const tuningDataHasChanged = ref<boolean>(false);
    const tuningParametersAreValid = ref<boolean>(false);

    /**
     * Load Tuning Tab data
     * @returns {Promise<any>}
     */
    async function loadTuningTabStaticData(forceReset: boolean=false): Promise<any> {
      tuningStore_data_loading.value = true;
      loadTuningTabData.value = await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/load_tuning_tab/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ calibration_run_id: calibrationJobId.value }),
        }
      );
      tuningStore_data_loading.value = false;

      // set time range
      const timeRange = loadTuningTabData.value?._data?.time_range;
      // check if timeRange is provided and not empty
      if (timeRange?.start_time && timeRange?.end_time) {
        dateRangeBegin.value = timeRange?.start_time;
        dateRangeEnd.value = timeRange?.end_time;
        if (userCalibrationRunData.value) {
          userCalibrationRunData.value.time_range.start_time =
            dateRangeBegin.value;
          userCalibrationRunData.value.time_range.end_time = dateRangeEnd.value;
        }
      }

      calibrationTuningModules.value = loadTuningTabData.value?._data?.modules;

      calibrationTuningParameters.value =
        calibrationTuningModules?.value?.flatMap((module: any) =>
          module?.parameters?.map((param: any) => ({
            name: param.name,
            minimum: param.minimum,
            maximum: param.maximum,
            initial_value: param.initial_value,
            user_selected_for_tuning: param.user_selected_for_tuning,
            module: module.name,
            output: `${param.name} (${module.name})`,
          }))
        ) || [];

      // set calibration tuning parameters data table with user-selected parameters set to true if not already set, but without the user_selected_for_tuning flag
      if (
        !userSelectedCalibrationTuningParameters.value ||
        userSelectedCalibrationTuningParameters.value.length === 0 ||
        forceReset
      ) {
        userSelectedCalibrationTuningParameters.value =
          calibrationTuningParameters.value
            ?.filter((param: any) => param?.user_selected_for_tuning)
            ?.map((param: any) => ({
              name: param.name,
              minimum: param.minimum,
              maximum: param.maximum,
              initial_value: param.initial_value,
              module: param.module,
            })) || [];
      }

      return loadTuningTabData.value;
    }

    /**
     * return validate tuning parameters response from the server
     * @returns {GeneralApiSaveResponse}
     */
    async function validateTuningParameters() {
      return await makeProtectedApiCall<GeneralApiSaveResponse>(
        `${ngencerfBaseUrl}/calibration/validate_parameters/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calibration_run_id: calibrationJobId.value
          }),
        }
      );
    }

    /**
     * return validate tuning times response from the server
     * @returns {GeneralApiSaveResponse}
     */
    async function validateTuningTimes() {
      return await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/validate_tuning_times/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validateTuningTimesRequestBody.value),
        }
      );
    }

    /**
     * Save Tuning Tab data
     * @returns {Promise<any>} SaveTuningTab data
     */
    async function saveTuningTabData(): Promise<any> {
      const saveTuningTabResponse: any = await makeProtectedApiCall(
        `${ngencerfBaseUrl}/calibration/save_tuning_tab/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saveTuningTabRequestBody.value),
        }
      );

      return saveTuningTabResponse;
    }

    useLogoutListen("logoutEvent", (evStr: string) => {
      if (evStr === "logout") {
        hardResetTuningStore();
      }
    });

    function clearCalibratableParameters() {
      userSelectedCalibrationTuningParameters.value = [];
    }

    /**
     * Hard Reset Tuning Store
     */
    const hardResetTuningTimeConrols = (): void => {
      calSimStartTime.value = "";
      calSimEndTime.value = "";
      calStartTime.value = "";
      calEndTime.value = "";
      valSimStartTime.value = "";
      valSimEndTime.value = "";
      valStartTime.value = "";
      valEndTime.value = "";
    };

    /**
     * Hard Reset Tuning Store
     */
    const hardResetTuningStore = (): void => {
      loadTuningTabData.value = null;
      calSimStartTime.value = "";
      calSimEndTime.value = "";
      calStartTime.value = "";
      calEndTime.value = "";
      calibrationTuningModules.value = null;
      calibrationTuningParameters.value = [];
      userSelectedCalibrationTuningParameters.value = [];
      valSimStartTime.value = "";
      valSimEndTime.value = "";
      valStartTime.value = "";
      valEndTime.value = "";
      dateRangeBegin.value = null;
      dateRangeEnd.value = null;
      tuningStore_data_loading.value = true;
    };

    return {
      tuningStore_data_loading,
      loadTuningTabStaticData,
      loadTuningTabData,
      calSimStartTime,
      calSimEndTime,
      calStartTime,
      calEndTime,
      valSimStartTime,
      valSimEndTime,
      valStartTime,
      valEndTime,
      dateRangeBegin,
      dateRangeEnd,
      selectedOutputVariableToCalibrate,
      calibrationTuningParameters,
      userSelectedCalibrationTuningParameters,
      calibratableParametersHaveChanged,
      tuningDataHasChanged,
      validateTuningTimesRequestBody,
      saveTuningTabRequestBody,
      tuningParametersAreValid,
      validateTuningTimes,
      validateTuningParameters,
      saveTuningTabData,
      clearCalibratableParameters,
      hardResetTuningTimeConrols,
      hardResetTuningStore,
    };
  }
);

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTuningStore, import.meta.hot));
}
