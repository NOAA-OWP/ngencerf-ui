<template>
  <div id="ForecastRunStatusPage">
    <div class="pl-6 pr-2 pt-2">
      <div class="flex mt-3">
        <div class="w-5/6 relative">
          <div v-if="logList.length > 1" class="inline-block">
            <label for="DisplayOptions" class="pr-2 pt-3">Display </label>
            <div class="inline-block w-2/3">
              <Select id="DisplayOptions" class="p-select" style="width: auto; min-width: 254px;"
                v-model="selectedLogCategory" :options="logList" option-label="display_name" optionValue="name">
              </Select>
            </div>
          </div>
          <div v-else-if="!verificationJobId" class="w-full">
            <p class="text-center mt-1" style="font-size: 12px;font-weight: normal;">
              Click Run to submit and run the verification.
            </p>
          </div>
          
          <div class="grid auto-cols-max grid-cols-3 gap=1 text-sm text-left mt-2">
            <div class="col-span-1">
              <div>
                <span class="font-medium">Forecast Job ID: </span>
                {{ forecastJobId ?? '-'.repeat(15) }}
              </div>
              <div>
                <span class="font-medium">Verification Job ID: </span>
                {{ verificationJobId ?? '-'.repeat(15) }}
              </div>
            </div>
            <div class="col-span-1">
              <div>
                <span class="font-medium">Configuration: </span>
                {{ selectedVerificationJob?.forecast_run?.configuration ?? 'Unknown' }}
              </div>
              <div>
                <span class="font-medium">Cycle Date: </span>
                {{ (selectedVerificationJob?.forecast_run?.cycle_date ? formatISOStringOrDateToYYYYMMDDHHMM(selectedVerificationJob.forecast_run.cycle_date) + ' UTC' : 'None') }}
              </div>
            </div>
            <div class="col-span-1">
              <div>
                <span class="font-medium">Status: </span>
                {{ verificationJobStatus ?? 'Unknown' }}
              </div>
              <div>
                <span class="font-medium">Submit Time: </span>
                {{ submitTime ?? '-'.repeat(15) }}
              </div>
              <div>
                <span class="font-medium">Elapsed Time: </span>
                {{ elapsedTime ?? '-'.repeat(15) }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- DISPLAY PLOT -->
    <div v-if="verificationPlotNames?.some(plot => plot.name === selectedLogCategory) && verificationPlotFileUrl" id="VerificationPlot" class="p-2" aria-label="Plot display area" title="Plot display area">
      <img :src="verificationPlotFileUrl" alt="Selected Plot" />
    </div>
    <!-- DISPLAY LOGS -->
    <div v-show="selectedLogCategory && !verificationPlotNames?.some(plot => plot.name === selectedLogCategory)">
      <LogDisplay/>
    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import LogDisplay from "../Common/LogDisplay.vue";

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { storeToRefs } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from '@/stores/common/UserDataStore';
import { useLogStore } from '@/stores/common/LogStore';

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();
const toast = useToast();

import { useForecastStore } from "@/stores/forecast/ForecastStore";
const forecastStore = useForecastStore();

import { useVerificationStore } from "@/stores/verification/VerificationStore";
const verificationStore = useVerificationStore();

const { calibrationJobId } = storeToRefs(generalStore());
const { userCalibrationRunData } = storeToRefs(useUserDataStore());
const { fetchUserCalibrationRunData } = useUserDataStore();

const { forecastJobId } = storeToRefs(forecastStore);
const { getStatus } = forecastStore;

const { 
  verificationJobId, 
  selectedVerificationJob, 
  submitTime,
  submitTimeDate,
  elapsedTime,
  verificationJobStatus,
  verificationPlotNames
} = storeToRefs(verificationStore);
const { 
  getVerificationStatus,
  getVerificationPlotNames, 
  getVerificationPlot 
} = useVerificationStore();

const {
  selectedLogCategory,
  logList,
  logListOptions
} = storeToRefs(useLogStore());
const {
  populateLogListOptions,
  resetUserLogRefs
} = useLogStore();

const verificationPlotDefault = ref<string>('Select an option');
const verificationPlotFileUrl = ref<string | undefined>();

import { hilightTab } from '@/composables/TabHilight';
onMounted(async() => {
  hilightTab(VerificationTabs.tab_results);

  getVerificationStatus().then((response) => {
    if ( response._data.status ) {
      verificationJobStatus.value = response._data.status;
      selectedVerificationJob.value.forecast_run = response._data?.forecast_run;
      if (response._data?.forecast_run?.forecast_run_id) {
        forecastJobId.value = response._data.forecast_run.forecast_run_id;
      }
      if (response._data?.calibration_run_id) {
        calibrationJobId.value = response._data.calibration_run_id;
        fetchUserCalibrationRunData();
      }
      if (response?._data?.submit_date) {
        submitTimeDate.value = new Date(response?._data?.submit_date);
        if (isValidDate(submitTimeDate.value)) {
          submitTime.value = formatDateForRunOnString(submitTimeDate.value);
        }
      }
      elapsedTime.value = response._data.elapsed_time ? formatElapsedTime(response._data.elapsed_time) : '';
    };
  })

  const response = await getVerificationPlotNames();
  if (response?._data?.plot_names) {
    verificationPlotNames.value = response._data.plot_names.map((plot: any) => ({
      name: plot.name,
      display_name: capitalCaseNonNumeric(plot.display_name.split('.')[0].replaceAll('_',' '))
    }));
  }

  await populateLogListOptions(verificationPlotNames.value);
  selectedLogCategory.value = verificationPlotDefault.value;
})

function capitalCaseNonNumeric(str: string) {
  return str.split(' ').map(word => isNaN(Number(word)) ? word.charAt(0).toUpperCase() + word.slice(1) : '').join(' ').trim();
}

// Handle verification plot changes
watch(selectedLogCategory, async () => {
  if(selectedLogCategory.value && selectedLogCategory.value != verificationPlotDefault.value &&
    verificationPlotNames.value.some(plot => plot.name === selectedLogCategory.value)) {
    const response: any = await getVerificationPlot(selectedLogCategory.value);
    verificationPlotFileUrl.value = response?._data?.plot_url;
  } else {
    verificationPlotFileUrl.value = undefined;
  }
})

onUnmounted(() => {
  verificationPlotNames.value = [];
  verificationPlotFileUrl.value = undefined;
  logList.value = [];
  logListOptions.value = [];
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
</style>