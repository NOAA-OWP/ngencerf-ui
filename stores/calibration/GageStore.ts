// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import type { select_option } from "~/composables/NextGenModel";

export const useGageStore = defineStore( 'GageStore', () => {
   /**
    * ref section
    */
   const { calibrationJobId } = storeToRefs( generalStore() )
   const domainOptionsList = ref<select_option[]>([])
   const gageOptionsList = ref<select_option[]>([])
   const selectedDomainValue = ref<string>("")
   const selectedGageValue = ref<string>("")
   const selectedForcingValue = ref<string>("")
   const selectedObservationalValue = ref<string>("")
   const isNWMv3 = ref<boolean>(false)

   /**
    * query load_gage_tab api on store mount
    */
   const { data: gageTabData, refresh: refreshGageTabData, status: loadGageTabStatus } = useFetch( '/api/calibration/load_gage_tab', {
      'method': 'POST',
      headers: { Authorization: `Bearer ${useUserDataStore().getAccessToken()}` },
      body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
   })

   const fetchGageTabData = computed( () => {
      return gageTabData.value ?? {
         "calibration_run_id": 0,
         "status": "",
         "gage": {
            "gage_id": "",
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
   })

   const getDomainOptionsList = computed( () => {
      gageTabData.value?.domain_values.forEach( ( domain_value ) => {
         domainOptionsList.value.push({
            name: domain_value,
            code: domain_value
         })
      })
      
      return domainOptionsList.value
   })

   const getGageOptionsList = computed( () => {
      gageOptionsList.value = []
      gageTabData.value?.gages.forEach( ( gage_value ) => {
         if( gage_value.domain == selectedDomainValue.value ) {
            if( ( isNWMv3.value == true && gage_value.nmnv3_calibrated_gage == true ) || isNWMv3.value == false ) {
               gageOptionsList.value.push({
                  name: gage_value.gage_id,
                  code: gage_value.gage_id
               })
            }
         }
      })
      console.log( gageOptionsList.value)

      return gageOptionsList.value
   })

   const getForcingOptionsList = computed( () => {
      return gageTabData.value?.forcing_values
   })

   const getObservationalOptionsList = computed( () => {
      return gageTabData.value?.observational_values
   })

   async function saveGageTabData() {
      const response = await $fetch( '/api/calibration/save_gage_tab', {
         method: "POST",
         headers: { Authorization: `Bearer ${useUserDataStore().getAccessToken()}` },
         body: JSON.stringify( { calibration_run_id: calibrationJobId.value, gage_id: selectedGageValue, forcing_source: selectedForcingValue, observational_source: selectedObservationalValue } )
      })

      return response
   }

   return {
      //selected_calibration_run_id,
      selectedDomainValue,
      selectedForcingValue,
      selectedGageValue,
      selectedObservationalValue,
      fetchGageTabData,
      refreshGageTabData,
      gageTabData,
      loadGageTabStatus,
      getDomainOptionsList,
      getGageOptionsList,
      getForcingOptionsList,
      getObservationalOptionsList,
      saveGageTabData,
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