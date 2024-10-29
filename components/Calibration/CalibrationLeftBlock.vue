<template>
  <!-- LeftBlock.vue -->
  <div class="grid grid-rows-1">
    <CommonTabs @tabNumber="tabChanged" />

    <div class="row-span-1" v-if="activeTab == 1">
      <CalibrationCalibrationRunsTab />
    </div> 
    <div class="row-span-1" v-if="activeTab == 2">
      <CalibrationHeadwaterBasinGage />
    </div>
    <div class="row-span-1" v-else-if="activeTab == 3">
      <CalibrationFormulation />
    </div>
    <div class="row-span-1" v-else-if="activeTab == 4">
      <CalibrationTuningControls />
    </div>
    <div class="row-span-1" v-else-if="activeTab == 5">
      <CalibrationOptimizationMetrics />
    </div>
    <div class="row-span-1" v-else-if="activeTab == 6">
      <CalibrationRunStatus />
    </div>
  </div>

</template>

<script setup lang="ts">
import CalibrationHeadwaterBasinGage from '~/components/Calibration/HeadwaterBasinGage.vue';
import CommonTabs from '~/components/Common/Tabs.vue'
import CalibrationFormulation from '~/components/Calibration/Formulation.vue'
import CalibrationTuningControls from '~/components/Calibration/TuningControls.vue'
import CalibrationOptimizationMetrics from '~/components/Calibration/OptimizationMetrics.vue'
import CalibrationRunStatus from '~/components/Calibration/RunStatus.vue'
import CalibrationCalibrationRunsTab from '~/components/Calibration/PreviousCalibrationRuns.vue'

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
