<template>
  <!-- CalibrationLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" ref="navRef" :call-tab-validator="validateCurrentTab" 
      :call-tab-restore="restoreCurrentTab"/>
    
    <KeepAlive>
      <div v-if="activeTab === 1">
        <CalibrationCalibrationRunsTab :call-go-to-tab="currentTabNavGo"/>
      </div> 
      <div v-else-if="activeTab === 2">
        <CalibrationHeadwaterBasinGage ref="tabRef" :call-go-to-tab="currentTabNavGo" :call-nav-dialog="showCurrentTabNavDialog"/>
      </div>
      <div v-else-if="activeTab === 3">
        <CalibrationFormulation ref="tabRef" :call-go-to-tab="currentTabNavGo" :call-nav-dialog="showCurrentTabNavDialog"/>
      </div>
      <div v-else-if="activeTab === 4">
        <CalibrationTuningControls ref="tabRef" :call-go-to-tab="currentTabNavGo" :call-nav-dialog="showCurrentTabNavDialog"/>
      </div>
      <div v-else-if="activeTab === 5">
        <CalibrationOptimizationMetrics ref="tabRef" :call-go-to-tab="currentTabNavGo" :call-nav-dialog="showCurrentTabNavDialog"/>
      </div>
      <div v-else-if="activeTab === 6">
        <CalibrationRunStatus/>
      </div>
    </KeepAlive>
  </div>

</template>

<script setup lang="ts">

import { generalStore } from "@/stores/common/GeneralStore";

import Tabs from '@/components/Common/Tabs.vue'
import CalibrationCalibrationRunsTab from '@/components/Calibration/PreviousCalibrationRuns.vue';

const headwaterBasinGageLoader = () => import('./HeadwaterBasinGage.vue');
const formulationLoader = () => import('./Formulation.vue');
const tuningControlsLoader = () => import('./TuningControls.vue');
const optimizationMetricsLoader = () => import('./OptimizationMetrics.vue');
const runStatusLoader = () => import('./RunStatus.vue');

const { asyncTabComponent } = useAsyncTabComponent();
const CalibrationHeadwaterBasinGage = asyncTabComponent(headwaterBasinGageLoader);
const CalibrationFormulation = asyncTabComponent(formulationLoader);
const CalibrationTuningControls = asyncTabComponent(tuningControlsLoader);
const CalibrationOptimizationMetrics = asyncTabComponent(optimizationMetricsLoader);
const CalibrationRunStatus = asyncTabComponent(runStatusLoader);

const { tabRef, navRef } = storeToRefs(generalStore());
const { getCalibrationTabIndex, setCalibrationTabIndex, validateCurrentTab, restoreCurrentTab, currentTabNavGo, showCurrentTabNavDialog} = generalStore();

// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getCalibrationTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  if (activeTab.value !== tabNum) {
    activeTab.value = tabNum;
    setCalibrationTabIndex(tabNum);
  }
};

onMounted(() => {
  // Start downloading the other tab chunks in the background.
  headwaterBasinGageLoader();
  formulationLoader();
  tuningControlsLoader();
  optimizationMetricsLoader();
  runStatusLoader();
});
</script>
