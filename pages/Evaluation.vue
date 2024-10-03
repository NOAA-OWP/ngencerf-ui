<template>
  <EvaluationLayout>

  </EvaluationLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import EvaluationLayout from "~/layouts/EvaluationLayout.vue";
import { generalStore } from "@/stores/common/GeneralStore";
const { setMenuIndex } = generalStore();

onMounted(() => {
  console.log('MOUNTED: Evaluation');
  setMenuIndex(2); // Saves the menu pointer
});

</script>