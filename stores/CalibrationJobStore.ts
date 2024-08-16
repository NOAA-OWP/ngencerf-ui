// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "./common/UserDataStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { generalStore } from "./common/GeneralStore";
import type { job_list_item } from "~/composables/NextGenModel";

export const useCalibrationJobStore = defineStore( 'CalibrationJobStore', () => {
   const { ngencerfBaseUrl } = useBackendConfig();
   const { getAccessToken } = useUserDataStore()
   const { calibrationJobId } = storeToRefs( generalStore() )

   const { data: jobsListData, refresh: refreshJobListData } = useFetch( '/api/get_jobs', {
      headers: { Authorization: `Bearer ${getAccessToken()}` }
   })

   /**
   * returns list of calibration job data from server
   * @returns {job_list_item[]}
   */
   const fetchJobsListData = computed( () => {
      return jobsListData.value?.data ?? []
   })

   /**
   * based on the current user's list of calibration job return number of job with status of "saved"
   * @returns {number}
   */
   const savedCalibrationJobs = computed( () => {
      console.log( jobsListData.value )
      return jobsListData.value?.data.reduce( ( total_saved_jobs: number, job: job_list_item  ) => {
         if( job.status == 'saved' ) total_saved_jobs += 1;
         return total_saved_jobs;
      }, 0 )
   })

   /**
   * based on the current user's list of calibration job return number of job with status of "running"
   * @returns {number}
   */
   const runningCalibrationJobs = computed( () => {
      return jobsListData.value?.data.reduce( ( total_running_jobs: number, job: job_list_item  ) => {
         if( job.status == 'running' ) total_running_jobs += 1;
         return total_running_jobs;
      }, 0 )
   })

   /**
   * return a new calibration run id generated from the server
   * @returns {number}
   */
   async function fetchNewCalibrationRunId() {
      const { data: new_calibration_job_id } = await useFetch( '/api/calibration/create_calibration_run', {
         method: "POST",
         headers: { Authorization: `Bearer ${getAccessToken()}` }
      })
      return new_calibration_job_id
   }

   return {
      fetchJobsListData,
      refreshJobListData,
      calibrationJobId,
      savedCalibrationJobs,
      runningCalibrationJobs,
      fetchNewCalibrationRunId
      // show_gage_tab_data,
      // refreshGageTabData
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