// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useCalibrationJobCommonStore } from "./CalibrationJobCommonStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import type { select_option } from "~/composables/NextGenModel";

export const useGageStore = defineStore( 'GageStore', () => {
   const calibrationJobCommonStore = useCalibrationJobCommonStore()
   const { current_calibration_job_id } = storeToRefs( calibrationJobCommonStore )
   //const selected_calibration_run_id = ref<number>(0)
   const domain_options_list = ref<select_option[]>([])
   const gage_options_list = ref<select_option[]>([])

   const selected_domain_value = ref<string>("")
   const selected_gage_value = ref<string>("")
   const selected_forcing_value = ref<string>("")
   const selected_observational_value = ref<string>("")
   const isNWMv3 = ref<boolean>(false)

   console.log( 'usefetch' )
   console.log( current_calibration_job_id.value )
   const { data: gage_tab_data, refresh: refresh_gage_tab_data, status: load_gage_tab_status } = useFetch( '/api/calibration/load_gage_tab', {
      'method': 'POST',
      headers: { authorization: useUserDataStore().getUserToken() },
      //body: selected_calibration_run_id
      body: JSON.stringify( { calibration_run_id: current_calibration_job_id.value } )
   })

   const fetch_gage_tab_data = computed( () => {
      return gage_tab_data.value ?? {
            "calibration_run_id": 0,
            "status": "",
            "gage": {
               "gage_Id": "",
               "agency": "",
               "station_name": "",
               "latitude": null,
               "longitude": null,
               "altitude": null
            },
            "forcing_user_dir": "",
            "forcing_source": "",
            "forcing_user_filename": "",
            "observational_dir": "",
            "observational_source": "",
            "observational_user_filename": "",
            "domain_values": [],
            "gages": []
         }
      /*
      console.log( fetch_gage_tab_data )
      console.log( gage_tab_data )
      console.log( load_gage_tab_status )
      if( gage_tab_data.value? ) {
         return gage_tab_data.value
      } else  {
         return {
         "calibration_run_id": 0,
         "status": "",
         "gage": {
            "gage_Id": "",
            "agency": "",
            "station_name": "",
            "latitude": null,
            "longitude": null,
            "altitude": null
         },
         "forcing_user_dir": "",
         "forcing_source": "",
         "forcing_user_filename": "",
         "observational_dir": "",
         "observational_source": "",
         "observational_user_filename": "",
         "domain_values": [],
         "gages": []
         }
      }
      */
   })

   const get_domain_options_list = computed( () => {
      gage_tab_data.value?.domain_values.forEach( ( domain_value ) => {
         domain_options_list.value.push({
            name: domain_value,
            code: domain_value
         })
      })
      
      return domain_options_list.value
   })

   const get_gage_options_list = computed( () => {
      gage_options_list.value = []
      gage_tab_data.value?.gages.forEach( ( gage_value ) => {
         if( gage_value.domain == selected_domain_value.value ) {
            if( ( isNWMv3.value == true && gage_value.nmnv3_calibrated_gage == true ) || isNWMv3.value == false ) {
               gage_options_list.value.push({
                  name: gage_value.gage_id,
                  code: gage_value.gage_id
               })
            }
         }
      })
      console.log( gage_options_list.value)

      return gage_options_list.value
   })

   const get_forcing_options_list = computed( () => {
      return gage_tab_data.value?.forcing_values
   })

   const get_observational_options_list = computed( () => {
      return gage_tab_data.value?.observational_values
   })

   async function save_gage_tab_data() {
      const response = await $fetch( '/api/calibration/save_gage_tab', {
         method: "POST",
         headers: { authorization: useUserDataStore().getUserToken() },
         body: JSON.stringify( { calibration_run_id: current_calibration_job_id.value, gage_id: selected_gage_value, forcing_source: selected_forcing_value, observational_source: selected_observational_value } )
      })

      return response
   }

   return {
      //selected_calibration_run_id,
      selected_domain_value,
      selected_forcing_value,
      selected_gage_value,
      selected_observational_value,
      current_calibration_job_id,
      fetch_gage_tab_data,
      refresh_gage_tab_data,
      gage_tab_data,
      load_gage_tab_status,
      get_domain_options_list,
      get_gage_options_list,
      get_forcing_options_list,
      get_observational_options_list,
      save_gage_tab_data,
      isNWMv3
   }
})

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
   import.meta.hot.accept(acceptHMRUpdate(useGageStore, import.meta.hot));
}