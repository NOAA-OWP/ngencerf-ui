// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { generalStore } from "./GeneralStore";
import { makeProtectedApiCall } from "~/utils/UserAuth";

import type { JobsList, JobListItem, UserCalibrationRunData } from "~/composables/NextGenModel";

export const useUserDataStore = defineStore("UserDataStore", () => {
  const isLoggedIn = ref<boolean>(true);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const { ngencerfBaseUrl } = useBackendConfig();
  const { calibrationJobId } = storeToRefs( generalStore() )
  const userCalibrationJobsListData = ref<JobListItem[]>([])
  const userCalibrationRunData = ref<UserCalibrationRunData>()

  /**
   * Checks if user is logged in
   * @returns {boolean} true if user is logged in, false otherwise.
   */
  function isUserLoggedIn(): boolean {
    return isLoggedIn.value;
  }

  /**
   * Logs user in by setting isLoggedIn to true
   */
  function logUserIn(): void {
    console.log("User is logged In");
    isLoggedIn.value = true;
  }

  /**
   * Logs user out by setting isLoggedIn to false and setting access and refresh tokens to null
   */
  function logUserOut(): void {
    console.log("User is logged out");
    isLoggedIn.value = false;
    accessToken.value = null;
    refreshToken.value = null;
  }

  /**
   * Gets username
   * @returns {string} name of user
   */
  function getUserName(): string {
    return "Herbert Hoover";
  }

  /**
   * Sets access token
   * @param {string} token - access token
   */
  function setAccessToken(token: string): void {
    accessToken.value = token;
    console.log("Access token: ", getAccessToken());
  }

  /**
   * Sets refresh token
   * @param {string} token - refresh token
   */
  function setRefreshToken(token: string): void {
    refreshToken.value = token;
    console.log("Refresh token: ", getRefreshToken());
  }

  /**
   * Gets access token
   * @returns {string | null} access token, or null if not set
   */
  function getAccessToken(): string | null {
    return accessToken.value;
  }

  /**
   * Gets refresh token
   * @returns {string | null} refresh token, or null if not set
   */
  function getRefreshToken(): string | null {
    return refreshToken.value;
  }

   /**
    * fetch user created calibration job list data
    * @return {void}
    */
   async function fetchUserCalibrationJobsListData() {
      const jobsListDataResult = await makeProtectedApiCall<JobsList>( `${ngencerfBaseUrl}/calibration/get_jobs/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         }
      } )

      userCalibrationJobsListData.value = jobsListDataResult?.jobs ?? []
   }

   /**
    * fetch user selected calibration run user saved data
    * @return {void}
    */
   async function fetchUserCalibrationRunData() {
      const userCalibrationRunDataResult = await makeProtectedApiCall<UserCalibrationRunData>( `${ngencerfBaseUrl}/calibration/load_calibration_run/`, {
         method: "POST",
         headers: { 
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
         },
         body: JSON.stringify( { calibration_run_id: calibrationJobId.value } )
      })

      userCalibrationRunData.value = userCalibrationRunDataResult ?? undefined
   }

  return {
    isUserLoggedIn,
    logUserIn,
    logUserOut,
    getUserName,
    setAccessToken,
    setRefreshToken,
    getAccessToken,
    getRefreshToken,
    fetchUserCalibrationJobsListData,
    userCalibrationJobsListData,
    userCalibrationRunData,
    fetchUserCalibrationRunData
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserDataStore, import.meta.hot));
}

