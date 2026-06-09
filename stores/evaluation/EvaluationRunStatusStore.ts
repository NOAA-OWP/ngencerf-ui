// @ts-check

import { defineStore, storeToRefs } from "pinia";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { useBackendConfig } from "@/composables/UseBackendConfig";
import { makeProtectedApiCall } from "@/composables/UserAuth"
import { calculateElapsedTime } from '@/utils/TimeHelpers';

export const useEvaluationRunStatusStore = defineStore('EvaluationRunStatusStore', () => {
  const { calibrationJobId, evaluateIterationRunId, iterationValidationRunId, evaluateDisplayIterationNumber, validationStatus } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();

  const runningTime = ref<string>("");
  const startTime = ref<string>("");
  const validationStopStatus = ref<string[]>(['DONE', 'SERVER ERROR', 'FAILED', 'CANCELLED']);
  const validationFailedStatus = ref<string[]>(['SERVER ERROR', 'FAILED']);
  const failureMessages = ref<any>();
  const displayValidationId = ref<number>( 0 );
  const validationStatusCheckingIntervalId = ref<number>();
  const validationRunningTimeIntervalId = ref<number>();
  const runStatusTabVisible = ref<boolean>(false);

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
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value, iteration_id: evaluateIterationRunId.value })
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
      body: JSON.stringify({ validation_run_id: iterationValidationRunId.value })
    });
  }

  const executeCancelIterationValidationRun = async () => {
    return await makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: iterationValidationRunId.value
      })
    });
  }

  const loadValidationStatusInformation = async ( validation_run_id: number ) => {
    queryIterationValidationRunStatus().then( response => {
      displayValidationId.value = validation_run_id;
      validationStatus.value = response?._data.status;
      failureMessages.value = response?._data?.failure_messages;
      evaluateDisplayIterationNumber.value = response?._data?.iteration_num;
      startTime.value = response?._data?.submit_date.toString();
      if ( validationStatus.value.toLocaleUpperCase() !== "RUNNING" ) {
        runningTime.value = response?._data?.elapsed_time ? formatElapsedTime(response?._data?.elapsed_time) : '';
      } else {
        if (validationRunningTimeIntervalId.value) {
          clearInterval(validationRunningTimeIntervalId.value);
        }
        validationRunningTimeIntervalId.value = setInterval( updateRunningTime, 1000 ) as unknown as number;
      }
    })
  }

  const updateRunningTime = (): void => {
    const convertedStartTime = new Date( startTime.value );
    runningTime.value = formatDuration(calculateElapsedTime( convertedStartTime, new Date() ));
  }

  /**
   * @param status 
   * @returns {boolean}
   */
  const isValidationRunDone = (status: string) => {
    return status.toUpperCase() === 'DONE';
  }

  /**
   * @param status 
   * @returns {boolean}
   */
  const isValidationRerunable = (status: string) => {
    return validationFailedStatus.value.includes(status.toUpperCase());
  }

  /**
   * @param status 
   * @return {boolean}
   */
  const isValidationRunStopped = (status: string) => {
    return validationStopStatus.value.includes(status.toUpperCase());
  }

  /**
   * Hard Reset Run/Status Store
   */
  const hardResetEvaluationRunStatusStore = (): void => {
    validationStatus.value = "";
    startTime.value = "";
    runningTime.value = "";

    if (validationStatusCheckingIntervalId.value) {
      clearInterval(validationStatusCheckingIntervalId.value);
      validationStatusCheckingIntervalId.value = undefined;
    }

    if (validationRunningTimeIntervalId.value) {
      clearInterval(validationRunningTimeIntervalId.value);
      validationRunningTimeIntervalId.value = undefined;
    }
  };

  return {
    runningTime,
    startTime,
    validationStatus,
    failureMessages,
    iterationValidationRunId,
    displayValidationId,
    validationRunningTimeIntervalId,
    validationStatusCheckingIntervalId,
    evaluateDisplayIterationNumber,
    runStatusTabVisible,
    executeIterationValidationRun,
    queryIterationValidationRunStatus,
    executeCancelIterationValidationRun,
    isValidationRunStopped,
    isValidationRunDone,
    isValidationRerunable,
    loadValidationStatusInformation,
    updateRunningTime,
    hardResetEvaluationRunStatusStore
  }
})

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationRunStatusStore, import.meta.hot));
}