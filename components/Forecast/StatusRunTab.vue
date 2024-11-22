<template>
  <div>
    <div class="grid grid-cols-2">
      <div class="col-span-1">
        <table>
          <tbody>
            <tr height="40px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Job ID</div>
              </td>
              <td class="pl-5">{{ jobId ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Submit Time</div>
              </td>
              <td class="pl-5">{{ submitTime ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Elapsed Time</div>
              </td>
              <td class="pl-5">{{ elapsedTime ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">
        <table>
          <tbody>
            <tr height="40px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Status</div>
              </td>
              <td class="pl-5">{{ forecastJobStatus ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Cycle</div>
              </td>
              <td class="pl-5">{{ forecastCycle ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-2">
        <table style="width:100%">
          <tbody>
            <tr height="40px">
              <td class="text-right font-bold" style="width: 140px;">
                <label class="text-right" for="resultsPathname" style="width: 140px;">Results Pathname</label>
              </td>
              <td class="pl-5">
                <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="grid grid-rows-1 ActionButtonsBox" id="HBCbuttons">
      <div class="row-span-1">
        <div class="grid grid-cols-8">
          <span v-if="forecastJobStatus === 'Ready'">
            <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
              <button class="font-normal" title="Run Button" aria-label="Run Button" @click="startForecastRun()">
                Run
              </button>
            </div>
          </span>
          <span v-if="forecastJobStatus === 'Running'">
            <div class="col-span-1 mr-3"><!--c-blue font-normal text-xl underline pt-1-->
              <button class="col-span-1 ngenButtonDiv-red mr h-8" title="Cancel Button" @click="cancelForecastRun()"
                aria-label="Cancel Button">
                Cancel
              </button>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="waitgif" v-if="isLoading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';
import { useForecastStore } from '~/stores/forecast/ForecastStore';
import { useToast } from 'primevue/usetoast';
import { convertTimeZone, calculateElapsedTime } from '~/utils/TimeHelpers';

const isLoading = ref<boolean>(false); // loading indicator
const toast = useToast();

const {
  forecastJobId,
  forecastCycles,
  forecastCycle,
  forecastJobStatus,
  elapsedTime,
  submitTimeDate,
  submitTime,
  elapsedTimeIntervalId,
  forecastJobStatusIntervalId,
} = storeToRefs(useForecastStore()); 

const {
  loadSetupForecastTabData,
  loadForecastTab,
  createAndRunForecastJob,
  getStatus,
} = useForecastStore();

onMounted(() => {
  toast.removeAllGroups(); // clear all toast messages
  isLoading.value = false; // set isLoading to false

  // scroll to top of the page
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // highlight the tab when selected
  hilightTab(ForecastTabs.tab_statusRun);
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
    const createAndRunForecastJobResponse = await createAndRunForecastJob(forecastCycle?.value?.name as string);

    if (createAndRunForecastJobResponse?._data?.status) {
      forecastJobStatus.value = createAndRunForecastJobResponse._data.status;
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get Forecast status from server' });
    }

    if (createAndRunForecastJobResponse?._data?.submit_date) {
      submitTimeDate.value = new Date(createAndRunForecastJobResponse?._data?.submit_date);
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object' });
    }

    if (forecastJobStatus.value !== 'Running') {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Forecast status not set to Running after clicking START' });
    }
    await loadForecastTab();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error running Forecast job' });
  }
};

/**
 * Cancel the forecast run
 */
const cancelForecastRun = () => {
  console.log('cancelForecastRun');
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
  }

  // when forecastJobStatus changes to Done, look for elapsedTime from server
  if (forecastJobStatus.value === 'Done') {
    const getStatusResponse = await getStatus();
    const forecasts: any[] = getStatusResponse?._data.forecasts;
    const forecast = forecasts?.find((f: any) => f.forecast_run_id === forecastJobId.value);

    if (forecast) {
      if (forecast.elapsed_time) {
        elapsedTime.value = forecast.elapsed_time;
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: `Could not find elapsed_time for Forecast job ${forecastJobId.value} in server response`});
      }
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: `Could not find Forecast job ${forecastJobId.value} in server response`});
    }
    goToResultsTab();
  }

  onCleanup(() => {
    console.log('cleanup');
  });
}, { immediate: true });
</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";
</style>