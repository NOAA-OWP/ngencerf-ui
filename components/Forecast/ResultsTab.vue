<template>
  <div class="text-center text-2xl mt-20">Results</div>
  <div class="text-center text-2xl mt-20">
    <img alt="Page Under Construction" class="m-auto construction-images" src="@/assets/styles/img/under_construction.png" />
    </div>
</template>

<script setup lang="ts">
import { hilightTab } from '@/composables/TabHilight';
onMounted(() => {
  hilightTab(ForecastTabs.tab_results);
  
})


</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";


</style>