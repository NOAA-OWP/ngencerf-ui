// @ts-check
/**
 *  The General Store will be responsible for handling information OUTSIDE of the data needed for the back end.
 *  Data will include the current menu status and the current tab status for each of the 4 menu items
 */
import { defineStore } from "pinia";

import type { ServerInfo } from "@/composables/NextGenModel";

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
    const evaluateValidationRunStatus = ref<string>('');
    // user seleted iteration run number for display only
    const evaluateDisplayIterationNumber = ref<number>( 0 );

    // Has the user selected a previous calibration run for Evaluation?
    const evaluationRunSelected = ref(true);

    const serverInfo = ref<ServerInfo>();

    // This is set if the user changes the gage.  Resets when saved.
    const gageHasChanged = ref<boolean>(false);
    // This is set if the user changes the modules on the Formulation page
    const modulesHaveChanged = ref<boolean>(false);

    // Restore state from sessionStorage if available
    if (typeof window !== 'undefined') {
      calibrationTabIndex.value = sessionStorage.getItem('calibrationTabIndex') as string;
      evaluationTabIndex.value = sessionStorage.getItem('evaluationTabIndex') as string;
      forecastTabIndex.value = sessionStorage.getItem('forecastTabIndex') as string;
      verificationTabIndex.value = sessionStorage.getItem('verificationTabIndex') as string;
      menuIndex.value = sessionStorage.getItem('menuIndex') as string;
      calibrationJobId.value = parseInt(JSON.parse(sessionStorage.getItem('calibrationJobId') as string), 10);
      evaluateValidationRunId.value = parseInt(JSON.parse(sessionStorage.getItem('evaluateValidationRunId') as string), 10);
      evaluateIterationRunId.value = parseInt(JSON.parse(sessionStorage.getItem('evaluateIterationRunId') as string), 10);
      iterationValidationRunId.value = parseInt(JSON.parse(sessionStorage.getItem('iterationValidationRunId') as string), 10);
      evaluationRunSelected.value = JSON.parse(sessionStorage.getItem('evaluationRunSelected') as string);
      evaluateValidationRunStatus.value = JSON.parse(sessionStorage.getItem('evaluateValidationRunStatus') as string);
      evaluateDisplayIterationNumber.value = parseInt(JSON.parse(sessionStorage.getItem('evaluateDisplayIterationNumber') as string), 10);
    }

    watch(calibrationTabIndex, (calibrationTabIndex) => { sessionStorage.setItem('calibrationTabIndex', calibrationTabIndex); })
    watch(evaluationTabIndex, (evaluationTabIndex) => { sessionStorage.setItem('evaluationTabIndex', evaluationTabIndex); })
    watch(forecastTabIndex, (forecastTabIndex) => { sessionStorage.setItem('forecastTabIndex', forecastTabIndex); })
    watch(verificationTabIndex, (verificationTabIndex) => { sessionStorage.setItem('verificationTabIndex', verificationTabIndex); })
    watch(menuIndex, (menuIndex) => { sessionStorage.setItem('menuIndex', menuIndex); })
    watch(calibrationJobId, (calibrationJobId) => { sessionStorage.setItem('calibrationJobId', JSON.stringify(calibrationJobId)); })
    watch(iterationValidationRunId, (iterationValidationRunId) => { sessionStorage.setItem('iterationValidationRunId', JSON.stringify(iterationValidationRunId)); })
    watch(evaluateValidationRunId, (evaluateValidationRunId) => { sessionStorage.setItem('evaluateValidationRunId', JSON.stringify(evaluateValidationRunId)); })
    watch(evaluateIterationRunId, (evaluateIterationRunId) => { sessionStorage.setItem('evaluateIterationRunId', JSON.stringify(evaluateIterationRunId)); })
    watch(evaluationRunSelected, (evaluationRunSelected) => { sessionStorage.setItem('evaluationRunSelected', JSON.stringify(evaluationRunSelected)); })
    watch(evaluateValidationRunStatus, (evaluateValidationRunStatus) => { sessionStorage.setItem('evaluateValidationRunStatus', JSON.stringify(evaluateValidationRunStatus)); })
    watch(evaluateDisplayIterationNumber, (evaluateDisplayIterationNumber) => { sessionStorage.setItem('evaluateDisplayIterationNumber', JSON.stringify(evaluateDisplayIterationNumber)); })

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
      gageHasChanged,
      modulesHaveChanged
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
