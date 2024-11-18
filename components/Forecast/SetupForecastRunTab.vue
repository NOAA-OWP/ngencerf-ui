<template>
  <div>
    <h1 class="mt-10 mb-8 text-3xl font-bold inline-block">
      Forecast Cycle Selection
    </h1>
  </div>
  <div>
    <DataTable sortField="cycle" scrollable v-model:selection="selectedCycle">
      <Column field="cycle" header="Cycle"></Column>
      <Column field="data_sources" header="Data Sources"></Column>
      <Column field="time_range_ngencerf" header="Time Range ngenCERF"></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';

const selectedCycle = ref();

onMounted(() => {
  hilightTab(ForecastTabs.tab_selectAltIteration);

});

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>