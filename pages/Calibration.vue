<!-- Calibration.vue -->
<template>
  <NextgenLayout>

  </NextgenLayout>
</template>

<script lang="ts" setup>
import NextgenLayout from "~/layouts/CalibrationLayout.vue";
import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore"
const { setMenuIndex } = generalStore();
const { fetchUserCalibrationRunData } = useUserDataStore()
import { useGageStore } from "~/stores/calibration/GageStore";

const gageStore = useGageStore();


onMounted(() => {
  fetchUserCalibrationRunData()
  setMenuIndex(1); // Saves the menu pointer
});

</script>
