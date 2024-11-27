<template>
  <!-- LeftBlock.vue -->
  <div>
    <CommonTabs @tabNumber="tabChanged" />
    
    <div v-if="activeTab == 1">
      <LazyCalibrationCalibrationRunsTab />
    </div> 
    <div v-else-if="activeTab == 2">
      <LazyCalibrationHeadwaterBasinGage />
    </div>
    <div v-else-if="activeTab == 3">
      <LazyCalibrationFormulation />
    </div>
    <div v-else-if="activeTab == 4">
      <LazyCalibrationTuningControls />
    </div>
    <div v-else-if="activeTab == 5">
      <LazyCalibrationOptimizationMetrics />
    </div>
    <div v-else-if="activeTab == 6">
      <LazyCalibrationRunStatus />
    </div>
    
  </div>

</template>

<script setup lang="ts">

import CommonTabs from '~/components/Common/Tabs.vue'

const LazyCalibrationHeadwaterBasinGage = defineAsyncComponent(() => import('~/components/Calibration/HeadwaterBasinGage.vue'));
const LazyCalibrationFormulation= defineAsyncComponent(() => import('~/components/Calibration/Formulation.vue'));
const LazyCalibrationTuningControls= defineAsyncComponent(() => import('~/components/Calibration/TuningControls.vue'));
const LazyCalibrationOptimizationMetrics= defineAsyncComponent(() => import('~/components/Calibration/OptimizationMetrics.vue'));
const LazyCalibrationRunStatus= defineAsyncComponent(() => import('~/components/Calibration/RunStatus.vue'));
const LazyCalibrationCalibrationRunsTab= defineAsyncComponent(() => import('~/components/Calibration/PreviousCalibrationRuns.vue'));

import { generalStore } from "@/stores/common/GeneralStore";

const { getCalibrationTabIndex, setCalibrationTabIndex } = generalStore();
// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getCalibrationTabIndex());
// Activate new tab
const tabChanged = (tabNum: number) => {
  if (activeTab.value !== tabNum) {
    activeTab.value = tabNum;
    setCalibrationTabIndex(tabNum);
  }
};
</script>
