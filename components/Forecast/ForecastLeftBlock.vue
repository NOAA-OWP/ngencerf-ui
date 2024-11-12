<template>
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <LazyCalibrationsRunsTab />
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
import LazyForecastRunsTab from './ForecastRunsTab.vue'
import LazyCalibrationsRunsTab from './CalibrationsRunsTab.vue';
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
