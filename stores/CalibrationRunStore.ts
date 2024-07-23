// @ts-check

import { defineStore } from "pinia";
import { mockedCalibrationRunData } from "@/mockApi/calibrationRunData"

interface CalibrationRun {
  runId: number,
  formulationName: string,
  headwaterBasinGage: string,
  runDate: string,
  calibrationPeriod: string,
  status: string
}

export const useCalibrationRunStore = defineStore( 'CalibrationRunStore', () => {
  const calibrationRuns = ref<CalibrationRun[]>([])

  async function retrieveCalibrationRuns(): Promise<void> {
    const listCalibrationRuns = await mockedCalibrationRunData()
    console.log( listCalibrationRuns )
    listCalibrationRuns.forEach( ( run_data, index ) => {
      console.log( run_data )
      calibrationRuns.value.push( run_data )
    })
    console.log( listCalibrationRuns )
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
  import.meta.hot.accept(acceptHMRUpdate(useCalibrationStore, import.meta.hot));
}