<template> 
  <!-- HindcastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab === 1">
        <PreviousCalibrationRuns />
      </span>
      <span v-else-if="activeTab === 2">
        <HindcastRunsTab />
      </span>
      <span v-else-if="activeTab === 3">
        <SetupHindcastTab />
      </span>
      <span v-else-if="activeTab === 4">
        <HindcastRunStatusTab />
      </span>
      <span v-else-if="activeTab === 5">
        <HindcastResultsTab />
      </span>
      <span v-if="activeTab === 6">
        <VerificationRunsTab />
      </span>
      <span v-else-if="activeTab === 7">
        <VerificationRunStatusTab />
      </span>
      <span v-else-if="activeTab === 8">
        <VerificationResultsTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '@/components/Common/Tabs.vue'

import PreviousCalibrationRuns from "./PreviousCalibrationRuns.vue"
import HindcastRunsTab from "./HindcastRunsTab.vue"
import SetupHindcastTab from './SetupHindcastTab.vue';
import HindcastRunStatusTab from './HindcastRunStatusTab.vue';
import HindcastResultsTab from './HindcastResultsTab.vue';
import VerificationRunsTab from "./VerificationRunsTab.vue"
import VerificationRunStatusTab from "./VerificationRunStatusTab.vue"
import VerificationResultsTab from "./VerificationResultsTab.vue"

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
