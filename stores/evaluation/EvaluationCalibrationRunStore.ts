// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { useGageStore } from "../calibration/GageStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { SelectOption, UserCalibrationRunData } from "~/composables/NextGenModel";
import { useCalibrationTabValidation } from "~/composables/ValidationHandlers";

export const useEvaluationCalibrationRunStore = defineStore('EvaluationCalibrationRunStore', () => {  
  const { calibrationJobId, validatedCalibrationRunId } = storeToRefs( generalStore() );
  const { fetchUserCalibrationRunData, clearUserCalibrationRunData } = useUserDataStore();
  const calibrationRunList = ref<any[]>([]);
  const validatedCalibrationRunList = ref<any[]>([]);
  const userSelectedEvalCalibrationRunId = ref<number>( 0 );
  const uiGageId = ref<string>( "" );   
  const userSelectedEvalCalibrationRun = ref<any>();
  const userSelectedValidatedCalibrationRunId = ref<number>( 0 );
  const uiReferenceDataSet = ref<string>( "" );

  const fetchEvaluationCalibrationRunList = async () => {
    const { data, status, error } = await useFetch('/api/evaluation/list_jobs', {
      'method': 'POST'
    });
    calibrationRunList.value = data.value ?? [];
  };

  /**
  * @returns {SelectOption[]}
  */
  const evaluationCalibrationRunGageList = computed( () => {
    let gageOptionList = <SelectOption[]>[];
    calibrationRunList.value.forEach( runItem => {
        const checkGageIndex = gageOptionList.findIndex( gageOption => {
          gageOption.name === runItem.gage_id 
        });
        
        if ( checkGageIndex == -1 ) {
          gageOptionList.push({
              'name': runItem.gage_id,
              'description': runItem.gage_id
          });
        }
    });
    return gageOptionList;
  });

  const filteredEvaluationCalibrationRunList = computed( () => {
    let runList = <any[]>[];
    calibrationRunList.value.forEach( runItem => {
        if ( uiGageId.value == "" || uiGageId.value == runItem.gage_id ) {
          runList.push( runItem );
        }
    });
    return runList;
  });

  const loadSelectedCalibrationRun = async ( calibration_run_id: number ) => {
    calibrationJobId.value = userSelectedEvalCalibrationRunId.value = calibration_run_id;
    fetchUserCalibrationRunData();
  }

  const fetchValidatedCalibrationRunList = async () => {
    const { data, status, error } = await useFetch('/api/evaluation/list_validated_calibration_runs', {
      'method': 'POST',
      body: JSON.stringify({ calibration_run_id: userSelectedEvalCalibrationRunId.value })
    });
    
    validatedCalibrationRunList.value = data.value ?? [];
  }

  const resetValidatedCalibrationRunList = () => {
    validatedCalibrationRunList.value = [];
  }

  /**
   * @returns {SelectOption[]}
   */
  const getReferenceDataSetOptions = computed( () => {
    let options = <SelectOption[]>[];
    if ( userSelectedEvalCalibrationRunId.value > 0 ) {
      options.push({
        'name': 'nwm',
        'description': 'NWM v2.0 retrospective'
      })
    }
    return options;
  });

  /**
  * @returns {void}
  */
  const resetEvaluationCalibrationRunStore = (): void => {
    calibrationRunList.value = [];
    calibrationJobId.value = userSelectedEvalCalibrationRunId.value = 0;
    uiGageId.value = "";
    userSelectedEvalCalibrationRun.value = undefined;
    validatedCalibrationRunList.value = [];
    //uiReferenceDataSet.value = "";
    clearUserCalibrationRunData();
  }

  /**
   * @return {void}
   */
  const resetUserSelectedEvalCalibrationRun = (): void => {
    calibrationJobId.value = userSelectedEvalCalibrationRunId.value = 0;
    userSelectedEvalCalibrationRun.value = undefined;
    validatedCalibrationRunList.value = [];
    clearUserCalibrationRunData();
  }

  return {
    validatedCalibrationRunId,
    uiGageId,
    uiReferenceDataSet,
    calibrationRunList,
    fetchEvaluationCalibrationRunList,
    filteredEvaluationCalibrationRunList,
    evaluationCalibrationRunGageList,
    userSelectedEvalCalibrationRunId,
    loadSelectedCalibrationRun,
    resetEvaluationCalibrationRunStore,
    resetUserSelectedEvalCalibrationRun,
    getReferenceDataSetOptions,
    validatedCalibrationRunList,
    fetchValidatedCalibrationRunList,
    resetValidatedCalibrationRunList,
    userSelectedValidatedCalibrationRunId
  }
})

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationCalibrationRunStore, import.meta.hot));
}