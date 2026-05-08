<template>
  <div id="ResultPage">
    <div class="pr-3">
      <div>
        <div id="ResultsDisplay">

          <div class="grid grid-cols-5">
            <div class="col-span-2">
              <table>
                <tbody>
                  <tr height="38px" :aria-label="'Submit Time ' + submitTime" :title="'Submit Time ' + submitTime">
                    <th scope="row" class="text-right font-bold">
                      <div style="width: 140px;">Submit Time</div>
                    </th>
                    <td class="pl-3 whitespace-nowrap">{{ submitTime ? submitTime : '-'.repeat(15) }}</td>
                  </tr>
                  <tr height="32px" :aria-label="'Elapsed Time ' + calibrationElapsedTime"
                    :title="'Elapsed Time ' + calibrationElapsedTime">
                    <th scope="row" class="text-right font-bold">
                      <div style="width: 140px;">Elapsed Time</div>
                    </th>
                    <td class="pl-3 whitespace-nowrap">{{ calibrationElapsedTime ? calibrationElapsedTime : '-'.repeat(15) }}</td>
                  </tr>
                  <tr height="32px" :aria-label="validationBestAchieved.isBest ? 'Best Iteration ' + validationBestAchieved.iteration :
                    'Interation ' + iteration" :title="validationBestAchieved.isBest ? 'Best Iteration ' + validationBestAchieved.iteration :
                      'Interation ' + iteration">
                    <th scope="row" class="text-right font-bold">
                      <div style="width: 140px;">{{ validationBestAchieved.isBest ? 'Best ' : '' }} Iteration</div>
                    </th>
                    <td v-if="validationBestAchieved.isBest" class="pl-3">{{ validationBestAchieved.iteration }}</td>
                    <td v-else class="pl-3 whitespace-nowrap">{{ iteration ?? '-'.repeat(15) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-span-1">
                <div class="vertical-separator"></div>
            </div>

            <div class="col-span-2">
              <table>
                <tbody>
                  <tr height="38px" :aria-label="'Status ' + overallCalibrationValidationStatus"
                    :title="'Status ' + overallCalibrationValidationStatus">
                    <th scope="row" class="text-right"><label for="RunStatus">Status</label></th>
                    <td class="pl-3">
                      <span id="RunStatus" class="dummyProgress ml-2 whitespace-nowrap text-md"
                        style="background-color: white;">
                        {{ overallCalibrationValidationStatus }}
                      </span>
                    </td>
                  </tr>
                  <tr v-show="plotList.length > 1" height="32px" aria-label="Select Plot or Log Name" 
                    title="Select Plot or Log Name">
                    <th scope="row" class="text-right"><label for="DisplayOptions">Display</label></th>
                    <td class="pl-3">
                      <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName" 
                        :options="plotList" option-label="name" optionValue="name">
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">

                      <!--BUTTONS - START-->
                      <div v-if="overallCalibrationValidationStatus === 'Done'"
                        style="margin-top:4px;margin-bottom:-4px;">
                        <Button class="ngenButtonDiv font-normal" @click="gotoEvaluation" aria-label="Go to
                          Evaluation" title="Evaluate">Evaluate</Button>
                      </div>

                      <div v-if="overallCalibrationValidationStatus !== 'Done'" style="margin-top:4px; margin-bottom:-4px;">
                        <span v-if="!runButtonDisabled">
                          <Button class="font-normal ngenButtonDiv-green h-8" title="Run Button" aria-label="Run Button"
                            @click="startRun()" :disabled="runButtonDisabled">
                            Run
                          </Button>
                        </span>
                        <span v-if="!cancelButtonDisabled">
                          <Button class="ngenButtonDiv-red h-8 mr-3" title="Cancel Button" aria-label="Cancel Button"
                            @click="cancelRun()" :disabled="cancelButtonDisabled">
                            Cancel
                          </Button>
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
        <div v-if="failureMessages && failureMessages.length > 0" style="display:flex; margin-top: 1em;"  aria-label="Messages" title="Messages">
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
      <div v-if="(calibrationStatus === 'Saved' || calibrationStatus === 'Ready') || selectedPlotFileUrl || selectedLogCategory">
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
          <div :class="[
            'mb-4',
            { 'opacity-50 pointer-events-none': !calibrationJobNgenGlobalLogging }
          ]">
            <div class="inline-flex flex-col items-center mb-2">
              <p class="font-semibold mb-2">Log File Mode</p>
              <div class="flex gap-6">
                <label v-for="[label, val] in [['Unified', false], ['Split by Module', true]]" :key="label as string"
                  class="flex items-center gap-1">
                  <input type="radio" :value="val" v-model="calibrationJobLogFileMode" :disabled="!calibrationJobNgenGlobalLogging"/>
                  <span class="whitespace-nowrap">{{ label }}</span>
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
                  <!-- ngen and forcing rows at the top -->
                  <tr>
                    <td class="pr-4">ngen</td>
                    <td v-for="level in ['debug', 'info', 'warning', 'severe', 'fatal']" :key="'ngen' + level"
                      class="px-2">
                      <input type="radio" :name="'loglevel-ngen'" :value="level" v-model="ngenLogLevel"
                        :disabled="!calibrationJobNgenGlobalLogging" />
                    </td>
                  </tr>
                  <tr>
                    <td class="pr-4">forcing</td>
                    <td v-for="level in ['debug', 'info', 'warning', 'severe', 'fatal']" :key="'forcing' + level"
                      class="px-2">
                      <input type="radio" :name="'loglevel-forcing'" :value="level" v-model="forcingLogLevel"
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
        <div v-else-if="selectedLogCategory !== '' && selectedLogList && selectedLogList.length > 0" id="LogDisplayArea" class="p-2">
          <div class="pl-4">
            <table width="100%" summary="Calibration Log Options and File Path">
              <caption class="sr-only">Calibration Log Options and File Path table</caption>  
              <thead class="sr-only"><tr><th scope="col" style="min-width: 185px;">Calibration Log Label</th><th scope="col">Calibration Log Value</th></tr></thead>     
              <tbody>  
                <tr v-if="selectedLogList.length > 1" style="font-size: 0.9em;">
                  <td class="pr-2 pt-3 whitespace-nowrap"><label for="selectedLogOptions">Select {{ capitalCase(selectedLogCategory) }} Log</label></td>
                  <td><Select id="selectedLogOptions" class="p-select" style="width: auto; min-width: 254px;" v-model="selectedLogName" :options="selectedLogList"
                  optionLabel="display_name" optionValue="name">
                </Select></td>
                </tr>
                <tr v-if="selectedLogFilePath !== '' && selectedLogList.length === 1" style="font-size: 0.9em;">
                  <td class="pr-2 pt-3 whitespace-nowrap"><b>Log Name</b></td>
                  <td class="pt-3">{{ selectedLogName.split('/').at(-1).split('.')[0] }}</td>
                </tr>
                <tr v-if="selectedLogFilePath !== ''" style="font-size: 0.9em;">
                  <td class="pr-2 pt-3 whitespace-nowrap"><b>Log File Path</b></td>
                  <td class="pt-3">{{ selectedLogName }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="selectedLogDisplay">
              <div class="pt-4 pagination-rows">
                Rows {{ selectedLogStartRow }} to {{ selectedLogEndRow }} of {{ selectedLogTotalSize }}<br/>
                NOTE: Only up to the last {{ logDataPageSize }} rows of the log file are displayed, 
                newest to oldest.
                <span v-if="calibrationStatus === 'Running'">
                  The full logs will be viewable on the Evaluate tab once the job has finished running.
                </span>
                <span v-else-if="calibrationStatus !== 'Failed'">
                  The full logs can be viewed on the Evaluate tab.
                </span>
              </div>
            </div>
            <div v-else-if="selectedLogDisplay === ''">
              Log file is empty
            </div>
            <div v-else>
              Log file unavailable
            </div>

            <div v-if="selectedLogDisplay" id="selectedLogDisplay" class="p-2 gray-border overflow-scroll">
              <div v-html="selectedLogDisplay" class="whitespace-nowrap"></div>
            </div>
          </div>
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
import { isCalibrationJobStatusSavedOrReady, isValidDate, isNotNullOrUndefined } from '@/utils/CommonHelpers';
import { formatDateForRunOnString, calculateElapsedTime } from '@/utils/TimeHelpers';

import { hilightTab } from '@/composables/TabHilight';

const userDataStore = useUserDataStore();

const toast = useToast();

const runButtonDisabled = ref<boolean>(true);
const cancelButtonDisabled = ref<boolean>(true);

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
  validationBestAchieved,
  failureMessages
} = storeToRefs(useRunStatusStore());

const {
  userCalibrationRunData,
  gotoCalibrationRunId,
  calibrationJobNgenGlobalLogging,
  calibrationJobLogFileMode,
  ngenLogLevel,
  forcingLogLevel,
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
  cancelValidationJob,
  queryGetLogNames,
  queryGetLogData,
  queryGetLogStatus
} = useRunStatusStore();

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const calibrationStatus = computed(() => userCalibrationRunData?.value?.status);

const plotListOptions = ref<any[]>([]);
const plotListDefault = ref<string>('Select an option');
const logs = ref<APIResponse>({});
const logDataPageSize = ref<number>(1000);
const logLists = ref<DynamicObject>({});
const logListOptions = ref<any[]>([]);
const selectedLogCategory = ref<string>('');
const selectedLogList = ref<any[]>([]);
const selectedLogName = ref<string>('');
const selectedLogDisplay = ref<string>('');
const selectedLogTotalSize = ref<number>(0);
const selectedLogCurrentPage = ref<number>(1);
const selectedLogTotalPages = ref<number>(1);
const selectedLogStartRow = ref<number>(1);
const selectedLogEndRow = ref<number>(logDataPageSize.value);
const selectedLogFilePath = ref<string>('');
const selectedLogByteOffset = ref<number>(0);
const selectedLogStatus = ref<DynamicObject>({});
let logTimeout;

const populatePlotAndLogListOptions = async (include_plots: boolean=true) => {
  if (
    userCalibrationRunData?.value?.calibration_run_id > 0 &&
    !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)
  ) {
    const nextPlotList = [{ name: plotListDefault.value, display_name: '' }];
    const nextPlotListOptions: any[] = [];
    const nextLogListOptions: any[] = [];
    const nextLogLists: DynamicObject = {};

    if (
      ['Running', 'Done', 'Cancelled', 'Failed', 'Server error'].includes(
        userCalibrationRunData?.value?.status
      ) &&
      iteration.value !== undefined &&
      iteration.value >= 0
    ) {
      if (include_plots || !plotNames.value) {
        plotNames.value = await queryGetPlotNames();
      }

      if ((plotNames.value as any)?._data?.plot_names) {
        nextPlotListOptions.push(...(plotNames.value as any)._data.plot_names);
      }
    }

    if (
      !['Submitted', 'Validating and Preparing Job Data'].includes(
        userCalibrationRunData?.value?.status
      )
    ) {
      logs.value = await queryGetLogNames(
        userCalibrationRunData?.value?.calibration_run_id ?? 0
      );

      if (logs.value?._data?.log_names) {
        for (let l = 0; l < logs.value._data.log_names.length; l++) {
          Object.keys(logs.value._data.log_names[l]).forEach((key) => {
            const logList = logs.value._data.log_names[l][key].map((name: string) => ({
              name,
              display_name: name.split('/').pop()?.split('.')[0] ?? name
            }));

            nextLogLists[key] = logList;
          });
        }
      }
    }

    Object.keys(nextLogLists).forEach((key) => {
      nextLogListOptions.push({
        name: capitalCase(key) + ' Logs',
        display_name: ''
      });
    });

    for (const option of nextPlotListOptions.concat(nextLogListOptions)) {
      if (!nextPlotList.find((obj) => obj.name === option.name)) {
        nextPlotList.push(option);
      }
    }

    const currentPlotSelection = selectedPlotName.value;
    const currentLogCategory = selectedLogCategory.value;
    const currentLogName = selectedLogName.value;

    plotListOptions.value = nextPlotListOptions;
    logListOptions.value = nextLogListOptions;
    logLists.value = nextLogLists;
    plotList.value = nextPlotList;

    if (
      !currentPlotSelection ||
      !nextPlotList.some((obj) => obj.name === currentPlotSelection)
    ) {
      selectedPlotName.value = plotListDefault.value;
    }

    if (currentLogCategory && nextLogLists[currentLogCategory]) {
      selectedLogList.value = nextLogLists[currentLogCategory];

      if (selectedLogList.value.some((log: any) => log.name === currentLogName)) {
        selectedLogName.value = currentLogName;
      } else if (selectedLogList.value.length > 0) {
        selectedLogName.value = selectedLogList.value[0].name;
      } else {
        selectedLogName.value = '';
      }
    } else {
      selectedLogList.value = [];
      selectedLogName.value = '';
    }
  }
};

onMounted(async () => {
  isLoading.value = true;

  toast.removeAllGroups();
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // Do not initiate this component if there is no job.
  if (!userCalibrationRunData?.value?.calibration_run_id) {
    return;
  }
  const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);

  // set log levels
  if (userCalibrationRunData?.value?.logging_config?.logging_enabled) {
    calibrationJobNgenGlobalLogging.value = true;
  }
  if (userCalibrationRunData?.value?.logging_config?.split_logs_by_module) {
    calibrationJobLogFileMode.value = true;
  }
  if (userCalibrationRunData?.value?.logging_config?.modules['ngen']) {
    ngenLogLevel.value = userCalibrationRunData?.value?.logging_config?.modules['ngen'] as LogLevel;
  } else {
    ngenLogLevel.value = 'info';
  }
  if (userCalibrationRunData?.value?.logging_config?.modules['forcing']) {
    forcingLogLevel.value = userCalibrationRunData?.value?.logging_config?.modules['forcing'] as LogLevel;
  } else {
    forcingLogLevel.value = 'info';
  }
  Object.keys(userCalibrationRunData?.value?.logging_config?.modules).forEach(server_key => {
    // Find matching key in log levels somehow
    Object.keys(logLevels.value).forEach(ui_key => {
      if (ui_key.toLowerCase() == server_key.toLowerCase()) {
        logLevels.value[ui_key] = ref(userCalibrationRunData?.value?.logging_config?.modules[server_key] as LogLevel);
      }
    });
  });
  if (userCalibrationRunData?.value && getStatusResponse.status === 200) {
    userCalibrationRunData.value.status = getStatusResponse._data.status;
    failureMessages.value = getStatusResponse._data.failure_messages ?? undefined;
    if (getStatusResponse._data.warnings) {
      toast.removeAllGroups();
      getStatusResponse._data.warnings.forEach((err: any) => {
        const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: err, life: ToastTimeout.timeoutWarn };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  }

  // Clear best iteration flag
  validationBestAchieved.value.isBest = false;

  nextTick(async () => {
    hilightTab(CalibrationTabs.tab_runStatus);
    if (userCalibrationRunData.value) {
      stopCriteria.value = userCalibrationRunData.value?.stop_criteria;

      if (userCalibrationRunData.value.submit_date) {
        submitTimeDate.value = new Date(userCalibrationRunData.value?.submit_date);
      }
    }

    // if calibration is not Saved or Ready, check validation statuses
    if (!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
      const validations = getStatusResponse?._data?.validations;

      const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
      const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');

      if (validBest?.status) {
        validationBestAchieved.value.isBest = (validBest.validation_type === "valid_best");
        validationBestAchieved.value.iteration = validBest.iteration_num;
      }
      
      validationControlStatus.value = validControl?.status ? validControl.status : undefined;
      validationBestStatus.value = validBest?.status ? validBest.status : undefined;
      validControlAndValidBestStatus.value = validationControlStatus?.value ? getValidControlAndValidBestStatus(validationControlStatus.value, validationBestStatus.value) : undefined;

      if (getStatusResponse?._data?.run_end) {
        calibrationElapsedTime.value = formatDuration(calculateElapsedTime(
          submitTimeDate.value as Date, 
          validBest?.run_end ? new Date(validBest.run_end) :
          validControl?.run_end ? new Date(validControl.run_end) : 
          new Date(getStatusResponse?._data?.run_end)
        ));
      }
    
      // check to see if iteration number is defined for any status other than Saved or Ready
      if (!iteration.value) {
        await updateIteration();
      }
      await populatePlotAndLogListOptions();
    } else {
      // If job is saved or ready we need to explicitly clear the validation statuses
      validationControlStatus.value = undefined;
      validationBestStatus.value = undefined;
      validControlAndValidBestStatus.value = undefined;
    }
    isLoading.value = false;
  });
  
  runButtonDisabled.value = !['Ready'].includes(calibrationStatus.value);
  cancelButtonDisabled.value = !runButtonDisabled.value || (!['Submitted','Running'].includes(calibrationStatus.value) && !['Submitted','Running'].includes(validControlAndValidBestStatus.value));
});

/**
 * Create elapsedTimeIntervalId to update calibrationElapsedTime every second while Calibration is Running or Validation is not Done
 */
const createElapsedTimeInterval = () => {
  if (elapsedTimeIntervalId.value) {
    clearInterval(elapsedTimeIntervalId.value);
  }
  elapsedTimeIntervalId.value = setInterval(async () => {
    if (
      ['Validating and Preparing Job Data','Submitted','Running'].includes(userCalibrationRunData.value?.status) || 
      (userCalibrationRunData.value?.status === 'Done' &&
      (!validControlAndValidBestStatus.value || ['Submitted', 'Ready', 'Running'].includes(validControlAndValidBestStatus.value ?? '')))) {
      // Calculate calibrationElapsedTime every second while Calibration is Running or Validation is not Done
      calibrationElapsedTime.value = formatDuration(calculateElapsedTime(submitTimeDate.value as Date, new Date()));
    } else {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }
  }, 1000) as unknown as number;
};

// Run Calibration Job
const startRun = async () => {
  runButtonDisabled.value = true;
  validationBestAchieved.value.isBest = false;
  if (userCalibrationRunData.value) {
    userCalibrationRunData.value.status = 'Validating and Preparing Job Data';

    submitTimeDate.value = new Date(); 

    createElapsedTimeInterval();

    const runCalibrationResponse = await runCalibrationJob();

    // nominal case
    if (runCalibrationResponse.status >= 200 && runCalibrationResponse.status < 300) {
      // only update refs if calibration_run_id is still the same - i.e. if the user hasn't left the page
      if (userCalibrationRunData?.value?.calibration_run_id === runCalibrationResponse?._data?.calibration_run_id) {
        if (runCalibrationResponse?._data?.status) {
          userCalibrationRunData.value.status = runCalibrationResponse?._data.status;
          failureMessages.value = runCalibrationResponse._data.failure_messages ?? undefined;
        } else {
          const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Could not get Calibration status from server', life: ToastTimeout.timeoutError };
          toast.add(tMsg); addToastRecord(tMsg);
        }

        if (runCalibrationResponse._data.submit_date) {
          // set submitTimeDate to submit_date from server as a Date object. 
          // watch function for submitTimeDate will validate that it is a valid Date object and set submitTime, 
          // which shows the time in local time format
          // only update this values if calibration_run_id is still the same - i.e. if the user hasn't left the page
          if (userCalibrationRunData?.value?.calibration_run_id === runCalibrationResponse?._data?.calibration_run_id) {
            submitTimeDate.value = new Date(runCalibrationResponse?._data?.submit_date);
          }
        } else {
          const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Could not get Calibration submit date from server', life: ToastTimeout.timeoutError };
          toast.add(tMsg); addToastRecord(tMsg);
        }

        if (userCalibrationRunData?.value?.status !== 'Submitted' && userCalibrationRunData?.value?.status !== 'Running') {
          const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Calibration status not set to Submitted or Running after clicking START', life: ToastTimeout.timeoutError };
          toast.add(tMsg); addToastRecord(tMsg);
        }
      }
    } else {
      runButtonDisabled.value = false;
      cancelButtonDisabled.value = true;
      const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);
      
      if (getStatusResponse?._data?.status) {
        userCalibrationRunData.value.status = getStatusResponse._data.status;
        failureMessages.value = getStatusResponse._data.failure_messages ?? undefined;
      } else {
        const errorMessages: string[] = useApiErrorResponsePreprocess(getStatusResponse);
        errorMessages.forEach((msg: string) => {
          const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: msg, life: ToastTimeout.timeoutError };
          toast.add(tMsg); addToastRecord(tMsg);
        });
      }

    }
  } else {
    // userCalibrationRunData should always be set before getting to this point, but hey just in case
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'userCalibrationRunData not set', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

// Cancel Calibration Job
const cancelRun = async () => {
  if (['Submitted','Running'].includes(calibrationStatus.value) || ['Submitted','Running'].includes(validationControlStatus.value) || ['Submitted','Running'].includes(validationBestStatus.value)) {
    try {
      cancelButtonDisabled.value = true;
      let cancelCalibrationResponse = undefined;
      if (['Submitted','Running'].includes(calibrationStatus.value)) {
        cancelCalibrationResponse = await cancelCalibrationJob();
      } else {
        // get validations
        const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);
        const validations = getStatusResponse?._data?.validations;
        if (['Submitted','Running'].includes(validationControlStatus.value)) {
          const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
          cancelCalibrationResponse = await cancelValidationJob(validControl.validation_run_id);
        } else {
          const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');
          cancelCalibrationResponse = await cancelValidationJob(validBest.validation_run_id);
        }
      }

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
      cancelButtonDisabled.value = false;
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error cancelling Calibration run', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: 'Calibration/Validation status not set to Submitted or Running. Cannot cancel Calibration', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

// Update iteration
const updateIteration = async () => {
  const getIterationResponse = await queryGetIteration();
  
  if (getIterationResponse?._data) {
    // check if iteration changes
    if (isNotNullOrUndefined(getIterationResponse._data.iteration)) {
      iteration.value = getIterationResponse._data.iteration;
    }
    // check if status changes from Submitted or Running
    if (getIterationResponse._data.status) {
      if (!['Submitted','Running'].includes(getIterationResponse._data.status)) {
        if (userCalibrationRunData.value) {
          clearInterval(calibrationStatusIntervalId.value);
          calibrationStatusIntervalId.value = undefined;
        }
      }
      userCalibrationRunData.value.status = getIterationResponse._data.status;
    }
  } else {
    clearInterval(calibrationStatusIntervalId.value);
    calibrationStatusIntervalId.value = undefined;
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to get Calibration Job Status', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

// Handle calibration/validation status changes
watch(overallCalibrationValidationStatus, async (newCalibrationStatus, oldCalibrationStatus, onCleanup) => {
  if (userCalibrationRunData.value && (oldCalibrationStatus || newCalibrationStatus)) {
    if (userCalibrationRunData.value.stop_criteria) {
      stopCriteria.value = userCalibrationRunData.value?.stop_criteria;
    }

    if (userCalibrationRunData.value.submit_date) {
      submitTimeDate.value = new Date(userCalibrationRunData.value?.submit_date);
    }
    
    cancelButtonDisabled.value = !runButtonDisabled.value || (!['Submitted','Running'].includes(calibrationStatus.value) && !['Submitted','Running'].includes(validControlAndValidBestStatus.value));

    if (['Submitted', 'Running', 'Done', 'Failed'].includes(calibrationStatus.value ?? '')) {
      // Calculate Running Time
      if (submitTimeDate.value && submitTimeDate.value instanceof Date && !isNaN(submitTimeDate?.value.getTime())) {    
        // show submitTimeDate as UTC
        submitTime.value = formatDateForRunOnString(submitTimeDate.value as Date);

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

        // calculate running time every second while calibration is Running 
        // or calibration is Done and valid_control and valid_best have not started or are Submitted, Ready, Running
        if (['Validating and Preparing Job Data','Submitted','Running'].includes(userCalibrationRunData.value?.status) || (userCalibrationRunData.value?.status === 'Done' &&
          (!validControlAndValidBestStatus.value || ['Submitted', 'Ready', 'Running'].includes(validControlAndValidBestStatus.value ?? '')))) {
          // Create an interval to update calibrationElapsedTime every second while Calibration is Running or Validation is not Done
          if (!elapsedTimeIntervalId.value) {
            createElapsedTimeInterval();
          }
        }
      } else {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object. Calibration job status is: ' + calibrationStatus.value, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    }
    
    await populatePlotAndLogListOptions();

    if (['Validating and Preparing Job Data','Submitted','Running'].includes(calibrationStatus.value)) {
      // create an interval to keep checking calibration status every 10 seconds while calibration is 'Submitted' or 'Running'
      if (calibrationStatusIntervalId.value) {
        clearInterval(calibrationStatusIntervalId.value);
      }
      calibrationStatusIntervalId.value = setInterval(async () => {
        if (calibrationStatus.value === 'Submitted') {
          const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);

          // check if status changes from Submitted or Running
          if (getStatusResponse._data && getStatusResponse._data.status) {
            if (!['Submitted','Running'].includes(getStatusResponse._data.status)) {
              if (userCalibrationRunData.value) {
                clearInterval(calibrationStatusIntervalId.value);
                calibrationStatusIntervalId.value = undefined;
              }
            }
            userCalibrationRunData.value.status = getStatusResponse._data.status;
            failureMessages.value = getStatusResponse._data.failure_messages && undefined;
          } else {
            clearInterval(calibrationStatusIntervalId.value);
            const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to get Calibration Job Status', life: ToastTimeout.timeoutWarn };
            toast.add(tMsg); addToastRecord(tMsg);
          }
        } else {
          updateIteration();
          // we are inside the 10-second interval, so only heck for new logs, not new plot
          populatePlotAndLogListOptions(false);
        }
      }, 10000) as unknown as number;
    }

    else if (calibrationStatus.value === 'Done') {
      if (!iteration.value) {
        const getIterationResponse = await queryGetIteration();
        iteration.value = getIterationResponse?._data?.iteration;
      }

      // if valid_control and valid_best are not set or are 'Submitted', 'Ready' or 'Running', we need to create an interval to check their statuses
      if (!validControlAndValidBestStatus.value || ['Submitted', 'Ready', 'Running'].includes(validControlAndValidBestStatus.value ?? '')) {
        // create an interval to keep checking validation statuses every 10 seconds while valid_control and valid_best are not Done, Cancelled, Failed, Server error, or Unknown
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

            // we are inside the 10-second interval, so only heck for new logs, not new plot
            await populatePlotAndLogListOptions(false);

            // if valid_control and valid_best are Done, Cancelled, Failed, Server error, or Unknown, clear the interval
            if (['Done', 'Cancelled', 'Failed', 'Server error', 'Unknown'].includes(validControlAndValidBestStatus.value ?? '')) {
              clearInterval(validationsStatusIntervalId.value);
              validationsStatusIntervalId.value = undefined;
              
              calibrationElapsedTime.value = formatDuration(calculateElapsedTime(
                submitTimeDate.value as Date, 
                validBest?.run_end ? new Date(validBest.run_end) :
                validControl?.run_end ? new Date(validControl.run_end) : 
                new Date(getStatusResponse?._data?.run_end)
              ));
            }
          }, 10000) as unknown as number;
        }
      }

      else if (['Done', 'Cancelled', 'Failed', 'Server error'].includes(validControlAndValidBestStatus.value ?? '')) {
        const getStatusResponse = await queryGetCalibrationStatus(userCalibrationRunData?.value?.calibration_run_id as number);

        const validations = getStatusResponse?._data?.validations;

        const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
        const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');

        calibrationElapsedTime.value = formatDuration(calculateElapsedTime(
          submitTimeDate.value as Date, 
          validBest?.run_end ? new Date(validBest.run_end) :
          validControl?.run_end ? new Date(validControl.run_end) : 
          new Date(getStatusResponse?._data?.run_end)
        ));

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
    if (!['Running','Done'].includes(calibrationStatus.value)) {
      stopCriteriaMet.value = false;
    }
  });
}, { immediate: true });

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  if (selectedPlotName.value && selectedPlotName.value !== plotListDefault.value) {
    let plotNotAvailableMessage: string = selectedPlotName.value?.toString() + ' plot is not yet available.';

    // provide custom message if missing selected plot is a validation plot
    if (ValidationPlotNames.includes(selectedPlotName.value as string)) {
      plotNotAvailableMessage = selectedPlotName.value?.toString() + ' plot is not available until after validation is complete';
    }

    if (selectedPlotName.value.includes(" Logs") && selectedPlotName.value.replace(" Logs", "").toLowerCase() in logLists.value) {
      // selectedPlotName is a log 
      // reset all of our plot refs except for selectedPlotName
      resetUserPlotRefs(['selectedPlotName']);
      selectedLogCategory.value = selectedPlotName.value.replace(" Logs", "").toLowerCase();
    } else if (userCalibrationRunData?.value?.status === 'Done' || (isNotNullOrUndefined(iteration.value) && iteration.value >= 0)) {
      // get selected plot file name and url from server
      const response: any = await queryGetPlot(selectedPlotName.value as string); // store this in RunStatusStore

      if (response?._data?.plot_file_path && response?._data?.plot_url) {
        selectedPlotFilename.value = response?._data?.plot_file_path;
        selectedPlotFileUrl.value = response?._data?.plot_url;
      } else {
        toast.removeAllGroups();
        selectedPlotFilename.value = null;
        selectedPlotFileUrl.value = null;
        const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: plotNotAvailableMessage, life: ToastTimeout.timeoutWarn };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      selectedPlotFilename.value = null;
      selectedPlotFileUrl.value = null;
      const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: plotNotAvailableMessage, life: ToastTimeout.timeoutWarn };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } else {
    // reset all of our plot refs except for selectedPlotName
    resetUserPlotRefs(['selectedPlotName']);
  }
});

// Handle submitTimeDate changes
watch(submitTimeDate, () => {
  nextTick(() => {
    if (isValidDate(submitTimeDate.value)) {
      // show submitTimeDate as UTC
      submitTime.value = formatDateForRunOnString(submitTimeDate.value as Date);
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  });
});

// Handle iteration changes
watch(iteration, async () => {
  if (iteration.value !== undefined && iteration.value >= 0 && !isLoading.value) {
    // populate plotListOptions from iteration 1 onwards, in case a plot becomes available that wasn't before
    await populatePlotAndLogListOptions();
    if (selectedPlotName.value && selectedPlotName.value != plotListDefault.value && !(selectedPlotName.value.includes(" Logs") && selectedPlotName.value.replace(" Logs", "").toLowerCase() in logLists.value)) {
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
  }
});

// Reset refs when selectedPlotName changes
const resetUserPlotRefs = (exceptions: any): void => {
  if( !Array.isArray(exceptions) ) {
    exceptions = [];
  }

  // plot file refs
  if (!exceptions.includes('selectedPlotName')) {
    selectedPlotName.value = null;
  }
  selectedPlotFilename.value = null;
  selectedPlotFileUrl.value = null;

  // log refs
  selectedLogCategory.value = '';
  selectedLogList.value = [];
  selectedLogName.value = '';
  selectedLogDisplay.value = '';
  selectedLogTotalSize.value = 0;
  selectedLogCurrentPage.value = 1;
  selectedLogTotalPages.value = 0;
  selectedLogStartRow.value = 1;
  selectedLogEndRow.value = logDataPageSize.value;
  selectedLogFilePath.value = '';
  selectedLogByteOffset.value = 0;
  selectedLogStatus.value = {};
  clearTimeout(logTimeout);
}

// Handle selectedLogCategory changes
watch(selectedLogCategory, async () => {
  if (selectedLogCategory.value != '') {
  selectedLogList.value = logLists.value[selectedLogCategory.value];
    selectedLogName.value = '';
    nextTick(() => {
      // start with the first log
      selectedLogName.value = selectedLogList.value[0].name;
      if (!selectedLogList.value.length) {
        const tMsg: ToastMessageOptions = { severity: 'info', summary: selectedPlotName.value + ' not available', life: ToastTimeout.timeoutInfo };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    });
  }
});

const updateLogRefs = async(getLogData: boolean) => {
  if (getLogData) {
    const response: any = await queryGetLogData(
      selectedLogName.value, // log_name
      (userCalibrationRunData?.value?.calibration_run_id) ? userCalibrationRunData?.value?.calibration_run_id : 0, // calibration_run_id
      -1, // start is -1 to tell the server we want only the last "page" of logs
      logDataPageSize.value // limit
    );
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
      selectedLogByteOffset.value = response?._data?.byte_offset;
      if (document.getElementById('selectedLogDisplay')) {
        nextTick(async () => {
          document.getElementById('selectedLogDisplay').style.height = (((document.getElementById('MainLeftDataParent') as HTMLElement).getBoundingClientRect().bottom
          - (document.getElementById('selectedLogDisplay') as HTMLElement).getBoundingClientRect().top) + 'px');
        });
      }
    }
  }
  if ((calibrationStatus.value === 'Running' || validationControlStatus.value === 'Running' || validationBestStatus.value === 'Running') && selectedLogName.value) {
    // watch status every 10 seconds to see if log file changes
    clearTimeout(logTimeout);
    logTimeout = setTimeout(async() => {
      const status_response: any = await queryGetLogStatus(
        (userCalibrationRunData?.value?.calibration_run_id) ? userCalibrationRunData?.value?.calibration_run_id : 0, // calibration_run_id
        selectedLogName.value, // log_name
        selectedLogByteOffset.value // byte_offset
      )
      if (status_response._data) {
        selectedLogStatus.value = status_response._data;
      }
    }, 10000);
  }
}

// Handle selectedLogName changes
watch(selectedLogName, async () => {
  if (selectedLogName.value !== '') {
    await updateLogRefs(true);
    if (selectedLogDisplay.value && selectedLogDisplay.value != '') {
      nextTick(async () => {
        document.getElementById('selectedLogDisplay').scrollTop = document.getElementById('selectedLogDisplay').scrollHeight;
      });
    }
  }
});

watch(selectedLogStatus, async () => {
  // if selectedLogStatus is not empty, update log refs
  if (selectedLogStatus.value && Object.keys(selectedLogStatus.value).length > 0) {
    updateLogRefs(selectedLogStatus.value?.file_updated);
  }
});

function capitalCase(str: string) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const gotoEvaluation = () => {
  gotoCalibrationRunId.value = userCalibrationRunData?.value?.calibration_run_id;
  const ele = document.getElementById("MainMenuEvaluation");
  ele?.click();
}

onUnmounted(() => {
  // make sure page clears all selected plots/tables when the user leaves
  runButtonDisabled.value = true;
  cancelButtonDisabled.value = true;
  iteration.value = undefined;
  plotList.value = [];
  validationControlStatus.value = undefined;
  validationBestStatus.value = undefined;
  validControlAndValidBestStatus.value = undefined;
  submitTimeDate.value = undefined;
  clearInterval(elapsedTimeIntervalId.value);
  clearInterval(calibrationStatusIntervalId.value);
  clearInterval(validationsStatusIntervalId.value);
  elapsedTimeIntervalId.value = undefined;
  calibrationStatusIntervalId.value = undefined;
  validationsStatusIntervalId.value = undefined;
  resetUserPlotRefs([]);
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#ResultsDisplay {
  width: 50vw;
  min-width: 720px;
  margin: 5px auto;
  padding: 6px 10px 6px 20px;
  border-radius: 10px;
  border: 0px solid global.$ngwcp_neutral_gray_md;
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

#selectedLogDisplay {
  max-height: 300px;
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

#resultsPathname {
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
}

.gray-border {
  border: 2px solid #d9d9d9;
}

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
