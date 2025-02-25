<template>
  <client-only>
    <div class="mx-auto px-8 text-center overflow-auto">
      <div class="width-full">
        <h1 class="mt-10 mb-8 text-3xl font-bold inline-block">Calibration Jobs</h1>
        <Button class="ngenButtonDiv ml-8" @click="createNewCalibration" aria-label="New Calibration Job"
          title="New Calibration Job">New</Button>
        <br />
        <p class="prompt-txt mb-6" style="margin-top:-10px;">
          Double click on a row to open, or right click for more options. Click "New" button for a fresh setup.
        </p>
        <div id="CalTable" class="w-max mx-auto">
          <div class="grid grid-cols-1 mb-5 mt-2">
            <div class="col-span-1 text-left">
              <label for="HeadwaterBasinGage">Headwater Basin Gage Filter</label><br>
              <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter float-left" v-model="uiGageId"
                :options="calibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
                aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select">
              </Select>
            </div>
          </div>
          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white boxed" ref="crContextMenu"
            :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
          <DataTable id="cr-list" :value="filteredData" sortField="calibration_run_id" :sortOrder="-1" scrollable
            scroll-height="400px" table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun"
            selectionMode="single" contextMenu v-model:contextMenuSelection="selectedCalibrationRun"
            @rowContextmenu="onRowContextMenu" :rowStyle="rowStyle" @row-dblclick="onRowDblClick($event)">
            <Column :pt="ptColumn" field="calibration_run_id" header="Job ID" sortable> <template #body="slotProps">
                <span v-if="slotProps.data.calibration_run_id"
                  :aria-label="'Job ID ' + slotProps.data.calibration_run_id"
                  :title="'Job ID ' + slotProps.data.calibration_run_id">
                  {{ slotProps.data.calibration_run_id }}
                </span>
              </template></Column>
            <Column :pt="ptColumn" field="job_genesis" header="Job Genesis" sortable> <template #body="slotProps">
                <span v-if="slotProps.data.job_genesis" :aria-label="'Job Genesis ' + slotProps.data.job_genesis"
                  :title="'Job Genesis ' + slotProps.data.job_genesis">
                  {{ slotProps.data.job_genesis }}
                </span>
              </template></Column>
            <Column :pt="ptColumn" field="formulation_name" header="Formulation Name" sortable> <template
                #body="slotProps">
                <span v-if="slotProps.data.formulation_name"
                  :aria-label="'Formulation Name ' + slotProps.data.formulation_name"
                  :title="'Formulation Name ' + slotProps.data.formulation_name">
                  {{ slotProps.data.formulation_name }}
                </span>
              </template></Column>
            <Column :pt="ptColumn" field="gage_id" header="Headwater Basin Gage" sortable> <template #body="slotProps">
                <span v-if="slotProps.data.gage_id" :aria-label="'Headwater Basin Gag ' + slotProps.data.gage_id"
                  :title="'Headwater Basin Gag ' + slotProps.data.gage_id">
                  {{ slotProps.data.gage_id }}
                </span>
              </template></Column>


            <Column field="created_at" header="Creation Date" sortable>Column
              <template #body="slotProps">
                <span :aria-label="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                  :title="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at) }}
                </span>
              </template>
            </Column>
            <Column field="submit_date" header="Submit Date" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.submit_date"
                  :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                  :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                </span>
              </template>
            </Column>
            <Column header="Calibration Period" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.calibration_start_period || slotProps.data.calibration_end_period"
                  :aria-label="'Calibration Period ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_start_period) + ' to ' + formatDateForDisplay(slotProps.data.calibration_end_period)"
                  :title="'Calibration Period ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_start_period) + ' to ' + formatDateForDisplay(slotProps.data.calibration_end_period)">
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

import type { CalibrationJobListItem, CalibrationJobValidationItem } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";

import { useUserDataStore } from "@/stores/common/UserDataStore"
import { generalStore } from "@/stores/common/GeneralStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { useGageStore } from "@/stores/calibration/GageStore";
import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { useOptimizationStore } from "@/stores/calibration/OptimizationStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";

import { useApiResponseToastSeverityCode, useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { getOverallCalibrationValidationStatus } from "@/utils/CommonHelpers";
import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';

const { loadGageTabStaticData } = useGageStore();
const { loadFormulationTabStaticData } = useFormulationStore();
const { loadOptimizationTabStaticData } = useOptimizationStore();
const { loadTuningTabStaticData, hardResetTuningStore } = useTuningStore();

const { calibrationJobId } = storeToRefs(generalStore());
const { getMenuIndex, addToastRecord } = generalStore();

const { userCalibrationJobsListData, userCalibrationRunData, uiGageId, calibrationRunGageList } = storeToRefs(useUserDataStore());
const { queryUserCalibrationRunData, fetchUserCalibrationJobsListData, clearUserCalibrationRunData } = useUserDataStore();
const { fetchNewCalibrationRunId, deleteCalibrationRun, cloneCalibrationRun } = useCalibrationJobStore();
const { hardResetRunStatusStore } = useRunStatusStore();
import { hilightTab } from '@/composables/TabHilight';

const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

const gstore = generalStore();
const { isLoading } = storeToRefs(gstore);

const selectedCalibrationRun = ref<CalibrationJobListItem>();
const updatedUserCalibrationJobsListData = ref<CalibrationJobListItem[]>();
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

onMounted(async () => {
  if (getMenuIndex() === 1) { // Prevents calling get_calibration_jobs if we are not on the Calibration menu
    hilightTab(CalibrationTabs.tab_calibrationRuns);

    isLoading.value = false;
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); }
    hardResetTuningStore();
    hardResetRunStatusStore();
    await fetchUserCalibrationJobsListData();
    // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
    await updateUserCalibrationJobsListData();
  }
})

// Computed filtered data for DataTables
const filteredData = computed(() => {
  if (!uiGageId.value || uiGageId.value === "All") {
    return updatedUserCalibrationJobsListData?.value;
  } else {
    return updatedUserCalibrationJobsListData?.value?.filter((row) => (row as CalibrationJobListItem).gage_id === uiGageId.value);
  }
});

const onRowDblClick = (e: any) => {
  const data = ref<any>();
  data.value = e.data;
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
    await loadFormulationTabStaticData();
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
    await loadFormulationTabStaticData();
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


</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>