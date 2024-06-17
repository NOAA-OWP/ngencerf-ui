<template>
  <TopMenu/>
  <div id="FrontPage" class="full-height">
    <div class="titleText">Nextgen Water Prediction</div>
    <div id="LeafMap">
      <div>
         <!-- <leafletMap /> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import LeafletMap from "../components/LeafletMap.vue";
export default {
  name: "FrontPage",
  data: () => ({
    inputType: "Name",
    displayCesium: true,
  }),
  methods: {
    submitReport() {
      alert("Report submitted");
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/styles.scss";
html,
body {
  overflow: hidden;
  height: 100%;
}

#LeafMap {
  width: 50%;
  margin: 0 auto;
  margin-top: 100px;
  background-color: white;
  color: black;
}

.full-height {
  height: 100%;
}

.titleText {
  color: white;
  padding: 50px 0 0 100px;
  font-size: 40px;
}

#FrontPage {
  height: 1024px;
  color: white;
}
</style>
