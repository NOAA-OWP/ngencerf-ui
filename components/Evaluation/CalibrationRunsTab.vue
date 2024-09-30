<template>
    <div class="h-full min-h-screen ">
        <div class="grid grid-rows-12">
            <div class="row-span-2">
                <div id="PgTitle">Previous Calibration Runs</div>
            </div>
            <div class="row-span-10">
                <div id="CalTable">

                    <div class="grid grid-cols-2 mb-5">
                        <div class="col-span-1">
                            <div class="inline ml-2">Filter Validation Runs: 
                            <Select id="FilterCalRuns" class="">
                                <option value="">...</option>
                            </Select>
                        </div>    
                        </div>

                        <div class="col-span-1">
                            <div class="inline ">Headwater Basin Gage:
                            <Select id="HeadwaterBasinGage" class="mr-2" v-model="uiGageId"
                            :options="evaluationCalibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder=""></Select>
                        </div>
                    </div>
                    </div>
                    
                    <ConfirmDialog></ConfirmDialog>
                    <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
                        :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
                    <DataTable id="cr-list" :value="filteredEvaluationCalibrationRunList" scrollable scroll-height="400px"
                        table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun" selectionMode="single"
                        contextMenu v-model:contextMenuSelection="selectedCalibrationRun"
                        @rowContextmenu="onRowContextMenu" :rowStyle="rowStyle" @rowSelect="onEvalCalibrationRowSelect" @rowUnselect="onEvalCalibrationRowUnSelect" class="boxed">
                        <Column field="calibration_run_id" header="Run ID" sortable></Column>
                        <Column field="run_date" header="Run Date" sortable></Column>
                        <Column field="formulation_name" header="formulation_name" sortable></Column>
                        <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
                        <Column field="objective_function" header="Objective Function" sortable></Column>                        
                        <Column field="Optimization" header="Optimization Algorithm" sortable></Column>
                        <Column field="validation_runs" header="Validation Runs" sortable></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

import type { CalibrationRun } from "~/composables/NextGenModel";
import { useEvaluationCalibrationRunStore } from "~/stores/evaluation/EvaluationCalibrationRunStore";
import { storeToRefs } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();

const { filteredEvaluationCalibrationRunList, uiGageId, evaluationCalibrationRunGageList, userSelectedEvalCalibrationRunId } = storeToRefs( evaluationCalibrationRunStore )
const { fetchEvaluationCalibrationRunList } = evaluationCalibrationRunStore;

const toast = useToast();
const crContextMenu = ref() //calibration run context menu
const selectedCalibrationRun = ref<CalibrationRun>()
const cmCalibrationRun = ref([
    { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun(selectedCalibrationRun) }
])
const onRowContextMenu = (event: any) => {
    crContextMenu.value.show( event.originalEvent );
}

const openSelectedCalibrationRun = (selectedCalibrationRun: any) => {
    if (['Done', 'Failed', 'SEVER_ERROR'].includes(selectedCalibrationRun.value.status)) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.runId + ' will open Forumulation tab', life: 3000 })
    if (['Saved', 'Ready'].includes(selectedCalibrationRun.value.status)) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.runId + ' will open corresponding saved tab', life: 3000 })
    if (['Running'].includes(selectedCalibrationRun.value.status)) toast.add({ severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.runId + ' will open Run/Status tab', life: 3000 })
}

const onEvalCalibrationRowSelect = ( event: any ) => {
    userSelectedEvalCalibrationRunId.value = event.data.calibration_run_id;
}

const onEvalCalibrationRowUnSelect = ( event: any ) => {
    userSelectedEvalCalibrationRunId.value = 0;
}

const rowStyle = (data: any) => {
    if (!['Saved', 'Ready'].includes(data.status)) {
        return { backgroundColor: 'gainsboro' }
    }
}

onMounted( () => {
  fetchEvaluationCalibrationRunList();
})
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
    //border: 1px solid $ngwcp_primary1;

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