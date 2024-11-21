<template>
  <div>
    <h1 class="mt-10 mb-8 text-3xl font-bold inline-block">
      Forecast Cycle Selection
    </h1>
  </div>
  <div>
    <DataTable :value="forecastCycles" sortField="cycle" scrollable v-model:selection="forecastCycle"
      selectionMode="single">
      <Column field="cycle" header="Cycle"></Column>
      <Column field="data_sources" header="Data Sources"></Column>
      <Column field="time_range_ngencerf" header="Time Range ngenCERF"></Column>
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
import { useToast } from 'primevue/usetoast';

const isLoading = ref<boolean>(false); // loading indicator
const toast = useToast();
const forecastCycle = ref<object>(); // selected forecast cycle
// fake forecast cycles
const forecastCycles = ref<any[]>([
  { cycle: 1, data_sources: 'Data Sources 1', time_range_ngencerf: 'Time Range ngenCERF 1' },
  { cycle: 2, data_sources: 'Data Sources 2', time_range_ngencerf: 'Time Range ngenCERF 2' },
  { cycle: 3, data_sources: 'Data Sources 3', time_range_ngencerf: 'Time Range ngenCERF 3' },
  { cycle: 4, data_sources: 'Data Sources 4', time_range_ngencerf: 'Time Range ngenCERF 4' },
  { cycle: 5, data_sources: 'Data Sources 5', time_range_ngencerf: 'Time Range ngenCERF 5' },
  { cycle: 6, data_sources: 'Data Sources 6', time_range_ngencerf: 'Time Range ngenCERF 6' },
  { cycle: 7, data_sources: 'Data Sources 7', time_range_ngencerf: 'Time Range ngenCERF 7' },
  { cycle: 8, data_sources: 'Data Sources 8', time_range_ngencerf: 'Time Range ngenCERF 8' },
  { cycle: 9, data_sources: 'Data Sources 9', time_range_ngencerf: 'Time Range ngenCERF 9' },
  { cycle: 10, data_sources: 'Data Sources 10', time_range_ngencerf: 'Time Range ngenCERF 10' },
]);

onMounted(() => {
  toast.removeAllGroups(); // clear all toast messages
  isLoading.value = false; // set isLoading to false

  // scroll to top of the page
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // highlight the tab when selected
  hilightTab(ForecastTabs.tab_setupForecast);

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