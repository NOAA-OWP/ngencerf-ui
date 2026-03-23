<template>
  <div v-if="selectedLogCategory !== '' && selectedLogList && selectedLogList.length > 0" id="LogDisplayArea" class="col-span-5 p-2">
    <div class="pl-4">
      <div v-if="selectedLogList.length > 1" style="font-size: 0.9em;">
        <span class="font-bold pr-2 pt-3">Select {{ selectedLogCategoryDisplay }} Log: </span>
        <Select id="selectedLogOptions" class="p-select" style="width: auto; min-width: 254px;" v-model="selectedLogName" :options="selectedLogList"
          optionLabel="display_name" optionValue="name">
        </Select>
      </div>
      <div v-if="selectedLogFilePath !== '' && selectedLogList.length === 1" style="font-size: 0.9em;">
        <span class="font-bold">Log Name: </span>
        {{ selectedLogName.split('/').at(-1).split('.')[0] }}
      </div>
      <div v-if="selectedLogFilePath !== ''" style="font-size: 0.9em;">
        <span class="font-bold">Log File Path: </span>
        <span class="whitespace-nowrap overflow-auto">{{ selectedLogName }}</span>
      </div>

      <div v-if="selectedLogDisplay" class="mt-2">
        <div class="pagination-box" v-if="selectedLogDisplay">
          <div class="pagination-rows">Rows {{ selectedLogStartRow }} to {{ selectedLogEndRow }} of {{
            selectedLogTotalSize }}</div>
          <Paging v-model:currentPage="selectedLogCurrentPage" :totalPages=selectedLogTotalPages />
        </div>
      </div>
      <div v-else>
        Log file unavailable
      </div>

      <div v-if="selectedLogDisplay" id="selectedLogDisplay" class="p-2 gray-border overflow-scroll">
        <div v-html="selectedLogDisplay" class="whitespace-nowrap"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { ToastMessageOptions } from "primevue/toast";
import Paging from "../Common/Paging.vue";

import { generalStore } from '~/stores/common/GeneralStore';
import { useLogStore } from '@/stores/common/LogStore';

const { ngencerfBaseUrl } = useBackendConfig();

const { addToastRecord } = generalStore();
const toast = useToast();

const {
  logList,
  logListDefault,
  logDataPageSize,
  logLists,
  logListOptions,
  selectedLogCategory,
  selectedLogList,
  selectedLogName,
  selectedLogDisplay,
  selectedLogTotalSize,
  selectedLogCurrentPage,
  selectedLogTotalPages,
  selectedLogStartRow,
  selectedLogEndRow,
  selectedLogFilePath,
  selectedLogStatus
} = storeToRefs(useLogStore());
const {
  updateLogRefs
} = useLogStore();

// Handle selectedLogCategory changes
watch(selectedLogCategory, async () => {
  if (selectedLogCategory.value in logLists.value && selectedLogCategory.value != logListDefault.value) {
    selectedLogList.value = logLists.value[selectedLogCategory.value];
    selectedLogName.value = '';
    nextTick(() => {
      // start with the first log
      selectedLogName.value = selectedLogList.value[0].name;
      if (!selectedLogList.value.length) {
        const tMsg: ToastMessageOptions = { severity: 'info', summary: selectedLogName.value + ' not available', life: ToastTimeout.timeoutInfo };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    });
  } else {
    selectedLogList.value = [];
    selectedLogName.value = '';
  }
});

// Handle selectedLogName changes
watch(selectedLogName, async () => {
  if (selectedLogName.value !== '') {
    await updateLogRefs(true);
    if (selectedLogDisplay.value && selectedLogDisplay.value != '') {
      nextTick(async () => {
        document.getElementById('selectedLogDisplay').style.height = (((document.getElementById('MainLeftDataParent') as HTMLElement).getBoundingClientRect().bottom
          - ((document.getElementById('selectedLogDisplay') as HTMLElement).getBoundingClientRect().top + 10)) + 'px');
        document.getElementById('selectedLogDisplay').scrollTop = document.getElementById('selectedLogDisplay').scrollHeight;
      });
    }
  }
});

// Watch for page number changes in logs
watch(selectedLogCurrentPage, async () => {
  if (isNaN(selectedLogCurrentPage.value) || selectedLogCurrentPage.value < 1 || selectedLogCurrentPage.value > selectedLogTotalPages.value) {
    console.log('ERROR: Page number ' + selectedLogCurrentPage.value + ' out of bounds');
  } else {
    selectedLogStartRow.value = (logDataPageSize.value * (selectedLogCurrentPage.value - 1)) + 1;
    if (selectedLogCurrentPage.value === selectedLogTotalPages.value) {
      selectedLogEndRow.value = selectedLogTotalSize.value;
    } else {
      selectedLogEndRow.value = (selectedLogStartRow.value + logDataPageSize.value) - 1;
    }
    const response: any = await queryGetLogData(
      selectedLogName.value, // log_name
      selectedLogStartRow.value - 1, // start
      logDataPageSize.value // limit
    );
    if (response?._data) {
      let logText = '';
      for (let t = 0; t < response?._data?.log_data.length; t++) {
        logText += response?._data?.log_data[t] + '<br/>\n';
      }
      selectedLogDisplay.value = logText;
    } else {
      toast.removeAllGroups();
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Log data is currently unavailable', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  }
});

watch(selectedLogStatus, async () => {
  // if selectedLogStatus is not empty, update log refs
  if (selectedLogStatus.value && Object.keys(selectedLogStatus.value).length > 0) {
    updateLogRefs(selectedLogStatus.value?.file_updated);
  }
});

const selectedLogCategoryDisplay = computed(() => {
  let optionFound = logListOptions?.value?.find(option => option.name == selectedLogCategory.value);
  if (optionFound) {
    return optionFound.display_name.replace(' Logs','');
  }
  return selectedLogCategory.value;
})

onUnmounted(() => {
  logList.value = [];
  logListOptions.value = [];
  logListOptions.value = [];
  selectedLogCategory.value = logListDefault.value;
  selectedLogName.value = '';
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

.gray-border {
  border: 2px solid #d9d9d9;
}
</style>