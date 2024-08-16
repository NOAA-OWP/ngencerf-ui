// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useCalibrationJobCommonStore } from "./CalibrationJobCommonStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import type { select_option, sloth_parameter_data } from "~/composables/NextGenModel";

export const useFormulationStore = defineStore( 'FormulationStore', () => {
   /**
    * init store
    */
   const calibrationJobCommonStore = useCalibrationJobCommonStore()

   /**
    * define ref
    */
   const { currentCalibrationJobId } = storeToRefs( calibrationJobCommonStore )
   const filterGroup = ref<string>("")
   const selectedModuleValues = ref<string[]>([])
   const formulationNameInput = ref<string>("")
   const slothParameterInputs = ref<sloth_parameter_data[]>([])
   const useSlothParameters = ref<boolean>( false )

   /**
    * query load_formulation_tab API on store mount
    */
   const { data: formulationTabData, refresh: refreshFormulationTabData, status: loadFormulationTabStatus } = useFetch( '/api/calibration/load_formulation_tab', {
      method: 'POST',
      headers: { Athorization: `Bearer: ${useUserDataStore().getAccessToken()}` },
      body: JSON.stringify( { calibration_run_id: currentCalibrationJobId.value } )
   })

   const fetchFormulationModulOptions = computed( () => {
      let modules_list = <select_option[]>[]
      formulationTabData.value?.modules.forEach( ( moduleData ) => {
         if( !filterGroup.value || moduleData.groups.includes( filterGroup.value ) ) {
            modules_list.push( {
               name: moduleData.name,
               code: moduleData.name
            } )
         }
      })
      return modules_list
   })

   function fetchModuleCoveredGroupList() {
      let groupsList = <string[]>[]
      formulationTabData.value?.modules.forEach( ( moduleData ) => {
         groupsList = [ ...new Set([ ...groupsList, ...moduleData.groups ]) ]
      })
      return groupsList
   }

   const fetchFormulationModuleCoveredGroups = computed( () => {      
      return fetchModuleCoveredGroupList()
   })

   function selectedModuleCoveredGroups() {
      let selectedGroups = <string[]>[]
      formulationTabData.value?.modules.forEach( ( moduleData ) => {
         if( selectedModuleValues.value.includes( moduleData.name ) ) {
            selectedGroups = selectedGroups.concat( moduleData.groups )
         }
      })      
      return selectedGroups
   }
   const fetchFormulationModuleCoveredGroupFilterOptions = computed( () => {
      let groupOptionsList = <select_option[]>[{
         name: "ALL",
         code: ""
      }]
      let groups_list = fetchModuleCoveredGroupList()
      groups_list.forEach( ( group ) => {
         groupOptionsList.push( {
            name: group,
            code: group
         } )
      })
      return groupOptionsList
   })

   const fetchFormulationModuleCoveredGroupOptions = computed( () => {
      let groupOptionsList = <select_option[]>[]
      let groupsList = fetchModuleCoveredGroupList()
      const selectedGroups = selectedModuleCoveredGroups()
      groupsList.forEach( ( group ) => {
         let option_data = {
            name: group,
            code: group,
            selected: false
         }
         if( selectedGroups.includes( group ) ) option_data[ 'selected' ] = true
         groupOptionsList.push( option_data )
      })
      return groupOptionsList
   })

   function addNewSlothVariable( variable_name:string ): void {
      slothParameterInputs.value.push({
         "param_name": variable_name,
         "param_count": 1,
         "param_type": "",
         "param_units": "",
         "param_location": "node",
         "param_value": 0.0,
         "maps_to_module": "",
         "maps_to_variable_name": ""
      })
   }

   async function saveFormulationTabData() {
      const response = await $fetch( '/api/calibration/save_formulation_tab', {
         method: "POST",
         headers: { Athorization: `Bearer: ${useUserDataStore().getAccessToken()}` },
         body: JSON.stringify( { 
            calibration_run_id: currentCalibrationJobId.value, 
            formulation_name: formulationNameInput.value, 
            modules: selectedModuleValues.value, 
            use_sloth: useSlothParameters.value,
            sloth_parameters: slothParameterInputs.value
         })
      })

      return response
   }

   return {
      formulationTabData,
      filterGroup,
      useSlothParameters,
      selectedModuleValues,
      formulationNameInput,
      slothParameterInputs,
      refreshFormulationTabData,
      loadFormulationTabStatus,
      fetchFormulationModulOptions,
      fetchFormulationModuleCoveredGroups,
      fetchFormulationModuleCoveredGroupFilterOptions,
      fetchFormulationModuleCoveredGroupOptions,
      addNewSlothVariable,
      saveFormulationTabData
   }
})

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
   import.meta.hot.accept(acceptHMRUpdate(useFormulationStore, import.meta.hot));
}