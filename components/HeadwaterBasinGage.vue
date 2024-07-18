<template>
  <div id="GageGroup" class="full-width mt-5 ml-20">
    <div class="grid grid-rows-12">
      <div class="row-span-4">
        <div class="grid grid-cols-4 gap=1">
          <div class="col-span-1">
            <label for="domain_dd">Domain: </label><br />
            <select id="domain_dd">
              <option value="" disabled selected>...</option>
              <option>Select Domain</option>
            </select>
          </div>
          <div class="col-span-1">
            <label for="gage_dd">Gage: </label><br />
            <select id="gage_dd">
              <option value="" disabled selected>...</option>
              <option>Select Gage</option>
            </select>
          </div>
          <div class="col-span-1">
            <label for="forcing_dd">Forcing: </label><br />
            <select id="forcing_dd">
              <option value="" disabled selected>...</option>
              <option value="upload">Upload</option>
              <option value="aorc">AORC</option>
            </select>
          </div>
          <div class="col-span-1">
            <label for="observational_dd">Observational: </label><br />
            <select id="observational_dd">
              <option value="" disabled selected>...</option>
              <option value="upload">Upload</option>
              <option value="usgs">USGS</option>
              <option value="usace">USACE</option>
              <option value="ca_dwr">CA DWR</option>
              <option value="env_canada">Environment Canada</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row-span-8"></div>
    </div>
  </div>
  <div class="waitgif" v-if="loading">
    <img src="@/assets/styles/img/wait.gif" />
  </div>
</template>
<script lang="ts" setup>
import Tabs from "@/components/Tabs.vue";

const loading = ref(true);
const showMap = ref(false);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#GageGroup {
  background-color: #cccccc;
  padding: 10px 10px 10px 20px;
  border-radius: 20px;
  height: 80px;
  border: 1px solid $ngwcp_primary1;
}
select {
  width: 90%;
}
.waitgif {
  position: absolute;
  top: 40%;
  left: 45%;
  width: 50px;
  margin: 0 auto;
  z-index: 9999;
}
</style>
