// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import type { OptimizationTabData, OptimizationInputData, SelectOption } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/utils/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";

export const useOptimizationStore = defineStore( 'OptimizationStore', () => {
   /**
    * ref section
    */
   const { calibrationJobId } = storeToRefs( generalStore() )
   const { ngencerfBaseUrl } = useBackendConfig();
   const { getAccessToken } = useUserDataStore()
   const userDataStore = useUserDataStore()
   /**
    * ref ui user input
    */
   const data_loading = ref<boolean>(true)
   const optimizationTabData = ref<OptimizationTabData>()
   const uiStreamFlowThreshold = ref<number>()
   const uiPeakFlowThreshold = ref<number>()
   const uiOptimizationInputs = ref<UserCalibrationRunOptimizationInputData[]>([])
   const uiOptimization = ref<string>("")
   const uiOptimizationInputs = ref<OptimizationInputData[]>([])
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

   /**
    * return computed array of UserCalibrationRunOptimizationInputData type 
    * @return {UserCalibrationRunOptimizationInputData[]}
    */
   const getOptimizationInputUserData = computed( () => { 
      let data_items: UserCalibrationRunOptimizationInputData[] = []  
      let optimization_data = optimizationTabData.value?.optimizations.filter( ( optimization_option ) => optimization_option.name ==  uiOptimization.value )
      
      optimization_data?.forEach( ( data ) => {
         data.inputs.forEach( ( data_input ) => {
            let data_item = {
               name: data_input.name,
               value: 0
            }
            let user_optimization_input = userCalibrationRunData.value?.optimization_inputs.filter( ( optimization_input ) => optimization_input.name == data_input.name )
            if( user_optimization_input && user_optimization_input.length ) data_item.value = user_optimization_input[0].value
            
            data_items.push( data_item )
         } )
      })
      
      return data_items
   })

   /**
    * return save formulation tab response from the server
    * @returns {GeneralSaveTabResponse}
    */
   async function saveOptimizationTabData() {
      const saveOptimizationTabDataResponse = await makeProtectedApiCall<GeneralSaveTabResponse>( `${ngencerfBaseUrl}/calibration/save_optimization_tab/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { 
            calibration_run_id: calibrationJobId.value, 
            optimization_inputs: uiOptimizationInputs.value,
            optimization: uiOptimization.value,
            objective_function: uiObjectiveFunction.value,
            streamflow_threshold: uiStreamFlowThreshold.value,
            peak_flow_threshold: uiPeakFlowThreshold.value,
            stop_criteria: uiStopCriteria.value,
            plot_frequency: uiPlotFrequency.value
         } )
      })
      
      return saveOptimizationTabDataResponse
   }

   const getSelectedMetricInfo = computed( () => {
      const selectedMetric = optimizationTabData.value?.metrics.filter( (metric_data) => metric_data.name == uiObjectiveFunction.value )
      return selectedMetric
   })

   const resetOptimizationInputs = () => {
      uiOptimizationInputs.value.forEach( ( input_data ) => {
         input_data.value = 0
      } )
   }

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
      uiStreamFlowThreshold,
      userCalibrationRunData,
      getOptimizationAlgorithmOptionsList,
      getObjectiveFunctionOptionsList,
      showObjectiveFunctionPeakFlow,
      showObjectiveFunctionStreamFlow,
      getSelectedMetricInfo,
      getOptimizationInputUserData,
      saveOptimizationTabData,
      resetOptimizationInputs
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