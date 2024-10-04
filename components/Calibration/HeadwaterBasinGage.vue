<template>
  <div id="HeadwaterBasinGage" class="w-full mt-4">
    <div id="GageSettings" class="mt-5">
      <div class="grid grid-rows-2">
        <div class="row-span-2 selRow">
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-1">
              <label for="Domain">Domain:</label><br />
              <Select id="Domain" v-model="selectedDomainValue" :options="getDomainOptionsList" optionLabel="name"
                optionValue="name" placeholder=" ... " class="w-full"></Select>
            </div>
            <div class="col-span-1">
              <label for="Gage">Gage:</label><br />
              <Select id="Gage" v-model="selectedGageValue" filter :options="getGageOptionsList" optionLabel="name"
                optionValue="description" placeholder=" ... " :virtualScrollerOptions="{ itemSize: 50 }"
                @change="onGageSelectionChange" class="w-full"></Select>
            </div>
            <div class="col-span-1">&nbsp;<!--empty space used for layout--></div>

            <div class="col-span-1">
              <label for="Forcing">Forcing:</label><br />
              <Select id="Forcing" v-model="selectedForcingValue" :options="getForcingOptionsList" optionLabel="name"
                optionValue="name" placeholder=" ... " class="w-full"></Select>
              <!-- 1) undecided: additional icons: <button icon="pi pi-upload"...>
                              2) undecided: alternative label: <button label="Upload File" ...> -->
              <div v-if="selectedForcingValue.toLowerCase() == 'upload'"
                class="ngenButtonDiv-alt bg-blue4 clear-left mt-1">
                <Button label="Upload" @click="showForcingFileUploadDialog('Forcing Files')"></Button>


              </div>
            </div>
            <div class="col-span-1">
              <label for="Observational">Observational:</label><br />
              <Select id="Observational" v-model="selectedObservationalValue" :options="getObservationalOptionsList"
                optionLabel="name" optionValue="name" placeholder=" ... " class="w-full"></Select>

              <div v-if="selectedObservationalValue.toLowerCase() == 'upload'"
                class="ngenButtonDiv-alt bg-blue4 clear-left mt-1">
                <Button label="Upload" @click="showObservationalFileUploadDialog('Observational File')"></Button>
              </div>
            </div>
            <div class="col-span-1">
              <label for="Geopackage">Geopackage:</label><br />

              <Select v-model="selectedGeopackageValue" :options="getGeopackageOptionsList" optionLabel="name"
                optionValue="name" placeholder=" ... " class="w-full"></Select>
              <div v-if="selectedGeopackageValue.toLowerCase() == 'upload'"
                class="ngenButtonDiv-alt bg-blue4 clear-left mt-1">
                <Button label="Upload" @click="showGeopackagFileUploadDialog('Geopackage File')"></Button>
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

          <div class="row-span-1 mt-4">
            <div class="grid grid-cols-10">
              <div class="col-span-4"></div>

            </div>
          </div>
          <DynamicDialog />
          <div id="GageReport" v-if="gageData" class="text-sm inline ml-0">
            <div id="GrBox" class="mt-6">
              <table class="table-auto">
                <tbody>
                  <tr v-if="selectedDomainValue" class="rowOdd">
                    <td class="dataName td1">Domain:</td>
                    <td class="dataText td2">{{ selectedDomainValue }}</td>
                  </tr>
                  <tr v-if="gageData?.gage_id" lass="rowEven">
                    <td class="dataName td1">Gage ID:</td>
                    <td class="dataText td2">{{ gageData?.gage_id }}</td>
                  </tr>
                  <tr v-if="gageData?.agency" class="rowOdd">
                    <td class="dataName td1">Agency:</td>
                    <td class="dataText td2">{{ gageData?.agency }}</td>
                  </tr>
                  <tr v-if="gageData?.station_name" class="rowEven">
                    <td class="dataName td1">Station Name:</td>
                    <td class="dataText td2">{{ gageData?.station_name }}</td>
                  </tr>
                  <tr v-if="gageData?.latitude" class="rowEven">
                    <td class="dataName td1">Latitude:</td>
                    <td class="dataText td2">{{ gageData?.latitude }}</td>
                  </tr>
                  <tr v-if="gageData?.longitude" class="rowOdd">
                    <td class="dataName td1">Longitude:</td>
                    <td class="dataText td2">{{ gageData?.longitude }}</td>
                  </tr>
                  <tr v-if="gageData?.altitude" class="rowEven">
                    <td class="dataName td1">Altitude:</td>
                    <td class="dataText td2">{{ gageData?.altitude }}</td>
                  </tr>
                </tbody>
              </table>

              <br clear="all" />
              <br clear="all" />
              <br clear="all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="waitgif" v-if="isLoading">
    <img src="@/assets/styles/img/wait.gif" />
  </div>

</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useGageStore } from "~/stores/calibration/GageStore";
import { generalStore } from "~/stores/common/GeneralStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";
import FileUploadDialog from "../Common/FileUploadDialog.vue";

const gageStore = useGageStore()
const { gageData, selectedDomainValue, gageStore_data_loading, selectedForcingValue, selectedGageValue, getGageOptionsList, selectedObservationalValue, selectedGeopackageValue, getGeopackageOptionsList, getDomainOptionsList, getForcingOptionsList, getObservationalOptionsList } = storeToRefs(gageStore)
const { loadGageTabStaticData, fetchSelectedGageData, saveGageTabData, resetUserSelectionGage, saveUserForcingFiles, saveUserObservationalFile, saveUserGeopackageFile } = gageStore
const { getCalibrationTabIndex } = generalStore()
const { calibrationJobId } = storeToRefs(generalStore())
const { fetchUserCalibrationRunData } = useUserDataStore()
const toast = useToast()

const isLoading = ref(false);

onMounted(() => {
  toast.removeAllGroups();
})

const dialog = useDialog();
const fileUploadDialogOpened = ref<boolean>(false);

const onGageSelectionChange = () => {
  fetchSelectedGageData()
}

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
 * event bus for calibration button group click
 */
useListen('calibrationButtonSaveStart', (actionButton) => {
  if (getCalibrationTabIndex() == 2 && actionButton == 'SAVE') {
    toast.removeAllGroups()
    const save_tab_response = saveGageTabData()

    save_tab_response.then((response) => {
      if (response?.validation_errors) {
        useApiErrorResponseValidator(response?.validation_errors).forEach((message: String) => {
          toast.add({ severity: "error", summary: 'Error Saving Gage Tab Data', detail: message })
        })
      } else {
        toast.add({ severity: 'info', summary: 'Gage Tab Data Saved', detail: response?.message, life: 3000 })
        fetchUserCalibrationRunData()
      }
    })
  }
})

useListen('calibrationButtonResetCancel', (actionButton) => {
  if (getCalibrationTabIndex() == 2 && actionButton == 'RESET') {
    resetUserSelectionGage()
  }
})

useListen('calibrationButtonNext', (actionButton) => {  
  if ( getCalibrationTabIndex() == 2 && actionButton === "NEXT") {
    if (!selectedDomainValue.value) {
      toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "A Domain is required.", life: 3000 })
    }
    if (!!selectedGageValue.value) {
      toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "A Gage is required.", life: 3000 })
    }
    if (!selectedDomainValue.value || !selectedGageValue.value) {
      setTimeout(() => gotoNext(), 3000);
      return;
    }
    gotoNext();
  }
})

const gotoNext = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[2];
  e.click();
}

/**
 * follow section waiting further detail to be implemented
 */
const selected_rfc = ref<string>("")

const toggle_isNWMv3 = () => {

}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#GageReport {

  table {
    border: 1px solid #ccc;
    width: auto;
    margin: 6vh auto;

    tr {
      line-height: 27px;

      td {
        padding: 4px 15px;
        cursor: default;
        border-bottom: 1px solid #ccc;
        background-color: $ngwcp_neutral_gray_lt;
      }
      .td1 {
        text-align: right;
        width: 20%;
      }
      .td2 {
        font-weight: 600;
      }
    }
  }

}
</style>
