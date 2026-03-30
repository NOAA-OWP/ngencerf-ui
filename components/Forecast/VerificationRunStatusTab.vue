<template>
  <div id="ForecastRunStatusPage">
    <div class="pl-6 pr-2 pt-2">
      <div class="flex mt-3">
        <div class="w-5/6 relative">
          <div v-if="logListOptions.length > 1" class="inline-block">
            <label for="DisplayOptions" class="pr-2 pt-3">Display </label>
            <div class="inline-block w-2/3">
              <Select id="DisplayOptions" class="p-select" style="width: auto; min-width: 254px;"
                v-model="selectedLogCategory" :options="logListOptions" option-label="display_name" optionValue="name">
              </Select>
            </div>
          </div>
          <div v-else-if="!verificationJobId" class="w-full">
            <p class="text-center mt-1" style="font-size: 12px;font-weight: normal;">
              Click Run to submit and run the verification.
            </p>
          </div>
          
          <div class="grid auto-cols-max grid-cols-3 gap=1 text-sm text-left mt-2">
            <div class="col-span-1">
              <div>
                <span class="font-medium">Forecast Job ID: </span>
                {{ forecastJobId ?? '-'.repeat(15) }}
              </div>
              <div>
                <span class="font-medium">Verification Job ID: </span>
                {{ verificationJobId ?? '-'.repeat(15) }}
              </div>
            </div>
            <div class="col-span-1">
              <div>
                <span class="font-medium">Configuration: </span>
                {{ selectedVerificationJob?.forecast_run?.configuration ?? (selectedForecastJob?.configuration ?? 'Unknown') }}
              </div>
              <div>
                <span class="font-medium">Cycle Date: </span>
                {{ (selectedVerificationJob?.forecast_run?.cycle_date ? formatISOStringOrDateToYYYYMMDDHHMM(selectedVerificationJob.forecast_run.cycle_date) + ' UTC' : (selectedForecastJob?.cycle_date ? formatISOStringOrDateToYYYYMMDDHHMM(selectedForecastJob.cycle_date) + ' UTC' : 'None')) }}
              </div>
            </div>
            <div class="col-span-1">
              <div>
                <span class="font-medium">Status: </span>
                {{ verificationJobStatus ?? 'Ready' }}
              </div>
              <div>
                <span class="font-medium">Submit Time: </span>
                {{ submitTime ?? '-'.repeat(15) }}
              </div>
              <div>
                <span class="font-medium">Elapsed Time: </span>
                {{ elapsedTime ?? '-'.repeat(15) }}
              </div>
              <div class="mt-2 mb-2">
                <!--BUTTONS - START-->
                <span v-if="forecastJobId && !verificationJobId && !verificationJobStatus">
                  <Button class=" ngenButtonDiv-green font-normal" title="Run Button" aria-label="Run Button"
                    @click="startVerificationJob()" :disabled="runButtonDisabled">
                    Run
                  </Button>
                </span>
                <span v-if="['Submitted','Running'].includes(verificationJobStatus)">
                  <Button class="col-span-1 ngenButtonDiv-red" title="Cancel Button" aria-label="Cancel Button"
                    @click="stopVerificationJob()" :disabled="cancelButtonDisabled">
                    Cancel
                  </Button>
                </span>
                <span v-if="verificationJobStatus === 'Done'">
                  <Button class="ngenButtonDiv ml-6 font-normal px-4 whitespace-nowrap" title="View Results Button"
                    @click="goNextTab()" aria-label="View Results Button">
                    View Results
                  </Button>
                </span>
                <!--BUTTONS - END-->
              </div>
            </div>
          </div>
          
          <div v-if="failureMessages && failureMessages.length > 0">
            <span class="font-bold">{{ failureMessages.length > 1 ? 'Messages' : 'Message' }}: </span>
            <span v-for="failure_message in failureMessages">
              {{ failure_message.message }}<br/>
            </span>
          </div>
        </div>

      </div>
    </div>

    <!-- DISPLAY LOGS -->
    <div v-show="logListOptions.length > 0">
      <LogDisplay/>
    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import LogDisplay from "../Common/LogDisplay.vue";

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";
import { hilightTab } from '@/composables/TabHilight';
import { storeToRefs } from "pinia";

import { useForecastStore } from "~/stores/forecast/ForecastStore";
import { useVerificationStore } from "~/stores/forecast/VerificationStore";
import { generalStore } from "@/stores/common/GeneralStore";
import { useLogStore } from '@/stores/common/LogStore';

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();

const runButtonDisabled = ref<boolean>(false);
const cancelButtonDisabled = ref<boolean>(false);

const forecastStore = useForecastStore();
const verificationStore = useVerificationStore();

const {
  selectedForecastJob,
  forecastJobId,
  submitTimeDate,
  submitTime,
  elapsedTime,
  failureMessages
} = storeToRefs(forecastStore);

const { 
  selectedVerificationJob,
  verificationJobId, 
  verificationStatusCheckingInterval,
  verificationRunningTimeInterval,
  verificationJobStatus
} = storeToRefs(verificationStore);
const { 
  loadVerificationRunStatusTabData,
  loadVerificationStatusInformation,
  updateRunningTime,
  createAndRunVerificationJob,
  cancelVerificationJob
} = useVerificationStore();

const {
  selectedLogCategory,
  logListOptions
} = storeToRefs(useLogStore());
const {
  populateLogListOptions,
  resetUserLogRefs
} = useLogStore();

onMounted(async() => {
  hilightTab(ForecastTabs.tab_verificationRunStatus);

  clearInterval(verificationStatusCheckingInterval.value);
  clearInterval(verificationRunningTimeInterval.value);
  verificationStatusCheckingInterval.value = undefined;
  verificationRunningTimeInterval.value = undefined;
  verificationJobStatus.value = undefined;
  failureMessages.value = undefined;
  submitTime.value = undefined;
  elapsedTime.value = undefined;

  if (verificationJobId.value) {
    await loadVerificationStatusInformation();
    await loadVerificationRunStatusTabData();
    if (verificationJobStatus.value && !['Ready','Submitted'].includes(verificationJobStatus.value)) {
      await populateLogListOptions();
    }
  }

  runButtonDisabled.value = verificationJobStatus.value && !['Unknown','Ready'].includes(verificationJobStatus.value);
  cancelButtonDisabled.value = ['Submitted','Running'].includes(verificationJobStatus.value);

  watch(verificationJobStatus, async (newVerificationJobStatus, oldVerificationJobStatus) => {
    if (verificationJobId.value && 
      ( 
        newVerificationJobStatus === 'Running' || 
        (oldVerificationJobStatus && oldVerificationJobStatus !== "Unknown" && 
        newVerificationJobStatus && newVerificationJobStatus !== "Unknown")
      )
    ) {
      populateLogListOptions();
    }
  });
})

/**
 * Start the verification job
 */
const startVerificationJob = async () => {
  runButtonDisabled.value = true;
  cancelButtonDisabled.value = false;
  verificationJobStatus.value = 'Submitted';
  createAndRunVerificationJob().then((response) => {
    if (response.status >= 200 && response.status < 300) {
      verificationJobId.value = response._data.verification_run_id;
      verificationJobStatus.value = response._data.status;
      failureMessages.value = response._data.failure_messages ?? undefined;

      if (response?._data?.submit_date) {
        submitTimeDate.value = new Date(response?._data?.submit_date);
        if (isValidDate(submitTimeDate.value)) {
          submitTime.value = formatDateForRunOnString(submitTimeDate.value);
        }
        if (verificationStatusCheckingInterval.value) {
          clearInterval(verificationStatusCheckingInterval.value);
        }
        if (verificationRunningTimeInterval.value) {
          clearInterval(verificationRunningTimeInterval.value);
        }
        // Wait a second to populate log list for the first time
        setTimeout(populateLogListOptions, 2000);
        verificationStatusCheckingInterval.value = setInterval(loadVerificationStatusInformation, 5000);
        verificationRunningTimeInterval.value = setInterval(updateRunningTime, 1000);
      } else {
        loadVerificationStatusInformation();
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      runButtonDisabled.value = false;
      cancelButtonDisabled.value = true;
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: `Could not find Verification job ${verificationJobId.value} in server response`, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  })
};

/**
 * Stop (Cancel) the verification job
 */
const stopVerificationJob = async () => {
  cancelButtonDisabled.value = true;
  try {
    cancelButtonDisabled.value = true;
    const cancelVerificationJobResponse = await cancelVerificationJob();

    if (cancelVerificationJobResponse?._data?.status) {
      verificationJobStatus.value = cancelVerificationJobResponse._data.status;
      failureMessages.value = cancelVerificationJobResponse._data.failure_messages ?? undefined;

      if (verificationJobStatus.value !== 'Cancelled') {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Verification status not set to Cancelled after clicking CANCEL', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      await loadVerificationRunStatusTabData();
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Could not get Verification status from server', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } catch (error) {
    cancelButtonDisabled.value = false;
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error cancelling Verification job', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

const goNextTab = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[ForecastTabs.tab_verificationResults];
  e.click();
}

onUnmounted(() => {
  clearInterval(verificationStatusCheckingInterval.value);
  clearInterval(verificationRunningTimeInterval.value);
  verificationStatusCheckingInterval.value = undefined;
  verificationRunningTimeInterval.value = undefined;
  verificationJobStatus.value = undefined;
  failureMessages.value = undefined;
  submitTime.value = undefined;
  elapsedTime.value = undefined;
  logListOptions.value = [];
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

.gray-border {
  border: 2px solid #d9d9d9;
}
</style>