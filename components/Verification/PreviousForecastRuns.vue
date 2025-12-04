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
      <div id="forecastRunList">
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
            :show-status="false" :show-gage="false" :show-modules="false" :show-archived="false"
            :totalSize="forecastRunsForVerificationListTotalSize" :totalPages="forecastRunsForVerificationListTotalPages"
            v-model:currentPage="forecastRunsForVerificationListCurrentPage"
            @RefreshJobList="refreshJobList()" ref="jobFilterDialog" />

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'fr-context-menu' } }" class="bg-white" ref="frContextMenu"
            :model="cmForecastRun"></ContextMenu>
          
          <div v-if="forecastRunsForVerification.length > 0 && forecastRunsForVerificationListTotalSize > 0" class="pagination-box">
            <div class="pagination-rows">
              Rows {{ forecastRunsForVerificationListStartRow }} to {{ forecastRunsForVerificationListEndRow }} of {{ forecastRunsForVerificationListTotalSize }}
            </div>
            <Paging v-model:currentPage="forecastRunsForVerificationListCurrentPage" :totalPages=forecastRunsForVerificationListTotalPages />
          </div>
          <div v-else>
            No results. Try changing or clearing filters.
          </div>
          
          <DataTable id="ForecastRuns" table-style="min-width: 50rem" scrollable scroll-height="400px"
            :value="forecastRunsForVerification" 
            v-model:sortField="forecastRunsForVerificationListSort.field" v-model:sortOrder="forecastRunsForVerificationListSort.direction"
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
                  :aria-label="'Cycle Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cycle_date)"
                  :title="'Cycle Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cycle_date)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cycle_date) }}
                </div>
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
          </DataTable>
        </div>
      </div>

    </div>
    <div class="waitgif" v-if="isVerificationLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

import type { DataTableContextMenuOption, ForecastJob } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";

import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { useVerificationStore } from "@/stores/verification/VerificationStore";
import { generalStore } from "~/stores/common/GeneralStore";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';

import type { DataTableRowClickEvent } from "primevue/datatable";
import MessagesGroup from "@/components/Common/MessagesGroup.vue";
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"
import Paging from "../Common/Paging.vue";

const forecastStore = useForecastStore();
const verificationStore = useVerificationStore();
const { selectedForecastJob } = storeToRefs(forecastStore);
const {
  forecastJobId,
  forecastRunsForVerification,
  forecastRunsForVerificationListPageSize,
  forecastRunsForVerificationListCurrentPage,
  forecastRunsForVerificationListTotalPages,
  forecastRunsForVerificationListTotalSize,
  forecastRunsForVerificationListStartRow,
  forecastRunsForVerificationListEndRow,
  forecastRunsForVerificationListSort,
  verificationJobId,
  selectedVerificationJob,
  userVerificationJobData,
  isVerificationLoading
} = storeToRefs(verificationStore);

const {
  setSelectedForecastRunId,
  setSelectedForecastRowData,
  getForecastRunsForVerification,
  resetSelectedVerificationJobData,
  fetchNewVerificationJobId,
  loadSelectedVerificationJob,
  setSelectedVerificationJobId
} = useVerificationStore();
const showMessagesGroup = ref<boolean>(false);
const toast = useToast();
const frContextMenu = ref(); //calibration run context menu

const { addToastRecord } = generalStore();

const cmForecastRun = ref<DataTableContextMenuOption[]>([]);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

// watch for sort order change - reset current page to 1
watch(forecastRunsForVerificationListSort, async() => {
  forecastRunsForVerificationListCurrentPage.value = 1;
  await getForecastRunsForVerification();
},{ deep: true });

// Watch for page number changes in job list
watch(forecastRunsForVerificationListCurrentPage, async () => {
  if (isNaN(forecastRunsForVerificationListCurrentPage.value) || forecastRunsForVerificationListCurrentPage.value < 1 || forecastRunsForVerificationListCurrentPage.value > Math.ceil(forecastRunsForVerificationListTotalSize.value / forecastRunsForVerificationListPageSize.value)) {
    console.log('ERROR: Page number ' + forecastRunsForVerificationListCurrentPage.value + ' out of bounds');
  } else {
    await getForecastRunsForVerification();
  }
});

const onRowContextMenu = (event: any) => {
  cmForecastRun.value = [];
  const crRowData = event.data as ForecastJob;
  if (selectedForecastJob && selectedForecastJob.value?.forecast_run_id === crRowData.forecast_run_id) {
    frContextMenu.value.show(event.originalEvent);
    setSelectedForecastRunId(parseInt(event.originalEvent.currentTarget.children[0].textContent));
    cmForecastRun.value.push({ label: 'Run New Verification', icon: 'pi pi-bars', command: () => createNewVerification() });
  }
};

onMounted(async () => {
  isVerificationLoading.value = true;

  hilightTab(VerificationTabs.tab_forecastRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    // clear previously selected forecast job
    selectedForecastJob.value = undefined;
    forecastJobId.value = undefined;
    forecastRunsForVerificationListCurrentPage.value = 1;

    // load forecast runs
    await getForecastRunsForVerification();
  });

  isVerificationLoading.value = false;
});

const onForecastRowSelect = async (event: DataTableRowClickEvent) => {
  const rowData = event.data as ForecastJob;
  setSelectedForecastRowData(rowData);
}

const onForecastRowUnSelect = async (event: DataTableRowClickEvent) => {
  forecastJobId.value = undefined;
}

const navigateToSetupVerification = () => {
  isVerificationLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Run/Status Tab"]');

    if (e) {
      if (selectedVerificationJob.value) {
        await setSelectedVerificationJobId(selectedVerificationJob?.value?.verification_run_id as number);
      }
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Run/Status Tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isVerificationLoading.value = false;
  });
}

const createNewVerification = async () => {
  // Clear out old data
  resetSelectedVerificationJobData();
  fetchNewVerificationJobId().then(response => {
    if (response.status === 201) {
      if (response?._data && response?._data?.verification_run_id && response?._data?.verification_run_id > 0) {
        verificationJobId.value = response?._data?.verification_run_id as number;
        loadSelectedVerificationJob(verificationJobId.value).then(queryResponse => {
          userVerificationJobData.value = queryResponse?._data;
          navigateToSetupVerification();
        });
      } else {
        const tMsg: ToastMessageOptions = { severity: "error", summary: 'Create Verification Job Failed.', detail: "Unable to Retrieve Valid Verification Job Id", life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Create Verification Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
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
  isVerificationLoading.value = true;
  await getForecastRunsForVerification();
  isVerificationLoading.value = false;
}

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
