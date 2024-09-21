<template>
  <div id="ResultPage">
    <div class="grid grid-rows-12">
      <div class="row-span-2">
        <div id="ResultsDisplay">
          <div class="grid grid-cols-2">
            <div class="col-span-1">
              <table>
                <tr>
                  <td class="text-right">Running Time:</td>
                  <td class="pl-5">{{ runningTime ? runningTime : '-'.repeat(30) }}</td>
                </tr>
                <tr>
                  <td class="text-right">Start Time:</td>
                  <td class="pl-5">{{ startTime ? startTime : '-'.repeat(30) }}</td>
                </tr>
              </table>
            </div>

            <div class="col-span-1 pl-5" style="border-left: 1px solid #000">
              <div class="mt-1">
                Status: <span v-if="!progress">
                  <input class="dummyProgress ml-2" v-model="calibrationStatus" disabled style="width: 296px;" />
                </span>
                <span v-else>
                  <ProgressBar :value="progress"></ProgressBar>
                </span>
              </div>
              <div class="mt-2">Display:
                <Select id="DisplayOptions" v-model="selectedPlotName">
                  <option v-for="plot in plotList" :key="plot.name" :value="plot.name">
                    {{ plot.name }}
                  </option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-span-10">
        <div id="GraphArea">
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
  calibrationIsReady,
  calibrationStatus,
  startTimeDate,
  startTime,
  runningTime,
 } = storeToRefs(runStatusStore);
const { userCalibrationRunData } = storeToRefs(userDataStore);
const { fetchUserCalibrationRunData } = userDataStore;

const {
  queryCalibrationIsReady,
  queryGetPlotNames,
  executeRunCalibration,
  queryIteration,
  cancelCalibrationJob,
} = runStatusStore;

const isLoading = ref(true);
//const isCalibrationReady = ref();
const stopCriteria = ref();
const iterations = ref();

const plotNames = ref();
const plotList = ref();
const selectedPlotName = ref();
const selectedPlotFilename = ref();

const iterationData = ref();
const progress = ref();

const stopCriteriaMet = ref(false);
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
watch(calibrationStatus, async () => {
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
          if (userCalibrationRunData?.value?.status === 'Done') {
            calibrationStatus.value = 'Done';
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
      if (!selectedPlotName.value) {
        selectedPlotName.value = plotList.value[0]?.name;
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

  else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Unknown Calibration Status', life: 5000 });
  }
});

// // WE WILL USE THIS LATER. Handle iterations changes
// watch(iterations, async (newIterations, oldIterations, onCleanup) => {
//   if (calibrationStatus.value === 'Running') {
//     if (iterationIntervalId) {
//       calculateProgress();

//       // if progress reaches 100, verify Calibration status is Done. calibrationStatus watch function will set stopCriteriaMet to true, clear intervals, and set progress to null
//       if (progress.value >= 100) {
//         isCalibrationReady.value = await queryCalibrationIsReady();
//         if (isCalibrationReady.value?._data?.status === 'Done') {
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
watch(selectedPlotName, () => {
  // update selectedPlotFilename to match updated selectedPlotName
  selectedPlotFilename.value = plotList.value.find((plot: any) => plot.name === selectedPlotName.value)?.filename;
});

// Run Calibration Job
useListen('calibrationButtonSaveStart', async (actionButton) => {
  if (getCalibrationTabIndex() === 5 && actionButton === 'START' && calibrationStatus.value === 'Ready') {
    try {
      const runCalibrationResponse = await executeRunCalibration();

      if (runCalibrationResponse?._data.status && runCalibrationResponse?._data.status === 'Running') {
        calibrationStatus.value = runCalibrationResponse?._data.status; // update calibratonStatus to Running
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration status not set to Running after clicking START', life: 5000 });
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
  if (getCalibrationTabIndex() === 5 && actionButton === 'CANCEL' && calibrationStatus.value === 'Running') {
    try {
      const cancelCalibrationResponse = await cancelCalibrationJob();

      if (cancelCalibrationResponse?._data.status && cancelCalibrationResponse?._data.status === 'Cancelled') {
        calibrationStatus.value = cancelCalibrationResponse.status; // update calibratonStatus to Cancelled
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration status not set to Cancelled after clicking CANCEL', life: 5000 });
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

useListen( 'calibrationButtonPrev', ( actionButton ) => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[3];
  e.click();
})

useListen('calibrationButtonNext', (actionButton) => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[5];
  e.click();
})
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#ResultsDisplay {
  width: 50vw;
  margin: 20px auto;
  padding: 10px 10px 10px 20px;
  border-radius: 10px;
  height: 100px;
  border: 1px solid $ngwcp_primary1;
  min-width: 750px;

}

#ResultsArea {
  text-align: center;
  border-radius: 10px;
}

#GraphArea {
  height: 500px;
  width: 900px;
  margin: 8px auto 0 auto;
  border: 1px solid black;
}

#DisplayOptions {
  width: 60%;
  margin-left: 10px;
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
