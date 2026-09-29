<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <client-only>
    <div class="pr-2 text-center">
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

      <div id="calibrationRunsForHindcastList">
        <div id="CalTable" class="w-max mx-auto">
          <JobFilterDialog id="JobFilterDialog" job-type="Calibration" :disable-all="false" 
            :show-status="false" :show-modules="false" :show-archived="false"
            :totalSize="calibrationRunsForHindcastListTotalSize" :totalPages="calibrationRunsForHindcastListTotalPages"
            v-model:currentPage="calibrationRunsForHindcastListCurrentPage"
            @RefreshJobList="refreshJobList()" @ResetFilters="resetFilters()" 
            :showBulkActions="showBulkActions" v-model:selected-jobs="selectedCalibrationRuns" 
            :all-job-ids="allCalibrationRunIds" :visible-job-ids="visibleCalibrationRunIds"
            :delete-jobs="deleteCalibrationRun" :archive-jobs="archiveCalibrationRun" :lock-jobs="lockCalibrationRun"
            @UpdateGageList="updateGageList()" ref="jobFilterRef" />

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
            :model="cmCalibrationRun"></ContextMenu>
          
          <div v-if="calibrationRunsForHindcast.length > 0 && calibrationRunsForHindcastListTotalSize > 0" class="pagination-box">
            <div class="pagination-rows">
              Rows {{ calibrationRunsForHindcastListStartRow }} to {{ calibrationRunsForHindcastListEndRow }} of {{ calibrationRunsForHindcastListTotalSize }}
            </div>
            <Paging v-model:currentPage="calibrationRunsForHindcastListCurrentPage" :totalPages=calibrationRunsForHindcastListTotalPages />
          </div>
          <div v-else>
            No results. Try changing or clearing filters.
          </div>

          <DataTable id="CalibrationRunForHindcastTable" :value="calibrationRunsForHindcast" 
            scrollable scroll-height="400px" :rowStyle="rowStyle" table-style="min-width: 50rem"
            v-model:sortField="calibrationRunsForHindcastListSort.field" v-model:sortOrder="calibrationRunsForHindcastListSort.direction"
            v-model:selection="selectedCalibrationRuns" selectionMode="multiple" :metaKeySelection="false" 
            v-model:contextMenuSelection="contextMenuSelection" contextMenu @rowContextmenu="onRowContextMenu"
            @rowSelect="onCalibrationRunForHindcastRowSelect" @rowUnselect="onCalibrationRunForHindcastRowUnSelect"
            @row-dblclick="onRowDblClick($event)" dataKey="calibration_run_id" class="boxed">
            <Column :pt="ptColumn" field="calibration_run_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Calibration</span><br /><span>Job ID</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.calibration_run_id"
                  :aria-label="'Calibration Job ID ' + slotProps.data.calibration_run_id"
                  :title="'Calibration Job ID ' + slotProps.data.calibration_run_id">
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
            <Column :pt="ptColumn" field="job_name" sortable>
              <template #header>
                <div class="column-header">
                  <span>Job Name</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.job_name"
                  :aria-label="'Job Name ' + slotProps.data.job_name"
                  :title="'Job Name ' + slotProps.data.job_name">
                  {{ slotProps.data.job_name }}
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
import type { calibrationRunForHindcast, DataTableContextMenuOption } from "@/composables/NgencerfModels";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { useHindcastStore } from "@/stores/hindcast/HindcastStore";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "~/stores/common/GeneralStore";

import MessagesGroup from "@/components/Common/MessagesGroup.vue";
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"
import Paging from "../Common/Paging.vue";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { HindcastTabs } from "@/composables/NgencerfEnums";

const { 
  deleteCalibrationRun, 
  archiveCalibrationRun, 
  lockCalibrationRun,
  exportJob, 
  getCalibrationJobZip 
} = useCalibrationJobStore();

const { addToastRecord } = generalStore();

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();
const showMessagesGroup = ref<boolean>(false);

const jobFilterRef = ref(null);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const HindcastStore = useHindcastStore();
const { 
  hindcastJobId,
  calibrationRunsForHindcastListPageSize,
  calibrationRunsForHindcastListCurrentPage,
  calibrationRunsForHindcastListTotalPages,
  calibrationRunsForHindcastListTotalSize,
  calibrationRunsForHindcastListStartRow,
  calibrationRunsForHindcastListEndRow,
  calibrationRunsForHindcastListSort,
  selectedHindcastJob,
  hindcastJobStatus,
  intervalCycle,
  numIterations
} = storeToRefs(HindcastStore);
const { 
  getCalibrationJobsForHindcast, 
  fetchCalibrationJobsForHindcastIdsOnly,
  resetUserSelectedHindcastCalibrationRun, 
  hardResetHindcastStore,
  resetFilters,
  fetchGageList
} = HindcastStore;


const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

//this model is for highlighting purpose
const selectedCalibrationRun = ref<calibrationRunForHindcast>();

const { isLoading, calibrationJobId } = storeToRefs(generalStore());
const { calibrationDownloadJobID } = storeToRefs(useCalibrationJobStore());

const props = defineProps({
  callGoToTab: {
    type: Function,
    required: false,
  }
});

const cmCalibrationRun = ref<DataTableContextMenuOption[]>([]);
const onRowContextMenu = (event: any) => {
  const clickedRow = event.data;

  // Only select the clicked row for context menu purposes
  contextMenuSelection.value = clickedRow;

  // Preserve previous selection; don't overwrite selectedCalibrationRuns
  // Optionally, if you want to auto-select the row if it wasn't already selected:
  if (Array.isArray(selectedCalibrationRuns.value)) {
    const alreadySelected = selectedCalibrationRuns.value.some(
      row => row.calibration_run_id === clickedRow.calibration_run_id
    );
    if (!alreadySelected) {
      selectedCalibrationRuns.value.push(clickedRow);
    }
  } else if (selectedCalibrationRuns.value && selectedCalibrationRuns.value !== clickedRow) {
    selectedCalibrationRuns.value = [selectedCalibrationRuns.value,clickedRow];
  } else {
    selectedCalibrationRuns.value = [clickedRow];
  }
  
  // Show context menu
  crContextMenu.value.show(event.originalEvent);

  cmCalibrationRun.value = [];
  const crRowData = event.data as CalibrationRunForHindcast;

  // only set calibrationRunForHindcast if we have a single row selected
  calibrationRunForHindcast.value = selectedCalibrationRuns.value.length === 1 ? selectedCalibrationRuns.value[0] : undefined; 
  if (calibrationRunForHindcast && calibrationRunForHindcast.value?.calibration_run_id === crRowData.calibration_run_id) {
    setSelectedCalibrationRunId(crRowData.calibration_run_id);
    cmCalibrationRun.value.push({ label: 'Run New Hindcast', icon: 'pi pi-chevron-circle-right', command: () => goToSetupHindcast() });
    cmCalibrationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-list', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
    if (calibrationRunForHindcast.value?.is_downloadable) {
      cmCalibrationRun.value.push({ label: 'Download Results', icon: 'pi pi-download', command: () => downloadSelectedCalibrationData() });
    }
    cmCalibrationRun.value.push({ label: 'Export Calibration Config', icon: 'pi pi-file-export', command: () => exportSelectedCalibrationData() });
  }
  // multi-job actions
  if (selectedCalibrationRuns.value.some(run =>
    !['Submitted','Running'].includes(run.status) && !run.is_archived && !run.is_locked
  )) {
    cmCalibrationRun.value.push({ label: 'Delete', icon: 'pi pi-trash', command: () => jobFilterRef.value.changeSelectedJobStatus(JobStatusAction.delete) });
    cmCalibrationRun.value.push({ label: 'Archive', icon: 'pi pi-folder', command: () => jobFilterRef.value.changeSelectedJobStatus(JobStatusAction.archive) });
    cmCalibrationRun.value.push({ label: 'Lock', icon: 'pi pi-lock', command: () => jobFilterRef.value.changeSelectedJobStatus(JobStatusAction.lock) });
  }
  if (selectedCalibrationRuns.value.some(run => run.is_locked )) {
    cmCalibrationRun.value.push({ label: 'Unlock', icon: 'pi pi-lock-open', command: () => jobFilterRef.value.changeSelectedJobStatus(JobStatusAction.unlock) });
  }
};

const onRowDblClick = (event: any) => {
  goToSetupHindcast(event);
}

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

const { userCalibrationRunData, uiGageList } = storeToRefs(useUserDataStore());

const { calibrationRunsForHindcast, calibrationRunForHindcast, hindcastRunGageList } = storeToRefs(useHindcastStore());

const { setSelectedCalibrationRunId, resetSelectedCalibrationRunId, fetchHindcastGageList } = useHindcastStore();

const selectedCalibrationRuns = ref<CalibrationRunForHindcast[]>();
const contextMenuSelection = ref(null);

const allCalibrationRunIds = ref<number[]>([]);
const visibleCalibrationRunIds = ref<number[]>([]);

const showBulkActions = computed(() => {
  // let JobFilterDialogue know based on our job list what bulk actions to allow
  // always include the placeholder option
  let actionValues = [0];
  if (calibrationRunsForHindcast.value.some(run => run.is_archived === false && run.is_locked === false)) {
    // only allow delete and archive if there are unarchived, unlocked jobs
    actionValues.push(1);
    actionValues.push(2);
  }
  // un-archive is not allowed here since we do not show archived jobs
  if (calibrationRunsForHindcast.value.some(run => run.is_locked === false && run.is_archived === false)) {
    // only allow lock if there are unlocked jobs that are not archived
    actionValues.push(4);
  }
  if (calibrationRunsForHindcast.value.some(run => run.is_locked === true)) {
    // only allow unlock if there are locked jobs
    actionValues.push(5);
  }
  return actionValues;
});

onMounted(async () => {
  isLoading.value = true;
  hindcastJobId.value = undefined;
  calibrationRunForHindcast.value = undefined;
  userCalibrationRunData.value = undefined;
  selectedHindcastJob.value = undefined;
  hindcastJobStatus.value = undefined; 
  calibrationRunsForHindcastListCurrentPage.value = 1;
  intervalCycle.value = undefined;
  numIterations.value = undefined;

  //reset Run/Status store in case we have running intervals
  hardResetHindcastStore();
  
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    resetSelectedCalibrationRunId();
    //clear calibration data if user were on calibration tab and clear evaluation previous run data user may have selected
    resetUserSelectedEvalCalibrationRun();
    resetUserSelectedHindcastCalibrationRun();
    await getCalibrationJobsForHindcast();
    updateGageList();
    visibleCalibrationRunIds.value = calibrationRunsForHindcast.value.map(job => job.calibration_run_id);
    if (calibrationRunsForHindcastListTotalPages.value > 1) {
      allCalibrationRunIds.value = await fetchCalibrationJobsForHindcastIdsOnly();
    } else {
      allCalibrationRunIds.value = visibleCalibrationRunIds.value;
    }
    isLoading.value = false;
  });
});

const updateGageList = async() => {
  uiGageList.value = await fetchGageList();
}

// watch for sort order change - reset current page to 1
watch(calibrationRunsForHindcastListSort, () => {
  calibrationRunsForHindcastListCurrentPage.value = 1;
  refreshJobList();
},{ deep: true });

// Watch for page number changes in job list
watch(calibrationRunsForHindcastListCurrentPage, () => {
  if (isNaN(calibrationRunsForHindcastListCurrentPage.value) || calibrationRunsForHindcastListCurrentPage.value < 1 || calibrationRunsForHindcastListCurrentPage.value > Math.ceil(calibrationRunsForHindcastListTotalSize.value / calibrationRunsForHindcastListPageSize.value)) {
    console.log('ERROR: Page number ' + calibrationRunsForHindcastListCurrentPage.value + ' out of bounds');
  } else {
    refreshJobList();
  }
});

const refreshJobList = async () => {
  isLoading.value = true;
  selectedCalibrationRuns.value = undefined;
  await getCalibrationJobsForHindcast();
  visibleCalibrationRunIds.value = calibrationRunsForHindcast.value.map(job => job.calibration_run_id);
  if (calibrationRunsForHindcastListTotalPages.value > 1) {
    allCalibrationRunIds.value = await fetchCalibrationJobsForHindcastIdsOnly();
  } else {
    allCalibrationRunIds.value = visibleCalibrationRunIds.value;
  }
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

const onCalibrationRunForHindcastRowSelect = async (event: any) => {
  //isLoading.value = true;
  const rowData = event.data as calibrationRunForHindcast;
  setSelectedCalibrationRunId(rowData.calibration_run_id);
  //hindcastJobId.value = rowData.calibration_run_id;
  //await loadSelectedCalibrationRun(hindcastJobId.value as number);
  //await fetchUserSelectedCalibrationValidationRunList();
  //isLoading.value = false;
}

const onCalibrationRunForHindcastRowUnSelect = async (event: DataTableRowClickEvent) => {
  //hindcastJobId.value = 0;
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

const goToSetupHindcast = async (event: any=null) => {
  if (event) {
    calibrationRunForHindcast.value = event.data;
    setSelectedCalibrationRunId(event.data.calibration_run_id);
  }
  if (calibrationRunForHindcast?.value?.calibration_run_id && calibrationRunForHindcast.value.calibration_run_id > 0) {
    hindcastJobId.value = undefined;
    if (props.callGoToTab) {
      props.callGoToTab(3);
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

/**
 * Export user's calibration job configuration data to a JSON file
 */
const exportSelectedCalibrationData = async () => {
  const selectedRunId = calibrationRunForHindcast.value?.calibration_run_id as number;
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
  const selectedRunId = calibrationRunForHindcast.value?.calibration_run_id as number;
  if (calibrationRunForHindcast.value?.is_downloadable) {
    //isLoading.value = true;
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Downloading Results Zip File for Calibration Job ID ' + selectedRunId, detail: 'Generating zip file. You may continue other ngenCERF activities and the file will be saved when ready.', life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
    nextTick(async () => {
      try {
        // If successful, this job will update calibrationDownloadJobID, and watch function will trigger a Toast message
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
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Download Results Successful for Calibration Job ID ' + calibrationDownloadJobID.value, detail: tDetail, life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
    calibrationDownloadJobID.value = null;
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

#calibrationRunsForHindcastList {
  height: 80%;
}

#HeadwaterBasinGage {
  width: 300px;
}

#calibrationRunForHindcastTable,
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
