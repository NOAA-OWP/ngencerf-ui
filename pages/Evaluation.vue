<template>
  <EvaluationLayout>

  </EvaluationLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import EvaluationLayout from "~/layouts/EvaluationLayout.vue";

onMounted(() => {
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[0] as HTMLElement;
  e.click();
});
</script>