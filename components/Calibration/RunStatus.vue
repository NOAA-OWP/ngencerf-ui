<template>
  <div id="ResultPage">
    <div class="pr-3">
      <div>
        <div id="ResultsDisplay">
          <div class="grid grid-cols-2">

            <div class="col-span-1">
              <table>
                <tbody>
                  <tr height="40px">
                    <td class="text-right font-bold">
                      <div style="width: 140px;">Submit Time</div>
                    </td>
                    <td class="pl-5">{{ submitTime ? submitTime : '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="32px">
                    <td class="text-right font-bold">
                      <div style="width: 140px;">Elapsed Time</div>
                    </td>
                    <td class="pl-5">{{ elapsedTime ? elapsedTime : '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="32px">
                    <td class="text-right font-bold">
                      <div style="width: 140px;">Iteration</div>
                    </td>
                    <td class="pl-5">{{ iteration ?? '-'.repeat(30) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">
              <table>
                <tbody>
                  <tr height="40px">
                    <td class="text-right"><label for="RunStatus">Status</label></td>
                    <td class="pl-5">
                      <span v-if="calibrationStatus !== 'Done'">
                        <input id="RunStatus" class="dummyProgress ml-2 whitespace-nowrap text-md"
                          style="background-color: white;" v-model="calibrationStatus" disabled />
                      </span>
                      <span v-else-if="calibrationStatus === 'Done' && !validControlAndValidBestStatus" id="RunStatus"
                        class="dummyProgress ml-2 whitespace-nowrap text-md" style="background-color: white;">
                        Calibration Done, Validation Running
                      </span>
                      <span v-else-if="calibrationStatus === 'Done' && validControlAndValidBestStatus === 'Done'"
                        id="RunStatus" class="dummyProgress ml-2 whitespace-nowrap text-md"
                        style="background-color: white;">
                        Done
                      </span>
                      <span v-else-if="calibrationStatus === 'Done' && validControlAndValidBestStatus" id="RunStatus"
                        class="dummyProgress ml-2 whitespace-nowrap text-md" style="background-color: white;">
                        Calibration Done, Validation {{ validControlAndValidBestStatus }}
                      </span>
                    </td>
                  </tr>
                  <tr height="32px">
                    <td class="text-right"><label for="DisplayOptions">Display</label></td>
                    <td class="pl-5">
                      <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName" :options="plotList"
                        optionLabel="name" optionValue="name">
                      </Select>
                    </td>
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
                      <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory"
                        disabled />
                    </td>
                  </tr>
                </tbody>
              </table>


            </div>

          </div>
        </div>
      </div>
      <div>
        <div id="GraphArea" class="p-2" v-if="selectedPlotFileUrl">
          <img :src="selectedPlotFileUrl" alt="Image" />
        </div>
        <div id="GraphArea" class="p-2" v-else>
          <!--Data Display-->
        </div>
      </div>

      <!-- <div class="row-span-1">
        <div id="ResultsArea" class="row-span-1" v-if="calibrationStatus === 'Done'">
          <button class="ngenButtonDiv">Go to Evaluation</button>
        </div>
      </div> -->
    </div>

    <!--
    <div class="grid grid-rows-1 ActionButtonsBox" id="HBCbuttons">
      <div class="row-span-1">
-->
    <span v-if="calibrationStatus === 'Done'">
      <!-- NOTE TO DEVELOPERS: temporary commenting out block below until the functionality for this button is ready-->
      <!-- 

<div class="grid grid-rows-1 ActionButtonsBox" id="HBCbuttons">
  <div class="row-span-1">
          <div id="ResultsArea" class="ngenButtonDiv row-span-1">
            <button class="font-normal">Go to Evaluation</button>
          </div>
          <div class="col-span-7">&nbsp;</div>
  </div>
</div>
-->
    </span>

    <span v-else>

      <div class="grid grid-rows-1 ActionButtonsBox" id="HBCbuttons">
        <div class="row-span-1">
          <div id="StatusRunBottomButtons" class="grid grid-cols-8">
            <span v-if="calibrationStatus === 'Ready'">
              <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
                <button class="font-normal" title="Run Button" aria-label="Run Button" @click="startRun()">
                  Run
                </button>
              </div>
            </span>
            <span v-else>
              <div class="col-span-1 mr-6 h-8 whitespace-nowrap">&nbsp;</div>
            </span>
            <span v-if="calibrationStatus === 'Running'">
              <div class="col-span-1 mr-3"><!--c-blue font-normal text-xl underline pt-1-->
                <button class="col-span-1 ngenButtonDiv-red mr h-8" title="Cancel Button" @click="cancelRun()"
                  aria-label="Cancel Button">
                  Cancel
                </button>
              </div>
            </span>
            <span v-else>
              <div class="col-span-1 mr-3">&nbsp;</div>
            </span>
            <div class="col-span-4">&nbsp;</div>
            <div class="col-span-1">&nbsp;</div>
            <div class="col-span-1 mr-4">
            </div>
          </div>

        </div>
      </div>

    </span>
    <!--
      </div>
    </div>
-->

    <div class="waitgif" v-if="isLoading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { generalStore } from '~/stores/common/GeneralStore';
import { useRunStatusStore } from '~/stores/calibration/RunStatusStore';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { isValidDate, isNotNullOrUndefined } from '~/utils/CommonHelpers';
import { convertTimeZone, calculateElapsedTime } from '~/utils/TimeHelpers';
import { useToast } from 'primevue/usetoast';
import { hilightTab } from '~/composables/TabHilight';

const runStatusStore = useRunStatusStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const {
  submitTimeDate,
  submitTime,
  elapsedTime,
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
  resultsPathname
} = storeToRefs(runStatusStore);

const { userCalibrationRunData } = storeToRefs(userDataStore);
const { fetchUserCalibrationRunData } = userDataStore;

const {
  getValidControlAndValidBestStatus,
  queryGetCalibrationStatus,
  queryGetPlotNames,
  queryGetPlot,
  runCalibrationJob,
  queryGetIteration,
  queryGetJobDataDirectory,
  cancelCalibrationJob,
} = runStatusStore;

const isLoading = ref(false);
const progress = ref();
const calibrationStatus = computed(() => userCalibrationRunData?.value?.status);
const plotNamesToExclude = [
  "Iteration Metrics Table",
  "Iteration Parameters Table",
  "Performance Metrics Table",
];

onMounted(() => {
  hilightTab(CalibrationTabs.tab_statusRun);

  toast.removeAllGroups();
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    if (userCalibrationRunData.value) {
      stopCriteria.value = userCalibrationRunData.value?.stop_criteria;

      if (userCalibrationRunData.value.submit_date) {
        submitTimeDate.value = new Date(userCalibrationRunData.value?.submit_date);
      }
    }

    // if calibration is Done, check if all validation statuses are Done
    if (userCalibrationRunData?.value?.status === 'Done') {
      const getStatusResponse = await queryGetCalibrationStatus();
      const validations = getStatusResponse?._data?.validations;
      const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
      const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');
      if (validControl && validBest) {
        validControlAndValidBestStatus.value = getValidControlAndValidBestStatus(validControl, validBest);
      }
    }
  });
});

/**
 * Create elapsedTimeIntervalId to update elapsedTime every second while Calibration is Running or Validation is not Done
 */
const createElapsedTimeInterval = () => {

  elapsedTimeIntervalId.value = setInterval(async () => {
    if (userCalibrationRunData.value?.status === 'Running' || (userCalibrationRunData.value?.status === 'Done' && 
      (!validControlAndValidBestStatus.value || ['Ready', 'Running'].includes(validControlAndValidBestStatus.value ?? '')))) {
      // Calculate elapsedTime every second while Calibration is Running or Validation is not Done
      elapsedTime.value = calculateElapsedTime(submitTimeDate.value as Date, new Date());
    } else {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }
  }, 1000) as unknown as number;
}

// Run Calibration Job
const startRun = async () => {
  if (calibrationStatus.value === 'Ready') {
    if (userCalibrationRunData.value) {
      userCalibrationRunData.value.status = 'Submitted';
    }
    // toast.removeAllGroups();
    try {
      const runCalibrationResponse = await runCalibrationJob();

      if (runCalibrationResponse._data) {
        if (runCalibrationResponse._data.status) {
          if (userCalibrationRunData.value) {
            userCalibrationRunData.value.status = runCalibrationResponse?._data.status;
          } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'load_calibration_run_data from server failed' });
          }
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get Calibration status from server' });
        }

        if (runCalibrationResponse._data.submit_date) {
          submitTimeDate.value = new Date(runCalibrationResponse?._data?.submit_date);
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object' });
        }

        if (userCalibrationRunData?.value?.status !== 'Running') {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration status not set to Running after clicking START' });
        }
        fetchUserCalibrationRunData();
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'run_calibration from server failed' });
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error running Calibration' });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Calibration status not set to Ready. Cannot run Calibration' });
  }
};

// Cancel Calibration Job
const cancelRun = async () => {
  if (calibrationStatus.value === 'Running') {
    // toast.removeAllGroups();
    try {
      const cancelCalibrationResponse = await cancelCalibrationJob();

      if (cancelCalibrationResponse?._data.status) {
        if (userCalibrationRunData.value) {
          userCalibrationRunData.value.status = cancelCalibrationResponse?._data.status;
        }
        if (userCalibrationRunData?.value?.status !== 'Cancelled') {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration status not set to Cancelled after clicking CANCEL' });
        }
        fetchUserCalibrationRunData();
      } else {
        toast.add({ severity: 'error', summary: 'Error cancelling Calibration', detail: 'Cannot get Calibration status' });
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error cancelling Calibration run' });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Calibration status not set to Running. Cannot cancel Calibration' });
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

        const getStatusResponse = await queryGetCalibrationStatus();
        const validations = getStatusResponse?._data?.validations;
        const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
        const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');
        if (validControl && validBest) {
          validControlAndValidBestStatus.value = getValidControlAndValidBestStatus(validControl, validBest);
        }

        // Calculate Running Time every second while calibration is Running or calibration is Done and valid_control and valid_best have not started or are Ready or Running
        if (userCalibrationRunData.value?.status === 'Running' || (userCalibrationRunData.value?.status === 'Done' && 
        (!validControlAndValidBestStatus.value || ['Ready', 'Running'].includes(validControlAndValidBestStatus.value ?? '')))) {
          elapsedTime.value = calculateElapsedTime(submitTimeDate.value as Date, new Date());

          // Create an interval to update elapsedTime every second while Calibration is Running or Validation is not Done
          if (!elapsedTimeIntervalId.value) {
            createElapsedTimeInterval();
          }
        }
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object' });
      }

      // get job data directory
      if (!resultsPathname.value) {
        const getJobDataDirectoryResponse = await queryGetJobDataDirectory();

        if (getJobDataDirectoryResponse?._data.data_dir) {
          resultsPathname.value = getJobDataDirectoryResponse._data.data_dir;
        } else {
          toast.add({ severity: 'warn', summary: 'Warning', detail: 'Error getting Job Data Directory' });
        }
      }

      // Get Plot Names
      if (!plotNames?.value?._data?.plot_names || plotNames?.value?._data?.plot_names.length === 0) {
        plotNames.value = await queryGetPlotNames();
      }

      if (plotNames.value?._data.plot_names) {

        // setting plotList will populate the dropdown
        plotList.value = plotNames.value?._data?.plot_names?.filter(
          (plot: any) => !plotNamesToExclude.includes(plot.name)
        );
      } else {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Error getting Plot Names' });
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
            toast.add({ severity: 'warn', summary: 'Unable to get Calibration Job Status' });
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
            const getStatusResponse = await queryGetCalibrationStatus();
            const validations = getStatusResponse?._data?.validations;
            const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
            const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');
            if (validControl && validBest) {
              validControlAndValidBestStatus.value = getValidControlAndValidBestStatus(validControl, validBest);
            }

            // if valid_control and valid_best are Done, Cancelled, Failed, or Server error, clear the interval
            if (['Done', 'Cancelled', 'Failed', 'Server Error'].includes(validControlAndValidBestStatus.value ?? '')) {
              clearInterval(validationsStatusIntervalId.value);
              validationsStatusIntervalId.value = undefined;
              elapsedTime.value = validBest.elapsed_time;
            }
          }, 10000) as unknown as number;
        }
      } 
      
      else if (['Done', 'Cancelled', 'Failed', 'Server Error'].includes(validControlAndValidBestStatus.value ?? '')) {
        const getStatusResponse = await queryGetCalibrationStatus();
        const validations = getStatusResponse?._data?.validations;
        const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
        const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');
        // get elapsed time from valid_best
        if (validControl && validBest) {
          elapsedTime.value = validBest.elapsed_time;
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
      toast.add({ severity: 'warn', summary: 'Warning', detail: toastMessage });
    }
  } else {
    selectedPlotFilename.value = "";
    selectedPlotFileUrl.value = "";
    toast.add({ severity: 'warn', summary: 'Warning', detail: toastMessage });
  }
});

// Handle submitTimeDate changes
watch(submitTimeDate, () => {
  if (isValidDate(submitTimeDate.value)) {
    submitTime.value = convertTimeZone(submitTimeDate.value as Date);
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object' });
  }
});

// Handle iteration changes
watch(iteration, async () => {
  if (iteration.value && iteration.value >= 1 && selectedPlotName.value) {
    // get selected plot file name and url from server
    const response: any = await queryGetPlot(selectedPlotName.value); // store this in RunStatusStore

    if (response?._data?.plot_file_path && response?._data?.plot_url) {
      selectedPlotFilename.value = response?._data?.plot_file_path;
      selectedPlotFileUrl.value = response?._data?.plot_url;
    } else {
      selectedPlotFilename.value = "";
      selectedPlotFileUrl.value = "";
      toast.add({ severity: 'warn', summary: 'Warning', detail: 'Plots are not yet available' });
    }
  }
});

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#ResultsDisplay {
  width: 50vw;
  min-width: 720px;
  margin: 5px auto;
  padding: 6px 10px 6px 20px;
  border-radius: 10px;
  /*height: 100px;*/
  border: 0px solid $ngwcp_neutral_gray_md;

}

#GraphArea {
  min-height: 40vh;
  width: 70%;
  margin: 0px auto 0 auto;
  /*border: 1px solid $ngwcp_neutral_gray_md;*/
}

#RunStatus,
#DisplayOptions {
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

#resultsPathname {
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
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

  .p-progressbar-value {
    color: black;
  }

  .p-progressbar-label {
    color: white;
  }
}
</style>
