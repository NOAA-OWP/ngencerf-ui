<template>
  <div class="w-full">
    <h1 class="pt-3 mb-8 text-3xl font-bold text-center" aria-label="Verification Run/Status Tab" title="Verification Run/Status Tab">
      Verification Run/Status
    </h1>
    <p class="text-center mt-1" style="font-size: 12px;font-weight: normal;">
      If status is Ready click Run to submit and run the verification.
    </p>
    <br />
  </div>
  <div>

    <div class="grid place-items-center">
      <div class="grid grid-cols-5">
        <div class="col-span-2">
          <table>
            <caption style="text-align: center;font-size:1.1em;font-weight:bold;margin-bottom:3px;"
              aria-label="Verification Job Run Time Area" title="Verification Job Run Time Area">Verification Job Run Time
            </caption>
            <thead>
              <tr height="25px">
                <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
              </tr>
            </thead>
            <tbody>
              <tr height="40px" :aria-label="'Verification Job ID ' + verificationJobId"
                :title="'Verification Job ID ' + verificationJobId">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Verification Job ID</div>
                </th>
                <td class="pl-5">{{ verificationJobId ?? '-'.repeat(15) }}</td>
              </tr>
              <tr height="32px" :aria-label="'Submit Time ' + submitTime" :title="'Submit Time ' + submitTime">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Submit Time</div>
                </th>
                <td class="pl-5">{{ submitTime ?? '-'.repeat(15) }}</td>
              </tr>
              <tr height="32px" :aria-label="'Elapsed Time ' + elapsedTime" :title="'Elapsed Time ' + elapsedTime">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Elapsed Time</div>
                </th>
                <td class="pl-5">{{ elapsedTime ?? '-'.repeat(15) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div data-v-a7d04dc9="" class="col-span-1"><div data-v-a7d04dc9="" class="vertical-separator"></div></div>

        <div class="col-span-2 pl-5">
          <table>
            <caption style="font-size:1.1em;font-weight:bold;margin-bottom:3px;" aria-label="Verification Job Status area"
              title="Verification Job Status area">Verification Job Status</caption>
            <thead>
              <tr height="25px">
                <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
              </tr>
            </thead>
            <tbody>
              <tr height="40px" :aria-label="'Status is ' + verificationJobStatus"
                :title="'Status is ' + verificationJobStatus">
                <th scope="row" class="text-right font-bold">
                  <div style="width: 140px;">Status</div>
                </th>
                <td v-if="verificationJobStatus" class="pl-5">{{ verificationJobStatus }}</td>
                <td v-else class="pl-5">Ready</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-span-5">
          <div style="display:flex; margin-top: 1em;" :aria-label="'Results pathname is ' + resultsPathname"
            :title="'Results pathname is ' + resultsPathname">
            <div class="text-right font-bold" style="width: 155px;">
              <label class="text-right whitespace-nowrap" for="resultsPathname" style="width: 155px;padding-top:1px;">Results Pathname</label>
            </div>
            <div class="pl-5" style="width: 100%;">
              <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
            </div>
          </div>
        </div>

        <div class="col-span-5" v-if="failureMessages">
          <div style="display:flex; margin-top: 1em;"  aria-label="Failure Message" title="Failure Message">
            <div class="text-right font-bold" style="width: 155px;">
              <label class="text-right whitespace-nowrap" for="failureMessage" style="width: 155px;padding-top:1px;">
                Failure Message
              </label>
            </div>
            <div class="pl-5" style="width: 100%;">
              <span v-for="message in failureMessages">
                {{ message }}<br/>
              </span>
            </div>
          </div>
        </div>

        <div class="col-span-2 pl-5">
          <span v-if="!verificationJobStatus || ['Saved','Ready'].includes(verificationJobStatus)">
            <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Previous Button" aria-label="Previous Button"
                @click="goPreviousTab()">
                Previous
            </Button>
          </span>
        </div>

        <div class="col-span-1"></div>

        <div class="col-span-2 pl-5">
          <span v-if="verificationJobStatus === 'Ready'">
            <Button class=" ngenButtonDiv-green font-normal" title="Run Button" aria-label="Run Button"
              @click="startVerificationJob()">
              Run
            </Button>
          </span>
          <span v-if="verificationJobStatus === 'Running'">
            <Button class="col-span-1 ngenButtonDiv-red" title="Cancel Button" @click="stopVerificationJob()"
              aria-label="Cancel Button">
              Cancel
            </Button>
          </span>
          <span v-if="verificationJobStatus === 'Done'">
            <Button class="ngenButtonDiv ml-6 font-normal px-4 whitespace-nowrap" title="View Results Button"
              @click="goNextTab()" aria-label="View Results Button">
              View Results
            </Button>
          </span>
        </div>

      </div>
    </div>

    <div class="waitgif" v-if="isVerificationLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { storeToRefs } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
const { addToastRecord } = generalStore();

const toast = useToast();

import { useVerificationStore } from "@/stores/verification/VerificationStore";
const verificationStore = useVerificationStore();

const { 
  verificationJobId, 
  userVerificationJobData, 
  submitTimeDate,
  submitTime,
  elapsedTime,
  verificationStatusCheckingInterval,
  verificationRunningTimeInterval,
  verificationJobStatus,
  failureMessages,
  resultsPathname,
  isVerificationLoading 
} = storeToRefs(verificationStore);
const { 
  loadVerificationRunStatusTabData,
  loadVerificationStatusInformation,
  updateRunningTime,
  runVerificationJob,
  cancelVerificationJob
} = useVerificationStore();

import { hilightTab } from '@/composables/TabHilight';
onMounted(() => {
  hilightTab(VerificationTabs.tab_runStatus);

  clearInterval(verificationStatusCheckingInterval.value);
  clearInterval(verificationRunningTimeInterval.value);
  verificationStatusCheckingInterval.value = undefined;
  verificationRunningTimeInterval.value = undefined;

  loadVerificationStatusInformation();

  loadVerificationRunStatusTabData();
})

/**
 * Start the verification job
 */
const startVerificationJob = async () => {
  runVerificationJob(verificationJobId.value as number).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      verificationJobStatus.value = response._data.status;
      failureMessages.value = response._data.failure_messages;

      if (response?._data?.submit_date) {
        submitTimeDate.value = new Date(response?._data?.submit_date);

        if (isValidDate(submitTimeDate.value)) {
          submitTime.value = formatDateForRunOnString(submitTimeDate.value);
        }
        verificationStatusCheckingInterval.value = setInterval(loadVerificationStatusInformation, 10000);
        verificationRunningTimeInterval.value = setInterval(updateRunningTime, 1000);
      } else {
        loadVerificationStatusInformation();
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: `Could not find Verification job ${verificationJobId.value} in server response`, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  })
};

/**
 * Stop (Cancel) the verification job
 */
const stopVerificationJob = async () => {
  try {
    const cancelVerificationJobResponse = await cancelVerificationJob();

    if (cancelVerificationJobResponse?._data?.status) {
      verificationJobStatus.value = cancelVerificationJobResponse._data.status;
      failureMessages.value = cancelVerificationJobResponse._data.failure_messages;

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
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error cancelling Verification job', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

const goPreviousTab = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[VerificationTabs.tab_setupVerification];
  e.click();
}

const goNextTab = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[VerificationTabs.tab_results];
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

#resultsPathname {
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
}
</style>