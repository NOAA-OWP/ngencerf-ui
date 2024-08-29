<template> 
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0" id="InputsArea">
      <span v-if="activeTab == 1">
        <div style="text-center">Previous Runs</div>
      </span>
      <span v-else-if="activeTab == 2">
        <div style="text-center">Setup Forecate / Run</div>
      </span>
      <span v-else-if="activeTab == 3">
        <div style="text-center">Status</div>
      </span>
      <span v-else-if="activeTab == 4">
        <div style="text-center">Results</div>
      </span>
      <span v-else-if="activeTab == 5">
        <div style="text-center"></div>
      </span>
      <span v-else="activeTab == 6">
        <div style="text-center"></div>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '~/components/Common/Tabs.vue'import PreviousRunsTab from "~/components/Forecast/"

// Default to Tab 1, HeadwaterBasinGage
import { generalStore } from "@/stores/common/GeneralStore";
const { getForecastTabIndex, setForecastTabIndex } = generalStore();

// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getForecastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setForecastTabIndex(tabNum);
};
</script>

<style lang="scss" scoped>
#InputsArea {
  height: 20vw;
  min-width: 960px;
}
</style>
