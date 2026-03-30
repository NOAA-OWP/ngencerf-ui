<template>
  <div id="ResultPage">
    <div class="grid grid-rows-3 pr-3">
      <div class="row-span-2">
        <div id="ResultsDisplay">
          <div v-if="!iterationValidationRunId || !validationStatus" class="w-full">
            <p class="text-center mt-1" style="font-size: 12px;font-weight: normal;">
              Click Run to submit and run the validation.
            </p>
          </div>
          <div class="grid grid-cols-5">
            <div class="col-span-2">
              <table aria-describedby="Validation Run Time & Iteration">
                <thead>
                  <tr height="35px">
                    <th scope="row" class="text-center border-b-[3px]" colspan="2" style="border-color: #d9d9d9;">Validation Run Time & Iteration</th>
                  </tr>
                  <tr height="35px">
                    <th scope="row" class="text-center border-t-[3px]" colspan="2" style="border-color: #d9d9d9;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr height="38px" :aria-label="'Submit Time ' + formatISOStringOrDateToYYYYMMDDHHMM(startTime)"
                    :title="'Submit Time ' + formatISOStringOrDateToYYYYMMDDHHMM(startTime)">
                    <th scope="row" class="text-right font-bold">Submit Time</th>
                    <td class="pl-5">{{ startTime ? formatISOStringOrDateToYYYYMMDDHHMM(startTime) : '-'.repeat(15) }}</td>
                  </tr>
                  <tr height="38px" :aria-label="'Elapsed Time ' + runningTime" :title="'Elapsed Time ' + runningTime">
                    <th scope="row" class="text-right font-bold">Elapsed Time</th>
                    <td class="pl-5">{{ runningTime ? runningTime : '-'.repeat(15) }}</td>
                  </tr>
                  <tr height="38px" :aria-label="'Iteration ' + evaluateDisplayIterationNumber"
                    :title="'Iteration ' + evaluateDisplayIterationNumber">
                    <th scope="row" class="text-right"><label for="iterationNum">Iteration</label></th>
                    <td class="pl-5">
                      {{ evaluateDisplayIterationNumber }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-span-1">
                <div class="vertical-separator"></div>
            </div>

            <div class="col-span-2">
              <table aria-describedby="Validation Run Status">
                <thead>
                  <tr height="35px">
                    <th scope="row" class="text-center border-b-[3px]" colspan="2" style="border-color: #d9d9d9;">Validation Run Status</th>
                  </tr>
                  <tr height="35px">
                    <th scope="row" class="text-center border-t-[3px]" colspan="2" style="border-color: #d9d9d9;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr height="38px" :aria-label="'Status ' + validationStatus" :title="'Status ' + validationStatus">
                    <th scope="row" class="text-right"><label for="RunStatus">Status</label></th>
                    <td class="pl-5">
                      {{ validationStatus }}
                    </td>
                  </tr>
                  <tr height="38px" :aria-label="'Validation Job ID ' + displayValidationId"
                    :title="'Validation Job ID ' + displayValidationId">
                    <th scope="row" class="text-right"><label for="ValidatioinJobId">Validation Job ID</label></th>
                    <td class="pl-5">
                      {{ displayValidationId }}
                    </td>
                  </tr>
                  <tr height="38px">
                    <td class="pl-5 text-right pr-4" colspan="2">

                      <!--BUTTONS - START-->
                      <span v-if="validationStatus === 'Done' || validationStatus === 'Failed'">
                        <Button id="ResultsArea" class="ngenButtonDiv" @click.stop="navigateToEvaluation"
                          aria-label="Go to Evaluation Button" title="Go to Evaluation Button">Evaluate</Button>
                      </span>

                      <span v-else>
                        <Button v-if="!isStartHidden()" class="ngenButtonDiv-green h-8 font-normal" @click="startRun()"
                          title="Run Button" :disabled="runButtonDisabled" aria-label="Run Button">
                          Run
                        </Button>
                        <Button v-if="!isCancelHidden()" @click="cancelRun()"
                          class="ngenButtonDiv-red h-8 hidden font-normal" title="Cancel Button" aria-label="Cancel Button"
                          :disabled="cancelButtonDisabled">
                          Cancel
                        </Button>
                      </span>
                      <!--BUTTONS - END-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div v-if="failureMessages && failureMessages.length > 0">
      <div style="display:flex; margin-top: 1em;"  aria-label="Messages" title="Messages">
        <div class="text-right font-bold" style="width: 155px;">
          <label class="text-right whitespace-nowrap" for="failureMessage" style="width: 155px;padding-top:1px;">
            {{ failureMessages.length > 1 ? 'Messages' : 'Message' }}
          </label>
        </div>
        <div class="pl-5" style="width: 100%;">
          <span v-for="failure_message in failureMessages">
            {{ failure_message.message }}<br/>
          </span>
        </div>
      </div>
    </div>

    <!-- DISPLAY LOGS -->
    <div v-if="iterationValidationRunId && validationStatus" class="pl-6 pt-4">
      <label for="DisplayOptions" class="pr-2 pt-3">Display </label>
      <div class="inline-block w-2/3">
        <Select id="DisplayOptions" class="p-select" style="width: auto; min-width: 254px;"
          v-model="selectedLogCategory" :options="logListOptions" option-label="display_name" optionValue="name">
        </Select>
      </div>
    </div>
    <div v-show="logListOptions.length > 0">
      <LogDisplay/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { useToast } from 'primevue/usetoast';

import type { CalibrationGetStatusValidationItem } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";
import LogDisplay from "../Common/LogDisplay.vue";
import Paging from "../Common/Paging.vue";

import { generalStore } from '@/stores/common/GeneralStore';
import { useEvaluationRunStatusStore } from '@/stores/evaluation/EvaluationRunStatusStore';
import { useEvaluationSupplementalDataStore } from "@/stores/evaluation/EvaluationSupplementalDataStore";
import { useLogStore } from '@/stores/common/LogStore';

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';

const toast = useToast();

const runButtonDisabled = ref<boolean>(false);
const cancelButtonDisabled = ref<boolean>(false);

const { evaluateValidationRunId, evaluateIterationRunId } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const { startTime, runningTime, validationStatus, iterationValidationRunId, displayValidationId, validationRunningTimeIntervalId, validationStatusCheckingIntervalId, evaluateDisplayIterationNumber, runStatusTabVisible, failureMessages } = storeToRefs(useEvaluationRunStatusStore());
const { executeIterationValidationRun, queryIterationValidationRunStatus, isValidationRunStopped, executeCancelIterationValidationRun, loadValidationStatusInformation, updateRunningTime, hardResetEvaluationRunStatusStore } = useEvaluationRunStatusStore();

const {
  selectedLogCategory,
  logListOptions
} = storeToRefs(useLogStore());
const {
  populateLogListOptions,
  resetUserLogRefs
} = useLogStore();

onMounted(async () => {
  hilightTab(EvaluationTabs.tab_runStatus);

  runStatusTabVisible.value = true;

  toast.removeAllGroups();

  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  clearInterval(validationStatusCheckingIntervalId.value);
  clearInterval(validationRunningTimeIntervalId.value);
  validationStatusCheckingIntervalId.value = undefined;
  validationRunningTimeIntervalId.value = undefined;

  // assume having evaluateValidationRunId but not evaluateIterationRunId means user is intend to view the status of a done/stopped job
  if (evaluateValidationRunId.value > 0 && evaluateIterationRunId.value === 0) {
    iterationValidationRunId.value = evaluateValidationRunId.value;
    await loadValidationStatusInformation(evaluateValidationRunId.value);
    if (iterationValidationRunId.value > 0) {
      populateLogListOptions();
    }
  } else {
    // this condition assume we have evaluateIterationRunId value which also assume user want to run a new validation
    // this condition is specifically use to handle user click on Run/Status tab which can not reset certain value until user land on the tab
    evaluateValidationRunId.value = displayValidationId.value = 0;
    runningTime.value = startTime.value = "";
  }
  
  runButtonDisabled.value = isStartHidden();
  cancelButtonDisabled.value = isCancelHidden();
});

const isStartHidden = (): boolean => {
  let hidden = false;
  if (validationStatus.value !== "") {
    hidden = true;
  }
  return hidden;
}

const isCancelHidden = (): boolean => {
  let hidden = false;
  if (validationStatus.value === "" || (validationStatus.value !== "" && isValidationRunStopped(validationStatus.value))) {
    hidden = true;
  }
  return hidden;
}

const startRun = async () => {
  runButtonDisabled.value = true;
  cancelButtonDisabled.value = false;
  toast.removeAllGroups();

  executeIterationValidationRun().then((response) => {
    if (response.status === 201) {
      validationStatus.value = response?._data?.status;
      failureMessages.value = response?._data?.failure_messages ?? undefined;
      iterationValidationRunId.value = displayValidationId.value = response?._data.validation_run_id;
      startTime.value = response?._data?.submit_date;
      populateLogListOptions();
      if (validationRunningTimeIntervalId.value) {
        clearInterval(validationRunningTimeIntervalId.value);
      }
      validationRunningTimeIntervalId.value = setInterval(async () => {
        updateRunningTime()
      }, 1000) as unknown as number;
    } else {
      runButtonDisabled.value = false;
      cancelButtonDisabled.value = true;
      const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to Create Validation', life: ToastTimeout.timeoutWarn };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  });
}

watch(validationStatus, async (newStatus, initialStatus) => {
  if (newStatus !== null && !isValidationRunStopped(newStatus)) {
    if (validationStatusCheckingIntervalId.value) {
      clearInterval(validationStatusCheckingIntervalId.value);
    }
    validationStatusCheckingIntervalId.value = setInterval(async () => {
      queryIterationValidationRunStatus().then(response => {
        if (response?._data?.status) {
          validationStatus.value = response._data.status;
        } else {
          validationStatus.value = 'Failed';
          clearInterval(validationStatusCheckingIntervalId.value);
          clearInterval(validationRunningTimeIntervalId.value);
          validationStatusCheckingIntervalId.value = undefined;
          validationRunningTimeIntervalId.value = undefined;
        }
      })
      populateLogListOptions();
    }, 10000) as unknown as number;
  } else {
    // this is for value assignment is only for running job that is now done/stopped
    if (iterationValidationRunId.value > 0) evaluateValidationRunId.value = iterationValidationRunId.value;
    clearInterval(validationStatusCheckingIntervalId.value);
    clearInterval(validationRunningTimeIntervalId.value);
    validationStatusCheckingIntervalId.value = undefined;
    validationRunningTimeIntervalId.value = undefined;
  }
});

const cancelRun = async () => {
  cancelButtonDisabled.value = true;
  executeCancelIterationValidationRun().then(response => {
    validationStatus.value = response?._data.status;
    failureMessages.value = response?._data?.failure_messages ?? undefined;
    clearInterval(validationStatusCheckingIntervalId.value);
    clearInterval(validationRunningTimeIntervalId.value);
    validationStatusCheckingIntervalId.value = undefined;
    validationRunningTimeIntervalId.value = undefined;
  })
}

const navigateToEvaluation = (event: any) => {
  if (evaluateValidationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Validation Job', detail: 'Please select a validation job first.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

onUnmounted(() => {
  runStatusTabVisible.value = false;
  failureMessages.value = undefined;
  logListOptions.value = [];
  resetUserLogRefs();
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#ResultsDisplay {
  width: 50vw;
  margin: 20px auto;
  padding: 10px 10px 10px 20px;
  border-radius: 10px;
  height: 100px;
  border: 0px solid global.$ngwcp_neutral_gray_md;
  min-width: 750px;
}
#ResultsDisplay table {
  width: 100%;
}

#GraphArea {
  height: 40vh;
  width: 100%;
  margin: 8px auto 0 auto;
  border: 1px solid global.$ngwcp_neutral_gray_md;
}

#RunStatus,
#ValidatioinJobId {
  width: 250px;
  margin-left: 0px;
}

.p-progressbar {
  display: inline-block;
  width: 200px;
  height: 25px;
}

.leftSideText {
  width: 135px;
  text-align: right;
  padding-right: 20px;
}

.gray-border {
  border: 2px solid #d9d9d9;
}
</style>

<style>
:root {
  .p-progressbar {
    background-color: yellow;
    vertical-align: text-bottom;
    margin-left: 10px;
    width: 80%;
  }

  .p-progressbar-value {
    color: green;
    background-color: green;
  }

  .p-progressbar-label {
    color: white;
  }
}
</style>
