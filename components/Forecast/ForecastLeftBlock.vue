<template>
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab === 1">
        <PreviousCalibrationRuns />
      </span>
      <span v-else-if="activeTab === 2">
        <ForecastRunsTab />
      </span>
      <span v-else-if="activeTab === 3">
        <SetupForecastTab />
      </span>
      <span v-else-if="activeTab === 4">
        <ForecastRunStatusTab />
      </span>
      <span v-else-if="activeTab === 5">
        <ForecastResultsTab />
      </span>
      <span v-if="activeTab === 6">
        <VerificationRunsTab />
      </span>
      <span v-else-if="activeTab === 7">
        <VerificationRunStatusTab />
      </span>
      <span v-else-if="activeTab === 8">
        <VerificationResultsTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generalStore } from "@/stores/common/GeneralStore";

import Tabs from '@/components/Common/Tabs.vue'
import PreviousCalibrationRuns from '@/components/Forecast/PreviousCalibrationRuns.vue';
import ForecastRunsTab from './ForecastRunsTab.vue';
import SetupForecastTab from './SetupForecastTab.vue';
import ForecastRunStatusTab from './ForecastRunStatusTab.vue';
import ForecastResultsTab from './ForecastResultsTab.vue';
import VerificationRunsTab from "./VerificationRunsTab.vue"
import VerificationRunStatusTab from "./VerificationRunStatusTab.vue"
import VerificationResultsTab from "./VerificationResultsTab.vue"

const { getForecastTabIndex, setForecastTabIndex } = generalStore();

const activeTab = ref(getForecastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  if (activeTab.value !== tabNum) {
    activeTab.value = tabNum;
    setForecastTabIndex(tabNum);
  } 
};
</script>
