<template>
 
    <EvaluationLayout>
      <slot />
    </EvaluationLayout>

</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import EvaluationLayout from "~/layouts/EvaluationLayout.vue";

onMounted(() => {
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[CalibrationTabs.tab_calibrationRuns] as HTMLElement;
  e.click();
});
</script>