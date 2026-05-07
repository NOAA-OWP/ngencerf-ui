import { defineStore, storeToRefs } from "pinia";

import { generalStore } from '@/stores/common/GeneralStore';
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useForecastStore } from '@/stores/forecast/ForecastStore';
import { useHindcastStore } from '@/stores/hindcast/HindcastStore';
import { useVerificationStore } from '~/stores/forecast/VerificationStore';

function capitalCase(str: string) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const useLogStore = defineStore('LogStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const { userCalibrationRunData } = storeToRefs(useUserDataStore());
  const { iterationValidationRunId, validationStatus } = storeToRefs(generalStore());
  const { forecastJobId, overallColdStartForecastStatus } = storeToRefs(useForecastStore());
  const { hindcastJobId, overallColdStartHindcastStatus } = storeToRefs(useHindcastStore());
  const { verificationJobId, verificationJobStatus } = storeToRefs(useVerificationStore());

  const logList = ref<any[]>([]);
  const logListDefault = ref<string>('Select an option');
  const logs = ref<APIResponse>({});
  const logDataPageSize = ref<number>(100);
  const logLists = ref<DynamicObject>({});
  const logListOptions = ref<any[]>([]);
  const selectedLogCategory = ref<string>('');
  const selectedLogList = ref<any[]>([]);
  const selectedLogName = ref<string>('');
  const selectedLogDisplay = ref<string>('');
  const selectedLogTotalSize = ref<number>(0);
  const selectedLogCurrentPage = ref<number>(1);
  const selectedLogTotalPages = ref<number>(1);
  const selectedLogStartRow = ref<number>(1);
  const selectedLogEndRow = ref<number>(logDataPageSize.value);
  const selectedLogFilePath = ref<string>('');
  const selectedLogByteOffset = ref<number>(0);
  const selectedLogStatus = ref<DynamicObject>({});

  let logTimeout;

  /**
    * Get Log Names
    * @return {any}
    */
  const queryGetLogNames = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log_names/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({[
          verificationJobId.value ? 'verification_run_id' :
          (hindcastJobId.value ? 'hindcast_run_id' :
          (forecastJobId.value ? 'forecast_run_id' :
          (iterationValidationRunId.value ? 'validation_run_id' :
          'calibration_run_id')))
        ]:
        verificationJobId.value ? verificationJobId.value :
        (hindcastJobId.value ? hindcastJobId.value :
        (forecastJobId.value ? forecastJobId.value :
        (iterationValidationRunId.value ? iterationValidationRunId.value :
        userCalibrationRunData?.value?.calibration_run_id)))
      })
    });
  };

  /**
    * Get Log Data
    * @return {any}
    */
  const queryGetLogData = async (
    log_name: string,
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
        log_name: log_name,
        start: start !== undefined ? start : 0,
        limit: limit !== undefined ? limit : 1000,
        [
          verificationJobId.value ? 'verification_run_id' :
          (hindcastJobId.value ? 'hindcast_run_id' :
          (forecastJobId.value ? 'forecast_run_id' :
          (iterationValidationRunId.value ? 'validation_run_id' :
          'calibration_run_id')))
        ]:
        verificationJobId.value ? verificationJobId.value :
        (hindcastJobId.value ? hindcastJobId.value :
        (forecastJobId.value ? forecastJobId.value :
        (iterationValidationRunId.value ? iterationValidationRunId.value :
        userCalibrationRunData?.value?.calibration_run_id)))
      })
    });
  };

  /** 
   * Get Log Status
   * @return {any}
   */
  const queryGetLogStatus = async (
    log_name: string,
    byte_offset: number
  ): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log_status/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        log_name: log_name,
        byte_offset: byte_offset,
        [
          verificationJobId.value ? 'verification_run_id' :
          (hindcastJobId.value ? 'hindcast_run_id' :
          (forecastJobId.value ? 'forecast_run_id' :
          (iterationValidationRunId.value ? 'validation_run_id' :
          'calibration_run_id')))
        ]:
        verificationJobId.value ? verificationJobId.value :
        (hindcastJobId.value ? hindcastJobId.value :
        (forecastJobId.value ? forecastJobId.value :
        (iterationValidationRunId.value ? iterationValidationRunId.value :
        userCalibrationRunData?.value?.calibration_run_id)))
      })
    });
  };

  const currentJobStatus = computed(() => {
    return verificationJobId.value ? verificationJobStatus.value :
      (hindcastJobId.value ? overallColdStartHindcastStatus.value :
      (forecastJobId.value ? overallColdStartForecastStatus.value :
      (iterationValidationRunId.value ? validationStatus.value :
      userCalibrationRunData?.value?.status)))
  });

  /**
   * populate log list options
   */
  const populateLogListOptions = async(plotListOptions: [] = []) => {
    const nextLogListOptions: any[] = Array.from(plotListOptions);
    const nextLogLists: DynamicObject = {};

    logs.value = await queryGetLogNames();

    if (logs.value?._data?.log_names) {
      for (let l = 0; l < logs.value._data.log_names.length; l++) {
        Object.keys(logs.value._data.log_names[l]).forEach((key) => {
          const logList = logs.value._data.log_names[l][key].map((name: string) => ({
            name,
            display_name: name.split('/').pop()?.split('.')[0] ?? name
          }));

          nextLogLists[key] = logList;
        });
      }
    }

    Object.keys(nextLogLists).forEach((key) => {
      nextLogListOptions.push({
        name: key,
        display_name: capitalCase(key) + ' Logs',
      });
    });

    const currentLogCategory = selectedLogCategory.value;
    const currentLogName = selectedLogName.value;
;
    logListOptions.value = nextLogListOptions;
    logLists.value = nextLogLists;

    if (currentLogCategory && nextLogLists[currentLogCategory]) {
      selectedLogList.value = nextLogLists[currentLogCategory];

      if (selectedLogList.value.some((log: any) => log.name === currentLogName)) {
        selectedLogName.value = currentLogName;
      } else if (selectedLogList.value.length > 0) {
        selectedLogName.value = selectedLogList.value[0].name;
      } else {
        selectedLogName.value = '';
      }
    } else {
      selectedLogList.value = [];
      selectedLogName.value = '';
    }

    if ((!selectedLogCategory.value || selectedLogCategory.value == logListDefault.value) && logListOptions.value.length > 0) {
      // Skip directly to first available log if no option has been picked
      selectedLogCategory.value = logListOptions.value[0].name;
      nextTick(() => {
        if (!selectedLogList.value || selectedLogList.value.length === 0) {
          selectedLogList.value = logLists.value[selectedLogCategory.value];
        }
        if (selectedLogList.value && selectedLogList.value.length > 0) {
          selectedLogName.value = selectedLogList.value[0].name;
        }
      });
    }
  }

  // Reset refs when selectedLogName changes
  const resetUserLogRefs = (): void => {
    // log refs
    selectedLogCategory.value = '';
    selectedLogList.value = [];
    selectedLogName.value = '';
    selectedLogDisplay.value = '';
    selectedLogTotalSize.value = 0;
    selectedLogCurrentPage.value = 1;
    selectedLogTotalPages.value = 0;
    selectedLogStartRow.value = 1;
    selectedLogEndRow.value = logDataPageSize.value;
    selectedLogFilePath.value = '';
    selectedLogByteOffset.value = 0;
    selectedLogStatus.value = {};
    clearTimeout(logTimeout);
  }

  const updateLogRefs = async(getLogData: boolean) => {
    if (getLogData) {
      const response: any = await queryGetLogData(
        selectedLogName.value, // log_name
        currentJobStatus.value === 'Done' ? 0 : -1, // start from first page if done, else last page
        logDataPageSize.value // limit
      );
      if (response?._data?.log_data) {
        let logText = '';
        for (let t = 0; t < response?._data.log_data.length; t++) {
          logText += response?._data.log_data[t] + '<br/>\n';
        }
        selectedLogDisplay.value = logText;
        selectedLogTotalSize.value = response?._data.pagination_metadata?.count;
        // only show one page for running jobs (this disables paging)
        selectedLogTotalPages.value = currentJobStatus.value !== 'Done' ? 1 : Math.ceil(selectedLogTotalSize.value / logDataPageSize.value);
        selectedLogEndRow.value = response?._data.pagination_metadata?.count;
        if (logDataPageSize.value < selectedLogTotalSize.value) {
          selectedLogStartRow.value = (selectedLogTotalSize.value - logDataPageSize.value) + 1;
        } else {
          selectedLogStartRow.value = 1;
        }
        selectedLogFilePath.value = response?._data.log_path;
        selectedLogByteOffset.value = response?._data?.byte_offset;
        if (document.getElementById('selectedLogDisplay')) {
          nextTick(async () => {
            document.getElementById('selectedLogDisplay').style.height = (Math.max((document.getElementById('MainLeftDataParent') as HTMLElement).getBoundingClientRect().bottom
            - (document.getElementById('selectedLogDisplay') as HTMLElement).getBoundingClientRect().top, 250) + 'px');
          });
        }
      } else {
        selectedLogDisplay.value = '';
        selectedLogFilePath.value = '';
      }
    }
    if (currentJobStatus.value && currentJobStatus.value.includes('Running')) {
      // watch status every 10 seconds to see if log file changes
      clearTimeout(logTimeout);
      logTimeout = setTimeout(async() => {
        const status_response: any = await queryGetLogStatus(
          selectedLogName.value, // log_name
          selectedLogByteOffset.value // byte_offset
        )
        selectedLogStatus.value = status_response?._data;
      }, 10000);
    }
  }

  return {
    logList,
    logListDefault,
    logs,
    logDataPageSize,
    logLists,
    logListOptions,
    selectedLogCategory,
    selectedLogList,
    selectedLogName,
    selectedLogDisplay,
    selectedLogTotalSize,
    selectedLogCurrentPage,
    selectedLogTotalPages,
    selectedLogStartRow,
    selectedLogEndRow,
    selectedLogFilePath,
    selectedLogByteOffset,
    selectedLogStatus,
    populateLogListOptions,
    queryGetLogData,
    resetUserLogRefs,
    updateLogRefs,
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLogStore, import.meta.hot));
}