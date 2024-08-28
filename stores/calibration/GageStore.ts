// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/utils/UserAuth"
import type { SelectOption, GageTabData, SaveGageTabResponse } from "~/composables/NextGenModel";

export const useGageStore = defineStore( 'GageStore', () => {
   /**
    * ref section
    */
   const { calibrationJobId } = storeToRefs( generalStore() )
   const domainOptionsList = ref<SelectOption[]>([])
   const gageOptionsList = ref<SelectOption[]>([])
   const isNWMv3 = ref<boolean>(false)
   const { ngencerfBaseUrl } = useBackendConfig();
   const { getAccessToken } = useUserDataStore()
   const userDataStore = useUserDataStore()
   const { userCalibrationRunData } = storeToRefs( userDataStore )
   const gageTabData = ref<GageTabData>()
   const geopackageImageUrl = ref<string>("")
   const selectedDomainValue = ref<string>("")
   const selectedGageValue = ref<string>("")
   const selectedForcingValue = ref<string>( "")
   const selectedObservationalValue = ref<string>("")
   const gageData = ref<GageData>()
   
   const data_loading = ref<boolean>(true)
   
   /**
    * load static gage tab data with provided calibration job id
    * @return {void}
    */
   async function queryGageTabData() {
      makeProtectedApiCall<GageTabData>( `${ngencerfBaseUrl}/calibration/load_gage_tab/`, {
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
         
         //init ui model value
         geopackageImageUrl.value = userCalibrationRunData.value?.geopackage_image_url ?? ""
         selectedDomainValue.value = getSavedDomainValue.value ?? ""
         selectedGageValue.value = userCalibrationRunData.value?.gage?.gage_id ?? ""
         selectedForcingValue.value = userCalibrationRunData.value?.forcing_source ?? ""
         selectedObservationalValue.value = userCalibrationRunData.value?.observational_source ?? ""
         gageData.value = userCalibrationRunData.value?.gage ?? undefined
      })
   }

   /**
    * get iser se;ected domain name based on the selected gage
    * @returns {string}
    */
   const getSavedDomainValue = computed( () => {
      if( userCalibrationRunData.value?.gage == undefined || userCalibrationRunData.value?.gage.gage_id == "" ) {
         return ""
      } else {
         let selected_gage_item = gageTabData.value?.gages.find( ( gage_item ) => gage_item.gage_id == userCalibrationRunData.value?.gage.gage_id )
         return selected_gage_item?.domain
      }      
   })

   queryGageTabData()

   /**
    * return list of domain options for Select input
    * @returns {SelectOption[]}
    */
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

   /**
    * generate list of gage option for Select input based on the domain value and nwm_v3 filter
    * @returns {SelectOption[]}
    */
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

   /**
    *  fetch gage data based on the selected gage value
    *  @returns {void}
    */
   async function fetchSelectedGageData(): Promise<void> {
      const selectedGageDataResponse = await makeProtectedApiCall<GageData>( `${ngencerfBaseUrl}/calibration/get_gage/`, {
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

   /**
    * return saving gage tab response from the server
    * @returns {SaveGageTabResponse}
    */
   async function saveGageTabData() {
      const saveGageTabDataResponse = await makeProtectedApiCall<SaveGageTabResponse>( `${ngencerfBaseUrl}/calibration/save_gage_tab/`, {
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
      selectedDomainValue,
      selectedForcingValue,
      selectedGageValue,
      selectedObservationalValue,
      queryGageTabData,
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
      data_loading,
      geopackageImageUrl,
      userCalibrationRunData
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