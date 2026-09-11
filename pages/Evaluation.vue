<template>
  <client-only>
    <EvaluationLayout>
      <slot />
    </EvaluationLayout>
  </client-only>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import EvaluationLayout from "@/layouts/EvaluationLayout.vue";
import { generalStore } from "~/stores/common/GeneralStore";
const { popupActive } = storeToRefs(generalStore());

onMounted(() => {
  popupActive.value = false;
});
</script>