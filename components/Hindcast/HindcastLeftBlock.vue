<template> 
  <!-- HindcastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab === 1">
        <HindcastRuns />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '@/components/Common/Tabs.vue'

// Default to Tab 1, Previous Forecast Runs
import HindcastRuns from "./HindcastRuns.vue"

import { generalStore } from "@/stores/common/GeneralStore";
const { getHindcastTabIndex, setHindcastTabIndex } = generalStore();

import { useVerificationStore } from '@/stores/forecast/VerificationStore';
const { verificationJobId } = storeToRefs(useVerificationStore());

// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getHindcastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setHindcastTabIndex(tabNum);
};

onUnmounted(() => {
  verificationJobId.value = undefined;
})

</script>
