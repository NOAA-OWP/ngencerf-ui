// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { DateTime } from "luxon";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { formatISOStringOrDateToYYYYMMDD } from '@/utils/TimeHelpers';

export const useEvaluationSupplementalDataStore = defineStore('EvaluationSupplementalDataStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { userCalibrationRunData } = storeToRefs(useUserDataStore());
  const { selectedCalibrationCompareRuns } = storeToRefs(useEvaluationCalibrationRunStore());
  const { getAccessToken } = useUserDataStore();


  // refs
  const plotNames = ref<APIResponse>({});
  const plotList = ref<any[]>([]);
  const selectedPlotName = ref<string | null>(null);
  const selectedPlotFilename = ref<string | null>(null);
  const selectedPlotFileUrl = ref<string | null>(null);

  // grid refs
  const simulatedSources = ref<string[]>([
    'Calibration Best Run',
    'Calibration Last Run',
    'Calibration Control Run',
    'Validation Control Run',
    'Validation Best Run',
    'Validation Alt Iteration X Run'
  ]);
  const gridDisplayOptions = ref<any>([
    {
      "name": "Snow Water Equivalent", 
      "abbr": "SWE",
      "timeseries_endpoint": "get_swe_timeseries_data",
      "images_endpoint": "get_swe_images_by_date"
    },
    {
      "name": "Soil Moisture", 
      "abbr": "SMAP",
      "timeseries_endpoint": "get_soil_moisture_timeseries_data",
      "images_endpoint": "get_soil_moisture_images_by_date"
    }
  ]);
  const selectedGridDisplay = ref<any>({});
  const gridStartDateTime = ref<any>();
  const minGridDateTime = ref<any>();
  const gridEndDateTime = ref<any>();
  const maxGridDateTime = ref<any>();
  const gridTimeSeriesData = ref<any[]>([]);


  const gridTypes = ref<string[]>([
    'Gridded',
    'Catchment Means'
  ]);
  const selectedGridTypes = ref<string[]>([]);
  const selectedGridDateTime = ref<any>();
  const selectedGridImages = ref<any[]>([]);

  const isEvaluationLoading = ref<boolean>(false);

  const userTimeZone = DateTime.local().zoneName;

  /**
   * set gridStartDateTime
   */
  const setgridStartDateTime = (): void => {
    if (gridTimeSeriesData.value.length > 0) {
      gridStartDateTime.value = DateTime.fromISO(gridTimeSeriesData.value[0].timestamp, { zone: 'utc' });
    } else {
      gridStartDateTime.value = DateTime.fromISO(userCalibrationRunData?.value?.validation_times?.simulation_start_time as string, { zone: 'utc' });
    }
    
    // this is used to set the min date for the date picker correctly
    minGridDateTime.value = gridStartDateTime.value.setZone(userTimeZone, { keepLocalTime: true });
  };

  /**
   * set gridEndDateTime
   */
  const setgridEndDateTime = (): void => {
    if (gridTimeSeriesData.value.length > 0) {
      gridEndDateTime.value = DateTime.fromISO(gridTimeSeriesData.value[gridTimeSeriesData.value.length - 1].timestamp, { zone: 'utc' });
    } else {
      gridEndDateTime.value = DateTime.fromISO(userCalibrationRunData?.value?.validation_times?.simulation_end_time as string, { zone: 'utc' });
    }
    
    // this is used to set the max date for the date picker correctly
    maxGridDateTime.value = gridEndDateTime.value.setZone(userTimeZone, { keepLocalTime: true });
  };

  /**
   * getGridTimeRange
   */
  const getGridTimeRange = (): string => {
    return `Range: ${formatISOStringOrDateToYYYYMMDD(gridStartDateTime.value)} to ${formatISOStringOrDateToYYYYMMDD(gridEndDateTime.value)}`;
  };

  /**
   * Load Grid images
   */
  const loadGridImages = async (validation_run_id: number, date: string): Promise<string[]> => {
    const getGridImagesResponse = await getGridImagesByDate(validation_run_id, date);

    if (getGridImagesResponse.status >= 200 && getGridImagesResponse.status < 300) {
      if (getGridImagesResponse._data) {
        selectedGridImages.value = [];
        if (getGridImagesResponse?._data?.raw_map || getGridImagesResponse?._data?.lumped_map) {
          let gridTypes = [];
          if (getGridImagesResponse?._data?.raw_map) {
            gridTypes.push({
              "grid_name": "Gridded (Raw Values)",
              "images": [
                {"image_name": "Raw Map", "image_url": getGridImagesResponse?._data?.raw_map}
              ]
            });
          }
          if (getGridImagesResponse?._data?.lumped_map) {
            gridTypes.push({
              "grid_name": "Catchment Means",
              "images": [
                {"image_name": "Lumped Map", "image_url": getGridImagesResponse?._data?.lumped_map}
              ]
            });
          }
          selectedGridImages.value.push({
            "category_name": selectedGridDisplay.value.abbr === 'SWE' ? "SNODAS": "SMAP",
            "grid_types": gridTypes
          });
        }
        if (getGridImagesResponse?._data?.sim_map) {
          selectedGridImages.value.push({
            "category_name": "Simulated",
            "grid_types": [
              {
                "grid_name": "Catchment Means",
                "images": [
                  {"image_name": "Simulated Map", "image_url": getGridImagesResponse?._data?.sim_map}
                ]
              }
            ]
          });
        }

        return [];
      } else {
        return ['No data from ' + selectedGridDisplay.value.images_endpoint + ' endpoint'];
      }
    } else {
      return useApiErrorResponsePreprocess(getGridImagesResponse);
    }
  };

  /**
   * Get Calibration Iteration Data
   * @return {any}
   */
  const queryGetIterations = async (): Promise<any> => {
    if (!calibrationJobId.value) {
      return null;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_calibration_data_by_iteration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
  * Get Performance Metrics
  * @return {any}
  */
  const queryGetPerformanceMetrics = async (): Promise<any> => {
    if (!calibrationJobId.value) {
      return null;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(
        {
          calibration_run_id: calibrationJobId.value,
          include_performance_metrics: true
        }
      )
    });
  };


  /**
  * Get Performance Metrics for Comparison
  * @return {any}
  */
  const queryGetPerformanceMetricsForComparison = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_status_for_comparison/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(
        {
          calibration_run_ids: selectedCalibrationCompareRuns.value.map(run => run.calibration_run_id)
        }
      )
    });
  };

  /**
   * Get Calibration/Validation Log Names
   * @return {any}
   */
  const queryGetLogNames = async (validation_run_id: number): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id
      })
    });
  };

  /**
   * Get Calibration/Validation Log Data
   * @return {any}
   */
  const queryGetLogData = async (
    log_category: string,
    log_name: string,
    validation_run_id: number,
    start?: number,
    limit?: number
  ): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id,
        log_category: log_category,
        log_name: log_name,
        start: start !== undefined ? start : 0,
        limit: limit !== undefined ? limit : 1000
      })
    });
  };

  /**
   * get grid images endpoint
   * @param {number} validation_run_id
   * @param {string} date
   * @return {any}
   */
  const getGridImagesByDate = async (validation_run_id: number, date: string): Promise<any> => {
    const requestBody = {
      validation_run_id: validation_run_id,
    }
    if (date.split(' ').length > 1) {
      requestBody.datetime = date;
    } else {
      requestBody.date = date;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/${selectedGridDisplay.value.images_endpoint}/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  };

  /**
   * grid time series data endpoint
   * @param {number} validation_run_id
   * @return {any}
   */
  const queryGetGridTimeSeriesData = async (validation_run_id: number): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/${selectedGridDisplay.value.timeseries_endpoint}/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id
      })
    });
  };

  return {
    plotNames,
    plotList,
    selectedPlotName,
    selectedPlotFilename,
    selectedPlotFileUrl,
    simulatedSources,
    gridDisplayOptions,
    selectedGridDisplay,
    gridTypes,
    selectedGridTypes,
    gridStartDateTime,
    minGridDateTime,
    maxGridDateTime,
    gridEndDateTime,
    selectedGridDateTime,
    selectedGridImages,
    gridTimeSeriesData,
    isEvaluationLoading,
    setgridStartDateTime,
    setgridEndDateTime,
    getGridTimeRange,
    queryGetIterations,
    queryGetPerformanceMetrics,
    queryGetPerformanceMetricsForComparison,
    queryGetLogNames,
    queryGetLogData,
    getGridImagesByDate,
    loadGridImages,
    queryGetGridTimeSeriesData,
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationSupplementalDataStore, import.meta.hot));
}