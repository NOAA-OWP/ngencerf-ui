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
  <div id="ForecastRunStatusPage">
    <div class="pl-6 pr-2 pt-2">
      <div class="flex mt-3">
        <div class="w-5/6 relative">
          <div v-if="logList.length > 0" class="inline-block">
            <label for="DisplayOptions" class="pr-2 pt-3">Display </label>
            <div class="inline-block w-2/3">
              <Select id="DisplayOptions" class="p-select" style="width: auto; min-width: 254px;"
                v-model="selectedLogCategory" :options="logList" option-label="display_name" optionValue="name">
              </Select>
            </div>
          </div>
          <div v-else-if="!forecastJobId || !overallColdStartForecastStatus" class="w-full">
            <p class="text-center mt-1" style="font-size: 12px;font-weight: normal;">
              Click Run to submit and run the forecast.
            </p>
          </div>
          
          <div class="grid auto-cols-max grid-cols-3 gap=1 text-sm text-left mt-2">
            <div class="col-span-1">
              <div>
                <span class="font-medium">Calibration Job ID: </span>
                {{ calibrationRunForForecast?.calibration_run_id ?? '-'.repeat(15) }}
              </div>
              <div>
                <span class="font-medium">Forecast Job ID: </span>
                {{ forecastJobId ?? '-'.repeat(15) }}
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
                {{ forecastConfigurationName ?? 'Unknown' }}
              </div>
              <div>
                <span class="font-medium">Cycle Date: </span>
                {{ (cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) + ' UTC' : 'None') }}
              </div>
              <div>
                <span class="font-medium">Cold Start Date: </span>
                {{ (coldStartDate ? formatISOStringOrDateToYYYYMMDDHHMM(coldStartDate) + ' UTC'  : 'None') }}
              </div>
            </div>
            <div class="col-span-1">
              <div>
                <span class="font-medium">Status: </span>
                {{ (forecastJobId && overallColdStartForecastStatus) ? overallColdStartForecastStatus : 'Ready' }}
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
                <span v-if="!forecastJobStatus || (!coldStartJobStatus && forecastJobStatus === 'Ready')">
                  <Button class="ngenButtonDiv ml-6 font-normal px-4" title="Previous Button" aria-label="Previous Button"
                    @click="goToSetupForecastTab()">
                    Previous
                  </Button>
                </span>
                <span v-if="!forecastJobStatus || forecastJobStatus === 'Ready'">
                  <Button class="ngenButtonDiv-green ml-6 font-normal px-4" title="Run Button" aria-label="Run Button"
                    @click="startForecastRun()">
                    Run
                  </Button>
                </span>
                <span v-if="['Submitted','Running'].includes(coldStartJobStatus) || ['Submitted','Running'].includes(forecastJobStatus)">
                  <Button class="ngenButtonDiv-red ml-6 font-normal px-4" title="Cancel Button" @click="cancelForecastRun()"
                    aria-label="Cancel Button">
                    Cancel
                  </Button>
                </span>
                <span v-if="overallColdStartForecastStatus === 'Done'">
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
            </div>
          </div>
            
          <div>
            <div v-if="failureMessages" class="text-left pl-3 text-nowrap" style="font-size:0.9em;">
              <label for="status">Failure Message </label>
              <div class="pl-5" style="width: 100%;">
                <span v-for="message in failureMessages">
                  {{ message }}<br/>
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
    <div v-if="!(forecastJobId && overallColdStartForecastStatus) || ['Saved','Ready'].includes(overallColdStartForecastStatus)" 
      class="col-span-5 p-2 border-t border-[#d9d9d9] flex flex-col items-center" id="LoggingSection">
      <div class="mb-4">
        <div class="inline-flex flex-col items-center">
          <p class="font-semibold mb-2">Global Logging</p>
          <div class="flex gap-6">
            <label v-for="[label, val] in [['Enabled', true], ['Disabled', false]]" :key="label as string"
              class="flex items-center gap-1">
              <input type="radio" :value="val" v-model="forecastJobNgenGlobalLogging" />
              <span>{{ label }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <p class="font-semibold mb-2 text-center">Ngen and Module Log Levels</p>
        <div :class="[
          'overflow-x-auto',
          { 'opacity-50 pointer-events-none': !forecastJobNgenGlobalLogging }
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
                    :disabled="!forecastJobNgenGlobalLogging" />
                </td>
              </tr>
              <tr>
                <td class="pr-4">forcing</td>
                <td v-for="level in ['debug', 'info', 'warning', 'severe', 'fatal']" :key="'forcing' + level"
                  class="px-2">
                  <input type="radio" :name="'loglevel-forcing'" :value="level" v-model="forcingLogLevel"
                    :disabled="!forecastJobNgenGlobalLogging" />
                </td>
              </tr>
              <!-- Per-module logLevels -->
              <tr v-for="(val, module) in logLevels" :key="module">
                <td class="pr-4">{{ module }}</td>
                <td v-for="level in ['debug', 'info', 'warning', 'severe', 'fatal']" :key="level" class="px-2">
                  <input type="radio" :name="`loglevel-${module}`" :value="level" v-model="logLevels[module]"
                    :disabled="!forecastJobNgenGlobalLogging" />
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
import { useForecastStore } from '@/stores/forecast/ForecastStore';
import { useLogStore } from '@/stores/common/LogStore';

import { hilightTab } from '@/composables/TabHilight';
import { isValidDate } from '@/utils/CommonHelpers';
import { calculateElapsedTime, sumAndFormatElapsedTimes } from '@/utils/TimeHelpers';

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();

const showMessagesGroup = ref<Boolean>(false);

const { fetchUserCalibrationRunData } = useUserDataStore();
const { userCalibrationRunData, ngenLogLevel, forcingLogLevel, logLevels } = storeToRefs(useUserDataStore());

const {
  forecastJobId,
  coldStartDate,
  cycleDate,
  forecastConfiguration,
  forecastConfigurationName,
  forecastJobStatus,
  coldStartJobStatus,
  failureMessages,
  elapsedTime,
  submitTimeDate,
  submitTime,
  elapsedTimeIntervalId,
  forecastJobStatusIntervalId,
  resultsPathname,
  calibrationRunForForecast,
  overallColdStartForecastStatus,
  forecastJobNgenGlobalLogging,
} = storeToRefs(useForecastStore());
const {
  loadForecastRunStatusTabData,
  createAndRunForecastJob,
  cancelForecastJob,
  getStatus,
  hardResetForecastRunStatusStore
} = useForecastStore();

const {
  selectedLogCategory,
  logList
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
  hilightTab(ForecastTabs.tab_runStatus);

  clearInterval(forecastJobStatusIntervalId.value);
  clearInterval(elapsedTimeIntervalId.value);
  forecastJobStatusIntervalId.value = undefined;
  elapsedTimeIntervalId.value = undefined;
  
  // get calibration job data if we don't already have it
  if (!userCalibrationRunData.value) {
    await fetchUserCalibrationRunData();
  }
  if (forecastJobId.value) {
    await loadForecastRunStatusTabData();
    if (overallColdStartForecastStatus.value && !['Ready','Submitted'].includes(overallColdStartForecastStatus.value)) {
      await populateLogListOptions();
    }
    createColdStartAndForecastStatusInterval();
    createElapsedTimeInterval();
  }

  // set log levels
  if (calibrationRunForForecast?.value?.logging_config?.modules['ngen']) {
    ngenLogLevel.value = calibrationRunForForecast?.value?.logging_config?.modules['ngen'] as LogLevel;
  } else {
    ngenLogLevel.value = 'info';
  }
  if (calibrationRunForForecast?.value?.logging_config?.modules['forcing']) {
    forcingLogLevel.value = userCalibrationRunData?.value?.logging_config?.modules['forcing'] as LogLevel;
  } else {
    forcingLogLevel.value = 'info';
  }
  
  if (calibrationRunForForecast?.value?.logging_config?.modules) {
    Object.keys(calibrationRunForForecast.value.logging_config.modules).forEach(server_key => {
      // Find matching key in log levels somehow
      Object.keys(logLevels.value).forEach(ui_key => {
        if (ui_key.toLowerCase() == server_key.toLowerCase()) {
          logLevels.value[ui_key] = ref(calibrationRunForForecast.value.logging_config.modules[server_key] as LogLevel);
        }
      });
    });
  }

  if (!cycleDate.value && calibrationRunForForecast?.value?.cycle_date) {
    cycleDate.value = calibrationRunForForecast.value.cycle_date;
  }
  if (!coldStartDate.value && calibrationRunForForecast?.value?.cold_start?.cold_start_date) {
    coldStartDate.value = calibrationRunForForecast.value.cold_start.cold_start_date;
  }

  watch(overallColdStartForecastStatus, (newColdStartForecastStatus, oldColdStartForecastStatus) => {
    if (forecastJobId.value && 
      ( 
        ['Submitted','Running'].includes(coldStartJobStatus.value ?? '') || 
        ['Submitted','Running'].includes(forecastJobStatus.value ?? '') ||
        (oldColdStartForecastStatus && oldColdStartForecastStatus !== "Unknown" && 
        newColdStartForecastStatus && newColdStartForecastStatus !== "Unknown")
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
 * or forecastJobStatus is Submitted or Running
 */
const createElapsedTimeInterval = () => {
  clearInterval(elapsedTimeIntervalId.value);
  elapsedTimeIntervalId.value = setInterval(async () => {
    // continue incrementing elapsedTime every second while coldStartJobStatus is Submitted
    // or forecastJobStatus is Submitted or Running
    if (['Submitted','Running'].includes(coldStartJobStatus.value ?? '') || ['Submitted', 'Running'].includes(forecastJobStatus.value ?? '')) {
      elapsedTime.value = calculateElapsedTime(submitTimeDate.value as Date, new Date());
    } else {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }
  }, 1000) as unknown as number;
};

/**
 * Create forecastJobStatusIntervalId to update coldStartJobStatus and forecastJobStatus every 10 seconds
 * while coldStartJobStatus or forecastJobStatus is Submitted or Running
 */
const createColdStartAndForecastStatusInterval = () => {
  clearInterval(forecastJobStatusIntervalId.value);
  forecastJobStatusIntervalId.value = setInterval(async () => {
    loadForecastRunStatusTabData();
    // if cold start and forecast job are not Submitted or Running, clear the interval
    if (!['Submitted', 'Running'].includes(coldStartJobStatus.value ?? '') && !['Submitted', 'Running'].includes(forecastJobStatus.value ?? ''))
    {
      clearInterval(forecastJobStatusIntervalId.value);
      forecastJobStatusIntervalId.value = undefined;
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }
  }, 10000) as unknown as number;
};

/**
 * Start the forecast run
 */
const startForecastRun = async () => {
  calibrationRunForForecast.value.forecast_status = 'Submitted';
  const createAndRunForecastJobResponse = await createAndRunForecastJob(
    calibrationRunForForecast?.value?.calibration_run_id as number, 
    forecastConfiguration?.value?.name as string,
    cycleDate.value,
    coldStartDate.value,
  );

  if (createAndRunForecastJobResponse.status >= 200 && createAndRunForecastJobResponse.status < 300) {
    forecastJobId.value = createAndRunForecastJobResponse._data.forecast_run_id;
    await loadForecastRunStatusTabData();

    createColdStartAndForecastStatusInterval();
    createElapsedTimeInterval();

    if (createAndRunForecastJobResponse?._data?.submit_date) {
      submitTimeDate.value = new Date(createAndRunForecastJobResponse?._data?.submit_date);

      if (isValidDate(submitTimeDate.value)) {
        submitTime.value = formatDateForRunOnString(submitTimeDate.value);
      }
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } else {
    const getStatusResponse = await getStatus();
    const forecasts: any[] = getStatusResponse?._data?.forecasts;
    const forecast = forecasts?.find((f: any) => f.forecast_run_id === forecastJobId.value);

    if (forecast) {
      forecastJobStatus.value = forecast?.status;
      coldStartJobStatus.value = forecast?.cold_start?.status;
      failureMessages.value = forecast?.failure_messages;
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: `Unable to run forecast job`, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  }
};

/**
 * Cancel the forecast run
 */
const cancelForecastRun = async () => {
  try {
    const cancelForecastJobResponse = await cancelForecastJob();

    if (cancelForecastJobResponse?._data?.status) {
      forecastJobStatus.value = cancelForecastJobResponse._data.status;
      failureMessages.value = cancelForecastJobResponse._data.failure_messages;

      if (forecastJobStatus.value !== 'Cancelled') {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Forecast status not set to Cancelled after clicking CANCEL', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      await loadForecastRunStatusTabData();
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Could not get Forecast status from server', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } catch (error) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error cancelling Forecast job', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

/**
 * Go to the Status Run tab
 */
const goToResultsTab = () => {
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[ForecastTabs.tab_results] as HTMLElement;
  e.click();
};

/**
 * Go to the Setup Forecast Tab
 */
const goToSetupForecastTab = () => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[ForecastTabs.tab_setupForecast] as HTMLElement;
    e.click();
};

onUnmounted(() => {
  // make sure page clears all log data when the user leaves
  hardResetForecastRunStatusStore();
  logList.value = [];
  forecastJobStatus.value = undefined;
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
