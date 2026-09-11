<template> 
  <!-- HindcastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" ref="navRef" :call-tab-validator="validateCurrentTab" />
    <div class="shrink-0">
      <span v-if="activeTab === 1">
        <PreviousCalibrationRuns :call-go-to-tab="currentTabNavGo"/>
      </span>
      <span v-else-if="activeTab === 2">
        <HindcastRunsTab :call-go-to-tab="currentTabNavGo"/>
      </span>
      <span v-else-if="activeTab === 3">
        <SetupHindcastTab ref="tabRef" :call-go-to-tab="currentTabNavGo"/>
      </span>
      <span v-else-if="activeTab === 4">
        <HindcastRunStatusTab ref="tabRef" :call-go-to-tab="currentTabNavGo"/>
      </span>
      <span v-else-if="activeTab === 5">
        <HindcastResultsTab/>
      </span>
      <span v-if="activeTab === 6">
        <VerificationRunsTab :call-go-to-tab="currentTabNavGo"/>
      </span>
      <span v-else-if="activeTab === 7">
        <VerificationRunStatusTab ref="tabRef" :call-go-to-tab="currentTabNavGo"/>
      </span>
      <span v-else-if="activeTab === 8">
        <VerificationResultsTab/>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generalStore } from "@/stores/common/GeneralStore";
import { useHindcastStore } from "@/stores/hindcast/HindcastStore";
import { useVerificationStore } from "@/stores/hindcast/VerificationStore";

const hindcastStore = useHindcastStore();
const verificationStore = useVerificationStore();

import Tabs from '@/components/Common/Tabs.vue'
import PreviousCalibrationRuns from "./PreviousCalibrationRuns.vue"
import HindcastRunsTab from "./HindcastRunsTab.vue"
import SetupHindcastTab from './SetupHindcastTab.vue';
import HindcastRunStatusTab from './HindcastRunStatusTab.vue';
import HindcastResultsTab from './HindcastResultsTab.vue';
import VerificationRunsTab from "./VerificationRunsTab.vue"
import VerificationRunStatusTab from "./VerificationRunStatusTab.vue"
import VerificationResultsTab from "./VerificationResultsTab.vue"

const { tabRef, navRef } = storeToRefs(generalStore());
const { getHindcastTabIndex, setHindcastTabIndex, validateCurrentTab, currentTabNavGo, showCurrentTabNavDialog } = generalStore();

const { hindcastJobId } = storeToRefs(hindcastStore);
const { verificationJobId } = storeToRefs(verificationStore);

// Default to Tab 1, PreviousCalibrationRuns
const activeTab = ref(getHindcastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  if (activeTab.value !== tabNum) {
    activeTab.value = tabNum;
    setHindcastTabIndex(tabNum);
  } 
};

onUnmounted(() => {
  hindcastJobId.value = undefined;
  verificationJobId.value = undefined;
})
</script>
