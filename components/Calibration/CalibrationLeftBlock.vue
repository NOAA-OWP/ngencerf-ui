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
import HeadwaterBasinGage from '~/components/Calibration/HeadwaterBasinGage.vue';
import Tabs from '~/components/Common/Tabs.vue'
import Formulation from '~/components/Calibration/Formulation.vue'
import TuningControls from '~/components/Calibration/TuningControls.vue'
import OptimizationMetrics from '~/components/Calibration/OptimizationMetrics.vue'
import RunStatus from '~/components/Calibration/RunStatus.vue'
import CalibrationRunsTab from '~/components/Calibration/PreviousCalibrationRuns.vue'

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
