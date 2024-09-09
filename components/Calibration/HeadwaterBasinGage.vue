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
                <Select v-model="selectedDomainValue" :options="getDomainOptionsList" optionLabel="name"
                  optionValue="name" placeholder=" ... " class="w-40 m-auto"></Select>
              </div>
              <div class="col-span-1">
                Gage:<br />
                <Select v-model="selectedGageValue" filter :options="getGageOptionsList" optionLabel="name"
                  optionValue="description" placeholder=" ... " :virtualScrollerOptions="{ itemSize: 50 }" class="w-40"
                  @change="onGageSelectionChange"></Select>
              </div>
              <div class="col-span-1">
                Forcing:<br />
                <Select v-model="selectedForcingValue" :options="getForcingOptionsList" optionLabel="name"
                  optionValue="name" placeholder=" ... " class="w-40"></Select>
              </div>
              <div class="col-span-1">
                Observational:<br />
                <Select v-model="selectedObservationalValue" :options="getObservationalOptionsList" optionLabel="name"
                  optionValue="name" placeholder=" ... " class="w-40"></Select>


              </div>
              <div class="col-span-1">&nbsp;</div>
            </div>

            <div class="row-span-1 mt-4">
              <div class="grid grid-cols-10">
                <div class="col-span-3"></div>
                <div class="col-span-4">
                                   <div v-if="selectedForcingValue.toLowerCase() == 'upload'">
                    <div class="mb-2"> Upload Forcing file: </div>
                    <input type="file" multiple="true" name="forcing_files" @change="onSelectForcingFiles"
                      accept=".csv">
                  </div>
                 
                  <div v-if="selectedObservationalValue.toLowerCase() == 'upload'">
                    <div class="mt-2 mb-2"> Upload Observational Geopackage file: </div>
                    <input class="float_right" type="file" name="observational_file"
                      @change="onSelectObservationalFiles" accept=".csv">
                  </div>

                </div>
                <div class="col-span-3"></div>
              </div>
              <div class="col-span-1"></div>
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
import { generalStore } from "~/stores/common/GeneralStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { useToast } from "primevue/usetoast";

const gageStore = useGageStore()
const { gageData, selectedDomainValue, data_loading, selectedForcingValue, selectedGageValue, getGageOptionsList, selectedObservationalValue, getDomainOptionsList, getForcingOptionsList, getObservationalOptionsList } = storeToRefs(gageStore)
const { fetchSelectedGageData, saveGageTabData, resetUserSelection, saveUserForcingFiles, saveUserObservationalFile, saveUserGeopackageFile } = gageStore
const { getCalibrationTabIndex } = generalStore()
const { calibrationJobId } = storeToRefs(generalStore())
const { fetchUserCalibrationRunData } = useUserDataStore()
const toast = useToast()

const onGageSelectionChange = () => {
  fetchSelectedGageData()
}

/**
 * event bus for calibration button group click
 */
useListen('calibrationButtonSaveStart', (actionButton) => {
  if (getCalibrationTabIndex() == 1 && actionButton == 'SAVE') {
    const save_tab_response = saveGageTabData()
    console.log(`saveTabContent Gage, should be tabIndex 1, on tabIndex ${getCalibrationTabIndex()}, save response: `, save_tab_response)
    save_tab_response.then((response) => {
      toast.add({ severity: 'info', summary: 'Open', detail: response?.message, life: 3000 })
      fetchUserCalibrationRunData()
    })
  }
})

useListen('calibrationButtonResetStop', (actionButton) => {
  if (getCalibrationTabIndex() == 1 && actionButton == 'RESET') {
    resetUserSelection()
  }
})

useListen('calibrationButtonPrev', (actionButton) => {
  if (getCalibrationTabIndex() == 1) {
    navigateTo("PreviousRuns")
  }
})

const onSelectForcingFiles = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const formData = new FormData();
  Array.from(target.files || []).forEach(file => {
    formData.append('forcing_files', file)
  })
  formData.append('calibration_run_id', String(calibrationJobId.value))
  const response = saveUserForcingFiles(formData)
  toast.add({ severity: 'info', summary: 'Open', detail: "Forcing file upload completed", life: 3000 })
}

const onSelectObservationalFiles = (event: Event) => {
  const target = event.target as HTMLInputElement
  const formData = new FormData();
  Array.from(target.files || []).forEach(file => {
    formData.append('observational_file', file)
  })
  formData.append('calibration_run_id', String(calibrationJobId.value))
  const response = saveUserObservationalFile(formData)
  toast.add({ severity: 'info', summary: 'Open', detail: "Observational file upload completed", life: 3000 })
}

const onSelectGeopackageFiles = (event: Event) => {
  const target = event.target as HTMLInputElement
  const formData = new FormData();
  Array.from(target.files || []).forEach(file => {
    formData.append('geopackage_file', file)
  })
  formData.append('calibration_run_id', String(calibrationJobId.value))
  const response = saveUserGeopackageFile(formData)
  toast.add({ severity: 'info', summary: 'Open', detail: "Geopackage file upload completed", life: 3000 })
}

/**
 * follow section waiting further detail to be implemented
 */
const selected_rfc = ref<string>("")

const toggle_isNWMv3 = () => {

}

const onObservationalFileUpload = () => {

}

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
