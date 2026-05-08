<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <client-only>
    <div class="pr-2">
      <div id="hindcastRunListSort">
        <div id="HindcastTable" class="w-max mx-auto">
          <div class="flex mt-2">
            <h1 class="pt-3 mb-8 text-3xl font-bold inline-block text-center w-[1200px]">
              <span>Hindcast Runs</span><br />
              <span style="font-size: 12px;font-weight: normal;padding-left: 5px;">
                Select a job then right click for available actions.
              </span>
            </h1>
          </div>

          <JobFilterDialog id="JobFilterDialog" job-type="Hindcast" :disable-all="false" 
            :show-modules="false" :show-archived="false"
            :totalSize="hindcastRunListTotalSize" :totalPages="hindcastRunListTotalPages"
            v-model:currentPage="hindcastRunListCurrentPage"
            @RefreshJobList="refreshJobList()" @ResetFilters="resetFilters()" 
            @UpdateGageList="updateGageList()" ref="jobFilterDialog" />

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
            :model="cmHindcastRun"></ContextMenu>
          
          <div v-if="hindcastRuns.length > 0 && hindcastRunListTotalSize > 0" class="pagination-box">
            <div class="pagination-rows">
              Rows {{ hindcastRunListStartRow }} to {{ hindcastRunListEndRow }} of {{ hindcastRunListTotalSize }}
            </div>
            <Paging v-model:currentPage="hindcastRunListCurrentPage" :totalPages=hindcastRunListTotalPages />
          </div>
          <div v-else>
            No results. Try changing or clearing filters.
          </div>

          <DataTable id="HindcastRuns" :value="hindcastRuns" 
            scrollable scroll-height="400px" table-style="min-width: 50rem"
            v-model:sortField="hindcastRunListSort.field" v-model:sortOrder="hindcastRunListSort.direction"
            v-model:selection="selectedHindcastJob" selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onHindcastRowSelect" @rowUnselect="onHindcastRowUnSelect" @rowContextmenu="onRowContextMenu"
            class="boxed">
            <Column :pt="ptColumn" field="hindcast_run_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Hindcast</span><br /><span>Job ID</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.hindcast_run_id"
                  :aria-label="'Hindcast Job ID ' + slotProps.data.hindcast_run_id"
                  :title="'Hindcast Job ID ' + slotProps.data.hindcast_run_id">
                  {{ slotProps.data.hindcast_run_id }}
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
            <Column field="cold_start.cold_start_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Cold Start Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <div v-if="slotProps.data.cold_start?.cold_start_date" class="text-center"
                  :aria-label="'Cold Start Date ' + (slotProps.data.cold_start.cold_start_date ? formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cold_start.cold_start_date) : '')"
                  :title="'Cold Start Date ' + (slotProps.data.cold_start.cold_start_date ? formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cold_start.cold_start_date) : '')">
                  {{ (slotProps.data.cold_start.cold_start_date ? formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.cold_start.cold_start_date) : '') }}
                </div>
              </template>
            </Column>
            <Column :pt="ptColumn" field="hindcast_status" sortable>
              <template #header>
                <div class="column-header">
                  <span>Job Status</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.hindcast_status" :aria-label="'Job Status ' + slotProps.data.hindcast_status"
                  :title="'Job Status ' + slotProps.data.hindcast_status">
                  {{ slotProps.data.hindcast_status }}
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
    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

import type { DataTableContextMenuOption, HindcastJob } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";

import { useHindcastStore } from "@/stores/hindcast/HindcastStore";
import { useVerificationStore } from "~/stores/forecast/VerificationStore";
import { generalStore } from "~/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';

import type { DataTableRowClickEvent } from "primevue/datatable";
import MessagesGroup from "@/components/Common/MessagesGroup.vue";
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"
import Paging from "../Common/Paging.vue";

const { isLoading } = storeToRefs(generalStore());
const { uiGageList, userCalibrationRunData } = storeToRefs(useUserDataStore());

const HindcastStore = useHindcastStore();
const {
  hindcastJobId,
  calibrationRunForHindcast,
  hindcastRuns,
  hindcastRunListPageSize,
  hindcastRunListCurrentPage,
  hindcastRunListTotalPages,
  hindcastRunListTotalSize,
  hindcastRunListStartRow,
  hindcastRunListEndRow,
  hindcastRunListSort,
  selectedHindcastJob,
  hindcastJobStatus
} = storeToRefs(HindcastStore);

const {
  setSelectedHindcastRunId,
  resetSelectedHindcastRunData,
  loadSelectedCalibrationRun,
  setSelectedHindcastRowData,
  getHindcastJobs,
  deleteHindcastJob,
  resetUserSelectedHindcastCalibrationRun,
  hardResetHindcastStore,
  resetFilters,
  fetchHindcastGageList
} = useHindcastStore();

const { resetSelectedVerificationJobData } = useVerificationStore();

const showMessagesGroup = ref<boolean>(false);
const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

const { addToastRecord } = generalStore();

// watch for sort order change - reset current page to 1
watch(hindcastRunListSort, async() => {
  hindcastRunListCurrentPage.value = 1;
  await getHindcastJobs();
},{ deep: true });

// Watch for page number changes in job list
watch(hindcastRunListCurrentPage, async () => {
  if (isNaN(hindcastRunListCurrentPage.value) || hindcastRunListCurrentPage.value < 1 || hindcastRunListCurrentPage.value > Math.ceil(hindcastRunListTotalSize.value / hindcastRunListPageSize.value)) {
    console.log('ERROR: Page number ' + hindcastRunListCurrentPage.value + ' out of bounds');
  } else {
    await getHindcastJobs();
  }
});

const cmHindcastRun = ref<DataTableContextMenuOption[]>([]);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const onRowContextMenu = (event: any) => {
  cmHindcastRun.value = [];
  const crRowData = event.data as HindcastJob;
  if (selectedHindcastJob && selectedHindcastJob.value?.hindcast_run_id === crRowData.hindcast_run_id) {
    crContextMenu.value.show(event.originalEvent);
    setSelectedHindcastRunId(parseInt(event.originalEvent.currentTarget.children[0].textContent));
    cmHindcastRun.value.push({ label: 'View Status', icon: 'pi pi-gauge', command: () => navigateToHindcastRunStatus() });
    if (crRowData.hindcast_status === 'Done') {
      cmHindcastRun.value.push({ label: 'View Results', icon: 'pi pi-chart-line', command: () => navigateToHindcastResults() });
    }
    if (crRowData.calibration_run_id) {
      cmHindcastRun.value.push({ label: 'Run New Hindcast', icon: 'pi pi-chevron-circle-right', command: () => navigateToSetupHindcast() });
      if (crRowData.hindcast_status === 'Done') {
        cmHindcastRun.value.push({ label: 'Run New Verification', icon: 'pi pi-bars', command: () => createNewVerification() });
      }
      cmHindcastRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-list', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
    }
    if (crRowData.hindcast_status !== 'Running') {
      cmHindcastRun.value.push({ label: 'Delete', icon: 'pi pi-trash', command: () => deleteSelectedHindcastJob() });
    }
  }
};

const isMounted = ref(false);

onMounted(async () => {
  isLoading.value = true;
  hindcastJobId.value = undefined;
  calibrationRunForHindcast.value = undefined;
  selectedHindcastJob.value = undefined;
  hindcastJobStatus.value = undefined; 
  hindcastRunListCurrentPage.value = 1;

  //reset Run/Status store in case we have running intervals
  hardResetHindcastStore();

  //reset any previously selected verification data
  resetSelectedVerificationJobData();

  hilightTab(HindcastTabs.tab_hindcastRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    // clear previously selected hindcast job
    if (selectedHindcastJob.value) {
      selectedHindcastJob.value = undefined;
    }

    // clear all user-selected hindcast and calibration data
    resetUserSelectedHindcastCalibrationRun();

    // load hindcastRuns
    await getHindcastJobs();

    updateGageList();
  });

  isLoading.value = false;
});

const updateGageList = async() => {
  uiGageList.value = await fetchHindcastGageList();
}

const onHindcastRowSelect = async (event: DataTableRowClickEvent) => {
  const rowData = event.data as HindcastJob;
  setSelectedHindcastRowData(rowData);
}

const onHindcastRowUnSelect = async (event: DataTableRowClickEvent) => {
  resetSelectedHindcastRunData();
}

const viewCalibrationDetails = async (calibration_run_id: number) => {
  isLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const navigateToSetupHindcast = (new_hindcast: boolean=true) => {
  isLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Setup Hindcast Tab"]');

    if (e) {
      // set userCalibrationRunData
      await loadSelectedCalibrationRun(selectedHindcastJob?.value?.calibration_run_id as number);
      if (new_hindcast) {
        calibrationRunForHindcast.value.hindcast_run_id = undefined;
        calibrationRunForHindcast.value.hindcast_status = undefined;
        calibrationRunForHindcast.value.configuration = undefined;
        calibrationRunForHindcast.value.cycle_date = undefined;
        if (calibrationRunForHindcast.value?.cold_start) {
          calibrationRunForHindcast.value.cold_start.cold_start_date = undefined;
        }
        hindcastJobId.value = undefined;
      }
      isLoading.value = false;
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Setup Hindcast Tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isLoading.value = false;
  });
}

const navigateToHindcastRunStatus = () => {
  isLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Hindcast Run/Status Tab"]');

    if (e) {
      await loadSelectedCalibrationRun(selectedHindcastJob?.value?.calibration_run_id as number);
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Run/Status tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isLoading.value = false;
  });
}

const navigateToHindcastResults = () => {
  isLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Hindcast Results Tab"]');

    if (e) {
      await loadSelectedCalibrationRun(selectedHindcastJob?.value?.calibration_run_id as number);
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Results tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isLoading.value = false;
  });
}

const confirmDelete = useConfirm();
const deleteSelectedHindcastJob = () => {
  const selectedRunId = calibrationRunForHindcast?.value?.hindcast_run_id as number;
  let confirmMessage = "Are you sure you want to delete this hindcast job?"
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
  deleteHindcastJob(selectedRunId).then(response => {
    if (response.status === 200) {
      const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), 
      summary: 'Delete Hindcast Job', detail: 'Job ' + selectedRunId + ' deleted', life: useApiResponseToastSeverityLife(response?.status)};
      toast.add(tMsg); addToastRecord(tMsg);   
      getHindcastJobs();
      resetSelectedHindcastRunData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Hindcast Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
}

const createNewVerification = async () => {
  // Just go to Run/Status with the selected hindcast - no need to create anything new yet
  navigateToVerificationJobStatus();
}

const navigateToVerificationJobStatus = () => {
  isLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Verification Run/Status Tab"]');

    if (e) {
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Verification Run/Status Tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isLoading.value = false;
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
 * Refresh Hindcast Jobs Table
 */
const refreshJobList = async () => {
  isLoading.value = true;
  await getHindcastJobs();
  isLoading.value = false;
}

watch(selectedHindcastJob, () => {
  if (!selectedHindcastJob.value) {
    calibrationRunForHindcast.value = undefined;
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
