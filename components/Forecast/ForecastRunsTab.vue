<template>
  <client-only>
    <div>
      <h2>Forecaset Runs</h2>

      <div class="waitgif" v-if="isLoading">
        <img alt="Pleae wait..." src="@/assets/styles/img/wait.gif" />
      </div>
    </div>
  </client-only>
</template>
<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';
const isLoading = ref<boolean>(true);
onMounted(() => {
  hilightTab(ForecastTabs.tab_forecastRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }
  isLoading.value = false;
})
</script>
