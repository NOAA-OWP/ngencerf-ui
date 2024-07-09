<template>
  <main>
    <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :useGlobalLeaflet="false">
      <l-tile-layer url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png" layer-type="base"
        name="Stadia Maps Basemap"></l-tile-layer>
      <l-marker v-for="arcade in arcades.features" :lat-lng="arcade.geometry.coordinates.reverse()"></l-marker>
    </l-map>

  </main>
</template>

<script setup>
import { ref } from "vue";
import "leaflet/dist/leaflet.css"
import { LMarker, LMap, LTileLayer } from "@vue-leaflet/vue-leaflet"
import arcades from "@/assets/arcades.json";

const apiKey = "cbbe8e01-d964-4fa5-85d1-0e1690fd31d3";
let zoom = ref(4.5)
let center = ref([40, -100])

</script>
<style lang="css" scoped>
html,
body {
  margin: 0;
  padding: 0;
}

main {
  height: 22.5vw; 
  width: 49.5vw;
  margin: 20px auto 0 auto;
}
</style>