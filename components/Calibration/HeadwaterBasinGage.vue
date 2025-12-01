<template>
  <div id="HeadwaterBasinGage" class="">
    <div id="GageSettings" class="mt-4">
      <div class="grid grid-rows-6 gap-6">

        <div class="row-span-1">
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-1">
              <div class="col-span-1">
                <label for="Domain">Domain</label><br />
                <Select id="Domain" v-model="selectedDomainValue" :options="getDomainOptionsList" optionLabel="name"
                  optionValue="name" placeholder=" ... " aria-label="Domain Select" title="Domain Select"
                  @change="onDomainSelectionChange"
                  :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></Select>
              </div>
            </div>

            <div class="col-span-1">
              <label for="Gage" @focus="focusSelectInput">Gage</label><br />
              <Select id="Gage" v-model="selectedGageValue" filter :options="getGageOptionsList" optionLabel="name"
                optionValue="description" placeholder=" ... " :virtualScrollerOptions="{ itemSize: 50 }"
                @change="onGageSelectionChange" @focus="focusSelectInput" aria-label="Gage Select" title="Gage Select"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></Select>
            </div>

            <div class="col-span-1">&nbsp;</div>
          </div>
        </div>
        <div class="row-span-1">
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-1">
              <label for="Forcing">Forcing Source</label><br />
              <Select id="Forcing" v-model="selectedForcingValue" :options="getForcingOptionsList" optionLabel="name"
                optionValue="name" class="user-select" @change="uploadForcingDlgOpen($event)"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                aria-label="Forcing Source Select" title="Forcing Source Select"></Select>
            </div>

            <div class="col-span-1">
              <label for="Observational">Observational Data</label><br />
              <Select id="Observational" v-model="selectedObservationalValue" :options="getObservationalOptionsList"
                optionLabel="name" optionValue="name" class="user-select" @change="uploadObservationalDlgOpen($event)"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                aria-label="Observational Data Select" title="Observational Data Select"></Select>
            </div>

            <div class="col-span-1">
              <label for="Geopackage">GeoPackage</label><br />
              <Select v-model="selectedGeopackageValue" :options="getGeopackageOptionsList" optionLabel="name"
                optionValue="name" class="user-select" @change="uploadGeopackageDlgOpen($event)"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                aria-label="GeoPackage Data Select" title="GeoPackage Data Select"></Select>
            </div>
          </div>

        </div>
        <DynamicDialog />

        <div class="row-span-3">
          <div id="GageReport" v-if="gageData?.gage_id" class="text-sm inline ml-0">
            <div id="GrBox" class="mt-5">
              <table class="table-auto">
                <caption><span style="font-size:1.2em;font-weight: bold;">Gage Detail</span></caption>
                <tbody>
                  <tr v-if="selectedDomainValue" class="rowOdd" :aria-label="'Domain: ' + selectedDomainValue"
                    :title="'Domain: ' + selectedDomainValue">
                    <th scope="row" class="dataName td1">Domain:</th>
                    <td class="dataText td2">{{ selectedDomainValue }}</td>
                  </tr>
                  <tr v-if="gageData?.gage_id" lass="rowEven" :aria-label="'Gage ID: ' + gageData?.gage_id"
                    :title="'>Gage ID: ' + gageData?.gage_id">
                    <th scope="row" class="dataName td1">Gage ID:</th>
                    <td class="dataText td2">{{ gageData?.gage_id }}</td>
                  </tr>
                  <tr v-if="gageData?.agency" class="rowOdd" :aria-label="'Agency: ' + gageData?.agency"
                    :title="'Agency: ' + gageData?.agency">
                    <th scope="row" class="dataName td1">Agency:</th>
                    <td class="dataText td2">{{ gageData?.agency }}</td>
                  </tr>
                  <tr v-if="gageData?.station_name" class="rowEven"
                    :aria-label="'Station Name: ' + gageData?.station_name"
                    :title="'Station Name: ' + gageData?.station_name">
                    <th scope="row" class="dataName td1">Station Name:</th>
                    <td class="dataText td2">{{ gageData?.station_name }}</td>
                  </tr>
                  <tr v-if="gageData?.latitude" class="rowEven" :aria-label="'Latitude: ' + gageData?.latitude"
                    :title="'Latitude: ' + gageData?.latitude">
                    <th scope="row" class="dataName td1">Latitude:</th>
                    <td class="dataText td2">{{ gageData?.latitude }}</td>
                  </tr>
                  <tr v-if="gageData?.longitude" class="rowOdd" :aria-label="'Longitude: ' + gageData?.longitude"
                    :title="'Longitude: ' + gageData?.longitude">
                    <th scope="row" class="dataName td1">Longitude:</th>
                    <td class="dataText td2">{{ gageData?.longitude }}</td>
                  </tr>
                  <tr v-if="gageData?.altitude" class="rowEven" :aria-label="'Altitude: ' + gageData?.altitude"
                    :title="'Altitude: ' + gageData?.altitude">
                    <th scope="row" class="dataName td1">Altitude:</th>
                    <td class="dataText td2">{{ gageData?.altitude }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div class="row-span-1 mt-4 ActionButtonsBox z-9999">
          <div class="grid grid-cols-8">
            <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
              <div class="col-span-1 mr-6 h-8" @click="saveTabData()">
                <Button id="HBGSaveButton" class="font-normal ngenButtonDiv-green " title="Save"
                  aria-label="Save Button">
                  Save
                </Button>
              </div>
            </span>
            <span v-else>
              <div class="col-span-1 mr-6 h-8 whitespace-nowrap">
                Run on {{ formatDateForRunOnString(submitTimeDate as Date) }}
              </div>
            </span>
            <span v-if="(gageHasChanged && userCalibrationRunData?.gage !== null) || gageDataSourceHasChanged">
              <div class="col-span-1 mr-3">
                <Button class="ngenButtonDiv-yellow" title="Revert All Changes"
                  @click="gageSelectionReset()" aria-label="Revert All Changes">Revert</Button>
              </div>
            </span>
            <span v-else>
              <div class="ngenButtonDiv-yellow-spacer col-span-1 mr-3">
                &nbsp;
              </div>
            </span>
            <div class="col-span-4">&nbsp;</div>
            <div class="col-span-1">&nbsp;</div>
            <div class="col-span-1 mr-4">
              <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next" aria-label="Next"
                @click="goNextTab()">Next</Button>
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
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";

import type { SelectChangeEvent } from "primevue/select";
import type { ToastMessageOptions } from "primevue/toast";
import type { GageResetData } from "@/composables/NgencerfModels"
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { useGageStore } from "@/stores/calibration/GageStore";
import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";

import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";
import FileUploadDialog from "../Common/FileUploadDialog.vue";

import { isCalibrationJobStatusSavedOrReady } from "@/utils/CommonHelpers";
import { formatDateForRunOnString } from "@/utils/TimeHelpers";
import { hilightTab } from '@/composables/TabHilight';
import {
  useProcessCalibrationGageSavedResponse, useApiErrorResponsePreprocess,
  useApiResponseToastSeverityCode, useApiResponseToastSeverityLife
} from "@/composables/ValidationHandlers";

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const { hardResetTuningTimeConrols } = useTuningStore();

const userDataStore = useUserDataStore();
const { userCalibrationRunData } = storeToRefs(userDataStore);

const { gageData, gageTabData, getSavedDomainValue, selectedDomainValue, selectedForcingValue, selectedGageValue, getGageOptionsList,
  selectedObservationalValue, selectedGeopackageValue, getGeopackageOptionsList, getDomainOptionsList, getForcingOptionsList,
  getObservationalOptionsList, gagePayload } = storeToRefs(useGageStore());

const { loadGageTabStaticData, fetchSelectedGageData, saveGageTabData, resetUserSelectionGage, 
  saveUserForcingFiles, saveUserObservationalFile, saveUserGeopackageFile } = useGageStore();
const { calibrationJobId, gageHasChanged, gageDataSourceHasChanged } = storeToRefs(generalStore());
const { submitTimeDate } = storeToRefs(useRunStatusStore());
const toast = useToast();
const dialog = useDialog();
const fileUploadDialogOpened = ref<boolean>(false);
const nextPrevDialogOpened = ref<boolean>(false);

const resetData = ref<GageResetData>({
  external_data_status: {
    observational: false,
    forcing: false,
    geopackage: false,
  },
  geopackage_source: "",
  observational_source: "",
  forcing_source_requested: "",
  geopackage_image_url: ""
})

const setResetDataValues = () => {
  if (userCalibrationRunData.value) {
    // Save all information from the external data JSON.parse(JSON.stringify(obj));
    resetData.value.external_data_status = JSON.parse(JSON.stringify(userCalibrationRunData.value.external_data_status));
    resetData.value.forcing_source_requested = userCalibrationRunData.value.forcing_source_requested ? userCalibrationRunData.value.forcing_source_requested : (getForcingOptionsList.value ? getForcingOptionsList.value[0].name : '');
    resetData.value.observational_source = userCalibrationRunData.value.observational_source ? userCalibrationRunData.value.observational_source : (getObservationalOptionsList.value ? getObservationalOptionsList.value[0].name : '');
    resetData.value.geopackage_source = userCalibrationRunData.value.geopackage_source ? userCalibrationRunData.value.geopackage_source : (getGeopackageOptionsList.value ? getGeopackageOptionsList.value[0].name : '');
    resetData.value.geopackage_image_url = userCalibrationRunData.value.geopackage_image_url;
  }
}

onMounted(async() => {
  if (!gageTabData.value) {
    await loadGageTabStaticData();
  }
  nextTick(() => {
    hilightTab(CalibrationTabs.tab_headwaterBasinGage);
    toast.removeAllGroups();
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); }
    setResetDataValues();
    if (gageHasChanged.value && userCalibrationRunData?.value?.gage?.gage_id) {
      gageSelectionReset();
    } else {
      selectedForcingValue.value = resetData.value.forcing_source_requested;
      selectedObservationalValue.value = resetData.value.observational_source;
      selectedGeopackageValue.value = resetData.value.geopackage_source;
    }
    gageDataSourceHasChanged.value = false;
    isLoading.value = false;
  });
})

const onDomainSelectionChange = () => {
  gageDataSourceHasChanged.value = true;
}

const onGageSelectionChange = () => {
  // Was there a previous gage?
  gageDataSourceHasChanged.value = true;
  if (userCalibrationRunData?.value?.gage) {
    gageHasChanged.value = true;
    setResetDataValues();

    if (userCalibrationRunData?.value?.external_data_status) {
      userCalibrationRunData.value.external_data_status.forcing = false;
      userCalibrationRunData.value.external_data_status.geopackage = false;
      userCalibrationRunData.value.external_data_status.observational = false;
    }
    nextTick(() => {
      const gage = document.getElementById('Gage');
      (gage?.childNodes[0] as HTMLInputElement).innerText = selectedGageValue.value;
      document.getElementById("HBGSaveButton")?.focus();
    });
  }
  fetchSelectedGageData();
}

/**
 * Resets the Gage to the previous gage if it was changed and not saved.
 */
const gageSelectionReset = () => {
  selectedDomainValue.value = getSavedDomainValue.value ?? '';
  selectedGageValue.value = userCalibrationRunData?.value?.gage?.gage_id ? userCalibrationRunData.value.gage.gage_id : '';
  fetchSelectedGageData();
  gageHasChanged.value = false;
  gageDataSourceHasChanged.value = false;
  const optList = getGageOptionsList;
  const gage = document.getElementById('Gage');
  if (selectedGageValue.value) {
    const index = optList.value.findIndex(item => item.name === selectedGageValue.value);
    if (index >= 0) {
      selectedGageValue.value = optList.value[index].name;
    (gage?.childNodes[0] as HTMLInputElement).innerText = selectedGageValue.value;
    } else {
      selectedGageValue.value = '';
      (gage?.childNodes[0] as HTMLInputElement).innerText = ' ... ';
    }
  } else {
    selectedGageValue.value = '';
    (gage?.childNodes[0] as HTMLInputElement).innerText = ' ... ';
  }

  if (userCalibrationRunData.value) {
    userCalibrationRunData.value.external_data_status = JSON.parse(JSON.stringify(resetData.value.external_data_status))
    userCalibrationRunData.value.geopackage_source = resetData.value.geopackage_source;
    userCalibrationRunData.value.observational_source = resetData.value.observational_source;
    userCalibrationRunData.value.forcing_source_requested = resetData.value.forcing_source_requested;
    userCalibrationRunData.value.geopackage_image_url = resetData.value.geopackage_image_url;
  }
  selectedGeopackageValue.value = resetData.value.geopackage_source;
  selectedObservationalValue.value = resetData.value.observational_source;
  selectedForcingValue.value = resetData.value.forcing_source_requested;
}

const clearDataDueToGageChange = () => {
  // don't do the check for a change here any more - gageHasChanged and gageDataSourceHasChanged are being used earlier on to track changes
  isLoading.value = true;
  setTimeout(() => {
    fetchSelectedGageData();
    hardResetTuningTimeConrols();
    if (userCalibrationRunData.value) {
      userCalibrationRunData.value.calibration_times.calibration_start_time = "";
      userCalibrationRunData.value.calibration_times.calibration_end_time = "";
      userCalibrationRunData.value.calibration_times.simulation_start_time = "";
      userCalibrationRunData.value.calibration_times.simulation_end_time = "";

      userCalibrationRunData.value.validation_times.validation_start_time = "";
      userCalibrationRunData.value.validation_times.validation_end_time = "";
      userCalibrationRunData.value.validation_times.simulation_start_time = "";
      userCalibrationRunData.value.validation_times.simulation_end_time = "";
    }

    const tMsg: ToastMessageOptions = {
      severity: 'info', summary: `Gage or Sources Changed`,
      detail: "Changes made here affect Time Controls. Make sure they are properly set on the Tuning Controls Tab.", 
      life: ToastTimeout.timeoutInfo
    };
    toast.add(tMsg); addToastRecord(tMsg);

  }, 100);
  isLoading.value = false;
}

const uploadForcingDlgOpen = (e: SelectChangeEvent) => {
  gageDataSourceHasChanged.value = true;
  if (e && e.value === 'User Upload') {
    showForcingFileUploadDialog('Forcing Files')
  }
}


/**
 * Force focus on text input area when user clicks on dropdown.
 * @param e Event
 */
const focusSelectInput = (e: any) => {
  setTimeout(() => {
    let eles = document.getElementsByClassName('p-select-filter');
    if (eles.length) {
      (eles[0] as HTMLInputElement).focus();
    }
  }, 150);
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
        if (selectedForcingValue.value !== userCalibrationRunData?.value?.forcing_source_requested) {
          gageDataSourceHasChanged.value = true;
        }
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
      const tMsg: ToastMessageOptions = { severity: 'info', summary: `File upload Completed`, detail: opt.data.saveFileResponseResult._data.message, life: ToastTimeout.timeoutInfo };
      toast.add(tMsg); addToastRecord(tMsg);
    } else {
      useApiErrorResponsePreprocess(opt.data.saveFileResponseResult).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(opt.data.saveFileResponseResult?.status), summary: 'Save Gage Data Failed.', detail: message, life: useApiResponseToastSeverityLife(opt.data.saveFileResponseResult?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: `File upload Error`, detail: "There is an error when trying to upload selected file(s).", life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
  }
  fileUploadDialogOpened.value = false
}

const uploadObservationalDlgOpen = (e: SelectChangeEvent) => {
  gageDataSourceHasChanged.value = true;
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
        if (selectedObservationalValue.value !== userCalibrationRunData?.value?.observational_source) {
          gageDataSourceHasChanged.value = true;
        }
        handleDialogClose(opt)
      },
    })
    fileUploadDialogOpened.value = true
  }
}

const uploadGeopackageDlgOpen = (e: SelectChangeEvent) => {
  // Commenting this out because Geopackage source change doesn't require times to be cleared
  //gageDataSourceHasChanged.value = true;
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
        /* if (selectedGeopackageValue.value !== userCalibrationRunData?.value?.geopackage_source) {
          gageDataSourceHasChanged.value = true;
        } */
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

const saveTabData = async() => {
  isLoading.value = true;
  if (!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to Save', detail: 'Update of a job already run is not allowed. Please clone to make any changes for a new calibration', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  } else {
    toast.removeAllGroups();

    // Check for gage / data source change
    if (gageHasChanged.value || gageDataSourceHasChanged) {
      clearDataDueToGageChange();
      gageHasChanged.value = false;
      gageDataSourceHasChanged.value = false;
      isLoading.value = true;
    }

    await saveGageTabData().then(response => {
      if (response.status === 400) {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Save Gage Data Failed.', detail: response._data.message, life: ToastTimeout.timeoutError};
        toast.add(tMsg); addToastRecord(tMsg);
        isLoading.value = false;
      } else if (response.status === 200) {
        useProcessCalibrationGageSavedResponse(response?._data).forEach((toastMessage: ToastMessageOptions) => {
          toast.add(toastMessage); addToastRecord(toastMessage);
        })
        gageHasChanged.value = false;
        gageDataSourceHasChanged.value = false;
        updateJobData(response);
      } else {
        useApiErrorResponsePreprocess(response).forEach(message => {
          const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Save Gage Data Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
          toast.add(tMsg); addToastRecord(tMsg);
        });
        gageHasChanged.value = false;
        gageDataSourceHasChanged.value = false;
        updateJobData(response);
      }
    });
  }
};

const updateJobData = async (response: any) => {
  if (userCalibrationRunData.value) {
    let newGage = {
      gage_id: gageData.value?.gage_id ?? '',
      agency: gageData.value?.agency ?? '',
      station_name: gageData.value?.station_name ?? '',
      latitude: gageData.value?.latitude ?? 0,
      longitude: gageData.value?.longitude ?? 0,
      altitude: gageData.value?.altitude ?? 0
    }

    userCalibrationRunData.value.gage = newGage;
    userCalibrationRunData.value.forcing_source_requested = response?._data?.forcing_source_requested as string;
    userCalibrationRunData.value.forcing_source_actual = response?._data?.forcing_source_actual as string;
    userCalibrationRunData.value.observational_source = gagePayload.value.observational_source as string;
    userCalibrationRunData.value.geopackage_source = gagePayload.value.geopackage_source as string;
    userCalibrationRunData.value.geopackage_image_url = response?._data?.geopackage_image_url ?? "";

    // Assume EDS status is true if sources are set
    if (userCalibrationRunData.value.forcing_source_actual !== '') {
      userCalibrationRunData.value.external_data_status.forcing = true;
    }
    if (userCalibrationRunData.value.observational_source !== '') {
      userCalibrationRunData.value.external_data_status.observational = true;
    }
    if (userCalibrationRunData.value.geopackage_source !== '') {
      userCalibrationRunData.value.external_data_status.geopackage = true;
    }

    // Now check for EDS errors
    if(response?._data?.eds_errors) {
      response._data.eds_errors.forEach((eds_error: edsError) => {
        if (eds_error.name === 'forcing') {
          userCalibrationRunData.value.forcing_source_actual = '';
          userCalibrationRunData.value.external_data_status.forcing = false;
        }
        else if (eds_error.name === 'observational') {
          userCalibrationRunData.value.observational_source = '';
          userCalibrationRunData.value.external_data_status.observational = false;
        }
        else if (eds_error.name === 'geopackage') {
          userCalibrationRunData.value.geopackage_source = '';
          userCalibrationRunData.value.geopackage_image_url = '';
          userCalibrationRunData.value.external_data_status.geopackage = false;
        }
      })
    }

    userCalibrationRunData.value.num_catchments = response?._data.num_catchments;

    userCalibrationRunData.value.last_updated_on = formatISOStringOrDateToYYYYMMDDHHMM(nowUTC());

    setResetDataValues();
    
    isLoading.value = false;
  }
}

const resetTabData = () => {
  resetUserSelectionGage();
  // reset geopackage_image_url to clear out image
  if (userCalibrationRunData?.value?.geopackage_image_url) {
    userCalibrationRunData.value.geopackage_image_url = "";
  }
};

const validateTab = () => {
  let error = false;
  let text = [];
  if (userCalibrationRunData?.value?.gage === null && selectedGageValue.value ||
    userCalibrationRunData?.value?.gage?.gage_id && (userCalibrationRunData?.value?.gage?.gage_id !== selectedGageValue.value)) {
    error = true;
    text.push("Gage value has been changed");
  }
  if (selectedForcingValue.value != resetData.value.forcing_source_requested) {
    error = true;
    text.push("Forcing Source has been changed");
  }
  if (selectedObservationalValue.value !== resetData.value.observational_source) {
    error = true;
    text.push("Observational Source has been changed");
  }
  if (selectedGeopackageValue.value != resetData.value.geopackage_source) {
    error = true;
    text.push("GeoPackage has been changed");
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
  if (opt.data && opt.data.moveToNextResponse) {
    gageSelectionReset();
    gotoNext();
  }
  if (opt.type && opt.type === 'dialog-close') {
    return;
  }
}

</script>
<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#GageReport {
  table {
    border: 1px solid #ccc;
    width: auto;
    margin: 0 auto;

    tr {
      line-height: 27px;

      th {
        padding: 4px 15px;
        cursor: default;
        border-bottom: 1px solid #ccc;
        background-color: global.$ngwcp_neutral_gray_lt;
      }

      td {
        padding: 4px 15px;
        cursor: default;
        border-bottom: 1px solid #ccc;
        background-color: global.$ngwcp_neutral_gray_lt;
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
