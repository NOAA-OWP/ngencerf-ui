// @ts-check

import { defineStore } from "pinia";
import { mockedCalibrationRunData } from "@/mockApi/calibrationRunData"
import { mockedJobListItemData } from "~/mockApi/calibrationAPIData";
import { useUserDataStore } from "./common/UserDataStore";
import type { CalibrationRun, jobs_list, job_list_item, user } from "~/composables/NextGenModel";

export const useCalibrationJobStore = defineStore( 'CalibrationJobStore', () => {
  const { getUserToken } = useUserDataStore()
  const selected_job = ref<number>(0)

  const { data: jobs_list_data, refresh: refresh_job_list_data } = useFetch( '/api/get_jobs', {
    //headers: { authorization: getUserToken() }
  })

  const fetch_jobs_list_data = computed( () => {
    return jobs_list_data.value?.data ?? []
  })

  const saved_calibration_jobs = computed( () => {
    console.log( jobs_list_data.value )
    return jobs_list_data.value?.data.reduce( ( total_saved_jobs: number, job: job_list_item  ) => {
      if( job.status == 'saved' ) total_saved_jobs += 1;
      return total_saved_jobs;
    }, 0 )
  })

  const running_calibration_jobs = computed( () => {
    return jobs_list_data.value?.data.reduce( ( total_running_jobs: number, job: job_list_item  ) => {
      if( job.status == 'running' ) total_running_jobs += 1;
      return total_running_jobs;
    }, 0 )
  })

  return {
    fetch_jobs_list_data,
    refresh_job_list_data,
    selected_job,
    saved_calibration_jobs,
    running_calibration_jobs,
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