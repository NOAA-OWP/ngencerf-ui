// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import type { CalibrationIsReadyResponse, CalibrationPlotListNamesData } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/utils/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";

export const useRunStatusStore = defineStore( 'RunStatusStore', () => {
   /**
    * default ref section
    */
   const { calibrationJobId } = storeToRefs( generalStore() )
   const { ngencerfBaseUrl } = useBackendConfig();
   const { getAccessToken } = useUserDataStore()
   const userDataStore = useUserDataStore()
   /**
    * ref ui user input
    */
   const data_loading = ref<boolean>(true)
   const calibrationIsReady = ref<boolean>( false )

   /**
    * check if calibration job is ready
    * @return {void}
    */
   const queryCalibrationIsReady = async (): Promise<void> => {
      makeProtectedApiCall<CalibrationIsReadyResponse>( `${ngencerfBaseUrl}/calibration/is_ready/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
      } ).then( ( isReadyResponse ) => {
         console.log( 'RunStatusStore isReadyResponse', isReadyResponse )
      })
   }

   /**
    * check if calibration job is ready
    * @return {void}
    */
   const queryGetPlotNames = async (): Promise<void> => {
      makeProtectedApiCall<CalibrationPlotListNamesData>( `${ngencerfBaseUrl}/calibration/get_plot_names/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
      } ).then( ( plotListNamesResponse ) => {
         console.log( 'RunStatusStore queryGetPlotNames', plotListNamesResponse )
      })
   }

   queryGetPlotNames()

   const executeRunCalibration = async (): Promise<any> => {
      const runCalibrationResponse = makeProtectedApiCall<any>( `${ngencerfBaseUrl}/calibration/run_calibration/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
      } )
      return runCalibrationResponse
   }

   const queryReportIteration = async (): Promise<any> => {
      const reportIterationResponse = makeProtectedApiCall<any>( `${ngencerfBaseUrl}/calibration/report_iteration/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
      } )
      return reportIterationResponse
   } 

   return [
      queryCalibrationIsReady,
      queryGetPlotNames,
      executeRunCalibration,
      queryReportIteration
   ]
})

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
   import.meta.hot.accept(acceptHMRUpdate(useRunStatusStore, import.meta.hot));
}