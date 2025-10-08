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
                <td v-if="coldStartJobStatus && forecastJobStatus" class="pl-5">{{ overallColdStartForecastStatus
                  }}</td>
                <td v-else class="pl-5">Ready</td>
              </tr>
              <tr height="32px" :aria-label="'Cycle Date is ' + (cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) + 'Z' : 'Unknown')"
                :title="'Cycle Date is ' + (cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) + 'Z' : 'None')">
                <td class="text-right font-bold">
                  <div style="width: 140px;">Cycle Date</div>
                </td>
                <td class="pl-5">{{ (cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) + 'Z' : 'None') }}</td>
              </tr>
              <tr height="32px" :aria-label="'Cold Start Date is ' + (coldStartDate ? formatISOStringOrDateToYYYYMMDDHHMM(coldStartDate) : 'Unknown')"
                :title="'Cold Start Date is ' + (coldStartDate ? formatISOStringOrDateToYYYYMMDD(coldStartDate) : 'None')">
                <td class="text-right font-bold">
                  <div style="width: 140px;">Cold Start Date</div>
                </td>
                <td class="pl-5">{{ (coldStartDate ? formatISOStringOrDateToYYYYMMDD(coldStartDate) : 'None') }}</td>
              </tr>
              <tr height="32px" :aria-label="'Configuration is ' + ((forecastConfiguration as ForecastConfiguration)?.name ?? 'Unknown')"
                :title="'Configuration is ' + ((forecastConfiguration as ForecastConfiguration)?.name ?? 'Unknown')">
                <td class="text-right font-bold">
                  <div style="width: 140px;">Configuration</div>
                </td>
                <td class="pl-5">{{ ((forecastConfiguration as ForecastConfiguration)?.name ?? 'Unknown') ?? '-'.repeat(15) }}</td>
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
      </div>
    </div>

    <div id="HBCbuttonsOuter">
      <div class="grid grid-rows-1 ActionButtonsBox mt-2" id="HBCbuttons">
        <div class="row-span-1">
          <div class="grid grid-cols-4">
            <span v-if="!forecastJobStatus || forecastJobStatus === 'Ready'">
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
            <span v-if="coldStartJobStatus === 'Running' || forecastJobStatus === 'Running'">
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

import { generalStore } from '~/stores/common/GeneralStore';
import { useForecastStore } from '@/stores/forecast/ForecastStore';

import { hilightTab } from '@/composables/TabHilight';
import { isValidDate } from '@/utils/CommonHelpers';
import { calculateElapsedTime, sumAndFormatElapsedTimes } from '@/utils/TimeHelpers';

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();

const {
  forecastJobId,
  coldStartDate,
  cycleDate,
  forecastConfiguration,
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
  overallColdStartForecastStatus
} = storeToRefs(useForecastStore());

const {
  loadForecastRunStatusTabData,
  createAndRunForecastJob,
  cancelForecastJob,
  getStatus,
  setElapsedTime
} = useForecastStore();

onMounted(async () => {
  toast.removeAllGroups(); // clear all toast messages
  isLoading.value = false; // set isLoading to false

  // scroll to top of the page
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // highlight the tab when selected
  hilightTab(ForecastTabs.tab_runStatus);

  // load Run/Status tab data
  await loadForecastRunStatusTabData();
});

/**
 * Create elapsedTimeIntervalId to increment elapsedTime every second while coldStartJobStatus is Running
 * or forecastJobStatus is Submitted or Running
 */
const createElapsedTimeInterval = () => {
  if (elapsedTimeIntervalId.value) {
    clearInterval(elapsedTimeIntervalId.value);
  }
  elapsedTimeIntervalId.value = setInterval(async () => {
    // continue incrementing elapsedTime every second while coldStartJobStatus is Submitted
    // or forecastJobStatus is Submitted or Running
    if (['Running'].includes(coldStartJobStatus.value ?? '') || ['Submitted', 'Running'].includes(forecastJobStatus.value ?? '')) {
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
  if (forecastJobStatusIntervalId.value) {
    clearInterval(forecastJobStatusIntervalId.value);
  }
  forecastJobStatusIntervalId.value = setInterval(async () => {
    const getStatusResponse = await getStatus();
    const forecasts: any[] = getStatusResponse?._data.forecasts;
    const forecast = forecasts?.find((f: any) => f.forecast_run_id === forecastJobId.value);

    if (forecast) {
      // if cold start and forecast job are not Submitted or Running, clear the interval
      if (
        !['Submitted', 'Running'].includes(forecast?.cold_start?.status ?? '') &&
        !['Submitted', 'Running'].includes(forecast?.status ?? '')
      ) {
        clearInterval(forecastJobStatusIntervalId.value);
        forecastJobStatusIntervalId.value = undefined;
      }
      // update coldStartJobStatus and forecastJobStatus
      forecastJobStatus.value = forecast?.status;
      coldStartJobStatus.value = forecast?.cold_start?.status;
      failureMessages.value = getStatusResponse?._data?.failure_messages;

      // set submitTime if not already set
      if (!submitTime.value && forecast?.submit_date) {
        submitTimeDate.value = new Date(forecast?.submit_date as string);

        if (isValidDate(submitTimeDate.value)) {
          submitTime.value = formatDateForRunOnString(submitTimeDate.value);
        }
      }
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: `Could not find Forecast job ${forecastJobId.value} in server response`, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  }, 10000) as unknown as number;
};

/**
 * Start the forecast run
 */
const startForecastRun = async () => {
  const createAndRunForecastJobResponse = await createAndRunForecastJob(
    calibrationRunForForecast?.value?.calibration_run_id as number, 
    forecastConfiguration?.value?.name as string,
    cycleDate.value,
    coldStartDate.value
  );

  if (createAndRunForecastJobResponse.status >= 200 && createAndRunForecastJobResponse.status < 300) {
    forecastJobStatus.value = createAndRunForecastJobResponse._data.forecast_status;
    coldStartJobStatus.value = createAndRunForecastJobResponse._data.forecast_cold_start_status;
    failureMessages.value = createAndRunForecastJobResponse._data.failure_messages;
    forecastJobId.value = createAndRunForecastJobResponse._data.forecast_run_id;

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
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: `Could not find Forecast job ${forecastJobId.value} in server response`, life: ToastTimeout.timeoutError };
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
 * Watch overallColdStartForecastStatus for changes
 * overallColdStartForecastStatus is a computed value based on coldStartJobStatus and forecastJobStatus
 * so we're essentially watching both coldStartJobStatus and forecastJobStatus for changes
 */
watch(overallColdStartForecastStatus, async (oldForecastJobStatus, newForecastJobStatus) => {
  // when overallColdStartForecastStatus first changes to Submitted or Running, start incrementing elapsedTime every second until
  // overallColdStartForecastStatus changes to Done, Cancelled, Failed, or Server error
  if (['Submitted', 'Running'].includes(coldStartJobStatus.value) || ['Submitted', 'Running'].includes(forecastJobStatus.value)) {
    // if not already created, create elapsedTimeIntervalId to update elapsedTime every second while coldStartJobStatus is Running
    // or forecastJobStatus is Submitted or Running
    if (coldStartJobStatus.value === 'Running' && !elapsedTimeIntervalId.value && submitTimeDate.value) {
      createElapsedTimeInterval();
    }
    // if not already created, create forecastJobStatusIntervalId to update coldStartJobStatus and forecastJobStatus every 10 seconds
    // while coldStartJobStatus or forecastJobStatus is Submitted or Running
    if (!forecastJobStatusIntervalId.value) {
      createColdStartAndForecastStatusInterval();
    }
  }

  // if interval incrementing elapsedTime every second is no longer running
  // and when overallColdStartForecastStatus changes to Done, look for Cold Start and Forecast 
  // elapsedTimes from server and set elapsedTime to the sum of those durations
  if (!forecastJobStatusIntervalId.value && coldStartJobStatus.value === 'Done' || forecastJobStatus.value === 'Done') {
    // if forecastJobStatusIntervalId is not set, that means elapsedTime is no longer incrementing every second
    // so we need to get elapsed_time from the server
    const getStatusResponse = await getStatus();
    const forecasts: any[] = getStatusResponse?._data.forecasts;
    const forecast = forecasts?.find((f: any) => f.forecast_run_id === forecastJobId.value);

    if (forecast) {
      // set elapsedTime
      setElapsedTime(forecast);

      if (!elapsedTime.value) {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Elapsed time not set from server', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: `Could not find Forecast job ${forecastJobId.value} in server response`, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  }
}, 
{ immediate: true });

/**
 * Go to the Setup Forecast Tab
 */
const goToSetupForecastTab = () => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[ForecastTabs.tab_setupForecast] as HTMLElement;
    e.click();
};

onBeforeUnmount(() => {
  clearInterval(forecastJobStatusIntervalId.value);
  clearInterval(elapsedTimeIntervalId.value);
  forecastJobStatusIntervalId.value = undefined;
  elapsedTimeIntervalId.value = undefined;
  forecastJobStatus.value = "";
  failureMessages.value = undefined;
  submitTime.value = "";
  elapsedTime.value = "";
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
</style>
