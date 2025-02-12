<template>
  <div>
    <h1 class="mt-10 mb-8 text-3xl font-bold inline-block">
      Forecast Cycle Selection
    </h1>
    <div style="font-size: 12px;font-weight: normal;margin-top:-20px;">
      <h2>Calibration Job ID: {{ calibrationRunForForecast?.calibration_run_id }}</h2>
    </div>
    <p style="font-size: 12px;font-weight: normal;">Select a cycle then click Next.</p>
    <br />
  </div>
  <div>
    <DataTable :value="forecastCycles" sortField="cycle" scrollable v-model:selection="forecastCycle"
      selectionMode="single" :rowClass="rowClass" :rowStyle="rowStyle">
      <Column field="name" header="Cycle"></Column>
      <Column field="data_sources" header="Data Sources"></Column>
      <Column field="time_range" header="Time Range (ngenCERF)"></Column>
    </DataTable>
  </div>
  <div class="text-normal mt-2 mx-auto text-center">
    Cycles in <span class="text-gray-500">grey</span> are currently unavailable from the GUI. Use the CLI to run these
    cycles.
  </div>
  <div>
    <span v-if="forecastCycle && forecastCycle.is_active">
      <div class="col-span-1 mr-4">
        <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Button" aria-label="Next Button"
          @click="goToStatusRunTab()">
          Next
        </button>
      </div>
    </span>
  </div>
  <div class="waitgif" v-if="isLoading"> <img alt="Please wait..." src="@/assets/styles/img/wait.gif" /> </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

import type { ToastMessageOptions } from "primevue/toast";

import { useForecastStore } from '@/stores/forecast/ForecastStore';
import { generalStore } from '~/stores/common/GeneralStore';

import { hilightTab } from '@/composables/TabHilight';

const gstore = generalStore();
const { isLoading } = storeToRefs(gstore);
const { addToastRecord } = generalStore();

const toast = useToast();

const {
  calibrationRunForForecast,
  forecastJobId,
  forecastCycles,
  forecastCycle,
  forecastJobStatus,
  elapsedTime,
  submitTimeDate,
  submitTime
} = storeToRefs(useForecastStore());

const {
  loadSetupForecastTabData,
  hardResetForecastStore
} = useForecastStore();

/**
 * Disable row if forecast cycle is not active
 */
const rowClass = (data: any) => {
  return [{ 'pointer-events-none': !data.is_active }];
};

/**
 * Add row styling if forecast cycle is not active.
 */
const rowStyle = (data: any) => {
  return {
    color: !data.is_active ? 'grey' : 'black',
    backgroundColor: !data.is_active ? '#f0f0f0' : ''
  };
};


onMounted(async () => {
  toast.removeAllGroups(); // clear all toast messages
  isLoading.value = false; // set isLoading to false

  // scroll to top of the page
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // highlight the tab when selected
  hilightTab(ForecastTabs.tab_setupForecast);

  nextTick(async () => {
    // load tab data if forecastCycles is empty
    if (!forecastCycles.value || forecastCycles.value.length === 0) {
      await loadSetupForecastTabData();
    }
    console.log('forecastCycles', forecastCycles.value);
  });
});

/**
 * On DataTable row selection
 */
const onRowSelect = (e: any) => {
  console.log('onRowSelect', e);
  const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Cycle Selected', detail: `${e.data.name}, is_active: ${e.data.is_active}`, life: 3000 };
  toast.add(tMsg); addToastRecord(tMsg);
};

/**
 * Go to the Status Run tab
 */
const goToStatusRunTab = () => {
  console.log('startForecastRun');
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[ForecastTabs.tab_statusRun] as HTMLElement;
  e.click();
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>