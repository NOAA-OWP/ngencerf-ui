<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>
      <div class="grid row-span-10 gap-2">
        <iframe class="inline" title="pdf" :src="pdfUrl" width="100%" height="100%"></iframe>
      </div>
      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppFooter from "@/components/Common/AppFooter.vue";
import AppHeader from "@/components/Common/AppHeader.vue";
import pdfUrl from '@/assets/styles/pdfs/VerificationSteps.pdf';

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

</style>
