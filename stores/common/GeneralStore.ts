// @ts-check
/**
 *  The General Store will be responsible for handling information OUTSIDE of the data needed for the back end.
 *  Data will include the current menu status and the current tab status for each of the 4 menu items
 */
import { defineStore } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

export const generalStore = defineStore(
  "generalStore",
  () => {
    const calibrationTabIndex = ref("1");
    const evaluationTabIndex = ref("1");
    const forecastTabIndex = ref("1");
    const menuIndex = ref("1");

    const calibrationJobId = ref<number>( 0 );
    const evaluateCalibrationRunId = ref<number>( 0 );
    
    // Has the user selected a previous calibration run for Evaluation?
    const evaluationRunSelected = ref(true);

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

    // Previous calibration run for Evaluation
    function getEvalRunSelected() {
      return evaluationRunSelected.value;
    }
    
    function setEvalRunSelected(b: boolean) {
      evaluationRunSelected.value = b;
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
      getEvalRunSelected,
      setEvalRunSelected,
      calibrationJobId,
      evaluateCalibrationRunId,
      calibrationTabIndex,
      evaluationTabIndex,
      forecastTabIndex
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
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
