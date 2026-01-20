// @ts-check

import { defineStore, storeToRefs, acceptHMRUpdate } from "pinia";
import { getStorageKey } from "~/utils/Storage";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { generalStore } from "@/stores/common/GeneralStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";

import type { CalibrationJobListItem } from "@/composables/NgencerfModels";

export const useCalibrationJobStore = defineStore('CalibrationJobStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken, getUserName } = useUserDataStore();
  const { userCalibrationRunData, userCalibrationJobsListData } = storeToRefs(useUserDataStore());
  const { calibrationJobId } = storeToRefs(generalStore());

  const calibrationDownloadJobID = ref<number | null>(null);
  const calibrationDownloadFileName = ref<string | null>(null);

  /**
 * returns list of calibration job data from server
 * @returns {CalibrationJobListItem[]}
 */
  const fetchJobsListData = computed(() => {
    return userCalibrationJobsListData.value ?? [];
  })

  /**
 * based on the current user's list of calibration job return number of job with status of "saved"
 * @returns {number}
 */
  const savedCalibrationJobs = computed(() => {
    return userCalibrationJobsListData.value?.reduce((total_saved_jobs: number, job: CalibrationJobListItem) => {
      if (job.status.toLowerCase() === 'saved') total_saved_jobs += 1;
      return total_saved_jobs;
    }, 0)
  })

  /**
 * based on the current user's list of calibration job return number of job with status of "running"
 * @returns {number}
 */
  const runningCalibrationJobs = computed(() => {
    return userCalibrationJobsListData.value?.reduce((total_running_jobs: number, job: CalibrationJobListItem) => {
      if (job.status.toLowerCase() === 'running') total_running_jobs += 1;
      return total_running_jobs;
    }, 0)
  })

 /**
 * based on the current user's list of calibration job return number of job with status of "ready"
 * @returns {number}
 */
  const readyCalibrationJobs = computed(() => {
    return userCalibrationJobsListData.value?.reduce((total_ready_jobs: number, job: CalibrationJobListItem) => {
      if (job.status.toLowerCase() === 'ready') total_ready_jobs += 1;
      return total_ready_jobs;
    }, 0)
  })


  /**
 * return a new calibration run id generated from the server
 * @returns {CreatedCalibrationRun}
 */
  async function fetchNewCalibrationRunId() {
    return await makeProtectedApiCall<CreatedCalibrationRun>(`${ngencerfBaseUrl}/calibration/create_calibration_run/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });
  }


  /**
  * Delete a job
  * If a single job comes in, make sure we put it into an array.
  * Otherwise, it is an array.
  */
  async function deleteCalibrationRun(runIds: any) {
    let toDelete: number[];
    if (!Array.isArray(runIds)) {
      toDelete = [runIds];
    } else {
      toDelete = runIds;
    }
    return await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/delete_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_ids: toDelete })
    });
  };

  /**
  * Archive or Un-archive a job
  * If unarchive, set unArchive to true
  * If a single job comes in, make sure we put it into an array.
  * Otherwise, it is an array.
  */
  async function archiveCalibrationRun(runIds: any, unArchive: boolean) {
    let toDelete: number[];
    if (!Array.isArray(runIds)) {
      toDelete = [runIds];
    } else {
      toDelete = runIds;
    }
    return await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/archive_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_ids: toDelete, archive: unArchive })
    })
  }

  /**
  * Lock or Unlock a job
  * If a single job comes in, make sure we put it into an array.
  * Otherwise, it is an array.
  */
  async function lockCalibrationRun(runIds: any, lock: boolean) {
    let toLock: number[];
    if (!Array.isArray(runIds)) {
      toLock = [runIds];
    } else {
      toLock = runIds;
    }
    return await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/lock_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_ids: toLock, lock: lock })
    })
  }

  /**
 * Clone a job
 */
  async function cloneCalibrationRun(runId: number) {
    return await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/clone_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: runId })
    })
  }

  /**
 * Get configuration data as JSON file
 */
  const exportJob = async (calibration_run_id: number) => {
    await fetch(`${ngencerfBaseUrl}/calibration/export/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibration_run_id })
    })
      .then(response => {
        if (!response.ok) {
          const message = `Error: ${response.status} ${response.statusText}`;
          throw new Error(message);
        }
        // Extract the filename from the Content-Disposition header if available
        let file_user_name = getUserName().split("@")[0];
        let file_name = `ngenCERF_${calibration_run_id}_${file_user_name}.json`; // default filename
        return response.blob().then(blob => ({ blob, file_name }));
      })
      .then(({ blob, file_name }) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file_name; // Use the filename from the response header

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        throw error;
      });
  }

  /**
 * Get calibration data as zip file
 */
  const getCalibrationJobZip = async (calibration_run_id: number) => {
    await makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/start_zip_for_calibration_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibration_run_id })
    })
    .then(response => {
      //if (!response.ok) {
        console.log('Throwing error after start_zip_for_calibration_job response');
        const message = `Error: ${response.status} ${response.statusText}`;
        throw new Error(message);
      //}
    });
    
    // create an interval to keep checking download status every 10 seconds
    let calibrationDownloadStatusIntervalId = setInterval(async () => {
      getCalibrationJobZipStatus(calibration_run_id)
      .then(response => {
        /* if (response && response._data.zip_status) {
          if (response._data.zip_status === 'done') {
            clearInterval(calibrationDownloadStatusIntervalId);
            downloadCalibrationJobZip(calibration_run_id);
          }
        } else { */
          clearInterval(calibrationDownloadStatusIntervalId);
          console.log('Throwing error after get_zip_status response');
          const message = `Error: Unable to get Calibration Job Download Status`;
          throw new Error(message);
        //}
      });
    }, 5000) as unknown as number;
  }

  /**
 * Get status of calibration data zip file as it builds
 */
  const getCalibrationJobZipStatus = async (calibration_run_id: number) => {
    return await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/get_zip_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibration_run_id })
    })
  }

  /**
 * Request calibration data zip file once it is built
 */
  const downloadCalibrationJobZip = async (calibration_run_id: number) => {
    await fetch(`${ngencerfBaseUrl}/calibration/download_calibration_zip/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibration_run_id })
    })
    .then(response => {
      console.log('Throwing error after download_calibration_zip response');
      // (!response.ok) {
        const message = `Error: ${response.status} ${response.statusText}`;
        throw new Error(message);
      //}
      // Extract the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let file_user_name = getUserName().split("@")[0];
      let file_name = `${calibration_run_id}_${file_user_name}.zip`; // default filename
      if (contentDisposition && contentDisposition.indexOf("filename=") !== -1) {
        // Parse filename, handling quotes if necessary
        const file_name_regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = file_name_regex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          file_name = matches[1].replace(/['"]/g, "");
        }
      }
      return response.blob().then(blob => ({ blob, file_name }));
    })
    .then(({ blob, file_name }) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file_name; // Use the filename from the response header

      // Update refs with the Job ID and file name so that we can access them outside of the store
      calibrationDownloadJobID.value = calibration_run_id;
      calibrationDownloadFileName.value = file_name;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      throw error;
    });
  }

  return {
    fetchJobsListData,
    calibrationJobId,
    savedCalibrationJobs,
    readyCalibrationJobs,
    runningCalibrationJobs,
    calibrationDownloadJobID,
    calibrationDownloadFileName,
    fetchNewCalibrationRunId,
    cloneCalibrationRun,
    deleteCalibrationRun,
    archiveCalibrationRun,
    lockCalibrationRun,
    exportJob,
    getCalibrationJobZip,
    getCalibrationJobZipStatus,
    downloadCalibrationJobZip,
  }
},
  {
    persist: {
      key: getStorageKey("CalibrationJobStore"),
    },
  })

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCalibrationJobStore, import.meta.hot));
}
