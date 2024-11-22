<template>
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <LazyPreviousCalibrationRuns />
      </span>
      <span v-if="activeTab == 2">
        <LazyForecastRuns />
      </span>
      <span v-else-if="activeTab == 3">
        <LazySetupForecastRunTab />
      </span>
      <span v-else-if="activeTab == 4">
        <LazyStatusTab />
      </span>
      <span v-else-if="activeTab == 5">
        <LazyResultsTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '~/components/Common/Tabs.vue'


// Default to Tab 1, HeadwaterBasinGage
import { generalStore } from "@/stores/common/GeneralStore";
import LazyPreviousCalibrationRuns from '~/components/Forecast/PreviousCalibrationRuns.vue'
import LazyForecastRuns from '~/components/Forecast/ForecastRunsTab.vue'
import LazySetupForecastRunTab from './SetupForecastRunTab.vue'
import LazyStatusTab from './StatusTab.vue'
import LazyResultsTab from './ResultsTab.vue'

const { getForecastTabIndex, setForecastTabIndex } = generalStore();

// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getForecastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setForecastTabIndex(tabNum);
};
</script>
