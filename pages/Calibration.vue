<!-- Calibration.vue -->
<template>
  <NextgenLayout>

  </NextgenLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import NextgenLayout from "~/layouts/CalibrationLayout.vue";

onMounted(() => {
  console.log('MOUNTED: Calibration');
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[0] as HTMLElement;
  e.click();
});

</script>
