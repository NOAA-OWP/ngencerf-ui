// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/utils/UserAuth"
import type { select_option, gage_tab_data, save_gage_tab_response } from "~/composables/NextGenModel";

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
   const { ngencerfBaseUrl } = useBackendConfig();
   const { getAccessToken } = useUserDataStore()
   const gageTabData = ref<gage_tab_data>()
   const gageData = ref<gage_data>()
   const data_loading = ref<boolean>(true)

   /**
    * query load_gage_tab api on store mount
    */
   // const { data: gageTabData, refresh: refreshGageTabData, status: loadGageTabStatus } = useFetch( '/api/calibration/load_gage_tab', {
   //    'method': 'POST',
   //    headers: { Authorization: `Bearer ${useUserDataStore().getAccessToken()}` },
   //    body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
   // })

   makeProtectedApiCall<gage_tab_data>( `${ngencerfBaseUrl}/calibration/load_gage_tab/`, {
      method: "POST",
      headers: { 
         "Authorization": `Bearer ${getAccessToken()}`,
         "Content-Type": 'application/json'
      },
      body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
   } ).then( ( gageTabDataResult ) => {
      console.log( 'gage tab data from gageStore', gageTabDataResult )
      gageTabData.value = gageTabDataResult??undefined
      data_loading.value = false
      selectedDomainValue.value = getSavedDomainValue.value ?? ""
      selectedGageValue.value = gageTabData.value?.gage.gage_id ?? ""
      selectedForcingValue.value = gageTabData.value?.forcing_source ?? ""
      selectedObservationalValue.value = gageTabData.value?.observational_source ?? ""
      gageData.value = gageTabData.value?.gage ?? undefined
   })
   
   async function queryGageTabData() {
      const gageTabDataResult = await makeProtectedApiCall<any>( `${ngencerfBaseUrl}/calibration/load_gage_tab/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
      } )
      console.log( gageTabDataResult )
      gageTabData.value = gageTabDataResult??undefined
   }

   async function refreshGageTabData() {
      await queryGageTabData()
   }

   const fetchGageTabData = computed( () => {
      return gageTabData.value ?? navigateTo('/PreviousRuns');
   })

   const getSavedDomainValue = computed( () => {
      if( gageTabData.value?.gage == undefined || gageTabData.value?.gage.gage_id == "" ) {
         return ""
      } else {
         let selected_gage_item = gageTabData.value?.gages.find( ( gage_item ) => gage_item.gage_id == gageTabData.value?.gage.gage_id )
         return selected_gage_item?.domain
      }      
   })

   const getDomainOptionsList = computed( () => {
      domainOptionsList.value = []
      gageTabData.value?.domain_values.forEach( ( domain_value ) => {
         domainOptionsList.value.push({
            name: domain_value.name,
            description: domain_value.description
         })
      })
      
      return domainOptionsList.value
   })

   const getGageOptionsList = computed( () => {
      gageOptionsList.value = []
      gageTabData.value?.gages.forEach( ( gage_value ) => {
         if( selectedDomainValue.value == "" || gage_value.domain == selectedDomainValue.value ) {
            if( ( isNWMv3.value == true && gage_value.nwm_v3_calibrated == true ) || isNWMv3.value == false ) {
               gageOptionsList.value.push({
                  name: gage_value.gage_id,
                  description: gage_value.gage_id
               })
            }
         }
      })

      return gageOptionsList.value
   })

   const getForcingOptionsList = computed( () => {
      return gageTabData.value?.forcing_source_values
   })

   const getObservationalOptionsList = computed( () => {
      return gageTabData.value?.observational_source_values
   })

   async function fetchSelectedGageData(): Promise<void> {
      const selectedGageDataResponse = await makeProtectedApiCall<gage_data>( `${ngencerfBaseUrl}/calibration/get_gage/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { 
            gage_id: selectedGageValue.value
         })
      })
      gageData.value = selectedGageDataResponse ?? undefined
   }

   
   async function saveGageTabData(): Promise<save_gage_tab_response> {
      const saveGageTabDataResponse = await makeProtectedApiCall<any>( `${ngencerfBaseUrl}/calibration/save_gage_tab/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { 
            calibration_run_id: calibrationJobId.value, 
            gage_id: selectedGageValue.value, 
            forcing_source: selectedForcingValue.value, 
            observational_source: selectedObservationalValue.value
         } )
      })
      
      return saveGageTabDataResponse
   }

   return {
      //selected_calibration_run_id,
      selectedDomainValue,
      selectedForcingValue,
      selectedGageValue,
      selectedObservationalValue,
      //fetchGageTabData,
      queryGageTabData,
      refreshGageTabData,
      getSavedDomainValue,
      gageTabData,
      getDomainOptionsList,
      getGageOptionsList,
      getForcingOptionsList,
      getObservationalOptionsList,
      saveGageTabData,
      isNWMv3,
      fetchSelectedGageData,
      gageData,
      data_loading
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