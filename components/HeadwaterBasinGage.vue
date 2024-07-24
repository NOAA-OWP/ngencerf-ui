<template>
  <client-only>
  <div id="HeadwaterBasinGage" class="w-full">
    <div id="GageSettings" class="mt-5">
        <div  class="row-span-4 selRow">
          <div class="grid grid-cols-4 gap=4">
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
      </div>

    <div id="GageReport">
      <div id="GrBox">
        <table>
          <tr class="rowOdd">
            <td class="dataName">Agency</td>
            <td class="dataText">{{ gageData.agency }}</td>
          </tr>
          <tr class="rowEven">
            <td class="dataName">Station Name</td>
            <td class="dataText">{{ gageData.station_name }}</td>
          </tr>
          <tr class="rowOdd">
            <td class="dataName">Site Type</td>
            <td class="dataText">{{ gageData.site_type }}</td>
          </tr>
          <tr class="rowEven">
            <td class="dataName">Latitude</td>
            <td class="dataText">{{ gageData.latitude }}</td>
          </tr>
          <tr class="rowOdd">
            <td class="dataName">Longitude</td>
            <td class="dataText">{{ gageData.longitude }}</td>
          </tr>
          <tr class="rowEven">
            <td class="dataName">Altitude</td>
            <td class="dataText">{{ gageData.altitude }}</td>
          </tr>
          <tr class="rowOdd">
            <td class="dataName">Date Established</td>
            <td class="dataText">{{ gageData.date_established }}</td>
          </tr>
          <tr class="rowEven">
            <td class="dataName">Drainage Area</td>
            <td class="dataText">{{ gageData.drainage_area }}</td>
          </tr>
          <tr class="rowOdd">
            <td class="dataName">HUC</td>
            <td class="dataText">{{ gageData.huc }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <div class="waitgif" v-if="loading">
    <img src="@/assets/styles/img/wait.gif" />
  </div>
</client-only>
</template>
<script lang="ts" setup>
import Tabs from "@/components/Tabs.vue";

const loading = ref(true);
const showMap = ref(false);

const gageData: GageData = {
  agency: "US Geological Survey",
  station_name: "LITTLE RIVER NEAR HANNOVER, CT",
  site_type: "Stream",
  latitude: "41.6717651",
  longitude: "-72.05229807",
  altitude: "220.32 feet",
  date_established: "19510701",
  drainage_area: "30.0 Square miles",
  huc: "01100002",
};

onMounted(() => { 
  setTimeout(() => {
    loading.value = false;
  }, 500); 
});
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#GageSettings {
  width: 60vw;
  //margin-left: 5vw;
  margin: 20px auto;
  background-color: $ngwcp_groupsbkg;
  padding: 10px 10px 10px 20px;
  border-radius: 20px;
  height: 80px;
  border: 1px solid $ngwcp_primary1;
}
select {
  width: 90%;
}

#GageReport {
  margin: 30px auto 0 auto;
  width: 600px;
  height: 315px;
  background-color: $ngwcp_groupsbkg;
  border-radius: 20px;
  border: 1px solid $ngwcp_primary1;
  padding: 10px;
  table {
    width: 100%;
    margin: 10px auto;
    border: 1px solid $ngwcp_primary1;
    tr {
      line-height: 27px;
      border-bottom: 1px solid #333333;

      td {
        width: 50%;
        padding-left: 5px;
      }
    }
  }
}

.rowOdd {
  background-color: #dddddd;
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
