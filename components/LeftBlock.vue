<template>
   <!-- LeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
  </div>
  <div id="InputsArea">
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
</template>

<script setup lang="ts">
// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(1);

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
};
</script>

<style lang="scss" scoped>
#InputsArea {
  position: absolute;
  width: 58.8%;
  margin-left: 10px;
  height: 20vw;
}
</style>
