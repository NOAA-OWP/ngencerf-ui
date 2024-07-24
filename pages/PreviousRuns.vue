<template>
  <div id="PgTitle">Previous Calibration Runs
    &nbsp;&nbsp;<span id="NewButton" @click="NewCalibration"><button>New</button></span></div>
  <div>   
    <div id="CalTable">
      <Toast />
      <ConfirmDialog></ConfirmDialog>
      <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu" :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
      <DataTable id="cr-list" :value="calibrationRuns" scrollable scroll-height="400px" table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun" selectionMode="single" contextMenu v-model:contextMenuSelection="selectedCalibrationRun" @rowContextmenu="onRowContextMenu" :rowStyle="rowStyle">
        <Column field="runId" header="Run ID" sortable></Column>
        <Column field="formulationName" header="Formulation Name" sortable></Column>
        <Column field="headwaterBasinGage" header="Headwater Basin Gage" sortable></Column>
        <Column field="runDate" header="Run Date" sortable></Column>
        <Column field="calibrationPeriod" header="Calibration Period" sortable></Column>
        <Column field="status" header="Status" sortable></Column>
      </DataTable>
    <!-- <DataTable
      class="display table table-hover table-striped"
      width="50%"
    >
      <thead>
        <tr>
          <th>Run ID</th>
          <th>Forumulation Name</th>
          <th>Headwater Basin Gage</th>
          <th>Run Date</th>
          <th>Calibration Period</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Hello</td>
          <td>There</td>
        </tr>
      </tbody>
    </DataTable> -->
</div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

// import DataTable from "datatables.net-vue3";
// import DataTablesCore from "datatables.net";
// import "datatables.net-select";
// import "datatables.net-responsive";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import type { CalibrationRun } from "~/composables/NextGenModel";

import { useCalibrationRunStore } from "~/stores/CalibrationRunStore";
import { storeToRefs } from "pinia";

const toast = useToast();
const crContextMenu = ref() //calibration run context menu
const selectedCalibrationRun = ref<CalibrationRun>()
const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun( selectedCalibrationRun ) },
  { label: 'Clone', icon: 'pi pi-fw-pisearch', command: () => cloneSelectedCalibrationRun( selectedCalibrationRun ) },
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun( selectedCalibrationRun ) }
])
const onRowContextMenu = ( event: any ) => {
  crContextMenu.value.show( event.originalEvent )
}

const calibrationRunStore = useCalibrationRunStore()
const { calibrationRuns } = storeToRefs( calibrationRunStore )

async function initCalibrationRunList() {
  await calibrationRunStore.retrieveCalibrationRuns()
}

const openSelectedCalibrationRun = ( selectedCalibrationRun: any ) => {
  console.log('open')
  console.log( selectedCalibrationRun.value.runId )
  if( ['Done','Failed','SEVER_ERROR'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.runId + ' will open Results tab', life: 3000 })
  if( ['Saved','Ready'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.runId + ' will open corresponding saved tab', life: 3000 })
  if( ['Running'].includes( selectedCalibrationRun.value.status ) ) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.runId + ' will open Run/Status tab', life: 3000 })
}

const cloneSelectedCalibrationRun = ( selectedCalibrationRun: any ) => {
  console.log('clone')
  console.log( selectedCalibrationRun.value.runId )
  toast.add({ severity: 'info', summary: 'Open', detail: 'Will go to Calibration\' Headwater Basin Gage tab with new ID', life: 3000 })
}

const confirmDelte = useConfirm();

const deleteSelectedCalibrationRun = ( selectedCalibrationRun: any ) => {
  const confirm_delete = ref( false )
  const selectedRunId = selectedCalibrationRun.value.runId
  let confirmMessage = "Are you sure you want to delete?"
  if( selectedCalibrationRun.value.status == "Running" ) confirmMessage += " The running calibration will be aborted."
  
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
    accept: () => acceptDelete( selectedRunId ),
    reject: () => {
      //do nothing
    }
  })
}
const acceptDelete = ( selectedRunId: number ) => {
  toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Run ID ' + selectedRunId + ' deleted', life: 3000 })
  const reducedCalibrationRuns = calibrationRuns.value.filter( ( cr ) => cr.runId != selectedRunId )
  calibrationRuns.value = reducedCalibrationRuns
  selectedCalibrationRun.value = undefined    
}

const rowStyle = ( data: any ) => {
  if( !['Saved','Ready'].includes( data.status ) ) {
    return { backgroundColor: 'gainsboro' }
  }
}
//DataTable.use(DataTablesCore);
onMounted(() => {
  console.log( 'onmounted' )
  initCalibrationRunList()
  console.log(localStorage);
});

const NewCalibration = async () => {
  await navigateTo("Calibration");
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
//@import "datatables.net-dt";

#PgTitle {
    text-align:center;
    font-size: 30px;
    margin-top: 40px;
    margin-bottom: 40px;
}
#NewButton {
    width: 147px;
    height: 33px;
    background-color: #105D86;   
    color: #fff;
    padding: 10px;
    border-radius: 20px;
    font-size: 21px;
}
#CalTable {
    width: 80%;
    margin: 0 auto;
    border: 1px solid $ngwcp_primary1;

    .table {
        thead tr th{
            background-color: #F5A4A4;
            border: 1px solid #000;
        }
    }
}


</style>
