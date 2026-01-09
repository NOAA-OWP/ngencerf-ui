<template>
  <div class="w-full">
    <h1 class="pt-3 mb-8 text-3xl font-bold text-center" aria-label="Forecast Status Run Tab" title="Forecast Status Run Tab">
      Forecast
    </h1>
    <p class="text-center mt-1" style="font-size: 12px;font-weight: normal;">
      If status is Ready click Run to submit and run the forecast.
    </p>
    <br />
  </div>
  <div>

    <div class="grid place-items-center">
      <div class="grid grid-cols-5">
        <div class="col-span-2">
          <table>
            <caption style="text-align: center;font-size:1.1em;font-weight:bold;margin-bottom:3px;"
              aria-label="Forecast Job Run Time Area" title="Forecast Job Run Time Area">Forecast Job Run Time
            </caption>
            <thead>
              <tr height="25px">
                <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
              </tr>
            </thead>
            <tbody>
              <tr height="40px" :aria-label="'Calibration Job ID ' + calibrationRunForForecast?.calibration_run_id"
                :title="'Calibration Job ID ' + calibrationRunForForecast?.calibration_run_id">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Calibration Job ID</div>
                </th>
                <td class="pl-5">{{ calibrationRunForForecast?.calibration_run_id ?? '-'.repeat(15) }}</td>
              </tr>
              <tr height="40px" :aria-label="'Forecast Job ID ' + forecastJobId"
                :title="'Forecast Job ID ' + forecastJobId">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Forecast Job ID</div>
                </th>
                <td class="pl-5">{{ forecastJobId ?? '-'.repeat(15) }}</td>
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
            <caption style="font-size:1.1em;font-weight:bold;margin-bottom:3px;" aria-label="Forecast Job Status area"
              title="Forecast Job Status area">Forecast Job Status</caption>
            <thead>
              <tr height="25px">
                <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
              </tr>
            </thead>
            <tbody>
              <tr height="40px" :aria-label="'Status is ' + overallColdStartForecastStatus"
                :title="'Status is ' + overallColdStartForecastStatus">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Status</div>
                </th>
                <td v-if="forecastJobId && overallColdStartForecastStatus" class="pl-5">{{ overallColdStartForecastStatus }}</td>
                <td v-else class="pl-5">Ready</td>
              </tr>
              <tr height="32px" :aria-label="'Cycle Date is ' + (cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) + 'Z' : 'Unknown')"
                :title="'Cycle Date is ' + (cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) + 'Z' : 'None')">
                <td class="text-right font-bold">
                  <div style="width: 140px;">Cycle Date</div>
                </td>
                <td class="pl-5">{{ (cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) + 'Z' : 'None') }}</td>
              </tr>
              <tr height="32px" :aria-label="'Cold Start Date is ' + (coldStartDate ? formatISOStringOrDateToYYYYMMDDHHMM(coldStartDate) + 'Z' : 'Unknown')"
                :title="'Cold Start Date is ' + (coldStartDate ? formatISOStringOrDateToYYYYMMDDHHMM(coldStartDate) + 'Z' : 'None')">
                <td class="text-right font-bold">
                  <div style="width: 140px;">Cold Start Date</div>
                </td>
                <td class="pl-5">{{ (coldStartDate ? formatISOStringOrDateToYYYYMMDDHHMM(coldStartDate) + 'Z' : 'None') }}</td>
              </tr>
              <tr height="32px" :aria-label="'Configuration is ' + (forecastConfigurationName ?? 'Unknown')"
                :title="'Configuration is ' + (forecastConfigurationName ?? 'Unknown')">
                <td class="text-right font-bold">
                  <div style="width: 140px;">Configuration</div>
                </td>
                <td class="pl-5">{{ forecastConfigurationName ?? 'Unknown' }}</td>
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

        <div class="col-span-5">
          <div style="display:flex; margin-top: 1em;" :aria-label="'Results pathname is ' + resultsPathname"
            :title="'Results pathname is ' + resultsPathname">
            <div class="text-right font-bold" style="width: 155px;">
              <label class="text-right whitespace-nowrap" for="resultsPathname" style="width: 155px;padding-top:1px;">Results Pathname</label>
            </div>
            <div class="pl-5" style="width: 100%;">
              <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
            </div>
          </div>
        </div>

        <div class="col-span-5" v-if="failureMessages">
          <div style="display:flex; margin-top: 1em;"  aria-label="Failure Message" title="Failure Message">
            <div class="text-right font-bold" style="width: 155px;">
              <label class="text-right whitespace-nowrap" for="failureMessage" style="width: 155px;padding-top:1px;">
                Failure Message
              </label>
            </div>
            <div class="pl-5" style="width: 100%;">
              <span v-for="message in failureMessages">
                {{ message }}<br/>
              </span>
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
        <div v-else class="col-span-5">
          <LogDisplay/>
        </div>
      </div>
    </div>

    <div id="HBCbuttonsOuter">
      <div class="grid grid-rows-1 ActionButtonsBox mt-2" id="HBCbuttons">
        <div class="row-span-1">
          <div class="grid grid-cols-4">
            <span v-if="!forecastJobStatus || (!coldStartJobStatus && forecastJobStatus === 'Ready')">
              <div class="col-span-1 mr-4">
                <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Previous Button" aria-label="Previous Button"
                    @click="goToSetupForecastTab()">
                    Previous
                </Button>
              </div>
            </span>
            <span v-if="!forecastJobStatus || forecastJobStatus === 'Ready'">
              <div class="col-span-1 mr-6">
                <Button class=" ngenButtonDiv-green font-normal" title="Run Button" aria-label="Run Button"
                  @click="startForecastRun()">
                  Run
                </Button>
              </div>
            </span>
            <span v-if="['Submitted','Running'].includes(coldStartJobStatus) || ['Submitted','Running'].includes(forecastJobStatus)">
              <div class="col-span-1 mr-3">
                <Button class="col-span-1 ngenButtonDiv-red" title="Cancel Button" @click="cancelForecastRun()"
                  aria-label="Cancel Button">
                  Cancel
                </Button>
              </div>
            </span>
            <span v-if="overallColdStartForecastStatus === 'Done'">
              <div class="col-span-1 mr-3">
                <Button class="ngenButtonDiv ml-6 font-normal px-4 whitespace-nowrap" title="View Results Button"
                  @click="goToResultsTab()" aria-label="View Results Button">
                  View Results
                </Button>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
    

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { ToastMessageOptions } from "primevue/toast";
import LogDisplay from "../Common/LogDisplay.vue";

import { generalStore } from '~/stores/common/GeneralStore';
import { useUserDataStore } from '@/stores/common/UserDataStore';
import { useForecastStore } from '@/stores/forecast/ForecastStore';

import { hilightTab } from '@/composables/TabHilight';
import { isValidDate } from '@/utils/CommonHelpers';
import { calculateElapsedTime, sumAndFormatElapsedTimes } from '@/utils/TimeHelpers';

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();

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
  selectedLogCategory,
  logList
} = storeToRefs(useForecastStore());

const {
  loadForecastRunStatusTabData,
  createAndRunForecastJob,
  cancelForecastJob,
  getStatus,
  populateLogListOptions,
  resetUserLogRefs,
  hardResetForecastRunStatusStore
} = useForecastStore();

onMounted(async () => {
  toast.removeAllGroups(); // clear all toast messages
  isLoading.value = false; // set isLoading to false

  // scroll to top of the page
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // highlight the tab when selected
  hilightTab(ForecastTabs.tab_runStatus);
  
  // get calibration job data if we don't already have it
  if (!userCalibrationRunData.value) {
    await fetchUserCalibrationRunData();
  }
  if (forecastJobId.value) {
    await loadForecastRunStatusTabData();
    await populateLogListOptions();
    createColdStartAndForecastStatusInterval();
    createElapsedTimeInterval();
  }

  clearInterval(forecastJobStatusIntervalId.value);
  clearInterval(elapsedTimeIntervalId.value);
  forecastJobStatusIntervalId.value = undefined;
  elapsedTimeIntervalId.value = undefined;

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
  if (!coldStartDate.value && calibrationRunForForecast?.value?.cold_start_date) {
    coldStartDate.value = calibrationRunForForecast.value.cold_start_date;
  }
});

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

watch(overallColdStartForecastStatus, async (newColdStartForecastStatus, oldColdStartForecastStatus) => {
  if (forecastJobId.value && (newColdStartForecastStatus || oldColdStartForecastStatus) && !isLoading.value) {
    await populateLogListOptions();
  }
}, { immediate: true });

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
#HBCbuttonsOuter {
  width:auto; 
  margin-left: auto; 
  margin-right: auto; 
  max-width: 800px; 
  position: relative;
}

#selectedLogDisplay {
  max-height: 300px;
}
</style>
