// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { SelectOption, AlternativeIterationCalibrationRunData, AlternativeIterationTuningParameters, DynamicTableColumnHeader, DynamicTableColumn } from "~/composables/NextGenModel";
import { useCalibrationTabValidation } from "~/composables/ValidationHandlers";

export const useEvaluationAltIterationStore = defineStore('EvaluationAltIterationStore', () => {  
  const calibrationRunDetailDataList = ref<AlternativeIterationCalibrationRunData[]>([]);
  const tuningParametersDataList = ref<AlternativeIterationTuningParameters[]>([]);
  const calibrationRunDetailDataListHeaders = ref<any[]>([]);
  const tuningParametersDataListHeaders = ref<any[]>([]);
  const calibrationRunDetailTableColumn = ref<DynamicTableColumn[]>([]);
  const tuningParametersTableColumn = ref<DynamicTableColumn[]>([]);
  const computedCalibrationRunDetailDataList = ref<AlternativeIterationCalibrationRunData[]>([]);
  const computedtuningParametersDataList = ref<AlternativeIterationTuningParameters[]>([]);

  const fetchCalibrationRunDetailDataList = async () => {
    const { data } = await useFetch<AlternativeIterationCalibrationRunData[]>('/api/evaluation/run_detail_data', {
      'method': 'POST'
    })
    calibrationRunDetailDataList.value = data.value ?? [];
    if ( calibrationRunDetailDataList.value ) {
      let headerRow = <DynamicTableColumnHeader[]>[];
      const rowData = calibrationRunDetailDataList.value[0];
      Object.keys( rowData ).forEach( key => {
        headerRow.push({
          header: key.charAt(0).toUpperCase() + key.slice(1),
          colspan: 1,
          field: key
        });
        calibrationRunDetailTableColumn.value.push({ field: key });
      })
      calibrationRunDetailDataListHeaders.value.push( headerRow );
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
  }
  
  const fetchTuningParametersDataList = async () => {
    const { data } = await useFetch<AlternativeIterationTuningParameters[]>('/api/evaluation/corresponding_calibraiton_tuning_param_data', {
      'method': 'POST'
    })
    tuningParametersDataList.value = data.value ?? [];

    if ( tuningParametersDataList.value ) {
      let headerRow = <DynamicTableColumnHeader[]>[];
      const rowData = tuningParametersDataList.value[0];
      Object.keys( rowData ).forEach( key => {
        headerRow.push({
          header: key.charAt(0).toUpperCase() + key.slice(1),
          colspan: 1
        });
        tuningParametersTableColumn.value.push({ field: key });
      })
      tuningParametersDataListHeaders.value.push( headerRow );
      const subheader_spacer_colspan = headerRow.length - 1
      tuningParametersDataList.value.forEach( rowData => {
        if ( isNumeric( rowData.iteration ) === false ) {
          headerRow = [];
          headerRow.push({
            header: rowData.worker,
            colspan: 1
          });
          headerRow.push({
            header: String( rowData.iteration ),
            colspan: subheader_spacer_colspan
          });
          tuningParametersDataListHeaders.value.push( headerRow );
        } else {
          computedtuningParametersDataList.value.push( rowData );
        }
      });
    }
  }
  
  const sortCalibrationRunDetailDataList = ( field: string ) => {
    console.log( field );
    console.log( computedCalibrationRunDetailDataList.value );
  }

  const sortTuningParametersDataList = ( field: string ) => {
    console.log( field );
    console.log( computedtuningParametersDataList.value );
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
    fetchCalibrationRunDetailDataList,
    fetchTuningParametersDataList,
    calibrationRunDetailTableColumn,
    tuningParametersTableColumn,
    resetEvaluationAltIterationStore,
    sortCalibrationRunDetailDataList,
    sortTuningParametersDataList,
    computedCalibrationRunDetailDataList,
    computedtuningParametersDataList
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