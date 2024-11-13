// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { generalStore } from "../common/GeneralStore";

export const useEvaluationSupplementalDataStore = defineStore('EvaluationSupplementalDataStore', () => {
  const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();

  // refs
  const iterations = ref();
  const iterationMetricsData = ref<any[]>([]);
  const iterationParamsData = ref<any[]>([]);
  const iterationMetricsColumns = ref<any[]>([]);
  const iterationParamsColumns = ref<any[]>([]);
  const selectedSupplementalTable = ref<number>( 0 );
  const performanceMetrics = ref();
  const performanceMetricsData = ref<any[]>([]);
  const logs = ref();
  const calibrationLogData = ref<DynamicObject>({});
  const validationLogData = ref<string>("")

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
      body: JSON.stringify({calibration_run_id: calibrationJobId.value})
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

  /**
   * Get Calibration/Validation Logs
   * @return {any}
   */
  const queryGetLogs = async (): Promise<any> => {
    if (evaluateValidationRunId.value) {
      return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_logs/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({'validation_run_id': evaluateValidationRunId.value})
      });
    } else {
      return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_logs/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({'calibration_run_id': calibrationJobId.value})
      });
    }
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
    logs,
    calibrationLogData,
    validationLogData,
    queryGetIterations,
    queryGetPerformanceMetrics,
    queryGetLogs,
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