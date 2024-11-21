<template>
  <div>
    <div class="grid grid-cols-2">
      <div class="col-span-1">
        <table>
          <tbody>
            <tr height="40px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Job ID</div>
              </td>
              <td class="pl-5">{{ jobId ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Submit Time</div>
              </td>
              <td class="pl-5">{{ submitTime ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Elapsed Time</div>
              </td>
              <td class="pl-5">{{ elapsedTime ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">
        <table>
          <tbody>
            <tr height="40px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Status</div>
              </td>
              <td class="pl-5">{{ forecastJobStatus ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px">
              <td class="text-right font-bold">
                <div style="width: 140px;">Cycle</div>
              </td>
              <td class="pl-5">{{ forecastCycle ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-2">
        <table style="width:100%">
          <tbody>
            <tr height="40px">
              <td class="text-right font-bold" style="width: 140px;">
                <label class="text-right" for="resultsPathname" style="width: 140px;">Results Pathname</label>
              </td>
              <td class="pl-5">
                <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="grid grid-rows-1 ActionButtonsBox" id="HBCbuttons">
      <div class="row-span-1">
        <div class="grid grid-cols-8">
          <span v-if="forecastJobStatus === 'Ready'">
            <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
              <button class="font-normal" title="Run Button" aria-label="Run Button" @click="startForecastRun()">
                Run
              </button>
            </div>
          </span>
          <span v-if="forecastJobStatus === 'Running'">
            <div class="col-span-1 mr-3"><!--c-blue font-normal text-xl underline pt-1-->
              <button class="col-span-1 ngenButtonDiv-red mr h-8" title="Cancel Button" @click="cancelForecastRun()"
                aria-label="Cancel Button">
                Cancel
              </button>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="waitgif" v-if="isLoading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';
import { useToast } from 'primevue/usetoast';

const isLoading = ref<boolean>(false);
const toast = useToast();
const forecastJobStatus = ref<string>();

onMounted(() => {
  toast.removeAllGroups(); // clear all toast messages
  isLoading.value = false; // set isLoading to false

  // scroll to top of the page
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // highlight the tab when selected
  hilightTab(ForecastTabs.tab_statusRun);
});

/**
 * Start the forecast run
 */
const startForecastRun = () => {
  console.log('startForecastRun');
};

/**
 * Cancel the forecast run
 */
const cancelForecastRun = () => {
  console.log('cancelForecastRun');
};

watch(forecastJobStatus, async (oldForecastJobStatus, newForecastJobStatus, onCleanup) => {
  

  onCleanup(() => {
    console.log('cleanup');
  });
});
</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";
</style>