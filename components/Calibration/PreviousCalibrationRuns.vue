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
            <JobFilterDialog id="JobFilterDialog" @ApplyJobFilters="applyJobFilters()"
              :calJobs="updatedUserCalibrationJobsListData" ref="jobFilterDialog" />
            <ConfirmDialog></ConfirmDialog>
            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
              :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
            <DataTable id="Datatable" :value="updatedUserCalibrationJobsListData" sortField="calibration_run_id"
              :sortOrder="-1" scrollable scroll-height="400px" table-style="min-width: 50rem; z-index: 1" scrollY="true"
              v-model:selection="selectedCalibrationRun" selectionMode="single" contextMenu
              v-model:contextMenuSelection="selectedCalibrationRun" @rowContextmenu="onRowContextMenu"
              :rowStyle="rowStyle" @row-dblclick="onRowDblClick($event)">
              <Column :pt="ptColumn" field="calibration_run_id" header="Job ID" sortable>
                <template #body="slotProps">
                  <span v-if="slotProps.data.calibration_run_id"
                    :aria-label="'Job ID ' + slotProps.data.calibration_run_id"
                    :title="'Job ID ' + slotProps.data.calibration_run_id">
                    {{ slotProps.data.calibration_run_id }}
                  </span>
                </template>
              </Column>
              <Column :pt="ptColumn" field="gage_id" header="Headwater Basin Gage" sortable>
                <template #body="slotProps">
                  <span v-if="slotProps.data.gage_id" :aria-label="'Headwater Basin Gag ' + slotProps.data.gage_id"
                    :title="'Headwater Basin Gag ' + slotProps.data.gage_id">
                    {{ slotProps.data.gage_id }}
                  </span>
                </template>
              </Column>
              <Column :pt="ptColumn" field="formulation_name" header="Formulation Name" sortable>
                <template #body="slotProps">
                  <span v-if="slotProps.data.formulation_name"
                    :aria-label="'Formulation Name ' + slotProps.data.formulation_name"
                    :title="'Formulation Name ' + slotProps.data.formulation_name">
                    {{ slotProps.data.formulation_name }}
                  </span>
                </template>
              </Column>
              <Column :pt="ptColumn" field="job_genesis" header="Job Genesis" sortable>
                <template #body="slotProps">
                  <span v-if="slotProps.data.job_genesis" :aria-label="'Job Genesis ' + slotProps.data.job_genesis"
                    :title="'Job Genesis ' + slotProps.data.job_genesis">
                    {{ slotProps.data.job_genesis }}
                  </span>
                </template>
              </Column>
              <Column field="created_at" header="Creation Date" sortable>Column
                <template #body="slotProps">
                  <span :aria-label="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                    :title="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                    class="nowrap">
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at) }}
                  </span>
                </template>
              </Column>
              <Column field="submit_date" header="Submit Date" sortable>
                <template #body="slotProps">
                  <span v-if="slotProps.data.submit_date"
                    :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                    :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                    class="nowrap">
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                  </span>
                </template>
              </Column>
              <Column header="Calibration Period" sortable>
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
                    {{ (slotProps.data.is_archived ? "Archived/" : "") + slotProps.data.status }}
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
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

//const LazyJobFilterDialog = defineAsyncComponent(() => import("@/components/Common/JobFilterDialog.vue"));
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"

import type { CalibrationJobListItem, CalibrationJobValidationItem } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";

import { useUserDataStore } from "@/stores/common/UserDataStore"
import { generalStore } from "@/stores/common/GeneralStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { useGageStore } from "@/stores/calibration/GageStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { useOptimizationStore } from "@/stores/calibration/OptimizationStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";

import { useApiResponseToastSeverityCode, useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { getOverallCalibrationValidationStatus } from "@/utils/CommonHelpers";
import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';

const { loadGageTabStaticData } = useGageStore();

const { loadOptimizationTabStaticData } = useOptimizationStore();
const { loadTuningTabStaticData, hardResetTuningStore } = useTuningStore();

const { calibrationJobId } = storeToRefs(generalStore());
const { getMenuIndex, addToastRecord } = generalStore();

const { userCalibrationJobsListData, userCalibrationRunData, uiGageId, modulesFilterList,
  statusTypeFilterList, includeArchivedJobs } = storeToRefs(useUserDataStore());
const { queryUserCalibrationRunData, fetchUserCalibrationJobsListData, clearUserCalibrationRunData } = useUserDataStore();
const { fetchNewCalibrationRunId, deleteCalibrationRun, cloneCalibrationRun, archiveCalibrationRun } = useCalibrationJobStore();
const { hardResetRunStatusStore } = useRunStatusStore();
import { hilightTab } from '@/composables/TabHilight';

const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

const gstore = generalStore();
const { isLoading } = storeToRefs(gstore);

const showFilters = ref<boolean>(false);

const selectedCalibrationRun = ref<CalibrationJobListItem>();

const updatedUserCalibrationJobsListData = ref<CalibrationJobListItem[]>([]);

const currentJobsList = ref<CalibrationJobListItem[]>();


const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Clone', icon: 'pi pi-fw-pisearch', command: () => cloneSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun, false) },
  { label: 'Archive', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun, true) }
]);

const cmArchiveRun = ref([
  { label: 'Un-archive', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun, true) }
]);

const onRowContextMenu = (event: any) => {
  crContextMenu.value.show(event.originalEvent);
};

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

onMounted(async () => {
  if (getMenuIndex() === 1) { // Prevents calling get_calibration_jobs if we are not on the Calibration menu
    hilightTab(CalibrationTabs.tab_calibrationRuns);

    isLoading.value = false;
    includeArchivedJobs.value = false;
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); }
    hardResetTuningStore();
    hardResetRunStatusStore();
    await fetchUserCalibrationJobsListData();
    // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
    await updateUserCalibrationJobsListData();
  }
})



let listcals: CalibrationJobListItem[];
const applyJobFilters = async () => {
  let newCalJobList: CalibrationJobListItem[];
  let fullJobList: CalibrationJobListItem[];
  let list: CalibrationJobListItem[];
  await updateUserCalibrationJobsListData();

  if (updatedUserCalibrationJobsListData?.value) {

    // Filter Headwater Basin Gage for the initial whole list
    if (!uiGageId.value || uiGageId.value === "All") {
      fullJobList = updatedUserCalibrationJobsListData?.value;
    } else {
      fullJobList = updatedUserCalibrationJobsListData?.value?.filter((row) => (row as CalibrationJobListItem).gage_id === uiGageId.value);
    }

    // Get calibrations
    listcals = (statusTypeFilterList.value.length > 0) ? fullJobList.filter((job) => statusTypeFilterList.value.includes(job.status)) : fullJobList;

    // Get evaluations
    list = fullJobList.filter(job =>
      job.validations.length > 0 &&
      job.validations.some(validation => statusTypeFilterList.value.includes(validation.status))
    );
    // Combine lists
    fullJobList = [...listcals, ...list];

    if (modulesFilterList.value.length) {
      list = fullJobList.filter(job =>
        job.modules.some(module => modulesFilterList.value.includes(module))
      );
      fullJobList = list;
    }

    updatedUserCalibrationJobsListData.value = fullJobList.filter((job, index, self) =>
      index === self.findIndex(j => j.calibration_run_id === job.calibration_run_id)
    );
  }
};


// const clearCalibrationFilters = () => {
//   if (jobFilterDialog.value) {
//     jobFilterDialog.value.externalResetFilters();
//   }
// };

const filtersExist = computed(() => {
  return (modulesFilterList.value.length !== 0 || statusTypeFilterList.value.length !== 0 || uiGageId.value != "All")
});

// Template for the "Archived" column (Yes/No display)
const archivedTemplate = (rowData: any) => {
  return rowData.archived ? 'Yes' : 'No';
};

const onRowDblClick = (e: any) => {
  const data = ref<any>();
  data.value = e.data;
  if( data.value.is_archived ) {
    alert("You cannot open an archived job. You must un-archive it first.")
    return;
  }
  openSelectedCalibrationRun(data)
}

const openSelectedCalibrationRun = async (selectedCalibrationRun: any) => {
  isLoading.value = true;
  //keep the following for references purpose
  /*
  if( ['Done','Failed','SEVER_ERROR'].includes( selectedCalibrationRun.value.status ) ) const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Results tab', life: ToastTimeout.timeout3000 };
    toast.add(tMsg); addToastRecord(tMsg);
  if( ['Saved','Ready'].includes( selectedCalibrationRun.value.status ) ) const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open corresponding saved tab', life: ToastTimeout.timeout3000 };
    toast.add(tMsg); addToastRecord(tMsg);
  if( ['Running'].includes( selectedCalibrationRun.value.status ) ) const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Run/Status tab', life: ToastTimeout.timeout3000 };
    toast.add(tMsg); addToastRecord(tMsg);
  */
  calibrationJobId.value = selectedCalibrationRun.value.calibration_run_id;
  queryUserCalibrationRunData().then(queryResponse => {
    userCalibrationRunData.value = queryResponse?._data;
    loadEntireRun();
    isLoading.value = false;
  });
}

const loadEntireRun = () => {
  isLoading.value = true;
  nextTick(async () => {
    await loadGageTabStaticData();
    isLoading.value = true;
    await loadTuningTabStaticData();
    await loadOptimizationTabStaticData();
    isLoading.value = false;
    gotoRunStatusTab();
  })

}
const gotoRunStatusTab = () => {
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[CalibrationTabs.tab_statusRun] as HTMLElement;
  e.click();
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    //return { backgroundColor: 'gainsboro' };
    return { backgroundColor: 'white' };
  }
}

const createNewCalibration = async () => {
  // Clear out old data
  useGageStore().resetGageStore();
  clearUserCalibrationRunData();

  fetchNewCalibrationRunId().then(response => {
    if (response.status == 201) {
      if (response?._data && response?._data?.calibration_run_id && response?._data?.calibration_run_id > 0) {
        calibrationJobId.value = response?._data?.calibration_run_id;
        queryUserCalibrationRunData().then(queryResponse => {
          userCalibrationRunData.value = queryResponse?._data;
          gotoHeadwaterBasinGage();
        });
      } else {
        const tMsg: ToastMessageOptions = { severity: "error", summary: 'Create Calibration Job Failed.', detail: "Unable to Retrieve Valid Calibration Job Id", life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Create Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
}

const gotoHeadwaterBasinGage = () => {
  nextTick(async () => {
    await loadGageTabStaticData();
    await loadTuningTabStaticData();
    await loadOptimizationTabStaticData();
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[CalibrationTabs.tab_headwaterBasinGage];
    e.click();
  })

}

/**
 * following section require backend api before them can be implemented
 */
const cloneSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id
  cloneCalibrationRun(selectedRunId).then(async (response) => {
    if (response.status == 200) {
      await fetchUserCalibrationJobsListData();
      // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
      await updateUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Clone Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
};

const confirmDelte = useConfirm();
const deleteSelectedCalibrationRun = (selectedCalibrationRun: any, archiveRun: boolean) => {
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id
  const selectedRunName = (selectedCalibrationRun.value.formulation_name) ? " titled '" + selectedCalibrationRun.value.formulation_name + "'" : " (untitled)";
  let confirmMessage = "Are you sure you want to " + ((archiveRun) ? "archive" : "delete") + " calibration run " + selectedRunId + selectedRunName;
  if (selectedCalibrationRun.value.status == "Running") confirmMessage += " The running calibration will be aborted."

  confirmDelte.require({
    message: confirmMessage,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: ((archiveRun) ? "ARCHIVE" : "DELETE"),
    },
    accept: () => (archiveRun) ? acceptDelete(selectedRunId) : acceptArchive(selectedRunId),
    reject: () => {
      //do nothing
    }
  })
}
const acceptDelete = (selectedRunId: number) => {
  deleteCalibrationRun(selectedRunId).then(async (response) => {
    if (response.status == 200) {
      await fetchUserCalibrationJobsListData();
      // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
      await updateUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}

const acceptArchive = (selectedRunId: number) => {
  archiveCalibrationRun(selectedRunId).then(async (response) => {
    if (response.status == 200) {
      await fetchUserCalibrationJobsListData();
      // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
      await updateUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Archive Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}
/**
 * Populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
 */
const updateUserCalibrationJobsListData = async (): Promise<void> => {
  // set updatedUserCalibrationJobsListData to userCalibrationJobsListData, but with the updated status for the job to include the validation status
  updatedUserCalibrationJobsListData.value = await Promise.all(
    userCalibrationJobsListData.value
      .map(async (calibrationJob: CalibrationJobListItem) => {
        // if Calibration job is done, get validation statuses and update the overall status
        if (calibrationJob.status === 'Done') {
          const validationControlJobStatus: string | undefined = calibrationJob.validations?.find((validation: CalibrationJobValidationItem) => validation.validation_type === 'valid_control')?.status;

          const validationBestJobStatus: string | undefined = calibrationJob.validations?.find
            ((validation: CalibrationJobValidationItem) => validation.validation_type === 'valid_best')?.status;

          // get the overall calibration/validation status
          const overallCalibrationValidationStatus: string = getOverallCalibrationValidationStatus(
            calibrationJob.status,
            validationControlJobStatus,
            validationBestJobStatus
          );

          // save userCalibrationJobsListData with the updated status for the job
          return {
            ...calibrationJob,
            status: overallCalibrationValidationStatus
          };
        } else {
          // Calibration is not done, so just return the job data with the status as is
          return calibrationJob;
        }
      })
  );
};

/**
 * Toggle filters on/off
 * 
 */
const toggleShowFilters = () => {
  currentJobsList.value = updatedUserCalibrationJobsListData.value;
  showFilters.value = !showFilters.value;
}


/**
 * Create a comma separated list of module names
 * 
 * returns string array
 */
const getModuleFilterList = () => {
  let l = "";
  modulesFilterList.value.forEach((e, idx) => {
    l += e;
    if (idx !== modulesFilterList.value.length - 1) {
      l += ", ";
    }
  });
  return l;
}
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
  width: 1350px;
  margin: 0 auto;
}

#CalTable {
  min-height: 400px
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
  color: global.$color-blue;
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
  color: global.$color-blue;
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
  width: 1225px !important;
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
</style>