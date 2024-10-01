<template>
    <div class="pl-6 pr-2 pt-2">

        <div class="flex mt-2">
            <div class="">
            <h1 class="mt-1 mb-6 font-bold">Previous Calibration Runs</h1>
            </div>
            <div class="ml-auto mt-2">
                <!--TO-DO: this is supposed to be a conditional display-->
                <span id="NewButton" class="ngenButtonDiv-alt bg-blue4"><button>New Validation</button></span>
            </div>
        </div>
        
        <div id="CalTable">

            <div class="grid grid-cols-3 mb-5">
                <!--<div class="col-span-1">
                    <div class="inline ml-2">Filter Validation Runs: 
                        <Select id="FilterCalRuns" class="">
                            <option value="">...</option>
                        </Select>
                    </div>    
                </div>-->

                <div class="col-span-1">
                    <label for="HeadwaterBasinGage">Headwater Basin Gage:</label><br/>
                    <!--TO-DO: this is a placeholder for the button that needs to be added-->
                    <Select id="HeadwaterBasinGage" class="p-select">
                        <option value="">...</option>
                    </Select>
                </div>
            </div>

            <ConfirmDialog></ConfirmDialog>
            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
                :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
            <DataTable id="cr-list boxed" :value="fetchJobsListData" scrollable scroll-height="400px"
                table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun" selectionMode="single"
                contextMenu v-model:contextMenuSelection="selectedCalibrationRun"
                @rowContextmenu="onRowContextMenu" :rowStyle="rowStyle" class="">
                <Column field="calibration_run_id" header="Run ID" sortable></Column>
                <Column field="formulation_name" header="Formulation Name" sortable></Column>
                <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
                <Column field="run_date" header="Run Date" sortable></Column>
                <Column field="calibration_start_period" header="Calibration Period" sortable></Column>
                <Column field="status" header="Status" sortable></Column>
            </DataTable>
        </div>

        <br clear="all">
        <br clear="all">
        <br clear="all">

    </div>
</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import type { CalibrationRun } from "~/composables/NextGenModel";
//import { useCalibrationRunStore } from "~/stores/CalibrationRunStore";
import { useCalibrationJobStore } from "~/stores/CalibrationJobStore";
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
    const confirm_delete = ref(false)
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
        return { backgroundColor: 'gainsboro' }
    }
}

const NewCalibration = async () => {
    // Hide this tab and active forumulation tab
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>