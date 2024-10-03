<template> 
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab == 1">
        <PreviousRunsTab />
      </span>
      <span v-else-if="activeTab == 2">
       <SetupForecastRunTab />
      </span>
      <span v-else-if="activeTab == 3">
        <StatusTab />
      </span>
      <span v-else-if="activeTab == 4">
        <ResultsTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from '~/components/Common/Tabs.vue'


// Default to Tab 1, HeadwaterBasinGage
import { generalStore } from "@/stores/common/GeneralStore";
import PreviousRunsTab from '~/components/Forecast/PreviousRunsTab.vue'
import SetupForecastRunTab from './SetupForecastRunTab.vue'
import StatusTab from './StatusTab.vue'
import ResultsTab from './ResultsTab.vue'

const { getForecastTabIndex, setForecastTabIndex } = generalStore();

// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getForecastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  activeTab.value = tabNum;
  setForecastTabIndex(tabNum);
};
</script>
