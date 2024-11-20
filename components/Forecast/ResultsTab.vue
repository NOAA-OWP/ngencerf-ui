<template>
  <div>
    <div class="text-center text-2xl mt-20">Results</div>
    <div class="text-center text-2xl mt-20">
      <img alt="Results" class="m-auto construction-images" src="~/assets/styles/img/under_construction.png" />
    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please Wait..." ? src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';

const isLoading = ref<boolean>(false);
onMounted(() => {
  hilightTab(ForecastTabs.tab_results);
  isLoading.value = false;
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }
});

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>