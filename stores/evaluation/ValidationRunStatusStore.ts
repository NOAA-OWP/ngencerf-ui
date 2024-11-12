// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"

export const useValidationRunStatusStore = defineStore('ValidationRunStatusStore', () => {
  const { evaluateIterationRunId, iterationValidationRunId } = storeToRefs( generalStore() );
  const { userCalibrationRunData } = storeToRefs( useUserDataStore() );
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const validationStopStatus = ref<string[]>([ 'DONE', 'SERVER ERROR', 'FAIL' ])

  const validationStatus = ref<string | null>( null );
  const runningTime = ref();
  const startTimeDate = ref();
  const startTime = ref();


   // Restore state from sessionStorage if available
   if (typeof window !== 'undefined') {
    validationStatus.value = JSON.parse(sessionStorage.getItem('validationStatus') ?? "");
    runningTime.value = sessionStorage.getItem('runningTime');
    startTimeDate.value = sessionStorage.getItem('startTimeDate');
    startTime.value = sessionStorage.getItem('startTime');
    console.log("ValidationRunStatusStore Store restored");
  }

  watch(validationStatus, (validationStatus) => { sessionStorage.setItem('validationStatus', JSON.stringify(validationStatus)); })
  watch(runningTime, (runningTime) => { sessionStorage.setItem('runningTime',  JSON.stringify(runningTime)); })
  watch(startTimeDate, (startTimeDate) => { sessionStorage.setItem('startTimeDate',  JSON.stringify(startTimeDate)); })
  watch(startTime, (startTime) => { sessionStorage.setItem('startTime',  JSON.stringify(startTime)); })

 /**
   * @returns {Promise<any>}
   */
  const executeIterationValidationRun = async () => {
    return await makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/create_and_run_validation/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: userCalibrationRunData.value?.calibration_run_id, iteration_id: evaluateIterationRunId.value })
    });
  }

  /**
   * @returns {Promise<any>}
   */
  const queryIterationValidationRunStatus = async () => {
    return await makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: userCalibrationRunData.value?.calibration_run_id })
    });
  }

  const executeCancelIterationValidationRun = async () => {
    return await makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ validation_run_id: iterationValidationRunId.value })
    });
  }

  /**
   * @param status 
   * @return {boolean}
   */
  const isValidationRunStopped = ( status: string ) => {
    return validationStopStatus.value.includes( status.toUpperCase() );
  }

  const clearRunningStatusInfo = () => {
    validationStatus.value = null;
    startTime.value = null;
    runningTime.value = null;
  }

  return {
    runningTime,
    startTimeDate,
    startTime,
    validationStatus,
    iterationValidationRunId,

    executeIterationValidationRun,
    queryIterationValidationRunStatus,
    executeCancelIterationValidationRun,
    isValidationRunStopped, 
    clearRunningStatusInfo,
  }
})

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useValidationRunStatusStore, import.meta.hot));
}