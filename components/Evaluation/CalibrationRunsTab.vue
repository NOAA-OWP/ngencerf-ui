<template>
  <client-only>
    <div class="h-screen-inner pr-2">

      <div class="flex mt-2">
        <div class="w-2/3">
          <h1 class="pt-3 mb-8 text-3xl font-bold inline-block">
            <span v-if="computedCalibrationValidationRunList.length <= 1">Previous Calibration Runs</span>
            <span v-if="computedCalibrationValidationRunList.length > 1">Validation Runs for Calibration Job {{ userSelectedEvalCalibrationRunId }}</span>
          </h1>
        </div>
        <div class="ml-auto mt-2">
          <div id="NewButton" class=""><Button id="btn-new-validation" class="ngenButtonDiv-alt bg-blue4"
              v-if="userSelectedEvalCalibrationRunId > 0 && loadCalibrationDataComplete === true"
              @click.stop="navigateToAlternateIteration">New Validation</Button></div>
        </div>
      </div>

      <div id="calibrationRunList"
        v-if="userEvaluationCalibrationRunListData.length > 0 && computedCalibrationValidationRunList.length <= 1">
        <div>
          <div id="CalTable">
            <div class="grid grid-cols-2 mb-5">
              <div class="col-span-1">
                <div class="inline ">
                  <label for="HeadwaterBasinGage">Headwater Basin Gage Filter</label><br>
                  <Select id="HeadwaterBasinGage" class="mr-2" v-model="uiGageId"
                    :options="evaluationCalibrationRunGageList" filter optionLabel="name" optionValue="name"
                    placeholder=""></Select>
                </div>
              </div>
            </div>

            <DataTable id="cr-list" :value="userEvaluationCalibrationRunListData" scrollable scroll-height="400px"
              sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
              v-model:selection="selectedCalibrationRun" selectionMode="single" :rowStyle="rowStyle"
              @rowSelect="onEvalCalibrationRowSelect" @rowUnselect="onEvalCalibrationRowUnSelect" class="boxed">
              <Column field="calibration_run_id" header="Job ID" sortable></Column>
              <Column field="job_genesis" header="Job Genesis" sortable></Column>
              <Column field="created_at" header="Creation Date" sortable>
                <template #body="slotProps">
                  {{ formatDateForDisplay(slotProps.data.created_at) }}
                </template>
              </Column>
              <Column field="submit_date" header="Submit Date" sortable>
                <template #body="slotProps">
                  {{ formatDateForDisplay(slotProps.data.submit_date) }}
                </template>
              </Column>
              <Column field="formulation_name" header="formulation_name" sortable></Column>
              <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
              <Column field="objective_function" header="Objective Function" sortable></Column>
              <Column field="optimization_algorithm" header="Optimization Algorithm" sortable></Column>
              <Column field="validation_runs" header="Validation Runs" sortable></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <div v-if="computedCalibrationValidationRunList.length > 1">
        <div id="evaluationCalibrationList">
          <DataTable id="validation-list" :value="computedCalibrationValidationRunList" scrollable scroll-height="400px"
            sortField="validation_run_id" :sortOrder="-1" table-style="min-width: 50rem" selectionMode="single"
            v-model:selection="selectedCalibrationValidationRun" :rowStyle="rowStyle"
            @rowSelect="onEvalValdiationRowSelect" @rowUnselect="onEvalValidationRowUnSelect" class="boxed">
            <Column v-for="( col, colIndex ) in calibrationValidationRunListHeaders" :key="colIndex"
              :header="col.header" :field="col.field"></Column>
          </DataTable>
        </div>
        <div class="flex mt-2">
          <div class="ml-auto mt-4">
            <div id="NewButton" class="">
              <Button id="btn-evaluate" class="ngenButtonDiv-alt bg-blue4" @click.stop="returnCalibrationJobList">Return
                to
                Calibration Jobs</Button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex mt-2">
        <div class="ml-auto mt-4">
          <div id="NewButton" class="">
            <Button id="btn-evaluate" class="ngenButtonDiv-alt bg-blue4"
              v-if="computedCalibrationValidationRunList.length > 0 && loadCalibrationDataComplete === true && evaluateValidationRunId > 0"
              @click.stop="navigateToEvaluation">Evaluate</Button>
          </div>
        </div>
      </div>

    </div>

    <div class="waitgif" v-if="isLoadingCalibrationSummary">
      <img alt="Pleae wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

import type { CalibrationRun, CalibrationValidationJobData } from "~/composables/NextGenModel";
import { EvaluationTabs } from "~/composables/NextgenEnums";
import { useEvaluationCalibrationRunStore } from "~/stores/evaluation/EvaluationCalibrationRunStore";
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { formatDateForDisplay } from '~/utils/TimeHelpers';
import { hilightTab } from '~/composables/TabHilight';

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();

const {
  uiGageId,
  evaluationCalibrationRunGageList,
  loadCalibrationDataComplete,
  userSelectedEvalCalibrationRunId,
  calibrationValidationRunListHeaders,
  computedCalibrationValidationRunList,
  userEvaluationCalibrationRunListData,
  evaluateValidationRunId
} = storeToRefs(evaluationCalibrationRunStore);

const {
  fetchUserSelectedCalibrationValidationRunList,
  loadSelectedCalibrationRun,
  resetUserSelectedEvalCalibrationRun,
  resetUserSelectedEvalValidationRun,
  fetchUserValidatedCalibrationJobsListData,
} = evaluationCalibrationRunStore;

const { userCalibrationRunData } = storeToRefs(useUserDataStore());
const isLoadingCalibrationSummary = ref<boolean>(false);

const toast = useToast();
//this model is for highlighting purpose
const selectedCalibrationRun = ref<CalibrationRun>();
const selectedCalibrationValidationRun = ref<CalibrationValidationJobData>();

onMounted(() => {
  hilightTab(EvaluationTabs.tab_calibrationRuns);
  //clear calibration data if user were on calibraiton tab and clear evaludation previous run data user may have selected
  resetUserSelectedEvalCalibrationRun();
  fetchUserValidatedCalibrationJobsListData();
  console.log("CalibrationRunsTab for Evaluation mounted")
});

const onEvalCalibrationRowSelect = async (event: DataTableRowClickEvent) => {
  resetUserSelectedEvalValidationRun();
  loadSelectedCalibrationRun(event.data.calibration_run_id);
  isLoadingCalibrationSummary.value = true;
  fetchUserSelectedCalibrationValidationRunList();
}

watch(() => userCalibrationRunData.value, (updatedRunData, initialRunData) => {
  if (updatedRunData != undefined && Object.keys(updatedRunData).length > 0) {
    nextTick(() => {
      isLoadingCalibrationSummary.value = false;
      loadCalibrationDataComplete.value = true;
    });
  }
});

const onEvalCalibrationRowUnSelect = (event: any) => {
  resetUserSelectedEvalCalibrationRun();
}

const onEvalValdiationRowSelect = async (event: DataTableRowClickEvent) => {
  evaluateValidationRunId.value = event.data.validation_run_id;
}

const onEvalValidationRowUnSelect = async (event: DataTableRowClickEvent) => {
  evaluateValidationRunId.value = 0;
}

const navigateToAlternateIteration = (event: any) => {
  if (userSelectedEvalCalibrationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_selectAltIteration];
    e.click();
  } else {
    toast.add({ severity: 'warn', summary: 'Missing Calibration Job', detail: 'Pleasea select a calibration job first.', life: 6000 })
  }
}

const navigateToEvaluation = (event: any) => {
  if (evaluateValidationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
    e.click();
  } else {
    toast.add({ severity: 'warn', summary: 'Missing Validation Job', detail: 'Pleasea select a validation job first.', life: 6000 })
  }
}

const returnCalibrationJobList = (event: any) => {
  selectedCalibrationRun.value = selectedCalibrationValidationRun.value = undefined;
  resetUserSelectedEvalValidationRun();
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    //return { backgroundColor: 'gainsboro' }
    return { backgroundColor: 'white' }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#HeadwaterBasinGage {
  width: 300px;
}
</style>