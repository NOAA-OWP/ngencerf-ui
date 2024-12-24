<template>
  <client-only>
    <div class="mx-auto px-8 text-center overflow-auto">
      <div class="width-full">
        <h1 class="mt-10 mb-8 text-3xl font-bold inline-block">Calibration Runs</h1>
        <span class="ngenButtonDiv-alt bg-blue4 ml-8" @click="createNewCalibration"><button>New</button>
        </span>
        <br />
        <p class="prompt-txt mb-6" style="margin-top:-10px;">
              Double click on a row to open, or right click for more options. Click "New" button for a fresh setup.
        </p>
        <div id="CalTable" class="w-max mx-auto">
          <div class="grid grid-cols-1 mb-5 mt-2">
            <div class="col-span-1 text-left">
              <label for="HeadwaterBasinGage">Headwater Basin Gage Filter</label><br>
              <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter float-left" v-model="uiGageId" :options="calibrationRunGageList" filter
                optionLabel="name" optionValue="name" placeholder=""></Select>
            </div>
          </div>
          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white boxed" ref="crContextMenu"
            :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
          <DataTable id="cr-list" :value="updatedUserCalibrationJobsListData" sortField="calibration_run_id" :sortOrder="-1"
            scrollable scroll-height="400px" table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun"
            selectionMode="single" contextMenu v-model:contextMenuSelection="selectedCalibrationRun"
            @rowContextmenu="onRowContextMenu" :rowStyle="rowStyle" @row-dblclick="onRowDblClick($event)">
            <Column :pt="ptColumn" field="calibration_run_id" header="Job ID" sortable></Column>
            <Column :pt="ptColumn" field="job_genesis" header="Job Genesis" sortable></Column>
            <Column :pt="ptColumn" field="formulation_name" header="Formulation Name" sortable></Column>
            <Column :pt="ptColumn" field="gage_id" header="Headwater Basin Gage" sortable></Column>
            <Column field="created_at" header="Creation Date" sortable>Column
              <template #body="slotProps">
                {{ formatDateForDisplay(slotProps.data.created_at) }}
              </template>
            </Column>
            <Column field="submit_date" header="Submit Date" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.submit_date">
                  {{ formatDateForDisplay(slotProps.data.submit_date) }}
                </span>
              </template>
            </Column>
            <Column header="Calibration Period" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.calibration_start_period || slotProps.data.calibration_end_period">
                  {{ formatDateForDisplay(slotProps.data.calibration_start_period) }} <span
                    v-if="slotProps.data.calibration_end_period">to</span>
                  {{ formatDateForDisplay(slotProps.data.calibration_end_period) }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="status" header="Status" sortable></Column>
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
import { onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { JobListItem, ValidationJobListItem } from "@/composables/NextGenModel";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { storeToRefs } from "pinia";
import { useGageStore } from "@/stores/calibration/GageStore";
import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { useOptimizationStore } from "@/stores/calibration/OptimizationStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";
import { useApiResponseToastSeverityCode, useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { getOverallCalibrationValidationStatus } from "@/utils/CommonHelpers";
import { formatDateForDisplay } from '@/utils/TimeHelpers';

const { loadGageTabStaticData, gageStore_data_loading } = useGageStore();
const { loadFormulationTabStaticData, formulationStore_data_loading } = useFormulationStore();
const { loadOptimizationTabStaticData, optimizationStore_data_loading } = useOptimizationStore();
const { loadTuningTabStaticData, tuningStore_data_loading, hardResetTuningStore } = useTuningStore();
const { calibrationJobId } = storeToRefs(generalStore());
const { getCalibrationTabIndex, getMenuIndex } = generalStore();

const { userCalibrationJobsListData, userCalibrationRunData, uiGageId, calibrationRunGageList } = storeToRefs(useUserDataStore());
const { queryUserCalibrationRunData, fetchUserCalibrationJobsListData, clearUserCalibrationRunData } = useUserDataStore();
const { fetchNewCalibrationRunId, deleteCalibrationRun, cloneCalibrationRun } = useCalibrationJobStore();
const { overallCalibrationValidationStatus } = storeToRefs(useRunStatusStore());
const { queryGetCalibrationStatus, hardResetRunStatusStore } = useRunStatusStore();
import { hilightTab } from '@/composables/TabHilight';

const toast = useToast();
const crContextMenu = ref(); //calibration run context menu
const isLoading = ref(true);
const selectedCalibrationRun = ref<JobListItem>();
const updatedUserCalibrationJobsListData = ref<JobListItem[]>();
const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Clone', icon: 'pi pi-fw-pisearch', command: () => cloneSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun) }
]);
const onRowContextMenu = (event: any) => {
  crContextMenu.value.show(event.originalEvent);
};

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

onMounted(() => {
  if (getMenuIndex() === 1) { // Prevents calling get_calibration_jobs if we are not on the Calibration menu
    hilightTab(CalibrationTabs.tab_calibrationRuns);
    isLoading.value = false;
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); }
    hardResetTuningStore();
    hardResetRunStatusStore();
    fetchUserCalibrationJobsListData();
    // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
    updateUserCalibrationJobsListData();
  }
})

const onRowDblClick = (e: any) => {
  const data = ref<any>();
  data.value = e.data;
  openSelectedCalibrationRun(data)
}

const openSelectedCalibrationRun = async (selectedCalibrationRun: any) => {
  isLoading.value = true;
  //keep the following for references purpose
  /*
  if( ['Done','Failed','SEVER_ERROR'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Results tab', life: 3000 })
  if( ['Saved','Ready'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open corresponding saved tab', life: 3000 })
  if( ['Running'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Run/Status tab', life: 3000 })
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
  nextTick(() => {
    loadGageTabStaticData();
    loadFormulationTabStaticData();
    loadTuningTabStaticData();
    loadOptimizationTabStaticData();
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
        toast.add({ severity: "error", summary: 'Create Calibration Job Failed.', detail: "Unable to Retrieve Valid Calibration Job Id", life: 10000 });
      }
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        toast.add({ severity: useApiResponseToastSeverityCode(response?.status), summary: 'Create Calibration Job Failed.', detail: message, life: 10000 });
      });
    }
  });
}

const gotoHeadwaterBasinGage = () => {
  nextTick(() => {
    loadGageTabStaticData();
    loadFormulationTabStaticData();
    loadTuningTabStaticData();
    loadOptimizationTabStaticData();
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
  cloneCalibrationRun(selectedRunId).then(response => {
    if (response.status == 200) {
      fetchUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        toast.add({ severity: useApiResponseToastSeverityCode(response?.status), summary: 'Clone Calibration Job Failed.', detail: message, life: 10000 });
      });
    }
  });
}

const confirmDelte = useConfirm();
const deleteSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  const confirm_delete = ref(false)
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id
  let confirmMessage = "Are you sure you want to delete this run?"
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
    if (response.status == 200) {
      fetchUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        toast.add({ severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: 10000 });
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}

/**
 * Populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
 */
const updateUserCalibrationJobsListData = async (): Promise<void>  => {
  // set updatedUserCalibrationJobsListData to userCalibrationJobsListData, but with the updated status for the job to include the validation status
  updatedUserCalibrationJobsListData.value = await Promise.all(
    userCalibrationJobsListData.value // .filter((job: JobListItem) => job.status === 'Done')
    .map(async (job: JobListItem) => {
      // if the job is done, get the calibration status to include the validation status
      if (job.status === 'Done') {
        // get the calibration status
        const getStatusResponse: any = await queryGetCalibrationStatus(job.calibration_run_id);

        if (getStatusResponse.status === 200) {
          // get validation control and best jobs
          const validationControlJob: ValidationJobListItem | undefined = getStatusResponse?._data?.validations?.find(
          (validationJob: ValidationJobListItem) => validationJob.validation_type === 'valid_control');

          const validationBestJob: ValidationJobListItem | undefined = getStatusResponse?._data?.validations?.find(
            (validationJob: ValidationJobListItem) => validationJob.validation_type === 'valid_best');

          // get the overall calibration/validation status
          const overallCalibrationValidationStatus: string = getOverallCalibrationValidationStatus(
            job.status,
            validationControlJob?.status,
            validationBestJob?.status
          );
          
          // save userCalibrationJobsListData with the updated status for the job
          return {
            ...job,
            status: overallCalibrationValidationStatus
          }; 
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to get calibration status', life: 10000 });
          return job;
        }
      } else {
        // Calibration is not done, so just return the job data with the status as is
        return job;
      }
    })
  );
};


</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>