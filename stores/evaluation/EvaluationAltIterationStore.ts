// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { CalibrationRunIterationParameterData, AlternativeIterationCalibrationRunData, AlternativeIterationTuningParameters, DynamicTableColumnHeader, DynamicTableColumn, CalibrationRunIterationMetricData } from "~/composables/NextGenModel";
import { useCalibrationTabValidation } from "~/composables/ValidationHandlers";

export const useEvaluationAltIterationStore = defineStore('EvaluationAltIterationStore', () => { 
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const { userCalibrationRunData } = storeToRefs( useUserDataStore() );
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

    const runListDataResult = await makeProtectedApiCall<AlternativeIterationCalibrationRunData>( `${ngencerfBaseUrl}/calibration/get_calibration_data_by_iteration/`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: userCalibrationRunData?.value?.calibration_run_id })
    });
    
    if ( runListDataResult._data.nwm_retrospective_data	) {
      headerRow = [];
      headerRow.push({
        header: "NWM 3.0",
        colspan: 3
      });
      runListDataResult._data.nwm_retrospective_data.forEach( ( nwm_retro_data : CalibrationRunIterationMetricData ) => {
        headerRow.push({
          header: `${nwm_retro_data.metric_value}`,
          colspan: 1
        });
      });
      calibrationRunDetailDataListHeaders.value.push( headerRow );
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
          calibrationRunDetailTableColumn.value.push({ field: 'calibration_output_variable_value', header: "Objective Function" });

          headerRow.push({ 
            header: iteration_data.worker_name,
            colspan: 1
          });

          headerRow.push({ 
            header: `Best ${iteration_data.iteration_num}`,
            colspan: 1
          });

          headerRow.push({ 
            header: `${iteration_data.calibration_output_variable_value}`,
            colspan: 1
          });

          iteration_data.metrics.forEach( ( metric: CalibrationRunIterationMetricData ) => {
            calibrationRunDetailTableColumn.value.push({ field: metric.metric_name, header: metric.metric_name });

            headerRow.push({ 
              header: `${metric.metric_value}`,
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
              header: `${parameter.parameter_value}`,
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
          rowData['calibration_output_variable_value'] = iteration_data.calibration_output_variable_value;
          
          iteration_data.metrics.forEach( ( metric: CalibrationRunIterationMetricData ) => {
            rowData[ metric.metric_name ] = metric.metric_value;
          });
          computedCalibrationRunDetailDataList.value.push( rowData );

          //tuning parameter section
          rowData = {};
          rowData['iteration_id'] = iteration_data.iteration_id;        
          rowData['worker_name'] = iteration_data.worker_name;        
          rowData['iteration_num'] = iteration_data.iteration_num;
          
          iteration_data.parameters.forEach( ( parameters: CalibrationRunIterationParameterData ) => {
            rowData[ parameters.parameter_name ] = parameters.parameter_value;
          });
          computedtuningParametersDataList.value.push( rowData );

        };
      });
    }

    /*
    const { data } = await useFetch<AlternativeIterationCalibrationRunData[]>('/api/evaluation/run_detail_data', {
      'method': 'POST'
    })
    calibrationRunDetailDataList.value = data.value ?? [];
    if ( calibrationRunDetailDataList.value ) {
      calibrationRunDetailTableColumn.value = [];
      let headerRow = <DynamicTableColumnHeader[]>[];
      const rowData = calibrationRunDetailDataList.value[0];
      
      Object.keys( rowData ).forEach( key => {
        calibrationRunDetailTableColumn.value.push({ field: key, header: key.charAt(0).toUpperCase() + key.slice(1) });
      })
      const subheader_spacer_colspan = headerRow.length - 2
      calibrationRunDetailDataList.value.forEach( rowData => {
        if ( isNumeric( rowData.iteration ) === false ) {
          headerRow = [];
          headerRow.push({
            header: rowData.worker,
            colspan: 1
          });
          headerRow.push({
            header: String( rowData.iteration ),
            colspan: 1
          });
          headerRow.push({
            header: rowData.objective_function_value,
            colspan: subheader_spacer_colspan
          });
          calibrationRunDetailDataListHeaders.value.push( headerRow );      
        } else {
          computedCalibrationRunDetailDataList.value.push( rowData );
        }
      });
    }
      */
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
  }

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