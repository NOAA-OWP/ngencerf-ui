// @ts-check

import { defineStore, storeToRefs } from "pinia";

import type {
  CalibrationJobListItem,
  ValidationJobsList,
  UserCalibrationRunData,
  ServerStatus,
  LogLevel,
} from "@/composables/NgencerfModels";

import { generalStore } from "@/stores/common/GeneralStore";

import { useBackendConfig } from "@/composables/UseBackendConfig";
import { makeProtectedApiCall } from "@/composables/UserAuth";

export const useUserDataStore = defineStore(
  "UserDataStore",
  () => {
    const { ngencerfBaseUrl } = useBackendConfig();
    const { calibrationJobId } = storeToRefs(generalStore());

    const isLoggedIn = ref<boolean>(false);
    const userName = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const userInitials = ref<string>('');
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);

    const tokenExpired = ref<boolean>(false);

    const userCalibrationJobsListData = ref<CalibrationJobListItem[]>([]);
    const userCalibrationRunData = ref<UserCalibrationRunData>();
    const gotoCalibrationRunId = ref<number>();
    const calibrationRunListPageSize = ref<number>(50);
    const calibrationRunListCurrentPage = ref<number>(1);
    const calibrationRunListTotalPages = ref<number>(0);
    const calibrationRunListTotalSize = ref<number>(0);
    const calibrationRunListStartRow = ref<number>(1);
    const calibrationRunListEndRow = ref<number>(calibrationRunListPageSize.value);
    const calibrationRunListSort = ref<DynamicObject>({'field': 'calibration_run_id', 'direction': -1});

    const userSelectedCalibrationIterationId = ref<number | null>(null);
    const uiGageId = ref<string>("");

    // Used for Calibration Job Filter
    const modulesFilterList = ref<string[]>([]);
    const statusTypeFilterList = ref<string[]>([]);
    const includeArchivedJobs = ref<boolean>(false);

    const lastServerError = ref<ServerStatus>();

    // sets value for global logging
    const calibrationJobNgenGlobalLogging = ref<boolean>(true);

    // set ngen log level
    const ngenLogLevel = ref<LogLevel>("info");
    const forcingLogLevel = ref<LogLevel>("info");

    // stores the log level for each module
    const logLevels: Record<string, Ref<LogLevel>> = reactive({});

    /**
     * watch for changes in userCalibrationRunData.modules
     * and update logLevels accordingly
     * if newModules is undefined or empty, delete all modules from logLevels
     * if newModules is not undefined or empty, add new modules to logLevels
     * and set log level to info
     * NOTE: in CalibrationJobStore, access logLevels WITHOUT .value
     * because logLevels is a reactive object. It is changed into a ref
     * when it is passed to a component.
     * https://vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive
     */
    watch(() => userCalibrationRunData.value?.modules, (newModules) => {
      // if newModules is undefined or empty, delete all modules from logLevels
      if (!newModules || newModules.length === 0) {
        for (const module in logLevels) {
          delete logLevels[module];
        }
        return;
      }

      // track the modules that we should be using
      const validModules = new Set<string>();

      // add new modules to logLevels and set log level to info
      for (const module of newModules) {
        validModules.add(module);

        // if the module is not already in logLevels, add it with a default log level
        if (!logLevels[module]) {
          logLevels[module] = ref<LogLevel>("info");
        }
      }

      // remove deleted modules from logLevels
      for (const module in logLevels) {
        if (!validModules.has(module)) {
          delete logLevels[module];
        }
      }
    },
      { immediate: true }
    );

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
      if (firstName.value && lastName.value) {
        return firstName.value.toUpperCase()[0] + lastName.value.toUpperCase()[0];
      } else {
        let n = userName.value;
        if (n) {
          let atSignPos = n.indexOf("@");
          if (atSignPos !== -1) {
            let name = n.substring(0, atSignPos);
            let dotPos = name.lastIndexOf(".");
            if (dotPos !== -1) {
              return (name[0] + name.substring(dotPos + 1)[0]).toUpperCase();
            }
            return userName.value.toUpperCase()[0];
          } else {
            return userName.value.toUpperCase()[0];
          }
        }
      }
      return "";
    }

    /**
     * Gets users full name (first and last)
     * @returns full name of user,
     *   or the the initals from the email address if there is no name
     */
    function getUserFullName(): string {
      if (!firstName.value && !lastName.value) {
        return getUserInitials();
      }
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

    function setIsTokenExpired() {
      tokenExpired.value = true;
    }

    function getIsTokenExpired() {
      return tokenExpired.value;
    }
    /**
     * @returns {SelectOption[]}
     */
    const calibrationRunGageList = computed(() => {
      let gageOptionList = <SelectOption[]>[];
      gageOptionList.push({
        name: "All",
        description: "All",
      });
      userCalibrationJobsListData.value.forEach((runItem) => {
        const checkGageIndex =
          gageOptionList.findIndex(
            (gageOption) => gageOption.name === runItem.gage_id
          ) !== -1;
        if (!checkGageIndex) {
          gageOptionList.push({
            name: runItem.gage_id,
            description: runItem.gage_id,
          });
        }
      });
      return gageOptionList;
    });

    /**
     * fetch user created calibration job list datauser created calibration
     * @return {void}
     */
    async function fetchUserCalibrationJobsListData() {
      const jobsListDataResult =
        await makeProtectedApiCall<CalibrationJobsList>(
          `${ngencerfBaseUrl}/calibration/get_calibration_jobs/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              limit: calibrationRunListPageSize.value,
              offset: (calibrationRunListCurrentPage.value - 1) * calibrationRunListPageSize.value,
              sort: {
                field: calibrationRunListSort.value.field,
                direction: calibrationRunListSort.value.direction === -1 ? 'desc' : 'asc'
              },
              filters: {include_archived: includeArchivedJobs.value} 
            }),
          }
        );

      userCalibrationJobsListData.value = jobsListDataResult?._data?.jobs ?? [];
      calibrationRunListTotalSize.value = jobsListDataResult?._data?.total_count ?? 0;
      calibrationRunListTotalPages.value = Math.ceil(calibrationRunListTotalSize.value / calibrationRunListPageSize.value);
      calibrationRunListStartRow.value = (calibrationRunListPageSize.value * (calibrationRunListCurrentPage.value - 1)) + 1;
      calibrationRunListEndRow.value = Math.min(calibrationRunListStartRow.value + (calibrationRunListPageSize.value - 1), calibrationRunListTotalSize.value);
    }

    /**
     * fetch user validation jobs associated with the selected calibration run
     * @param {number} calibrationRunId
     * @return {Promise<ValidationJobsList>}
     */
    const getValidationJobs = async (
      calibrationRunId: number
    ): Promise<ValidationJobsList> => {
      const getValidationJobsResponse: any = await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/get_validation_jobs/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ calibration_run_id: calibrationRunId }),
        }
      );

      return getValidationJobsResponse?._data ?? ({} as ValidationJobsList);
    };

    /**
     * @returns {Promise<any>}
     */
    async function queryUserCalibrationRunData(
      include_gpkg_map: boolean = true
    ) {
      if (!calibrationJobId.value) {
        return null;
      }
      const userCalibrationRunDataResult =
        await makeProtectedApiCall<UserCalibrationRunData>(
          `${ngencerfBaseUrl}/calibration/load_calibration_run/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              calibration_run_id: calibrationJobId.value,
              include_gpkg_map: include_gpkg_map,
            }),
          }
        );

      return userCalibrationRunDataResult;
    }

    /**
     * fetch user selected calibration run user saved data
     * @return {void}
     */
    async function fetchUserCalibrationRunData(
      include_gpkg_map: boolean = true
    ) {
      const userCalibrationRunDataResult = await queryUserCalibrationRunData(
        include_gpkg_map
      );

      userCalibrationRunData.value =
        userCalibrationRunDataResult?._data ?? undefined;
    }

    useLogoutListen("logoutEvent", (evStr: string) => {
      if (evStr === "logout") {
        hardResetUserDataStore();
      }
    });

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
      uiGageId.value = "";
      includeArchivedJobs.value = false;
    };

    /**
     * reset user calibration run selection
     */
    const clearUserCalibrationRunData = () => {
      userCalibrationRunData.value = undefined;
      calibrationJobNgenGlobalLogging.value = true;
      ngenLogLevel.value = "info";
      forcingLogLevel.value = "info";

      // clear all log levels
      for (const module in logLevels) {
        delete logLevels[module];
      }
    };

    return {
      userSelectedCalibrationIterationId,
      calibrationRunGageList,
      uiGageId,
      isLoggedIn,
      userName,
      firstName,
      lastName,
      userInitials,
      accessToken,
      refreshToken,
      modulesFilterList,
      statusTypeFilterList,
      includeArchivedJobs,
      lastServerError,
      userCalibrationJobsListData,
      userCalibrationRunData,
      gotoCalibrationRunId,
      calibrationRunListPageSize,
      calibrationRunListCurrentPage,
      calibrationRunListTotalPages,
      calibrationRunListTotalSize,
      calibrationRunListStartRow,
      calibrationRunListEndRow,
      calibrationRunListSort,
      calibrationJobNgenGlobalLogging,
      ngenLogLevel,
      forcingLogLevel,
      logLevels,
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
      setIsTokenExpired,
      getIsTokenExpired,
      setUserName,
      setFirstName,
      setLastName,
      getAccessToken,
      getRefreshToken,
      fetchUserCalibrationJobsListData,
      getValidationJobs,
      queryUserCalibrationRunData,
      fetchUserCalibrationRunData,
      hardResetUserDataStore,
      clearUserCalibrationRunData,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserDataStore, import.meta.hot));
}
