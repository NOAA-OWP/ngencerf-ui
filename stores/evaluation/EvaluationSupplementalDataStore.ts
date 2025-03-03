// @ts-check

import { defineStore, storeToRefs } from "pinia";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { makeProtectedApiCall } from "@/composables/UserAuth";
import { formatISOStringOrDateToYYYYMMDD } from '@/utils/TimeHelpers';

export const useEvaluationSupplementalDataStore = defineStore('EvaluationSupplementalDataStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { userCalibrationRunData } = storeToRefs(useUserDataStore());
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
  const selectedSimulatedSource = ref<string>();
  const selectedSimulatedSourceStartDate = ref<string>();
  const selectedSimulatedSourceEndDate = ref<string>();


  const gridTypes = ref<string[]>([
    'Gridded',
    'Catchment Means'
  ]);
  const selectedGridType = ref<string>();
  const selectedEvaluateDate = ref<any>();

  const selectedSnodasLumpedMapUrl = ref<string>();
  const selectedSnodasRawMapUrl = ref<string>();
  const selectedSnodasSimMapUrl = ref<string>();

  /**
   * Computes the selected simulated source time range depending on the selected simulated source
   */
  const selectedSimulatedSourceTimeRange = computed(() => {
    if (selectedSimulatedSource?.value?.includes('Calibration')) {
      selectedSimulatedSourceStartDate.value = `Calibration: ${formatISOStringOrDateToYYYYMMDD(userCalibrationRunData?.value?.calibration_times?.calibration_start_time as string)}`;
      selectedSimulatedSourceEndDate.value = formatISOStringOrDateToYYYYMMDD(userCalibrationRunData?.value?.calibration_times?.calibration_end_time as string);
    }

    else if (selectedSimulatedSource?.value?.includes('Validation')) {
      selectedSimulatedSourceStartDate.value = `Validation: ${formatISOStringOrDateToYYYYMMDD(userCalibrationRunData?.value?.validation_times?.validation_start_time as string)}`;
      selectedSimulatedSourceEndDate.value = formatISOStringOrDateToYYYYMMDD(userCalibrationRunData?.value?.validation_times?.validation_end_time as string);
    }

    // default selectedEvaluateDate to selectedSimulateSourceStartDate (hard code to 2020-04-02 to display 2020-04-01 for demo)
    // in order to have a default value for the date picker
    selectedEvaluateDate.value = formatISOStringOrDateToYYYYMMDD('2020-04-02T00:00:00.000Z')

    return `${selectedSimulatedSourceStartDate.value} to ${selectedSimulatedSourceEndDate.value}`;
  });

  /**
   * Load SNODAS image
   */
  const loadSnodasMap = async (validation_run_id: number, date: string) => {
    const getSnodasImagesResponse = await getSnodasImages(validation_run_id, date);
    console.log('getSnodasImagesResponse', getSnodasImagesResponse);
    if (getSnodasImagesResponse._data) {
      selectedSnodasLumpedMapUrl.value = getSnodasImagesResponse?._data?.lumped_map;
      selectedSnodasRawMapUrl.value = getSnodasImagesResponse?._data?.raw_map;
      selectedSnodasSimMapUrl.value = getSnodasImagesResponse?._data?.sim_map;
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
   * Get Calibration/Validation Log Names
   * @return {any}
   */
  const queryGetLogNames = async (validation_run_id: number = 0): Promise<any> => {
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
    validation_run_id: number = 0,
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
        start: start !== undefined ? start.toString() : '',
        limit: limit !== undefined ? limit.toString() : ''
      })
    });
  };

  /**
   * get_snodas_images endpoint
   * @param {number} validation_run_id
   * @param {string} date
   * @return {any}
   */
  const getSnodasImages = async (validation_run_id: number, date: string): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_snodas_images/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id,
        date: date
      })
    });
  };

  /**
   * run_swe endpoint
   * @param {number} validation_run_id
   * @param {string} date
   * @return {any}
   */
  const runSwe = async (validation_run_id: number, date: string): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/run_swe/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id,
        date: date
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
    selectedSimulatedSource,
    gridTypes,
    selectedGridType,
    selectedEvaluateDate,
    selectedSimulatedSourceTimeRange,
    selectedSnodasLumpedMapUrl,
    selectedSnodasRawMapUrl,
    selectedSnodasSimMapUrl,
    queryGetIterations,
    queryGetPerformanceMetrics,
    queryGetLogNames,
    queryGetLogData,
    runSwe,
    getSnodasImages,
    loadSnodasMap
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