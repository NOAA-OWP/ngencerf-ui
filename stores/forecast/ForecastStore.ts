import { defineStore, storeToRefs } from "pinia";
import type { SelectOption, CalibrationRunForForecast, CalibrationRunsForForecast, ForecastCycle } from "@/composables/NextGenModel";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { isValidDate } from '@/utils/CommonHelpers';
import { convertTimeZone } from '@/utils/TimeHelpers';

export const useForecastStore = defineStore('ForecastStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken, fetchUserCalibrationRunData, clearUserCalibrationRunData } = useUserDataStore();
  const { calibrationJobId } = storeToRefs(generalStore());
  // refs
  const forecastJobId = ref<number>();
  const forecastCycles = ref<ForecastCycle[]>();
  const forecastCycle = ref<ForecastCycle>();
  const forecastJobStatus = ref<string>();
  const elapsedTime = ref<string>();
  const submitTimeDate = ref<Date>();
  const submitTime = ref<string>();
  const elapsedTimeIntervalId = ref<number>();
  const forecastJobStatusIntervalId = ref<number>();
  const resultsPathname = ref<string>();

  const calibrationRunsForForecast = ref<CalibrationRunsForForecast[]>([]);
  const calibrationRunForForecast = ref<CalibrationRunForForecast>();

  const uiGageId = ref<string>("");

  /**
  * @returns {SelectOption[]}
  */
  const forecastRunGageList = computed(() => {
    let gageOptionList = <SelectOption[]>[];
    calibrationRunsForForecast.value.forEach(runItem => {
      const checkGageIndex = gageOptionList.findIndex(
        (gageOption) =>
          gageOption.name === (runItem as any as CalibrationRunForForecast).gage_id
      ) !== -1;
      if (!checkGageIndex) {
        gageOptionList.push({
          'name':  (runItem as any as CalibrationRunForForecast).gage_id,
          'description':  (runItem as any as CalibrationRunForForecast).gage_id
        });
      }
    });
    return gageOptionList;
  });

  /**
   * Load Setup Forecast tab data
   */
  const loadSetupForecastTabData = async (): Promise<void> => {
    // load forecast cycles
    const loadForecastTabResponse: any = await loadForecastTab();
    forecastCycles.value = loadForecastTabResponse?._data?.forecast_cycle_values;
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
  const createAndRunForecastJob = async (calibrationRunId: number, forecastCycleName: string): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/create_and_run_forecast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationRunId, cycle_name: forecastCycleName })
    });
  };

  /**
   * Cancel Forecast Job by querying cancel_job endpoint
   */
  const cancelForecastJob = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ forecast_run_id: forecastJobId.value })
    });
  };

  /**
   * Query get_calibration_jobs_for_forecast endpoint
   */
  const getCalibrationJobsForForecast = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationRunsForForecast>(`${ngencerfBaseUrl}/calibration/get_calibration_jobs_for_forecast/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: ""
    }).then((result) => {
      calibrationRunsForForecast.value = result._data.jobs
    });
  };

  /**
   * Call get_status endpoint with calibrationRunForForecast's calibration_run_id
   * @return {any}
   */
  const getStatus = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationRunForForecast.value?.calibration_run_id })
    });
  };

  /**
   * Get Forecast Plots
   */
  const getForecastPlotNames = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ forecast_run_id: forecastJobId.value })
    });
  };

  const loadSelectedCalibrationRun = async (calibration_run_id: number) => {
    setSelectedCalibrationRunId( calibration_run_id );
    await fetchUserCalibrationRunData();
  }

  const setSelectedCalibrationRunId = ( calibration_run_id: number ):void => {
    calibrationJobId.value = calibration_run_id;
  }

  const resetSelectedCalibrationRunId = (): void => {
    calibrationJobId.value = 0;
  }

  /**
   * Hard Reset Forecast Store
   */
  const hardResetForecastStore = (): void => {
      
  };

  const resetUserSelectedForecastCalibrationRun = (): void => {
    forecastJobId.value =  undefined;
    forecastCycles.value =  [];
    forecastCycle.value =  undefined;
    forecastJobStatus.value =  undefined;
    elapsedTime.value =  undefined;
    submitTimeDate.value = undefined;
    submitTime.value =  undefined;
    elapsedTimeIntervalId.value =  undefined;
    forecastJobStatusIntervalId.value =  undefined;
    resultsPathname.value =  undefined;  
    calibrationRunsForForecast.value = [];
    calibrationRunForForecast.value = undefined;
    clearUserCalibrationRunData();
  }

 
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
    forecastRunGageList,
    calibrationRunsForForecast,
    calibrationRunForForecast,
    uiGageId,
    loadSetupForecastTabData,
    loadForecastStatusRunTabData,
    loadForecastTab,
    createAndRunForecastJob,
    cancelForecastJob,
    getCalibrationJobsForForecast,
    resetUserSelectedForecastCalibrationRun,
    loadSelectedCalibrationRun,
    setSelectedCalibrationRunId,
    resetSelectedCalibrationRunId,
    getStatus,
    getForecastPlotNames,
    hardResetForecastStore,
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