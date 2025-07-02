<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>

      <div class="grid row-span-10 gap-2">

      </div>

      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";
import AppFooter from "@/components/Common/AppFooter.vue";
import AppHeader from "@/components/Common/AppHeader.vue";

import { generalStore } from "@/stores/common/GeneralStore";

const { getMenuIndex, getVerificationTabIndex, setVerificationTabIndex } = generalStore();

onUnmounted(() => {
  // Reset tab index to 1 when we leave this layout, 
  // so that it doesn't try to mount the wrong tab when you return
  setVerificationTabIndex(1);
})
</script>
<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>