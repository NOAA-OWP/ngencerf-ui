// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { SelectOption, GageTabData, GeneralApiSaveResponse, GeneralErrorResponse, SaveGageTabResponse } from "~/composables/NextGenModel";
import { useCalibrationTabValidation } from "~/composables/ValidationHandlers";

export const useEvaluationCalibrationRunStore = defineStore('EvaluationCalibrationRunStore', () => {
   const calibrationRunList = ref<any[]>([]);

   const fetchEvaluationCalibrationRunList = async () => {
      const { data, status, error } = await useFetch('/api/evaluation/list_jobs');
      console.log( data )
   };

   return {
      calibrationRunList,
      fetchEvaluationCalibrationRunList
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