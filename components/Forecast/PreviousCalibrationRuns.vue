<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <client-only>
    <div class="pr-2">
      <div class="flex mt-2">
        <div class="w-full">
          <h1 class="pt-3 mb-8 text-3xl font-bold text-center">
            Calibration Runs<br />
            <span style="font-size: 12px;font-weight: normal;">
              Select a job then right click for available actions.
            </span>
          </h1>
        </div>
      </div>

      <div id="calibrationRunsForForecastList">
        <div id="CalTable" class="w-max mx-auto">
          <JobFilterDialog id="JobFilterDialog" :disable-all="false" 
            :show-status="false" :show-modules="false" :show-archived="false"
            :totalSize="calibrationRunsForForecastListTotalSize" :totalPages="calibrationRunsForForecastListTotalPages"
            v-model:currentPage="calibrationRunsForForecastListCurrentPage"
            @RefreshJobList="refreshJobList()" @ResetFilters="resetFilters()" ref="jobFilterDialog" />

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
            :model="cmCalibrationRun"></ContextMenu>
          
          <div v-if="calibrationRunsForForecast.length > 0 && calibrationRunsForForecastListTotalSize > 0" class="pagination-box">
            <div class="pagination-rows">
              Rows {{ calibrationRunsForForecastListStartRow }} to {{ calibrationRunsForForecastListEndRow }} of {{ calibrationRunsForForecastListTotalSize }}
            </div>
            <Paging v-model:currentPage="calibrationRunsForForecastListCurrentPage" :totalPages=calibrationRunsForForecastListTotalPages />
          </div>
          <div v-else>
            No results. Try changing or clearing filters.
          </div>

          <DataTable id="CalibrationRunForForecastTable" :value="calibrationRunsForForecast" 
            scrollable scroll-height="400px" table-style="min-width: 50rem"
            v-model:sortField="calibrationRunsForForecastListSort.field" v-model:sortOrder="calibrationRunsForForecastListSort.direction"
            v-model:selection="calibrationRunForForecast" selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onCalibrationRunForForecastRowSelect" @rowUnselect="onCalibrationRunForForecastRowUnSelect"
            @rowContextmenu="onRowContextMenu" class="boxed">
            <Column :pt="ptColumn" field="calibration_run_id" header="Job ID" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.calibration_run_id"
                  :aria-label="'Job ID ' + slotProps.data.calibration_run_id"
                  :title="'Job ID ' + slotProps.data.calibration_run_id">
                  {{ slotProps.data.calibration_run_id }}
                  <span v-if="slotProps.data.is_locked" class="pi pi-lock"></span>
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="gage_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Headwater</span><br /><span>Basin Gage</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.gage_id" :aria-label="'Headwater Basin Gage ' + slotProps.data.gage_id"
                  :title="'Headwater Basin Gage ' + slotProps.data.gage_id">
                  {{ slotProps.data.gage_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="domain_name" sortable>
              <template #header>
                <div class="column-header">
                  <span>Domain</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.domain_name" :aria-label="'Domain ' + slotProps.data.domain_name"
                  :title="'Domain ' + slotProps.data.domain_name">
                  {{ slotProps.data.domain_name }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="formulation_name" sortable>
              <template #header>
                <div class="column-header">
                  <span>Formulation Name</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.formulation_name"
                  :aria-label="'Formulation Name ' + slotProps.data.formulation_name"
                  :title="'Formulation Name ' + slotProps.data.formulation_name">
                  {{ slotProps.data.formulation_name }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="stop_criteria" sortable>
              <template #header>
                <div class="column-header">
                  <span>Stop Criteria<br/>(Iterations)</span>
                </div>
              </template>
              <template #body="slotProps">
                <span :aria-label="'Stop Crtieria ' + slotProps.data.stop_criteria"
                  :title="'Stop Crtieria ' + slotProps.data.stop_criteria">
                  {{ slotProps.data.stop_criteria > 0 ? slotProps.data.stop_criteria : 'N/A' }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="created_at" sortable>
              <template #header>
                <div class="column-header">
                  <span>Creation Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <span :aria-label="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                  :title="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                  class="whitespace-nowrap">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at) }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="last_updated_on" sortable>
              <template #header>
                <div class="column-header">
                  <span>Last Updated</span>
                </div>
              </template>
              <template #body="slotProps">
                <span :aria-label="'Last Updated ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.last_updated_on)"
                  :title="'Last Updated ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.last_updated_on)"
                  class="whitespace-nowrap">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.last_updated_on) }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="submit_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Submit Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <span :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                  :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="objective_function" sortable>
              <template #header>
                <div class="column-header">
                  <span>Objective</span><br /><span>Function</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.objective_function"
                  :aria-label="'Objective Function ' + slotProps.data.objective_function"
                  :title="'Objective Function ' + slotProps.data.objective_function">
                  {{ slotProps.data.objective_function }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="optimization_algorithm" sortable>
              <template #header>
                <div class="column-header">
                  <span>Optimization</span><br /><span>Algorithm</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.optimization_algorithm"
                  :aria-label="'Optimization Algorithm ' + slotProps.data.optimization_algorithm"
                  :title="'Optimization Algorithm ' + slotProps.data.optimization_algorithm">
                  {{ slotProps.data.optimization_algorithm }}
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

import type { DataTableRowClickEvent } from 'primevue/datatable';
import type { ToastMessageOptions } from "primevue/toast";
import type { CalibrationRunForForecast, DataTableContextMenuOption } from "@/composables/NgencerfModels";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "~/stores/common/GeneralStore";

import MessagesGroup from "@/components/Common/MessagesGroup.vue";
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"
import Paging from "../Common/Paging.vue";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';
import { ForecastTabs } from "@/composables/NgencerfEnums";

const { deleteCalibrationRun, archiveCalibrationRun, exportJob, getCalibrationJobZip } = useCalibrationJobStore();

const { addToastRecord } = generalStore();

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();
const showMessagesGroup = ref<boolean>(false);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const forecastStore = useForecastStore();
const { 
  forecastJobId,
  calibrationRunsForForecastListPageSize,
  calibrationRunsForForecastListCurrentPage,
  calibrationRunsForForecastListTotalPages,
  calibrationRunsForForecastListTotalSize,
  calibrationRunsForForecastListStartRow,
  calibrationRunsForForecastListEndRow,
  calibrationRunsForForecastListSort 
} = storeToRefs(forecastStore);
const { 
  getCalibrationJobsForForecast, 
  resetUserSelectedForecastCalibrationRun, 
  hardResetForecastRunStatusStore,
  resetFilters
} = forecastStore;


const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

//this model is for highlighting purpose
const selectedCalibrationRun = ref<CalibrationRunForForecast>();

const { isLoading } = storeToRefs(generalStore());
const { calibrationDownloadJobID, calibrationDownloadFileName } = storeToRefs(useCalibrationJobStore());

const cmCalibrationRun = ref<DataTableContextMenuOption[]>([]);
const onRowContextMenu = (event: any) => {
  cmCalibrationRun.value = [];
  const crRowData = event.data as CalibrationRunForForecast;
  if (calibrationRunForForecast && calibrationRunForForecast.value?.calibration_run_id === crRowData.calibration_run_id) {
    crContextMenu.value.show(event.originalEvent);
    //forecastJobId.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
    setSelectedCalibrationRunId(parseInt(event.originalEvent.currentTarget.children[0].textContent));
    cmCalibrationRun.value.push({ label: 'Run New Forecast', icon: 'pi pi-chevron-circle-right', command: () => navigateToSetupForecast() });
    cmCalibrationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-list', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
    if (calibrationRunForForecast.value?.is_downloadable) {
      cmCalibrationRun.value.push({ label: 'Download Results', icon: 'pi pi-download', command: () => downloadSelectedCalibrationData() });
    }
    cmCalibrationRun.value.push({ label: 'Export Calibration Config', icon: 'pi pi-file-export', command: () => exportSelectedCalibrationData() });
    if (!calibrationRunForForecast?.value?.status.includes('Submitted') && !calibrationRunForForecast?.value?.status.includes('Running') && !calibrationRunForForecast?.value?.is_locked) {
      cmCalibrationRun.value.push({ label: 'Delete', icon: 'pi pi-trash', command: () => deleteSelectedCalibrationRun() });
    }
    if (!calibrationRunForForecast?.value?.status.includes('Submitted') && !calibrationRunForForecast?.value?.status.includes('Running') && !calibrationRunForForecast.value?.is_archived) {
      cmCalibrationRun.value.push({ label: 'Archive', icon: 'pi pi-folder', command: () => archiveSelectedCalibrationRun(true) });
    }
  }
};

const {
  loadCalibrationDataComplete,
  userSelectedEvalCalibrationRunId,
} = storeToRefs(evaluationCalibrationRunStore);

const {
  fetchUserSelectedCalibrationValidationRunList,
  loadSelectedCalibrationRun,
  resetUserSelectedEvalCalibrationRun,
  resetUserSelectedEvalValidationRun,
  fetchUserValidatedCalibrationJobsListData,
} = evaluationCalibrationRunStore;

const { userCalibrationRunData } = storeToRefs(useUserDataStore());

const { calibrationRunsForForecast, calibrationRunForForecast, forecastRunGageList } = storeToRefs(useForecastStore());

const { setSelectedCalibrationRunId, resetSelectedCalibrationRunId } = useForecastStore();

onMounted(async () => {
  isLoading.value = true;
  forecastJobId.value = undefined;
  calibrationRunsForForecastListCurrentPage.value = 1;

  //reset Run/Status store in case we have running intervals
  hardResetForecastRunStatusStore();

  hilightTab(ForecastTabs.tab_calibrationRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    resetSelectedCalibrationRunId();
    //clear calibration data if user were on calibration tab and clear evaluation previous run data user may have selected
    resetUserSelectedEvalCalibrationRun();
    resetUserSelectedForecastCalibrationRun();
    await getCalibrationJobsForForecast();
    isLoading.value = false;
  });
});

// watch for sort order change - reset current page to 1
watch(calibrationRunsForForecastListSort, () => {
  calibrationRunsForForecastListCurrentPage.value = 1;
  refreshJobList();
},{ deep: true });

// Watch for page number changes in job list
watch(calibrationRunsForForecastListCurrentPage, () => {
  if (isNaN(calibrationRunsForForecastListCurrentPage.value) || calibrationRunsForForecastListCurrentPage.value < 1 || calibrationRunsForForecastListCurrentPage.value > Math.ceil(calibrationRunsForForecastListTotalSize.value / calibrationRunsForForecastListPageSize.value)) {
    console.log('ERROR: Page number ' + calibrationRunsForForecastListCurrentPage.value + ' out of bounds');
  } else {
    refreshJobList();
  }
});

const refreshJobList = async () => {
  isLoading.value = true;
  await getCalibrationJobsForForecast();
  isLoading.value = false;
}

const viewCalibrationDetails = async (calibration_run_id: number) => {
  isLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const onCalibrationRunForForecastRowSelect = async (event: any) => {
  //isLoading.value = true;
  const rowData = event.data as CalibrationRunForForecast;
  setSelectedCalibrationRunId(rowData.calibration_run_id);
  //forecastJobId.value = rowData.calibration_run_id;
  //await loadSelectedCalibrationRun(forecastJobId.value as number);
  //await fetchUserSelectedCalibrationValidationRunList();
  //isLoading.value = false;
}

const onCalibrationRunForForecastRowUnSelect = async (event: DataTableRowClickEvent) => {
  //forecastJobId.value = 0;
  resetSelectedCalibrationRunId();
}

watch(() => userCalibrationRunData.value, (updatedRunData, initialRunData) => {
  if (updatedRunData !== undefined && Object.keys(updatedRunData).length > 0) {
    nextTick(() => {
      isLoading.value = false;
      loadCalibrationDataComplete.value = true;
    });
  }
});

const openSelectedCalibrationRun = async () => {
  isLoading.value = true;
  resetUserSelectedEvalValidationRun();
  await loadSelectedCalibrationRun(calibrationRunForForecast.value?.calibration_run_id as number);
  await fetchUserSelectedCalibrationValidationRunList();
  navigateToSetupForecast();
  isLoading.value = false;
};

const navigateToSetupForecast = async () => {
  if (calibrationRunForForecast?.value?.calibration_run_id && calibrationRunForForecast.value.calibration_run_id > 0) {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Setup Forecast Tab"]');
    if (e) {
      await loadSelectedCalibrationRun(calibrationRunForForecast.value?.calibration_run_id as number);
      e.click();
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Setup Forecast Tab not found', life: ToastTimeout.timeoutError};
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Calibration Job', detail: 'Please select a calibration job first.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'white' }
  }
}

const confirmDelete = useConfirm();

const deleteSelectedCalibrationRun = () => {
  const selectedRunId = calibrationRunForForecast.value?.calibration_run_id as number;
  let confirmMessage = "Are you sure you want to delete this run?"
  confirmDelete.require({
    message: confirmMessage,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'DELETE RUN',
    },
    accept: () => acceptDelete(selectedRunId),
    reject: () => {
      //do nothing
    }
  })
};

const acceptDelete = (selectedRunId: number) => {
  deleteCalibrationRun(selectedRunId).then(response => {
    if (response.status === 200) {
      let successMessages: string[] = [];
      let failureMessages: string[] = [];
      response._data?.jobs.forEach(job => {
        if (job.success) {
          successMessages.push(job.message);
        } else {
          failureMessages.push(job.message);
        }
      });
      toast.removeAllGroups();
      if (successMessages.length > 0) {
        const tMsg: ToastMessageOptions = { severity: 'success', 
          summary: 'Delete Job', detail: successMessages.join('\n'), 
          life: ToastTimeout.timeoutSuccess};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (failureMessages.length > 0) {
        const tMsg: ToastMessageOptions = { severity: 'error', 
          summary: 'Delete Job', detail: failureMessages.join('\n'), 
          life: ToastTimeout.timeoutError};
        toast.add(tMsg); addToastRecord(tMsg);
      } 
      getCalibrationJobsForForecast();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  calibrationRunForForecast.value = undefined;
};

const confirmArchive = useConfirm();
const archiveSelectedCalibrationRun = () => {
  const selectedRunId = calibrationRunForForecast.value?.calibration_run_id as number;
  let confirmMessage = "Are you sure you want to Archive this calibration run? Unarchiving must be done from the Calibration workflow."
  confirmArchive.require({
    message: confirmMessage,
    header: 'Confirm Archive',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: "ARCHIVE RUN",
    },
    accept: () => acceptArchive(selectedRunId),
    reject: () => {
      //do nothing
    }
  })
}
const acceptArchive = (selectedRunId: number) => {
  archiveCalibrationRun(selectedRunId, true).then(async (response) => {
    if (response.status === 200) {
      let successMessages: string[] = [];
      let failureMessages: string[] = [];
      response._data?.jobs.forEach(job => {
        if (job.success) {
          successMessages.push(job.message);
        } else {
          failureMessages.push(job.message);
        }
      });
      toast.removeAllGroups();
      if (successMessages.length > 0) {
        const tMsg: ToastMessageOptions = { severity: 'success', 
          summary: 'Archive Job', detail: successMessages.join('\n'), 
          life: ToastTimeout.timeoutSuccess};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (failureMessages.length > 0) {
        const tMsg: ToastMessageOptions = { severity: 'error', 
          summary: 'Archive Job', detail: failureMessages.join('\n'), 
          life: ToastTimeout.timeoutError};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      getCalibrationJobsForForecast();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Archive Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}

/**
 * Export user's calibration job configuration data to a JSON file
 */
const exportSelectedCalibrationData = async () => {
  const selectedRunId = calibrationRunForForecast.value?.calibration_run_id as number;
  isLoading.value = true;
  const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Export Calibration Config', detail: 'Request to export Calibration Job ID ' + selectedRunId + ' has been processed.', life: ToastTimeout.timeoutInfo };
  toast.add(tMsg); addToastRecord(tMsg);
  nextTick(async () => {
    try {
      await exportJob(selectedRunId);
    } catch (error) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Export Calibration Config Error for Calibration Job ID ' + selectedRunId, detail: error, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
    isLoading.value = false;
  })
}

/**
 * Download all files in user's calibration job folder to a zip file
 */
 const downloadSelectedCalibrationData = async () => {
  const selectedRunId = calibrationRunForForecast.value?.calibration_run_id as number;
  if (calibrationRunForForecast.value?.is_downloadable) {
    //isLoading.value = true;
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Downloading Results Zip File for Calibration Job ID ' + selectedRunId, detail: 'Generating zip file. You may continue other ngenCERF activities and will be prompted to save when the file is ready.', life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
    nextTick(async () => {
      try {
        // If successful, this job will update calibrationDownloadFileName, and watch function will trigger a Toast message
        await getCalibrationJobZip(selectedRunId);
      } catch (error) {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Download Results Error for Calibration Job ID ' + selectedRunId, detail: error, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      //isLoading.value = false;
    })
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Download Error for Calibration Job ID ' + selectedRunId, detail: 'Data cannot be downloaded for Calibration Job + ' + selectedRunId + '.', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

watch(calibrationDownloadJobID, () => {
  if (calibrationDownloadJobID.value) {
    // Display Toast message saying download was successful and then clear the Job ID/filename refs
    // to avoid interfering with next download
    let tDetail = 'Results zip file successfully created.'
    if (calibrationDownloadFileName.value) {
      tDetail = 'Results zip file "' + calibrationDownloadFileName.value + '" successfully created.'
    }
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Download Results Successful for Calibration Job ID ' + calibrationDownloadJobID.value, detail: tDetail, life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
    calibrationDownloadJobID.value = null;
    calibrationDownloadFileName.value = null;
  }
});

const toggleMessagesGroup = () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#calibrationRunsForForecastList {
  height: 80%;
}

#HeadwaterBasinGage {
  width: 300px;
}

#CalibrationRunForForecastTable,
.gage-filter-wrapper {
  width: 1325px;
  margin: 0 auto;
}

.gage-filter-wrapper {
  margin-bottom: 1rem;
}

#MessagesGroupWindow {
  z-index: 999;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}
</style>
