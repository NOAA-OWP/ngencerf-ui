<template>
  <client-only>
    <div class="h-screen-inner pr-2  text-center">

      <div class="flex mt-2">
        <div class="w-2/3">
          <h1 class="pt-3 mb-8 text-3xl font-bold inline-block">
            Previous Calibration Runs
          </h1>
        </div>
        <div class="ml-auto mt-2">
          <div id="NewButton" class=""><Button id="btn-new-validation" class="ngenButtonDiv-alt bg-blue4"
              v-if="forecastJobId"
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
                    :options="evaluationForecastRunGageList" filter optionLabel="name" optionValue="name"
                    placeholder=""></Select>
                </div>
              </div>
            </div>

            <ConfirmDialog></ConfirmDialog>
            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
              :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
            <DataTable id="ForecastRunTable" :value="forecastRuns" scrollable scroll-height="400px"
              sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
              @rowSelect="onForecastRowSelect" @rowUnselect="onForecastRowUnSelect"
              v-model:selection="selectedCalibrationRun" selectionMode="single" :rowStyle="rowStyle"
              @row-dblclick="onRowDblClick($event)" @rowContextmenu="onRowContextMenu" class="boxed">
              <Column field="calibration_run_id" header="Job ID" sortable></Column>
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
              * Double click on a row to open, or right click for other options. Click "New Forecast" for a fresh setup.
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

import type { CalibrationRun, CalibrationValidationJobData } from "~/composables/NextGenModel";

import { EvaluationTabs } from "~/composables/NextgenEnums";
import { useForecastStore } from "~/stores/forecast/ForecastStore";
import { useEvaluationCalibrationRunStore } from "~/stores/evaluation/EvaluationCalibrationRunStore";
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { useCalibrationJobStore } from "~/stores/common/CalibrationJobStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { formatDateForDisplay } from '~/utils/TimeHelpers';
import { hilightTab } from '~/composables/TabHilight';
import { storeToRefs } from "pinia";
const { deleteCalibrationRun } = useCalibrationJobStore();

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();


const forecastStore = useForecastStore();
const { loadForecastRuns } = forecastStore;


const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

const isLoading = ref(true);
const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun() },
  // { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun() }
]);
const onRowContextMenu = (event: any) => {
  crContextMenu.value.show(event.originalEvent);
  forecastJobId.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
};

const {
  uiGageId,
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

const { forecastRuns, evaluationForecastRunGageList, forecastJobId } = storeToRefs(useForecastStore());

//this model is for highlighting purpose
const selectedCalibrationRun = ref<CalibrationRun>();
const selectedCalibrationValidationRun = ref<CalibrationValidationJobData>();

onMounted(async () => {
  isLoading.value = true;
  hilightTab(EvaluationTabs.tab_calibrationRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }
  forecastJobId.value = 0;
  //clear calibration data if user were on calibraiton tab and clear evaludation previous run data user may have selected
  resetUserSelectedEvalCalibrationRun();
  await loadForecastRuns();
  isLoading.value = false;

});

// const onForecastRowSelect = async (event: DataTableRowClickEvent) => {
//   return; // Locking out single clicks
//   //isLoading.value = true;
//   // resetUserSelectedEvalValidationRun();
//   // nextTick( async () => {
//   //   await loadSelectedCalibrationRun(event.data.calibration_run_id);
//   //   await fetchUserSelectedCalibrationValidationRunList();
//   //   isLoading.value = false;
//   // })  
// }

const onForecastRowSelect = async (event: DataTableRowClickEvent) => {
  isLoading.value = true;
  forecastJobId.value = event.data.calibration_run_id;
  await loadSelectedCalibrationRun(forecastJobId.value as number);
  await fetchUserSelectedCalibrationValidationRunList();
  isLoading.value = false;
}

const onForecastRowUnSelect = async (event: DataTableRowClickEvent) => {
  forecastJobId.value = 0;

}


watch(() => userCalibrationRunData.value, (updatedRunData, initialRunData) => {
  if (updatedRunData != undefined && Object.keys(updatedRunData).length > 0) {
    nextTick(() => {
      isLoading.value = false;
      loadCalibrationDataComplete.value = true;
    });
  }
});

const onRowMenuOpen = () => {

}
const onRowDblClick = (event: any) => {
  const rowData = event.data;
  forecastJobId.value = rowData.calibration_run_id;
  openSelectedCalibrationRun();
}

const openSelectedCalibrationRun = () => {
  isLoading.value = true;
  resetUserSelectedEvalValidationRun();
  nextTick(async () => {
    await loadSelectedCalibrationRun(forecastJobId.value as number);
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
  const selectedRunId = forecastJobId.value as number;
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

#calibrationRunList {
  height: 80%;
}
#HeadwaterBasinGage {
  width: 300px;
}

#ForecastRunTable {
  width: 1270px;
  margin: 0 auto;
}
</style>