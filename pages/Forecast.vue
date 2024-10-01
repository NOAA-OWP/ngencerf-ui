<template>
  <ForecastLayout>

  </ForecastLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import ForecastLayout from "~/layouts/ForecastLayout.vue";
import { generalStore } from "@/stores/common/GeneralStore";
const { setMenuIndex } = generalStore();

onMounted(() => {
  setMenuIndex(3); // Saves the menu pointer
});

</script>