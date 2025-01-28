// @ts-check

import { defineStore } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { useUserDataStore } from "@/stores/common/UserDataStore";

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
    const simStartTime = ref<any>("");
    const simEndTime = ref<any>("");

    const calStartTime = ref<any>("");
    const calEndTime = ref<any>("");

    const calibrationTuningModules = ref<any>();
    const calibrationTuningParameters = ref<any[]>([]);
    const userSelectedCalibrationTuningParameters = ref<any[]>([]);
    const userOutputVariableToCalibrate = ref<{
      name: string;
      module: string | null;
    }>({
      name: "",
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
    const saveTuningTabRequestBody = ref<any>({});

    const selectedOutputVariable = ref<any>(null);

    // Restore state from sessionStorage if available
    if (typeof window !== "undefined") {
      let ls;
      ls = sessionStorage.getItem("loadTuningTabData");
      if (ls !== "undefined") {
        loadTuningTabData.value = JSON.parse(ls as string);
      }

      simStartTime.value = sessionStorage.getItem("simStartTime") as string;
      simEndTime.value = sessionStorage.getItem("simEndTime") as string;
      calStartTime.value = sessionStorage.getItem("calStartTime") as string;
      calEndTime.value = sessionStorage.getItem("calEndTime") as string;

      ls = sessionStorage.getItem("calibrationTuningModules");
      if (ls !== "undefined") {
        calibrationTuningModules.value = JSON.parse(ls as string);
      }
      ls = sessionStorage.getItem("calibrationTuningParameters");
      if (ls !== "undefined") {
        calibrationTuningParameters.value = ls ? JSON.parse(ls) : [];
      }
      ls = sessionStorage.getItem("userSelectedCalibrationTuningParameters");
      if (ls !== "undefined") {
        userSelectedCalibrationTuningParameters.value = ls
          ? JSON.parse(ls)
          : [];
      }
      ls = sessionStorage.getItem("userOutputVariableToCalibrate");
      if (ls !== "undefined") {
        userOutputVariableToCalibrate.value = ls ? JSON.parse(ls) : [];
      }
      ls = sessionStorage.getItem("outputVariables");
      if (ls !== "undefined") {
        outputVariables.value = ls ? JSON.parse(ls) : [];
      }
      automatic_validation.value =
        JSON.parse(sessionStorage.getItem("automatic_validation") as string) ===
        "true";
      avSimStartTime.value = sessionStorage.getItem("avSimStartTime") as string;
      avSimEndTime.value = sessionStorage.getItem("avSimEndTime") as string;
      avCalStartTime.value = sessionStorage.getItem("avCalStartTime") as string;
      avCalEndTime.value = sessionStorage.getItem("avCalEndTime") as string;
      rangeDateFrom.value = sessionStorage.getItem("rangeDateFrom") as string;
      rangeDateTo.value = sessionStorage.getItem("rangeDateTo") as string;
      ls = sessionStorage.getItem("saveTuningTabRequestBody");
      if (ls !== "undefined") {
        saveTuningTabRequestBody.value = ls ? JSON.parse(ls) : {};
      }
    }

    watch(loadTuningTabData, (loadTuningTabData) => {
      sessionStorage.setItem(
        "loadTuningTabData",
        JSON.stringify(loadTuningTabData)
      );
    });
    watch(calibrationTuningModules, (calibrationTuningModules) => {
      sessionStorage.setItem(
        "calibrationTuningModules",
        JSON.stringify(calibrationTuningModules)
      );
    });
    watch(calibrationTuningParameters, (calibrationTuningParameters) => {
      sessionStorage.setItem(
        "calibrationTuningParameters",
        JSON.stringify(calibrationTuningParameters)
      );
    });
    watch(
      userSelectedCalibrationTuningParameters,
      (userSelectedCalibrationTuningParameters) => {
        sessionStorage.setItem(
          "userSelectedCalibrationTuningParameters",
          JSON.stringify(userSelectedCalibrationTuningParameters)
        );
      }
    );
    watch(userOutputVariableToCalibrate, (userOutputVariableToCalibrate) => {
      sessionStorage.setItem(
        "userOutputVariableToCalibrate",
        JSON.stringify(userOutputVariableToCalibrate)
      );
    });
    watch(outputVariables, (outputVariables) => {
      sessionStorage.setItem(
        "outputVariables",
        JSON.stringify(outputVariables)
      );
    });
    watch(saveTuningTabRequestBody, (saveTuningTabRequestBody) => {
      sessionStorage.setItem(
        "saveTuningTabRequestBody",
        JSON.stringify(saveTuningTabRequestBody)
      );
    });
    watch(simEndTime, (simEndTime) => {
      sessionStorage.setItem("simEndTime", simEndTime ?? "");
    });
    watch(calStartTime, (calStartTime) => {
      sessionStorage.setItem("calStartTime", calStartTime ?? "");
    });
    watch(calEndTime, (calEndTime) => {
      sessionStorage.setItem("calEndTime", calEndTime ?? "");
    });
    watch(automatic_validation, (automatic_validation) => {
      sessionStorage.setItem(
        "automatic_validation",
        JSON.stringify(automatic_validation)
      );
    });
    watch(avSimStartTime, (avSimStartTime) => {
      sessionStorage.setItem("avSimStartTime", avSimStartTime ?? "");
    });
    watch(avSimEndTime, (avSimEndTime) => {
      sessionStorage.setItem("avSimEndTime", avSimEndTime ?? "");
    });
    watch(avCalStartTime, (avCalStartTime) => {
      sessionStorage.setItem("avCalStartTime", avCalStartTime ?? "");
    });
    watch(avCalEndTime, (avCalEndTime) => {
      sessionStorage.setItem("avCalEndTime", avCalEndTime ?? "");
    });
    watch(rangeDateFrom, (rangeDateFrom) => {
      sessionStorage.setItem("rangeDateFrom", rangeDateFrom ?? "");
    });

    /**
     * Load Tuning Tab data
     * @returns {Promise<any>}
     */
    async function loadTuningTabStaticData(): Promise<any> {
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
        rangeDateFrom.value = timeRange?.start_time;
        rangeDateTo.value = timeRange?.end_time;
        if (userCalibrationRunData.value) {
          userCalibrationRunData.value.time_range.start_time =
            rangeDateFrom.value;
          userCalibrationRunData.value.time_range.end_time = rangeDateTo.value;
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
        userSelectedCalibrationTuningParameters.value.length === 0
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

      // set output variables if not already set
      if (!outputVariables.value || outputVariables.value.length === 0) {
        outputVariables.value =
          calibrationTuningModules?.value?.flatMap((module: any) =>
            module?.output_variables?.map((outputVar: any) => ({
              name: outputVar.name,
              description: outputVar.description,
              module: module.name,
              output: `${outputVar.name} (${module.name})`,
            }))
          ) || [];
      }
      // }

      return loadTuningTabData.value;
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
      simStartTime.value = "";
      simEndTime.value = "";
      calStartTime.value = "";
      calEndTime.value = "";
      avSimStartTime.value = "";
      avSimEndTime.value = "";
      avCalStartTime.value = "";
      avCalEndTime.value = "";
    };

    /**
     * Hard Reset Tuning Store
     */
    const hardResetTuningStore = (): void => {
      loadTuningTabData.value = null;
      simStartTime.value = "";
      simEndTime.value = "";
      calStartTime.value = "";
      calEndTime.value = "";
      calibrationTuningModules.value = null;
      calibrationTuningParameters.value = [];
      userSelectedCalibrationTuningParameters.value = [];
      userOutputVariableToCalibrate.value.name = "";
      userOutputVariableToCalibrate.value.module = null;
      outputVariables.value = [];
      automatic_validation.value = true;
      avSimStartTime.value = "";
      avSimEndTime.value = "";
      avCalStartTime.value = "";
      avCalEndTime.value = "";
      rangeDateFrom.value = null;
      rangeDateTo.value = null;
      tuningStore_data_loading.value = true;
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
      selectedOutputVariable,
      outputVariables,
      automatic_validation,
      avSimStartTime,
      avSimEndTime,
      avCalStartTime,
      avCalEndTime,
      rangeDateFrom,
      rangeDateTo,
      saveTuningTabRequestBody,
      saveTuningTabData,
      clearCalibratableParameters,
      hardResetTuningTimeConrols,
      hardResetTuningStore,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.sessionStorage,
    },
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
