// @ts-check

import { defineStore } from "pinia";

interface CalibrationRun {
  runId: number,
  formulationName: string,
  headwaterBasinGage: string,
  runDate: string,
  calibrationPeriod: string,
  status: string
}

export const useCalibrationStore = defineStore( 'calibrationStore', () => {
  const calibrationRuns
})

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCalibrationStore, import.meta.hot));
}