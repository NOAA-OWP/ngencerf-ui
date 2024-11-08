<template> 
  <!-- EvaluationLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <LazyCalibrationRunsTab />
      </span>
      <span v-else-if="activeTab == 2">
        <LazyEvaluateTab />
      </span>
      <span v-else-if="activeTab == 3">
        <LazySelectAltIterationTab />
      </span>
      <span v-else-if="activeTab == 4">
        <LazySelectParameterSet />
      </span>
      <span v-else-if="activeTab == 5">
        <LazySetupValidationRun />
      </span>
      <span v-else-if="activeTab == 6">
        <LazyEvaluationStatus />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '~/components/Common/Tabs.vue'

import LazyEvaluateTab from './EvaluateTab.vue'
import LazySelectAltIterationTab from './SelectAltIterationTab.vue'
import LazyCalibrationRunsTab from './CalibrationRunsTab.vue'
import LazySelectParameterSet from './SelectParameterSet.vue';
import LazySetupValidationRun from './SetupValidationRun.vue';
import LazyEvaluationStatus from './EvaluationStatus.vue';

// Default to Tab 1, HeadwaterBasinGage
import { generalStore } from "@/stores/common/GeneralStore";

const { getEvaluationTabIndex, setEvaluationTabIndex } = generalStore();

// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getEvaluationTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setEvaluationTabIndex(tabNum);
};
</script>

