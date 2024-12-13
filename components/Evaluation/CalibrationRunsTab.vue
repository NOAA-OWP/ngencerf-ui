<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <client-only>
    <div class="h-screen-inner pr-2">
      <div class="flex mt-2">
        <div class="w-full">
          <h1 class="pt-3 mb-8 text-3xl font-bold text-center">
            <span v-if="computedCalibrationValidationRunList.length <= 1">
              Calibration Runs<br />
              <span style="font-size: 14px;font-weight: normal;">
                Select row then right click for available options.
              </span>
            </span>
            <span v-if="computedCalibrationValidationRunList.length > 1">Validation Runs for Calibration Job {{
              userSelectedEvalCalibrationRunId }}<br />
              <span style="font-size: 14px;font-weight: normal;">
                Select row then right click for available options.
              </span>
            </span>
          </h1>
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
            :model="cmCalibrationRun"></ContextMenu>
          <DataTable id="EvalRunTable" :value="userEvaluationCalibrationRunListData" scrollable scroll-height="400px"
            sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
            v-model:selection="selectedCalibrationRun" selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onEvalCalibrationRowSelect" @rowUnselect="onEvalCalibrationRowUnSelect"
            @rowContextmenu="onRowContextMenu" class="boxed">
            <Column :pt="ptColumn" field="calibration_run_id" header="Job ID" sortable></Column>
            <Column :pt="ptColumn" field="formulation_name" header="Formulation Name" sortable></Column>
            <Column :pt="ptColumn" field="validation_runs" header="Validation Runs" sortable></Column>
            <Column :pt="ptColumn" field="gage_id" header="Headwater Basin Gage" sortable></Column>
            <Column :pt="ptColumn" field="objective_function" header="Objective Function" sortable></Column>
            <Column :pt="ptColumn" field="optimization_algorithm" header="Optimization Algorithm" sortable></Column>
            <Column :pt="ptColumn" field="job_genesis" header="Job Genesis" sortable></Column>
            <Column :pt="ptColumn" field="created_at" header="Creation Date" sortable>
              <template #body="slotProps">
                {{ formatDateForDisplay(slotProps.data.created_at) }}
              </template>
            </Column>
            <Column field="submit_date" header="Submit Date" sortable>
              <template #body="slotProps">
                {{ formatDateForDisplay(slotProps.data.submit_date) }}
              </template>
            </Column>
          </DataTable>
        </div>

      </div>
      <div v-if="computedCalibrationValidationRunList.length > 1">
        <div id="evaluationCalibrationList">
          <ContextMenu :pt="{ root: { id: 'vr-context-menu' } }" class="bg-white" ref="vrContextMenu"
            :model="cmValidationRun"></ContextMenu>
          <DataTable id="validation-list" :value="computedCalibrationValidationRunList" scrollable scroll-height="400px"
            sortField="validation_run_id" :sortOrder="-1" table-style="min-width: 50rem" selectionMode="single"
            v-model:selection="selectedCalibrationValidationRun" :rowStyle="rowStyle"
            @rowContextmenu="onRowVrContextMenu" @rowSelect="onEvalValdiationRowSelect"
            @rowUnselect="onEvalValidationRowUnSelect" class="boxed">
            <Column :pt="ptValColumns" v-for="( col, colIndex ) in calibrationValidationRunListHeaders" :key="colIndex"
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

import type { CalibrationValidationJobData, DataTableContextMenuOption } from "@/composables/NextGenModel";
import { EvaluationTabs } from "@/composables/NextgenEnums";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { storeToRefs } from "pinia";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { formatDateForDisplay } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import MessagesGroup from "@/components/Common/MessagesGroup.vue";

const { deleteCalibrationRun } = useCalibrationJobStore();
const showMessagesGroup = ref<boolean>(false);

const crContextMenu = ref(); //calibration run context menu
const vrContextMenu = ref(); //validation run context menu

const contextMenuJob = ref<number>();

const cmCalibrationRun = ref<DataTableContextMenuOption[]>([]);
const cmValidationRun = ref<DataTableContextMenuOption[]>([]);

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const ptValColumns = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "right" } }
});


ptValColumns
const {
  uiGageId,
  evaluationCalibrationRunGageList,
  loadCalibrationDataComplete,
  userSelectedEvalCalibrationRunId,
  calibrationValidationRunListHeaders,
  computedCalibrationValidationRunList,
  userEvaluationCalibrationRunListData,
  evaluateValidationRunId,
  evaluateValidationRunStatus,
} = storeToRefs(evaluationCalibrationRunStore);

const {
  fetchUserSelectedCalibrationValidationRunList,
  loadSelectedCalibrationRun,
  resetUserSelectedEvalCalibrationRun,
  resetUserSelectedEvalValidationRun,
  fetchUserValidatedCalibrationJobsListData,
  clearUserCalibrationRunData,
  setSelectedCalibrationRunId,
  fetchValidationRunListByCalibrationRun,
} = evaluationCalibrationRunStore;

const { userCalibrationRunData } = storeToRefs(useUserDataStore());
const isLoading = ref<boolean>(true);

const toast = useToast();
//this model is for highlighting purpose
const selectedCalibrationRun = ref<ValidatedCalibrationRunListItem>();
const selectedCalibrationValidationRun = ref<CalibrationValidationJobData>();

onMounted(() => {
  hilightTab(EvaluationTabs.tab_calibrationRuns);
  //clear calibration data if user were on calibraiton tab and clear evaludation previous run data user may have selected
  resetUserSelectedEvalCalibrationRun();
  fetchUserValidatedCalibrationJobsListData();
  isLoading.value = false;
});

const onRowContextMenu = (event: any) => {
  cmCalibrationRun.value = [];
  const crRowData = event.data as ValidatedCalibrationRunListItem;
  if (selectedCalibrationRun && selectedCalibrationRun.value?.calibration_run_id == crRowData.calibration_run_id) {
    crContextMenu.value.show(event.originalEvent);
    contextMenuJob.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
    if (crRowData.validation_runs > 1) {
      cmCalibrationRun.value.push({ label: 'Select Validation Run', icon: 'pi pi-fw-pisearch', command: () => viewSelectedCalibrationValidationRuns(crRowData.calibration_run_id) })
    } if (crRowData.validation_runs === 1) {
      cmCalibrationRun.value.push({ label: 'Evaluate', icon: 'pi pi-fw-pisearch', command: () => evaluateValidationJobFromCalibration(crRowData.calibration_run_id) })
    }
    cmCalibrationRun.value.push({ label: 'New Validation Run', icon: 'pi pi-fw-pisearch', command: () => viewSelectAlternateIteration(crRowData.calibration_run_id) });
    cmCalibrationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-fw-pisearch', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
    if (crRowData.validation_runs === 1) {
      cmCalibrationRun.value.push({ label: 'View Validation Run Status', icon: 'pi pi-fw-pisearch', command: () => viewValidationRunStatus(crRowData.calibration_run_id) })
    }
    cmCalibrationRun.value.push({ label: 'Delete Calibration Job', icon: 'pi pi-fw-pisearch', command: () => deleteSelectedCalibrationRun() });
  }
};

const onRowVrContextMenu = (event: any) => {
  cmValidationRun.value = [];
  const vrRowData = event.data as CalibrationValidationJobData;
  if (selectedCalibrationValidationRun && selectedCalibrationValidationRun.value?.validation_run_id === vrRowData.validation_run_id) {
    vrContextMenu.value.show(event.originalEvent);
    if (vrRowData.status.toLocaleUpperCase() !== 'RUNNING') {
      cmValidationRun.value.push({ label: 'Evaluate', icon: 'pi pi-fw-pisearch', command: () => evaluateValidationJob(vrRowData.validation_run_id, vrRowData.status) });
    }
    cmValidationRun.value.push({ label: 'New Validation Run', icon: 'pi pi-fw-pisearch', command: () => viewSelectAlternateIteration(userSelectedEvalCalibrationRunId.value) });
    cmValidationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-fw-pisearch', command: () => viewCalibrationDetails(userSelectedEvalCalibrationRunId.value) });
    cmValidationRun.value.push({ label: 'View Validation Run Status', icon: 'pi pi-fw-pisearch', command: () => navigationToStatusRun(vrRowData.validation_run_id, vrRowData.status) });
    if (vrRowData.status.toLocaleUpperCase() === 'RUNNING') {
      cmValidationRun.value.push({ label: 'Cancel', icon: 'pi pi-fw-pisearch', command: () => navigationToStatusRun(vrRowData.validation_run_id, vrRowData.status) });
    }
  }
}

const onEvalCalibrationRowSelect = async (event: DataTableRowClickEvent) => {
  resetUserSelectedEvalValidationRun();
  //loadSelectedCalibrationRun(event.data.calibration_run_id);
  setSelectedCalibrationRunId(event.data.calibration_run_id);
  //isLoading.value = true;
  if (event.data.validation_runs === 1) {
    fetchUserSelectedCalibrationValidationRunList();
  }
}

watch(() => userCalibrationRunData.value, (updatedRunData, initialRunData) => {
  if (updatedRunData !== undefined && Object.keys(updatedRunData).length > 0) {
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
    setSelectedCalibrationRunId(contextMenuJob.value as number);
    await fetchUserSelectedCalibrationValidationRunList();
    isLoading.value = false;
  })
}

const viewCalibrationDetails = async (calibration_run_id: number) => {
  //resetUserSelectedEvalValidationRun();
  console.log('viewCalibrationDetails selectedCalibrationRun ', selectedCalibrationRun);
  isLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const viewSelectedCalibrationValidationRuns = async (calibration_run_id: number) => {
  resetUserSelectedEvalValidationRun();
  isLoading.value = true;
  nextTick(async () => {
    setSelectedCalibrationRunId(calibration_run_id);
    await fetchUserSelectedCalibrationValidationRunList();
    isLoading.value = false;
  })
}

const navigationToStatusRun = (validation_run_id: number, validation_status: string) => {
  evaluateValidationRunId.value = validation_run_id;
  evaluateValidationRunStatus.value = validation_status;
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[EvaluationTabs.tab_runStatus];
  e.click();
}

const viewSelectAlternateIteration = async (calibration_run_id: number) => {
  setSelectedCalibrationRunId(calibration_run_id);
  if (userSelectedEvalCalibrationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_selectAltIteration];
    e.click();
  } else {
    toast.add({ severity: 'warn', summary: 'Missing Calibration Job', detail: 'Pleasea select a calibration job first.', life: 6000 })
  }
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

const evaluateValidationJobFromCalibration = async (calibration_run_id: number): Promise<void> => {
  loadSelectedCalibrationRun(calibration_run_id);
  await fetchValidationRunListByCalibrationRun().then(validationRunList => {
    if (validationRunList.length === 1) {
      evaluateValidationRunId.value = validationRunList[0].validation_run_id;
      evaluateValidationRunStatus.value = validationRunList[0].status;

      const tabs = document.getElementsByClassName("tabs");
      const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
      e.click();
    }
  });
}

const evaluateValidationJob = (validation_run_id: number, validation_status: string): void => {
  evaluateValidationRunId.value = validation_run_id;
  evaluateValidationRunStatus.value = validation_status;
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
  e.click();
}

const viewValidationRunStatus = async (calibration_run_id: number): Promise<void> => {
  resetUserSelectedEvalValidationRun();
  nextTick(async () => {
    setSelectedCalibrationRunId(calibration_run_id);
    await fetchValidationRunListByCalibrationRun().then(validationRunList => {
      if (validationRunList.length === 1) {
        navigationToStatusRun(validationRunList[0].validation_run_id, validationRunList[0].status);
      }
    });
  })
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
  clearUserCalibrationRunData();
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
    if (response.status === 200) {
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

const toggleMessagesGroup = () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
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

#MessagesGroupWindow {
  z-index: 9999;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}
</style>