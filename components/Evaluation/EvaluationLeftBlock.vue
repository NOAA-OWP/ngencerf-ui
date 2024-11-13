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
        <LazyRunStatus />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '~/components/Common/Tabs.vue'

import LazyEvaluateTab from './EvaluateTab.vue'
import LazySelectAltIterationTab from './SelectAltIterationTab.vue'
import LazyCalibrationRunsTab from './CalibrationRunsTab.vue'
import LazyRunStatus from './ValidationRunStatus.vue'

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

