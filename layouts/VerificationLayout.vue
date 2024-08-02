<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>
      <div class="h-full grid row-span-10 gap-2">

        <h1 class="text-center mt-10">VERIFICATION</h1>

      </div>
      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppFooter from "~/components/Common/AppFooter.vue";
import AppHeader from "~/components/Common/AppHeader.vue";

</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>