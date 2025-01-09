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
                optionValue="name" class="user-select" defaultValue="AORC"
                @change="uploadForcingDlgOpen($event)"></Select>
            </div>

            <div class="col-span-1">
              <label for="Observational">Observational Data</label><br />
              <Select id="Observational" v-model="selectedObservationalValue" :options="getObservationalOptionsList"
                optionLabel="name" optionValue="name" class="user-select"
                @change="uploadObservationalDlgOpen($event)"></Select>
            </div>

            <div class="col-span-1">
              <label for="Geopackage">Geo Package</label><br />
              <Select v-model="selectedGeopackageValue" :options="getGeopackageOptionsList" optionLabel="name"
                optionValue="name" class="user-select" @change="uploadGeopackageDlgOpen($event)"></Select>

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
            <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
              <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
                <button class="font-normal" title="Save" aria-label="Save Button" @click="saveTabData()">
                  Save
                </button>
              </div>
            </span>
            <span v-else>
              <div class="col-span-1 mr-6 h-8 whitespace-nowrap">
                Run on {{ formatDateForRunOnString(submitTimeDate as Date) }}
              </div>
            </span>
            <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
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
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>

</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import type { ToastMessageOptions } from "primevue/toast";
import { onMounted } from "vue";
import { useGageStore } from "@/stores/calibration/GageStore";
import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";
import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";
import FileUploadDialog from "../Common/FileUploadDialog.vue";
import type { SelectChangeEvent } from "primevue/select";
import { isCalibrationJobStatusSavedOrReady } from "@/utils/CommonHelpers";
import { formatDateForRunOnString } from "@/utils/TimeHelpers";
import { hilightTab } from '@/composables/TabHilight';

import { useProcessCalibrationGageSavedResponse, useApiErrorResponsePreprocess, useApiResponseToastSeverityCode } from "@/composables/ValidationHandlers";

const { hardResetTuningTimeConrols } = useTuningStore();
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
const { submitTimeDate } = storeToRefs(useRunStatusStore());
const toast = useToast();

const isLoading = ref(true);


onMounted(() => {
  nextTick(() => {
    hilightTab(CalibrationTabs.tab_headwaterBasinGage);
    toast.removeAllGroups();
    isLoading.value = false;
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); }
  });
})


const dialog = useDialog();
const fileUploadDialogOpened = ref<boolean>(false);
const nextPrevDialogOpened = ref<boolean>(false);

const onGageSelectionChange = () => {
  // check for an actual change
  if (userCalibrationRunData.value.gage.gage_id !== selectedGageValue.value) {
    fetchSelectedGageData();
    hardResetTuningTimeConrols();
    userCalibrationRunData.value.calibration_times.calibration_start_time = "";
    userCalibrationRunData.value.calibration_times.calibration_end_time = "";
    userCalibrationRunData.value.calibration_times.simulation_start_time = "";
    userCalibrationRunData.value.calibration_times.simulation_end_time = "";

    userCalibrationRunData.value.validation_times.validation_start_time = "";
    userCalibrationRunData.value.validation_times.validation_end_time = "";
    userCalibrationRunData.value.validation_times.simulation_start_time = "";
    userCalibrationRunData.value.validation_times.simulation_end_time = "";

    userCalibrationRunData.value?.external_data_status.observational === false;
    userCalibrationRunData.value?.external_data_status.forcing === false;
    userCalibrationRunData.value?.external_data_status.geopackage === false;

    selectedForcingValue.value = getForcingOptionsList.value[0].name;
    selectedObservationalValue.value = getObservationalOptionsList.value[0].name;
    selectedGeopackageValue.value = getGeopackageOptionsList.value[0].name;
    document.getElementById("OutVar").value = "";
  }
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
  if (opt.type === 'dialog-close' && !opt.data) {
    fileUploadDialogOpened.value = false;
    return;
  }

  if (opt && opt.data) {
    if (opt.data.saveFileResponseResult.status === 200) {
      toast.add({ severity: 'info', summary: `File upload Completed`, detail: opt.data.saveFileResponseResult._data.message, life: 5000 })
    } else {
      useApiErrorResponsePreprocess(opt.data.saveFileResponseResult).forEach(message => {
        toast.add({ severity: useApiResponseToastSeverityCode(opt.data.saveFileResponseResult?.status), summary: 'Save Gage Tab Data Failed.', detail: message, life: 10000 });
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
  if (!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
    toast.add({ severity: 'warn', summary: 'Unable to Save', detail: 'Update of a job already run is not allowed. Please clone to make any changes for a new calibration' });
  } else {
    toast.removeAllGroups();
    saveGageTabData().then(response => {
      if (response.status === 200) {
        useProcessCalibrationGageSavedResponse(response?._data).forEach((toastMessage: ToastMessageOptions) => {
          toast.add(toastMessage);
        })
        fetchUserCalibrationRunData();
      } else {
        useApiErrorResponsePreprocess(response).forEach(message => {
          toast.add({ severity: useApiResponseToastSeverityCode(response?.status), summary: 'Save Gage Tab Data Failed.', detail: message });
        });
      }
    });
  }
};

const resetTabData = () => {
  resetUserSelectionGage();
};

const validateTab = () => {
  let error = false;
  let text = [];
  if (userCalibrationRunData?.value?.gage === null && selectedGageValue.value ||
    userCalibrationRunData?.value?.gage?.gage_id && (userCalibrationRunData?.value?.gage?.gage_id !== selectedGageValue.value)) {
    error = true;
    text.push("Gage value has been changed");
  }
  return { error: error, text: text }
}

const goNextTab = () => {
  const errors = validateTab();
  if (errors.error) {
    showPrevNextDialog(errors.text, true);
  } else {
    gotoNext();
  }

};

const showPrevNextDialog = (body: string[], next: boolean) => {
  if (!nextPrevDialogOpened.value) {
    dialog.open(MoveNextPrevDialog, {
      props: {
        header: "Unsaved changes!",
        style: {
          width: 'auto',
        },
        modal: true,
      },
      data: {
        body: body,
        direction: next
      },
      onClose: (opt) => {
        nextPrevDialogOpened.value = false;
        handleNextPrevDialogClose(opt);
      },
    })
    nextPrevDialogOpened.value = true
  }
}

const handleNextPrevDialogClose = (opt: any) => {
  if (opt.data.moveToNextResponse) {
    selectedGageValue.value = userCalibrationRunData?.value?.gage?.gage_id ? userCalibrationRunData.value.gage.gage_id : '';
    gotoNext();
  }
}

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
