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
      <div class="text-center">
        <h1 class="mt-10 mb-6 text-3xl font-bold inline-block">Verification Jobs</h1>
        <br />
        <p class="prompt-txt mb-2" style="margin-top:-10px;">
          Double click on a row to open, or right click for more options. To create a new Verification job,
          go to "Forecast Runs" and right-click on a Forecast.
        </p>
      </div>
      <div id="verificationJobList">
        <div id="VerTable">
          <div class="grid grid-cols-2 mb-5 gage-filter-wrapper">
            <div class="col-span-1">
              <!-- Filters go here -->
            </div>
          </div>
          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="vrContextMenu"
            :model="cmVerificationJob"></ContextMenu>
          <DataTable id="VerificationJobTable" :value="filteredVerificationJobs" scrollable scroll-height="400px"
            sortField="verification_job_id" :sortOrder="-1" table-style="min-width: 50rem"
            v-model:selection="selectedVerificationJob" selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onVerificationRowSelect" @rowUnselect="onVerificationRowUnSelect"
            @rowContextmenu="onRowContextMenu" class="boxed">
            <Column :pt="ptColumn" field="verification_job_id" header="Job ID" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.verification_job_id"
                  :aria-label="'Job ID ' + slotProps.data.verification_job_id"
                  :title="'Job ID ' + slotProps.data.verification_job_id">
                  {{ slotProps.data.verification_job_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="created_at" sortable>
              <template #header>
                <div class="column-header">
                  <span>Created</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.created_at"
                  :aria-label="'Created at ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                  :title="'Created at ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at) }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="forecast_run_id" header="Forecast Job ID" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.forecast_run_id" :aria-label="'Forecast Job ID ' + slotProps.data.forecast_run_id"
                  :title="'Forecast Job ID ' + slotProps.data.forecast_run_id">
                  {{ slotProps.data.forecast_run_id }}
                </span>
                <span v-else>N/A</span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="status" header="Status" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.status" :aria-label="'Status ' + slotProps.data.status"
                  :title="'Status ' + slotProps.data.status">
                  {{ slotProps.data.status }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="submit_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Submit Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.submit_date"
                  :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                  :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
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

import type { DataTableContextMenuOption, VerificationJob } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";

import { useVerificationStore } from "@/stores/verification/VerificationStore";
import { generalStore } from "~/stores/common/GeneralStore";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';

import type { DataTableRowClickEvent } from "primevue/datatable";
import MessagesGroup from "@/components/Common/MessagesGroup.vue";

const verificationStore = useVerificationStore();
const {
  verificationJobs,
  filteredVerificationJobs,
  selectedVerificationJob,
  verificationJobId,
  userVerificationJobData,
  isVerificationLoading
} = storeToRefs(verificationStore);

const {
  resetSelectedVerificationJobData,
  loadSelectedVerificationJob,
  setSelectedVerificationRowData,
  getVerificationJobs,
  deleteVerificationJob
} = useVerificationStore();
const showMessagesGroup = ref<boolean>(false);
const toast = useToast();
const vrContextMenu = ref(); //calibration run context menu

const { addToastRecord } = generalStore();

const cmVerificationJob = ref<DataTableContextMenuOption[]>([]);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const onRowContextMenu = (event: any) => {
  cmVerificationJob.value = [];
  const vrRowData = event.data as VerificationJob;
  if (selectedVerificationJob && selectedVerificationJob.value?.verification_job_id === vrRowData.verification_job_id) {
    vrContextMenu.value.show(event.originalEvent);
    if (['Saved','Ready'].includes(vrRowData.status)) {
      cmVerificationJob.value.push({ label: 'Show Setup', icon: 'pi pi-bars', command: () => navigateToSetupVerification() });
    }
    cmVerificationJob.value.push({ label: 'View Status', icon: 'pi pi-gauge', command: () => navigateToVerificationJobStatus() });
    if (vrRowData.status === 'Done') {
      cmVerificationJob.value.push({ label: 'View Results', icon: 'pi pi-chart-line', command: () => navigateToVerificationResults() });
    }
    if (vrRowData.status !== 'Running') {
      cmVerificationJob.value.push({ label: 'Delete', icon: 'pi pi-trash', command: () => deleteSelectedVerificationJob() });
    }
  }
};

onMounted(() => {
  isVerificationLoading.value = true;

  hilightTab(VerificationTabs.tab_verificationJobs);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    // clear all user-selected verification data
    resetSelectedVerificationJobData();

    // load verificationJobs
    await getVerificationJobs();

    console.log('filteredVerificationJobs:',filteredVerificationJobs.value);
  });

  isVerificationLoading.value = false;
})

const onVerificationRowSelect = async (event: DataTableRowClickEvent) => {
  const rowData = event.data as VerificationJob;
  await setSelectedVerificationRowData(rowData);
}

const onVerificationRowUnSelect = async (event: DataTableRowClickEvent) => {
  resetSelectedVerificationJobData();
}

const confirmDelete = useConfirm();
const deleteSelectedVerificationJob = () => {
  const selectedRunId = selectedVerificationJob?.value?.verification_job_id as number;
  let confirmMessage = "Are you sure you want to delete this verification job?"
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
  deleteVerificationJob(selectedRunId).then(response => {
    if (response.status === 200) {
      const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), 
      summary: 'Delete Verification Job', detail: 'Job ' + selectedRunId + ' deleted', life: useApiResponseToastSeverityLife(response?.status)};
      toast.add(tMsg); addToastRecord(tMsg);   
      getVerificationJobs();
      resetSelectedVerificationJobData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Verification Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
}

const navigateToSetupVerification = () => {
  isVerificationLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Setup Verification Tab"]');

    if (e) {
      if (selectedVerificationJob.value) {
        await loadSelectedVerificationJob(selectedVerificationJob?.value?.verification_job_id as number);
      }
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Setup Verification Tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isVerificationLoading.value = false;
  });
}

const navigateToVerificationJobStatus = () => {
  isVerificationLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Run/Status Tab"]');

    if (e) {
      await loadSelectedVerificationJob(selectedVerificationJob?.value?.verification_job_id as number);
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Run/Status Tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isVerificationLoading.value = false;
  });
}

const navigateToVerificationResults = () => {
  isVerificationLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Results Tab"]');

    if (e) {
      await loadSelectedVerificationJob(selectedVerificationJob?.value?.verification_job_id as number);
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Results tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
    }
    isVerificationLoading.value = false;
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

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#PgTitle {
  text-align: center;
  font-size: 30px;
  margin-top: 40px;
  margin-bottom: 40px;
}

#VerTable {
  width: 1000px;
  margin: 0 auto;

  .table {
    thead tr th {
      background-color: #F5A4A4;
      border: 1px solid #000;
    }
  }
}

.p-select {
  width: 300px;
  border: 1px solid #ccc !important;
  height: 40px;
}
</style>