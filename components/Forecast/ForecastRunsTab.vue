<template>
</template>

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';

onMounted(() => {
  hilightTab(ForecastTabs.tab_forecastRuns);

});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>