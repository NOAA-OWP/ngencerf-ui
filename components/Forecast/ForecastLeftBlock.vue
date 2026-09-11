<template>
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" ref="navRef" :call-tab-validator="validateCurrentTab" />
    <div class="shrink-0">
      <span v-if="activeTab === 1">
        <PreviousCalibrationRuns :call-go-to-tab="currentTabNavGo" />
      </span>
      <span v-else-if="activeTab === 2">
        <ForecastRunsTab :call-go-to-tab="currentTabNavGo"/>
      </span>
      <span v-else-if="activeTab === 3">
        <SetupForecastTab ref="tabRef" :call-go-to-tab="currentTabNavGo"/>
      </span>
      <span v-else-if="activeTab === 4">
        <ForecastRunStatusTab ref="tabRef" :call-go-to-tab="currentTabNavGo"/>
      </span>
      <span v-else-if="activeTab === 5">
        <ForecastResultsTab/>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generalStore } from "@/stores/common/GeneralStore";
import { useForecastStore } from "~/stores/forecast/ForecastStore";

const forecastStore = useForecastStore();

import Tabs from '@/components/Common/Tabs.vue'
import PreviousCalibrationRuns from '@/components/Forecast/PreviousCalibrationRuns.vue';
import ForecastRunsTab from './ForecastRunsTab.vue';
import SetupForecastTab from './SetupForecastTab.vue';
import ForecastRunStatusTab from './ForecastRunStatusTab.vue';
import ForecastResultsTab from './ForecastResultsTab.vue';

const { tabRef, navRef } = storeToRefs(generalStore());
const { getForecastTabIndex, setForecastTabIndex, validateCurrentTab, currentTabNavGo, showCurrentTabNavDialog } = generalStore();

const { forecastJobId } = storeToRefs(forecastStore);

// Default to Tab 1, PreviousCalibrationRuns
const activeTab = ref(getForecastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  if (activeTab.value !== tabNum) {
    activeTab.value = tabNum;
    setForecastTabIndex(tabNum);
  } 
};

onUnmounted(() => {
  forecastJobId.value = undefined;
})
</script>
