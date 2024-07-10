<template>
  <div>
    <Tabs @tabNumber="tabChanged" />
  </div>
  <div id="InputsArea">
    <span v-if="activeTab == '1'">
      <HeadwaterBasinGage />
    </span>
    <span v-else-if="activeTab == '2'">
      <Formulation />
    </span>
    <span v-else-if="activeTab == '3'">
      <TuningControls />
    </span>
    <span v-else-if="activeTab == '4'">
      <Optimization />
    </span>
    <span v-else-if="activeTab == '5'">
      <MetricsPlotting />
    </span>
    <span v-else="activeTab == '6'">
      <RunStatus />
    </span>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref();
import HeadwaterBasinGage from "@/components/HeadwaterBasinGage.vue";
import Formulation from "./Formulation.vue";
import TuningControls from "./TuningControls.vue";
import Optimization from "./Optimization.vue";
import MetricsPlotting from "./MetricsPlotting.vue";
import RunStatus from "./RunStatus.vue";
const tabChanged = (n) => {
  activeTab.value = n;
  console.log(activeTab.value);
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
