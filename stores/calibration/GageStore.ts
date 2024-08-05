// @ts-check

import { defineStore } from "pinia";

export const useGageStore = defineStore( 'GageStore', () => {
   const selected_calibration_run_id = ref<number>(0)

   const { data: gage_tab_data, refresh: refresh_gage_tab_data } = useFetch( '/api/calibration/load_gage_tab', {
      body: selected_calibration_run_id
   })

   const fetch_gage_tab_data = computed( () => {
      if( gage_tab_data.value ) {
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
   })

   return {
      selected_calibration_run_id,
      fetch_gage_tab_data,
      refresh_gage_tab_data
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