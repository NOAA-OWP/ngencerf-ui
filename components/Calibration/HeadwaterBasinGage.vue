<template>
  <client-only>
    <div id="HeadwaterBasinGage" class="w-full">
      <div id="GageSettings" class="mt-5">
        <div class="row-span-4 selRow">
          <div class="grid grid-cols-4 gap=4">
            <div class="col-span-1">              
              <label for="domain_dd">Domain: </label><br />
              <Dropdown v-model="selectedDomainValue" :options="getDomainOptionsList" optionLabel="name" optionValue="code" placeholder=" ... " class="w-80"></Dropdown>
            </div>
            <div class="col-span-1">
              <label for="gage_dd">Gage: </label><br />
              <Dropdown v-model="selectedGageValue" filter :options="getGageOptionsList" optionLabel="name" optionValue="code" placeholder=" ... " class="w-80"></Dropdown>              
            </div>
            <div class="col-span-1">
              <label for="forcing_dd">Forcing: </label><br />
              <span v-if="selectedForcingValue != 'upload'">
              <Dropdown v-model="selectedForcingValue" :options="getForcingOptionsList" optionLabel="name" optionValue="code" placeholder=" ... " class="w-80"></Dropdown>
              </span>
              <span v-if="selectedForcingValue == 'upload'">
                <FileUpload mode="basic" name="forcing_files[]" :multiple="true" url="/api/calibration/upload_forcing_data" :maxFileSize="1000000" @upload="onForcingFileUpload" />
                <Button label="Cancel Upload" @click="selectedForcingValue=''"></Button>
              </span>
            </div>
            <div class="col-span-1">
              <label for="observational_dd">Observational: </label><br />
              <span v-if="selectedObservationalValue != 'upload'">
              <Dropdown v-model="selectedObservationalValue" :options="getObservationalOptionsList" optionLabel="name" optionValue="code" placeholder=" ... " class="w-80"></Dropdown>
              </span>
              <span v-if="selectedObservationalValue == 'upload'">
                <FileUpload mode="basic" name="observational_files[]" :multiple="true" url="/api/calibration/upload_observational_data" :maxFileSize="1000000" @upload="onObservationalFileUpload" />
                <Button label="Cancel Upload" @click="selectedObservationalValue=''"></Button>
              </span>
            </div>
          </div>
          <div class="grid grid-cols-4 gap=4">
            <div class="col-span-1">
              <label for="select_rfc">RFC</label> <Dropdown id="select_rfc" v-model="selected_rfc" placeholder=" ... "></Dropdown>
            </div>
            <div class="col-span-1 flex items-center">
              <Checkbox v-model="isNWMv3" inputId="isNWMv3" name="isNWMv3" :binary="true" @change="toggle_isNWMv3" />&nbsp;&nbsp;Calibrated in NWMv3
            </div>
            <div class="col-span-2"></div>
          </div>
        </div>
      </div>

      <div id="GageReport" v-if="selectedGageValue">
        <div id="GrBox">
          <table>
            <tr class="rowOdd">
              <td class="dataName">Domain</td>
              <td class="dataText">{{ gageTabData?.domain_source }}</td>
            </tr>
            <tr class="rowEven">
              <td class="dataName">Gage ID</td>
              <td class="dataText">{{ gageTabData?.gage.gage_Id }}</td>
            </tr>            
            <tr class="rowOdd">
              <td class="dataName">Agency</td>
              <td class="dataText">{{ gageTabData?.gage.agency }}</td>
            </tr>
            <tr class="rowEven">
              <td class="dataName">Station Name</td>
              <td class="dataText">{{ gageTabData?.gage.station_name }}</td>
            </tr>
            <tr class="rowOdd">
              <td class="dataName">Site Type</td>
              <td class="dataText">{{ gageData.site_type }}</td>
            </tr>
            <tr class="rowEven">
              <td class="dataName">Latitude</td>
              <td class="dataText">{{ gageTabData?.gage.latitude }}</td>
            </tr>
            <tr class="rowOdd">
              <td class="dataName">Longitude</td>
              <td class="dataText">{{ gageTabData?.gage.longitude }}</td>
            </tr>
            <tr class="rowEven">
              <td class="dataName">Altitude</td>
              <td class="dataText">{{ gageTabData?.gage.altitude }}</td>
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
import { storeToRefs } from "pinia";
import { useGageStore } from "~/stores/calibration/GageStore";
// const calibrationJobStore = useCalibrationJobStore()
// const { show_gage_tab_data, selected_job } = calibrationJobStore
const gageStore = useGageStore()
const { isNWMv3, gageTabData, selectedDomainValue, selectedForcingValue, selectedGageValue, getGageOptionsList,selectedObservationalValue, getDomainOptionsList, getForcingOptionsList, getObservationalOptionsList } = storeToRefs( gageStore )

const selected_rfc = ref<string>("")
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

const toggle_isNWMv3 = () => {
  
}

const onForcingFileUpload = () => {

}

const onObservationalFileUpload = () => {

}

onMounted(() => {  
  setTimeout(() => {
    selectedDomainValue.value = gageTabData.value?.domain_source ?? ""
    selectedGageValue.value = gageTabData.value?.gage.gage_Id ?? ""
    selectedForcingValue.value = gageTabData.value?.forcing_source ?? ""
    selectedObservationalValue.value = gageTabData.value?.observational_source ?? ""
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
