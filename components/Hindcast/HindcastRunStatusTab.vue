<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <div id="HindcastRunStatusPage">
    <div class="pl-6 pr-2 pt-2">
      <div class="flex mt-3">
        <div class="w-5/6 relative">
          <div v-if="!hindcastJobId || !overallColdStartHindcastStatus" class="w-full">
            <p class="text-center mt-1" style="font-size: 12px;font-weight: normal;">
              Click Run to submit and run the hindcast.
            </p>
          </div>
          <div v-else-if="logListOptions.length > 0" class="inline-block">
            <label for="DisplayOptions" class="pr-2 pt-3">Display </label>
            <div class="inline-block w-2/3">
              <Select id="DisplayOptions" class="p-select" style="width: auto; min-width: 254px;"
                v-model="selectedLogCategory" :options="logListOptions" option-label="display_name" optionValue="name">
              </Select>
            </div>
          </div>
          
          <div class="grid auto-cols-max grid-cols-3 gap=1 text-sm text-left mt-2">
            <div class="col-span-1">
              <div>
                <span class="font-medium">Calibration Job ID: </span>
                {{ calibrationRunForHindcast?.calibration_run_id ?? '-'.repeat(15) }}
              </div>
              <div>
                <span class="font-medium">Hindcast Job ID: </span>
                {{ hindcastJobId ?? '-'.repeat(15) }}
              </div>
              <div>
                <span class="font-medium">Gage: </span>
                {{ userCalibrationRunData?.gage?.gage_id }}
              </div>
              <div>
                <span class="font-medium">Station Name: </span>
                {{ userCalibrationRunData?.gage?.station_name }}
              </div>
            </div>
            <div class="col-span-1">
              <div>
                <span class="font-medium">Configuration: </span>
                {{ hindcastConfigurationName ?? 'Unknown' }}
              </div>
              <div>
                <span class="font-medium">Cycle Date: </span>
                {{ (cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) + ' UTC' : 'None') }}
              </div>
              <div>
                <span class="font-medium">{{ coldStartJobId ? 'Saved State' : 'Cold' }} Start Date: </span>
                {{ (coldStartDate ? formatISOStringOrDateToYYYYMMDDHHMM(coldStartDate) + ' UTC'  : 'None') }}
              </div>
              <div>
                <span class="font-medium">Advance Interval: </span>
                {{ (intervalCycle ?? 'Undefined') }}
              </div>
              <div>
                <span class="font-medium">Number of Intervals: </span>
                {{ (numIterations ?? 'Undefined') }}
              </div>
            </div>
            <div class="col-span-1">
              <div>
                <span class="font-medium">Status: </span>
                {{ (hindcastJobId && overallColdStartHindcastStatus) ? overallColdStartHindcastStatus : 'Ready' }}
              </div>
              <div>
                <span class="font-medium">Submit Time: </span>
                {{ submitTime ?? '-'.repeat(15) }}
              </div>
              <div>
                <span class="font-medium">Elapsed Time: </span>
                {{ elapsedTime ?? '-'.repeat(15) }}
              </div>
              <div class="mt-2 mb-2">
                <!--BUTTONS - START-->
                <span v-if="!runButtonDisabled && !hindcastJobId">
                  <Button class="ngenButtonDiv ml-6 font-normal px-4" title="Previous Button" aria-label="Previous Button"
                    @click="goToSetupHindcastTab()">
                    Previous
                  </Button>
                </span>
                <span v-if="!runButtonDisabled">
                  <Button class="ngenButtonDiv-green ml-6 font-normal px-4" title="Run Button" aria-label="Run Button"
                    @click="startHindcastRun()" :disabled="runButtonDisabled">
                    Run
                  </Button>
                </span>
                <span v-if="!cancelButtonDisabled">
                  <Button class="ngenButtonDiv-red ml-6 font-normal px-4" title="Cancel Button" aria-label="Cancel Button" 
                    @click="cancelHindcastRun()" :disabled="cancelButtonDisabled">
                    Cancel
                  </Button>
                </span>
                <span v-if="overallColdStartHindcastStatus === 'Done'">
                  <Button class="ngenButtonDiv ml-6 font-normal px-4 whitespace-nowrap" title="View Results Button"
                    @click="goToResultsTab()" aria-label="View Results Button">
                    View Results
                  </Button>
                </span>
                <!--BUTTONS - END-->
              </div>
            </div>
            <div class="col-span-3">
              <div>
                <span class="font-bold">Results Pathname: </span>
                <span class="whitespace-nowrap overflow-auto">{{ resultsPathname }}</span>
              </div>
              <div v-if="failureMessages && failureMessages.length > 0">
                <span class="font-bold">{{ failureMessages.length > 1 ? 'Messages' : 'Message' }}: </span>
                <span v-for="failure_message in failureMessages">
                  {{ failure_message.message }}<br/>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="pl-4 ml-auto text-nowrap text-right">
          <a v-if="userCalibrationRunData" href="#" class="inline-block p-1 c-blue underline mt-1"
            @click="toggleMessagesGroup">
            Show Calibration Details</a>
        </div>

      </div>
    </div>

    <!--LOGGING SECTION-->
    <div v-if="!(hindcastJobId && overallColdStartHindcastStatus) || ['Saved','Ready'].includes(overallColdStartHindcastStatus)" 
      class="col-span-5 p-2 border-t border-[#d9d9d9] flex flex-col items-center" id="LoggingSection">
      <div class="mb-4">
        <div class="inline-flex flex-col items-center">
          <p class="font-semibold mb-2">Global Logging</p>
          <div class="flex gap-6">
            <label v-for="[label, val] in [['Enabled', true], ['Disabled', false]]" :key="label as string"
              class="flex items-center gap-1">
              <input type="radio" :value="val" v-model="hindcastJobNgenGlobalLogging" />
              <span>{{ label }}</span>
            </label>
          </div>
        </div>
      </div>
      <div :class="[
        'mb-4',
        { 'opacity-50 pointer-events-none': !hindcastJobNgenGlobalLogging }
      ]">
        <div class="inline-flex flex-col items-center mb-2">
          <p class="font-semibold mb-2">Log File Mode</p>
          <div class="flex gap-6">
            <label v-for="[label, val] in [['Unified', false], ['Split by Module', true]]" :key="label as string"
              class="flex items-center gap-1">
              <input type="radio" :value="val" v-model="hindcastJobLogFileMode" :disabled="!hindcastJobNgenGlobalLogging"/>
              <span class="whitespace-nowrap">{{ label }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <p class="font-semibold mb-2 text-center">Ngen and Module Log Levels</p>
        <div :class="[
          'overflow-x-auto',
          { 'opacity-50 pointer-events-none': !hindcastJobNgenGlobalLogging }
        ]">
          <table class="table-auto text-left border-collapse mx-auto" aria-label="Module Logging Levels">
            <thead>
              <tr>
                <th class="pr-4">Module</th>
                <th v-for="level in ['Debug', 'Info', 'Warning', 'Severe', 'Fatal']" :key="level" class="px-2">
                  {{ level }}
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- ngen and forcing rows at the top -->
              <tr>
                <td class="pr-4">ngen</td>
                <td v-for="level in ['debug', 'info', 'warning', 'severe', 'fatal']" :key="'ngen' + level"
                  class="px-2">
                  <input type="radio" :name="'loglevel-ngen'" :value="level" v-model="ngenLogLevel"
                    :disabled="!hindcastJobNgenGlobalLogging" />
                </td>
              </tr>
              <tr>
                <td class="pr-4">forcing</td>
                <td v-for="level in ['debug', 'info', 'warning', 'severe', 'fatal']" :key="'forcing' + level"
                  class="px-2">
                  <input type="radio" :name="'loglevel-forcing'" :value="level" v-model="forcingLogLevel"
                    :disabled="!hindcastJobNgenGlobalLogging" />
                </td>
              </tr>
              <!-- Per-module logLevels -->
              <tr v-for="(val, module) in logLevels" :key="module">
                <td class="pr-4">{{ module }}</td>
                <td v-for="level in ['debug', 'info', 'warning', 'severe', 'fatal']" :key="level" class="px-2">
                  <input type="radio" :name="`loglevel-${module}`" :value="level" v-model="logLevels[module]"
                    :disabled="!hindcastJobNgenGlobalLogging" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- DISPLAY LOGS -->
    <div v-else>
      <LogDisplay/>
    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { ToastMessageOptions } from "primevue/toast";
import MessagesGroup from "../Common/MessagesGroup.vue";
import LogDisplay from "../Common/LogDisplay.vue";

import { generalStore } from '~/stores/common/GeneralStore';
import { useUserDataStore } from '@/stores/common/UserDataStore';
import { useHindcastStore } from '@/stores/hindcast/HindcastStore';
import { useLogStore } from '@/stores/common/LogStore';

import { hilightTab } from '@/composables/TabHilight';
import { isValidDate } from '@/utils/CommonHelpers';
import { calculateElapsedTime, sumAndFormatElapsedTimes } from '@/utils/TimeHelpers';

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();

const runButtonDisabled = ref<boolean>(true);
const cancelButtonDisabled = ref<boolean>(true);
const showMessagesGroup = ref<boolean>(false);

const { fetchUserCalibrationRunData } = useUserDataStore();
const { userCalibrationRunData, ngenLogLevel, forcingLogLevel, logLevels } = storeToRefs(useUserDataStore());

const {
  hindcastJobId,
  coldStartJobId,
  coldStartDate,
  cycleDate,
  intervalCycle,
  numIterations,
  hindcastConfiguration,
  hindcastConfigurationName,
  hindcastJobStatus,
  coldStartJobStatus,
  failureMessages,
  elapsedTime,
  submitTimeDate,
  submitTime,
  elapsedTimeIntervalId,
  hindcastJobStatusIntervalId,
  resultsPathname,
  calibrationRunForHindcast,
  overallColdStartHindcastStatus,
  hindcastJobNgenGlobalLogging,
  hindcastJobLogFileMode
} = storeToRefs(useHindcastStore());
const {
  loadHindcastRunStatusTabData,
  createAndRunHindcastJob,
  cancelHindcastJob,
  getStatus,
  hardResetHindcastStore
} = useHindcastStore();

const {
  selectedLogCategory,
  logListOptions
} = storeToRefs(useLogStore());
const {
  populateLogListOptions,
  resetUserLogRefs
} = useLogStore();

onMounted(async () => {
  toast.removeAllGroups(); // clear all toast messages
  isLoading.value = false; // set isLoading to false

  // scroll to top of the page
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // highlight the tab when selected
  hilightTab(HindcastTabs.tab_hindcastRunStatus);

  clearInterval(hindcastJobStatusIntervalId.value);
  clearInterval(elapsedTimeIntervalId.value);
  hindcastJobStatusIntervalId.value = undefined;
  elapsedTimeIntervalId.value = undefined;
  
  // get calibration job data if we don't already have it
  if (!userCalibrationRunData.value) {
    await fetchUserCalibrationRunData();
  }
  if (hindcastJobId.value) {
    await loadHindcastRunStatusTabData();
    if (overallColdStartHindcastStatus.value && !['Ready','Submitted'].includes(overallColdStartHindcastStatus.value)) {
      await populateLogListOptions();
      if (['Submitted', 'Running'].includes(coldStartJobStatus.value ?? '') || ['Submitted', 'Running'].includes(hindcastJobStatus.value ?? '')) {
        createColdStartAndHindcastStatusInterval();
        createElapsedTimeInterval();
      }
    }
  }

  // set log levels
  if (calibrationRunForHindcast?.value?.logging_config?.modules['ngen']) {
    ngenLogLevel.value = calibrationRunForHindcast?.value?.logging_config?.modules['ngen'] as LogLevel;
  } else {
    ngenLogLevel.value = 'info';
  }
  if (calibrationRunForHindcast?.value?.logging_config?.modules['forcing']) {
    forcingLogLevel.value = userCalibrationRunData?.value?.logging_config?.modules['forcing'] as LogLevel;
  } else {
    forcingLogLevel.value = 'info';
  }
  
  if (calibrationRunForHindcast?.value?.logging_config?.modules) {
    Object.keys(calibrationRunForHindcast.value.logging_config.modules).forEach(server_key => {
      // Find matching key in log levels somehow
      Object.keys(logLevels.value).forEach(ui_key => {
        if (ui_key.toLowerCase() == server_key.toLowerCase()) {
          logLevels.value[ui_key] = ref(calibrationRunForHindcast.value.logging_config.modules[server_key] as LogLevel);
        }
      });
    });
  }

  if (!cycleDate.value && calibrationRunForHindcast?.value?.cycle_date) {
    cycleDate.value = calibrationRunForHindcast.value.cycle_date;
  }
  if (!coldStartDate.value && calibrationRunForHindcast?.value?.cold_start?.cold_start_date) {
    coldStartDate.value = calibrationRunForHindcast.value.cold_start.cold_start_date;
  }
  if (!intervalCycle.value && calibrationRunForHindcast?.value?.interval_cycle) {
    intervalCycle.value = calibrationRunForHindcast.value.interval_cycle;
  }
  if (!numIterations.value && calibrationRunForHindcast?.value?.num_iterations) {
    numIterations.value = calibrationRunForHindcast.value.num_iterations;
  }

  runButtonDisabled.value = !['Unknown','Ready'].includes(overallColdStartHindcastStatus.value);
  cancelButtonDisabled.value = !runButtonDisabled.value || (!['Submitted','Running'].includes(coldStartJobStatus.value) && !['Submitted','Running'].includes(hindcastJobStatus.value));

  watch(overallColdStartHindcastStatus, (newColdStartHindcastStatus, oldColdStartHindcastStatus) => {
    cancelButtonDisabled.value = !runButtonDisabled.value || (!['Submitted','Running'].includes(coldStartJobStatus.value) && !['Submitted','Running'].includes(hindcastJobStatus.value));
    if (hindcastJobId.value && 
      ( 
        coldStartJobStatus.value === 'Running' ||
        hindcastJobStatus.value === 'Running' ||
        (oldColdStartHindcastStatus && oldColdStartHindcastStatus !== "Unknown" && 
        newColdStartHindcastStatus && newColdStartHindcastStatus !== "Unknown")
      )
    ) {
      populateLogListOptions();
    }
  });
});

const toggleMessagesGroup = async () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

/**
 * Create elapsedTimeIntervalId to increment elapsedTime every second while coldStartJobStatus is Running
 * or hindcastJobStatus is Submitted or Running
 */
const createElapsedTimeInterval = () => {
  clearInterval(elapsedTimeIntervalId.value);
  elapsedTimeIntervalId.value = setInterval(async () => {
    // continue incrementing elapsedTime every second while coldStartJobStatus is Submitted
    // or hindcastJobStatus is Submitted or Running
    if (['Submitted','Running'].includes(coldStartJobStatus.value ?? '') || ['Submitted', 'Running'].includes(hindcastJobStatus.value ?? '')) {
      elapsedTime.value = calculateElapsedTime(submitTimeDate.value as Date, new Date());
    } else {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }
  }, 1000) as unknown as number;
};

/**
 * Create hindcastJobStatusIntervalId to update coldStartJobStatus and hindcastJobStatus every 10 seconds
 * while coldStartJobStatus or hindcastJobStatus is Submitted or Running
 */
const createColdStartAndHindcastStatusInterval = () => {
  clearInterval(hindcastJobStatusIntervalId.value);
  hindcastJobStatusIntervalId.value = setInterval(async () => {
    await loadHindcastRunStatusTabData();
    await populateLogListOptions();
    // if cold start and hindcast job are not Submitted or Running, clear the interval
    if (!['Submitted', 'Running'].includes(coldStartJobStatus.value ?? '') && !['Submitted', 'Running'].includes(hindcastJobStatus.value ?? ''))
    {
      clearInterval(hindcastJobStatusIntervalId.value);
      hindcastJobStatusIntervalId.value = undefined;
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }
  }, 10000) as unknown as number;
};

/**
 * Start the hindcast run
 */
const startHindcastRun = async () => {
  runButtonDisabled.value = true;
  const createAndRunHindcastJobResponse = await createAndRunHindcastJob(
    calibrationRunForHindcast?.value?.calibration_run_id as number, 
    hindcastConfiguration?.value?.name as string,
    cycleDate.value,
    coldStartDate.value,
    coldStartJobId.value,
    intervalCycle.value,
    numIterations.value
  );

  if (createAndRunHindcastJobResponse.status >= 200 && createAndRunHindcastJobResponse.status < 300) {
    hindcastJobId.value = createAndRunHindcastJobResponse._data.hindcast_run_id;
    await loadHindcastRunStatusTabData();

    createColdStartAndHindcastStatusInterval();
    createElapsedTimeInterval();

    if (createAndRunHindcastJobResponse?._data?.submit_date) {
      submitTimeDate.value = new Date(createAndRunHindcastJobResponse?._data?.submit_date);
      calibrationRunForHindcast.value.cycle_date = cycleDate.value;
      if (coldStartDate.value) {
        calibrationRunForHindcast.value.cold_start = {
          cold_start_date: coldStartDate.value,
          cold_start_status: 'Submitted',
          cold_start_submit_date: createAndRunHindcastJobResponse._data.submit_date
        };
      }

      if (isValidDate(submitTimeDate.value)) {
        submitTime.value = formatDateForRunOnString(submitTimeDate.value);
      }
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } else if (createAndRunHindcastJobResponse?._data?.hindcast_run_id) {
    // job was created, but we got a bad response from the server
    hindcastJobId.value = createAndRunHindcastJobResponse._data.hindcast_run_id;
    const getStatusResponse = await getStatus();

    if (getStatusResponse?._data?.status) {
      hindcastJobStatus.value = getStatusResponse._data.status;
      coldStartJobStatus.value = getStatusResponse._data?.cold_start?.status ?? undefined;
      failureMessages.value = getStatusResponse._data?.failure_messages ?? undefined;
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: getStatusResponse?._data?.message ?? `Error when running hindcast job`, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } else {
    runButtonDisabled.value = false;
    cancelButtonDisabled.value  = true;
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: createAndRunHindcastJobResponse?._data?.message ?? `Unable to run hindcast job`, life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

/**
 * Cancel the hindcast run
 */
const cancelHindcastRun = async () => {
  try {
    cancelButtonDisabled.value = true;
    const cancelHindcastJobResponse = await cancelHindcastJob();

    if (cancelHindcastJobResponse?._data?.status) {
      hindcastJobStatus.value = cancelHindcastJobResponse._data.status;
      failureMessages.value = cancelHindcastJobResponse._data.failure_messages ?? undefined;

      if (hindcastJobStatus.value !== 'Cancelled') {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Hindcast status not set to Cancelled after clicking CANCEL', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      await loadHindcastRunStatusTabData();
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Could not get Hindcast status from server', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } catch (error) {
    cancelButtonDisabled.value = false;
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error cancelling Hindcast job', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

/**
 * Go to the Status Run tab
 */
const goToResultsTab = () => {
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[HindcastTabs.tab_hindcastResults] as HTMLElement;
  e.click();
};

/**
 * Go to the Setup Hindcast Tab
 */
const goToSetupHindcastTab = () => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[HindcastTabs.tab_setupHindcast] as HTMLElement;
    e.click();
};

onUnmounted(() => {
  // make sure page clears all log data when the user leaves
  runButtonDisabled.value = true;
  cancelButtonDisabled.value = true;
  logListOptions.value = [];
  hindcastJobStatus.value = undefined;
  coldStartJobStatus.value = undefined;
  resetUserLogRefs();
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#resultsPathname {
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
  padding-top:0px !important; padding-bottom: 0px !important;
}

#selectedLogDisplay {
  max-height: 300px;
}

#MessagesGroupWindow {
  z-index: 100;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}
</style>
