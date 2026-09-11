<template>
  <ForecastLayout>
    <slot />
  </ForecastLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import ForecastLayout from "@/layouts/ForecastLayout.vue";

import { generalStore } from "~/stores/common/GeneralStore";

const { popupActive } = storeToRefs(generalStore());

onMounted(() => {
  popupActive.value = false;
});

</script>