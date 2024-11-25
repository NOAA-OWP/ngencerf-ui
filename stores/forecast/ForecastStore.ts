import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { isValidDate } from '~/utils/CommonHelpers';
import { convertTimeZone } from '~/utils/TimeHelpers';

export const useForecastStore = defineStore('ForecastStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();

  // refs
  const forecastJobId = ref<number>();
  const forecastCycles = ref<ForecastTabData[]>();
  const forecastCycle = ref<ForecastTabData>();
  const forecastJobStatus = ref<string>();
  const elapsedTime = ref<string>();
  const submitTimeDate = ref<Date>();
  const submitTime = ref<string>();
  const elapsedTimeIntervalId = ref<number>();
  const forecastJobStatusIntervalId = ref<number>();
  const resultsPathname = ref<string>();

  /**
   * Load Setup Forecast tab data
   */
  const loadSetupForecastTabData = async (): Promise<void> => {
    // load forecast cycles
    const loadForecastTabResponse: any = await loadForecastTab();
    forecastCycles.value = loadForecastTabResponse?._data?.forecast_cycle_values;
    console.log('forecastCycles', forecastCycles.value);
  };

  /**
   * Load Forecast Status/Run tab data
   */
  const loadForecastStatusRunTabData = async (): Promise<void> => {
    // load forecast status
    const loadForecastTabResponse: any = await loadForecastTab();
    forecastJobStatus.value = loadForecastTabResponse?._data?.status;
    elapsedTime.value = loadForecastTabResponse?._data?.elapsed_time;
    submitTimeDate.value = new Date(loadForecastTabResponse?._data?.submit_date as string);
    if (isValidDate(submitTimeDate.value)) {
      submitTime.value = convertTimeZone(submitTimeDate.value);
    }
    resultsPathname.value = loadForecastTabResponse?._data?.data_dir;

  };

  /**
   * Query load_forecast_tab endpoint
   */
  const loadForecastTab = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/load_forecast_tab/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });
  };

  /**
   * Create and Run Forecast Job by querying create_and_run_forecast endpoint
   */
  const createAndRunForecastJob = async (forecastCycleName: string): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/create_and_run_forecast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId, cycle_name: forecastCycleName })
    });
  };

  /**
   * Call get_status endpoint
   * @return {any}
   */
  const getStatus = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Hard Reset Forecast Store
   */
  const hardResetForecastStore = (): void => {
      
  };
 
  return {
    forecastJobId,
    forecastCycles,
    forecastCycle,
    forecastJobStatus,
    elapsedTime,
    submitTimeDate,
    submitTime,
    elapsedTimeIntervalId,
    forecastJobStatusIntervalId,
    resultsPathname,
    loadSetupForecastTabData,
    loadForecastStatusRunTabData,
    loadForecastTab,
    createAndRunForecastJob,
    getStatus,
    hardResetForecastStore
  };
}, {
  persist: {
    storage: persistedState.sessionStorage
  },
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useForecastStore, import.meta.hot));
}