import { defineStore, storeToRefs } from "pinia";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useForecastStore } from '@/stores/forecast/ForecastStore';
import { useVerificationStore } from '@/stores/verification/VerificationStore';

function capitalCase(str: string) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const useLogStore = defineStore('LogStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const { forecastJobId, overallColdStartForecastStatus } = storeToRefs(useForecastStore());
  const { verificationJobId, verificationJobStatus } = storeToRefs(useVerificationStore());

  const logList = ref<any[]>([]);
  const logListDefault = ref<string>('Select an option');
  const logs = ref<APIResponse>({});
  const logDataPageSize = ref<number>(1000);
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
          (forecastJobId.value ? 'forecast_run_id' :
          'calibration_run_id')
        ]:
        verificationJobId.value ? verificationJobId.value :
        (forecastJobId.value ? forecastJobId.value :
        null)
      })
    });
  };

  /**
    * Get Log Data
    * @return {any}
    */
  const queryGetLogData = async (
    log_category: string,
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
        log_category: log_category,
        log_name: log_name,
        start: start !== undefined ? start : 0,
        limit: limit !== undefined ? limit : 1000,
        [
          verificationJobId.value ? 'verification_run_id' :
          (forecastJobId.value ? 'forecast_run_id' :
          'calibration_run_id')
        ]:
        verificationJobId.value ? verificationJobId.value :
        (forecastJobId.value ? forecastJobId.value :
        null)
      })
    });
  };

  /** 
   * Get Log Status
   * @return {any}
   */
  const queryGetLogStatus = async (
    log_category: string,
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
        log_category: log_category,
        log_name: log_name,
        byte_offset: byte_offset,
        [
          verificationJobId.value ? 'verification_run_id' :
          (forecastJobId.value ? 'forecast_run_id' :
          'calibration_run_id')
        ]:
        verificationJobId.value ? verificationJobId.value :
        (forecastJobId.value ? forecastJobId.value :
        null)
      })
    });
  };

  const currentJobStatus = computed(() => {
    return verificationJobId.value ? verificationJobStatus.value :
      (forecastJobId.value ? overallColdStartForecastStatus.value :
      undefined)
  });

  /**
   * populate log list options
   */
  const populateLogListOptions = async(plotListOptions: [] = []) => {
    logLists.value = {};
    logList.value = [];
    logListOptions.value = [];
    
    logList.value.push({ name: '', display_name: logListDefault.value });
    for (const option of plotListOptions) {
      logListOptions.value.push(option);
    }
  
    // Get Names of available Logs
    logs.value = await queryGetLogNames();
    if (logs.value?._data?.log_names) {
      for (let l = 0; l < logs.value?._data?.log_names.length; l++) {
        Object.keys(logs.value?._data?.log_names[l]).forEach(key => {
          let logNameList = [];
          for (let n = 0; n < logs.value?._data?.log_names[l][key].length; n++) {
            logNameList.push({ 'name': logs.value?._data?.log_names[l][key][n] });
          }
          logLists.value[key] = logNameList;
        });
      }
    }
    
    // Add Log Options to the dropdown
    Object.keys(logLists.value).forEach(key => {
      logListOptions.value.push({ name: key, display_name: capitalCase(key) + ' Logs' });
    });
    for (const option of logListOptions.value) {
      if (!(logList.value.find(obj => obj.name === option.name))) {
        logList.value.push(option);
      }
    }

    if ((!selectedLogCategory.value || (currentJobStatus.value && currentJobStatus.value.includes('Failed'))) && logListOptions.value.length > 0) {
      // Skip directly to first available log if status is Failed or no option has been picked
      selectedLogCategory.value = logListOptions.value[0].name;
      nextTick(() => {
        if (!selectedLogList.value || selectedLogList.value.length === 0) {
          selectedLogList.value = logLists.value[selectedLogCategory.value];
        }
        if (selectedLogList.value && selectedLogList.value.length > 0) {
          selectedLogName.value = selectedLogList.value.at(-1).name;
        }
      });
    } else if (!selectedLogCategory.value) {
      // Start with first option
      selectedLogCategory.value = logListOptions.value[0].name;
    }

    logLists.value = logLists.value;
    logList.value = logList.value;
    logListOptions.value = logListOptions.value;
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
        selectedLogCategory.value, // log_category
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
          selectedLogCategory.value, // log_category
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