// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { CalibrationRunIterationParameterData, AlternativeIterationCalibrationRunData, AlternativeIterationTuningParameters, DynamicTableColumnHeader, DynamicTableColumn, CalibrationRunIterationMetricData, CalibrationRunByIterationRetrospectiveData } from "~/composables/NextGenModel";

export const useEvaluationAltIterationStore = defineStore('EvaluationAltIterationStore', () => { 
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const { userCalibrationRunData, userSelectedCalibrationIterationId } = storeToRefs( useUserDataStore() );
  const calibrationRunDetailDataList = ref<AlternativeIterationCalibrationRunData[]>([]);
  const tuningParametersDataList = ref<AlternativeIterationTuningParameters[]>([]);
  const calibrationRunDetailDataListHeaders = ref<any[]>([]);
  const tuningParametersDataListHeaders = ref<any[]>([]);
  const calibrationRunDetailTableColumn = ref<DynamicTableColumn[]>([]);
  const tuningParametersTableColumn = ref<DynamicTableColumn[]>([]);
  const computedCalibrationRunDetailDataList = ref<AlternativeIterationCalibrationRunData[]>([]);
  const computedtuningParametersDataList = ref<AlternativeIterationTuningParameters[]>([]);

  const fetchCalibrationDataByIterationDataList = async () => {
    let headerRow = <DynamicTableColumnHeader[]>[];
    let rowData = <any>{};

    const runListDataResult = await makeProtectedApiCall<CalibrationRunByIteration>( `${ngencerfBaseUrl}/calibration/get_calibration_data_by_iteration/`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: userCalibrationRunData?.value?.calibration_run_id })
    });
    
    if ( runListDataResult._data.retrospective_data	) {
      runListDataResult._data.retrospective_data.forEach( ( retro_data : CalibrationRunByIterationRetrospectiveData ) => {
        headerRow = [];
        headerRow.push({
          header: retro_data.name,
          colspan: 2
        });
        retro_data.data.forEach( ( data : CalibrationRunIterationMetricData ) => {
          headerRow.push({
            header: `${Number( data.metric_value ).toFixed( 4 )}`,
            colspan: 1
          });
        });
        calibrationRunDetailDataListHeaders.value.push( headerRow );
      });
    }

    // building run detail table data based on the response data
    // also building table column data array, since we will always have a best run, we build the table column data array during the best run
    // the best run also needs to be excluded from the actual table data array and add to the header data array
    if ( runListDataResult._data.iteration_data ) {
      runListDataResult._data.iteration_data.forEach( ( iteration_data : CalibrationRunIterationData ) => {
        if ( iteration_data.best_params	=== true ) {
          // detail run section
          headerRow = [];
          calibrationRunDetailTableColumn.value.push({ field: 'iteration_id', hidden: true });  
          calibrationRunDetailTableColumn.value.push({ field: 'worker_name', header: "Worker" });
          calibrationRunDetailTableColumn.value.push({ field: 'iteration_num', header: "Iteration" });

          headerRow.push({ 
            header: iteration_data.worker_name,
            colspan: 1
          });

          headerRow.push({ 
            header: `Best ${iteration_data.iteration_num}`,
            colspan: 1
          });

          iteration_data.metrics.forEach( ( metric: CalibrationRunIterationMetricData ) => {            
            let metric_header_label = <string>metric.metric_name;
            let headerColumn = <DynamicTableColumn>{ field: metric.metric_name, header: metric_header_label } 
            if ( metric.metric_name == runListDataResult._data.objective_function_metric ) {
              headerColumn[ 'header' ] += " *";
              headerColumn[ 'styles' ] = [ 'bg-objective-function-col' ];
            }
            calibrationRunDetailTableColumn.value.push( headerColumn );

            headerRow.push({ 
              header: `${Number( metric.metric_value ).toFixed( 4 )}`,
              colspan: 1
            });
          });

          calibrationRunDetailDataListHeaders.value.push( headerRow );

          // tuning parameters section
          headerRow = [];
          headerRow.push({ 
            header: iteration_data.worker_name,
            colspan: 1
          });

          headerRow.push({ 
            header: `Best ${iteration_data.iteration_num}`,
            colspan: 1
          });
          
          tuningParametersTableColumn.value.push({ field: 'iteration_id', hidden: true });  
          tuningParametersTableColumn.value.push({ field: 'worker_name', header: "Worker" });
          tuningParametersTableColumn.value.push({ field: 'iteration_num', header: "Iteration" });
          iteration_data.parameters.forEach( ( parameter: CalibrationRunIterationParameterData ) => {
            tuningParametersTableColumn.value.push({ field: parameter.parameter_name, header: parameter.parameter_name });

            headerRow.push({ 
              header: `${Number(parameter.parameter_value).toFixed(4)}`,
              colspan: 1
            });
          });

          tuningParametersDataListHeaders.value.push( headerRow );

        } else {
          // detail run section
          rowData = {};
          rowData['iteration_id'] = iteration_data.iteration_id;        
          rowData['worker_name'] = iteration_data.worker_name;        
          rowData['iteration_num'] = iteration_data.iteration_num;        
          
          iteration_data.metrics.forEach( ( metric: CalibrationRunIterationMetricData ) => {
            rowData[ metric.metric_name ] = Number( metric.metric_value ).toFixed( 4 );
          });
          computedCalibrationRunDetailDataList.value.push( rowData );          

          //tuning parameter section
          rowData = {};
          rowData['iteration_id'] = iteration_data.iteration_id;        
          rowData['worker_name'] = iteration_data.worker_name;        
          rowData['iteration_num'] = iteration_data.iteration_num;
          
          iteration_data.parameters.forEach( ( parameters: CalibrationRunIterationParameterData ) => {
            rowData[ parameters.parameter_name ] = Number( parameters.parameter_value ).toFixed( 4) ;
          });
          computedtuningParametersDataList.value.push( rowData );
        };
      });
    }
  }


  const createNewValidationJob = async () => {
    return await makeProtectedApiCall( `${ngencerfBaseUrl}/calibration/create_validation_run/`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ 
        calibration_run_id: userCalibrationRunData?.value?.calibration_run_id,
        iteration_id: userSelectedCalibrationIterationId.value
      })
    });
  }

  /**
   * 
   * @param value 
   * @returns {boolean}
   */
  const isNumeric = ( value: any ) => {
    return /^-?\d+$/.test( value );
  }

  const resetEvaluationAltIterationStore = () => {
    calibrationRunDetailDataList.value = [];
    tuningParametersDataList.value = [];
    calibrationRunDetailDataListHeaders.value = [];
    tuningParametersDataListHeaders.value = [];
    userSelectedCalibrationIterationId.value = null;

    calibrationRunDetailTableColumn.value = [];
    tuningParametersTableColumn.value = [];
    computedCalibrationRunDetailDataList.value = [];
    computedtuningParametersDataList.value = [];
  }

  useLogoutListen('logoutEvent', () => {
    resetEvaluationAltIterationStore();
  })

  return {
    calibrationRunDetailDataList,
    calibrationRunDetailDataListHeaders,
    tuningParametersDataList,
    tuningParametersDataListHeaders,
    fetchCalibrationDataByIterationDataList,
    calibrationRunDetailTableColumn,
    tuningParametersTableColumn,
    resetEvaluationAltIterationStore,
    computedCalibrationRunDetailDataList,
    computedtuningParametersDataList,
    userSelectedCalibrationIterationId,
    createNewValidationJob
  }
})

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationAltIterationStore, import.meta.hot));
}