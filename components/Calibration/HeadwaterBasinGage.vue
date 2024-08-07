<template>
  <client-only>
    <div id="HeadwaterBasinGage" class="w-full">
      <div id="GageSettings" class="mt-5">
        <div class="row-span-4 selRow">
          <div class="grid grid-cols-4 gap=4">
            <div class="col-span-1">              
              <label for="domain_dd">Domain: </label><br />
              <Dropdown v-model="selected_domain_value" :options="get_domain_options_list" optionLabel="name" optionValue="code" placeholder=" ... " class="w-80"></Dropdown>
            </div>
            <div class="col-span-1">
              <label for="gage_dd">Gage: </label><br />
              <Dropdown v-model="selected_gage_value" filter :options="get_gage_options_list" optionLabel="name" optionValue="code" placeholder=" ... " class="w-80"></Dropdown>              
            </div>
            <div class="col-span-1">
              <label for="forcing_dd">Forcing: </label><br />
              <span v-if="selected_forcing_value != 'upload'">
              <Dropdown v-model="selected_forcing_value" :options="get_forcing_options_list" optionLabel="name" optionValue="code" placeholder=" ... " class="w-80"></Dropdown>
              </span>
              <span v-if="selected_forcing_value == 'upload'">
                <FileUpload mode="basic" name="forcing_files[]" :multiple="true" url="/api/calibration/upload_forcing_data" :maxFileSize="1000000" @upload="onForcingFileUpload" />
                <Button label="Cancel Upload" @click="selected_forcing_value=''"></Button>
              </span>
            </div>
            <div class="col-span-1">
              <label for="observational_dd">Observational: </label><br />
              <span v-if="selected_observational_value != 'upload'">
              <Dropdown v-model="selected_observational_value" :options="get_observational_options_list" optionLabel="name" optionValue="code" placeholder=" ... " class="w-80"></Dropdown>
              </span>
              <span v-if="selected_observational_value == 'upload'">
                <FileUpload mode="basic" name="observational_files[]" :multiple="true" url="/api/calibration/upload_observational_data" :maxFileSize="1000000" @upload="onObservationalFileUpload" />
                <Button label="Cancel Upload" @click="selected_observational_value=''"></Button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div id="GageReport" v-if="selected_gage_value">
        <div id="GrBox">
          <table>
            <tr class="rowOdd">
              <td class="dataName">Agency</td>
              <td class="dataText">{{ gage_tab_data?.gage.agency }}</td>
            </tr>
            <tr class="rowEven">
              <td class="dataName">Station Name</td>
              <td class="dataText">{{ gage_tab_data?.gage.station_name }}</td>
            </tr>
            <tr class="rowOdd">
              <td class="dataName">Site Type</td>
              <td class="dataText">{{ gageData.site_type }}</td>
            </tr>
            <tr class="rowEven">
              <td class="dataName">Latitude</td>
              <td class="dataText">{{ gage_tab_data?.gage.latitude }}</td>
            </tr>
            <tr class="rowOdd">
              <td class="dataName">Longitude</td>
              <td class="dataText">{{ gage_tab_data?.gage.longitude }}</td>
            </tr>
            <tr class="rowEven">
              <td class="dataName">Altitude</td>
              <td class="dataText">{{ gage_tab_data?.gage.altitude }}</td>
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
import Tabs from "~/components/Calibration/Tabs.vue";
import { useCalibrationJobStore } from "~/stores/CalibrationJobStore";
import { storeToRefs } from "pinia";
import { useGageStore } from "~/stores/calibration/GageStore";
// const calibrationJobStore = useCalibrationJobStore()
// const { show_gage_tab_data, selected_job } = calibrationJobStore
const gageStore = useGageStore()
const { gage_tab_data, selected_domain_value, selected_forcing_value, selected_gage_value, get_gage_options_list,selected_observational_value, get_domain_options_list, get_forcing_options_list, get_observational_options_list } = storeToRefs( gageStore )

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

const onForcingFileUpload = () => {

}

const onObservationalFileUpload = () => {
  
}

onMounted(() => {  
  setTimeout(() => {
    selected_domain_value.value = gage_tab_data.value?.domain_source ?? ""
    selected_gage_value.value = gage_tab_data.value?.gage.gage_Id ?? ""
    selected_forcing_value.value = gage_tab_data.value?.forcing_source ?? ""
    selected_observational_value.value = gage_tab_data.value?.observational_source ?? ""
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
</style>
