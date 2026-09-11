<!-- Calibration.vue -->
<template>
  <client-only>
    <NgencerfLayout>
      <slot />
    </NgencerfLayout>
  </client-only>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import NgencerfLayout from "@/layouts/CalibrationLayout.vue";

import { generalStore } from "~/stores/common/GeneralStore";
const { popupActive } = storeToRefs(generalStore());

onMounted(() => {
  popupActive.value = false;
});

</script>
