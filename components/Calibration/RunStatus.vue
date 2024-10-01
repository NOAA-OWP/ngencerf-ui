<template>
  <div id="ResultPage">
    <div class="grid grid-rows-12">
      <div class="row-span-2">
        <div id="ResultsDisplay">
          <div class="grid grid-cols-2">
            <div class="col-span-1">
              <table>
                <tbody>
                  <tr height="45px">
                    <td class="text-right font-bold">Start Time:</td>
                    <td class="pl-5">{{ startTime ? startTime : '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="45px">
                    <td class="text-right font-bold">Running Time:</td>
                    <td class="pl-5">{{ runningTime ? runningTime : '-'.repeat(30) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">
              <table>
                <tbody>
                  <tr>
                    <td class="text-right"><label for="RunStatus">Status:</label></td>
                    <td class="pl-5">
                      <span v-if="!progress">
                        <input id="RunStatus" class="dummyProgress ml-2 text-lg" style="background-color: white;"
                          v-model="calibrationStatus" disabled />
                      </span>
                      <span v-else>
                        <ProgressBar :value="progress"></ProgressBar>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-right"><label for="DisplayOptions">Display:</label></td>
                    <td class="pl-5">
                      <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName">
                        <option v-for="plot in plotList" :key="plot.name" :value="plot.name">
                          {{ plot.name }}
                        </option>
                      </Select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      <div class="row-span-10">
        <div id="GraphArea" class="p-2" v-if="selectedPlotFileUrl">
          <img :src="selectedPlotFileUrl" alt="Image" />
        </div>
        <div id="GraphArea" class="p-2" v-else>
         Data Display

        </div>
      </div>
      
      <div class="row-span-1">
        <div id="ResultsArea" class="row-span-1" v-if="calibrationStatus === 'Done'">
          <button class="ngenButtonDiv">Go to Evaluation</button>

        </div>
      </div>
    </div>
    <div class="waitgif" v-if="isLoading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProgressBar from "primevue/progressbar";
import { onMounted } from "vue";

import { generalStore } from '~/stores/common/GeneralStore';
import { useRunStatusStore } from '~/stores/calibration/RunStatusStore';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { convertTimeZone, calculateElapsedTime } from '~/utils/TimeHelpers';
import { useToast } from 'primevue/usetoast';

const runStatusStore = useRunStatusStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const { calibrationJobId } = storeToRefs(generalStore());
const { getCalibrationTabIndex } = generalStore();
const {
  calibrationStatus,
  startTimeDate,
  startTime,
  runningTime,
  plotNames,
  plotList,
  selectedPlotName,
  selectedPlotFilename,
  selectedPlotFileUrl,
  stopCriteria,
  stopCriteriaMet,
} = storeToRefs(runStatusStore);

const { userCalibrationRunData } = storeToRefs(userDataStore);
const { fetchUserCalibrationRunData } = userDataStore;

const {
  queryGetCalibrationStatus,
  queryGetPlotNames,
  queryGetPlot,
  executeRunCalibration,
  queryIteration,
  cancelCalibrationJob,
} = runStatusStore;

const isLoading = ref(true);
const iterations = ref();
const iterationData = ref();
const progress = ref();

let statusIntervalId: NodeJS.Timeout | undefined = undefined;
let runningTimeIntervalId: NodeJS.Timeout | undefined = undefined;
let iterationIntervalId: NodeJS.Timeout | undefined = undefined;

onMounted(async () => {
  // Get User Calibration Run Data
  await fetchUserCalibrationRunData();

  if (userCalibrationRunData.value) {
    stopCriteria.value = userCalibrationRunData.value?.stop_criteria;
    console.log('stopCriteria:', stopCriteria.value);

    calibrationStatus.value = userCalibrationRunData.value?.status;
    console.log('calibrationStatus:', calibrationStatus.value);
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting Calibration Run Data', life: 5000 });
  }
  isLoading.value = false;
});

// Handle calibrationStatus changes
watch(calibrationStatus, async (newCalibrationStatus, oldCalibrationStatus, onCleanup) => {
  console.log('inside calibrationStatus watch');
  console.log('calibrationStatus:', calibrationStatus.value);
  if (calibrationStatus.value === 'Saved') {

  }

  else if (calibrationStatus.value === 'Ready') {

  }

  else if (calibrationStatus.value === 'Running') {
    // fetch Calibration Run Data to get run_date
    await fetchUserCalibrationRunData();
    // Get run_date from load_calibration_run endpoint
    if (userCalibrationRunData.value) {
      console.log('userCalibrationRunData:', userCalibrationRunData.value);
      startTimeDate.value = new Date(userCalibrationRunData.value?.run_date); // do we need to keep setting this after the first time? will value change after status is Running?
      console.log('startTimeDate:', startTimeDate.value);

      // Calculate Running Time
      if (startTimeDate.value && startTimeDate.value instanceof Date && !isNaN(startTimeDate?.value.getTime())) {
        startTime.value = convertTimeZone(startTimeDate.value); // create a string from run_date and convert it to local time format
        runningTime.value = calculateElapsedTime(startTimeDate.value, new Date());

        // Create an interval to update runningTime every second
        if (!runningTimeIntervalId) {
          runningTimeIntervalId = setInterval(() => {
            if (!stopCriteriaMet.value) {
              // Calculate Running Time every second
              runningTime.value = calculateElapsedTime(startTimeDate.value, new Date());
            }
          }, 1000);
        }
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'run_date from server could not be converted to a Date object', life: 5000 });
      }

      // Create an interval to update calibrationStatus every 10 seconds
      if (!statusIntervalId) {
        statusIntervalId = setInterval(async () => {
          await fetchUserCalibrationRunData();

          if (userCalibrationRunData.value && userCalibrationRunData.value?.status) {
            // if Calibration status changes to Done, Cancelled, or Failed, set stopCriteriaMet to true, clear intervals, and set progress to null
            if (userCalibrationRunData.value?.status === 'Done' || userCalibrationRunData.value?.status === 'Cancelled' || userCalibrationRunData.value?.status === 'Failed') {
              clearInterval(runningTimeIntervalId);
              clearInterval(statusIntervalId);
            }
            calibrationStatus.value = userCalibrationRunData.value?.status; // set this last so that the watch function gets triggered after handling Done, Cancelled, or Failed status
          } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting Calibration Run Data', life: 5000 });
          }
        }, 10000);
      }

    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting Calibration Run Data', life: 5000 });
    }

    // Get Plot Names
    plotNames.value = await queryGetPlotNames();
    if (plotNames.value) {
      console.log('plotNames:', plotNames.value?._data);

      // setting plotList and selectedPlotName will populate the dropdown
      plotList.value = plotNames.value?._data?.plot_names;
      if (plotList.value && !selectedPlotName.value) {
        selectedPlotName.value = plotList?.value[0]?.name;
        console.log('selectedPlotName:', selectedPlotName.value);
      }
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting Plot Names', life: 5000 });
    }
  }

  else if (calibrationStatus.value === 'Done') {
    if (userCalibrationRunData.value) {
      startTimeDate.value = new Date(userCalibrationRunData.value?.run_date); // do we need to keep setting this after the first time? will value change after status is Running?
      console.log('startTimeDate:', startTimeDate.value);

      if (startTimeDate.value && startTimeDate.value instanceof Date && !isNaN(startTimeDate?.value.getTime())) {
        startTime.value = convertTimeZone(startTimeDate.value); // create a string from run_date and convert it to local time format
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'run_date from server could not be converted to a Date object', life: 5000 });
      }
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting Calibration Run Data', life: 5000 });
    }

    // Update Plot Names
    plotNames.value = await queryGetPlotNames();
    if (plotNames.value) {
      console.log('plotNames:', plotNames.value?._data);

      // setting plotList and selectedPlotName will populate the dropdown
      plotList.value = plotNames.value?._data?.plot_names;
      if (!selectedPlotName.value) {
        selectedPlotName.value = plotList.value[0]?.name;
        console.log('selectedPlotName:', selectedPlotName.value);
      }
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting Plot Names', life: 5000 });
    }

    // clear intervals and set stopCriteriaMet to true
    stopCriteriaMet.value = true;
    clearInterval(runningTimeIntervalId);
    clearInterval(statusIntervalId);
  }

  else if (calibrationStatus.value === 'Cancelled') {
    stopCriteriaMet.value = false; // this should already be false, but just in case
    clearInterval(runningTimeIntervalId);
    clearInterval(statusIntervalId);
  }

  else if (calibrationStatus.value === 'Failed') {
    stopCriteriaMet.value = false; // this should already be false, but just in case
    clearInterval(runningTimeIntervalId);
    clearInterval(statusIntervalId);
  }

  else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Unknown Calibration Status', life: 5000 });
  }

  onCleanup(() => {
    console.log('Cleaning up calibrationStatus watch');
    // if Calibration status changes to anything but Running or Done while still executing this watch function, clear intervals (stop pinging server)
    if (calibrationStatus.value !== 'Running' && calibrationStatus.value !== 'Done') {
      stopCriteriaMet.value = false;
      clearInterval(runningTimeIntervalId);
      clearInterval(statusIntervalId);
    }
  });
});

// // WE WILL USE THIS LATER. Handle iterations changes
// watch(iterations, async (newIterations, oldIterations, onCleanup) => {
//   if (calibrationStatus.value === 'Running') {
//     if (iterationIntervalId) {
//       calculateProgress();

//       // if progress reaches 100, verify Calibration status is Done. calibrationStatus watch function will set stopCriteriaMet to true, clear intervals, and set progress to null
//       if (progress.value >= 100) {
//         calibrationStatus.value = await queryGetCalibrationStatus();
//         if (calibrationStatus.value?._data?.status === 'Done') {
//           await fetchUserCalibrationRunData(); // update Calibration data
//           calibrationStatus.value = 'Done';
//           } else {
//             toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration Status is not Done after progress reached 100', life: 5000 });
//           }
//       }
//     } else {
//       toast.add({ severity: 'error', summary: 'Error', detail: 'iterationIntervalId was not set when status was initially set to Running', life: 5000 });
//     }
//   } else {
//     toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration Status is not Running but iterations was changed somehow', life: 5000 });
//   }

//   onCleanup(() => {
//     // if stop criteria met before interval is cleared, clear interval
//     if (iterationIntervalId && stopCriteriaMet.value) {
//       clearInterval(iterationIntervalId);
//     }
//   });
// });

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  // get selected plot file name and url from server
  const response: any  = await queryGetPlot(selectedPlotName.value);

  if (response?._data?.plot_file_name && response?._data?.plot_url) {
    selectedPlotFilename.value = response?._data?.plot_file_name;
    selectedPlotFileUrl.value = response?._data?.plot_url;
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting plot', life: 5000 });
  }
});

// Run Calibration Job
useListen('calibrationButtonSaveStart', async (actionButton) => {
  if (getCalibrationTabIndex() === 6 && actionButton === 'START' && calibrationStatus.value === 'Ready') {
    try {
      console.log('hitting run_calibration endpoint');
      const runCalibrationResponse = await executeRunCalibration();

      if (runCalibrationResponse?._data.status) {
        calibrationStatus.value = runCalibrationResponse?._data.status;
        if (calibrationStatus.value != 'Running') {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration status not set to Running after clicking START', life: 5000 });
        }
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error running Calibration', life: 5000 });
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error running Calibration', life: 5000 });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Calibration status not set to Ready. Cannot run Calibration', life: 5000 });
  }
});

// Cancel Calibration Job
useListen('calibrationButtonResetCancel', async (actionButton) => {
  if (getCalibrationTabIndex() === 6 && actionButton === 'CANCEL' && calibrationStatus.value === 'Running') {
    try {
      console.log('hitting cancel_job endpoint');
      const cancelCalibrationResponse = await cancelCalibrationJob();

      if (cancelCalibrationResponse?._data.status) {
        calibrationStatus.value = cancelCalibrationResponse?._data.status;
        console.log('calibrationStatus:', calibrationStatus.value);
        if (calibrationStatus.value != 'Cancelled') {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration status not set to Cancelled after clicking CANCEL', life: 5000 });
        }
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error cancelling Calibration run', life: 5000 });
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error cancelling Calibration run', life: 5000 });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Calibration status not set to Running. Cannot cancel Calibration', life: 5000 });
  }
});

// /**
//  * Calculate Progress. WE WILL USE THIS LATER.
//  */
// const calculateProgress = (): void => {
//   if (stopCriteria.value && !stopCriteriaMet.value) {
//     progress.value = (iterations.value / stopCriteria.value) * 100;
//   } else {
//     toast.add({ severity: 'error', summary: 'Error', detail: 'No Stop Criteria value set or Stop Criteria already met', life: 5000 });
//   }
// };

// useListen('calibrationButtonPrev', (actionButton) => {
//   const tabs = document.getElementsByClassName("tabs");
//   const e = <HTMLElement>tabs[3];
//   e.click();
// })

// useListen('calibrationButtonNext', (actionButton) => {
//   const tabs = document.getElementsByClassName("tabs");
//   const e = <HTMLElement>tabs[5];
//   e.click();
// })
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#ResultsDisplay {
  width: 50vw;
  margin: 20px auto;
  padding: 10px 10px 10px 20px;
  border-radius: 10px;
  height: 100px;
  border: 0px solid $ngwcp_neutral_gray_md;
  min-width: 750px;

}

#GraphArea {
  height: 500px;
  width: 900px;
  margin: 8px auto 0 auto;
  border: 1px solid $ngwcp_neutral_gray_md;
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
