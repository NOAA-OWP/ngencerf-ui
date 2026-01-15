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
    <div class="pr-2 relative">
      <div class="flex mt-2">
        <div class="w-full">
          <h1 class="pt-3 mb-6 text-3xl font-bold text-center relative">
            <span v-if="displayCalibrationValidationRunList.length > 1">Validation Runs for Calibration Job {{
              userSelectedEvalCalibrationRunId }}<br />
              <span class="prompt-txt">
                Select row then right click for available options.
              </span>
            </span>
            <span v-else-if="computedGageCalibrationRunList.length > 1">Select Calibration Runs to Compare
              <Button v-if="selectedCalibrationCompareRuns.length >= 2" id="btn-compare" class="ngenButtonDiv" style="position: absolute; right:0px;top:78px;" 
                @click.stop="compareSelectedCalibrationJobs">
                Compare
              </Button>
            </span>
            <span v-else>
              Calibration Runs<br />
              <span class="prompt-txt">
                Select row then right click for available options.
              </span>
            </span>
          </h1>
        </div>
      </div>

      <!-- Show list of validation runs if user has picked a calibration job with multiple validations -->
      
      <div v-if="displayCalibrationValidationRunList.length > 1">
        <div id="evaluationCalibrationList">
          <ContextMenu :pt="{ root: { id: ' vr-context-menu' } }" class="bg-white" ref="vrContextMenu"
            :model="cmValidationRun"></ContextMenu>
          <DataTable id="validation-list" :value="displayCalibrationValidationRunList" scrollable scroll-height="400px"
            sortField="validation_run_id" :sortOrder="-1" table-style="min-width: 50rem" selectionMode="single"
            v-model:selection="selectedCalibrationValidationRun" :rowStyle="rowStyle"
            @rowContextmenu="onRowVrContextMenu" @rowSelect="onEvalValidationRowSelect"
            @rowUnselect="onEvalValidationRowUnSelect" class="boxed">
            <Column :pt="ptValColumns" v-for="(col, colIndex) in calibrationValidationRunListHeaders" :key="colIndex"
              :header="col.header" :field="col.field">
            </Column>
          </DataTable>
          <div class="mt-3 mx-auto prompt-txt">
            * Iteration containing best parameter set determined during calibration.
          </div>
        </div>
        <div class="flex mt-2">
          <div class="ml-auto mt-4">
            <div id="NewButton">
              <Button id="btn-evaluate" class="ngenButtonDiv" @click.stop="returnCalibrationJobList">
                View Calibration Runs
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Show a list of calibration jobs from the same gage if user has chosen to Compare -->
      <div v-else-if="computedGageCalibrationRunList.length > 1">
        <div id="FilterDialog">
          <label class="block text-left w-[90%]" for="HeadwaterBasinGage" aria-label="Headwater Basin Gage"
            title="Headwater Basin Gage">Headwater Basin Gage</label>
            <div class="inline-block w-1/6 pb-3">
                <Select id="HeadwaterBasinGageCompare" class="mt-2 basin-gage-filter text-left" v-model="uiCompareGageId"
                    :options="compareCalibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
                    aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select"
                    @change="viewSelectedGageCalibrationRuns(0, uiCompareGageId);">
                </Select>
            </div>
        </div>
        <div id="evaluationCalibrationList">
          <ContextMenu :pt="{ root: { id: ' cp-context-menu' } }" class="bg-white" ref="cpContextMenu"
            :model="cmCompareRun"></ContextMenu>
          <DataTable id="compare-list" :value="computedGageCalibrationRunList" scrollable scroll-height="400px"
            sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem" 
            selectionMode="multiple" :metaKeySelection="true" @rowContextmenu="onRowCpContextMenu"
            v-model:selection="selectedCalibrationCompareRuns" :rowStyle="rowStyle" class="boxed">
            <Column :pt="ptValColumns" v-for="(col, colIndex) in gageevaluationRunListHeaders" :key="colIndex"
              :header="col.header" :field="col.field" sortable>
            </Column>
          </DataTable>
        </div>
        <div class="flex mt-2">
          <div class="ml-auto mt-4">
            <div id="NewButton">
              <Button id="btn-evaluate" class="ngenButtonDiv" @click.stop="returnCalibrationJobList">
                View Calibration Runs
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Default is to show the user's list of Calibration runs -->
      <div v-else id="evaluationRunList">

        <div id="CalTable" class="w-max mx-auto">
          <JobFilterDialog id="JobFilterDialog" :disable-all="false" :show-status="false" :show-archived="false"
          :totalSize="evaluationRunListTotalSize" :totalPages="evaluationRunListTotalPages"
          v-model:currentPage="evaluationRunListCurrentPage"
          @RefreshJobList="refreshJobList()" @ResetFilters="resetFilters()" ref="jobFilterDialog" />

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
            :model="cmCalibrationRun"></ContextMenu>
          
          <div v-if="userEvaluationRunListData.length > 0 && evaluationRunListTotalSize > 0" class="pagination-box">
            <div class="pagination-rows">
              Rows {{ evaluationRunListStartRow }} to {{ evaluationRunListEndRow }} of {{ evaluationRunListTotalSize }}
            </div>
            <Paging v-model:currentPage="evaluationRunListCurrentPage" :totalPages=evaluationRunListTotalPages />
          </div>
          <div v-else>
            No results. Try changing or clearing filters.
          </div>
          
          <DataTable id="EvalRunTable" table-style="min-width: 50rem" scrollable scroll-height="400px"
            :value="userEvaluationRunListData" v-model:selection="selectedCalibrationRun" 
            v-model:sortField="evaluationRunListSort.field" v-model:sortOrder="evaluationRunListSort.direction"
            selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onEvalCalibrationRowSelect" @rowUnselect="onEvalCalibrationRowUnSelect"
            @rowContextmenu="onRowContextMenu" class="boxed">
            <Column :pt="ptColumn" field="calibration_run_id" sortable> 
              <template #header>
                <div class="column-header">
                  <span>Job ID</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.calibration_run_id"
                  :aria-label="'Job ID ' + slotProps.data.calibration_run_id"
                  :title="'Job ID ' + slotProps.data.calibration_run_id">
                  {{ slotProps.data.calibration_run_id }}
                  <span v-if="slotProps.data.is_locked" class="pi pi-lock"></span>
                </span>
              </template></Column>

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
            <Column :pt="ptColumn" field="validation_runs" sortable>
              <template #header>
                <div class="column-header">
                  <span>Validation</span><br /><span>Runs</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.validation_runs"
                  :aria-label="'Validation Run ' + slotProps.data.validation_runs"
                  :title="'Validation Run ' + slotProps.data.validation_runs">
                  {{ slotProps.data.validation_runs }}
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
            <Column :pt="ptColumn" field="created_at" sortable>
              <template #header>
                <div class="column-header">
                  <span>Creation</span><br /><span>Date</span>
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
            <Column :pt="ptColumn" field="submit_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Submit</span><br /><span>Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <span :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                  :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                  class="whitespace-nowrap">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="status" sortable>
              <template #header>
                <div class="column-header">
                  <span>Status</span>
                </div>
              </template>
              <template #body="slotProps">
                <span :aria-label="'Status ' + slotProps.data.status" :title="'Status ' + slotProps.data.status">
                  {{ slotProps.data.status }}
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
import type { CalibrationValidationJobData, DataTableContextMenuOption } from "@/composables/NgencerfModels";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { useEvaluationRunStatusStore } from '@/stores/evaluation/EvaluationRunStatusStore';
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { generalStore } from "@/stores/common/GeneralStore"

import MessagesGroup from "@/components/Common/MessagesGroup.vue";
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"
import Paging from "../Common/Paging.vue";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';
import { EvaluationTabs } from "@/composables/NgencerfEnums";

const { deleteCalibrationRun, exportJob, getCalibrationJobZip, archiveCalibrationRun } = useCalibrationJobStore();
const showMessagesGroup = ref<boolean>(false);

const crContextMenu = ref(); //calibration run context menu
const vrContextMenu = ref(); //validation run context menu
const cpContextMenu = ref(); //compare run context menu

const contextMenuJob = ref<number>();

const cmCalibrationRun = ref<DataTableContextMenuOption[]>([]);
const cmValidationRun = ref<DataTableContextMenuOption[]>([]);
const cmCompareRun = ref<DataTableContextMenuOption[]>([]);

const userDataStore = useUserDataStore();
const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const ptValColumns = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "right", "padding-right": "10px" } }
});

const { fetchUserCalibrationRunData } = userDataStore;

const {
  uiCompareGageId, 
  evaluationCalibrationRunGageList,
  compareCalibrationRunGageList,
  loadCalibrationDataComplete,
  userSelectedEvalCalibrationRunId,
  calibrationValidationRunListHeaders,
  gageevaluationRunListHeaders,
  computedCalibrationValidationRunList,
  displayCalibrationValidationRunList,
  computedGageCalibrationRunList,
  selectedCalibrationCompareRuns,
  selectedCalibrationModules,
  userEvaluationRunListData,
  evaluationRunListPageSize,
  evaluationRunListCurrentPage,
  evaluationRunListTotalPages,
  evaluationRunListTotalSize,
  evaluationRunListStartRow,
  evaluationRunListEndRow,
  evaluationRunListSort,
  evaluateValidationRunId,
  evaluateValidationRunStatus,
} = storeToRefs(evaluationCalibrationRunStore);

const { calibrationDownloadJobID, calibrationDownloadFileName } = storeToRefs(useCalibrationJobStore());

const {
  fetchUserSelectedCalibrationValidationRunList,
  displayUserSelectedCalibrationValidationRunList,
  loadSelectedCalibrationRun,
  resetUserSelectedEvalCalibrationRun,
  resetUserSelectedEvalValidationRun,
  resetUserSelectedEvalCompareRun,
  fetchUserValidatedCalibrationJobsListData,
  clearUserCalibrationRunData,
  setSelectedCalibrationRunId,
  fetchValidationRunListByCalibrationRun,
  resetFilters
} = evaluationCalibrationRunStore;

const { validationStatusCheckingIntervalId, validationRunningTimeIntervalId } = storeToRefs(useEvaluationRunStatusStore());
const { hardResetEvaluationRunStatusStore } = useEvaluationRunStatusStore();

const { userCalibrationRunData, gotoCalibrationRunId, includeArchivedJobs } = storeToRefs(useUserDataStore());

const { isLoading, calibrationJobId } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();
//this model is for highlighting purpose
const selectedCalibrationRun = ref<ValidatedCalibrationRunListItem>();
const selectedCalibrationValidationRun = ref<CalibrationValidationJobData>();

const formulationName = "Formulation Name";

onMounted(async() => {
  hilightTab(EvaluationTabs.tab_calibrationRuns);
  includeArchivedJobs.value = false;
  resetFilters();

  //clear calibration data if user was on calibration tab and clear previous evaluation run data user may have selected
  resetUserSelectedEvalCalibrationRun();

  //reset Run/Status store in case we have running intervals
  hardResetEvaluationRunStatusStore();

  await fetchUserValidatedCalibrationJobsListData();

  if(gotoCalibrationRunId.value) {
    userSelectedEvalCalibrationRunId.value = gotoCalibrationRunId.value;
    const validationRunList = await fetchValidationRunListByCalibrationRun();
    if (validationRunList.length > 0) {
      if (validationRunList.length > 1) {
        viewSelectedCalibrationValidationRuns(gotoCalibrationRunId.value);
      } else {
        evaluateValidationJobFromCalibration(gotoCalibrationRunId.value);
      }
    } else {
      const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Calibration Job Not Ready for Evaluation', detail: 'The Calibration Job you chose cannot be evaluated at this time.', life: ToastTimeout.timeoutWarn };
      toast.add(tMsg); addToastRecord(tMsg);
      resetUserSelectedEvalCalibrationRun();
    }
    gotoCalibrationRunId.value = undefined;
  }

  uiCompareGageId.value = 'All';
  computedGageCalibrationRunList.value = [];
  selectedCalibrationCompareRuns.value = [];

  isLoading.value = true;
  evaluationRunListCurrentPage.value = 1;

  fetchUserValidatedCalibrationJobsListData();
  
  if (gageevaluationRunListHeaders.value.length === 0) {
    gageevaluationRunListHeaders.value.push({ field: 'calibration_run_id', header: "Job ID" });
    gageevaluationRunListHeaders.value.push({ field: 'status', header: "Status" });
    gageevaluationRunListHeaders.value.push({ field: 'submit_date', header: "Submit Date" });
    gageevaluationRunListHeaders.value.push({ field: 'formulation_name', header: "Formulation Name" });
    gageevaluationRunListHeaders.value.push({ field: 'gage_id', header: "Headwater Basin Gage" });
    gageevaluationRunListHeaders.value.push({ field: 'period', header: "Calibration Period" });
    gageevaluationRunListHeaders.value.push({ field: 'objective_function', header: "Objective Function" });
    gageevaluationRunListHeaders.value.push({ field: 'optimization_algorithm', header: "Optimization Algorithm" });
  }

  isLoading.value = false;
});

/**
 * Splits a header string into two parts:
 * - `first`: all words except the last (or the entire header if only one word)
 * - `second`: the last word (or an empty string if only one word)
 */
function splitHeader(header: string): { first: string; second: string } {
  const words = header.split(' ');
  if (words.length > 1) {
    return {
      first: words.slice(0, words.length - 1).join(' '),
      second: words[words.length - 1]
    };
  }
  return { first: header, second: '' };
}

// watch for sort order change - reset current page to 1
watch(evaluationRunListSort, () => {
  evaluationRunListCurrentPage.value = 1
  refreshJobList();
},{ deep: true });

// Watch for page number changes in job list
watch(evaluationRunListCurrentPage, async () => {
  if (isNaN(evaluationRunListCurrentPage.value) || evaluationRunListCurrentPage.value < 1 || evaluationRunListCurrentPage.value > Math.ceil(evaluationRunListTotalSize.value / evaluationRunListPageSize.value)) {
    console.log('ERROR: Page number ' + evaluationRunListCurrentPage.value + ' out of bounds');
  } else {
    refreshJobList();
  }
});

const refreshJobList = async () => {
  isLoading.value = true;
  await fetchUserValidatedCalibrationJobsListData();
  isLoading.value = false;
}

// A method to convert the binary value (boolean) to a sortable format
const binaryValueBodyTemplate = (rowData: any) => {
  return rowData.is_archived ? 'Yes' : 'No'; // Or return 1/0 as string or number
};

const onRowContextMenu = (event: any) => {
  cmCalibrationRun.value = [];
  const crRowData = event.data as ValidatedCalibrationRunListItem;
  if (selectedCalibrationRun && selectedCalibrationRun.value?.calibration_run_id === crRowData.calibration_run_id) {
    crContextMenu.value.show(event.originalEvent);
    contextMenuJob.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
    if (crRowData.validation_runs > 1) {
      cmCalibrationRun.value.push({ label: 'Select Validation Run', icon: 'pi pi-search', command: () => viewSelectedCalibrationValidationRuns(crRowData.calibration_run_id) })
    } 
    if (crRowData.validation_runs == 1) {
      cmCalibrationRun.value.push({ label: 'Evaluate', icon: 'pi pi-chart-scatter', command: () => evaluateValidationJobFromCalibration(crRowData.calibration_run_id) })
    }
    if (crRowData.validation_runs >= 1) {
      cmCalibrationRun.value.push({ label: 'Compare Permutations', icon: 'pi pi-arrows-h', command: () => viewSelectedGageCalibrationRuns(crRowData.calibration_run_id, crRowData.gage_id) });
      if (!['Submitted','Running'].includes(selectedCalibrationRun?.value?.status) && !crRowData.modules?.some(item => item.toLowerCase() === 'lstm')) {
        cmCalibrationRun.value.push({ label: 'New Validation Run', icon: 'pi pi-chevron-circle-right', command: () => viewSelectAlternateIteration(crRowData.calibration_run_id) });
      }
    }
    cmCalibrationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-list', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
    if (selectedCalibrationRun.value?.is_downloadable) {
      cmCalibrationRun.value.push({ label: 'Download Results', icon: 'pi pi-download', command: () => downloadSelectedCalibrationData() });
    }
    cmCalibrationRun.value.push({ label: 'Export Calibration Config', icon: 'pi pi-file-export', command: () => exportSelectedCalibrationData() });
    if (!['Submitted','Running'].includes(selectedCalibrationRun?.value?.status) && !selectedCalibrationRun?.value?.is_locked) {
      cmCalibrationRun.value.push({ label: 'Delete', icon: 'pi pi-trash', command: () => deleteSelectedCalibrationRun() });
    }
    if (!['Submitted','Running'].includes(selectedCalibrationRun?.value?.status) && !selectedCalibrationRun.value?.is_archived) {
      cmCalibrationRun.value.push({ label: 'Archive', icon: 'pi pi-folder', command: () => archiveSelectedCalibrationRun(true) });
    }
  }
};

const onRowVrContextMenu = (event: any) => {
  cmValidationRun.value = [];
  const vrRowData = event.data as CalibrationValidationJobData;
  if (selectedCalibrationValidationRun && selectedCalibrationValidationRun.value?.validation_run_id === vrRowData.validation_run_id) {
    vrContextMenu.value.show(event.originalEvent);
    if (vrRowData.status.toLocaleUpperCase() !== 'RUNNING') {
      cmValidationRun.value.push({ label: 'Evaluate', icon: 'pi pi-chart-scatter', command: () => evaluateValidationJob(vrRowData.validation_run_id, vrRowData.status) });
    }
    cmValidationRun.value.push({ label: 'New Validation Run', icon: 'pi pi-chevron-circle-right', command: () => viewSelectAlternateIteration(userSelectedEvalCalibrationRunId.value) });
    cmValidationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-list', command: () => viewCalibrationDetails(userSelectedEvalCalibrationRunId.value) });
    if (vrRowData.status.toLocaleUpperCase() === 'RUNNING') {
      cmValidationRun.value.push({ label: 'View Run Status Details', icon: 'pi pi-chart-bar', command: () => navigationToRunStatus(vrRowData.validation_run_id, vrRowData.status) });
      cmValidationRun.value.push({ label: 'Cancel', icon: 'pi pi-ban', command: () => navigationToRunStatus(vrRowData.validation_run_id, vrRowData.status) });
    }
  }
}

const onRowCpContextMenu = (event: any) => {
  cmCompareRun.value = [];
  const cpRowData = event.data as ValidatedCalibrationRunListItem;
  cpContextMenu.value.show(event.originalEvent);
  cmCompareRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-list', command: () => viewCalibrationDetails(cpRowData.calibration_run_id) })
}

const onEvalCalibrationRowSelect = async (event: DataTableRowClickEvent) => {
  resetUserSelectedEvalValidationRun();
  isLoading.value = true;
  //loadSelectedCalibrationRun(event.data.calibration_run_id);
  setSelectedCalibrationRunId(event.data.calibration_run_id);
  await fetchUserCalibrationRunData(false);
  selectedCalibrationModules.value = userCalibrationRunData?.value?.modules;
  fetchUserSelectedCalibrationValidationRunList();
  isLoading.value = false;
}

watch(() => userCalibrationRunData.value, (updatedRunData, initialRunData) => {
  if (updatedRunData !== undefined && Object.keys(updatedRunData).length > 0) {
    nextTick(() => {
      isLoading.value = false;
      loadCalibrationDataComplete.value = true;
    });
  }
});

const onEvalCalibrationRowUnSelect = (event: any) => {
  resetUserSelectedEvalCalibrationRun();
}

const onEvalValidationRowSelect = async (event: DataTableRowClickEvent) => {
  evaluateValidationRunId.value = event.data.validation_run_id;
  evaluateValidationRunStatus.value = event.data.status;
}

const onEvalValidationRowUnSelect = async (event: DataTableRowClickEvent) => {
  evaluateValidationRunId.value = 0;
  evaluateValidationRunStatus.value = '';
}

const onRowDblClick = (event: any) => {
  isLoading.value = true;
  const rowData = event.data;
  contextMenuJob.value = rowData.calibration_run_id;
  openSelectedCalibrationRun();
}

const openSelectedCalibrationRun = () => {
  isLoading.value = true;
  resetUserSelectedEvalValidationRun();
  nextTick(async () => {
    setSelectedCalibrationRunId(contextMenuJob.value as number);
    await displayUserSelectedCalibrationValidationRunList();
    isLoading.value = false;
  })
}

const viewCalibrationDetails = async (calibration_run_id: number) => {
  isLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const viewSelectedCalibrationValidationRuns = async (calibration_run_id: number) => {
  resetUserSelectedEvalValidationRun();
  isLoading.value = true;
  nextTick(async () => {
    setSelectedCalibrationRunId(calibration_run_id);
    await fetchUserSelectedCalibrationValidationRunList();
    displayUserSelectedCalibrationValidationRunList();
    isLoading.value = false;
  })
}

const viewSelectedGageCalibrationRuns = async (calibration_run_id: number, gage_id: string) => {
  isLoading.value = true;
  userSelectedEvalCalibrationRunId.value = calibrationJobId.value = 0;
  computedGageCalibrationRunList.value = [];
  clearUserCalibrationRunData();
  
  nextTick(async () => {
    let filteredRunList = userEvaluationRunListData?.value?.filter((row) => (row as CalibrationJobListItem).gage_id === gage_id);
    if (filteredRunList.length >= 2) {
      uiCompareGageId.value = gage_id;
      filteredRunList.forEach((calibration_job: CalibrationJobListItem) => {
        let rowData = <any>{};
        rowData['calibration_run_id'] = calibration_job.calibration_run_id;
        rowData['status'] = calibration_job.status;
        rowData['submit_date'] = formatISOStringOrDateToYYYYMMDDHHMM(calibration_job.submit_date);
        rowData['formulation_name'] = calibration_job.formulation_name;
        rowData['gage_id'] = calibration_job.gage_id;
        rowData['period'] = formatISOStringOrDateToYYYYMMDD(calibration_job.calibration_start_period) + ' to ' + formatISOStringOrDateToYYYYMMDD(calibration_job.calibration_end_period);
        rowData['objective_function'] = calibration_job.objective_function;
        rowData['optimization_algorithm'] = calibration_job.optimization_algorithm;
        computedGageCalibrationRunList.value.push(rowData);
        if (calibration_job.calibration_run_id == calibration_run_id) {
          // start with the job that the user picked already highlighted
          selectedCalibrationCompareRuns.value = [rowData];
        }
      });
    } else {
      const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Not Enough Calibration Jobs', detail: 'You can only Compare Permutations for gages for which you have completed at least 2 calibration jobs.', life: ToastTimeout.timeoutWarn };
      toast.add(tMsg); addToastRecord(tMsg);
    }
    isLoading.value = false;
  })
}

const navigationToRunStatus = (validation_run_id: number, validation_status: string) => {
  evaluateValidationRunId.value = validation_run_id;
  evaluateValidationRunStatus.value = validation_status;
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[EvaluationTabs.tab_runStatus];
  e.click();
}

const viewSelectAlternateIteration = async (calibration_run_id: number) => {
  setSelectedCalibrationRunId(calibration_run_id);
  if (userSelectedEvalCalibrationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_selectAltIteration];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Calibration Job', detail: 'Please select a calibration job first.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const navigateToAlternateIteration = (event: any) => {
  if (userSelectedEvalCalibrationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_selectAltIteration];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Calibration Job', detail: 'Please select a calibration job first.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const evaluateValidationJobFromCalibration = async (calibration_run_id: number): Promise<void> => {
  loadSelectedCalibrationRun(calibration_run_id, false);
  await fetchValidationRunListByCalibrationRun().then(validationRunList => {
    if (validationRunList.length === 1) {
      evaluateValidationRunId.value = validationRunList[0].validation_run_id;
      evaluateValidationRunStatus.value = validationRunList[0].status;

      const tabs = document.getElementsByClassName("tabs");
      const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
      e.click();
    }
  });
}

const evaluateValidationJob = (validation_run_id: number, validation_status: string): void => {
  evaluateValidationRunId.value = validation_run_id;
  evaluateValidationRunStatus.value = validation_status;
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
  e.click();
}

const compareSelectedCalibrationJobs = async (): Promise<void> => {
  if (selectedCalibrationCompareRuns.value.length >= 2) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_compare];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Not Enough Calibration Jobs Selected', detail: 'Please select at least two calibration jobs to compare.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const viewValidationRunStatus = async (calibration_run_id: number): Promise<void> => {
  resetUserSelectedEvalValidationRun();
  nextTick(async () => {
    setSelectedCalibrationRunId(calibration_run_id);
    await fetchValidationRunListByCalibrationRun().then(validationRunList => {
      if (validationRunList.length === 1) {
        navigationToRunStatus(validationRunList[0].validation_run_id, validationRunList[0].status);
      }
    });
  })
}

const navigateToEvaluation = (event: any) => {
  if (evaluateValidationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Validation Job', detail: 'Please select a validation job first.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const returnCalibrationJobList = (event: any) => {
  selectedCalibrationRun.value = selectedCalibrationValidationRun.value = undefined;
  resetUserSelectedEvalValidationRun();
  uiCompareGageId.value = 'All';
  resetUserSelectedEvalCompareRun();
  clearUserCalibrationRunData();
}

const confirmDelete = useConfirm();
const deleteSelectedCalibrationRun = () => {
  const selectedRunId = contextMenuJob.value as number;
  let confirmMessage = "Are you sure you want to delete this calibration run? All associated validation job will also be deleted."
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
}
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
      fetchUserValidatedCalibrationJobsListData();
      resetUserSelectedEvalValidationRun();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  //selectedCalibrationRun.value = undefined;

}

/**
 * Export user's calibration job configuration data to a JSON file
 */
const exportSelectedCalibrationData = async () => {
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id;
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
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Download Results Error for Calibration Job ID ' + selectedRunId, detail: error, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      //isLoading.value = false;
    })
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Download Results Error for Calibration Job ID ' + selectedRunId, detail: 'Data cannot be downloaded for Calibration Job ' + selectedRunId + '.', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

watch(calibrationDownloadJobID, () => {
  if (calibrationDownloadJobID.value) {
    // Display Toast message saying download was successful and then clear the Job ID/filename refs
    // to avoid interfering with next download
    let tDetail = 'Download Results zip file successfully created.'
    if (calibrationDownloadFileName.value) {
      tDetail = 'Download Results zip file "' + calibrationDownloadFileName.value + '" successfully created.'
    }
    const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Download Results Successful for Calibration Job ID ' + calibrationDownloadJobID.value, detail: tDetail, life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
    calibrationDownloadJobID.value = null;
    calibrationDownloadFileName.value = null;
  }
});

const confirmArchive = useConfirm();
const archiveSelectedCalibrationRun = () => {
  const selectedRunId = contextMenuJob.value as number;
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
      refreshJobList();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Archive Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}

const toggleMessagesGroup = () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    //return { backgroundColor: 'gainsboro' }
    return { backgroundColor: 'white' }
  }
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#evaluationRunList {
  height: 80%;
}

#HeadwaterBasinGage {
  width: 300px;
}

#EvalRunTable,
#JobFilterDialog {
  width: 1325px;
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
