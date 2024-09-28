<template>
  <!-- LeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <CalibrationRunsTab />
      </span> <span v-if="activeTab == 2">
        <HeadwaterBasinGage />
      </span>
      <span v-else-if="activeTab == 3">
        <Formulation />
      </span>
      <span v-else-if="activeTab == 4">
        <TuningControls />
      </span>
      <span v-else-if="activeTab == 5">
        <OptimizationMetrics />
      </span>
      <span v-else-if="activeTab == 6">
        <RunStatus />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
// Let HeadwaterBasinGage load right away
import HeadwaterBasinGage from '~/components/Calibration/HeadwaterBasinGage.vue';
// Load the
const Tabs = defineAsyncComponent(() => import('~/components/Common/Tabs.vue'))
const Formulation = defineAsyncComponent(() => import('~/components/Calibration/Formulation.vue'))
const TuningControls = defineAsyncComponent(() => import('~/components/Calibration/TuningControls.vue'))
const OptimizationMetrics = defineAsyncComponent(() => import('~/components/Calibration/OptimizationMetrics.vue'))
const RunStatus = defineAsyncComponent(() => import('~/components/Calibration/RunStatus.vue'))
const CalibrationRunsTab = defineAsyncComponent(() => import('~/components/Calibration/CalibrationRunsTab.vue'))
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
