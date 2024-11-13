// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { generalStore } from "../common/GeneralStore";

export const useEvaluationSupplementalDataStore = defineStore('EvaluationSupplementalDataStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();

  // refs
  const iterationMetricsData = ref<any[]>([]);
  const iterationParamsData = ref<any[]>([]);
  const iterationMetricsColumns = ref<any[]>([]);
  const iterationParamsColumns = ref<any[]>([]);
  const performanceMetricsData = ref<any[]>([]);

  const selectedSupplementalTable = ref<number>(0);
  const iterations = ref<number>(0);
  const performanceMetrics = ref();


  // Restore state from sessionStorage if available
  if (typeof window !== 'undefined') {
    let ls;
    ls = sessionStorage.getItem('iterationMetricsData');
    if (ls !== "undefined") { iterationMetricsData.value = ls ? JSON.parse(ls) : [] }
    ls = sessionStorage.getItem('iterationParamsData');
    if (ls !== "undefined") { iterationParamsData.value = ls ? JSON.parse(ls) : [] }
    ls = sessionStorage.getItem('iterationMetricsColumns');
    if (ls !== "undefined") { iterationMetricsColumns.value = ls ? JSON.parse(ls) : [] }
    ls = sessionStorage.getItem('iterationParamsColumns');
    if (ls !== "undefined") { iterationParamsColumns.value = ls ? JSON.parse(ls) : [] }
    ls = sessionStorage.getItem('performanceMetrics');
    if (ls !== "undefined") { performanceMetrics.value = ls ? JSON.parse(ls) : [] }

    selectedSupplementalTable.value = parseInt(JSON.parse(sessionStorage.getItem('selectedSupplementalTable') as string), 10);
    iterations.value = parseInt(JSON.parse(sessionStorage.getItem('iterations') as string), 10);
    performanceMetrics.value = JSON.parse(sessionStorage.getItem('performanceMetrics') as string);

    console.log("EvaluationSupplementalDataStore Store restored");
  }

  watch(iterationMetricsData, (iterationMetricsData) => { sessionStorage.setItem('iterationMetricsData', JSON.stringify(iterationMetricsData)); })
  watch(iterationParamsData, (iterationParamsData) => { sessionStorage.setItem('iterationParamsData', JSON.stringify(iterationParamsData)); })
  watch(iterationMetricsColumns, (iterationMetricsColumns) => { sessionStorage.setItem('iterationMetricsColumns', JSON.stringify(iterationMetricsColumns)); })
  watch(iterationParamsColumns, (iterationParamsColumns) => { sessionStorage.setItem('iterationParamsColumns', JSON.stringify(iterationParamsColumns)); })
  watch(performanceMetrics, (performanceMetrics) => { sessionStorage.setItem('performanceMetrics', JSON.stringify(performanceMetrics)); })
  watch(selectedSupplementalTable, (selectedSupplementalTable) => { sessionStorage.setItem('selectedSupplementalTable', JSON.stringify(selectedSupplementalTable)); })
  watch(iterations, (iterations) => { sessionStorage.setItem('iterations',  JSON.stringify(iterations)); })

  /**
 * Get Calibration Iteration Data
 * @return {any}
 */
  const queryGetIterations = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_calibration_data_by_iteration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(
        {
          calibration_run_id: calibrationJobId.value
        }
      )
    });
  };

  /**
  * Get Performance Metrics
  * @return {any}
  */
  const queryGetPerformanceMetrics = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(
        {
          calibration_run_id: calibrationJobId.value,
          include_performance_metrics: true
        }
      )
    });
  };

  return {
    iterations,
    iterationMetricsData,
    iterationParamsData,
    iterationMetricsColumns,
    iterationParamsColumns,
    selectedSupplementalTable,
    performanceMetrics,
    performanceMetricsData,
    queryGetIterations,
    queryGetPerformanceMetrics,
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
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationSupplementalDataStore, import.meta.hot));
}