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
import LazyPreviousCalibrationRuns from '~/components/Forecast/PreviousCalibrationRuns.vue';
import LazyForecastRunsTab from './ForecastRunsTab.vue';
import LazySetupForecastTab from './SetupForecastTab.vue';
import LazyStatusRunTab from './StatusRunTab.vue';
import LazyResultsTab from './ResultsTab.vue';

const { getForecastTabIndex, setForecastTabIndex } = generalStore();

const activeTab = ref(getForecastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setForecastTabIndex(tabNum);
};
</script>
