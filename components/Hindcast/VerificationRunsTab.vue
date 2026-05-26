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
      <div class="text-center">
        <h1 class="mt-10 mb-6 text-3xl font-bold inline-block">Verification Jobs</h1>
        <br />
        <p class="prompt-txt mb-2" style="margin-top:-10px;">
          Double click on a row to open, or right click for more options. To create a new Verification job,
          go to "Hindcast Runs" and right-click on a Hindcast.
        </p>
      </div>
      <div id="verificationRunList">
        <div id="VerTable">
          <JobFilterDialog id="JobFilterDialog" job-type="Verification" :disable-all="false" 
            :show-modules="false" :show-archived="false"
            :totalSize="verificationRunListTotalSize" :totalPages="verificationRunListTotalPages"
            v-model:currentPage="verificationRunListCurrentPage"
            @RefreshJobList="refreshJobList()" @ResetFilters="resetFilters()" 
            @UpdateGageList="updateGageList()" ref="jobFilterDialog" />

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="vrContextMenu"
            :model="cmVerificationJob"></ContextMenu>
          
          <div v-if="verificationJobs.length > 0 && verificationRunListTotalSize > 0" class="pagination-box">
            <div class="pagination-rows">
              Rows {{ verificationRunListStartRow }} to {{ verificationRunListEndRow }} of {{ verificationRunListTotalSize }}
            </div>
            <Paging v-model:currentPage="verificationRunListCurrentPage" :totalPages=verificationRunListTotalPages />
          </div>
          <div v-else>
            No results. Try changing or clearing filters.
          </div>

          <DataTable id="VerificationJobTable" table-style="min-width: 50rem" scrollable scroll-height="400px"
            :value="verificationJobs"
            v-model:sortField="verificationRunListSort.field" v-model:sortOrder="verificationRunListSort.direction"
            v-model:selection="selectedVerificationJob" selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onVerificationRowSelect" @rowUnselect="onVerificationRowUnSelect"
            @rowContextmenu="onRowContextMenu" class="boxed">
            <Column :pt="ptColumn" field="verification_run_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Verification Job ID</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.verification_run_id"
                  :aria-label="'Job ID ' + slotProps.data.verification_run_id"
                  :title="'Job ID ' + slotProps.data.verification_run_id">
                  {{ slotProps.data.verification_run_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="hindcast_run_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Hindcast Job ID</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.hindcast_run_id" :aria-label="'Hindcast Job ID ' + slotProps.data.hindcast_run_id"
                  :title="'Hindcast Job ID ' + slotProps.data.hindcast_run_id">
                  {{ slotProps.data.hindcast_run_id }}
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

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

import type { DataTableContextMenuOption, VerificationJob } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";

import { useHindcastStore } from "~/stores/hindcast/HindcastStore";
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
const { uiGageList } = storeToRefs(useUserDataStore());

const { resetFilters } = useHindcastStore();

const verificationStore = useVerificationStore();
const {
  verificationJobs,
  verificationJobType,
  verificationRunListPageSize,
  verificationRunListCurrentPage,
  verificationRunListTotalPages,
  verificationRunListTotalSize,
  verificationRunListStartRow,
  verificationRunListEndRow,
  verificationRunListSort,
  selectedVerificationJob
} = storeToRefs(verificationStore);

const {
  resetSelectedVerificationJobData,
  setSelectedVerificationRowData,
  getVerificationJobs,
  deleteVerificationJob,
  fetchVerificationGageList
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

// watch for sort order change - reset current page to 1
watch(verificationRunListSort, () => {
  verificationRunListCurrentPage.value = 1;
  refreshJobList();
},{ deep: true });

// Watch for page number changes in job list
watch(verificationRunListCurrentPage, () => {
  if (isNaN(verificationRunListCurrentPage.value) || verificationRunListCurrentPage.value < 1 || verificationRunListCurrentPage.value > Math.ceil(verificationRunListTotalSize.value / verificationRunListPageSize.value)) {
    console.log('ERROR: Page number ' + verificationRunListCurrentPage.value + ' out of bounds');
  } else {
    refreshJobList();
  }
});

/**
 * Refresh Verification Jobs Table
 */
const refreshJobList = async () => {
  isLoading.value = true;
  await getVerificationJobs();
  isLoading.value = false;
}

const onRowContextMenu = (event: any) => {
  cmVerificationJob.value = [];
  const vrRowData = event.data as VerificationJob;
  if (selectedVerificationJob && selectedVerificationJob.value?.verification_run_id === vrRowData.verification_run_id) {
    vrContextMenu.value.show(event.originalEvent);
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
  isLoading.value = true;

  hilightTab(HindcastTabs.tab_verificationJobs);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    // clear all user-selected verification data
    resetSelectedVerificationJobData();
    verificationRunListCurrentPage.value = 1;

    // load verificationJobs
    verificationJobType.value = 'hindcast';
    await getVerificationJobs();
    updateGageList();
  });

  isLoading.value = false;
})

const updateGageList = async() => {
  uiGageList.value = await fetchVerificationGageList();
}

const onVerificationRowSelect = async (event: DataTableRowClickEvent) => {
  const rowData = event.data as VerificationJob;
  await setSelectedVerificationRowData(rowData);
}

const onVerificationRowUnSelect = async (event: DataTableRowClickEvent) => {
  resetSelectedVerificationJobData();
}

const confirmDelete = useConfirm();
const deleteSelectedVerificationJob = () => {
  const selectedRunId = selectedVerificationJob?.value?.verification_run_id as number;
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

const navigateToVerificationResults = () => {
  isLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Verification Results Tab"]');

    if (e) {
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Verification Results Tab not found', life: ToastTimeout.timeoutError } as ToastMessageOptions);
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