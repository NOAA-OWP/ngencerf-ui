<template>
  <!-- LeftBlock.vue -->
  <div class="grid grid-rows-1">
    <CommonTabs @tabNumber="tabChanged" />
    
    <div class="row-span-1" v-if="activeTab == 1">
      <LazyCalibrationCalibrationRunsTab />
    </div> 
    <div class="row-span-1" v-else-if="activeTab == 2">
      <LazyCalibrationHeadwaterBasinGage />
    </div>
    <div class="row-span-1" v-else-if="activeTab == 3">
      <LazyCalibrationFormulation />
    </div>
    <div class="row-span-1" v-else-if="activeTab == 4">
      <LazyCalibrationTuningControls />
    </div>
    <div class="row-span-1" v-else-if="activeTab == 5">
      <LazyCalibrationOptimizationMetrics />
    </div>
    <div class="row-span-1" v-else-if="activeTab == 6">
      <LazyCalibrationRunStatus />
    </div>
    
  </div>

</template>

<script setup lang="ts">
import LazyCalibrationHeadwaterBasinGage from '~/components/Calibration/HeadwaterBasinGage.vue';
import CommonTabs from '~/components/Common/Tabs.vue'
import LazyCalibrationFormulation from '~/components/Calibration/Formulation.vue'
import LazyCalibrationTuningControls from '~/components/Calibration/TuningControls.vue'
import LazyCalibrationOptimizationMetrics from '~/components/Calibration/OptimizationMetrics.vue'
import LazyCalibrationRunStatus from '~/components/Calibration/RunStatus.vue'
import LazyCalibrationCalibrationRunsTab from '~/components/Calibration/PreviousCalibrationRuns.vue'

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
