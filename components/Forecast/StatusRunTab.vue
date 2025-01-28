<template>
  <div class="w-full">
    <h1 class="pt-3 mb-8 text-3xl font-bold text-center">
      Forecast
    </h1>
    <p class="text-center" style="font-size: 12px;font-weight: normal;margin-top:-20px;">
      If status is Ready click Run to submit and run the forecast.
    </p>
    <br />
  </div>
  <div>
    <div class="grid grid-cols-2">
      <div class="col-span-1">
        <table>
          <caption style="text-align: left;">Forecast Job Run Time</caption>
          <tbody>
            <tr height="40px">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Calibration Job ID</div>
              </th>
              <td class="pl-5">{{ calibrationRunForForecast?.calibration_run_id ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="40px">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Forecast Job ID</div>
              </th>
              <td class="pl-5">{{ forecastJobId ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Submit Time</div>
              </th>
              <td class="pl-5">{{ submitTime ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Elapsed Time</div>
              </th>
              <td class="pl-5">{{ elapsedTime ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">
        <table>
          <caption>Forecast Job Status</caption>
          <tbody>
            <tr height="40px">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Status</div>
              </th>
              <td class="pl-5">{{ forecastJobStatus ?? 'Ready' }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Cycle</div>
              </td>
              <td class="pl-5">{{ (forecastCycle as ForecastCycle).name ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-2">
        <div style="display:flex; margin-top: 1em;">
          <div  class="text-right font-bold" style="width: 155px;">
            <label class="text-right" for="resultsPathname" style="width: 155px;">Results Pathname</label>
          </div>
          <div class="pl-5" style="width: 100%;">
            <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory"
                  disabled />
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-rows-1 ActionButtonsBox" id="HBCbuttons">
      <div class="row-span-1">
        <div class="grid grid-cols-8">
          <span v-if="!forecastJobStatus || forecastJobStatus === 'Ready'">
            <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
              <button class="font-normal" title="Run Button" aria-label="Run Button" @click="startForecastRun()">
                Run
              </button>
            </div>
          </span>
          <span v-if="forecastJobStatus === 'Running'">
            <div class="col-span-1 mr-3">
              <button class="col-span-1 ngenButtonDiv-red mr h-8" title="Cancel Button" @click="cancelForecastRun()"
                aria-label="Cancel Button">
                Cancel
              </button>
            </div>
          </span>
          <span v-if="forecastJobStatus === 'Done'">
            <div class="col-span-1 mr-3">
              <button class="ngenButtonDiv ml-6 font-normal h-8 px-4 whitespace-nowrap" title="View Results Button" @click="goToResultsTab()"
                aria-label="View Results Button">
                View Results
              </button>
            </div>
          </span>
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

import { hilightTab } from '@/composables/TabHilight';
import { useForecastStore } from '@/stores/forecast/ForecastStore';
import { isValidDate, getForecastStatus } from '@/utils/CommonHelpers';
import { calculateElapsedTime, formatElapsedTime } from '@/utils/TimeHelpers';

const isLoading = ref<boolean>(false); // loading indicator
const toast = useToast();

const {
  forecastJobId,
  forecastCycle,
  forecastJobStatus,
  elapsedTime,
  submitTimeDate,
  submitTime,
  elapsedTimeIntervalId,
  forecastJobStatusIntervalId,
  resultsPathname,
  calibrationRunForForecast,
} = storeToRefs(useForecastStore()); 

const {
  loadForecastStatusRunTabData,
  createAndRunForecastJob,
  cancelForecastJob,
  getStatus,
  getJobDataDirectory,
} = useForecastStore();

onMounted(async () => {
  toast.removeAllGroups(); // clear all toast messages
  isLoading.value = false; // set isLoading to false

  // scroll to top of the page
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // highlight the tab when selected
  hilightTab(ForecastTabs.tab_statusRun);

  // load Status/Run tab data
  await loadForecastStatusRunTabData();
});

/**
 * Create elapsedTimeIntervalId to update elapsedTime every second while Forecast job is Running
 */
const createElapsedTimeInterval = () => {
  elapsedTimeIntervalId.value = setInterval(async () => {
    if (forecastJobStatus.value === 'Running') {
      // Calculate elapsedTime every second while Forecast job is Running
      elapsedTime.value = calculateElapsedTime(submitTimeDate.value as Date, new Date());
    } else {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }
  }, 1000) as unknown as number;
};

/**
 * Create forecastJobStatusIntervalId to update forecastJobStatus every 10 seconds
 */
const createForecastJobStatusInterval = () => {
  forecastJobStatusIntervalId.value = setInterval(async () => {
    const getStatusResponse = await getStatus();
    const forecasts: any[] = getStatusResponse?._data.forecasts;
    const forecast = forecasts?.find((f: any) => f.forecast_run_id === forecastJobId.value);

    if (forecast) {
      if (forecast.status !== 'Running') {
        clearInterval(forecastJobStatusIntervalId.value);
        forecastJobStatusIntervalId.value = undefined;
        forecastJobStatus.value = forecast.status;
      } 
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: `Could not find Forecast job ${forecastJobId.value} in server response`});
    }
  }, 10000) as unknown as number;
};

/**
 * Start the forecast run
 */
const startForecastRun = async () => {
  forecastJobStatus.value = 'Submitted';

  try {
    const createAndRunForecastJobResponse = await createAndRunForecastJob(calibrationRunForForecast?.value?.calibration_run_id as number, forecastCycle?.value?.name as string);

    if (createAndRunForecastJobResponse?._data?.forecast_forcing_download_status && createAndRunForecastJobResponse?._data?.forecast_status) {
      forecastJobStatus.value = getForecastStatus(createAndRunForecastJobResponse._data.forecast_forcing_download_status, createAndRunForecastJobResponse._data.forecast_status);
      forecastJobId.value = createAndRunForecastJobResponse._data.forecast_run_id;
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get Forecast status from server' });
    }

    if (createAndRunForecastJobResponse?._data?.submit_date) {
      submitTimeDate.value = new Date(createAndRunForecastJobResponse?._data?.submit_date);

      if (isValidDate(submitTimeDate.value)) {
      submitTime.value = convertTimeZone(submitTimeDate.value);
    }
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object' });
    }

    const queryGetJobDataDirectoryResponse = await getJobDataDirectory();

    if (queryGetJobDataDirectoryResponse?._data?.data_dir) {
      resultsPathname.value = queryGetJobDataDirectoryResponse._data.data_dir;
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get results pathname from server' });
    }

    if (forecastJobStatus.value !== 'Running') {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Forecast status not set to Running after clicking START' });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error running Forecast job' });
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

      if (forecastJobStatus.value !== 'Cancelled') {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Forecast status not set to Cancelled after clicking CANCEL' });
      }
      await loadForecastStatusRunTabData();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get Forecast status from server' });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error cancelling Forecast job' });
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
 * Watch the forecast job status for changes
 */
watch(forecastJobStatus, async (oldForecastJobStatus, newForecastJobStatus, onCleanup) => {
  // when forecastJobStatus changes to Running, start incrementing elapsedTime every second
  // and start checking forecastJobStatus every 10 seconds until forecastJobStatus changes from Running
  if (forecastJobStatus.value === 'Running') {
    createElapsedTimeInterval();
    createForecastJobStatusInterval();

    if (!resultsPathname.value) {
      const queryGetJobDataDirectoryResponse = await getJobDataDirectory();

      if (queryGetJobDataDirectoryResponse?._data?.data_dir) {
        resultsPathname.value = queryGetJobDataDirectoryResponse._data.data_dir;
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get results pathname from server' });
      }
    }
  }

  // when forecastJobStatus changes to Done, look for elapsedTime from server
  if (forecastJobStatus.value === 'Done') {
    const getStatusResponse = await getStatus();

    if (!resultsPathname.value) {
      const queryGetJobDataDirectoryResponse = await getJobDataDirectory();

      if (queryGetJobDataDirectoryResponse?._data?.data_dir) {
        resultsPathname.value = queryGetJobDataDirectoryResponse._data.data_dir;
      } else {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Could not get results pathname from server' });
      }
    }

    const forecasts: any[] = getStatusResponse?._data.forecasts;
    const forecast = forecasts?.find((f: any) => f.forecast_run_id === forecastJobId.value);

    if (forecast) {
      if (forecast.elapsed_time) {
        elapsedTime.value = formatElapsedTime(forecast.elapsed_time);
      } else {
        toast.add({ severity: 'warn', summary: 'Warning', detail: `Could not find elapsed_time for Forecast job ${forecastJobId.value} in server response`});
      }
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: `Could not find Forecast job ${forecastJobId.value} in server response`});
    }
  }

  onCleanup(() => {
    console.log('cleanup');
  });
}, { immediate: true });
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
}
</style>