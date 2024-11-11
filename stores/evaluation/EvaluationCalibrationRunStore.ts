// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { SelectOption, CalibrationValidationRunData, ValidatedCalibrationRunList, CalibrationValidationJobList, CalibrationRunValidationParameterData } from "~/composables/NextGenModel";
import { formatDateForDisplay } from '~/utils/TimeHelpers';
import { useValidationRunStatusStore } from "./ValidationRunStatusStore";

export const useEvaluationCalibrationRunStore = defineStore('EvaluationCalibrationRunStore', () => {  
  const { calibrationJobId, evaluateValidationRunId, evaluateIterationRunId } = storeToRefs( generalStore() );
  const { fetchUserCalibrationRunData, clearUserCalibrationRunData } = useUserDataStore();
  const { clearRunningStatusInfo } = useValidationRunStatusStore()
  const calibrationRunList = ref<any[]>([]);
  const userSelectedEvalCalibrationRunId = ref<number>( 0 );
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const uiGageId = ref<string>( "" );   
  const userSelectedEvalCalibrationRun = ref<any>();
  const loadCalibrationDataComplete = ref<boolean>( false );
  

  /**
   * list of calibration jobs with validation data
   */
  const userEvaluationCalibrationRunListData = ref<ValidatedCalibrationRunListItem[]>( [] );
  /**
   * list of validation jobs of a selected calibration job id
   */
  const userSelectedCalibrationValidationRunList = ref<CalibrationValidationRunData[]>( [] );

  const calibrationValidationRunListHeaders = ref<any[]>([]);
  const computedCalibrationValidationRunList = ref<CalibrationValidationJobData[]>( [] );

  /**
  * @returns {SelectOption[]}
  */
  const evaluationCalibrationRunGageList = computed( () => {
    let gageOptionList = <SelectOption[]>[];
    userEvaluationCalibrationRunListData.value.forEach( runItem => {
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

  /**
   * fetch user created calibration job list data
   * @return {void}
   */
  async function fetchUserValidatedCalibrationJobsListData() {
    userEvaluationCalibrationRunListData.value = [];
    const runListDataResult = await makeProtectedApiCall<ValidatedCalibrationRunList>( `${ngencerfBaseUrl}/calibration/get_calibration_jobs_for_evaluation/`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });

    if ( runListDataResult?._data?.jobs.length > 0 ) {
      runListDataResult?._data?.jobs.forEach( ( runItem: ValidatedCalibrationRunListItem ) => {
        if ( runItem.status.toLowerCase() == "done" && runItem.run_date != null ) {
          userEvaluationCalibrationRunListData.value.push( runItem );
        }
      });
    }
  }

  const fetchUserSelectedCalibrationValidationRunList = async () => {
    const runListDataResult = await makeProtectedApiCall<CalibrationValidationJobList>( `${ngencerfBaseUrl}/calibration/get_validation_jobs/`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify( { calibration_run_id: userSelectedEvalCalibrationRunId.value } )
    });

    if( runListDataResult._data?.validation_jobs ) {     
      //if there is only 1 validation job, we automatically set the selected validation id to that validation job     
      if ( runListDataResult._data?.validation_jobs.length == 1) {
        evaluateValidationRunId.value = runListDataResult._data?.validation_jobs[0].validation_run_id;
      }
      
      runListDataResult._data?.validation_jobs.forEach( ( validation_job: CalibrationValidationJobData ) => {
        if ( validation_job.best	=== true ) {
          calibrationValidationRunListHeaders.value.push({ field: 'validation_run_id', header: "Validation Run ID"});          
          calibrationValidationRunListHeaders.value.push({ field: 'run_date', header: "Run Date"});

          validation_job.parameters.forEach( ( parameter: CalibrationRunValidationParameterData ) => {
            calibrationValidationRunListHeaders.value.push({ field: parameter.name, header: parameter.name });            
          });
        }
        let rowData = <any>{};
        rowData['validation_run_id'] = validation_job.validation_run_id;
        rowData['run_date'] = formatDateForDisplay( validation_job.run_date );
        validation_job.parameters.forEach( ( parameter: CalibrationRunValidationParameterData ) => {
          rowData[ parameter.name ] = parameter.value;
        });
        computedCalibrationValidationRunList.value.push( rowData );
      });
    }
  }

  const loadSelectedCalibrationRun = async ( calibration_run_id: number ) => {
    calibrationJobId.value = calibration_run_id;
    userSelectedEvalCalibrationRunId.value = calibration_run_id;
    await fetchUserCalibrationRunData();
  }

  const resetUserSelectedCalibrationValidationRunList = () => {
    userSelectedCalibrationValidationRunList.value = [];
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
   * @return {void}
   */
  const resetUserSelectedEvalCalibrationRun = (): void => {
    userSelectedEvalCalibrationRun.value = undefined;
    loadCalibrationDataComplete.value = false;
    userSelectedCalibrationValidationRunList.value = [];
    resetUserSelectedEvalValidationRun();
    clearUserCalibrationRunData();
    clearRunningStatusInfo();
  }

  /**
   * @return {void}
   */
  const resetUserSelectedEvalValidationRun = ():void => {
    calibrationJobId.value = userSelectedEvalCalibrationRunId.value = evaluateIterationRunId.value = 0;
    evaluateValidationRunId.value = 0;
    calibrationValidationRunListHeaders.value = [];
    computedCalibrationValidationRunList.value = [];
  
  }

  useLogoutListen('logoutEvent', () => {
    resetUserSelectedEvalCalibrationRun();
  })

  return {
    uiGageId,
    calibrationRunList,
    evaluationCalibrationRunGageList,
    userSelectedEvalCalibrationRunId,
    loadCalibrationDataComplete,

    loadSelectedCalibrationRun,
    fetchUserValidatedCalibrationJobsListData,
    resetUserSelectedEvalCalibrationRun,
    getReferenceDataSetOptions,
    resetUserSelectedCalibrationValidationRunList,
    fetchUserSelectedCalibrationValidationRunList,
    resetUserSelectedEvalValidationRun,

    userEvaluationCalibrationRunListData,
    calibrationValidationRunListHeaders,
    computedCalibrationValidationRunList,
    evaluateValidationRunId,
    evaluateIterationRunId
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