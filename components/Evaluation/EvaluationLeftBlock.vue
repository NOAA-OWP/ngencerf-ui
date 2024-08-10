<template>
  <!-- EvaluationLeftBlock.vue -->
  <div>
    <EvaluationTabs @tabNumber="tabChanged" />
    <div class="shrink-0" id="InputsArea">
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
import EvaluationTabs from '~/components/Evaluation/EvaluationTabs.vue';
import EvaluateTab from './EvaluateTab.vue';
import SetupValRunTab from './SetupValRunTab.vue';
import SelectParamsSetTab from './SelectParamsSetTab.vue';
import ReviewSetupRunTab from './ReviewSetupRunTab.vue';
import StatusTab from './StatusTab.vue';
import CalibrationRunsTab from './CalibrationRunsTab.vue';

// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(1);

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
};
</script>

<style lang="scss" scoped>
#InputsArea {
  //position: absolute;
  //margin-left: 100px;
  height: 20vw;
  min-width: 960px;
}
</style>
