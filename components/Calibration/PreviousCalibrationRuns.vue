<template>
  <client-only>
    <div class="mx-auto px-8 text-center overflow-auto">
      <div>
        <!-- Page top -->
        <div>
          <h1 class="mt-10 mb-6 text-3xl font-bold inline-block">Calibration Jobs</h1>
          <Button class="ngenButtonDiv ml-8" @click="createNewCalibration" aria-label="New Calibration Job"
            title="New Calibration Job">New</Button>
          <br />
          <p class="prompt-txt mb-2" style="margin-top:-10px;">
            Double click on a row to open, or right click for more options. Click "New" button for a fresh setup.
          </p>
        </div>

        <!-- Table -->
        <div class="">

          <div id="CalTable" class="w-max mx-auto">
            <JobFilterDialog id="JobFilterDialog" :disable-all="disableFilters" 
              :totalSize="calibrationRunListTotalSize" :totalPages="calibrationRunListTotalPages"
              @RefreshJobList="refreshJobList()" @BulkJobAction="bulkJobAction()" ref="jobFilterRef" />
            
            <ConfirmDialog></ConfirmDialog>

            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white w-[250px]" ref="crContextMenu"
              :model="buildContextMenu" @hide="selectedCalibrationRun = undefined"></ContextMenu>

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
              v-model:selection="selectedCalibrationRun" selectionMode="multiple" contextMenu
              v-model:contextMenuSelection="selectedCalibrationRun" @rowContextmenu="onRowContextMenu"
              :rowStyle="rowStyle" @row-dblclick="onRowDblClick($event)" @row-select="dtRowSelected($event)"
              @row-unselect="dtRowUnselect($event)">

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
                  <span v-if="slotProps.data.calibration_start_period || slotProps.data.calibration_end_period"
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

        <div id="MultJobOpsDlg" v-if="showHideMultOps">
          <MultipleJobOperations ref="multiJobRef" :cal-jobs="selectedMultipleCalibrationRuns"
            :cal-job-list="selectedMultipleCalibrationRunData" :cal-job-text="selectedMultipleCalibrationRunsText"
            @DeleteSelectedJobs="acceptMultipleDelete()" @ArchiveSelectedJobs="acceptMultipleArchive(true)" 
            @UnarchiveSelectedJobs="acceptMultipleArchive(false)" @LockSelectedJobs="acceptMultipleLock(true)" 
            @UnlockSelectedJobs="acceptMultipleLock(false)" @CloseMultJobWindow="closeMultJobsWindow"/>
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

//const LazyJobFilterDialog = defineAsyncComponent(() => import("@/components/Common/JobFilterDialog.vue"));
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"
import MultipleJobOperations from "@/components/Common/MultipleJobOperations.vue"
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
const { calibrationDownloadJobID, calibrationDownloadFileName } = storeToRefs(useCalibrationJobStore());
const { getMenuIndex, addToastRecord } = generalStore();

const { 
  userCalibrationJobsListData, 
  userCalibrationRunData, 
  includeArchivedJobs,
  selectedBulkJobAction,
  selectedBulkJobActionScope,
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
  fetchUserCalibrationJobsListData, 
  fetchUserCalibrationJobsListIDsOnly,
  clearUserCalibrationRunData 
} = useUserDataStore();
const { 
  fetchNewCalibrationRunId, 
  deleteCalibrationRun, 
  cloneCalibrationRun, 
  archiveCalibrationRun, 
  lockCalibrationRun, 
  exportJob, 
  getCalibrationJobZip 
} = useCalibrationJobStore();

import { hilightTab } from '@/composables/TabHilight';

const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

const { isLoading } = storeToRefs(generalStore());

const selectedCalibrationRun = ref<CalibrationJobListItem>();

const selectedMultipleCalibrationRuns = ref<number[]>([]);
const selectedMultipleCalibrationRunData = ref<CalibrationJobListItem[]>([]);
const selectedMultipleCalibrationRunsText = ref<string>('');

let interval: number | undefined;
const runningColor = ref<string>('white');

const showHideMultOps = ref<boolean>(false);
const systemContextMenu = ref<boolean>(false);
const multiJobRef = ref(null);
const jobFilterRef = ref(null);

const cmOpenRun = ref({
  label: 'Open', 
  icon: 'pi pi-folder-open', 
  command: () => openSelectedCalibrationRun(selectedCalibrationRun) 
});
const cmCloneRun = ref({ 
  label: 'Clone', 
  icon: 'pi pi-clone', 
  command: () => cloneSelectedCalibrationRun(selectedCalibrationRun) 
});
const cmExportRun = ref({ 
  label: 'Export Calibration Config', 
  icon: 'pi pi-file-export', 
  command: () => exportSelectedCalibrationData(selectedCalibrationRun) 
});
const cmDownloadRun = ref({ 
  label: 'Download Results', 
  icon: 'pi pi-download', 
  command: () => downloadSelectedCalibrationData(selectedCalibrationRun) 
});
const cmDeleteRun = ref({ 
  label: 'Delete', 
  icon: 'pi pi-trash', 
  command: () => changeSelectedCalibrationRunStatus(selectedCalibrationRun, JobStatusAction.delete) 
});
const cmArchiveRun = ref({ 
  label: 'Archive', 
  icon: 'pi pi-folder', 
  command: () => changeSelectedCalibrationRunStatus(selectedCalibrationRun, JobStatusAction.archive) 
});
const cmUnarchiveRun = ref({
  label: 'Un-archive', 
  icon: 'pi pi-folder-open', 
  command: () => changeSelectedCalibrationRunStatus(selectedCalibrationRun, JobStatusAction.unarchive)
});
const cmLockRun = ref({ 
  label: 'Lock', 
  icon: 'pi pi-lock', 
  command: () => changeSelectedCalibrationRunStatus(selectedCalibrationRun, JobStatusAction.lock) 
});
const cmUnlockRun = ref({
  label: 'Unlock', 
  icon: 'pi pi-lock-open', 
  command: () => changeSelectedCalibrationRunStatus(selectedCalibrationRun, JobStatusAction.unlock)
});

const buildContextMenu = computed(() => {
  let contextMenuOptions = [];
  if (selectedCalibrationRun?.value?.is_archived) {
    contextMenuOptions.push(cmUnarchiveRun.value);
  } else if (selectedCalibrationRun?.value && selectedCalibrationRun?.value?.status) {
    contextMenuOptions.push(cmOpenRun.value);
    contextMenuOptions.push(cmCloneRun.value);
    if (!selectedCalibrationRun?.value?.status.includes('Submitted') && !selectedCalibrationRun?.value?.status.includes('Running')) {
      if (selectedCalibrationRun?.value?.is_downloadable) {
        contextMenuOptions.push(cmDownloadRun.value);
      }
    }
    contextMenuOptions.push(cmExportRun.value);
    if (!selectedCalibrationRun?.value?.status.includes('Submitted') && !selectedCalibrationRun?.value?.status.includes('Running')) {
      if (!selectedCalibrationRun?.value?.is_locked) {
        contextMenuOptions.push(cmDeleteRun.value);
      }
      contextMenuOptions.push(cmArchiveRun.value);
    }
    if (selectedCalibrationRun?.value?.is_locked) {
      contextMenuOptions.push(cmUnlockRun.value);
    } else {
      contextMenuOptions.push(cmLockRun.value);
    }
  }
  return contextMenuOptions;
});


onMounted(async () => {
  if (getMenuIndex() === 1) { // Prevents calling get_calibration_jobs if we are not on the Calibration menu
    hilightTab(CalibrationTabs.tab_calibrationRuns);

    isLoading.value = false;
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); } 
    calibrationRunListCurrentPage.value = 1;
    resetGageStore();
    hardResetTuningStore();
    hardResetRunStatusStore();
    clearUserCalibrationRunData();
    await fetchUserCalibrationJobsListData();
    interval = window.setInterval(toggleColor, 500); // Toggle every 500ms (0.5s)
  }
})

onBeforeUnmount(() => {
  selectedCalibrationRun.value = undefined;
  if (interval) {
    clearInterval(interval); // Clean up the interval when the component is destroyed
  }
});

const onRowContextMenu = (event: any) => {
  if (selectedMultipleCalibrationRuns.value.length <= 1) {
    crContextMenu.value.show(event.originalEvent);
  }
  else {
    showHideMultOps.value = true;
    window.addEventListener(`click`, handleContextMenu);
  }
  nextTick(async () => {
    highlightSelectedRows();
  })
};

const dtRowSelected = (e: any) => {
  addCalibrationRun(e.data);
}

const dtRowUnselect = (e: any) => {
  deleteCalibrationRunById(e.data);
}

const highlightSelectedRows = () => {
  let dtRows = document.querySelector('#Datatable').querySelector('.p-datatable-tbody').children;
  for (let r = 0; r < dtRows.length; r++) {
    // We don't seem to have an easy way to reference the DataTable object itself
    // Hack for now: look at the second column and see if the value there matches a selected job ID
    try {
      if (selectedMultipleCalibrationRuns.value.includes(parseInt(dtRows[r].children[1].querySelector('span').innerHTML))) {
        dtRows[r].classList.add('p-datatable-row-selected');
      } else {
        dtRows[r].classList.remove('p-datatable-row-selected');
      }
    } catch(e) {
      dtRows[r].classList.remove('p-datatable-row-selected');
    }
  }
}

/**
 * Adds a calibration run object if one with the same `calibration_run_id` doesn't exist.
 * @param newRun - The new calibration run to be added.
 */
function addCalibrationRun(calRun: CalibrationJobListItem): void {
  const exists = selectedMultipleCalibrationRuns.value.some(
    run => run === calRun.calibration_run_id
  );
  if (!exists) {
    selectedMultipleCalibrationRuns.value.push(calRun.calibration_run_id);
    selectedMultipleCalibrationRunData.value.push(calRun);
  }
}

/**
 * Deletes calibration run(s) with a specific `calibration_run_id`.
 * In this example, it will remove any calibration run with id equal to 1.
 * @param id - The calibration run id to delete (default is 1).
 */
function deleteCalibrationRunById(calRun: CalibrationJobListItem): void {
  selectedMultipleCalibrationRuns.value = selectedMultipleCalibrationRuns.value.filter(
    run => run !== calRun.calibration_run_id
  );
  selectedMultipleCalibrationRunData.value = selectedMultipleCalibrationRunData.value.filter(
    run => run.calibration_run_id !== calRun.calibration_run_id
  );
}

watch(selectedCalibrationRun, () => {
  if (selectedMultipleCalibrationRuns.value.length === 0) {
    if (systemContextMenu.value) {
      window.removeEventListener(`contextmenu`, handleContextMenu);
      systemContextMenu.value = false;
    }
  } else if (!systemContextMenu.value) {
    window.addEventListener(`contextmenu`, handleContextMenu);
    systemContextMenu.value = true;
  };
});

const disableFilters = computed(() => {
  return (selectedMultipleCalibrationRuns.value.length > 1);
});


const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault(); // Prevent the default context menu
}

/**
 * Close Mult Jobs Window
 * 
 */
const closeMultJobsWindow = () => {
  selectedCalibrationRun.value = undefined;
  selectedMultipleCalibrationRuns.value = [];
  selectedMultipleCalibrationRunData.value = [];
  showHideMultOps.value = false;
  window.removeEventListener(`click`, handleContextMenu);
  nextTick(async () => {
    highlightSelectedRows();
  })
};

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

/************************************************************/

// watch for sort order change - reset current page to 1
watch(calibrationRunListSort, () => {
  calibrationRunListCurrentPage.value = 1
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
  await fetchUserCalibrationJobsListData();
  isLoading.value = false;
}

const bulkJobAction = async () => {
  // If scope is all pages (true) and there are multiple pages, retrieve list of job IDs. 
  // Otherwise just use the list from the currently displayed page.
  if (selectedBulkJobActionScope.value && calibrationRunListTotalPages.value > 1) {
    isLoading.value = true;
    selectedMultipleCalibrationRuns.value = await fetchUserCalibrationJobsListIDsOnly();
    isLoading.value = false;
  } else {
    selectedMultipleCalibrationRuns.value = userCalibrationJobsListData.value.map(job => job.calibration_run_id);
  }
  showHideMultOps.value = true;
  // wait a tick for the multi-job menu to display so that it only shows the confirm button
  nextTick(async () => {
    if (multiJobRef.value) {
      // ask the user to confirm the action - MultipleJobOperations will take care of the rest
      multiJobRef.value.confirmAction(selectedBulkJobAction.value);
    }
  });
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
  openSelectedCalibrationRun(data)
}

const openSelectedCalibrationRun = async (selectedCalibrationRun: any) => {
  isLoading.value = true;
  //keep the following for references purpose
  /*
  if( ['Done','Failed','SEVER_ERROR'].includes( selectedCalibrationRun.value.status ) ) const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Results tab', life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
  if( ['Saved','Ready'].includes( selectedCalibrationRun.value.status ) ) const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open corresponding saved tab', life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
  if( ['Running'].includes( selectedCalibrationRun.value.status ) ) const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Run/Status tab', life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
  */
  calibrationJobId.value = selectedCalibrationRun.value.calibration_run_id;
  queryUserCalibrationRunData().then(queryResponse => {
    if (queryResponse?.status === 200) {
      userCalibrationRunData.value = queryResponse?._data;
      gotoRunStatusTab();
    } else {
      let tDetail = "Unable to Retrieve Calibration Job Data";
      if (queryResponse?._data?.message) {
        tDetail = queryResponse._data.message;
      }
      const tMsg: ToastMessageOptions = { severity: "error", summary: 'Load Calibration Job Failed.', detail: tDetail, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  });
  isLoading.value = false;
}

const gotoRunStatusTab = () => {
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[CalibrationTabs.tab_runStatus] as HTMLElement;
  e.click();
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
          gotoHeadwaterBasinGage();
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

const gotoHeadwaterBasinGage = () => {
  nextTick(async () => {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[CalibrationTabs.tab_headwaterBasinGage];
    e.click();
  })

}

/**
 * following section require backend api before them can be implemented
 */
const cloneSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  isLoading.value = true;
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id;
  cloneCalibrationRun(selectedRunId).then(async (response) => {
    if (response.status === 200) {
      await fetchUserCalibrationJobsListData();
      isLoading.value = false;
    } else {
      isLoading.value = false;
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Clone Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
  selectedMultipleCalibrationRuns.value = [];
};

const confirmAction = useConfirm();
const changeSelectedCalibrationRunStatus = (selectedCalibrationRun: any, jobStatusAction: number) => {
  let ty = "";
  let label = "";
  if (jobStatusAction === JobStatusAction.delete) {
    ty = "Delete"
    label = "DELETE"
  } else if (jobStatusAction === JobStatusAction.archive) {
    ty = "Archive"
    label = "ARCHIVE"
  } else if (jobStatusAction === JobStatusAction.unarchive) {
    ty = "Unarchive (restore)"
    label = "Unarchive (restore)"
  } else if (jobStatusAction === JobStatusAction.lock) {
    ty = "Lock"
    label = "LOCK"
  } else if (jobStatusAction === JobStatusAction.unlock) {
    ty = "Unlock"
    label = "Unlock"
  }

  const selectedRunId = selectedCalibrationRun.value.calibration_run_id

  // for lock and unlock, no need to confirm, just do it
  if (jobStatusAction === JobStatusAction.lock) {
    acceptLock(selectedRunId, true)
  }
  else if (jobStatusAction === JobStatusAction.unlock) {
    acceptLock(selectedRunId, false)
  }
  else {
    const selectedRunName = (selectedCalibrationRun.value.formulation_name) ? " titled '" + selectedCalibrationRun.value.formulation_name + "'" : " (untitled)";
    let confirmMessage = "Are you sure you want to " + ty.toLowerCase() + " calibration run " + selectedRunId + selectedRunName;
    if (selectedCalibrationRun.value.status === "Running") confirmMessage += " The running calibration will be aborted."

    confirmAction.require({
      message: confirmMessage,
      header: 'Confirm ' + ty,
      icon: 'pi pi-exclamation-triangle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptProps: {
        label: label
      },
      accept: () => {
        if (jobStatusAction === JobStatusAction.delete) {
          acceptDelete(selectedRunId)
        }
        else if (jobStatusAction === JobStatusAction.archive) {
          acceptArchive(selectedRunId, true)
        }
        else if (jobStatusAction === JobStatusAction.unarchive) {
          acceptArchive(selectedRunId, false)
        }
      },
      reject: () => {
        //do nothing
      }
    })
  }
}

/**
 * Accept the deletion of a single job
 */
const acceptDelete = (selectedRunId: number) => {
  deleteCalibrationRun(selectedRunId).then(async (response) => {
    toast.removeAllGroups();
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
      refreshJobList();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
  selectedMultipleCalibrationRuns.value = [];
}

/**
 * Accept the deletion of multiple jobs
 */
const acceptMultipleDelete = () => {
  const sortedNumbers = formatMultJobNumbers([...selectedMultipleCalibrationRuns.value].sort((a, b) => a - b));
  // keep track of whether we're archiving the entire list
  let deleteAllJobs = selectedMultipleCalibrationRuns.value.length === calibrationRunListTotalSize.value;
  deleteCalibrationRun(selectedMultipleCalibrationRuns.value).then(async (response) => {
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
          summary: 'Delete Multiple Jobs', detail: successMessages.join('\n'), 
          life: ToastTimeout.timeoutSuccess};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (failureMessages.length > 0) {
        const tMsg: ToastMessageOptions = { severity: 'error', 
          summary: 'Delete Multiple Jobs', detail: failureMessages.join('\n'), 
          life: ToastTimeout.timeoutError};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (jobFilterRef.value && deleteAllJobs) {
        // if we just deleted the entire list, clear filters and inform the user
        jobFilterRef.value.resetFilters();
        const tMsg: ToastMessageOptions = { 
          severity: "info", 
          summary: 'All Jobs Deleted', 
          detail: 'All jobs in your filtered list were deleted. Resetting filters to show your remaining jobs.', 
          life: ToastTimeout.timeoutInfo 
        };
        toast.add(tMsg); addToastRecord(tMsg);
      } else {
        refreshJobList();
      }
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Jobs Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });

  selectedCalibrationRun.value = undefined;
  selectedMultipleCalibrationRuns.value = [];
}

/**
 * Accept archiving of a single job
 */
const acceptArchive = (selectedRunId: number, archiveJob: boolean) => {
  archiveCalibrationRun(selectedRunId, archiveJob).then(async (response) => {
    toast.removeAllGroups();
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
          summary: (archiveJob ? 'Archive' : 'Un-Archive') + ' Job', detail: successMessages.join('\n'), 
          life: ToastTimeout.timeoutSuccess};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (failureMessages.length > 0) {
        const tMsg: ToastMessageOptions = { severity: 'error', 
          summary: (archiveJob ? 'Archive' : 'Un-Archive') + ' Job', detail: failureMessages.join('\n'), 
          life: ToastTimeout.timeoutError};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      refreshJobList();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Archive Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });

  selectedCalibrationRun.value = undefined;
  selectedMultipleCalibrationRuns.value = [];
}

/**
 * Accept archiving of multiple jobs
 */
const acceptMultipleArchive = (archiveJob: boolean) => {
  const sortedNumbers = formatMultJobNumbers([...selectedMultipleCalibrationRuns.value].sort((a, b) => a - b));
  // keep track of whether we're archiving the entire list
  let archiveAllJobs = selectedMultipleCalibrationRuns.value.length === calibrationRunListTotalSize.value && archiveJob;
  archiveCalibrationRun(selectedMultipleCalibrationRuns.value, archiveJob).then(async (response) => {
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
          summary: archiveJob ? 'Archive' : 'Un-Archive' + ' Multiple Jobs', detail: successMessages.join('\n'), 
          life: ToastTimeout.timeoutSuccess};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (failureMessages.length > 0) {
        const tMsg: ToastMessageOptions = { severity: 'error', 
          summary: archiveJob ? 'Archive' : 'Un-Archive' + ' Multiple Jobs', detail: failureMessages.join('\n'), 
          life: ToastTimeout.timeoutError};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (archiveAllJobs && !includeArchivedJobs.value) 
      {
        // if we just archived the entire list and we're not showing archived jobs, inform the user
        const tMsg: ToastMessageOptions = { 
          severity: "info", 
          summary: 'All Jobs Archived', 
          detail: 'All jobs in your filtered list were archived. Click "Include Archived" to see them.', 
          life: ToastTimeout.timeoutInfo 
        };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      refreshJobList();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: (archiveJob ? 'Archive' : 'Un-Archive') + ' Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
  selectedMultipleCalibrationRuns.value = [];
}


/**
 * Accept locking of a single job
 */
const acceptLock = (selectedRunId: number, lock: boolean) => {
  lockCalibrationRun(selectedRunId, lock).then(async (response) => {
    toast.removeAllGroups();
    if (response.status === 200) {
      /* const tMsg: ToastMessageOptions = { severity: 'success', 
        summary: 'Calibration Job ' + (lock ? 'Locked' : 'Unlocked'), detail: 'Job ' + selectedRunId + ' ' + (lock ? 'Locked' : 'Unlocked'), life: ToastTimeout.timeoutSuccess };
      toast.add(tMsg); addToastRecord(tMsg); */
      await fetchUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Lock Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
  selectedMultipleCalibrationRuns.value = [];
}

/**
 * Accept locking of multiple jobs
 */
const acceptMultipleLock = (lock: boolean) => {
  const sortedNumbers = formatMultJobNumbers([...selectedMultipleCalibrationRuns.value].sort((a, b) => a - b));
  lockCalibrationRun(selectedMultipleCalibrationRuns.value, lock).then(async (response) => {
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
          summary: lock ? 'Lock' : 'Unlock' + ' Multiple Jobs', detail: successMessages.join('\n'), 
          life: ToastTimeout.timeoutSuccess};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (failureMessages.length > 0) {
        const tMsg: ToastMessageOptions = { severity: 'error', 
          summary: lock ? 'Lock' : 'Unlock' + ' Multiple Jobs', detail: failureMessages.join('\n'), 
          life: ToastTimeout.timeoutError};
        toast.add(tMsg); addToastRecord(tMsg);
      }
      await fetchUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: (lock ? 'Lock' : 'Unlock') + ' Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
  selectedMultipleCalibrationRuns.value = [];
}

/**
 * Export user's calibration job configuration data to a JSON file
 */
const exportSelectedCalibrationData = async (selectedCalibrationRun: any) => {
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id;
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
const downloadSelectedCalibrationData = async (selectedCalibrationRun: any) => {
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id;
  if (selectedCalibrationRun.value.is_downloadable) {
    //isLoading.value = true;
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Downloading Zip File for Calibration Job ID ' + selectedRunId, detail: 'Generating zip file. You may continue other ngenCERF activities and will be prompted to save when the file is ready.', life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
    nextTick(async () => {
      try {
        // If successful, this job will update calibrationDownloadFileName, and watch function will trigger a Toast message
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
    if (calibrationDownloadFileName.value) {
      tDetail = 'Download zip file "' + calibrationDownloadFileName.value + '" successfully created.'
    }
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Download Successful for Calibration Job ID ' + calibrationDownloadJobID.value, detail: tDetail, life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
    calibrationDownloadJobID.value = null;
    calibrationDownloadFileName.value = null;
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

#MultJobOpsDlg {
  position: fixed;
  top: 33%;
  z-index: 10;
  left: 40%;
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
</style>