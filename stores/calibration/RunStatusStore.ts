// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import type { CalibrationStatus, CalibrationPlotListNamesData } from "~/composables/NextGenModel";
import { makeProtectedApiCall } from "~/composables/UserAuth";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { isValidDate, isCalibrationJobFinished } from '~/utils/CommonHelpers';
import { convertTimeZone } from '~/utils/TimeHelpers';

export const useRunStatusStore = defineStore('RunStatusStore', () => {
  const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const { userCalibrationRunData } = storeToRefs(useUserDataStore());
  
  // refs
  const elapsedTime = ref();
  const startTimeDate = ref();
  const startTime = ref();

  const plotNames = ref();
  const plotList = ref<any[]>([]);
  const selectedPlotName = ref();
  const selectedPlotFilename = ref();
  const selectedPlotFileUrl = ref();
  const iteration = ref();

  const stopCriteria = ref();
  const stopCriteriaMet = ref(false);
  const elapsedTimeIntervalId = ref();
  const calibrationStatusIntervalId = ref();
  const validationsStatusIntervalId = ref();
  const validControlAndValidBestDone = ref(false);
  const resultsPathname = ref();

    // Restore state from sessionStorage if available
    if (typeof window !== 'undefined') {
      let ls;
      ls = sessionStorage.getItem('plotList');
      if (ls !== "undefined") { plotList.value = ls ? JSON.parse(ls) : [] }
      elapsedTime.value = sessionStorage.getItem('elapsedTime') as string;
      startTimeDate.value = sessionStorage.getItem('startTimeDate') as string;
      startTime.value = sessionStorage.getItem('startTime') as string;
      plotNames.value = sessionStorage.getItem('plotNames') as string;
      selectedPlotName.value = sessionStorage.getItem('selectedPlotName') as string;
      selectedPlotFilename.value = sessionStorage.getItem('selectedPlotFilename') as string;
      selectedPlotFileUrl.value = sessionStorage.getItem('selectedPlotFileUrl') as string;
      iteration.value = sessionStorage.getItem('iteration') as string;
      stopCriteria.value = sessionStorage.getItem('stopCriteria') as string;
      elapsedTimeIntervalId.value = sessionStorage.getItem('elapsedTimeIntervalId') as string;
      calibrationStatusIntervalId.value = sessionStorage.getItem('calibrationStatusIntervalId') as string;
      validationsStatusIntervalId.value = sessionStorage.getItem('validationsStatusIntervalId') as string;
      resultsPathname.value = sessionStorage.getItem('resultsPathname') as string;
      
  
      stopCriteriaMet.value = JSON.parse(sessionStorage.getItem('stopCriteriaMet') as string) === "true";
      console.log("RunStatusStore has been refreshed from sessionStorage");
    }
  
    watch(plotList, (plotList) => { sessionStorage.setItem('plotList', JSON.stringify(plotList)); })
    watch(elapsedTime, (elapsedTime) => { sessionStorage.setItem('elapsedTime', elapsedTime); })
    watch(startTimeDate, (startTimeDate) => { sessionStorage.setItem('startTimeDate', startTimeDate); })
    watch(startTime, (startTime) => { sessionStorage.setItem('startTime', startTime); })
    watch(plotNames, (plotNames) => { sessionStorage.setItem('plotNames', plotNames); })
    watch(selectedPlotName, (selectedPlotName) => { sessionStorage.setItem('selectedPlotName', selectedPlotName); })
    watch(selectedPlotFilename, (selectedPlotFilename) => { sessionStorage.setItem('selectedPlotFilename', selectedPlotFilename); })
    watch(selectedPlotFileUrl, (selectedPlotFileUrl) => { sessionStorage.setItem('selectedPlotFileUrl', selectedPlotFileUrl); })
    watch(iteration, (iteration) => { sessionStorage.setItem('iteration', iteration); })
    watch(stopCriteria, (stopCriteria) => { sessionStorage.setItem('stopCriteria', stopCriteria); })
    watch(calibrationStatusIntervalId, (calibrationStatusIntervalId) => { sessionStorage.setItem('calibrationStatusIntervalId', calibrationStatusIntervalId); })
    watch(validationsStatusIntervalId, (validationsStatusIntervalId) => { sessionStorage.setItem('validationsStatusIntervalId', validationsStatusIntervalId); })
    watch(stopCriteriaMet, (stopCriteriaMet) => { sessionStorage.setItem('uiStopCritstopCriteriaMeteria', JSON.stringify(stopCriteriaMet)); })
    /** 
   * Load RunStatusStore
   */
  const loadRunStatusStore = async (): Promise<void> => {
    // load stopCriteria, startTimeDate, and startTime from load_calibration_run
    stopCriteria.value = userCalibrationRunData?.value?.stop_criteria;

    if (isCalibrationJobFinished(userCalibrationRunData?.value?.status)) {
      startTimeDate.value = new Date(userCalibrationRunData.value?.run_date as string);
      if (isValidDate(startTimeDate.value)) {
        startTime.value = convertTimeZone(startTimeDate.value);
      }
    }

    // load elapsedTime, validControlAndValidBestDone from get_status. 
    // Calibration must be Done to get validations
    // Calibration and Validations must be Done to get completed elapsedTime
    const getStatusResponse = await queryGetCalibrationStatus();
    const validations = getStatusResponse?._data?.validations;
    validControlAndValidBestDone.value = areValidControlAndValidBestDone(getStatusResponse);
    // get elapsed times from validations
    const elapsedTimes = validations
      .map((validation: any) => validation.elapsed_time)
      .filter((eTime: any) => eTime !== null && eTime !== undefined);

    // if there are elapsed times, get the max elapsed time
    // we will only have elapsed times if server is running on Parallel Works
    if (elapsedTimes.length > 0) {
      elapsedTime.value = Math.max(...elapsedTimes);
    }

    // load plotNames and plotList from get_plot_names
    plotNames.value = await queryGetPlotNames();
    plotList.value = plotNames?.value?._data?.plot_names;

    // load iteration from get_iteration.
    const getIterationResponse = await queryGetIteration();
    iteration.value = getIterationResponse?._data?.iteration;

    // load resultsPathname from get_job_data_dir. Calibration must be Done, Running, or Failed to get resultsPathname
    const getJobDataDirectoryResponse = await queryGetJobDataDirectory();
    resultsPathname.value = getJobDataDirectoryResponse?._data?.data_dir;
  };

  /**
   * Returns true if valid_control and valid_best are Done
   * @returns
   */
  const areValidControlAndValidBestDone = (getStatusResponse: any): boolean => {
    const validations = getStatusResponse?._data?.validations;
    const calibrationValidationsDone = validations.filter(
      (item: any) =>
        (item.validation_type === 'valid_best' || item.validation_type === 'valid_control') &&
        item.status === 'Done'
    );
  
    // Check if both 'valid_best' and 'valid_control' are present in the calibrationValidations array
    const hasValidBestDone = calibrationValidationsDone.some((item: any) => item.validation_type === 'valid_best');
    const hasValidControlDone = calibrationValidationsDone.some((item: any) => item.validation_type === 'valid_control');
  
    return hasValidBestDone && hasValidControlDone;
  }

  /**
   * Get Calibration Status
   * @return {any}
   */
  const queryGetCalibrationStatus = async (): Promise<any> => {
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
   * Get Calibration Plot Names
   * @return {any}
   */
  const queryGetPlotNames = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationPlotListNamesData>(`${ngencerfBaseUrl}/calibration/get_plot_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Get Calibration Plot
   * @return {any}
   */
  const queryGetPlot = async (plotName: string, include_data=false): Promise<any> => {
    let apiCallBody: DynamicObject = {plot_name: plotName, include_data: include_data};
    if (evaluateValidationRunId.value) {
      apiCallBody['validation_run_id'] = evaluateValidationRunId.value;
    } else {
      apiCallBody['calibration_run_id'] = calibrationJobId.value;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(apiCallBody)
    });
  };

  /**
   * Run Calibration
   * @return {any}
   */
  const runCalibrationJob = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/run_calibration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({calibration_run_id: calibrationJobId.value})
    });
  }

  /**
   * Get Calibration Iteration
   * @returns {any}
   */
  const queryGetIteration = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_iteration/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({calibration_run_id: calibrationJobId.value})
    });
  };

  /**
   * Cancel Calibration Job
   * @returns {any}
   */
  const cancelCalibrationJob = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({calibration_run_id: calibrationJobId.value})
    });
  };

  /**
   * Get Job Data Directory
   * @returns {any}
   */
  const queryGetJobDataDirectory = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_job_data_dir/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Hard Reset Run/Status Store
   */
  const hardResetRunStatusStore = (): void => {
    elapsedTime.value = "";
    startTimeDate.value = "";
    startTime.value = "";
    plotNames.value = "";
    plotList.value = [];
    selectedPlotName.value = "";
    selectedPlotFilename.value = "";
    selectedPlotFileUrl.value = "";
    iteration.value = undefined;
    stopCriteria.value = "";
    stopCriteriaMet.value = false;
    validControlAndValidBestDone.value = false;
    resultsPathname.value = undefined;

    if (elapsedTimeIntervalId.value) {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }

    if (calibrationStatusIntervalId.value) {
      clearInterval(calibrationStatusIntervalId.value);
      calibrationStatusIntervalId.value = undefined;
    }

    if (validationsStatusIntervalId.value) {
      clearInterval(validationsStatusIntervalId.value);
      validationsStatusIntervalId.value = undefined;
    }

    console.log("RunStatusStore has been hard reset");
  };

  return {
    startTimeDate,
    startTime,
    elapsedTime,
    plotNames,
    plotList,
    selectedPlotName,
    selectedPlotFilename,
    selectedPlotFileUrl,
    iteration,
    stopCriteria,
    stopCriteriaMet,
    elapsedTimeIntervalId,
    calibrationStatusIntervalId,
    validationsStatusIntervalId,
    validControlAndValidBestDone,
    resultsPathname,
    loadRunStatusStore,
    areValidControlAndValidBestDone,
    queryGetCalibrationStatus,
    queryGetPlotNames,
    queryGetPlot,
    runCalibrationJob,
    queryGetIteration,
    queryGetJobDataDirectory,
    cancelCalibrationJob,
    hardResetRunStatusStore
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
  import.meta.hot.accept(acceptHMRUpdate(useRunStatusStore, import.meta.hot));
}