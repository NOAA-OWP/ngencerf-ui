<template>
  <EvaluationLayout>

  </EvaluationLayout>
</template>

<script lang="ts" setup>
import EvaluationLayout from "~/layouts/EvaluationLayout.vue";
import { generalStore } from "@/stores/common/GeneralStore";
const { setMenuIndex } = generalStore();

onMounted(() => {
  setMenuIndex(2); // Saves the menu pointer
  console.log("Evaluation Section Active");
});

</script>