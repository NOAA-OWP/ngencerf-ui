<template>

  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>
      <div class="h-full grid row-span-10">
        <div class="grid grid-rows-12">
          <div class="row-span-2">
            <div id="PgTitle">Previous Calibration Runs *
              &nbsp;&nbsp;<span id="NewButton" class="ngenButtonDiv inline" @click="NewCalibration"><button>New</button></span>
            </div>
          </div>
          <div class="row-span-10">
            <div id="CalTable">
              <Toast />
              <ConfirmDialog></ConfirmDialog>
              <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
                :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>               
              <DataTable id="cr-list" :value="userCalibrationJobsListData" scrollable scroll-height="400px"
                table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun" selectionMode="single"
                contextMenu v-model:contextMenuSelection="selectedCalibrationRun" @rowContextmenu="onRowContextMenu"
                :rowStyle="rowStyle">
                <Column field="calibration_run_id" header="Run ID" sortable></Column>
                <Column field="formulation_name" header="Formulation Name" sortable></Column>
                <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
                <Column field="run_date" header="Run Date" sortable></Column>
                <Column header="Calibration Period" sortable>
                  <template #body="slotProps">
                    {{ slotProps.data.calibration_start_period }} <span v-if="slotProps.data.calibration_end_period">to</span> {{ slotProps.data.calibration_end_period }}
                  </template>
                </Column>
                <Column field="status" header="Status" sortable></Column>
              </DataTable>
            </div>
            <div class="asteriskText">
              * Right click on a row for Open, Clone or Delete options, or click on then New button.
            </div>
          </div>
        </div>
      </div>
      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import AppFooter from "~/components/Common/AppFooter.vue";
import AppHeader from "~/components/Common/AppHeader.vue";

import type { job_list_item } from "~/composables/NextGenModel";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "~/stores/common/GeneralStore";
import { useCalibrationJobStore } from "~/stores/CalibrationJobStore";
import { storeToRefs } from "pinia";

const calibrationJobStore = useCalibrationJobStore()
const { calibrationJobId } = storeToRefs( generalStore() )
const { userCalibrationJobsListData } = storeToRefs( useUserDataStore() )
const { fetchUserCalibrationJobsListData } = useUserDataStore()
//const { fetchJobsListData } = storeToRefs( calibrationJobStore )
//const { refreshJobListData, fetchNewCalibrationRunId, queryJobsListData } = calibrationJobStore
const { fetchNewCalibrationRunId } = calibrationJobStore

const toast = useToast();
const crContextMenu = ref() //calibration run context menu
//const selectedCalibrationRun = ref<CalibrationRun>()
const selectedCalibrationRun = ref<job_list_item>()
const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Clone', icon: 'pi pi-fw-pisearch', command: () => cloneSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun) }
])
const onRowContextMenu = (event: any) => {
  crContextMenu.value.show(event.originalEvent)
}

// async function initCalibrationRunList() {
//   await fetchCalibrationJobsList()
// }

const openSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  if( ['Done','Failed','SEVER_ERROR'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Results tab', life: 3000 })
  if( ['Saved','Ready'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open corresponding saved tab', life: 3000 })
  if( ['Running'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Run/Status tab', life: 3000 })
  calibrationJobId.value = selectedCalibrationRun.value.calibration_run_id

  navigateTo('/Calibration')
}

const cloneSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  toast.add({ severity: 'info', summary: 'Open', detail: 'Will go to Calibration\' Headwater Basin Gage tab with new ID', life: 3000 })
  //fetchCalibrationJobsList()
}

const confirmDelte = useConfirm();

const deleteSelectedCalibrationRun = ( selectedCalibrationRun: any ) => {
  const confirm_delete = ref( false )
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
  // const reduced_calibration_job_list = calibration_jobs_list.value.filter( ( cr ) => cr.calibration_run_id != selectedRunId )
  // calibration_jobs_list.value = reduced_calibration_job_list
  //refreshJobListData()
  fetchUserCalibrationJobsListData()
  selectedCalibrationRun.value = undefined    
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'gainsboro' }
  }
}


onMounted(() => {
  // console.log( 'onmounted' )
  //queryJobsListData()
  //fetchCalibrationJobsList()
  // console.log(localStorage);
});

const NewCalibration = async () => {
  const fetchedId = await fetchNewCalibrationRunId()
  if( fetchedId != undefined ) {
    calibrationJobId.value = fetchedId.calibration_run_id
    if( calibrationJobId.value > 0 ) {
      await navigateTo("Calibration");
    } else {
      toast.add({ severity: 'error', summary: 'Open', detail: 'Error fetching new calibration run ID', life: 3000 })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#PgTitle {
  text-align: center;
  font-size: 30px;
  margin-top: 40px;
  margin-bottom: 40px;
}

#NewButton {
  width: 147px;
  height: 33px;
  padding: 10px;
  border-radius: 20px;
  font-size: 21px;
}

#CalTable {
  width: 80%;
  margin: 0 auto;
  border: 1px solid $ngwcp_primary1;

  .table {
    thead tr th {
      background-color: #F5A4A4;
      border: 1px solid #000;
    }
  }
}

.asteriskText {
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
  font-size: 1.2em;
}
</style>
