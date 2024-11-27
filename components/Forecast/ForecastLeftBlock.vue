<template>
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <LazyPreviousCalibrationRuns />
      </span>
      <span v-else-if="activeTab == 2">
        <LazyForecastRunsTab />
      </span>
      <span v-else-if="activeTab == 3">
       <LazySetupForecastTab />
      </span>
      <span v-else-if="activeTab == 4">
        <LazyStatusRunTab />
      </span>
      <span v-else-if="activeTab == 5">
        <LazyResultsTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '~/components/Common/Tabs.vue'

import { generalStore } from "@/stores/common/GeneralStore";
const LazyPreviousCalibrationRuns = defineAsyncComponent(() => import('~/components/Forecast/PreviousCalibrationRuns.vue'));
const LazyForecastRunsTab = defineAsyncComponent(() => import('./ForecastRunsTab.vue'));
const LazySetupForecastTab = defineAsyncComponent(() => import('./SetupForecastTab.vue'));
const LazyStatusRunTab = defineAsyncComponent(() => import('./StatusRunTab.vue'));
const LazyResultsTab = defineAsyncComponent(() => import('./ResultsTab.vue'));

const { getForecastTabIndex, setForecastTabIndex } = generalStore();

const activeTab = ref(getForecastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setForecastTabIndex(tabNum);
};
</script>
