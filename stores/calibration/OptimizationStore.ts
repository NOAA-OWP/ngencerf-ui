// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import type { optimization_tab_data, optimization_input_data, select_option } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/utils/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";

export const useOptimizationStore = defineStore( 'OptimizationStore', () => {
   /**
    * ref section
    */
   const { calibrationJobId } = storeToRefs( generalStore() )
   const { ngencerfBaseUrl } = useBackendConfig();
   const { getAccessToken } = useUserDataStore()
   /**
    * ref ui user input
    */
   const data_loading = ref<boolean>(true)
   const optimizationTabData = ref<optimization_tab_data>()
   const uiStreamFlowThreshold = ref<number>()
   const uiPeakFlowThreshold = ref<number>()
   const uiMetric = ref<string>("")
   const uiOptimization = ref<string>("")
   const uiOptimizationInputs = ref<optimization_input_data[]>([])
   const uiObjectiveFunction = ref<string>("")
   const uiPlotFrequency = ref<number>(0)
   const uiStopCriteria = ref<number>(0)

   makeProtectedApiCall<any>( `${ngencerfBaseUrl}/calibration/load_optimization_tab/`, {
      method: "POST",
      headers: { 
         "Authorization": `Bearer ${getAccessToken()}`,
         "Content-Type": 'application/json'
      },
      body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
   } ).then( ( optimizationTabDataResult ) => {
      console.log( 'load optimization data from optimizationStore', optimizationTabDataResult )
      optimizationTabData.value = optimizationTabDataResult ?? undefined
      data_loading.value = false
   })

   return {
      optimizationTabData,
      data_loading,
      uiMetric,
      uiObjectiveFunction,
      uiOptimization,
      uiOptimizationInputs,
      uiPeakFlowThreshold,
      uiPlotFrequency,
      uiStopCriteria,
      uiStreamFlowThreshold
   }
})

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
   import.meta.hot.accept(acceptHMRUpdate(useOptimizationStore, import.meta.hot));
}