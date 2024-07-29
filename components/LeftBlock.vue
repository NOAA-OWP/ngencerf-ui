<template>
  <!-- LeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0" id="InputsArea">
      <span v-if="activeTab == 1">
        <HeadwaterBasinGage />
      </span>
      <span v-else-if="activeTab == 2">
        <Formulation />
      </span>
      <span v-else-if="activeTab == 3">
        <TuningControls />
      </span>
      <span v-else-if="activeTab == 4">
        <OptimizationMetrics />
      </span>
      <span v-else-if="activeTab == 5">
        <RunStatus />
      </span>
      <span v-else="activeTab == 6">
        <Results />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '@/components/Tabs.vue';
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
