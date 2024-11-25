<template>
  <client-only>
    <div class="h-screen-inner pr-2">

      <div class="flex mt-2">
        <div class="w-2/3">
          <h1 class="pt-3 mb-8 text-3xl font-bold inline-block">
            <span v-if="computedCalibrationValidationRunList.length <= 1">Previous Calibration Runs</span>
            <span v-if="computedCalibrationValidationRunList.length > 1">Forecast Runs for Calibration Job {{
              userSelectedEvalCalibrationRunId }}</span>
          </h1>
        </div>
        <div class="ml-auto mt-2">
          <div id="NewButton" class=""><Button id="btn-new-validation" class="ngenButtonDiv-alt bg-blue4"
              v-if="userSelectedEvalCalibrationRunId > 0 && loadCalibrationDataComplete === true"
              @click="navigateToSetupForecast">New Forecast</Button></div>
        </div>
      </div>

      <div id="calibrationRunList">
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
              sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
              v-model:selection="selectedCalibrationRun" selectionMode="single" :rowStyle="rowStyle"
              @row-dblclick="onRowDblClick($event)"
              @rowContextmenu="onRowContextMenu" class="boxed">
              <Column field="calibration_run_id" header="Run ID" sortable></Column>
              <Column field="status" header="Status" sortable></Column>
              <Column field="submit_date" header="Run Date" sortable>
                <template #body="slotProps">
                  {{ formatDateForDisplay(slotProps.data.created_at) }}
                </template>
              </Column>
              <Column field="formulation_name" header="Formulation Name" sortable></Column>
              <Column field="gage_id" header="Headwater Basin Gage" sortable></Column>
              <Column field="objective_function" header="Objective Function" sortable></Column>
              <Column field="optimization_algorithm" header="Optimization Algorithm" sortable></Column>
            </DataTable>
            <div class="mt-4 mx-auto">
              * Double click on a row to open, or right click for other options. Click "New Forecast" for a fresh setup.</div>
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

import type { CalibrationRun, CalibrationValidationJobData } from "~/composables/NextGenModel";
import { EvaluationTabs } from "~/composables/NextgenEnums";
import { useEvaluationCalibrationRunStore } from "~/stores/evaluation/EvaluationCalibrationRunStore";
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { useCalibrationJobStore } from "~/stores/common/CalibrationJobStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { formatDateForDisplay } from '~/utils/TimeHelpers';
import { hilightTab } from '~/composables/TabHilight';
import { storeToRefs } from "pinia";
const { deleteCalibrationRun } = useCalibrationJobStore();

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();

const toast = useToast();
const crContextMenu = ref(); //calibration run context menu
const contextMenuJob = ref<number>()
const isLoading = ref(true);
const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun() },
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun() }
]);
const onRowContextMenu = (event: any) => {
  crContextMenu.value.show(event.originalEvent);
  contextMenuJob.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
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

//this model is for highlighting purpose
const selectedCalibrationRun = ref<CalibrationRun>();
const selectedCalibrationValidationRun = ref<CalibrationValidationJobData>();

onMounted(() => {
  isLoading.value = true;
  hilightTab(EvaluationTabs.tab_calibrationRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }
  //clear calibration data if user were on calibraiton tab and clear evaludation previous run data user may have selected
  resetUserSelectedEvalCalibrationRun();
  fetchUserValidatedCalibrationJobsListData();
  isLoading.value = false;
  console.log("CalibrationRunsTab for Evaluation mounted")
});

const onForecastRowSelect = async (event: DataTableRowClickEvent) => {
  return; // Locking out single clicks
  //isLoading.value = true;
  // resetUserSelectedEvalValidationRun();
  // nextTick( async () => {
  //   await loadSelectedCalibrationRun(event.data.calibration_run_id);
  //   await fetchUserSelectedCalibrationValidationRunList();
  //   isLoading.value = false;
  // })  
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
}

const onEvalValidationRowUnSelect = async (event: DataTableRowClickEvent) => {
  evaluateValidationRunId.value = 0;
}

const onRowDblClick = (event: any) => {
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
    navigateToSetupForecast();
    isLoading.value = false;
  })
}

const navigateToSetupForecast = () => {
  if (userSelectedEvalCalibrationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[ForecastTabs.tab_setupForecast];
    e.click();
  } else {
    toast.add({ severity: 'warn', summary: 'Missing Calibration Job', detail: 'Please select a calibration job first.', life: 6000 })
  }
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'white' }
  }
}

const confirmDelte = useConfirm();
const deleteSelectedCalibrationRun = () => {
  const selectedRunId = contextMenuJob.value as number;
  let confirmMessage = "Are you sure you want to delete this run?"
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
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        toast.add({ severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: 10000 });
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#HeadwaterBasinGage {
  width: 300px;
}
</style>