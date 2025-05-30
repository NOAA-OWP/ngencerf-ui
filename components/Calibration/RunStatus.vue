<template>
  <div id="ResultPage">
    <div class="pr-3">
      <div>
        <div id="ResultsDisplay">

          <div class="grid grid-cols-2">
            <div class="col-span-1">
              <table>
                <tbody>
                  <tr height="38px" :aria-label="'Submit Time ' + submitTime" :title="'Submit Time ' + submitTime">
                    <th scope="row" class="text-right font-bold">
                      <div style="width: 140px;">Submit Time</div>
                    </th>
                    <td class="pl-5">{{ submitTime ? submitTime : '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="32px" :aria-label="'Elapsed Time ' + calibrationElapsedTime"
                    :title="'Elapsed Time ' + calibrationElapsedTime">
                    <th scope="row" class="text-right font-bold">
                      <div style="width: 140px;">Elapsed Time</div>
                    </th>
                    <td class="pl-5">{{ calibrationElapsedTime ? calibrationElapsedTime : '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="32px" :aria-label="validationBestAchieved.isBest ? 'Best Iteration ' + validationBestAchieved.iteration :
                    'Interation ' + iteration" :title="validationBestAchieved.isBest ? 'Best Iteration ' + validationBestAchieved.iteration :
                      'Interation ' + iteration">
                    <th scope="row" class="text-right font-bold">
                      <div style="width: 140px;">{{ validationBestAchieved.isBest ? 'Best ' : '' }} Iteration</div>
                    </th>
                    <td v-if="validationBestAchieved.isBest" class="pl-5">{{ validationBestAchieved.iteration }}</td>
                    <td v-else class="pl-5">{{ iteration ?? '-'.repeat(30) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-span-1 pl-5 border-l border-[#d9d9d9]">
              <table>
                <tbody>
                  <tr height="38px" :aria-label="'Status ' + overallCalibrationValidationStatus"
                    :title="'Status ' + overallCalibrationValidationStatus">
                    <th scope="row" class="text-right"><label for="RunStatus">Status</label></th>
                    <td class="pl-5">
                      <span id="RunStatus" class="dummyProgress ml-2 whitespace-nowrap text-md"
                        style="background-color: white;">
                        {{ overallCalibrationValidationStatus }}
                      </span>
                    </td>
                  </tr>
                  <tr height="32px" aria-label="Select Plot Name" title="Select Plot Name">
                    <th scope="row" class="text-right"><label for="DisplayOptions">{{ iteration && iteration >= 1 ?
                      'Display' : '' }}</label></th>
                    <td class="pl-5" v-show='iteration && iteration >= 1'>
                      <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName" :options="plotList"
                        optionLabel="name" optionValue="name">
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">

                      <!--BUTTONS - START-->
                      <div v-if="overallCalibrationValidationStatus === 'Done'"
                        style="margin-top:4px;margin-bottom:-4px;">
                        <Button class="ngenButtonDiv font-normal" @click="gotoEvaluation" aria-label="Go to
                          Evaluation" title="Go to Evaluation">Go to Evaluation</Button>
                      </div>

                      <div v-if="calibrationStatus !== 'Done'" style="margin-top:4px; margin-bottom:-4px;">
                        <span v-if="calibrationStatus === 'Ready'">
                          <Button class="font-normal ngenButtonDiv-green h-8" title="Run Button" aria-label="Run Button"
                            @click="startRun()">Run</Button>
                        </span>
                        <span v-if="calibrationStatus === 'Running'">
                          <Button class="ngenButtonDiv-red h-8 mr-3" title="Cancel Button" @click="cancelRun()"
                            aria-label="Cancel Button">Cancel</Button>
                        </span>
                      </div>
                      <!--BUTTONS - END-->

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div>
        <!--LOGGING SECTION-->
        <div v-if="calibrationStatus === 'Saved' || calibrationStatus === 'Ready'" id="LoggingSection"
          class="p-2 border-t border-[#d9d9d9] flex flex-col items-center">
          <div class="mb-4">
            <div class="inline-flex flex-col items-center">
              <p class="font-semibold mb-2">Global Logging</p>
              <div class="flex gap-6">
                <label v-for="[label, val] in [['Enabled', true], ['Disabled', false]]" :key="label as string"
                  class="flex items-center gap-1">
                  <input type="radio" :value="val" v-model="calibrationJobNgenGlobalLogging" />
                  <span>{{ label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <p class="font-semibold mb-2 text-center">Ngen and Module Log Levels</p>
            <div :class="[
              'overflow-x-auto',
              { 'opacity-50 pointer-events-none': !calibrationJobNgenGlobalLogging }
            ]">
              <table class="table-auto text-left border-collapse mx-auto" aria-label="Module Logging Levels">
                <thead>
                  <tr>
                    <th class="pr-4">Module</th>
                    <th v-for="level in ['Debug', 'Info', 'Warning', 'Severe', 'Fatal']" :key="level" class="px-2">
                      {{ level }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <!-- ngen row at the top -->
                  <tr>
                    <td class="pr-4">ngen</td>
                    <td v-for="level in ['debug', 'info', 'warning', 'severe', 'fatal']" :key="'ngen-' + level"
                      class="px-2">
                      <input type="radio" :name="'loglevel-ngen'" :value="level" v-model="ngenLogLevel"
                        :disabled="!calibrationJobNgenGlobalLogging" />
                    </td>
                  </tr>
                  <!-- Per-module logLevels -->
                  <tr v-for="(val, module) in logLevels" :key="module">
                    <td class="pr-4">{{ module }}</td>
                    <td v-for="level in ['debug', 'info', 'warning', 'severe', 'fatal']" :key="level" class="px-2">
                      <input type="radio" :name="`loglevel-${module}`" :value="level" v-model="logLevels[module]"
                        :disabled="!calibrationJobNgenGlobalLogging" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="selectedPlotFileUrl" id="GraphArea" class="p-2">
          <img :src="selectedPlotFileUrl" alt="Selected Plot" />
        </div>
        <div v-else id="GraphArea" class="p-2">
          <!--Data Display-->
        </div>
      </div>
    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useToast } from 'primevue/usetoast';

import type { CalibrationGetStatusValidationItem } from "@/composables/NgencerfModels";
import { useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import type { ToastMessageOptions } from "primevue/toast";

import { useRunStatusStore } from '@/stores/calibration/RunStatusStore';
import { useUserDataStore } from '@/stores/common/UserDataStore';
import { generalStore } from "~/stores/common/GeneralStore";

import { ValidationPlotNames } from "@/composables/NgencerfEnums";
import { isValidDate, isNotNullOrUndefined } from '@/utils/CommonHelpers';
import { convertTimeZone, calculateElapsedTime, sumAndFormatElapsedTimes } from '@/utils/TimeHelpers';

import { hilightTab } from '@/composables/TabHilight';

const userDataStore = useUserDataStore();

const toast = useToast();

const {
  submitTimeDate,
  submitTime,
  calibrationElapsedTime,
  plotNames,
  plotList,
  selectedPlotName,
  selectedPlotFilename,
  selectedPlotFileUrl,
  iteration,
  stopCriteria,
  stopCriteriaMet,
  elapsedTimeIntervalId,
  calibrationStatusIntervalId,
  validationsStatusIntervalId,
  validControlAndValidBestStatus,
  validationControlStatus,
  validationBestStatus,
  overallCalibrationValidationStatus,
  validationBestAchieved
} = storeToRefs(useRunStatusStore());

const {
  userCalibrationRunData,
  calibrationJobNgenGlobalLogging,
  ngenLogLevel,
  logLevels,
} = storeToRefs(userDataStore);
const { fetchUserCalibrationRunData } = userDataStore;

const {
  getValidControlAndValidBestStatus,
  queryGetCalibrationStatus,
  queryGetPlotNames,
  queryGetPlot,
  runCalibrationJob,
  queryGetIteration,
  cancelCalibrationJob,
} = useRunStatusStore();

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const calibrationStatus = computed(() => userCalibrationRunData?.value?.status);
const plotNamesToExclude = [
  "Iteration Metrics Table",
  "Iteration Parameters Table",
  "Performance Metrics Table",
];

onMounted(async () => {
  toast.removeAllGroups();
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // Do not initiate this component if there is no job.
  if (!userCalibrationRunData?.value?.calibration_run_id) {
    return;
  }
  const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);

  if (userCalibrationRunData?.value && getStatusResponse.status === 200) {
    userCalibrationRunData.value.status = getStatusResponse._data.status;
  }

  // Clear best iteration flag
  validationBestAchieved.value.isBest = false;

  nextTick(async () => {
    hilightTab(CalibrationTabs.tab_statusRun);
    if (userCalibrationRunData.value) {
      stopCriteria.value = userCalibrationRunData.value?.stop_criteria;

      if (userCalibrationRunData.value.submit_date) {
        submitTimeDate.value = new Date(userCalibrationRunData.value?.submit_date);
      }
    }

    // if calibration is Done, check if all validation statuses are Done
    if (userCalibrationRunData?.value?.status === 'Done') {
      const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);
      const validations = getStatusResponse?._data?.validations;

      const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
      const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');

      if (validBest?.status) {
        validationBestAchieved.value.isBest = (validBest.validation_type === "valid_best");
        validationBestAchieved.value.iteration = validBest.iteration_num;
      }

      const allDurs = [getStatusResponse._data.elapsed_time]

      if (allDurs.length && allDurs[0]) {
        validations.forEach((value: CalibrationGetStatusValidationItem) => {
          if (value.elapsed_time) {
            allDurs.push(value.elapsed_time);
          }
        });
        calibrationElapsedTime.value = sumAndFormatElapsedTimes(allDurs);
      }


      if (validControl?.status) {
        validationControlStatus.value = validControl.status;
      }
      if (validBest?.status) {
        validationBestStatus.value = validBest.status;
      }
      if (validationControlStatus?.value) {
        validControlAndValidBestStatus.value = getValidControlAndValidBestStatus(validationControlStatus.value, validationBestStatus.value);
      }
    }
  });
});

/**
 * Create elapsedTimeIntervalId to update calibrationElapsedTime every second while Calibration is Running or Validation is not Done
 */
const createElapsedTimeInterval = () => {
  elapsedTimeIntervalId.value = setInterval(async () => {
    if (userCalibrationRunData.value?.status === 'Running' || (userCalibrationRunData.value?.status === 'Done' &&
      (!validControlAndValidBestStatus.value || ['Ready', 'Running'].includes(validControlAndValidBestStatus.value ?? '')))) {
      // Calculate calibrationElapsedTime every second while Calibration is Running or Validation is not Done
      calibrationElapsedTime.value = calculateElapsedTime(submitTimeDate.value as Date, new Date());
    } else {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }
  }, 1000) as unknown as number;
}

// Run Calibration Job
const startRun = async () => {
  isLoading.value = true;
  validationBestAchieved.value.isBest = false;
  if (userCalibrationRunData.value) {
    userCalibrationRunData.value.status = 'Preparing Job Data';

    const runCalibrationResponse = await runCalibrationJob();

    if (runCalibrationResponse.status >= 200 && runCalibrationResponse.status < 300) {
      if (runCalibrationResponse?._data?.status) {
        userCalibrationRunData.value.status = runCalibrationResponse?._data.status;
      } else {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Could not get Calibration status from server', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }

      if (runCalibrationResponse._data.submit_date) {
        // set submitTimeDate to submit_date from server as a Date object. 
        // watch function for submitTimeDate will validate that it is a valid Date object and set submitTime, 
        // which shows the time in local time format
        submitTimeDate.value = new Date(runCalibrationResponse?._data?.submit_date);
      } else {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Could not get Calibration submit date from server', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }

      if (userCalibrationRunData?.value?.status !== 'Running') {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Calibration status not set to Running after clicking START', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      fetchUserCalibrationRunData();
    } else {
      userCalibrationRunData.value.status = 'Failed';
      const errorMessages: string[] = useApiErrorResponsePreprocess(runCalibrationResponse);
      errorMessages.forEach((msg: string) => {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: msg, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  } else {
    // userCalibrationRunData should always be set before getting to this point, but hey just in case
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'userCalibrationRunData not set', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
  isLoading.value = false;
};

// Cancel Calibration Job
const cancelRun = async () => {
  if (calibrationStatus.value === 'Running') {
    try {
      const cancelCalibrationResponse = await cancelCalibrationJob();

      if (cancelCalibrationResponse?._data.status) {
        if (userCalibrationRunData.value) {
          userCalibrationRunData.value.status = cancelCalibrationResponse?._data.status;
        }
        if (userCalibrationRunData?.value?.status !== 'Cancelled') {
          const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Calibration status not set to Cancelled after clicking CANCEL', life: ToastTimeout.timeoutError };
          toast.add(tMsg); addToastRecord(tMsg);
        }
        fetchUserCalibrationRunData();
      } else {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error cancelling Calibration', detail: 'Cannot get Calibration status', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } catch (error) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error cancelling Calibration run', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: 'Calibration status not set to Running. Cannot cancel Calibration', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

// Handle calibrationStatus changes
watch(calibrationStatus, async (newCalibrationStatus, oldCalibrationStatus, onCleanup) => {
  if (userCalibrationRunData.value) {
    if (userCalibrationRunData.value.stop_criteria) {
      stopCriteria.value = userCalibrationRunData.value?.stop_criteria;
    }

    if (userCalibrationRunData.value.submit_date) {
      submitTimeDate.value = new Date(userCalibrationRunData.value?.submit_date);
    }

    if (['Running', 'Done', 'Failed'].includes(calibrationStatus.value ?? '')) {
      // Calculate Running Time
      if (submitTimeDate.value && submitTimeDate.value instanceof Date && !isNaN(submitTimeDate?.value.getTime())) {
        submitTime.value = convertTimeZone(submitTimeDate.value); // create a string from submit_date and convert it to local time format

        const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);
        const validations = getStatusResponse?._data?.validations;

        const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
        const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');

        if (validControl?.status) {
          validationControlStatus.value = validControl.status;
        }
        if (validBest?.status) {
          validationBestStatus.value = validBest.status;
        }

        if (validationControlStatus?.value) {
          validControlAndValidBestStatus.value = getValidControlAndValidBestStatus(validationControlStatus.value, validationBestStatus.value);
        }

        // Calculate Running Time every second while calibration is Running or calibration is Done and valid_control and valid_best have not started or are Ready or Running
        if (userCalibrationRunData.value?.status === 'Running' || (userCalibrationRunData.value?.status === 'Done' &&
          (!validControlAndValidBestStatus.value || ['Ready', 'Running'].includes(validControlAndValidBestStatus.value ?? '')))) {

          const allDurs = [getStatusResponse._data.elapsed_time]
          if (allDurs.length && allDurs[0]) {
            validations.forEach((value: CalibrationGetStatusValidationItem) => {
              if (value.elapsed_time) {
                allDurs.push(value.elapsed_time);
              }
            });
            calibrationElapsedTime.value = sumAndFormatElapsedTimes(allDurs);
          }
          // Create an interval to update calibrationElapsedTime every second while Calibration is Running or Validation is not Done
          if (!elapsedTimeIntervalId.value) {
            createElapsedTimeInterval();
          }
        }
      } else {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object', life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }

      // Get Plot Names
      if (!((plotNames?.value as any)?._data?.plot_names) || (plotNames?.value as any)?._data?.plot_names.length === 0) {
        plotNames.value = await queryGetPlotNames();
      }

      if ((plotNames.value as any)?._data.plot_names) {
        // setting plotList will populate the dropdown
        plotList.value = (plotNames.value as any)?._data?.plot_names?.filter(
          (plot: any) => !plotNamesToExclude.includes(plot.name)
        );
      } else {
        const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: 'Error getting Plot Names', life: ToastTimeout.timeoutWarn };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    }

    if (calibrationStatus.value === 'Running') {
      if (!calibrationStatusIntervalId.value) {
        calibrationStatusIntervalId.value = setInterval(async () => {
          const getIterationResponse = await queryGetIteration();

          // check if status changes from Running
          if (getIterationResponse._data && getIterationResponse._data.status) {
            if (getIterationResponse._data.status !== 'Running') {
              if (userCalibrationRunData.value) {
                clearInterval(calibrationStatusIntervalId.value);
                calibrationStatusIntervalId.value = undefined;
                userCalibrationRunData.value.status = getIterationResponse._data.status;
              }
            }
          } else {
            const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to get Calibration Job Status', life: ToastTimeout.timeoutWarn };
            toast.add(tMsg); addToastRecord(tMsg);
          }

          // check if iteration changes
          if (getIterationResponse._data && isNotNullOrUndefined(getIterationResponse._data.iteration)) {
            iteration.value = getIterationResponse._data.iteration;
          }
        }, 10000) as unknown as number;
      }
    }

    else if (calibrationStatus.value === 'Done') {
      if (!iteration.value) {
        const getIterationResponse = await queryGetIteration();
        iteration.value = getIterationResponse?._data?.iteration;
      }

      if (!validControlAndValidBestStatus.value || ['Ready', 'Running'].includes(validControlAndValidBestStatus.value ?? '')) {
        // create an interval to keep checking validation statuses every 10 seconds while valid_control and valid_best are not Done, Cancelled, Failed, or Server error
        if (!validationsStatusIntervalId.value) {
          validationsStatusIntervalId.value = setInterval(async () => {
            const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);
            const validations = getStatusResponse?._data?.validations;
            const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
            const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');

            if (validControl?.status) {
              validationControlStatus.value = validControl.status;
            }
            if (validBest?.status) {
              validationBestStatus.value = validBest.status;
              validationBestAchieved.value.isBest = (validBest.validation_type === "valid_best");
              validationBestAchieved.value.iteration = validBest.iteration_num;
            }

            if (validationControlStatus?.value) {
              validControlAndValidBestStatus.value = getValidControlAndValidBestStatus(validationControlStatus.value, validationBestStatus.value);
            }

            // if valid_control and valid_best are Done, Cancelled, Failed, Server error, or Unknown, clear the interval
            if (['Done', 'Cancelled', 'Failed', 'Server Error', 'Unknown'].includes(validControlAndValidBestStatus.value ?? '')) {
              clearInterval(validationsStatusIntervalId.value);
              validationsStatusIntervalId.value = undefined;

              const allDurs = [getStatusResponse._data.elapsed_time]
              if (allDurs.length && allDurs[0]) {
                validations.forEach((value: CalibrationGetStatusValidationItem) => {
                  if (value.elapsed_time) {
                    allDurs.push(value.elapsed_time);
                  }
                });
                calibrationElapsedTime.value = sumAndFormatElapsedTimes(allDurs);
              }

            }
          }, 10000) as unknown as number;
        }
      }

      else if (['Done', 'Cancelled', 'Failed', 'Server Error'].includes(validControlAndValidBestStatus.value ?? '')) {
        const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);

        const validations = getStatusResponse?._data?.validations;

        const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
        const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');

        // Calculate elapsed time
        const allDurs = [getStatusResponse._data.elapsed_time]
        if (allDurs.length && allDurs[0]) {
          validations.forEach((value: CalibrationGetStatusValidationItem) => {
            if (value.elapsed_time) {
              allDurs.push(value.elapsed_time);
            }
          });
          calibrationElapsedTime.value = sumAndFormatElapsedTimes(allDurs);
        }

        if (validControl?.status) {
          validationControlStatus.value = validControl.status;
        }
        if (validBest?.status) {
          validationBestStatus.value = validBest.status;
        }
      }

      // clear intervals that checks calibration status and set stopCriteriaMet to true
      stopCriteriaMet.value = true;
      clearInterval(calibrationStatusIntervalId.value);
      calibrationStatusIntervalId.value = undefined;
    }

    else if (['Cancelled', 'Failed', 'Server error'].includes(calibrationStatus.value ?? '')) {
      stopCriteriaMet.value = false;
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
      clearInterval(calibrationStatusIntervalId.value);
      calibrationStatusIntervalId.value = undefined;
      clearInterval(validationsStatusIntervalId.value);
      validationsStatusIntervalId.value = undefined;
    }
  }

  onCleanup(() => {
    // if Calibration status changes to anything but Running or Done while still executing this watch function, set stopCriteriaMet to false
    if (calibrationStatus.value !== 'Running' && calibrationStatus.value !== 'Done') {
      stopCriteriaMet.value = false;
    }
  });
}, { immediate: true });

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  let plotNotAvailableMessage: string = selectedPlotName.value?.toString() + ' plot is not yet available.';

  // provide custom message if missing selected plot is a validation plot
  if (ValidationPlotNames.includes(selectedPlotName.value as string)) {
    plotNotAvailableMessage = selectedPlotName.value?.toString() + ' plot is not available until after validation is complete';
  }

  if (iteration.value && iteration.value >= 1) {
    // get selected plot file name and url from server
    const response: any = await queryGetPlot(selectedPlotName.value as string); // store this in RunStatusStore

    if (response?._data?.plot_file_path && response?._data?.plot_url) {
      selectedPlotFilename.value = response?._data?.plot_file_path;
      selectedPlotFileUrl.value = response?._data?.plot_url;
    } else {
      toast.removeAllGroups();
      selectedPlotFilename.value = "";
      selectedPlotFileUrl.value = "";
      const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: plotNotAvailableMessage, life: ToastTimeout.timeoutWarn };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } else {
    selectedPlotFilename.value = "";
    selectedPlotFileUrl.value = "";
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: plotNotAvailableMessage, life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
});

// Handle submitTimeDate changes
watch(submitTimeDate, () => {
  if (isValidDate(submitTimeDate.value)) {
    submitTime.value = convertTimeZone(submitTimeDate.value as Date);
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
});

// Handle iteration changes
watch(iteration, async () => {
  if (iteration.value && iteration.value >= 1 && selectedPlotName.value) {
    let plotNotAvailableMessage: string = selectedPlotName.value?.toString() + ' plot is not yet available';

    // provide custom message if missing selected plot is a validation plot
    if (ValidationPlotNames.includes(selectedPlotName.value as string)) {
      plotNotAvailableMessage = selectedPlotName.value?.toString() + ' plot is not available until after validation is complete';
    }
    // get selected plot file name and url from server
    const response: any = await queryGetPlot(selectedPlotName.value); // store this in RunStatusStore

    if (response?._data?.plot_file_path && response?._data?.plot_url) {
      selectedPlotFilename.value = response?._data?.plot_file_path;
      selectedPlotFileUrl.value = response?._data?.plot_url;
    } else {
      selectedPlotFilename.value = "";
      selectedPlotFileUrl.value = "";
      const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: plotNotAvailableMessage, life: ToastTimeout.timeoutWarn };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  }
});

const gotoEvaluation = () => {
  const ele = document.getElementById("MainMenuEvaluation");
  ele?.click();
}
</script>

<style scoped>
#ResultsDisplay {
  width: 50vw;
  min-width: 720px;
  margin: 5px auto;
  padding: 6px 10px 6px 20px;
  border-radius: 10px;
  border: 0px solid var(--ngwcp-neutral-gray-md);
}

#GraphArea {
  min-height: 40vh;
  width: 70%;
  margin: 0px auto 0 auto;
}

#RunStatus,
#DisplayOptions {
  width: 250px;
  margin-left: 0px;
}

.p-progressbar {
  background-color: yellow;
  vertical-align: text-bottom;
  margin-left: 10px;
  width: 200px;
  display: inline-block;
  height: 25px;
}
.p-progressbar-value {
  color: black;
  background-color: green;
}
.p-progressbar-label {
  color: white;
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
    color: black;
    background-color: green;
  }

  .p-progressbar-label {
    color: white;
  }
}
</style>
