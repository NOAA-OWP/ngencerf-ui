// @ts-check

import { defineStore, storeToRefs } from "pinia";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";

export const useEvaluationSupplementalDataStore = defineStore('EvaluationSupplementalDataStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();

  // refs
  const plotNames = ref<APIResponse>({});
  const plotList = ref<any[]>([]);
  const selectedPlotName = ref<string | null>(null);
  const selectedPlotFilename = ref<string | null>(null);
  const selectedPlotFileUrl = ref<string | null>(null);

  /**
   * Get Calibration Iteration Data
   * @return {any}
   */
  const queryGetIterations = async (): Promise<any> => {
    if(!calibrationJobId.value) {
      return null;
    }
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
    if(!calibrationJobId.value) {
      return null;
    }   
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
   * Get Calibration/Validation Log Names
   * @return {any}
   */
  const queryGetLogNames = async (validation_run_id: number=0): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id
      })
    });
  };

  /**
   * Get Calibration/Validation Log Data
   * @return {any}
   */
  const queryGetLogData = async (
    log_category: string,
    log_name: string,
    validation_run_id: number=0,
    start?: number,
    limit?: number
  ): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id,
        log_category: log_category,
        log_name: log_name,
        start: start !== undefined ? start.toString() : '',
        limit: limit !== undefined ? limit.toString() : ''
      })
    });
  };

  return {
    plotNames,
    plotList,
    selectedPlotName,
    selectedPlotFilename,
    selectedPlotFileUrl,
    queryGetIterations,
    queryGetPerformanceMetrics,
    queryGetLogNames,
    queryGetLogData,
  };
},
{
  persist: true,
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationSupplementalDataStore, import.meta.hot));
}