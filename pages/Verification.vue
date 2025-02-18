<template>
    <VerificationLayout>
  
    </VerificationLayout>
  </template>
  
  <script lang="ts" setup>
  import VerificationLayout from "@/layouts/VerificationLayout.vue";

  import { generalStore } from "~/stores/common/GeneralStore";
  const gstore = generalStore();
  const { popupActive } = storeToRefs(gstore);

  onMounted( () => {
    popupActive.value = false;
  })
  
  </script>
  