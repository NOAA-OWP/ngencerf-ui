<template> 
  <!-- EvaluationLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab === 1">
        <CalibrationRunsTab />
      </span>
      <span v-else-if="activeTab === 2">
        <EvaluateTab />
      </span>
      <span v-else-if="activeTab === 3">
        <SelectAltIterationTab />
      </span>
      <span v-else-if="activeTab === 4">
        <RunStatus />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generalStore } from "@/stores/common/GeneralStore";

import Tabs from '@/components/Common/Tabs.vue'
import EvaluateTab from './EvaluateTab.vue';
import SelectAltIterationTab from './SelectAltIterationTab.vue';
import CalibrationRunsTab from './CalibrationRunsTab.vue';
import RunStatus from './EvaluationRunStatus.vue';

const { getEvaluationTabIndex, setEvaluationTabIndex } = generalStore();

const activeTab = ref(getEvaluationTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setEvaluationTabIndex(tabNum);
};
</script>

