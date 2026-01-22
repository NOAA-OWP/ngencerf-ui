<template>
  <div class="col-span-2">
    <h1 class="pt-3 mb-8 text-3xl font-bold inline-block">
      <span id="tab-title">Verification Job Results</span>
    </h1>

    <table aria-describedby="tab-title">
      <tbody>
        <tr height="38px" aria-label="Display" title="Display">
          <th scope="row" class="text-right font-bold">
            <div style="width: 160px;">Display</div>
          </th>
          <td class="pl-5">
            <Select id="DisplayOptions" class="p-select" style="width: auto; min-width: 254px;"
              v-model="selectedLogCategory" :options="logList" option-label="display_name" optionValue="name">
            </Select>
          </td>
        </tr>
        <tr height="38px" :aria-label="'Verification Job ID is ' + verificationJobId"
          :title="'Verification Job ID is ' + verificationJobId">
          <th scope="row" class="text-right font-bold">
            <div style="width: 160px;">Verification Job ID</div>
          </th>
          <td class="pl-5">{{ verificationJobId ?? '-'.repeat(15) }}</td>
        </tr>
        <tr height="38px" :aria-label="'Elapsed Time ' + elapsedTime" :title="'Elapsed Time ' + elapsedTime">
          <th scope="row" class="text-right font-bold">
            <div style="width: 160px;">Elapsed Time</div>
          </th>
          <td class="pl-5">{{ elapsedTime ?? '-'.repeat(15) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <div v-if="verificationPlotNames?.some(plot => plot.name === selectedLogCategory) && verificationPlotFileUrl" id="VerificationPlot" class="p-2" aria-label="Plot display area" title="Plot display area">
      <img :src="verificationPlotFileUrl" alt="Selected Plot" />
    </div>
    <!-- DISPLAY LOGS -->

    <div v-show="selectedLogCategory && !verificationPlotNames?.some(plot => plot.name === selectedLogCategory)">
      <LogDisplay/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { storeToRefs } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
import { useLogStore } from '@/stores/common/LogStore';

const { addToastRecord } = generalStore();
const toast = useToast();

import { useVerificationStore } from "@/stores/verification/VerificationStore";
const verificationStore = useVerificationStore();

const { 
  verificationJobId, 
  selectedVerificationJob, 
  elapsedTime,
  verificationJobStatus,
  verificationPlotNames
} = storeToRefs(verificationStore);
const { 
  getVerificationStatus,
  getVerificationPlotNames, 
  getVerificationPlot 
} = useVerificationStore();

const {
  selectedLogCategory,
  logList
} = storeToRefs(useLogStore());
const {
  populateLogListOptions,
  resetUserLogRefs
} = useLogStore();

const verificationPlotDefault = ref<string>('Select an option');
const verificationPlotFileUrl = ref<string | undefined>();

import { hilightTab } from '@/composables/TabHilight';
onMounted(async() => {
  hilightTab(VerificationTabs.tab_results);

  getVerificationStatus().then( response => {
    if ( response._data.status ) {
      verificationJobStatus.value = response._data.status;
      elapsedTime.value = response._data.elapsed_time ? formatElapsedTime(response._data.elapsed_time) : '';
    };
  })

  const response = await getVerificationPlotNames();
  if (response?._data?.plot_names) {
    verificationPlotNames.value = [{ name: verificationPlotDefault.value, display_name: verificationPlotDefault.value }, ...response._data.plot_names];
  }

  await populateLogListOptions(verificationPlotNames.value);
  selectedLogCategory.value = verificationPlotDefault.value;
})

// Handle verificationPlot changes
watch(selectedLogCategory, async () => {
  if(selectedLogCategory.value && selectedLogCategory.value != verificationPlotDefault.value &&
    verificationPlotNames.value.some(plot => plot.name === selectedLogCategory.value)) {
    const response: any = await getVerificationPlot(selectedLogCategory.value);
    verificationPlotFileUrl.value = response?._data?.plot_url;
  } else {
    verificationPlotFileUrl.value = undefined;
  }
})

onUnmounted(() => {
  verificationPlot.value = undefined;
  verificationPlotFileUrl.value = undefined;
  resetUserLogRefs();
})

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
</style>