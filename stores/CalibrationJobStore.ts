// @ts-check

import { defineStore } from "pinia";
import { mockedCalibrationRunData } from "@/mockApi/calibrationRunData"
import { useUserDataStore } from "./common/UserDataStore";
import type { CalibrationRun, jobs_list, job_list_item, user } from "~/composables/NextGenModel";

export const useCalibrationJobStore = defineStore( 'CalibrationJobStore', () => {
  const { getUserToken } = useUserDataStore()
  const calibration_jobs_list = ref<job_list_item[]>([])

  const fetchCalibrationJobsList = async () => {
    const headersInit: HeadersInit = {};
    console.log( 'fetchCalibrationJobsList' )
    //const { data }: any = await useFetch( '/mock_api_data/get_jobs.json' )
    await $fetch( '/mock_api_data/get_jobs.json', {
      method: 'GET',
      onRequest( { request, options } ) {
        // options.headers = headersInit || {}
        // options.headers.authorization = getUserToken()
      },
      onResponse({ request, response, options }) {
        response._data.forEach( ( job_data: job_list_item ) => {
          calibration_jobs_list.value.push( job_data )          
        })
      }
    })
  }

  const savedCalibrationJobs = computed( () => {
    return calibration_jobs_list.value.reduce( ( total_saved_jobs: number, job: job_list_item  ) => {
      if( job.status == 'saved' ) total_saved_jobs += 1;
      return total_saved_jobs;
    }, 0)
  })

  // async function retrieveCalibrationRuns(): Promise<void> {
  //   const listCalibrationRuns = await mockedCalibrationRunData()
  //   listCalibrationRuns.forEach( ( run_data, index ) => {
  //     console.log( run_data )
  //     calibrationRuns.value.push( run_data )
  //   })
  // }

  return {
    calibration_jobs_list,
    savedCalibrationJobs,
    fetchCalibrationJobsList
  }
})

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCalibrationJobStore, import.meta.hot));
}