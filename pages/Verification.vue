<template>
  <VerificationLayout>
    <slot />
  </VerificationLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import VerificationLayout from "@/layouts/VerificationLayout.vue";

import { generalStore } from "~/stores/common/GeneralStore";

const { popupActive } = storeToRefs(generalStore());

onMounted(() => {
  popupActive.value = false;
  nextTick(() => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[VerificationTabs.tab_forecastRuns] as HTMLElement;
    if (e) {
      e.click();
    }
  });
});

</script>