// @ts-check

import { defineStore } from "pinia";
import { mockedCalibrationRunData } from "@/mockApi/calibrationRunData"
import type { CalibrationRun } from "~/composables/NextGenModel";

export const useCalibrationRunStore = defineStore( 'CalibrationRunStore', () => {
  const calibrationRuns = ref<CalibrationRun[]>([])

  async function retrieveCalibrationRuns(): Promise<void> {
    const listCalibrationRuns = await mockedCalibrationRunData()
    listCalibrationRuns.forEach( ( run_data, index ) => {
      console.log( run_data )
      calibrationRuns.value.push( run_data )
    })
  }

  return {
    retrieveCalibrationRuns,
    calibrationRuns,    
  }
})

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCalibrationRunStore, import.meta.hot));
}