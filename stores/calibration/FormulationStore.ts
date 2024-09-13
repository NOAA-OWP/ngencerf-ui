// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { generalStore } from "../common/GeneralStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import type { SelectOption, FormulationTabData, SlothParameterData, GeneralApiSaveResponse, GeneralErrorResponse } from "~/composables/NextGenModel";

export const useFormulationStore = defineStore( 'FormulationStore', () => {
   /**
    * define ref
    */
   const { calibrationJobId } = storeToRefs( generalStore() )
   const filterGroup = ref<string>("")
   const selectedModuleValues = ref<string[]>([])
   const formulationNameInput = ref<string>("")
   const slothParameterInputs = ref<SlothParameterData[]>([])
   const useSlothParameters = ref<boolean>( false )
   const { ngencerfBaseUrl } = useBackendConfig();
   const { getAccessToken } = useUserDataStore()
   const userDataStore = useUserDataStore()
   const { userCalibrationRunData } = storeToRefs( userDataStore )
   const formulationTabData = ref<FormulationTabData>()
   const data_loading =ref<boolean>(true)

   /**
    * load forumlation tab data and init ref data
    * @returns {void}
    */
   makeProtectedApiCall<FormulationTabData>( `${ngencerfBaseUrl}/calibration/load_formulation_tab/`, {
      method: "POST",
      headers: { 
         "Authorization": `Bearer ${getAccessToken()}`,
         "Content-Type": 'application/json'
      },
      body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
   } ).then( ( formulationTabDataResult ) => {
      formulationTabData.value = formulationTabDataResult._data ?? undefined
      setUserSelection()
      
      data_loading.value = false
   })

   const setUserSelection = (): void => {      
      formulationNameInput.value = userCalibrationRunData.value?.formulation_name ?? ""
      selectedModuleValues.value = getSavedModuleSelection.value ?? []
      useSlothParameters.value = userCalibrationRunData.value?.use_sloth ?? false
      slothParameterInputs.value = userCalibrationRunData.value?.sloth_parameters ?? []
   }

   /**
    * return list of Module Options based on the filter selection
    * @returns {SelectOption[]}
    */
   const fetchFormulationModuleOptions = computed( () => {
      let modules_list = <SelectOption[]>[]
      formulationTabData.value?.modules.forEach( ( moduleData ) => {
         if( !filterGroup.value || moduleData.groups.includes( filterGroup.value ) ) {
            modules_list.push( {
               name: moduleData.name,
               description: moduleData.name
            } )
         }
      })
      return modules_list
   })

   /**
    * return list of unique groups from the module list
    * @returns {string[]}
    */
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

   /**
    * return list of selected group names
    * @returns {string[]}
    */
   function selectedModuleCoveredGroups() {
      let selectedGroups = <string[]>[]
      formulationTabData.value?.modules.forEach( ( moduleData ) => {
         if( selectedModuleValues.value.includes( moduleData.name ) ) {
            selectedGroups = selectedGroups.concat( moduleData.groups )
         }
      })      
      return selectedGroups
   }

   /**
    * return list of selected module name
    * @returns {string[]}
    */
   const getSavedModuleSelection = computed( () => {
      let selectedModules = <string[]>[]
      formulationTabData.value?.modules.forEach( ( moduleData ) => {
         if( moduleData.used_by_calibration_run ) selectedModules.push( moduleData.name )
      })      
      return selectedModules      
   })

   /**
    * return list of group options for the group filter field
    * @returns {SelectOption[]}
    */
   const fetchFormulationModuleCoveredGroupFilterOptions = computed( () => {
      let groupOptionsList = <SelectOption[]>[{
         name: "",
         description: "ALL"
      }]
      let groups_list = fetchModuleCoveredGroupList()
      groups_list.forEach( ( group ) => {
         groupOptionsList.push( {
            name: group,
            description: group
         } )
      })
      return groupOptionsList
   })

   /**
    * return list of group options for the group listbox field
    * @returns {SelectOption[]}
    */
   const fetchFormulationModuleCoveredGroupOptions = computed( () => {
      let groupOptionsList = <SelectOption[]>[]
      let groupsList = fetchModuleCoveredGroupList()
      const selectedGroups = selectedModuleCoveredGroups()
      groupsList.forEach( ( group ) => {
         let option_data = {
            name: group,
            description: group,
            selected: false
         }
         if( selectedGroups.includes( group ) ) option_data[ 'selected' ] = true
         groupOptionsList.push( option_data )
      })
      return groupOptionsList
   })

   /**
    * add new sloth parameter with some default value
    * @param variable_name
    * @returns {void}
    */
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

   /**
    * return save formulation tab response from the server
    * @returns {GeneralApiSaveResponse}
    */
   async function saveFormulationTabData() {
      const saveFormulationTabDataResponse = await makeProtectedApiCall<GeneralApiSaveResponse>( `${ngencerfBaseUrl}/calibration/save_formulation_tab/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { 
            calibration_run_id: calibrationJobId.value, 
            formulation_name: formulationNameInput.value, 
            modules: selectedModuleValues.value, 
            use_sloth: useSlothParameters.value,
            sloth_parameters: slothParameterInputs.value
         } )
      })
      
      return saveFormulationTabDataResponse._data
   }

   /**
    * @returns {void}
    */
   const resetUserSelectionFormulation = (): void => {
      if( userCalibrationRunData.value?.gage ) {
         setUserSelection()
      } else {
         formulationNameInput.value = ""
         selectedModuleValues.value = []
         useSlothParameters.value = false
         slothParameterInputs.value = []
         console.log("ForumlationStore Reset");
      }
   }

   return {
      formulationTabData,
      filterGroup,
      useSlothParameters,
      selectedModuleValues,
      formulationNameInput,
      slothParameterInputs,
      fetchFormulationModuleOptions,
      fetchFormulationModuleCoveredGroups,
      fetchFormulationModuleCoveredGroupFilterOptions,
      fetchFormulationModuleCoveredGroupOptions,
      addNewSlothVariable,
      saveFormulationTabData,
      data_loading,
      resetUserSelectionFormulation
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