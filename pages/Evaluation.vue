<template>
 <client-only>
    <EvaluationLayout>
      <slot />
    </EvaluationLayout>
  </client-only>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import EvaluationLayout from "~/layouts/EvaluationLayout.vue";

onMounted(() => {
  nextTick(() => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[CalibrationTabs.tab_calibrationRuns] as HTMLElement;
    e.click();
  });
});
</script>