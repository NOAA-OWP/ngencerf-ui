<template>
  <!-- Forecast Calibration Runs Tab -->
  <div class="h-screen-inner pr-2">
    <div class="flex mt-2">
      <div class="w-2/3">
        <h1 class="pt-3 mb-8 text-3xl font-bold inline-block">Previous Calibration Runs</h1>
      </div>
      <div class="ml-auto mt-2">
        <div id="NewButton" class=""><Button id="btn-new-validation" class="ngenButtonDiv-alt bg-blue4"
            v-if="userSelectedEvalCalibrationRunId > 0"
            @click.stop="navigateToAlternateIteration">New Forecast</Button></div>
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

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
            :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
          <DataTable id="cr-list" :value="userEvaluationCalibrationRunListData" scrollable scroll-height="400px"
            :rowStyle="rowStyle"
            table-style="min-width: 50rem" 
            v-model:selection="selectedCalibrationRun" 
            selectionMode="single" 
            contextMenu
            v-model:contextMenuSelection="selectedCalibrationRun"

            @rowContextmenu="onRowContextMenu($event)"             
            @rowSelect="(onEvalCalibrationRowSelect($event))"
            @rowUnselect="onEvalCalibrationRowUnSelect" class="boxed">

            <Column field="calibration_run_id" header="Job ID" sortable></Column>
            <Column field="status" header="status" sortable></Column>
            <Column field="run_date" header="Run Date" sortable>
              <template #body="slotProps">
                {{ formatDateForDisplay(slotProps.data.run_date) }}
              </template>
            </Column>
            <Column field="formulation_name" header="formulation_name" sortable></Column>
            <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
            <Column field="objective_function" header="Objective Function" sortable></Column>
            <Column field="Optimization" header="Optimization Algorithm" sortable></Column>
            <Column field="validation_runs" header="Validation Runs" sortable></Column>
          </DataTable>
        </div>
      </div>
    </div>
    <div v-if="computedCalibrationValidationRunList.length > 1">
      <div id="evaluationCalibrationList">
        <DataTable id="validation-list" :value="computedCalibrationValidationRunList" scrollable scroll-height="400px"
          table-style="min-width: 50rem" selectionMode="single" v-model:selection="selectedCalibrationValidationRun"
          :rowStyle="rowStyle" @rowSelect="onEvalValdiationRowSelect" @rowUnselect="onEvalValidationRowUnSelect"
          class="boxed">
          <Column v-for="( col, colIndex ) in calibrationValidationRunListHeaders" :key="colIndex" :header="col.header"
            :field="col.field"></Column>
        </DataTable>
      </div>

    </div>

  </div>

  <div class="waitgif" v-if="isLoadingCalibrationSummary">
    <img alt="Please Wait..." src="@/assets/styles/img/wait.gif" />
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

import type { CalibrationRun, CalibrationValidationJobData } from "~/composables/NextGenModel";
import { EvaluationTabs } from "~/composables/NextgenEnums";
import { useEvaluationCalibrationRunStore } from "~/stores/evaluation/EvaluationCalibrationRunStore";
import { useCalibrationJobStore } from "~/stores/common/CalibrationJobStore";
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { formatDateForDisplay } from '~/utils/TimeHelpers';

const { deleteCalibrationRun } = useCalibrationJobStore();

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();

const crContextMenu = ref(); //calibration run context menu
const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun) }
]);
const onRowContextMenu = (event: any) => {
  crContextMenu.value.show(event.originalEvent);
};

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

const onEvalCalibrationRowSelect = async (event: DataTableRowClickEvent) => {
  resetUserSelectedEvalValidationRun();
  loadSelectedCalibrationRun(event.data.calibration_run_id);
  isLoadingCalibrationSummary.value = true;
  fetchUserSelectedCalibrationValidationRunList();
}

const openSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  resetUserSelectedEvalValidationRun();
  loadSelectedCalibrationRun(selectedCalibrationRun.value.calibration_run_id);
  isLoadingCalibrationSummary.value = true;
  fetchUserSelectedCalibrationValidationRunList();
}

const confirmDelte = useConfirm();
const deleteSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  const confirm_delete = ref(false)
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id
  let confirmMessage = "Are you sure you want to delete this run?"
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
      label: 'DELETE RUN',
    },
    accept: () => acceptDelete(selectedRunId),
    reject: () => {
      //do nothing
    }
  })
}
const acceptDelete = (selectedRunId: number) => {
  deleteCalibrationRun(selectedRunId).then( response => {
    if ( response.status == 200 ) {
      fetchUserSelectedCalibrationValidationRunList();
    } else {
      useApiErrorResponsePreprocess( response ).forEach( message => {
        toast.add({ severity: useApiResponseToastSeverityCode( response?.status ), summary: 'Delete Calibration Job Failed.', detail: message, life: 10000 });
      });
    }
  }).then(  () => {
    selectedCalibrationRun.value = undefined;
  });
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

onMounted(() => {
  //clear calibration data if user were on calibraiton tab and clear evaludation previous run data user may have selected
  resetUserSelectedEvalCalibrationRun();

  fetchUserValidatedCalibrationJobsListData();
});

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#HeadwaterBasinGage {
  width: 300px;
}
</style>
