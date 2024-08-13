// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { mockedJobListItemData } from "~/mockApi/calibrationAPIData";
import { useUserDataStore } from "./common/UserDataStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { useCalibrationJobCommonStore } from "./calibration/CalibrationJobCommonStore";
import type { CalibrationRun, jobs_list, job_list_item, user } from "~/composables/NextGenModel";

export const useCalibrationJobStore = defineStore( 'CalibrationJobStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore()
  const calibrationJobCommonStore = useCalibrationJobCommonStore()
  const { current_calibration_job_id } = storeToRefs( calibrationJobCommonStore )

  const { data: jobs_list_data, refresh: refresh_job_list_data } = useFetch( '/api/get_jobs', {
    headers: { Athorization: `Bearer: ${getAccessToken()}` }
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
  /*
  const show_gage_tab_data = computed( () => {
    //selected_calibration_run_id.value = selected_job.value
    return fetch_gage_tab_data
  })
  */

  const running_calibration_jobs = computed( () => {
    return jobs_list_data.value?.data.reduce( ( total_running_jobs: number, job: job_list_item  ) => {
      if( job.status == 'running' ) total_running_jobs += 1;
      return total_running_jobs;
    }, 0 )
  })

  async function fetch_new_calibration_run_id() {
    const { data: new_calibration_job_id } = await useFetch( '/api/calibration/create_calibration_run', {
      method: "POST",
      headers: { Athorization: `Bearer: ${getAccessToken()}` }
    })
    return new_calibration_job_id
  }

  return {
    fetch_jobs_list_data,
    refresh_job_list_data,
    //selected_job,
    current_calibration_job_id,
    saved_calibration_jobs,
    running_calibration_jobs,
    fetch_new_calibration_run_id
    // show_gage_tab_data,
    // refresh_gage_tab_data
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