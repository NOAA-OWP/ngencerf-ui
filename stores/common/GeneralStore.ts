// @ts-check
/**
 *  The General Store will be responsible for handling information OUTSIDE of the data needed for the back end.
 *  Data will include the current menu status and the current tab status for each of the 4 menu items
 */
import { defineStore } from "pinia";

import type { ServerInfo, ToastRecord } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";

export const generalStore = defineStore(
  "generalStore",
  () => {
    const calibrationTabIndex = ref("1");
    const evaluationTabIndex = ref("1");
    const forecastTabIndex = ref("1");
    const verificationTabIndex = ref("1");

    const menuIndex = ref("1");

    const calibrationJobId = ref<number>(0);
    // user selected valiation run id from evaluate tab
    const evaluateValidationRunId = ref<number>(0);
    // user selected iteration run id from evaluate-select alternative tab
    const evaluateIterationRunId = ref<number>(0);
    // running validation run id from selected iteration
    const iterationValidationRunId = ref<number>(0);
    // user selected validation run status
    const evaluateValidationRunStatus = ref<string>("");
    // user seleted iteration run number for display only
    const evaluateDisplayIterationNumber = ref<number>(0);

    // Has the user selected a previous calibration run for Evaluation?
    const evaluationRunSelected = ref(true);

    const serverInfo = ref<ServerInfo>();

    const isLoading = ref<boolean>(false);

    // This is set if the user changes the gage.  Resets when saved.toastRecord
    const gageHasChanged = ref<boolean>(false);
    // This is set if the user changes the modules on the Formulation page
    const modulesHaveChanged = ref<boolean>(false);

    const toastRecords = ref<ToastRecord[]>([]);

    
    function addToastRecord(rec: ToastMessageOptions) {
      let dt = { datetime: Date().toString().substring(4, 24) };
      let newRec = { ...rec, ...dt };
      toastRecords.value.push(newRec as ToastRecord);
    }

    function clearToastRecords() {
      toastRecords.value = [];
      toastRecords.value = [
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:19",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:21",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:22",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:23",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:24",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:25",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:26",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:27",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:28",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:29",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:30",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:31",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:32",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:33",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:34",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:35",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:42",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:43",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:43",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:44",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:45",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:46",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:47",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:48",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:48",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:49",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:50",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:51",
      },
      {
        severity: "error",
        summary: "Unable to Save",
        detail: "Calibration and Validation times must not overlap",

        datetime: "Feb 11 2025 14:28:52",
      },
    ];

    }
    function getServerInfo() {
      return serverInfo.value;
    }

    function setServerInfo(si: ServerInfo) {
      serverInfo.value = si;
    }

    // Top Menu index
    function getMenuIndex() {
      return parseInt(menuIndex.value);
    }
    function setMenuIndex(tab: number) {
      menuIndex.value = tab.toString();
    }
    // setEvaluationTabIndex
    // Calibration Tab index
    function getCalibrationTabIndex() {
      return parseInt(calibrationTabIndex.value);
    }
    function setCalibrationTabIndex(tab: number) {
      calibrationTabIndex.value = tab.toString();
    }

    // Evaluation Tab index
    function getEvaluationTabIndex() {
      return parseInt(evaluationTabIndex.value);
    }
    function setEvaluationTabIndex(tab: number) {
      evaluationTabIndex.value = tab.toString();
    }

    //  Forecast Tab index
    function getForecastTabIndex() {
      return parseInt(forecastTabIndex.value);
    }
    function setForecastTabIndex(tab: number) {
      forecastTabIndex.value = tab.toString();
    }

    //  Verification Tab index
    function getVerificationTabIndex() {
      return parseInt(verificationTabIndex.value);
    }
    function setVerificationTabIndex(tab: number) {
      verificationTabIndex.value = tab.toString();
    }

    // Previous calibration run for Evaluation
    function getEvalRunSelected() {
      return evaluationRunSelected.value;
    }

    function setEvalRunSelected(b: boolean) {
      evaluationRunSelected.value = b;
    }

    function resetGeneralStore() {
      calibrationJobId.value = 0;
    }

    return {
      getMenuIndex,
      setMenuIndex,
      getCalibrationTabIndex,
      setCalibrationTabIndex,
      getEvaluationTabIndex,
      setEvaluationTabIndex,
      getForecastTabIndex,
      setForecastTabIndex,
      getVerificationTabIndex,
      setVerificationTabIndex,
      getEvalRunSelected,
      setEvalRunSelected,
      calibrationJobId,
      evaluateValidationRunId,
      evaluateIterationRunId,
      iterationValidationRunId,
      evaluateValidationRunStatus,
      evaluateDisplayIterationNumber,
      calibrationTabIndex,
      evaluationTabIndex,
      forecastTabIndex,
      resetGeneralStore,
      setServerInfo,
      getServerInfo,
      serverInfo,
      gageHasChanged,
      modulesHaveChanged,
      verificationTabIndex,
      menuIndex,
      evaluationRunSelected,
      isLoading,
      toastRecords,
      addToastRecord,
      clearToastRecords,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(generalStore, import.meta.hot));
}
