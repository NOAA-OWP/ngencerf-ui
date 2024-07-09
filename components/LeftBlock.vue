<script setup lang="ts">
import HeadwaterBasinGage from '@/components/HeadwaterBasinGage.vue';
</script>

<template>
  <div>
    <Tabs />
  </div>
  <div id="InputsArea">
    <HeadwaterBasinGage />
  </div>
</template>

<style lang="scss" scoped>
#InputsArea {
  position: absolute;
  width: 58.8%;
  margin-left: 10px;
  height: 20vw;
}
</style>
