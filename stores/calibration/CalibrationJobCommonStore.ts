// @ts-check

import { defineStore } from "pinia";

export const useCalibrationJobCommonStore = defineStore( 'CalibrationJobCommonStore', () => {
  const current_calibration_job_id = ref<number>(0)
  
  return {
    current_calibration_job_id
  }
})

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCalibrationJobCommonStore, import.meta.hot));
}