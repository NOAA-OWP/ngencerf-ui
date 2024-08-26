<template>

    <img v-if="geopackageImageUrl" id="GageCutoutImage" :src="geopackageImageUrl" />

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGageStore } from '~/stores/calibration/GageStore';

const { geopackageImageUrl } = storeToRefs( useGageStore() )
</script>

<style></style>