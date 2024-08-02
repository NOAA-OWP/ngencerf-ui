<template>
  <EvaluationLayout>

  </EvaluationLayout>
</template>

<script lang="ts" setup>
import EvaluationLayout from "~/layouts/EvaluationLayout.vue";
import { generalStore } from "@/stores/common/GeneralStore";
const { getTabIndex } = generalStore();

onMounted(() => {
  console.log(localStorage);
});

</script>