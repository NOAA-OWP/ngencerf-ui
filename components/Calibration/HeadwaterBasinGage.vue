<template>
  <div id="HeadwaterBasinGage" class="">
    <div id="GageSettings" class="mt-4">
      <div class="grid grid-rows-8 gap-6">

        <div class="row-span-1">

          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-1">
              <div class="col-span-1">
                <label for="Domain">Domain</label><br />
                <Select id="Domain" v-model="selectedDomainValue" :options="getDomainOptionsList" optionLabel="name"
                  optionValue="name" placeholder=" ... " class=""></Select>
              </div>
            </div>

            <div class="col-span-1">
              <label for="Gage">Gage</label><br />
              <Select id="Gage" v-model="selectedGageValue" filter :options="getGageOptionsList" optionLabel="name"
                optionValue="description" placeholder=" ... " :virtualScrollerOptions="{ itemSize: 50 }"
                @change="onGageSelectionChange" class=""></Select>
            </div>

            <div class="col-span-1">&nbsp;</div>
          </div>
        </div>
        <div class="row-span-1">
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-1">
              <label for="Forcing">Forcing Data</label><br />
              <Select id="Forcing" v-model="selectedForcingValue" :options="getForcingOptionsList" optionLabel="name"
                optionValue="name" placeholder=" ... " class="" @change="uploadForcingDlgOpen($event)"></Select>
            </div>

            <div class="col-span-1">
              <label for="Observational">Observational Data</label><br />
              <Select id="Observational" v-model="selectedObservationalValue" :options="getObservationalOptionsList"
                optionLabel="name" optionValue="name" placeholder=" ... " class=""
                @change="uploadObservationalDlgOpen($event)"></Select>
            </div>

            <div class="col-span-1">
              <label for="Geopackage">Geo Package</label><br />
              <Select v-model="selectedGeopackageValue" :options="getGeopackageOptionsList" optionLabel="name"
                optionValue="name" placeholder=" ... " class=""
                @change="uploadGeopackageDlgOpen($event)"></Select>

            </div>
          </div>

        </div>
        <DynamicDialog />

        <div class="row-span-5">
          <div id="GageReport" v-if="gageData" class="text-sm inline ml-0">
            <div id="GrBox" class="mt-5">
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
            </div>
          </div>

        </div>

        <div class="row-span-1 mt-4 ActionButtonsBox">
          <div class="grid grid-cols-8">
            <span>
              <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
                <button class="font-normal" title="Save" aria-label="Save Button" @click="saveTabData()">
                  Save
                </button>
              </div>
            </span>
            <span v-if="isCalibrationJobStatusSavedOrReady(calibrationStatus)">
              <div class="col-span-1 mr-3">
                <!--<button class="c-blue font-normal text-xl underline pt-1" title="Reset Button" @click="resetTabData()"
                  aria-label="Reset Button">Reset</button>-->
              </div>
            </span>
            <span v-else>
              <div class="col-span-1 mr-3">&nbsp;</div>
            </span>
            <div class="col-span-4">&nbsp;</div>
            <div class="col-span-1">&nbsp;</div>
            <div class="col-span-1 mr-4">
              <div><button class="ngenButtonDiv ml-6 font-normal h-8" title="Next" aria-label="Next"
                  @click="goNextTab()">Next</button></div>
            </div>
          </div>
        </div>

      </div>

    </div>


    <div class="waitgif" v-if="isLoading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>

</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import type { UserCalibrationRunData } from "~/composables/NextGenModel";
import { onMounted, onUnmounted } from "vue";
import { useGageStore } from "~/stores/calibration/GageStore";
import { generalStore } from "~/stores/common/GeneralStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";
import FileUploadDialog from "../Common/FileUploadDialog.vue";
import type { SelectChangeEvent } from "primevue/select";
import { isCalibrationJobStatusSavedOrReady } from "~/utils/CommonHelpers";
import { useRunStatusStore } from "~/stores/calibration/RunStatusStore";
const runStatusStore = useRunStatusStore();
const { calibrationStatus } = storeToRefs(runStatusStore);
const userDataStore = useUserDataStore();
const { userCalibrationRunData } = storeToRefs(userDataStore);

const { gageData, selectedDomainValue, selectedForcingValue, selectedGageValue, getGageOptionsList,
  selectedObservationalValue, selectedGeopackageValue, getGeopackageOptionsList, getDomainOptionsList, getForcingOptionsList,
  getObservationalOptionsList } = storeToRefs(useGageStore());
const { fetchSelectedGageData, saveGageTabData, resetUserSelectionGage, saveUserForcingFiles,
  saveUserObservationalFile, saveUserGeopackageFile } = useGageStore();
const { getCalibrationTabIndex } = generalStore();
const { calibrationJobId } = storeToRefs(generalStore());
const { fetchUserCalibrationRunData } = useUserDataStore();
const toast = useToast();

const isLoading = ref(true);

onMounted(() => {
  toast.removeAllGroups();
  isLoading.value = false;

  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

})

const dialog = useDialog();
const fileUploadDialogOpened = ref<boolean>(false);

const onGageSelectionChange = () => {
  fetchSelectedGageData()
}

const uploadForcingDlgOpen = (e: SelectChangeEvent) => {
  if (e && e.value === 'User Upload') {
    showForcingFileUploadDialog('Forcing Files')
  }
}

const showForcingFileUploadDialog = (headerText: string) => {
  if (!fileUploadDialogOpened.value) {
    dialog.open(FileUploadDialog, {
      props: {
        header: `Upload ${headerText}`,
        style: {
          width: 'auto',
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
  if ( opt && opt.data ) {
    if ( opt.data.saveFileResponseResult.status == 200 ) {
      toast.add({ severity: 'info', summary: `File upload Completed`, detail: opt.data.saveFileResponseResult._data.message, life: 5000 })
    } else {
      useApiErrorResponsePreprocess( opt.data.saveFileResponseResult ).forEach( message => {
        toast.add({ severity: useApiResponseToastSeverityCode( opt.data.saveFileResponseResult?.status ), summary: 'Save Gage Tab Data Failed.', detail: message, life: 10000 });
      });
    }    
  } else {
    toast.add({ severity: 'error', summary: `File upload Error`, detail: "There is an error when trying to upload selected file(s).", life: 10000 })
  }
  fileUploadDialogOpened.value = false
}

const uploadObservationalDlgOpen = (e: SelectChangeEvent) => {
  if (e && e.value === 'User Upload') {
    showObservationalFileUploadDialog('Observational File')
  }
}

const showObservationalFileUploadDialog = (headerText: string) => {
  if (!fileUploadDialogOpened.value) {
    dialog.open(FileUploadDialog, {
      props: {
        header: `Upload ${headerText}`,
        style: {
          width: 'auto',
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

const uploadGeopackageDlgOpen = (e: SelectChangeEvent) => {
  if (e && e.value === 'User Upload') {
    showGeopackageFileUploadDialog('Geopackage File')
  }
}

const showGeopackageFileUploadDialog = (headerText: string) => {
  if (!fileUploadDialogOpened.value) {
    dialog.open(FileUploadDialog, {
      props: {
        header: `Upload ${headerText}`,
        style: {
          width: 'auto',
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
    fileUploadDialogOpened.value = true;
  }
}

const gotoNext = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_formulation];
  e.click();
}

/**
 * follow section waiting further detail to be implemented
 */
const selected_rfc = ref<string>("");

const toggle_isNWMv3 = () => {

};

const saveTabData = () => {
  if (!isCalibrationJobStatusSavedOrReady(calibrationStatus.value)) {
    toast.add({ severity: 'warn', summary: 'Unable to Save', detail: 'Update of a job already run is not allowed. Please clone to make any changes for a new calibration' });
  } else {
    toast.removeAllGroups();
    saveGageTabData().then( response => {
      if ( response.status == 200 ) {
        toast.add({ severity: 'info', summary: 'Gage Tab Data Saved', detail: response?._data?.message});
        fetchUserCalibrationRunData();
      } else {
        useApiErrorResponsePreprocess( response ).forEach( message => {
          toast.add({ severity: useApiResponseToastSeverityCode( response?.status ), summary: 'Save Gage Tab Data Failed.', detail: message });
        });
      }
    });
  }
};

const resetTabData = () => {
  resetUserSelectionGage();
};

const goNextTab = () => {
  // let err = false;
  // let txt = "Please correct the following:";
  // if (!selectedDomainValue.value) {
  //   txt += "\nA Domain is required.";
  //   err = true;
  // }
  // if (!selectedGageValue.value) {
  //   txt += "\nA Gage is required."
  //   err = true;
  // }
  // if (!userCalibrationRunData?.value?.external_data_status?.forcing) {
  //   txt += "\nForcing files missing"
  //   err = true;
  // }
  // if (!userCalibrationRunData?.value?.external_data_status?.observational) {
  //   txt += "\nGeopackage file is missing"
  //   err = true;
  // }
  // if (!userCalibrationRunData?.value?.external_data_status?.geopackage) {
  //   txt += "\nGeopackage file is missing"
  //   err = true;
  // }
  // if(err) {
  //   toast.add({ severity: 'warn', summary: "Tab data is incomplete", detail: txt, life:5000 });
  //   return;
  // }
  gotoNext();
};


</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#GageReport {
  table {
    border: 1px solid #ccc;
    width: auto;
    margin: 0 auto;

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

#HBCbuttons {
  height: 54px;
  width: 100%;
}
</style>
