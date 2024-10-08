<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-2">
        <div id="PgTitle">Previous Calibration Runs</div>
      </div>
      <div class="waitgif" v-if="isLoadingCalibrationSummary">
        <img src="@/assets/styles/img/wait.gif" />
      </div>
      <Button id="btn-new-validation" class="start actionBtn" v-if="userSelectedEvalCalibrationRunId > 0" @click.stop="navigateToNewValidation">New Validation</Button>
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

const { userCalibrationRunData } = storeToRefs( useUserDataStore() );
const loadUserCalibrationRunData = reactive( {userCalibrationRunData} );
const { clearUserCalibrationRunData } = useUserDataStore();
const isLoadingCalibrationSummary = ref<boolean>( false );


const toast = useToast();
//this model is for highlighting purpose
const selectedCalibrationRun = ref<CalibrationRun>()

const onEvalCalibrationRowSelect = async ( event: any ) => {  
  loadSelectedCalibrationRun( event.data.calibration_run_id );
  isLoadingCalibrationSummary.value = true;
  // console.log( 'onEvalCalibrationRowSelect', userCalibrationRunData.value );
  
  // await nextTick();
  
  // if ( Object.keys( userCalibrationRunData.value ?? {} ).length > 0 ) {
  //   console.log('here')
  //fetchUserSelectedCalibrationValidationRunList(); 
}

watch( () => userCalibrationRunData.value, ( updatedRunData, initialRunData ) => {
  if ( updatedRunData != undefined && Object.keys( updatedRunData ).length > 0 ) {
    fetchUserSelectedCalibrationValidationRunList(); 
    isLoadingCalibrationSummary.value = false;
  }
});

const onEvalCalibrationRowUnSelect = ( event: any ) => {
    resetUserSelectedEvalCalibrationRun();
}

const navigateToNewValidation = ( event : any ) => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[2];
  e.click();
}

const rowStyle = (data: any) => {
    if (!['Saved', 'Ready'].includes(data.status)) {
        return { backgroundColor: 'gainsboro' }
    }
}

onMounted( () => {
  //clear calibration data if user were on calibraiton tab and clear evaludation previous run data user may have selected
  clearUserCalibrationRunData();
  resetEvaluationCalibrationRunStore();

  fetchUserValidatedCalibrationJobsListData();

  useListen('evaluateCalibrationRubTabAction', ( action ) => {
    if ( action == "ValidateListReset" ) {
      selectedCalibrationRun.value = undefined;
      resetUserSelectedEvalCalibrationRun();
    }
  });

  useListen('evaluateCalibrationRubTabAction', ( action ) => {
    if ( action == "EvaluateCalibrationRun" ) {
      const tabs = document.getElementsByClassName("tabs");
      const e = <HTMLElement>tabs[1];
      e.click();
    }
  });  
});

onUnmounted(() => {
  emitterOff('evaluateCalibrationRubTabAction');
});

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