<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <client-only>
    <div class="pr-2">
      <div id="forecastRunListSort">
        <div id="ForecastTable" class="w-max mx-auto">
          <div class="flex mt-2">
            <h1 class="pt-3 mb-8 text-3xl font-bold inline-block text-center w-[1200px]">
              <span>Forecast Runs</span><br />
              <span style="font-size: 12px;font-weight: normal;padding-left: 5px;">
                Select a job then right click for available actions.
              </span>
            </h1>
          </div>

          <JobFilterDialog id="JobFilterDialog" :disable-all="false" 
            :show-gage="false" :show-modules="false" :show-archived="false"
            :totalSize="forecastRunListTotalSize" :totalPages="forecastRunListTotalPages"
            v-model:currentPage="forecastRunListCurrentPage"
            @RefreshJobList="refreshJobList()" ref="jobFilterDialog" />

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
            :model="cmForecastRun"></ContextMenu>
          
          <div v-if="forecastRuns.length > 0 && forecastRunListTotalSize > 0" class="pagination-box">
            <div class="pagination-rows">
              Rows {{ forecastRunListStartRow }} to {{ forecastRunListEndRow }} of {{ forecastRunListTotalSize }}
            </div>
            <Paging v-model:currentPage="forecastRunListCurrentPage" :totalPages=forecastRunListTotalPages />
          </div>
          <div v-else>
            No results. Try changing or clearing filters.
          </div>

          <DataTable id="ForecastRuns" :value="forecastRuns" 
            scrollable scroll-height="400px" table-style="min-width: 50rem"
            v-model:sortField="forecastRunListSort.field" v-model:sortOrder="forecastRunListSort.direction"
            v-model:selection="selectedForecastJob" selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onForecastRowSelect" @rowUnselect="onForecastRowUnSelect" @rowContextmenu="onRowContextMenu"
            class="boxed">
            <Column :pt="ptColumn" field="forecast_run_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Forecast</span><br /><span>ID</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.forecast_run_id"
                  :aria-label="'Forecast Job ID ' + slotProps.data.forecast_run_id"
                  :title="'Forecast Job ID ' + slotProps.data.forecast_run_id">
                  {{ slotProps.data.forecast_run_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="calibration_run_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Calibration</span><br /><span>Job ID</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.calibration_run_id"
                  :aria-label="'Calibration Job ID ' + slotProps.data.calibration_run_id"
                  :title="'Calibration Job ID ' + slotProps.data.calibration_run_id">
                  {{ slotProps.data.calibration_run_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="gage_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Headwater</span><br /><span>Basin Gage</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.gage_id" :aria-label="'Headwater Basin Gage ' + slotProps.data.gage_id"
                  :title="'Headwater Basin Gage ' + slotProps.data.gage_id">
                  {{ slotProps.data.gage_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="domain_name" sortable>
              <template #header>
                <div class="column-header">
                  <span>Domain</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.domain_name" :aria-label="'Domain ' + slotProps.data.domain_name"
                  :title="'Domain ' + slotProps.data.domain_name">
                  {{ slotProps.data.domain_name }}
                </span>
              </template>
            </Column>
            <Column field="created_at" sortable>
              <template #header>
                <div class="column-header">
                  <span>Creation Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <div v-if="slotProps.data.created_at" class="text-center"
                  :aria-label="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                  :title="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at) }}
                </div>
              </template>
            </Column>
            <Column :pt="ptColumn" field="configuration" header="Configuration" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.configuration" :aria-label="'Configuration ' + slotProps.data.configuration"
                  :title="'Configuration ' + slotProps.data.configuration">
                  {{ slotProps.data.configuration }}
                </span>
              </template>
            </Column>
            <Column field="cycle_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Cycle Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <div v-if="slotProps.data.cycle_date" class="text-center"
                  :aria-label="'Cycle Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cycle_date) + 'Z'"
                  :title="'Cycle Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cycle_date) + 'Z'">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cycle_date) }}Z
                </div>
              </template>
            </Column>
            <Column field="cold_start.cold_start_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Cold Start Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <div v-if="slotProps.data.cold_start?.cold_start_date" class="text-center"
                  :aria-label="'Cold Start Date ' + (slotProps.data.cold_start.cold_start_date ? formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cold_start.cold_start_date) + 'Z' : '')"
                  :title="'Cold Start Date ' + (slotProps.data.cold_start.cold_start_date ? formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cold_start.cold_start_date) + 'Z' : '')">
                  {{ (slotProps.data.cold_start.cold_start_date ? formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cold_start.cold_start_date) + 'Z' : '') }}
                </div>
              </template>
            </Column>
            <Column :pt="ptColumn" field="forecast_status" sortable>
              <template #header>
                <div class="column-header">
                  <span>Job Status</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.forecast_status" :aria-label="'Job Status ' + slotProps.data.forecast_status"
                  :title="'Job Status ' + slotProps.data.forecast_status">
                  {{ slotProps.data.forecast_status }}
                </span>
              </template>
            </Column>
            <Column field="submit_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Submit Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <div v-if="slotProps.data.submit_date" class="text-center"
                  :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                  :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

    </div>
    <div class="waitgif" v-if="isForecastLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

import type { CalibrationRunForForecast, DataTableContextMenuOption, ForecastJob } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";

import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { generalStore } from "~/stores/common/GeneralStore";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';

import type { DataTableRowClickEvent } from "primevue/datatable";
import MessagesGroup from "@/components/Common/MessagesGroup.vue";
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"
import Paging from "../Common/Paging.vue";

const forecastStore = useForecastStore();
const {
  forecastJobId,
  calibrationRunForForecast,
  calibrationRunsForForecast,
  forecastRuns,
  forecastRunListPageSize,
  forecastRunListCurrentPage,
  forecastRunListTotalPages,
  forecastRunListTotalSize,
  forecastRunListStartRow,
  forecastRunListEndRow,
  forecastRunListSort,
  selectedForecastJob,
  isForecastLoading
} = storeToRefs(forecastStore);

const {
  setSelectedForecastRunId,
  resetSelectedForecastRunData,
  loadForecastRunStatusTabData,
  loadForecastResultsTabData,
  loadSelectedCalibrationRun,
  setSelectedForecastRowData,
  getForecastJobs,
  getCalibrationJobsForForecast,
  deleteForecastJob,
  resetUserSelectedForecastCalibrationRun,
  hardResetForecastRunStatusStore
} = useForecastStore();
const showMessagesGroup = ref<boolean>(false);
const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

const { addToastRecord } = generalStore();

// watch for sort order change - reset current page to 1
watch(forecastRunListSort, async() => {
  forecastRunListCurrentPage.value = 1;
  await getForecastJobs();
  await getCalibrationJobsForForecast();
},{ deep: true });

// Watch for page number changes in job list
watch(forecastRunListCurrentPage, async () => {
  if (isNaN(forecastRunListCurrentPage.value) || forecastRunListCurrentPage.value < 1 || forecastRunListCurrentPage.value > Math.ceil(forecastRunListTotalSize.value / forecastRunListPageSize.value)) {
    console.log('ERROR: Page number ' + forecastRunListCurrentPage.value + ' out of bounds');
  } else {
    await getForecastJobs();
    await getCalibrationJobsForForecast();
  }
});

const cmForecastRun = ref<DataTableContextMenuOption[]>([]);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const onRowContextMenu = (event: any) => {
  cmForecastRun.value = [];
  const crRowData = event.data as ForecastJob;
  if (selectedForecastJob && selectedForecastJob.value?.forecast_run_id === crRowData.forecast_run_id) {
    crContextMenu.value.show(event.originalEvent);
    setSelectedForecastRunId(parseInt(event.originalEvent.currentTarget.children[0].textContent));
    if (crRowData.forecast_status === 'Saved') {
      cmForecastRun.value.push({ label: 'Show Setup', icon: 'pi pi-bars', command: () => navigateToSetupForecast() });
    }
    cmForecastRun.value.push({ label: 'View Status', icon: 'pi pi-gauge', command: () => navigateToForecastRunStatus() });
    if (crRowData.forecast_status === 'Done') {
      cmForecastRun.value.push({ label: 'View Results', icon: 'pi pi-chart-line', command: () => navigateToForecastResults() });
    }
    cmForecastRun.value.push({ label: 'Run New Forecast', icon: 'pi pi-chevron-circle-right', command: () => clearDataAndNavigateToSetupForecast() });
    cmForecastRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-list', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
    if (crRowData.forecast_status !== 'Running') {
      cmForecastRun.value.push({ label: 'Delete', icon: 'pi pi-trash', command: () => deleteSelectedForecastJob() });
    }
  }
};

onMounted(async () => {
  isForecastLoading.value = true;
  forecastJobId.value = undefined;
  forecastRunListCurrentPage.value = 1;

  //reset Run/Status store in case we have running intervals
  hardResetForecastRunStatusStore();

  hilightTab(ForecastTabs.tab_forecastRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    // clear previously selected forecast job
    if (selectedForecastJob.value) {
      selectedForecastJob.value = undefined;
    }

    // clear all user-selected forecast and calibration data
    resetUserSelectedForecastCalibrationRun();

    // load forecastRuns
    await getForecastJobs();

    // load calibrationRunsForForecast
    await getCalibrationJobsForForecast();
  });

  isForecastLoading.value = false;
});

const onForecastRowSelect = async (event: DataTableRowClickEvent) => {
  const rowData = event.data as ForecastJob;
  setSelectedForecastRowData(rowData);
}

const onForecastRowUnSelect = async (event: DataTableRowClickEvent) => {
  resetSelectedForecastRunData();
}

const viewCalibrationDetails = async (calibration_run_id: number) => {
  isForecastLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isForecastLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const clearDataAndNavigateToSetupForecast = () => {
  isForecastLoading.value = true;

  nextTick(async () => {
    navigateToSetupForecast();
  });
};

const navigateToSetupForecast = () => {
  isForecastLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Setup Forecast Tab"]');

    if (e) {
      // set calibrationRunForForecast based on selectedForecastJob
      calibrationRunForForecast.value = calibrationRunsForForecast.value.find((calibrationRun: CalibrationRunForForecast) => {
        return calibrationRun.calibration_run_id === selectedForecastJob.value?.calibration_run_id;
      }) as CalibrationRunForForecast;

      // set userCalibrationRunData
      await loadSelectedCalibrationRun(selectedForecastJob?.value?.calibration_run_id as number);
      isForecastLoading.value = false;
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Setup Forecast Tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isForecastLoading.value = false;
  });
}

const navigateToForecastRunStatus = () => {
  isForecastLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Run/Status Tab"]');

    if (e) {
      await loadSelectedCalibrationRun(selectedForecastJob?.value?.calibration_run_id as number);
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Run/Status tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isForecastLoading.value = false;
  });
}

const navigateToForecastResults = () => {
  isForecastLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Results tab"]');

    if (e) {
      await loadSelectedCalibrationRun(selectedForecastJob?.value?.calibration_run_id as number);
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Results tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isForecastLoading.value = false;
  });
}

const confirmDelete = useConfirm();
const deleteSelectedForecastJob = () => {
  const selectedRunId = calibrationRunForForecast?.value?.forecast_run_id as number;
  let confirmMessage = "Are you sure you want to delete this forecast job?"
  confirmDelete.require({
    message: confirmMessage,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'DELETE JOB',
    },
    accept: () => acceptDelete(selectedRunId),
    reject: () => {
      //do nothing
    }
  })
}
const acceptDelete = (selectedRunId: number) => {
  deleteForecastJob(selectedRunId).then(response => {
    if (response.status === 200) {
      const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), 
      summary: 'Delete Forecast Job', detail: 'Job ' + selectedRunId + ' deleted', life: useApiResponseToastSeverityLife(response?.status)};
      toast.add(tMsg); addToastRecord(tMsg);   
      getForecastJobs();
      resetSelectedForecastRunData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Verification Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
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

/**
 * Refresh Forecast Jobs Table
 */
const refreshJobList = async () => {
  isForecastLoading.value = true;
  await getForecastJobs();
  isForecastLoading.value = false;
}

watch(selectedForecastJob, () => {
  if (!selectedForecastJob.value) {
    calibrationRunForForecast.value = undefined;
  }
})

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#HeadwaterBasinGage {
  width: 300px;
}

#MessagesGroupWindow {
  z-index: 999;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}
</style>
