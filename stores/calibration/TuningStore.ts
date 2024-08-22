// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import type { load_tuning_tab_response, save_tuning_tab_request_body, save_tuning_tab_response } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/utils/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";

export const useTuningStore = defineStore('TuningStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore())
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  
  const loadTuningTabData = ref<load_tuning_tab_response>()
  const saveTuningTabData = ref<save_tuning_tab_response>()

  /**
   * query load_tuning_tab API
   */
  const fetchTuningTabData = async () => {
    try {
      const tuningTabDataResult = await makeProtectedApiCall<load_tuning_tab_response>(
        `${ngencerfBaseUrl}/calibration/load_tuning_tab/`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
        }
      );

      console.log('load tuning data from tuningStore', tuningTabDataResult);
      loadTuningTabData.value = tuningTabDataResult ?? undefined; // TODO: add type guards
    } catch (error) {
      console.error('Failed to load tuning data:', error);
      // Handle the error, e.g., set a specific error state or show a message to the user
    }
  };

  return {
    loadTuningTabData,
    fetchTuningTabData
  }
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTuningStore, import.meta.hot));
}
