<template>
  <div v-if="userCalibrationRunData?.geopackage_image_url" @click="showImageModal = true" style="cursor: pointer;">
    <img alt="Gage Cutout" class="max-w-full max-h-[400px] object-contain" id="GageCutoutImage"
      :src="userCalibrationRunData?.geopackage_image_url" />
  </div>

  <div v-if="showImageModal"
    class="fixed inset-0 z-[1000] flex justify-center items-center bg-black bg-opacity-90 animate-fade-in">
    <!-- Container to handle hover for close icon -->
    <div class="relative h-full w-full flex justify-center items-center group">
      <img :src="userCalibrationRunData.geopackage_image_url" alt="Full Gage Cutout"
        class="max-h-full max-w-full object-contain" />
      <!-- Close button shown only on hover -->
      <div
        class="absolute top-4 right-4 text-white text-4xl font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-125"
        @click="showImageModal = false">
        ×
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useUserDataStore } from '@/stores/common/UserDataStore';

const { userCalibrationRunData } = storeToRefs(useUserDataStore());

// this controls showing the image modal
const showImageModal = ref(false)

</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
</style>
