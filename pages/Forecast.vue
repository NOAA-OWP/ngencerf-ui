<template>
  <ForecastLayout>
    <slot />
  </ForecastLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import ForecastLayout from "~/layouts/ForecastLayout.vue";


onMounted(() => {
  nextTick(() => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[ForecastTabs.tab_calibrationRuns] as HTMLElement;
    e.click();
  });
});

</script>