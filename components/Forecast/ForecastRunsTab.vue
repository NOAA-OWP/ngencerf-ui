<template>
  <client-only>
    <div class="h-screen-inner pr-2">

      <div class="flex mt-2">
        <div class="w-2/3">
          <h1 class="pt-3 mb-8 text-3xl font-bold inline-block">
            <span>Previous Forecast Runs *</span>
          </h1>
        </div>
        <div class="ml-auto mt-2">
          <div id="NewButton" class=""><Button id="btn-new-validation" class="ngenButtonDiv-alt bg-blue4"
              v-if="forecastJobId && forecastJobId > 0"
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
                  <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter" v-model="uiGageId"
                    :options="forecastRunGageList" filter optionLabel="name" optionValue="name"
                    placeholder=""></Select>
                </div>
              </div>
            </div>

            <ConfirmDialog></ConfirmDialog>
            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
              :model="cmCalibrationRun" @hide="selectedCalibrationRun = undefined"></ContextMenu>
            <DataTable id="cr-list" :value="forecastRuns" scrollable scroll-height="400px"
              sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
              v-model:selection="selectedCalibrationRun" selectionMode="single" :rowStyle="rowStyle"
              @row-dblclick="onRowDblClick($event)"
              @rowContextmenu="onRowContextMenu" class="boxed">
              <Column :pt="ptColumn" field="calibration_run_id" header="Run ID" sortable></Column>
              <Column :pt="ptColumn" field="status" header="Status" sortable></Column>
              <Column field="submit_date" header="Run Date" sortable>
                <template #body="slotProps">
                  {{ formatDateForDisplay(slotProps.data.created_at) }}
                </template>
              </Column>
              <Column :pt="ptColumn" field="formulation_name" header="Formulation Name" sortable></Column>
              <Column :pt="ptColumn" field="gage_id" header="Headwater Basin Gage" sortable></Column>
              <Column :pt="ptColumn" field="objective_function" header="Objective Function" sortable></Column>
              <Column :pt="ptColumn" field="optimization_algorithm" header="Optimization Algorithm" sortable></Column>
            </DataTable>
            <div class="mt-4 mx-auto">
              * Double click on a row to open, or right click for other options. Click "New Forecast" for a fresh setup.</div>
          </div>
        </div>
      </div>

    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

import type { CalibrationRun } from "@/composables/NextGenModel";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { formatDateForDisplay } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';
import { storeToRefs } from "pinia";
import { useForecastStore } from "@/stores/forecast/ForecastStore";

const forecastStore = useForecastStore();
const { forecastRunGageList, forecastJobId, uiGageId } = forecastStore;
const {forecastRuns, } = useForecastStore();

const toast = useToast();
const crContextMenu = ref(); //calibration run context menu
const contextMenuJob = ref<number>()
const isLoading = ref(true);
const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun() },
//  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedCalibrationRun() }
]);
const onRowContextMenu = (event: any) => {
  crContextMenu.value.show(event.originalEvent);
  contextMenuJob.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
};

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const {clearUserCalibrationRunData } = useUserDataStore();

const { userCalibrationRunData } = storeToRefs(useUserDataStore());

//this model is for highlighting purpose
const selectedCalibrationRun = ref<CalibrationRun>();

onMounted(() => {
  isLoading.value = true;
  hilightTab(ForecastTabs.tab_forecastRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  isLoading.value = false;
});

const onRowDblClick = (event: any) => {
  const rowData = event.data;
  contextMenuJob.value = rowData.calibration_run_id;
  openSelectedCalibrationRun();
}

const openSelectedCalibrationRun = () => {
  isLoading.value = true;
 // resetUserSelectedEvalValidationRun();
  nextTick(async () => {
   // await loadSelectedCalibrationRun(contextMenuJob.value as number);
   // await fetchUserSelectedCalibrationValidationRunList();
    navigateToSetupForecast();
    isLoading.value = false;
  })
}

const navigateToSetupForecast = () => {
  if (true) {
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

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#HeadwaterBasinGage {
  width: 300px;
}
</style>
