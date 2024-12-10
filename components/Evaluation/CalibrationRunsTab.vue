<template>
  <client-only>
    <div class="h-screen-inner pr-2">

      <div class="flex mt-2">
        <div class="w-full">
          <h1 class="pt-3 mb-8 text-3xl font-bold text-center">
            <span v-if="computedCalibrationValidationRunList.length <= 1">
              Calibration Runs<br />
              <span style="font-size: 12px;font-weight: normal;">
                Select the job then right click for options.
              </span>
            </span>
            <span v-if="computedCalibrationValidationRunList.length > 1">Validation Runs for Calibration Job {{
              userSelectedEvalCalibrationRunId }}<br />
              <span style="font-size: 12px;font-weight: normal;">
                Select the job to view/evaluate then click the Evaluate button.
              </span>
            </span>
          </h1>
        </div>
        <div class="ml-auto mt-2">
          <div id="NewButton" class="">
            <Button id="btn-new-validation" class="ngenButtonDiv-alt bg-blue4 w-40"
              v-if="userSelectedEvalCalibrationRunId > 0 && loadCalibrationDataComplete === true"
              @click.stop="navigateToAlternateIteration">New Validation</Button>
          </div>
          <br/>
          <div id="NewButton" class="">
            <Button id="btn-evaluate" class="ngenButtonDiv-alt bg-blue4"
              v-if="computedCalibrationValidationRunList.length > 0 && loadCalibrationDataComplete === true && evaluateValidationRunId > 0 && evaluateValidationRunStatus !== 'Running'"
              @click.stop="navigateToEvaluation">Evaluate</Button>
          </div>
        </div>
      </div>

      <div id="calibrationRunList"
        v-if="userEvaluationCalibrationRunListData.length > 0 && computedCalibrationValidationRunList.length <= 1">

          <div id="CalTable">
            <div class="grid grid-cols-2 mb-5 gage-filter-wrapper">
              <div class="col-span-1">
                <div class="ml-10">
                  <label for="HeadwaterBasinGage">Headwater Basin Gage Filter</label><br>
                  <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter" v-model="uiGageId"
                    :options="evaluationCalibrationRunGageList" filter optionLabel="name" optionValue="name"
                    placeholder=""></Select>
                </div>
              </div>
            </div>

            <ConfirmDialog></ConfirmDialog>
            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
              :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
            <DataTable id="EvalRunTable" :value="userEvaluationCalibrationRunListData" scrollable scroll-height="400px"
              sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
              v-model:selection="selectedCalibrationRun" selectionMode="single" :rowStyle="rowStyle"
              @rowSelect="onEvalCalibrationRowSelect" @rowUnselect="onEvalCalibrationRowUnSelect" @rowContextmenu="onRowContextMenu" class="boxed">
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
      <div v-if="computedCalibrationValidationRunList.length > 1">
        <div id="evaluationCalibrationList">
          <DataTable id="validation-list" :value="computedCalibrationValidationRunList" scrollable scroll-height="400px"
            sortField="validation_run_id" :sortOrder="-1" table-style="min-width: 50rem" selectionMode="single"
            v-model:selection="selectedCalibrationValidationRun" :rowStyle="rowStyle"
            @rowSelect="onEvalValdiationRowSelect" @rowUnselect="onEvalValidationRowUnSelect" class="boxed">
            <Column v-for="( col, colIndex ) in calibrationValidationRunListHeaders" :key="colIndex"
              :header="col.header" :field="col.field">
            </Column>
          </DataTable>
          <div class="mt-3 mx-auto" style="font-size:0.85em;">
            * Iteration containing best parameter set determined during calibration.
          </div>
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
    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Pleae wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

import type { CalibrationRun, CalibrationValidationJobData, DataTableContextMenuOption } from "~/composables/NextGenModel";
import { EvaluationTabs } from "~/composables/NextgenEnums";
import { useEvaluationCalibrationRunStore } from "~/stores/evaluation/EvaluationCalibrationRunStore";
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { formatDateForDisplay } from '~/utils/TimeHelpers';
import { hilightTab } from '~/composables/TabHilight';
import { useCalibrationJobStore } from "~/stores/common/CalibrationJobStore";

const { deleteCalibrationRun } = useCalibrationJobStore();

const crContextMenu = ref(); //calibration run context menu
const contextMenuJob = ref<number>()
// const cmCalibrationRun = ref([
//   { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun() },
//   { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun() }
// ]);
const cmCalibrationRun = ref<DataTableContextMenuOption[]>([]);

const onRowContextMenu = (event: any) => {
  cmCalibrationRun.value = [];
  crContextMenu.value.show(event.originalEvent);
  if ( event.data.validation_runs > 1 ) {
    cmCalibrationRun.value.push( { label: 'Select a Validation Job', icon: 'pi pi-fw-pisearch', command: () => viewSelectedCalibrationValidationRuns() } )
  }
  cmCalibrationRun.value.push( { label: 'Delete', icon: 'pi pi-fw-pisearch', command: () => deleteSelectedCalibrationRun() } )
  contextMenuJob.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
};

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();

const {
  uiGageId,
  evaluationCalibrationRunGageList,
  loadCalibrationDataComplete,
  userSelectedEvalCalibrationRunId,
  calibrationValidationRunListHeaders,
  computedCalibrationValidationRunList,
  userEvaluationCalibrationRunListData,
  evaluateValidationRunId,
  evaluateValidationRunStatus
} = storeToRefs(evaluationCalibrationRunStore);

const {
  fetchUserSelectedCalibrationValidationRunList,
  loadSelectedCalibrationRun,
  resetUserSelectedEvalCalibrationRun,
  resetUserSelectedEvalValidationRun,
  fetchUserValidatedCalibrationJobsListData,
} = evaluationCalibrationRunStore;

const { userCalibrationRunData } = storeToRefs(useUserDataStore());
const isLoading = ref<boolean>(true);

const toast = useToast();
//this model is for highlighting purpose
const selectedCalibrationRun = ref<CalibrationRun>();
const selectedCalibrationValidationRun = ref<CalibrationValidationJobData>();

onMounted(() => {
  hilightTab(EvaluationTabs.tab_calibrationRuns);
  //clear calibration data if user were on calibraiton tab and clear evaludation previous run data user may have selected
  resetUserSelectedEvalCalibrationRun();
  fetchUserValidatedCalibrationJobsListData();
  isLoading.value = false;
});

const onEvalCalibrationRowSelect = async (event: DataTableRowClickEvent) => {
  resetUserSelectedEvalValidationRun();
  loadSelectedCalibrationRun(event.data.calibration_run_id);
  isLoading.value = true;
  if ( event.data.validation_runs === 1 ) {
    fetchUserSelectedCalibrationValidationRunList();
  }
}

watch(() => userCalibrationRunData.value, (updatedRunData, initialRunData) => {
  if (updatedRunData != undefined && Object.keys(updatedRunData).length > 0) {
    nextTick(() => {
      isLoading.value = false;
      loadCalibrationDataComplete.value = true;
    });
  }
});

const onEvalCalibrationRowUnSelect = (event: any) => {
  resetUserSelectedEvalCalibrationRun();
}

const onEvalValdiationRowSelect = async (event: DataTableRowClickEvent) => {
  evaluateValidationRunId.value = event.data.validation_run_id;
  evaluateValidationRunStatus.value = event.data.status;
}

const onEvalValidationRowUnSelect = async (event: DataTableRowClickEvent) => {
  evaluateValidationRunId.value = 0;
  evaluateValidationRunStatus.value = '';
}

const onRowDblClick = (event: any) => {
  isLoading.value = true;
  const rowData = event.data;
  contextMenuJob.value = rowData.calibration_run_id;
  openSelectedCalibrationRun();
}

const openSelectedCalibrationRun = () => {
  isLoading.value = true;
  resetUserSelectedEvalValidationRun();
  nextTick(async () => {
    await loadSelectedCalibrationRun(contextMenuJob.value as number);
    await fetchUserSelectedCalibrationValidationRunList();
    isLoading.value = false;
  })
}

const viewSelectedCalibrationValidationRuns = () => {
  fetchUserSelectedCalibrationValidationRunList();
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

const confirmDelte = useConfirm();
const deleteSelectedCalibrationRun = () => {
  const selectedRunId = contextMenuJob.value as number;
  let confirmMessage = "Are you sure you want to delete this calibration run? All associated validation job will also be deleted."
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
      label: 'DELETE RUN',
    },
    accept: () => acceptDelete(selectedRunId),
    reject: () => {
      //do nothing
    }
  })
}
const acceptDelete = (selectedRunId: number) => {
  deleteCalibrationRun(selectedRunId).then(response => {
    if (response.status == 200) {
      fetchUserValidatedCalibrationJobsListData();
      resetUserSelectedEvalValidationRun();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        toast.add({ severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: 10000 });
      });
    }
  });
  //selectedCalibrationRun.value = undefined;
  
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

#calibrationRunList {
  height: 80%;
}
#HeadwaterBasinGage {
  width: 300px;
}

#EvalRunTable,
.gage-filter-wrapper {
  width: 1270px;
  margin: 0 auto;
}

.gage-filter-wrapper {
  margin-bottom: 1rem;
}

</style>