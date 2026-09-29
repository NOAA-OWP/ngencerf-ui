<template> 
  <!-- EvaluationLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" ref="navRef" :call-tab-validator="validateCurrentTab"/>
    <div class="shrink-0">
      <KeepAlive>
        <span v-if="activeTab === 1">
          <EvaluationRunsTab :call-go-to-tab="currentTabNavGo"/>
        </span>
        <span v-else-if="activeTab === 2">
          <EvaluateTab :call-go-to-tab="currentTabNavGo"/>
        </span>
        <span v-else-if="activeTab === 3">
          <ComparePermutationsTab :call-go-to-tab="currentTabNavGo"/>
        </span>
        <span v-else-if="activeTab === 4">
          <SelectAltIterationTab :call-go-to-tab="currentTabNavGo"/>
        </span>
        <span v-else-if="activeTab === 5">
          <RunStatusTab ref="tabRef" :call-go-to-tab="currentTabNavGo"/>
        </span>
      </KeepAlive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generalStore } from "@/stores/common/GeneralStore";

import Tabs from '@/components/Common/Tabs.vue'
import EvaluationRunsTab from './EvaluationRunsTab.vue';

const evaluateTabLoader = () => import('./EvaluateTab.vue');
const comparePermutationsTabLoader = () => import('./ComparePermutationsTab.vue');
const selectAltIterationTabLoader = () => import('./SelectAltIterationTab.vue');
const runStatusTabLoader = () => import('./EvaluationRunStatus.vue');

const { asyncTabComponent } = useAsyncTabComponent();
const EvaluateTab = asyncTabComponent(evaluateTabLoader);
const ComparePermutationsTab = asyncTabComponent(comparePermutationsTabLoader);
const SelectAltIterationTab = asyncTabComponent(selectAltIterationTabLoader);
const RunStatusTab = asyncTabComponent(runStatusTabLoader);

const { tabRef, navRef } = storeToRefs(generalStore());
const { getEvaluationTabIndex, setEvaluationTabIndex, validateCurrentTab, currentTabNavGo, showCurrentTabNavDialog } = generalStore();

// Default to Tab 1, EvaluationRunsTab
const activeTab = ref(getEvaluationTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  if (activeTab.value !== tabNum) {
    activeTab.value = tabNum;
    setEvaluationTabIndex(tabNum);
  } 
};

onMounted(() => {
  evaluateTabLoader();
  comparePermutationsTabLoader();
  selectAltIterationTabLoader();
  runStatusTabLoader();
});
</script>

