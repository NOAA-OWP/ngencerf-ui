// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { SelectOption } from "~/composables/NextGenModel";
import { useCalibrationTabValidation } from "~/composables/ValidationHandlers";

export const useEvaluationCalibrationRunStore = defineStore('EvaluationCalibrationRunStore', () => {
   const calibrationRunList = ref<any[]>([]);
   const userSelectedEvalCalibrationRunId = ref<number>( 0 )
   const uiGageId = ref<string>( "" );

   const fetchEvaluationCalibrationRunList = async () => {
      const { data, status, error } = await useFetch('/api/evaluation/list_jobs');
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

   return {
      uiGageId,
      calibrationRunList,
      fetchEvaluationCalibrationRunList,
      filteredEvaluationCalibrationRunList,
      evaluationCalibrationRunGageList,
      userSelectedEvalCalibrationRunId
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