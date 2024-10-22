// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { generalStore } from "./GeneralStore";
import { makeProtectedApiCall } from "~/composables/UserAuth";

import type { JobsList, JobListItem, UserCalibrationRunData } from "~/composables/NextGenModel";

export const useUserDataStore = defineStore("UserDataStore", () => {
  const isLoggedIn = ref<boolean>(false);
  const userName = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const { ngencerfBaseUrl } = useBackendConfig();
  const { calibrationJobId } = storeToRefs(generalStore());
  const userCalibrationJobsListData = ref<JobListItem[]>([]);
  const userCalibrationRunData = ref<UserCalibrationRunData>();

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
    isLoggedIn.value = true;
  }

  /**
   * Logs user out by setting isLoggedIn to false and setting access and refresh tokens to null
   */
  function logUserOut(): void {
    isLoggedIn.value = false;
    accessToken.value = null;
    refreshToken.value = null;
  }

  /**
   * Gets username
   * @returns {string} name of user
   */
  function getUserName(): string {
    return userName.value;
  }

  /**
   * Gets username
   * @returns {string} name of user
   */
  function getUserInitials(): string {
    let n = userName.value;
    let atSignPos = n.indexOf("@");
    if (atSignPos !== -1) {
      let name = n.substring(0, atSignPos);
      let dotPos = name.lastIndexOf('.');
      if (dotPos !== -1) {
        return (name[0] + name.substring(dotPos + 1)[0]).toUpperCase();
      }
      return userName.value.toUpperCase()[0];
    } else {
      return userName.value.toUpperCase()[0];
    }
  }

  /**
   * Gets users full name (first and last)
   * @returns full name of user
   */
  function getUserFullName(): string {
    return firstName.value + " " + lastName.value;
  }

  /**
   * Gets users first name
   * @returns first name of user
   */
  function getUserFirstName(): string {
    return firstName.value;
  }

  /**
   * Gets users last name
   * @returns last name of user
   */
  function getUserLastName(): string {
    return lastName.value;
  }

  /**
   * Sets username
   * @returns void
   */
  function setUserName(user: string) {
    userName.value = user;
  }

  /**
   * Sets user first name
   * @returns void
   */
  function setFirstName(name: string): void {
    firstName.value = name;
  }

  /**
   * Sets user last name
   * @returns void
   */
  function setLastName(name: string): void {
    lastName.value = name;
  }

  /**
   * Sets access token
   * @param {string} token - access token
   */
  function setAccessToken(token: string): void {
    accessToken.value = token;
  }

  /**
   * Sets refresh token
   * @param {string} token - refresh token
   */
  function setRefreshToken(token: string): void {
    refreshToken.value = token;
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
    const jobsListDataResult = await makeProtectedApiCall<JobsList>(`${ngencerfBaseUrl}/calibration/get_calibration_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });

    userCalibrationJobsListData.value = jobsListDataResult?._data?.jobs ?? [];
  }

  /**
   * @returns {Promise<any>}
   */
  async function queryUserCalibrationRunData() {
    const userCalibrationRunDataResult = await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/load_calibration_run/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    })

    return userCalibrationRunDataResult
  }

  /**
   * fetch user selected calibration run user saved data
   * @return {void}
   */
  async function fetchUserCalibrationRunData() {
    const userCalibrationRunDataResult = await queryUserCalibrationRunData()

    userCalibrationRunData.value = userCalibrationRunDataResult?._data ?? undefined;
  }

  /**
  * Delete a job
  */
  async function deleteCalibrationRun(runId: number) {
    await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/delete_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: runId })
    }).then(function(result) {
      console.log("Result: ", result)
      fetchUserCalibrationJobsListData();
    });
  }

  /**
 * Clone a job
 */
  async function cloneCalibrationRun(runId: number) {
    await makeProtectedApiCall<UserCalibrationRunData>(`${ngencerfBaseUrl}/calibration/clone_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: runId })
    }).then(function(result) {
      console.log("Result: ", result)
       fetchUserCalibrationJobsListData();
    });
  }



  useLogoutListen('logoutEvent', () => {
    hardResetUserDataStore();
  })

  /**
   * Hard Reset User Data Store
   */
  const hardResetUserDataStore = (): void => {
    isLoggedIn.value = false;
    userName.value = "";
    accessToken.value = null;
    refreshToken.value = null;
    userCalibrationJobsListData.value = [];
    userCalibrationRunData.value = undefined;
    console.log("User Data Store Reset");
  }

  /**
   * reset user calibration run selection
   */
  const clearUserCalibrationRunData = () => {
    userCalibrationRunData.value = undefined;
  }

  return {
    isUserLoggedIn,
    logUserIn,
    logUserOut,
    getUserName,
    getUserFullName,
    getUserFirstName,
    getUserLastName,
    getUserInitials,
    setAccessToken,
    setRefreshToken,
    setUserName,
    setFirstName,
    setLastName,
    getAccessToken,
    getRefreshToken,
    fetchUserCalibrationJobsListData,
    userCalibrationJobsListData,
    userCalibrationRunData,
    queryUserCalibrationRunData,
    deleteCalibrationRun,
    cloneCalibrationRun,
    fetchUserCalibrationRunData,
    hardResetUserDataStore,
    clearUserCalibrationRunData,   
  };
},
  {
    persist: {
      storage: persistedState.localStorage
    },
  });

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserDataStore, import.meta.hot));
}

