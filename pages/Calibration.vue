<!-- Calibration.vue -->
<template>
  <NextgenLayout>
    <slot />
  </NextgenLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import NextgenLayout from "~/layouts/CalibrationLayout.vue";

onBeforeMount( () => {
    window.addEventListener("beforeunload", event => {
      event.preventDefault()
      return true;
    })
  });

onUnmounted( () => {
  window.removeEventListener("beforeunload", event => {
      event.preventDefault()
      return true;
    })
});

onMounted(() => {
  nextTick(() => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[CalibrationTabs.tab_calibrationRuns] as HTMLElement;
    e.click();
  });
});

</script>
