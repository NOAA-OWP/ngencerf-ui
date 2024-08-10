<template>
  <client-only>
    <div id="HeadwaterBasinGage" class="w-full">
      <div id="GageSettings" class="mt-5">
        <div class="row-span-4 selRow">
          <div class="grid grid-cols-4 gap=4">
            <div class="col-span-1">
              <p class="mb-1">Domain:</p>
              <select id="domain_dd">
                <option value="" disabled selected>...</option>
                <option>Select Domain</option>
              </select>
            </div>
            <div class="col-span-1">
              <p class="mb-1" for="gage_dd">Gage: </p>
              <select id="gage_dd">
                <option value="" disabled selected>...</option>
                <option>Select Gage</option>
              </select>
            </div>
            <div class="col-span-1">
              <p class="mb-1" for="forcing_dd">Forcing: </p>
              <select id="forcing_dd">
                <option value="" disabled selected>...</option>
                <option value="upload">Upload</option>
                <option value="aorc">AORC</option>
              </select>
            </div>
            <div class="col-span-1">
              <p class="mb-1" for="observational_dd">Observational: </p>
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
import Tabs from "~/components/Calibration/CalibrationTabs.vue";

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
  width: 900px;
  margin: 20px auto;
  height: 80px; 
}

select {
  width: 90%;

}

#GageReport {
  margin: 30px auto 0 auto;
  width: 700px;
  height: 315px;
  table {
    width: 100%;
    margin: 10px auto;
    border: 1px solid $ngwcp_primary1;
    font-size: 1.2em;
    tr {
      line-height: 27px;
      border-bottom: 1px solid #333333;

      td {
        width: 50%;
        padding-left: 10px;
        border-right: 1px solid black;
      }
    }
  }
}

.rowOdd {
  background-color: #dddddd;
}
</style>
