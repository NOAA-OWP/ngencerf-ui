<template>
    <div>
        <div style="font-size: 12px;font-weight: normal;margin-top:15px;"
            aria-label="'Calibration Job ID is ' + calibrationRunForForecast?.calibration_run_id"
            title="'Calibration Job ID is  ' + calibrationRunForForecast?.calibration_run_id">
            <h2>Gage ID: {{ calibrationRunForForecast?.gage_id }}</h2>
            <h2 style="font-size:1.5em; padding-top:5px;">Domain: 
                {{ calibrationRunForForecast?.domain_name }}</h2>
            <h2 style="font-size:1.5em; padding-top:5px;">Calibration Job ID: {{
                calibrationRunForForecast?.calibration_run_id }}</h2>
        </div>
        <h1 class="mb-6 text-3xl font-bold text-center relative">
            Forecast Configuration Selection
        </h1>
        <p class="prompt-txt mt-2 text-center">
            Select a configuration, choose Cycle Date/Hour and optional Cold Start Date, then click Next.
        </p>
        <br />
    </div>
    <div>
        <DataTable :value="forecastConfigurations" sortField="fcst_win" scrollable v-model:selection="forecastConfiguration"
            selectionMode="single" :rowClass="rowClass" :rowStyle="rowStyle">
            <Column field="name" header="Configuration">
                <template #body="slotProps">
                    <div :aria-label="'Configuration is ' + slotProps.data.name" :title="'Configuration is ' + slotProps.data.name">{{
                        slotProps.data.name }}</div>
                </template>
            </Column>
            <Column field="data_sources" header="Data Sources">
                <template #body="slotProps">
                    <div :aria-label="'Data Sources: ' + slotProps.data.data_sources"
                        :title="'Data Sources: ' + slotProps.data.data_sources">{{
                            slotProps.data.data_sources }}</div>
                </template>
            </Column>
            <Column field="time_range" header="Time Range (ngenCERF)">
                <template #body="slotProps">
                    <div :aria-label="'Time Range is ' + slotProps.data.name"
                        :title="'Time Range is ' + slotProps.data.time_range">{{
                            slotProps.data.time_range }}</div>
                </template>
            </Column>
        </DataTable>
    </div>
    <div v-if="forecastJobStatus && forecastJobStatus !== 'Ready'" class="text-normal mt-2 mx-auto text-center">
      This forecast has already been run. Click "Next" to see status.
    </div>
    <div v-else-if="forecastConfiguration" class="grid place-items-center" style="margin-top:15px;">
      <div class="font-bold">Availability for {{ forecastConfiguration.name }}:</div>
      <ul>
        <li v-if="forecastConfiguration.availability_lag > 0">
          Most recent forecast available: {{ forecastConfiguration.availability_lag }} 
          hour{{ forecastConfiguration.availability_lag > 1 ? 's' : '' }} before current time
        </li>
        <li>
          Cycle hours available: {{ cycleHourList.length < 24 ? cycleHourList.join(', ') : '0-23' }}
        </li>
        <li>
          Forecast window: {{ forecastConfiguration.fcst_win }} hour{{ forecastConfiguration.fcst_win > 1 ? 's' : '' }}
        </li>
      </ul>
      <div class="grid grid-cols-4">
        <div class="text-nowrap text-right font-bold" style="padding-top:8px;">
          Cycle Date
        </div>
        <div class="text-nowrap">
          <VueDatePicker v-model="cycleDate" class="dp__theme_dark" text-input format="yyyy-MM-dd"
            @update:model-value="convertCycleDateStringToDateTimeObject" :enable-time-picker="false"
            :min-date="minCycleDate ? minCycleDate.toISO() : ''" 
            :max-date="maxCycleDate ? maxCycleDate.toISO() : ''" 
            :teleport="true" utc='preserve' 
            :disabled="!forecastConfiguration"/>
        </div>
        <div class="text-nowrap text-right font-bold" style="padding-top:8px;">
          Cold Start Date
        </div>
        <div class="text-nowrap">
          <VueDatePicker v-model="coldStartDate" class="dp__theme_dark" text-input format="yyyy-MM-dd"
            @update:model-value="convertColdStartDateStringToDateTimeObject" :enable-time-picker="false"
            :min-date="minCycleDate ? minCycleDate.toISO() : ''" 
            :max-date="maxCycleDate ? maxCycleDate.toISO() : ''" 
            :teleport="true" utc='preserve' 
            :disabled="!forecastConfiguration"/>
        </div>
        <div class="text-nowrap text-right font-bold" style="padding-top:8px;">
          Hour
        </div>
        <div class="text-nowrap">
          <Select id="cycleHour" v-model="cycleHour" :options="cycleHourList" default="12" 
            aria-label="Cycle Hour Select" title="Cycle Hour Select"
            :disabled="!forecastConfiguration">
          </Select>
        </div>
        <div class="text-nowrap" style="padding-top:8px;">
          Z
        </div>
        <div>
          <span v-if="cycleDate && (cycleHour || cycleHour === 0) && forecastConfiguration && forecastConfiguration.is_active">
            <div class="col-span-1 mr-4">
              <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Button" aria-label="Next Button"
                @click="goToRunStatusTab()">
                Next
              </Button>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="waitgif" v-if="isLoading"> <img alt="Please wait..." src="@/assets/styles/img/wait.gif" /> </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import VueDatePicker from "@vuepic/vue-datepicker";
import { DateTime } from "luxon";

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { useForecastStore } from '@/stores/forecast/ForecastStore';
import { generalStore } from '~/stores/common/GeneralStore';

import { hilightTab } from '@/composables/TabHilight';

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();

const {
  calibrationRunForForecast,
  coldStartDate,
  cycleDate,
  forecastConfigurations,
  forecastConfiguration,
  forecastJobStatus,
  coldStartJobStatus,
} = storeToRefs(useForecastStore());

const { loadSetupForecastTabData } = useForecastStore();

const minCycleDate = ref<any>();
const maxCycleDate = ref<any>();
const cycleHour = ref<number>();
const cycleHourList = ref<number[]>([]);

/**
 * Disable row if forecast configuration is not active
 */
const rowClass = (data: any) => {
    return [{ 'pointer-events-none': (!data.is_active || (forecastJobStatus.value && forecastJobStatus.value !== 'Ready'))}];
};

/**
 * Add row styling if forecast configuration is not active.
 */
const rowStyle = (data: any) => {
    return {
        color: (!data.is_active || (forecastJobStatus.value && forecastJobStatus.value !== 'Ready')) ? 'grey' : 'black',
        backgroundColor: !data.is_active ? '#f0f0f0' : ''
    };
};


onMounted(async () => {
    toast.removeAllGroups(); // clear all toast messages
    isLoading.value = false; // set isLoading to false
    
    if (!cycleHour.value && cycleDate.value) {
      try {
        cycleHour.value = cycleDate.value.getHours();
      } catch {
        cycleHour.value = cycleDate.value.hour;
      }
    }

    minCycleDate.value = DateTime.utc(2022, 1, 1, 12, 0, 0);
    maxCycleDate.value = DateTime.utc();

    if (!cycleDate.value) {
      cycleDate.value = maxCycleDate.value;
    }

    // scroll to top of the page
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); }

    // highlight the tab when selected
    hilightTab(ForecastTabs.tab_setupForecast);

    nextTick(async () => {
        // load tab data to populate forecastConfigurations
        await loadSetupForecastTabData();
        if (forecastConfiguration.value) {
            getCycleHourList();
        }
    });
});

// Convert coldStartDate and cycleDate strings to Date objects
// VueDatePicker sets these to strings, so we need to convert them to Date objects
const convertCycleDateStringToDateTimeObject = (value: string) => {
  if (cycleDate.value) {
      cycleDate.value = DateTime.fromISO(value, { zone: 'utc' });
  }
}
const convertColdStartDateStringToDateTimeObject = (value: string) => {
  if (coldStartDate.value) {
      coldStartDate.value = DateTime.fromISO(value, { zone: 'utc' });
  }
}

watch(forecastConfiguration, async () => {
  cycleHourList.value = [];
  getCycleHourList();
})

const getCycleHourList = () => {
  if (forecastConfiguration?.value) {
    let h = forecastConfiguration?.value?.cycle_start;
    while (h <= forecastConfiguration?.value?.cycle_end) {
      cycleHourList.value.push(h);
      h += forecastConfiguration?.value?.cycle_freq;
    }
    nextTick(async () => {
      document.getElementById('MainLeftDataArea').parentNode.scrollTop = document.getElementById('MainLeftDataArea').parentNode.scrollHeight;
    });
  }
}

/**
 * On DataTable row selection
 */
const onRowSelect = (e: any) => {
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Configuration Selected', detail: `${e.data.name}, is_active: ${e.data.is_active}`, life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
};

/**
 * Go to the Status Run tab
 */
const goToRunStatusTab = () => {
    if (!forecastConfiguration.value) {
      const alert = window.alert('You must select a configuration and then set the Cycle Date/Hour.');
      return false;
    } else if (!cycleDate.value || (!cycleHour.value && cycleHour.value !== 0)) {
      const alert = window.alert('Invalid Cycle Date chosen.\n\nMake sure to choose a date within the available date range, and an hour that is available for your chosen configuration.');
      return false;
    } else {
      cycleDate.value = cycleDate.value.set({ hour: cycleHour.value, minute: 0, second: 0 });
      if (coldStartDate.value && coldStartDate.value >= cycleDate.value) {
        const alert = window.alert('Cold Start Date must be before the Cycle Date.');
        return false;
      }
      // validate the day/hour to make sure it is within the availability window
      let latestForecastDate = maxCycleDate.value.minus({ hours: forecastConfiguration.value.availability_lag})
      if (latestForecastDate < cycleDate.value) {
          const alert = window.alert('Forecast data might not yet be available for your chosen cycle date.');
      }
      const allTabs = document.getElementsByClassName("tabs");
      const e = allTabs[ForecastTabs.tab_runStatus] as HTMLElement;
      e.click();
    }
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
