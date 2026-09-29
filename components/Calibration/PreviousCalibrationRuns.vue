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
    <div class="mx-auto px-8 text-center overflow-auto">
      <div>
        <!-- Page top -->
        <div>
          <h1 class="mt-10 mb-6 text-3xl font-bold inline-block">Calibration Jobs</h1>
          <Button class="ngenButtonDiv ml-8" @click="createNewCalibration" aria-label="New Calibration Job"
            title="New Calibration Job" :disabled="isLoading">New</Button>
          <br />
          <p class="prompt-txt mb-2" style="margin-top:-10px;">
            Double click on a row to open, or right click for more options. Click "New" button for a fresh setup.
          </p>
        </div>

        <!-- Table -->
        <div>
          <div id="CalTable" class="w-max mx-auto">
            <JobFilterDialog id="JobFilterDialog" 
              :totalSize="calibrationRunListTotalSize" :totalPages="calibrationRunListTotalPages"
              v-model:currentPage="calibrationRunListCurrentPage" :running-job-in-list="runningJobInList"
              @RefreshJobList="refreshJobList()" @ResetFilters="resetFilters()"
              :showBulkActions="showBulkActions" v-model:selected-jobs="selectedCalibrationRuns" 
              :all-job-ids="allCalibrationRunIds" :visible-job-ids="visibleCalibrationRunIds"
              :delete-jobs="deleteCalibrationRun" :archive-jobs="archiveCalibrationRun" :lock-jobs="lockCalibrationRun"
              @UpdateGageList="updateGageList()" ref="jobFilterRef" />
            
            <ConfirmDialog></ConfirmDialog>

            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white w-[250px]" ref="crContextMenu"
              :model="buildContextMenu"></ContextMenu>

            <div v-if="userCalibrationJobsListData.length > 0 && calibrationRunListTotalSize > 0" class="pagination-box">
              <div class="pagination-rows">
                Rows {{ calibrationRunListStartRow }} to {{ calibrationRunListEndRow }} of {{ calibrationRunListTotalSize }}
              </div>
              <Paging v-model:currentPage="calibrationRunListCurrentPage" :totalPages="calibrationRunListTotalPages" />
            </div>
            <div v-else>
              No results. Try changing or clearing filters.
            </div>

            <DataTable id="Datatable" :value="userCalibrationJobsListData" 
              scrollable scroll-height="400px" table-style="min-width: 50rem; z-index: 1" scrollY="true"
              v-model:sortField="calibrationRunListSort.field" v-model:sortOrder="calibrationRunListSort.direction"
              v-model:selection="selectedCalibrationRuns" selectionMode="multiple" :metaKeySelection="false" dataKey="calibration_run_id" 
              v-model:contextMenuSelection="contextMenuSelection" contextMenu @rowContextmenu="onRowContextMenu"
              @row-dblclick="onRowDblClick($event)" :rowStyle="rowStyle" >

              <Column :pt="ptColumn" header=""
                style="width: 10px; text-align:center; vertical-align: top; padding: 0px !important">
                <template #body="slotProps">
                  <div v-if="slotProps.data.status.indexOf('Running') === -1"
                    :style="{ 'backgroundColor': colStyle(slotProps.data) }" :aria-label="slotProps.data.status"
                    :title="slotProps.data.status">
                    &nbsp;
                  </div>
                  <div v-else :style="{ backgroundColor: runningColor }" :aria-label="slotProps.data.status"
                    :title="slotProps.data.status">
                    &nbsp;
                  </div>
                </template>
              </Column>

              <Column :pt="{
                    bodyCell: { class: 'text-left' },  // Tailwind
                    headerCell: { class: 'text-left' } // for header alignment too
                }" field="calibration_run_id" header="Job ID" sortable>
                <template #body="slotProps">
                  <span v-if="slotProps.data.calibration_run_id"
                    :aria-label="'Job ID ' + slotProps.data.calibration_run_id"
                    :title="'Job ID ' + slotProps.data.calibration_run_id">
                    {{ slotProps.data.calibration_run_id }}
                    <span v-if="slotProps.data.is_locked" class="pi pi-lock"></span>
                  </span>
                </template>
              </Column>

              <Column v-if="includeArchivedJobs" :pt="ptColumn" field="is_archived" :body="binaryValueBodyTemplate"
                :sortable="true">
                <template #header>
                  <div class="column-header">
                    <span>Archived?</span>
                  </div>
                </template>
                <template #body="slotProps">
                  <span v-if="slotProps.data.calibration_run_id"
                    :aria-label="slotProps.data.is_archived ? 'Archived' : ''"
                    :title="slotProps.data.is_archived ? 'Archived' : ''">
                    {{ slotProps.data.is_archived ? 'Yes' : 'No' }}
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
                  <span :aria-label="'Stop Criteria ' + slotProps.data.stop_criteria"
                    :title="'Stop Criteria ' + slotProps.data.stop_criteria">
                    {{ slotProps.data.stop_criteria > 0 ? slotProps.data.stop_criteria : 'N/A' }}
                  </span>
                </template>
              </Column>
              <Column :pt="ptColumn" field="job_genesis" sortable>
                <template #header>
                  <div class="column-header">
                    <span>Job</span><br /><span>Genesis</span>
                  </div>
                </template>
                <template #body="slotProps">
                  <span v-if="slotProps.data.job_genesis" :aria-label="'Job Genesis ' + slotProps.data.job_genesis"
                    :title="'Job Genesis ' + slotProps.data.job_genesis">
                    {{ slotProps.data.job_genesis }}
                  </span>
                </template>
              </Column>
              <Column field="created_at" sortable>Column
                <template #header>
                  <div class="column-header">
                    <span>Creation Date</span>
                  </div>
                </template>
                <template #body="slotProps">
                  <span :aria-label="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                    :title="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                    class="nowrap">
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at) }}
                  </span>
                </template>
              </Column>
              <Column field="last_updated_on" sortable>
                <template #header>
                  <div class="column-header">
                    <span>Last Updated</span>
                  </div>
                </template>
                <template #body="slotProps">
                  <span v-if="slotProps.data.last_updated_on"
                    :aria-label="'Last Updated ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.last_updated_on)"
                    :title="'Last Updated ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.last_updated_on)"
                    class="nowrap">
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.last_updated_on) }}
                  </span>
                </template>
              </Column>
              <Column field="submit_date" sortable>
                <template #header>
                  <div class="column-header">
                    <span>Submit Date</span>
                  </div>
                </template>
                <template #body="slotProps">
                  <span v-if="slotProps.data.submit_date"
                    :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                    :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                    class="nowrap">
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                  </span>
                </template>
              </Column>
              <Column field="period" sortable>
                <template #header>
                  <div class="column-header">
                    <span>Calibration Period</span>
                  </div>
                </template>
                <template #body="slotProps">
                  <span v-if="slotProps.data.calibration_start_period && slotProps.data.calibration_end_period"
                    :aria-label="'Calibration Period ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_start_period) + ' to ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_end_period)"
                    :title="'Calibration Period ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_start_period) + ' to ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_end_period)"
                    class="nowrap">
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_start_period) }} <span
                      v-if="slotProps.data.calibration_end_period">to</span>
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_end_period) }}
                  </span>
                </template>
              </Column>
              <Column :pt="ptColumn" field="status" header="Status" sortable> <template #body="slotProps">
                  <span v-if="slotProps.data.status" :aria-label="'Status ' + slotProps.data.status"
                    :title="'Status ' + slotProps.data.status">
                    {{ slotProps.data.status }}
                  </span>
                </template></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>

  </client-only>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Swal from 'sweetalert2';

import MessagesGroup from "@/components/Common/MessagesGroup.vue";
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"
import Paging from "../Common/Paging.vue";

import type { CalibrationJobListItem, CalibrationJobValidationItem } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout, JobStatusAction } from "@/composables/NgencerfEnums";

import { useUserDataStore } from "@/stores/common/UserDataStore"
import { generalStore } from "@/stores/common/GeneralStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { useGageStore } from "@/stores/calibration/GageStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { useOptimizationStore } from "@/stores/calibration/OptimizationStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";

import { useApiResponseToastSeverityCode, useApiErrorResponsePreprocess, useApiResponseToastSeverityLife} from "@/composables/ValidationHandlers";
import { getOverallCalibrationValidationStatus, formatMultJobNumbers } from "@/utils/CommonHelpers";
import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';

const { loadGageTabStaticData, resetGageStore } = useGageStore();

const { loadOptimizationTabStaticData } = useOptimizationStore();
const { loadTuningTabStaticData, hardResetTuningStore } = useTuningStore();

const { hardResetRunStatusStore } = useRunStatusStore();
const { elapsedTimeIntervalId, calibrationStatusIntervalId, validationsStatusIntervalId } = storeToRefs(useRunStatusStore());

const { calibrationJobId } = storeToRefs(generalStore());
const { calibrationDownloadJobID } = storeToRefs(useCalibrationJobStore());
const { getMenuIndex, addToastRecord } = generalStore();

const { 
  userCalibrationJobsListData, 
  userCalibrationRunData, 
  uiGageList,
  includeArchivedJobs,
  selectedBulkJobAction,
  calibrationRunListPageSize,
  calibrationRunListCurrentPage,
  calibrationRunListTotalPages,
  calibrationRunListTotalSize,
  calibrationRunListStartRow,
  calibrationRunListEndRow,
  calibrationRunListSort
} = storeToRefs(useUserDataStore());
const { 
  queryUserCalibrationRunData, 
  fetchUserCalibrationRunData,
  fetchUserCalibrationJobsListData, 
  fetchUserCalibrationJobsListIdsOnly,
  fetchGageList,
  clearUserCalibrationRunData,
  resetFilters
} = useUserDataStore();
const { 
  fetchNewCalibrationRunId, 
  cloneCalibrationRun, 
  deleteCalibrationRun, 
  archiveCalibrationRun, 
  lockCalibrationRun, 
  exportJob, 
  getCalibrationJobZip 
} = useCalibrationJobStore();

const props = defineProps({
  callGoToTab: {
    type: Function,
    required: false,
  }
});

const showMessagesGroup = ref<boolean>(false);
const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

const { isLoading } = storeToRefs(generalStore());

const selectedCalibrationRuns = ref<CalibrationJobListItem[]>();
const contextMenuSelection = ref(null);

const allCalibrationRunIds = ref<number[]>([]);
const visibleCalibrationRunIds = ref<number[]>([]);

let interval: number | undefined;
const runningColor = ref<string>('white');

const jobFilterRef = ref(null);

const cmOpenRun = ref({
  label: 'Open', 
  icon: 'pi pi-folder-open', 
  command: () => openSelectedCalibrationRun() 
});
const cmViewRunDetails = ref({
  label: 'View Calibration Details',
  icon: 'pi pi-list',
  command: () => viewCalibrationDetails()
})
const cmCloneRun = ref({ 
  label: 'Clone', 
  icon: 'pi pi-clone', 
  command: () => cloneSelectedCalibrationRun() 
});
const cmExportRun = ref({ 
  label: 'Export Calibration Config', 
  icon: 'pi pi-file-export', 
  command: () => exportSelectedCalibrationData() 
});
const cmDownloadRun = ref({ 
  label: 'Download Results', 
  icon: 'pi pi-download', 
  command: () => downloadSelectedCalibrationData() 
});
const cmDeleteRun = ref({ 
  label: 'Delete', 
  icon: 'pi pi-trash', 
  command: () => jobFilterRef.value.changeSelectedJobStatus(JobStatusAction.delete) 
});
const cmArchiveRun = ref({ 
  label: 'Archive', 
  icon: 'pi pi-folder', 
  command: () => jobFilterRef.value.changeSelectedJobStatus(JobStatusAction.archive) 
});
const cmUnarchiveRun = ref({
  label: 'Un-archive', 
  icon: 'pi pi-folder-open', 
  command: () => jobFilterRef.value.changeSelectedJobStatus(JobStatusAction.unarchive)
});
const cmLockRun = ref({ 
  label: 'Lock', 
  icon: 'pi pi-lock', 
  command: () => jobFilterRef.value.changeSelectedJobStatus(JobStatusAction.lock) 
});
const cmUnlockRun = ref({
  label: 'Unlock', 
  icon: 'pi pi-lock-open', 
  command: () => jobFilterRef.value.changeSelectedJobStatus(JobStatusAction.unlock)
});

const buildContextMenu = computed(() => {
  let contextMenuOptions = [];
  if (selectedCalibrationRuns?.value && Array.isArray(selectedCalibrationRuns.value)) {
    if (selectedCalibrationRuns?.value.length === 1) {
      // single-job actions
      let selectedSingleCalibrationRun = selectedCalibrationRuns.value[0];
      contextMenuOptions.push(cmOpenRun.value);
      contextMenuOptions.push(cmViewRunDetails.value);
      contextMenuOptions.push(cmCloneRun.value);
      if (!['Submitted','Running'].includes(selectedSingleCalibrationRun?.status)) {
        if (selectedSingleCalibrationRun?.is_downloadable) {
          contextMenuOptions.push(cmDownloadRun.value);
        }
      }
      contextMenuOptions.push(cmExportRun.value);
    }
    // multi-job actions
    if (selectedCalibrationRuns.value.some(run =>
        !['Submitted','Running'].includes(run.status) && !run.is_archived && !run.is_locked
      )) {
      // only allow these actions if a selected job is not Submitted, Running, Archived, or Locked
      contextMenuOptions.push(cmDeleteRun.value);
      contextMenuOptions.push(cmArchiveRun.value);
    }
    if (selectedCalibrationRuns.value.some(run => run.is_archived)) {
      contextMenuOptions.push(cmUnarchiveRun.value);
    }
    if (selectedCalibrationRuns.value.some(run => run.is_locked)) {
      contextMenuOptions.push(cmUnlockRun.value);
    }
    if (selectedCalibrationRuns.value.some(run => !run.is_locked && !run.is_archived)) {
      contextMenuOptions.push(cmLockRun.value);
    }
  }
  return contextMenuOptions;
});

onMounted(async () => {
  if (getMenuIndex() === 1) { // Prevents calling get_calibration_jobs if we are not on the Calibration menu
    resetFilters();

    selectedBulkJobAction.value = 0;

    isLoading.value = false;
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); } 
    calibrationRunListCurrentPage.value = 1;
    resetGageStore();
    hardResetTuningStore();
    hardResetRunStatusStore();
    clearUserCalibrationRunData();
    await fetchUserCalibrationJobsListData();
    updateGageList();
    visibleCalibrationRunIds.value = userCalibrationJobsListData.value.map(job => job.calibration_run_id);
    if (calibrationRunListTotalPages.value > 1) {
      allCalibrationRunIds.value = await fetchUserCalibrationJobsListIdsOnly();
    } else {
      allCalibrationRunIds.value = visibleCalibrationRunIds.value;
    }
    interval = window.setInterval(toggleColor, 500); // Toggle every 500ms (0.5s)
  }
})

onBeforeUnmount(() => {
  selectedCalibrationRuns.value = undefined;
  if (interval) {
    clearInterval(interval); // Clean up the interval when the component is destroyed
  }
});

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
};

const updateGageList = async() => {
  uiGageList.value = await fetchGageList();
}

const runningJobInList = computed(() => {
  if (userCalibrationJobsListData.value?.length) {
    return userCalibrationJobsListData.value.some(run => run.status.includes('Submitted') || run.status.includes('Running'));
  }
  return false;
})

const showBulkActions = computed(() => {
  // let JobFilterDialogue know based on our job list what bulk actions to allow
  // always include the placeholder option
  let actionValues = [0];
  if (userCalibrationJobsListData.value.some(run => run.is_archived === false && run.is_locked === false)) {
    // only allow delete and archive if there are unarchived, unlocked jobs
    actionValues.push(1);
    actionValues.push(2);
  }
  if (userCalibrationJobsListData.value.some(run => run.is_archived === true)) {
    // only allow unarchive if there are archived jobs
    actionValues.push(3);
  }
  if (userCalibrationJobsListData.value.some(run => run.is_locked === false && run.is_archived === false)) {
    // only allow lock if there are unlocked jobs that are not archived
    actionValues.push(4);
  }
  if (userCalibrationJobsListData.value.some(run => run.is_locked === true)) {
    // only allow unlock if there are locked jobs
    actionValues.push(5);
  }
  return actionValues;
});

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault(); // Prevent the default context menu
}

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

/************************************************************/

// watch for sort order change - reset current page to 1
watch(calibrationRunListSort, () => {
  calibrationRunListCurrentPage.value = 1;
  refreshJobList();
},{ deep: true });

// Watch for page number changes in job list
watch(calibrationRunListCurrentPage, async () => {
  if (isNaN(calibrationRunListCurrentPage.value) || calibrationRunListCurrentPage.value < 1 || calibrationRunListCurrentPage.value > Math.ceil(calibrationRunListTotalSize.value / calibrationRunListPageSize.value)) {
    console.log('ERROR: Page number ' + calibrationRunListCurrentPage.value + ' out of bounds');
  } else {
    refreshJobList();
  }
});

const refreshJobList = async () => {
  isLoading.value = true;
  // changing filters clears previous selections
  selectedCalibrationRuns.value = undefined;
  await fetchUserCalibrationJobsListData();
  visibleCalibrationRunIds.value = userCalibrationJobsListData.value.map(job => job.calibration_run_id);
  if (calibrationRunListTotalPages.value > 1) {
    allCalibrationRunIds.value = await fetchUserCalibrationJobsListIdsOnly();
  } else {
    allCalibrationRunIds.value = visibleCalibrationRunIds.value;
  }
  isLoading.value = false;
}

// Function to toggle the color between 'red' and 'blue'
const toggleColor = () => {
  runningColor.value = runningColor.value === 'white' ? 'green' : 'white';
};

// A method to convert the binary value (boolean) to a sortable format
const binaryValueBodyTemplate = (rowData: any) => {
  return rowData.is_archived ? 'Yes' : 'No'; // Or return 1/0 as string or number
};

const onRowDblClick = (e: any) => {
  const data = ref<any>();
  data.value = e.data;
  if (data.value.is_archived) {
    Swal.fire({
      width: 500,
      html: "Operation not allowed for archived jobs.<br />You must un-archive it first.",
      title: 'Cannot open job ' + data.value.calibration_run_id,
      confirmButtonText: 'Close',
    })
    return;
  }
  openSelectedCalibrationRun(data);
}

const openSelectedCalibrationRun = async (data: any) => {
  calibrationJobId.value = data ? data.value?.calibration_run_id : selectedCalibrationRuns.value[0]?.calibration_run_id;
  isLoading.value = true;
  try {
    const queryResponse = await queryUserCalibrationRunData();
    if (queryResponse?.status === 200) {
      userCalibrationRunData.value = queryResponse?._data;
      if (props.callGoToTab) {
        if (userCalibrationRunData?.value?.status === 'Saved') {
          if (!userCalibrationRunData?.value?.job_name || !userCalibrationRunData?.value?.gage.gage_id || !userCalibrationRunData?.value?.forcing_source) {
            // Go to Headwater Basin Gage if job name, gage, and/or forcing source are not set
            props.callGoToTab(2);
          } else if (userCalibrationRunData?.value?.modules.length < 2) {
            // Go to Formulation if Modules are not set
            props.callGoToTab(3);
          } else if (!userCalibrationRunData?.value?.time_controls?.simulation_start_time) {
            // Go to Tuning Controls if calibration/validation times are not set
            // TO DO: Also check Tuning Parameters for non-LSTM jobs
            props.callGoToTab(4);
          } else {
            // If job is stil not Ready, assume we should go to Optimization Metrics
            // TO DO: skip this for LSTM
            props.callGoToTab(5);
          }
        } else {
          props.callGoToTab(6);
        }
      }
    } else {
      let tDetail = "Unable to Retrieve Calibration Job Data";
      if (queryResponse?._data?.message) {
        tDetail = queryResponse._data.message;
      }
      const tMsg: ToastMessageOptions = { severity: "error", summary: 'Load Calibration Job Failed.', detail: tDetail, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } catch (error) {
    let tDetail = "Unable to Retrieve Calibration Job Data";
    const tMsg: ToastMessageOptions = { severity: "error", summary: 'Load Calibration Job Failed.', detail: tDetail, life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  } finally {
    isLoading.value = false;
  }
}

const viewCalibrationDetails = async () => {
  isLoading.value = true;
  calibrationJobId.value = selectedCalibrationRuns.value[0]?.calibration_run_id;
  nextTick(async () => {
    await fetchUserCalibrationRunData(true);
    isLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const rowStyle = (data: any) => {
  if (data.is_archived === true) {
    return { backgroundColor: '#ebebeb' };
  }
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'white' };
  }
}

const colStyle = (data: any) => {
  if (data.status.indexOf('Failed') !== -1) {
    return 'Red';
  }
  else if (data.status.indexOf('Done') !== -1) {
    return 'Blue';
  }
  else if (data.status.indexOf('Saved') !== -1) {
    return 'Yellow';
  }
  else if (data.status.indexOf('Ready') !== -1) {
    return 'Green';
  }
  else if (data.status.indexOf('Cancelled') !== -1) {
    return 'Orange';
  }
  else if (data.status.indexOf('Server error') !== -1) {
    return 'Black';
  }
}

const toggleMessagesGroup = () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

const createNewCalibration = async () => {
  // Clear out old data
  resetGageStore();
  hardResetTuningStore();
  clearUserCalibrationRunData();

  fetchNewCalibrationRunId().then(response => {
    if (response.status === 201) {
      if (response?._data && response?._data?.calibration_run_id && response?._data?.calibration_run_id > 0) {
        calibrationJobId.value = response?._data?.calibration_run_id;
        queryUserCalibrationRunData().then(queryResponse => {
          userCalibrationRunData.value = queryResponse?._data;
          if (props.callGoToTab) {
            props.callGoToTab(2);
          }
        });
      } else {
        const tMsg: ToastMessageOptions = { severity: "error", summary: 'Create Calibration Job Failed.', detail: "Unable to Retrieve Valid Calibration Job Id", life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Create Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
}

const cloneSelectedCalibrationRun = async() => {
  isLoading.value = true;
  const selectedRunId = selectedCalibrationRuns.value[0]?.calibration_run_id;
  try {
    const response = await cloneCalibrationRun(selectedRunId);
    if (response.status === 200) {
      await fetchUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Clone Calibration Job ' + selectedRunId + 'Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  } catch (error) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Clone Calibration Job ' + selectedRunId + 'Failed.', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  } finally {
    isLoading.value = false;
  }
  selectedCalibrationRuns.value = undefined;
};


/**
 * Export user's calibration job configuration data to a JSON file
 */
const exportSelectedCalibrationData = async () => {
  const selectedRunId = selectedCalibrationRuns.value[0]?.calibration_run_id;
  isLoading.value = true;
  const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Export', detail: 'Request to export Calibration Job ID ' + selectedRunId + ' has been processed.', life: ToastTimeout.timeoutInfo };
  toast.add(tMsg); addToastRecord(tMsg);
  nextTick(async () => {
    try {
      await exportJob(selectedRunId);
    } catch (error) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Export Error for Calibration Job ID ' + selectedRunId, detail: error, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
    isLoading.value = false;
  })
}

/**
 * Download all files in user's calibration job folder to a zip file
 */
const downloadSelectedCalibrationData = async () => {
  const selectedRunId = selectedCalibrationRuns.value[0]?.calibration_run_id;
  if (selectedCalibrationRuns.value[0].is_downloadable) {
    //isLoading.value = true;
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Downloading Zip File for Calibration Job ID ' + selectedRunId, detail: 'Generating zip file. You may continue other ngenCERF activities and the file will be saved when ready.', life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
    nextTick(async () => {
      try {
        // If successful, this job will update calibrationDownloadJobID, and watch function will trigger a Toast message
        await getCalibrationJobZip(selectedRunId);
      } catch (error) {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Download Error for Calibration Job ID ' + selectedRunId, detail: error, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      //isLoading.value = false;
    })
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Download Error for Calibration Job ID ' + selectedRunId, detail: 'Data cannot be downloaded for Calibration Job ' + selectedRunId + '.', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

watch(calibrationDownloadJobID, () => {
  if (calibrationDownloadJobID.value) {
    // Display Toast message saying download was successful and then clear the Job ID/filename refs
    // to avoid interfering with next download
    let tDetail = 'Download zip file successfully created.'
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Download Successful for Calibration Job ID ' + calibrationDownloadJobID.value, detail: tDetail, life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
    calibrationDownloadJobID.value = null;
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

label,
small-label,
.--dp-font-size {
  font-size: 0.9em !important;
}

#HeadwaterBasinGage {
  width: auto;
}

#FilterGroup {
  color: black;
  font-weight: 600;
  margin: 0 auto;
}

#CalTable {
  min-height: 400px;
}

#CalDateEnd,
#CalDateStart {
  padding: 0 4px;
  width: 100%;

  :first-child {
    > :first-child {
      > :first-child {
        font-size: 0.9em;
      }
    }
  }
}

.filter-link,
.module-select {
  color: #0077ff;
  text-decoration: underline;
  background-color: transparent !important;
  padding: 5px;
}

.filter-link:hover,
.module-select:hover {
  font-weight: bold !important;
  border: none;
}

.p-button:not(:disabled):hover {
  background-color: transparent;
  color: #0077ff;
  font-weight: bold;
}

.datePickers {
  display: inline-block;
  text-align: center;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

#ModuleFilter {
  height: 37px;
  background-color: #f3f3f3;

  p-multiselect-label-container {
    margin-top: -6px;
  }
}

#Datatable,
#JobFilterDialog {
  width: 1325px !important;
}

.toggle-switch {
  height: 1.5em;
  width: 3em;
}

.toggle-switch::before {
  display: block;
  height: 1.25em;
  left: 0.125em;
  position: absolute;
  top: 0.125em;
  transition: left 150ms;
  width: 1.25em;
}

.nowrap {
  white-space: nowrap;
}

.grayedout {
  color: #555 !important;
}

.p-checkbox-box {
  border: 2px;
}

.archivedBackground {
  background-color: blue;
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