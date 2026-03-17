<template>
  <HindcastLayout>
    <slot />
  </HindcastLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import HindcastLayout from "@/layouts/HindcastLayout.vue";

import { generalStore } from "~/stores/common/GeneralStore";

const { popupActive } = storeToRefs(generalStore());

onMounted(() => {
  popupActive.value = false;
  nextTick(() => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[HindcastTabs.tab_hindcastRuns] as HTMLElement;
    if (e) {
      e.click();
    }
  });
});

</script>