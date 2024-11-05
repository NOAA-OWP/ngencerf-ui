<template>
  <div class="h-full min-h-screen pr-2">
    <div class="grid grid-rows-12">
      
      <div class="row-span-2">

        <div class="flex mt-2">
          <div class="w-2/3">
            <h1 class="pt-3 mb-8 text-3xl font-bold inline-block">Previous Calibration Runs</h1>
          </div>
          <div class="ml-auto mt-2">
            <div id="NewButton" class=""><Button id="btn-new-validation" class="ngenButtonDiv-alt bg-blue4" v-if="userSelectedEvalCalibrationRunId > 0" @click.stop="navigateToNewValidation">New Validation</Button></div>
          </div>
        </div>

      </div>
      <div class="waitgif" v-if="isLoadingCalibrationSummary">
        <img src="@/assets/styles/img/wait.gif" />
      </div>

      <div class="row-span-10" v-if="loadUserSelectedCalibrationValidationRunList.length <= 1">
        <div id="CalTable">
          <div class="grid grid-cols-2 mb-5">
              <div class="col-span-1">
                  <div class="inline ">
                      <label for="HeadwaterBasinGage">Headwater Basin Gage Filter</label><br>
                      <Select id="HeadwaterBasinGage" class="mr-2" v-model="uiGageId"
                      :options="evaluationCalibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder=""></Select>
                  </div>
              </div>
          </div>
          
          <DataTable id="cr-list" :value="filteredEvaluationCalibrationRunList" scrollable scroll-height="400px"
              table-style="min-width: 50rem" v-model:selection="selectedCalibrationRun" selectionMode="single"
              :rowStyle="rowStyle" @rowSelect="onEvalCalibrationRowSelect" @rowUnselect="onEvalCalibrationRowUnSelect" class="boxed">
              <Column field="calibration_run_id" header="Job ID" sortable></Column>
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
        //return { backgroundColor: 'gainsboro' }
        return { backgroundColor: 'white' }
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
#HeadwaterBasinGage {width:300px;}
</style>