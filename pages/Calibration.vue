<!-- Calibration.vue -->
<template>
  <client-only>
    <NextgenLayout>
      <slot />
    </NextgenLayout>
  </client-only>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import NextgenLayout from "@/layouts/CalibrationLayout.vue";

onMounted(() => {
  nextTick(() => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[CalibrationTabs.tab_calibrationRuns] as HTMLElement;
    e.click();
  });
});

</script>
