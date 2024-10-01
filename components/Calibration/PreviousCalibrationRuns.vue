<template>

  <div class="mx-auto px-8 text-center overflow-auto">
    <div class="flex mt-10">
      <div class="">
        <h1 class="mt-1 mb-8 text-3xl font-bold">Previous Calibration Runs *</h1>
      </div>
      <div class="ml-auto mt-2">
        <span id="NewButton" class="ngenButtonDiv-alt bg-blue4"
          @click="createNewCalibration"><button>New</button></span>
      </div>
    </div>

    <div class="width-full">
      <div id="CalTable" class="w-full">
        <ConfirmDialog></ConfirmDialog>
        <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
          :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
        <DataTable id="cr-list" :value="userCalibrationJobsListData" sortField="calibration_run_id" :sortOrder="-1"
          scrollable scroll-height="400px" table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun"
          selectionMode="single" contextMenu v-model:contextMenuSelection="selectedCalibrationRun"
          @rowContextmenu="onRowContextMenu" :rowStyle="rowStyle">
          <Column field="calibration_run_id" header="Run ID" sortable></Column>
          <Column field="formulation_name" header="Formulation Name" sortable>
          </Column>
          <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
          <Column field="run_date" header="Run Date" sortable></Column>
          <Column header="Calibration Period" sortable>
            <template #body="slotProps">
              {{ slotProps.data.calibration_start_period }} <span v-if="slotProps.data.calibration_end_period">to</span>
              {{ slotProps.data.calibration_end_period }}
            </template>
          </Column>
          <Column field="status" header="Status" sortable></Column>
        </DataTable>
      </div>
      <div class="asteriskText text-left mt-2">
        * Right click on a row for Open, Clone or Delete options, or click on then New
        button.
      </div>

    </div>
  </div>

  <div class="waitgif" v-if="loading">
    <img src="@/assets/styles/img/wait.gif" />
  </div>
</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { onMounted } from "vue";

import type { JobListItem } from "~/composables/NextGenModel";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "~/stores/common/GeneralStore";
import { useCalibrationJobStore } from "~/stores/CalibrationJobStore";
import { storeToRefs } from "pinia";
import { useGageStore } from "~/stores/calibration/GageStore";

const loading = ref(true);

const calibrationJobStore = useCalibrationJobStore();
const { calibrationJobId } = storeToRefs(generalStore());
const { userCalibrationJobsListData, userCalibrationRunData } = storeToRefs(useUserDataStore());
const { queryUserCalibrationRunData, fetchUserCalibrationJobsListData, clearUserCalibrationRunData } = useUserDataStore();
const { fetchNewCalibrationRunId } = calibrationJobStore;
const {
  calibrationTabIndex,
  evaluationTabIndex,
  forecastTabIndex } = storeToRefs(generalStore())
const toast = useToast();
const crContextMenu = ref() //calibration run context menu

const selectedCalibrationRun = ref<JobListItem>()
const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Clone', icon: 'pi pi-fw-pisearch', command: () => cloneSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun) }
]);
const onRowContextMenu = (event: any) => {
  crContextMenu.value.show(event.originalEvent)
};

onMounted(() => {
  // calibrationTabIndex.value = "1";
  // evaluationTabIndex.value = "1";
  // forecastTabIndex.value = "1";
  // useGageStore().resetGageStore();
  // clearUserCalibrationRunData();
  setTimeout(function () {
    loading.value = false;
  }, 500);
})

const openSelectedCalibrationRun = async (selectedCalibrationRun: any) => {
  loading.value = true;
  //keep the following for references purpose
  /*
  if( ['Done','Failed','SEVER_ERROR'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Results tab', life: 3000 })
  if( ['Saved','Ready'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open corresponding saved tab', life: 3000 })
  if( ['Running'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Run/Status tab', life: 3000 })
  */
  calibrationJobId.value = selectedCalibrationRun.value.calibration_run_id;
  queryUserCalibrationRunData().then(queryResponse => {
    userCalibrationRunData.value = queryResponse?._data;
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[1] as HTMLElement;
    e.click();
  });
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'gainsboro' };
  }
}

const createNewCalibration = async () => {
  // Clear out old data
  useGageStore().resetGageStore();
  clearUserCalibrationRunData();

  const fetchedId = await fetchNewCalibrationRunId()
  if (fetchedId != undefined) {
    calibrationJobId.value = fetchedId
    if (calibrationJobId.value > 0) {
      queryUserCalibrationRunData().then(queryResponse => {
        userCalibrationRunData.value = queryResponse?._data;
        gotoHeadwaterBasinGage();
      });
    } else {
      toast.add({ severity: 'error', summary: 'Open', detail: 'Error fetching new calibration run ID', life: 3000 });
    }
  }
}

const gotoHeadwaterBasinGage = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[1];
  e.click();
}

/**
 * following section require backend api before them can be implemented
 */
const cloneSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  toast.add({ severity: 'info', summary: 'Open', detail: 'Will go to Calibration\' Headwater Basin Gage tab with new ID', life: 3000 })
  fetchUserCalibrationJobsListData();
}

const confirmDelte = useConfirm();
const deleteSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  const confirm_delete = ref(false)
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id
  let confirmMessage = "Are you sure you want to delete?"
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
      label: 'Save',
    },
    accept: () => acceptDelete(selectedRunId),
    reject: () => {
      //do nothing
    }
  })
}
const acceptDelete = (selectedRunId: number) => {
  toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Run ID ' + selectedRunId + ' deleted', life: 3000 })
  fetchUserCalibrationJobsListData()
  selectedCalibrationRun.value = undefined
}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#CalTable {
  border: 1px solid $ngwcp_primary1;

  /*.table {
      thead tr th {
        background-color: #F5A4A4;
        border: 1px solid #000;
      }
    }*/
}
</style>