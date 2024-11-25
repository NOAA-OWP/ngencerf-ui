<template>
  <div>
    <h1 class="mt-10 mb-8 text-3xl font-bold inline-block">
      Forecast Cycle Selection
    </h1>
  </div>
  <div>
    <DataTable :value="forecastCycles" sortField="cycle" scrollable v-model:selection="forecastCycle"
      selectionMode="single">
      <Column field="name" header="Cycle"></Column>
      <Column field="data_sources" header="Data Sources"></Column>
      <Column field="time_range" header="Time Range (NgenCERF)"></Column>
    </DataTable>
  </div>
  <div class="text-xs mt-2 mx-auto text-center">
    Cycles in <span class="text-gray-500">grey</span> are currently unavailable from the GUI. Use the CLI to run these
    cycles.
  </div>
  <div>
    <span v-if="forecastCycle">
      <div class="col-span-1 mr-4">
        <button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Button" aria-label="Next Button"
          @click="goToStatusRunTab()">
          Next
        </button>
      </div>
    </span>
  </div>
  <div class="waitgif" v-if="isLoading">
    <img src="@/assets/styles/img/wait.gif" />
  </div>
</template>

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';
import { useForecastStore } from '~/stores/forecast/ForecastStore';
import { useToast } from 'primevue/usetoast';

const isLoading = ref<boolean>(false); // loading indicator
const toast = useToast();

const {
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
    console.log('forecastCycle[0]["Data Sources"]:', forecastCycles?.value[0]["Data Sources"]);
  });
});

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
@import "@/assets/styles/styles.scss";
</style>