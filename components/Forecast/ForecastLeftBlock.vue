<template>
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <LazyPreviousRunsTab />
      </span>
      <span v-else-if="activeTab == 2">
        <LazyForecastRunsTab />
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
import { generalStore } from "@/stores/common/GeneralStore";
const { getForecastTabIndex, setForecastTabIndex } = generalStore();

import LazyPreviousRunsTab from '~/components/Forecast/PreviousRunsTab.vue';
import LazyForecastRunsTab from '~/components/Forecast/ForecastRunsTab.vue'
import LazySetupForecastRunTab from '~/components/Forecast/SetupForecastRunTab.vue'
import LazyStatusTab from '~/components/Forecast/StatusTab.vue'
import LazyResultsTab from '~/components/Forecast/ResultsTab.vue'

// Default to Tab 1
const activeTab = ref(getForecastTabIndex());
// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setForecastTabIndex(tabNum);
};
</script>
