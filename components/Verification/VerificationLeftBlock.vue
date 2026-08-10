<template> 
  <!-- VerificationLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab === 1">
        <VerificationPreviousForecastRuns />
      </span>
      <span v-if="activeTab === 2">
        <VerificationRunsTab />
      </span>
      <span v-else-if="activeTab === 3">
        <VerificationRunStatusTab />
      </span>
      <span v-else-if="activeTab === 4">
        <VerificationResultsTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '@/components/Common/Tabs.vue'

// Default to Tab 1, Previous Forecast Runs
import VerificationPreviousForecastRuns from "./PreviousForecastRuns.vue"
import VerificationRunsTab from "./VerificationRunsTab.vue"
import VerificationRunStatusTab from "./VerificationRunStatusTab.vue"
import VerificationResultsTab from "./VerificationResultsTab.vue"

import { generalStore } from "@/stores/common/GeneralStore";
const { getVerificationTabIndex, setVerificationTabIndex } = generalStore();

import { useVerificationStore } from '@/stores/verification/VerificationStore';
const { verificationJobId } = storeToRefs(useVerificationStore());

// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getVerificationTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setVerificationTabIndex(tabNum);
};

onUnmounted(() => {
  verificationJobId.value = undefined;
})

</script>
