<template>
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <PreviousCalibrationRuns />
      </span>
      <span v-else-if="activeTab == 2">
        <ForecastRunsTab />
      </span>
      <span v-else-if="activeTab == 3">
       <SetupForecastTab />
      </span>
      <span v-else-if="activeTab == 4">
        <StatusRunTab />
      </span>
      <span v-else-if="activeTab == 5">
        <ResultsTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '@/components/Common/Tabs.vue'

import { generalStore } from "@/stores/common/GeneralStore";
import PreviousCalibrationRuns from '@/components/Forecast/PreviousCalibrationRuns.vue';
import ForecastRunsTab from './ForecastRunsTab.vue';
import SetupForecastTab from './SetupForecastTab.vue';
import StatusRunTab from './StatusRunTab.vue';
import ResultsTab from './ResultsTab.vue';

const { getForecastTabIndex, setForecastTabIndex } = generalStore();

const activeTab = ref(getForecastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setForecastTabIndex(tabNum);
};
</script>
