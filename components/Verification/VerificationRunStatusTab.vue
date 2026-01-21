<template>
  <div class="w-full">
    <h1 class="pt-3 mb-8 text-3xl font-bold text-center" aria-label="Verification Run/Status Tab" title="Verification Run/Status Tab">
      Verification Run/Status
    </h1>
    <p v-if="!verificationJobId" class="text-center mt-1" style="font-size: 12px;font-weight: normal;">
      Click Run to submit and run the verification.
    </p>
    <br />
  </div>
  <div>

    <div class="grid place-items-center">
      <div class="grid grid-cols-5">
        <div class="col-span-2">
          <table>
            <caption style="text-align: center;font-size:1.1em;font-weight:bold;margin-bottom:3px;"
              aria-label="Verification Job Run Time Area" title="Verification Job Run Time Area">Verification Job Run Time
            </caption>
            <thead>
              <tr height="25px">
                <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
              </tr>
            </thead>
            <tbody>
              <tr height="40px" :aria-label="'Forecast Job ID ' + forecastJobId"
                :title="'Forecast Job ID ' + forecastJobId">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Forecast Job ID</div>
                </th>
                <td class="pl-5">{{ forecastJobId ?? '-'.repeat(15) }}</td>
              </tr>
              <tr height="40px" :aria-label="'Verification Job ID ' + verificationJobId"
                :title="'Verification Job ID ' + verificationJobId">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Verification Job ID</div>
                </th>
                <td class="pl-5">{{ verificationJobId ?? '-'.repeat(15) }}</td>
              </tr>
              <tr height="32px" :aria-label="'Submit Time ' + submitTime" :title="'Submit Time ' + submitTime">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Submit Time</div>
                </th>
                <td class="pl-5">{{ submitTime ?? '-'.repeat(15) }}</td>
              </tr>
              <tr height="32px" :aria-label="'Elapsed Time ' + elapsedTime" :title="'Elapsed Time ' + elapsedTime">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Elapsed Time</div>
                </th>
                <td class="pl-5">{{ elapsedTime ?? '-'.repeat(15) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div data-v-a7d04dc9="" class="col-span-1"><div data-v-a7d04dc9="" class="vertical-separator"></div></div>

        <div class="col-span-2 pl-5">
          <table>
            <caption style="font-size:1.1em;font-weight:bold;margin-bottom:3px;" aria-label="Verification Job Status area"
              title="Verification Job Status area">Verification Job Status</caption>
            <thead>
              <tr height="25px">
                <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
              </tr>
            </thead>
            <tbody>
              <tr height="40px" :aria-label="'Status is ' + verificationJobStatus"
                :title="'Status is ' + verificationJobStatus">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Status</div>
                </th>
                <td v-if="verificationJobStatus" class="pl-5">{{ verificationJobStatus }}</td>
                <td v-else class="pl-5">Ready</td>
              </tr>
              <tr v-show="logList.length > 1" height="32px" aria-label="Select Log Name" 
                title="Select Log Name">
                <th scope="row" class="text-right"><label for="DisplayOptions">Display</label></th>
                <td class="pl-3">
                  <Select id="DisplayOptions" class="p-select" v-model="selectedLogCategory" 
                    :options="logList" option-label="display_name" optionValue="name">
                  </Select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-span-5" v-if="failureMessages">
          <div style="display:flex; margin-top: 1em;"  aria-label="Failure Message" title="Failure Message">
            <div class="text-right font-bold" style="width: 155px;">
              <label class="text-right whitespace-nowrap" for="failureMessage" style="width: 155px;padding-top:1px;">
                Failure Message
              </label>
            </div>
            <div class="pl-5" style="width: 100%;">
              <span v-for="failure_message in failureMessages">
                {{ failure_message.message }}<br/>
              </span>
            </div>
          </div>
        </div>

        <!-- DISPLAY LOGS -->
        <div v-if="selectedLogCategory !== '' && selectedLogList && selectedLogList.length > 0" id="LogDisplayArea" class="col-span-5 p-2">
          <div class="pl-4">
            <table width="100%" summary="Verification Log Options and File Path">
              <caption class="sr-only">Verification Log Options and File Path table</caption>  
              <thead class="sr-only"><tr><th scope="col" style="min-width: 185px;">Verification Log Label</th><th scope="col">Verification Log Value</th></tr></thead>     
              <tbody>  
                <tr v-if="selectedLogList.length > 1" style="font-size: 0.9em;">
                  <td class="pr-2 pt-3 whitespace-nowrap"><label for="selectedLogOptions">Select {{ capitalCase(selectedLogCategory) }} Log</label></td>
                  <td>
                    <Select id="selectedLogOptions" class="p-select" style="width: auto; min-width: 254px;" v-model="selectedLogName" :options="selectedLogList"
                      optionLabel="name" optionValue="name">
                    </Select>
                  </td>
                </tr>
                <tr v-if="selectedLogFilePath !== '' && selectedLogList.length === 1" style="font-size: 0.9em;">
                  <td class="pr-2 pt-3 whitespace-nowrap"><b>Log Name</b></td>
                  <td class="pt-3">{{ selectedLogName }}</td>
                </tr>
                <tr v-if="selectedLogFilePath !== ''" style="font-size: 0.9em;">
                  <td class="pr-2 pt-3 whitespace-nowrap"><b>Log File Path</b></td>
                  <td class="pt-3 whitespace-nowrap overflow-auto">{{ selectedLogFilePath }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="selectedLogDisplay">
              <div class="pagination-box" v-if="selectedLogDisplay">
                <div class="pagination-rows">Rows {{ selectedLogStartRow }} to {{ selectedLogEndRow }} of {{
                  selectedLogTotalSize }}</div>
                <Paging v-model:currentPage="selectedLogCurrentPage" :totalPages=selectedLogTotalPages />
              </div>
            </div>
            <div v-else>
              Log file unavailable
            </div>

            <div v-if="selectedLogDisplay" id="selectedLogDisplay" class="p-2 gray-border overflow-scroll">
              <div v-html="selectedLogDisplay" class="whitespace-nowrap"></div>
            </div>
          </div>
        </div>

        <div class="col-span-3"></div>

        <div class="col-span-2 pl-5">
          <span v-if="forecastJobId && !verificationJobId">
            <Button class=" ngenButtonDiv-green font-normal" title="Run Button" aria-label="Run Button"
              @click="startVerificationJob()">
              Run
            </Button>
          </span>
          <span v-if="['Submitted','Running'].includes(verificationJobStatus)">
            <Button class="col-span-1 ngenButtonDiv-red" title="Cancel Button" @click="stopVerificationJob()"
              aria-label="Cancel Button">
              Cancel
            </Button>
          </span>
          <span v-if="verificationJobStatus === 'Done'">
            <Button class="ngenButtonDiv ml-6 font-normal px-4 whitespace-nowrap" title="View Results Button"
              @click="goNextTab()" aria-label="View Results Button">
              View Results
            </Button>
          </span>
        </div>

      </div>
    </div>

    <div class="waitgif" v-if="isVerificationLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Paging from "../Common/Paging.vue";

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";
import { hilightTab } from '@/composables/TabHilight';
import { storeToRefs } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
const { addToastRecord } = generalStore();

const toast = useToast();

import { useVerificationStore } from "@/stores/verification/VerificationStore";
const verificationStore = useVerificationStore();

const { 
  forecastJobId,
  verificationJobId, 
  submitTimeDate,
  submitTime,
  elapsedTime,
  verificationStatusCheckingInterval,
  verificationRunningTimeInterval,
  verificationJobStatus,
  failureMessages,
  isVerificationLoading 
} = storeToRefs(verificationStore);
const { 
  loadVerificationRunStatusTabData,
  loadVerificationStatusInformation,
  queryGetLogNames,
  queryGetLogData,
  queryGetLogStatus,
  updateRunningTime,
  createAndRunVerificationJob,
  cancelVerificationJob
} = useVerificationStore();

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

const populateLogListOptions = async() => {
  if (verificationJobId.value && !['Submitted','Validating and Preparing Job Data'].includes(verificationJobStatus.value)) {
    logList.value = [];
    logList.value.push({ name: '', display_name: logListDefault.value });
    logListOptions.value = [];

    nextTick(async () => {
      // Get Names of available Logs
      logs.value = await queryGetLogNames(verificationJobId.value);
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

      if (verificationJobStatus.value == 'Failed' && logListOptions.value.length > 0) {
        // Skip directly to ngen log if status is Failed
        selectedLogCategory.value = (logListOptions.value.at(-1)).name;
        nextTick(async () => {
          if (selectedLogList.value.length > 1) {
              selectedLogName.value = selectedLogList.value.at(-1).name;
          }
        });
      } else if (!selectedLogName.value) {
        // Start with default option
        selectedLogCategory.value = logListDefault.value;
      }
    });
  }
}

onMounted(async() => {
  hilightTab(VerificationTabs.tab_runStatus);

  clearInterval(verificationStatusCheckingInterval.value);
  clearInterval(verificationRunningTimeInterval.value);
  verificationStatusCheckingInterval.value = undefined;
  verificationRunningTimeInterval.value = undefined;
  verificationJobStatus.value = undefined;
  failureMessages.value = undefined;
  submitTime.value = undefined;
  elapsedTime.value = undefined;

  if (verificationJobId.value) {
    await populateLogListOptions();
    loadVerificationStatusInformation();
    loadVerificationRunStatusTabData();
  }
})

watch(verificationJobStatus, async (newVerificationJobStatus, oldVerificationJobStatus) => {
  if (forecastJobId.value && (newVerificationJobStatus || oldVerificationJobStatus) && !isVerificationLoading.value) {
    await populateLogListOptions();
  }
}, { immediate: true });

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

// Handle selectedLogCategory changes
watch(selectedLogCategory, async () => {
  if (selectedLogCategory.value != '' && selectedLogCategory.value != logListDefault.value) {
    selectedLogList.value = logLists.value[selectedLogCategory.value];
    selectedLogName.value = '';
    nextTick(() => {
      // start with the first log
      selectedLogName.value = selectedLogList.value[0].name;
      if (!selectedLogList.value.length) {
        const tMsg: ToastMessageOptions = { severity: 'info', summary: selectedLogName.value + ' not available', life: ToastTimeout.timeoutInfo };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    });
  } else {
    selectedLogList.value = [];
    selectedLogName.value = '';
  }
});

const updateLogRefs = async(getLogData: boolean) => {
  if (getLogData) {
    const response: any = await queryGetLogData(
      selectedLogCategory.value, // log_category
      selectedLogName.value, // log_name
      verificationJobId.value, // verification_run_id
      verificationJobStatus.value === 'Done' ? 0 : -1, // start from first page if done, else last page
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
      selectedLogTotalPages.value = ['Submitted','Running'].includes(verificationJobStatus.value) ? 1 : Math.ceil(selectedLogTotalSize.value / logDataPageSize.value);
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
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Log file unavailable', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  }
  if (verificationJobStatus.value === 'Running' && selectedLogFilePath.value) {
    // watch status every 10 seconds to see if log file changes
    clearTimeout(logTimeout);
    logTimeout = setTimeout(async() => {
      const status_response: any = await queryGetLogStatus(
        verificationJobId.value, // verification_run_id
        selectedLogFilePath.value, // log_path
        selectedLogByteOffset.value // byte_offset
      )
      if (status_response._data) {
        selectedLogStatus.value = status_response._data;
      }
    }, 10000);
  }
}

// Handle selectedLogName changes
watch(selectedLogName, async () => {
  if (selectedLogName.value !== '') {
    await updateLogRefs(true);
    if (selectedLogDisplay.value && selectedLogDisplay.value != '') {
      nextTick(async () => {
        document.getElementById('selectedLogDisplay').scrollTop = document.getElementById('selectedLogDisplay').scrollHeight;
      });
    }
  }
});

// Watch for page number changes in logs
watch(selectedLogCurrentPage, async () => {
  if (isNaN(selectedLogCurrentPage.value) || selectedLogCurrentPage.value < 1 || selectedLogCurrentPage.value > selectedLogTotalPages.value) {
    console.log('ERROR: Page number ' + selectedLogCurrentPage.value + ' out of bounds');
  } else {
    selectedLogStartRow.value = (logDataPageSize.value * (selectedLogCurrentPage.value - 1)) + 1;
    if (selectedLogCurrentPage.value === selectedLogTotalPages.value) {
      selectedLogEndRow.value = selectedLogTotalSize.value;
    } else {
      selectedLogEndRow.value = (selectedLogStartRow.value + logDataPageSize.value) - 1;
    }
    const response: any = await queryGetLogData(
      selectedLogCategory.value, // log_category,
      selectedLogName.value, // log_name
      verificationJobId.value, // verification_run_id
      selectedLogStartRow.value - 1, // start
      logDataPageSize.value // limit
    );
    if (response?._data) {
      let logText = '';
      for (let t = 0; t < response?._data?.log_data.length; t++) {
        logText += response?._data?.log_data[t] + '<br/>\n';
      }
      selectedLogDisplay.value = logText;
    } else {
      toast.removeAllGroups();
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Log data is currently unavailable', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  }
});

watch(selectedLogStatus, async () => {
  // if selectedLogStatus is not empty, update log refs
  if (selectedLogStatus.value && Object.keys(selectedLogStatus.value).length > 0) {
    updateLogRefs(selectedLogStatus.value?.file_updated);
  }
});

function capitalCase(str: string) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Start the verification job
 */
const startVerificationJob = async () => {
  createAndRunVerificationJob().then((response) => {
    if (response.status >= 200 && response.status < 300) {
      verificationJobId.value = response._data.verification_run_id;
      verificationJobStatus.value = response._data.status;
      failureMessages.value = response._data.failure_messages;

      if (response?._data?.submit_date) {
        submitTimeDate.value = new Date(response?._data?.submit_date);

        if (isValidDate(submitTimeDate.value)) {
          submitTime.value = formatDateForRunOnString(submitTimeDate.value);
        }
        if (verificationStatusCheckingInterval.value) {
          clearInterval(verificationStatusCheckingInterval.value);
        }
        if (verificationRunningTimeInterval.value) {
          clearInterval(verificationRunningTimeInterval.value);
        }
        verificationStatusCheckingInterval.value = setInterval(loadVerificationStatusInformation, 10000);
        verificationRunningTimeInterval.value = setInterval(updateRunningTime, 1000);
      } else {
        loadVerificationStatusInformation();
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: `Could not find Verification job ${verificationJobId.value} in server response`, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  })
};

/**
 * Stop (Cancel) the verification job
 */
const stopVerificationJob = async () => {
  try {
    const cancelVerificationJobResponse = await cancelVerificationJob();

    if (cancelVerificationJobResponse?._data?.status) {
      verificationJobStatus.value = cancelVerificationJobResponse._data.status;
      failureMessages.value = cancelVerificationJobResponse._data.failure_messages;

      if (verificationJobStatus.value !== 'Cancelled') {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Verification status not set to Cancelled after clicking CANCEL', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      await loadVerificationRunStatusTabData();
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Could not get Verification status from server', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } catch (error) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error cancelling Verification job', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

const goNextTab = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[VerificationTabs.tab_results];
  e.click();
}

onUnmounted(() => {
  clearInterval(verificationStatusCheckingInterval.value);
  clearInterval(verificationRunningTimeInterval.value);
  verificationStatusCheckingInterval.value = undefined;
  verificationRunningTimeInterval.value = undefined;
  verificationJobStatus.value = undefined;
  failureMessages.value = undefined;
  submitTime.value = undefined;
  elapsedTime.value = undefined;
  resetUserLogRefs();
})

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#PgTitle {
  text-align: center;
  font-size: 30px;
  margin-top: 40px;
  margin-bottom: 40px;
}

.gray-border {
  border: 2px solid #d9d9d9;
}
</style>