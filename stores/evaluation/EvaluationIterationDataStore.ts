// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { generalStore } from "../common/GeneralStore";

export const useEvaluationIterationDataStore = defineStore('EvaluationIterationDataStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();

  // refs
  const iterations = ref();
  const iterationMetricsData = ref();
  const iterationParamsData = ref();
  const selectedIterationTable = ref();

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

  return {
    iterations,
    iterationMetricsData,
    iterationParamsData,
    selectedIterationTable,
    queryGetIterations,
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
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationIterationDataStore, import.meta.hot));
}