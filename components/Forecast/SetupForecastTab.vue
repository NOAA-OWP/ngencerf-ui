<template>
  <div>
    <h1 class="mt-10 mb-8 text-3xl font-bold inline-block">
      Forecast Cycle Selection
    </h1>
  </div>
  <div>
    <DataTable :value="cycles" sortField="cycle" scrollable v-model:selection="selectedCycle"
      selectionMode="single">
      <Column field="cycle" header="Cycle"></Column>
      <Column field="data_sources" header="Data Sources"></Column>
      <Column field="time_range_ngencerf" header="Time Range ngenCERF"></Column>
    </DataTable>
  </div>
  <div>
    <span v-if="selectedCycle">
      <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
        <button class="font-normal" title="Run Button" aria-label="Run Button" 
          @click="startForecastRun()">
          Run
        </button>
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';

const selectedCycle = ref();
const cycles = ref([
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
  hilightTab(ForecastTabs.tab_setupForecast);

});

const startForecastRun = () => {
  console.log('startForecastRun');
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[ForecastTabs.tab_statusRun] as HTMLElement;
  e.click();
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>