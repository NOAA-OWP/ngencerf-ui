<template>
    <div class="h-full min-h-screen ">
        <div id="PgTitle">Previous Calibration Runs</div>

        <div id="CalTable">

            <div class="inline">Headwater Basin Gage
                <Select id="HeadwaterBasinGage" class="mr-2">
                    <option value="">...</option>
                </Select>
            </div>

            <div class="mt-8">
                <ConfirmDialog></ConfirmDialog>
                <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
                    :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
                <DataTable id="cr-list" :value="fetchJobsListData" scrollable scroll-height="400px"
                    table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun" selectionMode="single"
                    contextMenu v-model:contextMenuSelection="selectedCalibrationRun" @rowContextmenu="onRowContextMenu"
                    :rowStyle="rowStyle" class="boxed">
                    <Column field="calibration_run_id" header="Run ID" sortable></Column>
                    <Column field="formulation_name" header="Formulation Name" sortable></Column>
                    <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
                    <Column field="submit_date" header="Run Date" sortable></Column>
                    <Column field="calibration_start_period" header="Calibration Period" sortable></Column>
                    <Column field="status" header="Status" sortable></Column>
                </DataTable>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import type { CalibrationRun } from "~/composables/NextGenModel";
//import { useCalibrationRunStore } from "~/stores/CalibrationRunStore";
import { useCalibrationJobStore } from "~/stores/common/CalibrationJobStore";
import { storeToRefs } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
const { getEvalRunSelected, setEvalRunSelected } = generalStore();

const toast = useToast();
const crContextMenu = ref() //calibration run context menu
const selectedCalibrationRun = ref<CalibrationRun>()
const cmCalibrationRun = ref([
    { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun(selectedCalibrationRun) },
    { label: 'Clone', icon: 'pi pi-fw-pisearch', command: () => cloneSelectedCalibrationRun(selectedCalibrationRun) },
    { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun) }
])
const onRowContextMenu = (event: any) => {
    crContextMenu.value.show(event.originalEvent)
}

const calibrationJobStore = useCalibrationJobStore()
const { fetchJobsListData } = storeToRefs(calibrationJobStore)
const { fetchNewCalibrationRunId } = calibrationJobStore

import { hilightTab } from '~/composables/TabHilight';
onMounted(() => {
  hilightTab(VerificationTabs.tab_calibrationRuns);
  
})


// async function initCalibrationRunList() {
//     await calibrationRunStore.retrieveCalibrationRuns()
// }

const openSelectedCalibrationRun = (selectedCalibrationRun: any) => {
    setEvalRunSelected(true);
    if (['Done', 'Failed', 'SEVER_ERROR'].includes(selectedCalibrationRun.value.status)) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.runId + ' will open Forumulation tab', life: 3000 })
    if (['Saved', 'Ready'].includes(selectedCalibrationRun.value.status)) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.runId + ' will open corresponding saved tab', life: 3000 })
    if (['Running'].includes(selectedCalibrationRun.value.status)) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.runId + ' will open Run/Status tab', life: 3000 })
}

const cloneSelectedCalibrationRun = (selectedCalibrationRun: any) => {
    console.log('clone')
    console.log(selectedCalibrationRun.value.runId)
    toast.add({ severity: 'info', summary: 'Open', detail: 'Will go to Calibration\' Headwater Basin Gage tab with new ID', life: 3000 })
}

const confirmDelte = useConfirm();

const deleteSelectedCalibrationRun = (selectedCalibrationRun: any) => {
    const selectedRunId = selectedCalibrationRun.value.runId
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
    // refreshJobListData()
    selectedCalibrationRun.value = undefined
}

const rowStyle = (data: any) => {
    if (!['Saved', 'Ready'].includes(data.status)) {
        //return { backgroundColor: 'gainsboro' }
        return { backgroundColor: 'white' }
    }
}

const NewCalibration = async () => {
    // Hide this tab and active forumulation tab
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
    width: 1000px;
    margin: 0 auto;
    .table {
        thead tr th {
            background-color: #F5A4A4;
            border: 1px solid #000;
        }
    }
}

.p-select {
    width: 300px;
    border: 1px solid #ccc !important;
    height: 40px;
}
</style>