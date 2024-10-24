// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { SelectOption, CalibrationValidationRunData, ValidatedCalibrationRunList, DynamicTableColumn } from "~/composables/NextGenModel";
import { useCalibrationTabValidation } from "~/composables/ValidationHandlers";

export const useEvaluationCalibrationRunStore = defineStore('EvaluationCalibrationRunStore', () => {  
  const { calibrationJobId, validatedCalibrationRunId } = storeToRefs( generalStore() );
  const { fetchUserCalibrationRunData, clearUserCalibrationRunData } = useUserDataStore();
  const calibrationRunList = ref<any[]>([]);
  const userSelectedEvalCalibrationRunId = ref<number>( 0 );
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const uiGageId = ref<string>( "" );   
  const userSelectedEvalCalibrationRun = ref<any>();
  const userSelectedCalibrationValidationRunId = ref<number>( 0 );
  /**
   * list of calibration jobs with validation data
   */
  const userEvaluationCalibrationRunListData = ref<ValidatedCalibrationRunListItem[]>( [] );
  /**
   * list of validation jobs of a selected calibration job id
   */
  const userSelectedCalibrationValidationRunList = ref<CalibrationValidationRunData[]>( [] );
  //const validatedCalbrationRunParamColumns = ref<DynamicTableColumn[]>( [] );

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

  const filteredEvaluationCalibrationRunList = computed( () => {
    let runList = <any[]>[];
    userEvaluationCalibrationRunListData.value.forEach( runItem => {
        if ( uiGageId.value == "" || uiGageId.value == runItem.gage_id ) {
          runList.push( runItem );
        }
    });
    return runList;
  });

  const fetchUserSelectedCalibrationValidationRunList = async () => {
    const runListDataResult = await makeProtectedApiCall<ValidatedCalibrationRunList>( `${ngencerfBaseUrl}/calibration/get_validation_jobs/`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify( { calibration_run_id: userSelectedEvalCalibrationRunId.value } )
    });

    userSelectedCalibrationValidationRunList.value = runListDataResult._data?.validation_jobs ?? [];
  }

  /**
   * return processed 
   */
  const loadUserSelectedCalibrationValidationRunList = computed( () => {
    const queryset = ref<any[]>([]);
    userSelectedCalibrationValidationRunList.value.forEach( rowData => {
      let newRowData : any = {
        'validation_run_id': rowData.validation_run_id,
        'run_date': rowData.run_date
      };
      rowData.parameters.forEach( parameter => {
        newRowData[ parameter.name ] = parameter.value;
      })
      queryset.value.push( newRowData );
    });

    return queryset.value;
  })

  const loadSelectedCalibrationRun = async ( calibration_run_id: number ) => {
    calibrationJobId.value = userSelectedEvalCalibrationRunId.value = calibration_run_id;
    fetchUserCalibrationRunData();
  }

  const resetUserSelectedCalibrationValidationRunList = () => {
    userSelectedCalibrationValidationRunList.value = [];
  }

  const validatedCalbrationRunParamColumns = computed( () => {
    let columns = ref<DynamicTableColumn[]>( [] );
    userSelectedCalibrationValidationRunList.value[0]['parameters'].forEach( parameter => {
      columns.value.push({ field: parameter.name, header: parameter.name });
    })
    
    return columns.value;
  })

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
    userSelectedCalibrationValidationRunList.value = [];
    clearUserCalibrationRunData();
  }

  /**
   * @return {void}
   */
  const resetUserSelectedEvalCalibrationRun = (): void => {
    calibrationJobId.value = userSelectedEvalCalibrationRunId.value = 0;
    userSelectedEvalCalibrationRun.value = undefined;
    userSelectedCalibrationValidationRunList.value = [];
    clearUserCalibrationRunData();
  }

  useLogoutListen('logoutEvent', () => {
    resetEvaluationCalibrationRunStore();
  })

  return {
    validatedCalibrationRunId,
    uiGageId,
    calibrationRunList,
    filteredEvaluationCalibrationRunList,
    evaluationCalibrationRunGageList,
    userSelectedEvalCalibrationRunId,
    loadSelectedCalibrationRun,
    resetEvaluationCalibrationRunStore,
    fetchUserValidatedCalibrationJobsListData,
    resetUserSelectedEvalCalibrationRun,
    getReferenceDataSetOptions,
    resetUserSelectedCalibrationValidationRunList,
    userSelectedCalibrationValidationRunId,
    fetchUserSelectedCalibrationValidationRunList,
    validatedCalbrationRunParamColumns,
    loadUserSelectedCalibrationValidationRunList
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