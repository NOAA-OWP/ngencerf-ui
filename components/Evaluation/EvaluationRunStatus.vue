<template>
  <div id="ResultPage">
    <div class="grid grid-rows-3 pr-3">
      <div class="row-span-2">
        <div id="ResultsDisplay">
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
                          title="Run Button" aria-label="Run Button">
                          Run
                        </Button>
                        <Button v-if="!isCancelHidden()" @click="cancelRun()"
                          class="ngenButtonDiv-red h-8 hidden font-normal" title="Cancel Button"
                          aria-label="Cancel Button">Cancel
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
    <div id="LogDisplayArea" class="p-2"
      v-if="selectedLogCategory !== '' && selectedLogFilePath !== ''">
      <div class="pl-4">
        <table width="100%" summary="Validation Log and File Path">
          <caption class="sr-only">Validation Log and File Path table</caption>
          <thead class="sr-only">
            <tr>
              <th scope="col" style="min-width: 185px;">Validation Log Label</th>
              <th scope="col">Validation Log Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style="font-size: 0.9em;">
              <td class="pr-2 pt-3"><b>Log Name</b></td>
              <td class="pt-3">Validation</td>
            </tr>
            <tr v-if="selectedLogFilePath !== ''" style="font-size: 0.9em;">
              <td class="pr-2 pt-3"><b>Log File Path</b></td>
              <td class="pt-3">{{ selectedLogFilePath }}</td>
            </tr>
          </tbody>
        </table>

        <div class="pt-4">
          <div class="pagination-box" v-if="selectedLogDisplay">
            <div class="pagination-rows">Rows {{ selectedLogStartRow }} to {{ selectedLogEndRow }} of {{
              selectedLogTotalSize }}</div>
            <Paging v-model:currentPage="selectedLogCurrentPage" :totalPages=selectedLogTotalPages />
          </div>
          <div v-else>
            Log file unavailable
          </div>
        </div>

        <div id="selectedLogDisplay" v-if="selectedLogDisplay" class="p-2 gray-border overflow-scroll">
          <div v-html="selectedLogDisplay" class="whitespace-nowrap"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { useToast } from 'primevue/usetoast';

import type { CalibrationGetStatusValidationItem } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";
import Paging from "../Common/Paging.vue";

import { generalStore } from '@/stores/common/GeneralStore';
import { useEvaluationRunStatusStore } from '@/stores/evaluation/EvaluationRunStatusStore';
import { useEvaluationSupplementalDataStore } from "@/stores/evaluation/EvaluationSupplementalDataStore";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';

const toast = useToast();

const { evaluateValidationRunId, evaluateIterationRunId } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const { startTime, runningTime, validationStatus, iterationValidationRunId, displayValidationId, validationRunningTimeIntervalId, validationStatusCheckingIntervalId, evaluateDisplayIterationNumber, runStatusTabVisible } = storeToRefs(useEvaluationRunStatusStore());
const { executeIterationValidationRun, queryIterationValidationRunStatus, isValidationRunStopped, executeCancelIterationValidationRun, loadValidationStatusInformation, updateRunningTime, hardResetRunStatusStore } = useEvaluationRunStatusStore();
const { queryGetLogData } = useEvaluationSupplementalDataStore();

const logDataPageSize = ref<number>(1000);
const selectedLogCategory = ref<string>('validation');
const selectedLogName = ref<string>('ngen-cal stdout');
const selectedLogDisplay = ref<string>('');
const selectedLogTotalSize = ref<number>(0);
const selectedLogCurrentPage = ref<number>(1);
const selectedLogTotalPages = ref<number>(1);
const selectedLogStartRow = ref<number>(1);
const selectedLogEndRow = ref<number>(logDataPageSize.value);
const selectedLogFilePath = ref<string>('');
const autoScrollLog = ref<boolean>(false);

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
    loadValidationStatusInformation(evaluateValidationRunId.value);
    if (iterationValidationRunId.value > 0 && validationStatus.value !== '') {
      updateLogDisplay();
    } else {
    }
  } else {
    // this condition assume we have evaluateIterationRunId value which also assume user want to run a new validation
    // this condition is specifically use to handle user click on Run/Status tab which can not reset certain value until user land on the tab
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
      validationRunningTimeIntervalId.value = setInterval(async () => {
        updateRunningTime()
      }, 1000) as unknown as number;
    } else {
      const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to Create Validation', life: ToastTimeout.timeoutWarn };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  });
}

const updateLogDisplay = () => {
  if (iterationValidationRunId.value > 0) {
    if (selectedLogDisplay.value === '') {
      // only scroll to the bottom of the log if it's being displayed for the first time
      autoScrollLog.value = true;
    }
    queryGetLogData(
      selectedLogCategory.value, // log_category
      selectedLogName.value, // log_name
      iterationValidationRunId.value, // validation_run_id
      selectedLogStartRow.value - 1, // start
      logDataPageSize.value // limit
    ).then(response => {
      if (response?._data?.log_data) {
        let logText = '';
        for (let t = 0; t < response?._data.log_data.length; t++) {
          logText += response?._data.log_data[t] + '<br/>\n';
        }
        selectedLogDisplay.value = logText;
        selectedLogTotalSize.value = response?._data.pagination_metadata?.count;
        selectedLogTotalPages.value = 1;
        selectedLogEndRow.value = response?._data.pagination_metadata?.count;
        if (logDataPageSize.value < selectedLogTotalSize.value) {
          selectedLogStartRow.value = (selectedLogTotalSize.value - logDataPageSize.value) + 1;
        } else {
          selectedLogStartRow.value = 1;
        }
        selectedLogFilePath.value = response?._data.log_path;
        if (document.getElementById('selectedLogDisplay')) {
          nextTick(async () => {
            document.getElementById('selectedLogDisplay').style.height = (((document.getElementById('MainLeftDataParent') as HTMLElement).getBoundingClientRect().bottom
            - (document.getElementById('selectedLogDisplay') as HTMLElement).getBoundingClientRect().top) + 'px');
            if (autoScrollLog.value) {
              document.getElementById('selectedLogDisplay').scrollTop = document.getElementById('selectedLogDisplay').scrollHeight;
              autoScrollLog.value = false;
            }
          });
        }
      } else {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Log file unavailable', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    })
  }
}

watch(validationStatus, async (newStatus, initialStatus) => {
  if (newStatus !== null && !isValidationRunStopped(newStatus)) {
    validationStatusCheckingIntervalId.value = setInterval(async () => {
      queryIterationValidationRunStatus().then(response => {
        let find_validation_run = undefined;
        if (response._data.validations) {
          find_validation_run = response._data.validations.filter((validation: CalibrationGetStatusValidationItem) => {
            return validation.validation_run_id === iterationValidationRunId.value
          });
        }
        if (!find_validation_run) {
          validationStatus.value = 'Failed';
          clearInterval(validationStatusCheckingIntervalId.value);
          clearInterval(validationRunningTimeIntervalId.value);
          validationStatusCheckingIntervalId.value = undefined;
          validationRunningTimeIntervalId.value = undefined;
        } else {
          // make sure we actually have validation run
          const validation_run = find_validation_run.shift();
          if (!validation_run) {
            validationStatus.value = 'Failed';
            clearInterval(validationStatusCheckingIntervalId.value);
            clearInterval(validationRunningTimeIntervalId.value);
            validationStatusCheckingIntervalId.value = undefined;
            validationRunningTimeIntervalId.value = undefined;
          } else {
            validationStatus.value = validation_run.status;
          }
        }
      })
      updateLogDisplay();
    }, 10000);
  } else {
    // this is for value assignment is only for running job that is now done/stopped
    if (iterationValidationRunId.value > 0) evaluateValidationRunId.value = iterationValidationRunId.value;
    clearInterval(validationStatusCheckingIntervalId.value);
    clearInterval(validationRunningTimeIntervalId.value);
    validationStatusCheckingIntervalId.value = undefined;
    validationRunningTimeIntervalId.value = undefined;
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
    updateLogDisplay();
  }
});

const cancelRun = async () => {
  executeCancelIterationValidationRun().then(response => {
    validationStatus.value = response?._data.status;
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
