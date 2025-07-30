<template>
  <!-- LeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" :call-tab-validator="validateChildTab" :call-tab-restore="restoreChildTab"/>
    
    <div v-if="activeTab === 1">
      <CalibrationCalibrationRunsTab/>
    </div> 
    <div v-else-if="activeTab === 2">
      <CalibrationHeadwaterBasinGage ref="tabRef"/>
    </div>
    <div v-else-if="activeTab === 3">
      <CalibrationFormulation ref="tabRef"/>
    </div>
    <div v-else-if="activeTab === 4">
      <CalibrationTuningControls ref="tabRef" />
    </div>
    <div v-else-if="activeTab === 5">
      <CalibrationOptimizationMetrics ref="tabRef" />
    </div>
    <div v-else-if="activeTab === 6">
      <CalibrationRunStatus/>
    </div>
    
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { generalStore } from "@/stores/common/GeneralStore";

import Tabs from '@/components/Common/Tabs.vue'
import CalibrationHeadwaterBasinGage from '@/components/Calibration/HeadwaterBasinGage.vue';
import CalibrationFormulation from'@/components/Calibration/Formulation.vue';
import CalibrationTuningControls from'@/components/Calibration/TuningControls.vue';
import CalibrationOptimizationMetrics from'@/components/Calibration/OptimizationMetrics.vue';
import CalibrationRunStatus from'@/components/Calibration/RunStatus.vue';
import CalibrationCalibrationRunsTab from'@/components/Calibration/PreviousCalibrationRuns.vue';

import { useDialog } from "primevue/usedialog";
import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";

const dialog = useDialog();
const navDialogOpened = ref<boolean>(false);

const { getCalibrationTabIndex, setCalibrationTabIndex } = generalStore();
// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getCalibrationTabIndex());
// Activate new tab
const tabChanged = (tabNum: number) => {
  if (activeTab.value !== tabNum) {
    activeTab.value = tabNum;
    setCalibrationTabIndex(tabNum);
  }
};

const tabRef = ref(null);

function validateChildTab() {
  if (tabRef.value) {
    return tabRef.value.validateTab();
  }
  return false;
}

function restoreChildTab() {
  if (tabRef.value) {
    return tabRef.value.restoreTab();
  }
  return false;
}

onBeforeRouteLeave((to, from) => {
  const errors = validateChildTab();
  if (errors.error) {
    const answer = window.confirm('Unsaved changes!\n\n' + errors.text);
    if (!answer) {
      // Cancel the navigation
      return false; 
    }
    restoreChildTab();
    // Proceed with navigation
    return true;
  } else {
    // Proceed with navigation
    return true; 
  }
});
</script>
