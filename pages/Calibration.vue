<!-- Calibration.vue -->
<template>
  <NextgenLayout>

  </NextgenLayout>
</template>

<script lang="ts" setup>
import { } from "vue"
import NextgenLayout from "~/layouts/CalibrationLayout.vue";
import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore"
const { setMenuIndex } = generalStore();
const { isUserLoggedIn } = useUserDataStore()
import { useGageStore } from "~/stores/calibration/GageStore";

const gageStore = useGageStore();


(() => {
  if (!isUserLoggedIn()) {
    navigateTo("Login");
  }
})

onBeforeMount(() => {
  if (!isUserLoggedIn()) {
    navigateTo("Login");
  };
});

onMounted(() => {
  const allTabs = document.getElementsByClassName("tabs");
  console.log("All Tabs: ", allTabs)
  const e = allTabs[0] as HTMLElement;
  e.click();
  setMenuIndex(1); // Saves the menu pointer
});

</script>
