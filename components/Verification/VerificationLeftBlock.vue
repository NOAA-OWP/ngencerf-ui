<template> 
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <PreviousRunsTab />
      </span>
      <span v-else-if="activeTab == 2">
        <ResultsTab />
      </span>
      <span v-else-if="activeTab == 3">
        <ResultsTab />
      </span>
      <span v-else-if="activeTab == 4">
        <ResultsTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '~/components/Common/Tabs.vue'

// Default to Tab 1, HeadwaterBasinGage
import { generalStore } from "@/stores/common/GeneralStore";
const ResultsTab = defineAsyncComponent(() => import('./ResultsTab.vue'))
const PreviousRunsTab = defineAsyncComponent(() => import("./PreviousRunsTab.vue"));

const { getVerificationTabIndex, setVerificationTabIndex } = generalStore();

// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getVerificationTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setVerificationTabIndex(tabNum);
};
</script>
