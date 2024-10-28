<template>

    <img style="height:100%; width:100%" v-if="userCalibrationRunData?.geopackage_image_url" id="GageCutoutImage" :src="userCalibrationRunData?.geopackage_image_url" />

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserDataStore } from '~/stores/common/UserDataStore';
const { userCalibrationRunData } = storeToRefs( useUserDataStore() );
</script>
