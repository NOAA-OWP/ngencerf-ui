<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>
      <a class="absolute inset-x-[200px] inset-y-[90px] text-white" target="_blank"
        href="https://confluence.nextgenwaterprediction.com/x/poNtAg">Link to the Confluence Page</a>
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
import pdfUrl from '@/assets/styles/pdfs/ForecastVerification.pdf';

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

a {
  color: #0052CC;
  text-decoration: underline;
  cursor: pointer;
}

.bluetext {
  color: #0052CC;
}

#Verification {
  padding: 40px;
}

.section-title {
  font-size: 1.3em;
}

.sub-title {
  font-size: 1.1em;
  margin: 8px 0;
}

.instruction {
  font-weight: 600;
}

.numbered-list {
  margin-left: 20px;
  margin-bottom: 10px;
}

.boxed-command {
  border: 1px solid #555;
  padding: 10px;
  margin-bottom: 10px;
}

.container {
  height: 800px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}


.section {
  margin-bottom: 30px;
}
</style>
