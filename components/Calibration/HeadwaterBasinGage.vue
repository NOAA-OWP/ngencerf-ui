<template>
  <client-only>
    <div id="HeadwaterBasinGage" class="w-full">
      <div id="GageSettings" class="mt-5">

        <div class="grid grid-rows-2">
          <div class="row-span-2 selRow">

            <div class="grid grid-cols-6 gap-4">
              <div class="col-span-1">&nbsp;</div>
              <div class="col-span-1">
                Domain:<br />
                <Dropdown v-model="selectedDomainValue" :options="getDomainOptionsList" optionLabel="name"
                  optionValue="name" placeholder=" ... " class="w-40 m-auto"></Dropdown>
              </div>
              <div class="col-span-1">
                Gage:<br />
                <Dropdown v-model="selectedGageValue" filter :options="getGageOptionsList" optionLabel="name"
                  optionValue="description" placeholder=" ... " :virtualScrollerOptions="{ itemSize: 50 }" class="w-40" @change="onGageSelectionChange"></Dropdown>
              </div>
              <div class="col-span-1">
                Forcing:<br />
                <span v-if="selectedForcingValue != 'upload'">
                  <Dropdown v-model="selectedForcingValue" :options="getForcingOptionsList" optionLabel="name"
                    optionValue="name" placeholder=" ... " class="w-40"></Dropdown>
                </span>
                <span v-if="selectedForcingValue == 'upload'">
                  <FileUpload mode="basic" name="forcing_files[]" :multiple="true"
                    url="/api/calibration/upload_forcing_data" :maxFileSize="1000000" @upload="onForcingFileUpload" />
                  <Button label="Cancel Upload" @click="selectedForcingValue = ''"></Button>
                </span>
              </div>
              <div class="col-span-1">
                Observational:<br />
                <span v-if="selectedObservationalValue != 'upload'">
                  <Dropdown v-model="selectedObservationalValue" :options="getObservationalOptionsList"
                    optionLabel="name" optionValue="name" placeholder=" ... " class="w-40"></Dropdown>
                </span>
                <span v-if="selectedObservationalValue == 'upload'">
                  <FileUpload mode="basic" name="observational_files[]" :multiple="true"
                    url="/api/calibration/upload_observational_data" :maxFileSize="1000000"
                    @upload="onObservationalFileUpload" />
                  <Button label="Cancel Upload" @click="selectedObservationalValue = ''"></Button>
                </span>
              </div>
              <div class="col-span-1">&nbsp;</div>
            </div>

            <div class="row-span-1 mt-4">
              <!-- These controls temorarily commented out and will be dealt with with a later story NHS 8-19-2024-->
              <!-- <div class="grid grid-cols-4 gap=4">
                <div class="col-span-1">&nbsp;</div>
                <div class="col-span-1">
                  RFC: <Dropdown id="select_rfc" v-model="selected_rfc" placeholder=" ... " class="w-40"></Dropdown>
                </div>
                <div class="col-span-1 flex items-center">
                  <Checkbox v-model="isNWMv3" inputId="isNWMv3" name="isNWMv3" :binary="true"
                    @change="toggle_isNWMv3" />
                  &nbsp;&nbsp;Calibrated in NWMv3
                </div>
                <div class="col-span-1"></div>
              </div> -->
            </div>
          </div>

        </div>
        <!-- <div class="row-span-8"> -->
          <div id="GageReport" v-if="gageData">
            <div id="GrBox">
              <table>
                <tr class="rowOdd">
                  <td class="dataName">Domain</td>
                  <td class="dataText">{{ selectedDomainValue }}</td>
                </tr>
                <tr class="rowEven">
                  <td class="dataName">Gage ID</td>
                  <td class="dataText">{{ gageData?.gage_id }}</td>
                </tr>
                <tr class="rowOdd">
                  <td class="dataName">Agency</td>
                  <td class="dataText">{{ gageData?.agency }}</td>
                </tr>
                <tr class="rowEven">
                  <td class="dataName">Station Name</td>
                  <td class="dataText">{{ gageData?.station_name }}</td>
                </tr>
                <tr class="rowOdd">
                  <td class="dataName">Site Type</td>
                  <td class="dataText"></td>
                </tr>
                <tr class="rowEven">
                  <td class="dataName">Latitude</td>
                  <td class="dataText">{{ gageData?.latitude }}</td>
                </tr>
                <tr class="rowOdd">
                  <td class="dataName">Longitude</td>
                  <td class="dataText">{{ gageData?.longitude }}</td>
                </tr>
                <tr class="rowEven">
                  <td class="dataName">Altitude</td>
                  <td class="dataText">{{ gageData?.altitude }}</td>
                </tr>
                <tr class="rowOdd">
                  <td class="dataName">Date Established</td>
                  <td class="dataText"></td>
                </tr>
                <tr class="rowEven">
                  <td class="dataName">Drainage Area</td>
                  <td class="dataText"></td>
                </tr>
                <tr class="rowOdd">
                  <td class="dataName">HUC</td>
                  <td class="dataText"></td>
                </tr>
              </table>
            </div>
          </div>
        <!-- </div> -->
      </div>
    </div>
    <div class="waitgif" v-if="data_loading">
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
const { gageData, gageTabData, selectedDomainValue, data_loading, selectedForcingValue, selectedGageValue, getGageOptionsList, selectedObservationalValue, getDomainOptionsList, getForcingOptionsList, getObservationalOptionsList } = storeToRefs(gageStore)
const { queryGageTabData, fetchSelectedGageData } = gageStore

const selected_rfc = ref<string>("")
const showMap = ref(false);

// const gageData: GageData = {
//   agency: "US Geological Survey",
//   station_name: "LITTLE RIVER NEAR HANNOVER, CT",
//   site_type: "Stream",
//   latitude: "41.6717651",
//   longitude: "-72.05229807",
//   altitude: "220.32 feet",
//   date_established: "19510701",
//   drainage_area: "30.0 Square miles",
//   huc: "01100002",
// };

const toggle_isNWMv3 = () => {

}

const onGageSelectionChange = () => {
  console.log( selectedGageValue.value )
  fetchSelectedGageData()

}

const onForcingFileUpload = () => {

}

const onObservationalFileUpload = () => {

}

//onMounted(() => {
  //setTimeout(() => {
  // queryGageTabData()
  // selectedDomainValue.value = getSavedDomainValue.value ?? ""
  // selectedGageValue.value = gageTabData.value?.gage.gage_id ?? ""
  // selectedForcingValue.value = gageTabData.value?.forcing_source ?? ""
  // selectedObservationalValue.value = gageTabData.value?.observational_source ?? ""
  //loading.value = false;
  //}, 500);
//});
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

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
