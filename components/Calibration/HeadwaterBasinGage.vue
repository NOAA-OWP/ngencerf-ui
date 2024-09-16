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
                <div v-if="selectedForcingValue.toLowerCase() == 'upload'">
                  <Button label="Upload File" icon="pi pi-upload"
                    @click="showForcingFileUploadDialog('Forcing Files')"></Button>


                </div>
              </div>
              <div class="col-span-1">
                Observational:<br />
                <Select v-model="selectedObservationalValue" :options="getObservationalOptionsList" optionLabel="name"
                  optionValue="name" placeholder=" ... " class="w-40"></Select>

                <div v-if="selectedObservationalValue.toLowerCase() == 'upload'">
                  <Button label="Upload File" icon="pi pi-upload"
                    @click="showObservationalFileUploadDialog('Observational File')"></Button>
                </div>
              </div>
              <div class="col-span-1">&nbsp;</div>
            </div>

            <div class="row-span-1 mt-4">
              <div class="grid grid-cols-10">
                <div class="col-span-4"></div>
                <div class="col-span-4">
                  <div>
                    <div class="mb-2"> Geopackage: </div>
                    <Button label="Upload File" icon="pi pi-upload"
                      @click="showGeopackagFileUploadDialog('Geopackage File')"></Button>
                  </div>
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
            <DynamicDialog />
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
import { useDialog } from "primevue/usedialog";
import FileUploadDialog from "../Common/FileUploadDialog.vue";
import TabPanels from "primevue/tabpanels";

const gageStore = useGageStore();
const { gageData, selectedDomainValue, data_loading, selectedForcingValue, selectedGageValue, getGageOptionsList, selectedObservationalValue, getDomainOptionsList, getForcingOptionsList, getObservationalOptionsList } = storeToRefs(gageStore);
const { fetchSelectedGageData, saveGageTabData, resetUserSelectionGage, saveUserForcingFiles, saveUserObservationalFile, saveUserGeopackageFile } = gageStore;
const { getCalibrationTabIndex } = generalStore();
const { calibrationJobId } = storeToRefs(generalStore());
const { fetchUserCalibrationRunData } = useUserDataStore();
const toast = useToast();

const dialog = useDialog();
const fileUploadDialogOpened = ref<boolean>(false);

const onGageSelectionChange = () => {
  fetchSelectedGageData();
}

/**
 * event bus for calibration button group click
 */
useListen('calibrationButtonSaveStart', (actionButton) => {
  console.log("Action Button: ", actionButton);
  if (getCalibrationTabIndex() == 1 && actionButton == 'SAVE') {
    const save_tab_response = saveGageTabData();
    console.log(`saveTabContent Gage, should be tabIndex 1, on tabIndex ${getCalibrationTabIndex()}, save response: `, save_tab_response);
    save_tab_response.then((response) => {
      toast.add({ severity: 'info', summary: 'Open', detail: response?.message, life: 3000 })
      fetchUserCalibrationRunData();
    })
  }
})

useListen('calibrationButtonResetStop', (actionButton) => {
  console.log("Action Button: ", actionButton);
  if (getCalibrationTabIndex() == 1 && actionButton == 'RESET') {
    resetUserSelectionGage();
    console.log("resetUserSelectionGage reset");
  }
})

useListen('calibrationButtonNext', (actionButton) => {
  console.log("Action Button: ", actionButton);
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[1];
  e.click()
})

const showForcingFileUploadDialog = (headerText: string) => {
  if (!fileUploadDialogOpened.value) {
    dialog.open(FileUploadDialog, {
      props: {
        header: `Upload ${headerText}`,
        style: {
          width: '70vw',
        },
        modal: true,
      },
      data: {
        selectMultiple: true,
        fileExtension: '.csv',
        inputName: 'forcing_files[]',
        calibrationRunId: calibrationJobId.value,
        formFileField: 'forcing_files',
        saveFunction: saveUserForcingFiles
      },
      onClose: (opt) => {
        handleDialogClose(opt)
      },
    })
    fileUploadDialogOpened.value = true
  }
}

const handleDialogClose = (opt: any) => {
  if (opt && opt.data) {
    toast.add({ severity: 'info', summary: `File upload Completed`, detail: opt.data.saveFileResponseResult.message, life: 3000 })
  }
  fileUploadDialogOpened.value = false
}

const showObservationalFileUploadDialog = (headerText: string) => {
  if (!fileUploadDialogOpened.value) {
    dialog.open(FileUploadDialog, {
      props: {
        header: `Upload ${headerText}`,
        style: {
          width: '70vw',
        },
        modal: true,
      },
      data: {
        selectMultiple: false,
        fileExtension: '.csv',
        inputName: 'observational_file',
        calibrationRunId: calibrationJobId.value,
        formFileField: 'observational_file',
        saveFunction: saveUserObservationalFile
      },
      onClose: (opt) => {
        handleDialogClose(opt)
      },
    })
    fileUploadDialogOpened.value = true
  }
}

const showGeopackagFileUploadDialog = (headerText: string) => {
  if (!fileUploadDialogOpened.value) {
    dialog.open(FileUploadDialog, {
      props: {
        header: `Upload ${headerText}`,
        style: {
          width: '70vw',
        },
        modal: true,
      },
      data: {
        selectMultiple: false,
        fileExtension: ".gpkg",
        inputName: 'geopackage_file',
        calibrationRunId: calibrationJobId.value,
        formFileField: 'geopackage_file',
        saveFunction: saveUserGeopackageFile
      },
      onClose: (opt) => {
        handleDialogClose(opt)
      },
    })
    fileUploadDialogOpened.value = true
  }
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
