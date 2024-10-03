<template> 
  <!-- EvaluationLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <CalibrationRunsTab />
      </span>
      <span v-else-if="activeTab == 2">
        <EvaluateTab />
      </span>
      <span v-else-if="activeTab == 3">
        <SetupValRunTab />
      </span>
      <span v-else-if="activeTab == 4">
        <SelectParamsSetTab />
      </span>
      <span v-else-if="activeTab == 5">
        <ReviewSetupRunTab />
      </span>
      <span v-else="activeTab == 6">
        <StatusTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '~/components/Common/Tabs.vue'

import EvaluateTab from './EvaluateTab.vue'
import SetupValRunTab from './SetupValRunTab.vue'
import SelectParamsSetTab from './SelectParamsSetTab.vue'
import ReviewSetupRunTab from './ReviewSetupRunTab.vue'
import StatusTab from './StatusTab.vue'
import CalibrationRunsTab from './CalibrationRunsTab.vue'

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

