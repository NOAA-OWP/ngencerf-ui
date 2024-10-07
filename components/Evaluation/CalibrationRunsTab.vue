<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-2">
        <div id="PgTitle">Previous Calibration Runs</div>
      </div>
      <Button id="btn-new-validation" class="start actionBtn" v-if="userSelectedEvalCalibrationRunId > 0">New Validation</Button>
      <div class="row-span-10" v-if="loadUserSelectedCalibrationValidationRunList.length <= 1">
        <div id="CalTable">
          <div class="grid grid-cols-2 mb-5">
              <div class="col-span-1">
                  <div class="inline ">Headwater Basin Gage:
                  <Select id="HeadwaterBasinGage" class="mr-2" v-model="uiGageId"
                  :options="evaluationCalibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder=""></Select>
              </div>
          </div>
          </div>
          
          <DataTable id="cr-list" :value="filteredEvaluationCalibrationRunList" scrollable scroll-height="400px"
              table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun" selectionMode="single"
              :rowStyle="rowStyle" @rowSelect="onEvalCalibrationRowSelect" @rowUnselect="onEvalCalibrationRowUnSelect" class="boxed">
              <Column field="calibration_run_id" header="Run ID" sortable></Column>
              <Column field="run_date" header="Run Date" sortable></Column>
              <Column field="formulation_name" header="formulation_name" sortable></Column>
              <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
              <Column field="objective_function" header="Objective Function" sortable></Column>                        
              <Column field="Optimization" header="Optimization Algorithm" sortable></Column>
              <Column field="validation_runs" header="Validation Runs" sortable></Column>
          </DataTable>
          <!--
          <div v-if="getReferenceDataSetOptions.length > 0">
              <label>Reference Data Set:</label>
              <Select id="referenceDataSets" v-model="uiReferenceDataSet" :options="getReferenceDataSetOptions" optionLabel="description"
              optionValue="name" class="w-full"></Select>
          </div>
          -->
        </div>
      </div>
      <div class="row-span-10" v-if="loadUserSelectedCalibrationValidationRunList.length > 1">
        <div id="evaluationCalibrationList">
          <DataTable id="cr-list" :value="loadUserSelectedCalibrationValidationRunList" scrollable scroll-height="400px"
            table-style="min-width: 50rem" selectionMode="single" v-model:selection="userSelectedCalibrationValidationRunId" :rowStyle="rowStyle" class="boxed">
            <Column field="validation_run_id" header="Validation Run ID" sortable></Column>
            <Column field="run_date" header="Run Date" sortable></Column>
            <Column v-for="col of validatedCalbrationRunParamColumns" :key="col.field" :field="col.field" :header="col.header"></Column>
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
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();

const { 
  filteredEvaluationCalibrationRunList,
  uiGageId, evaluationCalibrationRunGageList,
  getReferenceDataSetOptions,
  uiReferenceDataSet, 
  userSelectedEvalCalibrationRunId,
  userSelectedCalibrationValidationRunId,
  loadUserSelectedCalibrationValidationRunList,
  validatedCalbrationRunParamColumns,
} = storeToRefs( evaluationCalibrationRunStore );

const { 
  fetchUserSelectedCalibrationValidationRunList,
  loadSelectedCalibrationRun,
  resetUserSelectedEvalCalibrationRun,
  fetchUserValidatedCalibrationJobsListData,
  resetUserSelectedCalibrationValidationRunList,
  resetEvaluationCalibrationRunStore
} = evaluationCalibrationRunStore;


const toast = useToast();
const selectedCalibrationRun = ref<CalibrationRun>()

const onEvalCalibrationRowSelect = ( event: any ) => {
  loadSelectedCalibrationRun( event.data.calibration_run_id );
  
  fetchUserSelectedCalibrationValidationRunList();
}

const onEvalCalibrationRowUnSelect = ( event: any ) => {
    resetUserSelectedEvalCalibrationRun();
}

const rowStyle = (data: any) => {
    if (!['Saved', 'Ready'].includes(data.status)) {
        return { backgroundColor: 'gainsboro' }
    }
}

useListen('evaluationResetUiClick', ( actionId ) => {
   if ( actionId == 1 ) {
    selectedCalibrationRun.value = undefined;
    resetUserSelectedEvalCalibrationRun();
   }
});

onMounted( () => {
  resetEvaluationCalibrationRunStore();
  fetchUserValidatedCalibrationJobsListData();
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

.actionBtn {
  display: inline-block;
  width: 95%;
  height: 55px;
  border: 5px solid #59b4c1;
  border-radius: 10px;
  margin-right: 20px;
}

.start {
  background-color: #155e29;
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