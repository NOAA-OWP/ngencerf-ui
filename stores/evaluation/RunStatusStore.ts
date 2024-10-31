// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { SelectOption, CalibrationValidationRunData, ValidatedCalibrationRunList, DynamicTableColumn } from "~/composables/NextGenModel";
import { useCalibrationTabValidation } from "~/composables/ValidationHandlers";

export const useRunStatusStore = defineStore('RunStatusStore', () => {  
  const { calibrationJobId, evaluateValidationRunId } = storeToRefs( generalStore() );
  const { fetchUserCalibrationRunData, clearUserCalibrationRunData } = useUserDataStore();

  const validationStatus = ref<string>();
  const runningTime = ref();
  const startTimeDate = ref();
  const startTime = ref();

  // const calibrationRunList = ref<any[]>([]);
  // const userSelectedEvalCalibrationRunId = ref<number>( 0 );
  // const { ngencerfBaseUrl } = useBackendConfig();
  // const { getAccessToken } = useUserDataStore();
  // const uiGageId = ref<string>( "" );   
  // const userSelectedEvalCalibrationRun = ref<any>();
  // const userSelectedCalibrationValidationRunId = ref<number>( 0 );


  return {
    runningTime,
    startTimeDate,
    startTime,
    validationStatus
  }
})

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRunStatusStore, import.meta.hot));
}