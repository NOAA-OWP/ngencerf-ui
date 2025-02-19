<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <client-only>
    <div class="h-screen-inner pr-2">

      <div class="flex mt-2">
        <div class="w-2/3">
          <h1 class="pt-3 mb-8 text-3xl font-bold inline-block">
            <span>Forecast Runs</span><br />
            <span style="font-size: 12px;font-weight: normal;padding-left: 5px;">
              Select row and right click for options.
            </span>
          </h1>
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
                    :options="forecastRunGageList" filter optionLabel="name" optionValue="name" placeholder=""></Select>
                </div>
              </div>
            </div>

            <ConfirmDialog></ConfirmDialog>
            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
              :model="cmCalibrationRun"></ContextMenu>
            <DataTable id="cr-list" :value="forecastRuns" scrollable scroll-height="400px"
              sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
              v-model:selection="selectedForecastJob" selectionMode="single" :rowStyle="rowStyle"
              @rowSelect="onForecastRowSelect" @rowUnselect="onForecastRowUnSelect" @rowContextmenu="onRowContextMenu"
              class="boxed">
              <Column :pt="ptColumn" field="forecast_run_id" header="Forecast Job ID" sortable></Column>
              <Column :pt="ptColumn" field="cycle" header="Forecast Cycle" sortable></Column>
              <Column :pt="ptColumn" field="forecast_status" header="Job Status" sortable></Column>
              <Column field="submit_date" header="Submit Date" sortable>
                <template #body="slotProps">
                  <span v-if="slotProps.data.submit_date">
                    {{ formatDateForDisplay(slotProps.data.submit_date) }}
                  </span>
                </template>
              </Column>
              <Column :pt="ptColumn" field="gage_id" header="Headwater Basin Gage" sortable></Column>
              <Column :pt="ptColumn" field="calibration_run_id" header="Calibration Job ID" sortable></Column>
              <Column :pt="ptColumn" field="forcing_download_status" header="Forcing Download Status" sortable></Column>
            </DataTable>
            <div class="mt-4 mx-auto">
              * Double click on a row to open, or right click for other options. Click "New Forecast" for a fresh setup.
            </div>
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
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

import type { CalibrationRun, DataTableContextMenuOption, ForecastJob } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { generalStore } from "~/stores/common/GeneralStore";

import { formatDateForDisplay } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';

import type { DataTableRowClickEvent } from "primevue/datatable";
import MessagesGroup from "@/components/Common/MessagesGroup.vue";

const forecastStore = useForecastStore();
const { 
  forecastRunGageList, 
  forecastJobId, 
  uiGageId, 
  forecastRuns, 
  forecastCycles } = storeToRefs(forecastStore);
const { 
  setSelectedForecastRunId, 
  resetSelectedForecastRunId,
  loadSelectedCalibrationRun, 
  setSelectedForecastRowData, 
  fetchForecastJobsListData, 
  resetUserSelectedForecastCalibrationRun,
  loadSetupForecastTabData } = useForecastStore();
const showMessagesGroup = ref<boolean>(false);
const toast = useToast();
const crContextMenu = ref(); //calibration run context menu
const contextMenuJob = ref<number>()

const gstore = generalStore();
const { isLoading } = storeToRefs(gstore);
const { addToastRecord } = generalStore();

const cmCalibrationRun = ref<DataTableContextMenuOption[]>([]);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const { clearUserCalibrationRunData } = useUserDataStore();

const { userCalibrationRunData } = storeToRefs(useUserDataStore());

//this model is for highlighting purpose
const selectedForecastJob = ref<ForecastJob>();

const onRowContextMenu = (event: any) => {
  cmCalibrationRun.value = [];
  const crRowData = event.data as ForecastJob;

  if (selectedForecastJob && selectedForecastJob.value?.forecast_run_id == crRowData.forecast_run_id) {
    crContextMenu.value.show(event.originalEvent);
    //forecastJobId.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
    setSelectedForecastRunId(parseInt(event.originalEvent.currentTarget.children[0].textContent));
    if (crRowData.forecast_status.toUpperCase() !== 'RUNNING') {
      cmCalibrationRun.value.push({ label: 'View Results', icon: 'pi pi-fw-pisearch', command: () => navigateToForecastResults() });
    } else {
      cmCalibrationRun.value.push({ label: 'View Forecast Run Status', icon: 'pi pi-fw-pisearch', command: () => navigateToForecastRunStatus() });
    }
    cmCalibrationRun.value.push({ label: 'Run New Forecast', icon: 'pi pi-fw-pisearch', command: () => clearDataAndNavigateToSetupForecast() });
    cmCalibrationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-fw-pisearch', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
    //cmCalibrationRun.value.push( { label: 'Evaluate', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun() } );
    //cmCalibrationRun.value.push( { label: 'Show Setup', icon: 'pi pi-fw-pisearch', command: () => onCalibrationRunForForecastRowSelect() } );    
  }
};

onMounted(async () => {
  isLoading.value = true;
  hilightTab(ForecastTabs.tab_forecastRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    // clear all user-selected forecast and calibration data
    resetUserSelectedForecastCalibrationRun();

    // load forecastRuns
    await fetchForecastJobsListData();
  });

  isLoading.value = false;
});

const onRowDblClick = (event: any) => {
  const rowData = event.data;
  contextMenuJob.value = rowData.calibration_run_id;
  openSelectedCalibrationRun();
}

const onForecastRowSelect = async (event: DataTableRowClickEvent) => {
  const rowData = event.data as ForecastJob;
  setSelectedForecastRowData(rowData);
}

const onForecastRowUnSelect = async (event: DataTableRowClickEvent) => {
  resetSelectedForecastRunId();
}

const viewCalibrationDetails = async (calibration_run_id: number) => {
  isLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isLoading.value = false;
    showMessagesGroup.value = true;
  })
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

const clearDataAndNavigateToSetupForecast = () => {
  isLoading.value = true;

  nextTick(async () => {
    navigateToSetupForecast();
  });

  isLoading.value = false;
}

const navigateToSetupForecast = () => {
  if (true) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[ForecastTabs.tab_setupForecast];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Calibration Job', detail: 'Please select a calibration job first.', life: ToastTimeout.timeout6000 };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const navigateToForecastRunStatus = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[ForecastTabs.tab_statusRun];
  e.click();
}

const navigateToForecastResults = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[ForecastTabs.tab_results];
  e.click();
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'white' }
  }
}

const toggleMessagesGroup = () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#HeadwaterBasinGage {
  width: 300px;
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
