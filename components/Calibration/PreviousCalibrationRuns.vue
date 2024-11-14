<template>

  <div class="mx-auto px-8 text-center overflow-auto">
    <div class="width-full">
      <h1 class="mt-10 mb-8 text-3xl font-bold inline-block">Calibration Jobs *</h1>
      <span class="ngenButtonDiv-alt bg-blue4 ml-8" @click="createNewCalibration"><button>New</button>
      </span>

      <div id="CalTable" class="w-max mx-auto">
        <ConfirmDialog></ConfirmDialog>
        <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
          :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
        <DataTable id="cr-list" :value="userCalibrationJobsListData" sortField="calibration_run_id" :sortOrder="-1"
          scrollable scroll-height="400px" table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun"
          selectionMode="single" contextMenu v-model:contextMenuSelection="selectedCalibrationRun"
          @rowContextmenu="onRowContextMenu" :rowStyle="rowStyle" @row-dblclick="onRowDblClick($event)"
          @rowDblselect="openSelectedCalibrationRun(selectedCalibrationRun)">
          <Column field="calibration_run_id" header="Job ID" sortable></Column>
          <Column field="job_genesis" header="Job Genesis" sortable></Column>
          <Column field="formulation_name" header="Formulation Name" sortable></Column>
          <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
          <Column field="created_at" header="Create Day" sortable>
            <template #body="slotProps">
              {{ formatDateForDisplay( slotProps.data.created_at ) }}
            </template>
          </Column>
          <Column field="run_date" header="Run Date" sortable>
            <template #body="slotProps">
              <span v-if="slotProps.data.run_date">
              {{ formatDateForDisplay( slotProps.data.run_date ) }}
              </span>
            </template>
          </Column>
          <Column header="Calibration Period" sortable>
            <template #body="slotProps">
              <span v-if="slotProps.data.calibration_start_period || slotProps.data.calibration_end_period">
              {{ formatDateForDisplay( slotProps.data.calibration_start_period ) }} <span v-if="slotProps.data.calibration_end_period">to</span>
              {{ formatDateForDisplay( slotProps.data.calibration_end_period ) }}
              </span>
            </template>
          </Column>
          <Column field="status" header="Status" sortable></Column>
        </DataTable>
      </div>
      <div class="mt-4 mx-auto">
        * Double click on a row to open, or right click for other options. Click "New" for a fresh setup.</div>
    </div>
  </div>

  <div class="waitgif" v-if="isLoading">
    <img src="@/assets/styles/img/wait.gif" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { JobListItem } from "~/composables/NextGenModel";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "~/stores/common/GeneralStore";
import { useCalibrationJobStore } from "~/stores/common/CalibrationJobStore";
import { storeToRefs } from "pinia";
import { useGageStore } from "~/stores/calibration/GageStore";
import { useFormulationStore } from "~/stores/calibration/FormulationStore";
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { useOptimizationStore } from "~/stores/calibration/OptimizationStore";
import { useRunStatusStore } from "~/stores/calibration/RunStatusStore";
import { useApiResponseToastSeverityCode, useApiErrorResponsePreprocess } from "~/composables/ValidationHandlers";
import { formatDateForDisplay } from '~/utils/TimeHelpers';

const { loadGageTabStaticData, gageStore_data_loading } = useGageStore();
const { loadFormulationTabStaticData, formulationStore_data_loading } = useFormulationStore();
const { loadOptimizationTabStaticData, optimizationStore_data_loading } = useOptimizationStore();
const { loadTuningTabStaticData, tuningStore_data_loading, hardResetTuningStore } = useTuningStore();
const { calibrationJobId} = storeToRefs(generalStore());
const { getCalibrationTabIndex } = generalStore();
const { userCalibrationJobsListData, userCalibrationRunData } = storeToRefs(useUserDataStore());
const { queryUserCalibrationRunData, fetchUserCalibrationJobsListData, clearUserCalibrationRunData } = useUserDataStore();
const { fetchNewCalibrationRunId, deleteCalibrationRun, cloneCalibrationRun } = useCalibrationJobStore();
const { hardResetRunStatusStore } = useRunStatusStore();

const toast = useToast();
const crContextMenu = ref(); //calibration run context menu
const isLoading = ref(true);
const selectedCalibrationRun = ref<JobListItem>();
const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Clone', icon: 'pi pi-fw-pisearch', command: () => cloneSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun) }
]);
const onRowContextMenu = (event: any) => {
  crContextMenu.value.show(event.originalEvent);
};

onMounted(() => {
  isLoading.value = false;

  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  hardResetTuningStore();
  hardResetRunStatusStore();
  fetchUserCalibrationJobsListData();
})

/**
 * This is a hack, for sure.
 * When a run is selected, the Status/Run tab is not being underlined.
 * This does it for now, but the actual cause needs to be found!
 */
onUnmounted(() => {
 setTimeout(() => {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[getCalibrationTabIndex() - 1];
    e.click();
  }, 250);
})

const onRowDblClick = (e: any)  => {
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

  fetchNewCalibrationRunId().then( response => {
    if ( response.status == 201 ) {
      if ( response?._data && response?._data?.calibration_run_id && response?._data?.calibration_run_id > 0 ) {
        calibrationJobId.value = response?._data?.calibration_run_id;
        queryUserCalibrationRunData().then(queryResponse => {
          userCalibrationRunData.value = queryResponse?._data;
          gotoHeadwaterBasinGage();
        });
      } else {
        toast.add({ severity: "error", summary: 'Create Calibration Job Failed.', detail: "Unable to Retrieve Valid Calibration Job Id", life: 10000 });
      }      
    } else {
      useApiErrorResponsePreprocess( response ).forEach( message => {
        toast.add({ severity: useApiResponseToastSeverityCode( response?.status ), summary: 'Create Calibration Job Failed.', detail: message, life: 10000 });
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
  cloneCalibrationRun(selectedRunId).then( response => {
    if ( response.status == 200 ) {
      fetchUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess( response ).forEach( message => {
        toast.add({ severity: useApiResponseToastSeverityCode( response?.status ), summary: 'Clone Calibration Job Failed.', detail: message, life: 10000 });
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
  deleteCalibrationRun(selectedRunId).then( response => {
    if ( response.status == 200 ) {
      fetchUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess( response ).forEach( message => {
        toast.add({ severity: useApiResponseToastSeverityCode( response?.status ), summary: 'Delete Calibration Job Failed.', detail: message, life: 10000 });
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#CalTable {
  border: 1px solid $ngwcp_primary1;
}
</style>