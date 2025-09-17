// @ts-check

import { defineStore, storeToRefs } from "pinia";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { useBackendConfig } from "@/composables/UseBackendConfig";
import { makeProtectedApiCall } from "@/composables/UserAuth"
import { calculateElapsedTime } from '@/utils/TimeHelpers';

export const useEvaluationRunStatusStore = defineStore('EvaluationRunStatusStore', () => {
  const { calibrationJobId, evaluateIterationRunId, iterationValidationRunId, evaluateDisplayIterationNumber } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();

  const validationStatus = ref<string>( "" );
  const runningTime = ref<string>("");
  const startTime = ref<string>("");
  const validationStopStatus = ref<string[]>(['DONE', 'SERVER ERROR', 'FAILED', 'CANCELLED']);
  const validationFailedStatus = ref<string[]>(['SERVER ERROR', 'FAILED']);
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
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
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
      const find_validation_run = response._data.validations.filter( ( validation: CalibrationGetStatusValidationItem ) => {
        return validation.validation_run_id === validation_run_id
      });
      if ( find_validation_run ) {
        displayValidationId.value = validation_run_id;
        const validation_run = find_validation_run.shift() as CalibrationGetStatusValidationItem;
        validationStatus.value = validation_run.status;
        evaluateDisplayIterationNumber.value = validation_run.iteration_num;
        startTime.value = validation_run.submit_date.toString();
        if ( validationStatus.value.toLocaleUpperCase() !== "RUNNING" ) {
          runningTime.value = validation_run.elapsed_time ? formatElapsedTime(validation_run.elapsed_time) : '';
        } else {
          validationRunningTimeIntervalId.value = setInterval( updateRunningTime, 1000 );
        }
      } else {
        clearInterval(validationStatusCheckingIntervalId.value);
        clearInterval(validationRunningTimeIntervalId.value);
        validationStatusCheckingIntervalId.value = undefined;
        validationRunningTimeIntervalId.value = undefined;
      }
    })
  }

  const updateRunningTime = (): void => {
    const convertedStartTime = new Date( startTime.value );
    runningTime.value = calculateElapsedTime( convertedStartTime, new Date() );
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
  const hardResetRunStatusStore = (): void => {
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
    hardResetRunStatusStore
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