<template>
  <div id="ResultPage">
    <div class="grid grid-rows-7 pr-3">
      <div class="row-span-2">
        <div id="ResultsDisplay">
          <div class="grid grid-cols-2">
            <div class="col-span-1">
              <table>
                <caption style="font-size:1.1em;font-weight:bold;margin-bottom:3px;">Evaluation Run Time & Iteration</caption>
                <thead>
                    <tr height="25px">
                      <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
                    </tr>
                  </thead>
                <tbody>
                  <tr height="38px">
                    <th scope="row" class="text-right font-bold">Submit Time</th>
                    <td class="pl-5">{{ startTime ? formatISOStringOrDateToYYYYMMDDHHMM(startTime) : '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="38px">
                    <th scope="row" class="text-right font-bold">Elapsed Time</th>
                    <td class="pl-5">{{ runningTime ? runningTime : '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="38px">
                    <th scope="row" class="text-right"><label for="iterationNum">Iteration</label></th>
                    <td class="pl-5">
                      {{ evaluateDisplayIterationNumber }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">
              <table>
                <caption style="font-size:1.1em;font-weight:bold;margin-bottom:3px;">Evaluation Status</caption>
                <thead>
                    <tr height="25px">
                      <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
                    </tr>
                </thead>
                <tbody>
                  <tr height="38px">
                    <th scope="row" class="text-right"><label for="RunStatus">Status</label></th>
                    <td class="pl-5">
                      {{ validationStatus }}
                    </td>
                  </tr>
                  <tr height="38px">
                    <th scope="row" class="text-right"><label for="ValidatioinJobId">Validation Job ID</label></th>
                    <td class="pl-5">
                      {{ displayValidationId }}
                    </td>
                  </tr>
                  <tr height="38px">
                    <td class="pl-5" colspan="2">

                      <!--BUTTONS - START-->
                      <span v-if="validationStatus === 'Done'">
                          <Button id="ResultsArea" class="ngenButtonDiv " @click.stop="navigateToEvaluation">Go to Evaluation</button>
                      </span>

                      <span v-else>
                          <Button v-if="!isStartHidden()" class="ngenButtonDiv-green h-8 font-normal" @click="startRun()" title="Run Button" aria-label="Run Button">
                            Run
                          </button>
                          <Button v-if="!isCancelHidden()" @click="cancelRun()" class="ngenButtonDiv-red h-8 hidden font-normal" title="Cancel Button"
                            aria-label="Cancel Button">Cancel
                          </button>
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

    <!--
    <div class="grid grid-rows-1 ActionButtonsBox" id="HBCbuttons">
      <div class="row-span-1">
        <span v-if="validationStatus === 'Done'">
          <div id="ResultsArea" class="ngenButtonDiv row-span-1">
            <Button class="font-normal" @click.stop="navigateToEvaluation">Go to Evaluation</button>
          </div>
          <div class="col-span-7">&nbsp;</div>
        </span>


        <span v-else>
          <div id="StausRunBottomButtons" class="grid grid-cols-6">
          
              <div v-if="!isStartHidden()" class="col-span-1 ngenButtonDiv-green mr-6 h-8">
                <Button class="font-normal" title="Run Button" aria-label="Run Button" @click="startRun()">
                  Run
                </button>
              </div>
            
              <div v-else class="col-span-1 mr-6 h-8">&nbsp;</div>
           
              <div class="col-span-1 ngenButtonDiv-red mr-6 h-8 hidden" v-if="!isCancelHidden()">
                <Button class="font-normal" title="Cancel Button" @click="cancelRun()" 
                  aria-label="Cancel Button">Cancel</button>
              </div>
              <div class="col-span-2">&nbsp;</div>
              <div class="col-span-1 mr-4">
              </div>
          </div>
        </span>
      </div>
    </div>
-->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { useToast } from 'primevue/usetoast';

import type { CalibrationGetStatusValidationItem } from "@/composables/NextGenModel";

import { generalStore } from '@/stores/common/GeneralStore';
import { useEvaluationRunStatusStore } from '@/stores/evaluation/EvaluationRunStatusStore';

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';

const toast = useToast();

const { evaluateValidationRunId, evaluateIterationRunId } = storeToRefs(generalStore());

const { startTime, runningTime, validationStatus, iterationValidationRunId, displayValidationId, validationRunningTimeInterval, evaluateDisplayIterationNumber } = storeToRefs(useEvaluationRunStatusStore());
const { executeIterationValidationRun, queryIterationValidationRunStatus, isValidationRunStopped, executeCancelIterationValidationRun, loadValidationStatusInformation, updateRunningTime } = useEvaluationRunStatusStore();

const validationStatusCheckingInterval = ref<any>();

onMounted(async () => {
  hilightTab(EvaluationTabs.tab_runStatus);

  toast.removeAllGroups();

  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // assume having evaluateValidationRunId but not evaluateIterationRunId means user is intend to view the status of a done/stopped job
  if (evaluateValidationRunId.value > 0 && evaluateIterationRunId.value === 0) {
    loadValidationStatusInformation(evaluateValidationRunId.value);
  } else {
    // this condition assume we have evaluateIterationRunId value which also assume user want to run a new validation
    // this condition is specifically use to handle user click on status/run tab which can not reset certain value until user land on the tab
    evaluateValidationRunId.value = displayValidationId.value = 0;
    runningTime.value = startTime.value = "";
  }
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
  toast.removeAllGroups();

  executeIterationValidationRun().then((response) => {
    if (response.status === 201) {
      validationStatus.value = response?._data?.status;
      iterationValidationRunId.value = displayValidationId.value = response?._data.validation_run_id;
      startTime.value = response?._data?.submit_date;
      validationRunningTimeInterval.value = setInterval(updateRunningTime, 1000);
    } else {
      toast.add({ severity: 'warn', summary: 'Unable to Create Validation' });
    }
  });
}

watch(validationStatus, async (newStatus, initialStatus) => {
  if (newStatus !== null && !isValidationRunStopped(newStatus)) {
    validationStatusCheckingInterval.value = setInterval(async () => {
      queryIterationValidationRunStatus().then(response => {
        const find_validation_run = response._data.validations.filter((validation: CalibrationGetStatusValidationItem) => {
          return validation.validation_run_id === iterationValidationRunId.value
        });
        if (!find_validation_run) {
          validationStatus.value = 'Fail';
        } else {
          // make sure we actually has validation run
          const validation_run = find_validation_run.shift();
          if (!validation_run) {
            validationStatus.value = 'Fail';
          } else {
            validationStatus.value = validation_run.status;
          }
        }
      })
    }, 10000);
  } else {
    // this is for value assignment is only for running job that is now done/stopped
    if (iterationValidationRunId.value > 0) evaluateValidationRunId.value = iterationValidationRunId.value;
    clearInterval(validationStatusCheckingInterval.value);
    clearInterval(validationRunningTimeInterval.value);
  }
});

onUnmounted(() => {
  clearInterval(validationStatusCheckingInterval.value);
  clearInterval(validationRunningTimeInterval.value);
})

const cancelRun = async () => {
  executeCancelIterationValidationRun().then(response => {
    validationStatus.value = response?._data.status;
    clearInterval(validationStatusCheckingInterval.value);
    clearInterval(validationRunningTimeInterval.value);
  })
}

const navigateToEvaluation = (event: any) => {
  if (evaluateValidationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
    e.click();
  } else {
    toast.add({ severity: 'warn', summary: 'Missing Validation Job', detail: 'Pleasea select a validation job first.', life: 6000 })
  }
}
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
