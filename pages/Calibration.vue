<!-- Calibration.vue -->
<template>
  <NextgenLayout>

  </NextgenLayout>
</template>

<script lang="ts" setup>
import NextgenLayout from "~/layouts/CalibrationLayout.vue";
import { generalStore } from "@/stores/common/GeneralStore";
const { setMenuIndex } = generalStore();

onMounted(() => {
  setMenuIndex(1); // Saves the menu pointer
});

</script>
