// @ts-check
/**
 *  The General Store will be responsible for handling information OUTSIDE of the data needed for the back end.
 *  Data will include the current menu status and the current tab status for each of the 4 menu items
 */
import { defineStore, acceptHMRUpdate } from "pinia";

import type { CombinedVersionInfo, ToastRecord } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";
import { getStorageKey } from "~/utils/Storage";

export const generalStore = defineStore(
  "generalStore",
  () => {

    const allowSelfRegistration = ref<boolean>(true);
    const allowPasswordChange = ref<boolean>(true);

    const gitInfo = ref<Record<string, GitData>>({});

    const calibrationTabIndex = ref("0");
    const evaluationTabIndex = ref("0");
    const forecastTabIndex = ref("0");
    const hindcastTabIndex = ref("0");

    const menuIndex = ref("0");

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
    // validation status for display only
    const validationStatus = ref<string>( "" );

    // Has the user selected a previous calibration run for Evaluation?
    const evaluationRunSelected = ref(true);

    const serverInfo = ref<CombinedVersionInfo>();

    const isLoading = ref<boolean>(false);

    // This is set if the user changes the gage.  Resets when saved.toastRecord
    const popupActive = ref<boolean>(false);

    // This is set if the user changes the gage.  Resets when saved.
    const gageHasChanged = ref<boolean>(false);
    // This is set if the user changes any of the data sources on the gage tab.  Resets when saved.
    const gageDataSourceHasChanged = ref<boolean>(false);
    // This is set if the user changes the modules on the Formulation page
    const modulesHaveChanged = ref<boolean>(false);
    
    // This is to allow propagation of individual validation/restore functions from specific tabs
    const tabRef = ref(null);
    const navRef = ref(null);

    const toastRecords = ref<ToastRecord[]>([]);

    function addToastRecord(rec: ToastMessageOptions) {
      let dt = { datetime: Date().toString().substring(4, 24) };
      let newRec = { ...rec, ...dt };
      toastRecords.value.push(newRec as ToastRecord);
    }

    function clearToastRecords() {
      toastRecords.value = [];
    }

    function getServerInfo() {
      return serverInfo.value;
    }

    function setServerInfo(si: CombinedVersionInfo) {
      serverInfo.value = si;
    }

    // Top Menu index
    function getMenuIndex() {
      return parseInt(menuIndex.value);
    }
    function setMenuIndex(tab: number) {
      menuIndex.value = tab.toString();
    }
    
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

    //  Hindcast Tab index
    function getHindcastTabIndex() {
      return parseInt(hindcastTabIndex.value);
    }
    function setHindcastTabIndex(tab: number) {
      hindcastTabIndex.value = tab.toString();
    }

    // Previous calibration run for Evaluation
    function getEvalRunSelected() {
      return evaluationRunSelected.value;
    }

    function setEvalRunSelected(b: boolean) {
      evaluationRunSelected.value = b;
    }

    // generic tab validation - individual validator functions will come from specific tabs
    function validateCurrentTab(tabNumber?: number) {
      if (typeof tabRef?.value?.validateTab === 'function') {
        return tabRef.value.validateTab(tabNumber);
      }
      return {
        error: false,
        text: []
      };
    }

    // generic tab restore - individual restore functions will come from specific tabs
    function restoreCurrentTab() {
      if (typeof tabRef?.value?.restoreTab === 'function') {
        return tabRef?.value?.restoreTab();
      }
      return true;
    }

    // tab clicked function - this can be passed to specific tabs to facilitate previous/next navigation
    function currentTabNavGo(tabNumber: number) {
      if (typeof navRef?.value?.goToTab === 'function') {
        return navRef?.value?.goToTab(tabNumber);
      }
      return true;
    }

    // show tab navigation dialog - this can be passed to specific tabs
    function showCurrentTabNavDialog(body: string[], next: boolean, tabNumber: number) {
      if (typeof navRef?.value?.showTabNavDialog === 'function') {
        return navRef?.value?.showTabNavDialog(body, next, tabNumber);
      }
      return true;
    }

    function resetGeneralStore() {
      calibrationJobId.value = 0;
      popupActive.value = false;

      // Also reset current menu/tab index so that user doesn't get redirected to a tab from the previous session
      menuIndex.value = '0';
      calibrationTabIndex.value = '0';
      evaluationTabIndex.value = '0';
      forecastTabIndex.value = '0';
      hindcastTabIndex.value = '0';
    }

    return {
      allowSelfRegistration,
      allowPasswordChange,
      gitInfo,
      getMenuIndex,
      setMenuIndex,
      getCalibrationTabIndex,
      setCalibrationTabIndex,
      getEvaluationTabIndex,
      setEvaluationTabIndex,
      getForecastTabIndex,
      setForecastTabIndex,
      getHindcastTabIndex,
      setHindcastTabIndex,
      getEvalRunSelected,
      setEvalRunSelected,
      calibrationJobId,
      evaluateValidationRunId,
      evaluateIterationRunId,
      iterationValidationRunId,
      evaluateValidationRunStatus,
      evaluateDisplayIterationNumber,
      validationStatus,
      calibrationTabIndex,
      evaluationTabIndex,
      forecastTabIndex,
      resetGeneralStore,
      setServerInfo,
      getServerInfo,
      serverInfo,
      gageHasChanged,
      gageDataSourceHasChanged,
      modulesHaveChanged,
      hindcastTabIndex,
      menuIndex,
      evaluationRunSelected,
      isLoading,
      toastRecords,
      addToastRecord,
      clearToastRecords,
      popupActive,
      tabRef,
      navRef,
      validateCurrentTab,
      restoreCurrentTab,
      currentTabNavGo,
      showCurrentTabNavDialog,
    };
  },
  {
    persist: {
      key: getStorageKey("generalStore"),
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
