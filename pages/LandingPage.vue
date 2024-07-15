<template>
  <div>Landing Page</div>
  <div @click="NewCalibration">
    <button>New</button>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const NewCalibration = async () => {
  await navigateTo("Calibration")
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>
