<template>
  <div class="text-center text-2xl mt-20">Results</div>
  <div>
        <div id="GraphArea" class="text-center text-2xl mt-20" v-if="selectedPlotFileUrl">
          <img :src="selectedPlotFileUrl" alt="Selected Plot" />
        </div>
        <div id="GraphArea" class="text-center text-2xl mt-20" v-else>
          <!--Data Display-->
        </div>
      </div>
</template>

<script setup lang="ts">

import { hilightTab } from '@/composables/TabHilight';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

onMounted(() => {
  toast.removeAllGroups();
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  hilightTab(ForecastTabs.tab_results);
});

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>