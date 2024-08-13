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
   const { current_calibration_job_id } = storeToRefs( calibrationJobCommonStore )
   const filter_group = ref<string>("")
   const selected_module_values = ref<string[]>([])
   const formulation_name_input = ref<string>("")
   const sloth_parameter_inputs = ref<sloth_parameter_data[]>([])
   const use_sloth_parameters = ref<boolean>( false )

   /**
    * query load_formulation_tab API on store mount
    */
   const { data: formulation_tab_data, refresh: refresh_formulation_tab_data, status: load_formulation_tab_status } = useFetch( '/api/calibration/load_formulation_tab', {
      method: 'POST',
      headers: { Athorization: `Bearer: ${useUserDataStore().getAccessToken()}` },
      body: JSON.stringify( { calibration_run_id: current_calibration_job_id.value } )
   })

   const fetch_formulation_module_options = computed( () => {
      let modules_list = <select_option[]>[]
      formulation_tab_data.value?.modules.forEach( ( module_data ) => {
         if( !filter_group.value || module_data.groups.includes( filter_group.value ) ) {
            modules_list.push( {
               name: module_data.name,
               code: module_data.name
            } )
         }
      })
      return modules_list
   })

   function fetch_module_covered_group_list() {
      let groups_list = <string[]>[]
      formulation_tab_data.value?.modules.forEach( ( module_data ) => {
         groups_list = [ ...new Set([ ...groups_list, ...module_data.groups ]) ]
      })
      return groups_list
   }

   const fetch_formulation_module_covered_groups = computed( () => {      
      return fetch_module_covered_group_list()
   })

   function selected_module_covered_groups() {
      let selected_groups = <string[]>[]
      formulation_tab_data.value?.modules.forEach( ( module_data ) => {
         if( selected_module_values.value.includes( module_data.name ) ) {
            selected_groups = selected_groups.concat( module_data.groups )
         }
      })      
      return selected_groups
   }
   const fetch_formulation_module_covered_group_filter_options = computed( () => {
      let group_options_list = <select_option[]>[{
         name: "ALL",
         code: ""
      }]
      let groups_list = fetch_module_covered_group_list()
      groups_list.forEach( ( group ) => {
         group_options_list.push( {
            name: group,
            code: group
         } )
      })
      return group_options_list
   })

   const fetch_formulation_module_covered_group_options = computed( () => {
      let group_options_list = <select_option[]>[]
      let groups_list = fetch_module_covered_group_list()
      const selected_groups = selected_module_covered_groups()
      groups_list.forEach( ( group ) => {
         let option_data = {
            name: group,
            code: group,
            selected: false
         }
         if( selected_groups.includes( group ) ) option_data[ 'selected' ] = true
         group_options_list.push( option_data )
      })
      return group_options_list
   })

   function add_new_sloth_variable( variable_name:string ): void {
      sloth_parameter_inputs.value.push({
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

   async function save_formulation_tab_data() {
      const response = await $fetch( '/api/calibration/save_formulation_tab', {
         method: "POST",
         headers: { Athorization: `Bearer: ${useUserDataStore().getAccessToken()}` },
         body: JSON.stringify( { 
            calibration_run_id: current_calibration_job_id.value, 
            formulation_name: formulation_name_input.value, 
            modules: selected_module_values.value, 
            use_sloth: use_sloth_parameters.value,
            sloth_parameters: sloth_parameter_inputs.value
         })
      })

      return response
   }

   return {
      formulation_tab_data,
      filter_group,
      use_sloth_parameters,
      selected_module_values,
      formulation_name_input,
      sloth_parameter_inputs,
      refresh_formulation_tab_data,
      load_formulation_tab_status,
      fetch_formulation_module_options,
      fetch_formulation_module_covered_groups,
      fetch_formulation_module_covered_group_filter_options,
      fetch_formulation_module_covered_group_options,
      add_new_sloth_variable,
      save_formulation_tab_data
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