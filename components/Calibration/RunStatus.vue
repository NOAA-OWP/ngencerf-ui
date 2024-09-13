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
                <tr>
                  <td class="text-right">Iteration:</td>
                  <td class="pl-5">{{ iteration ? iteration : '-'.repeat(30) }}</td>
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
              <div class="mt-4">Display:
                <select id="DisplayOptions" v-model="selectedPlotName">
                  <option v-for="plot in plotList" :key="plot.name" :value="plot.name">
                    {{ plot.name }}
                  </option>
                </select>
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
        <div id="ResultsArea" class="row-span-1" v-if="calibrationStatus == 'Done'">
          <button class="ngenButtonDiv">Go to Evaluation</button>

        </div>
      </div>
    </div>
    <!-- <div class="waitgif" v-if="loading">
      <img src="@/assets/styles/img/wait.gif" />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import ProgressBar from "primevue/progressbar";

import { generalStore } from '~/stores/common/GeneralStore';
import { useRunStatusStore } from '~/stores/calibration/RunStatusStore';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { useToast } from 'primevue/usetoast';

const _generalStore = generalStore();
const runStatusStore = useRunStatusStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const { calibrationJobId } = storeToRefs(_generalStore);
const { 
  calibrationIsReady,
  calibrationStatus
 } = storeToRefs(runStatusStore);
const { userCalibrationRunData } = storeToRefs(userDataStore);
const { fetchUserCalibrationRunData } = userDataStore;

const {
  queryCalibrationIsReady,
  queryGetPlotNames,
  executeRunCalibration,
  queryReportIteration
} = runStatusStore;

const loading = ref(true);
const runningTime = ref();
const startTime = ref();
const stopCriteria = ref();
const iteration = ref();

const plotList = ref();
const selectedPlotName = ref();

const progress = ref(0);

onMounted(async () => {
  // setTimeout(() => {
  //   loading.value = false;
  // }, 500);

  // Get User Calibration Run Data
  await fetchUserCalibrationRunData();

  // Get Calibration Status
  const isCalibrationReady = await queryCalibrationIsReady();
  // console.log('isCalibrationReady:', isCalibrationReady);
  if (!isCalibrationReady) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting Calibration Ready status', life: 5000 });
  } else {
    const message: string = isCalibrationReady?._data?.message;
    if (message && message.includes('is ready')) {
      // add 'Ready' to Status
      calibrationStatus.value = 'Ready';
    }
    else if (message && message.includes('is not ready')) {
      // add 'Not Ready' to Status
      calibrationStatus.value = 'Not Ready';
      toast.add({ severity: 'info', summary: 'Calibration job is not ready to run', life: 5000 });
    }
  }

  // Get Plot Names
  const plotNames = await queryGetPlotNames();
  if (plotNames) {
    console.log('plotNames:', plotNames);
    // plotList.value = plotNames?._data?.plot_list;
    const plotData = {
      "calibration_run_id": 1,
      "plot_list": [
        {
          "name": "plotName1",
          "description": "string",
          "filename": "string"
        },
        {
          "name": "plotName2",
          "description": "string2",
          "filename": "string2"
        }
      ]
    };
    plotList.value = plotData.plot_list;

  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting Plot Names', life: 5000 });
  }
});

// Handle changes in Calibration Status
watch(calibrationStatus, async () => {
  if (calibrationStatus.value === 'Not Ready') {
    
  }

  else if (calibrationStatus.value === 'Ready') {
    // Enable Run Calibration Button
    // const runCalibrationResponse = await executeRunCalibration(); // add this to button click
  }

  else if (calibrationStatus.value === 'Running') {
    // Get run_date from load_calibration_run endpoint
    if (userCalibrationRunData.value) {
      startTime.value = userCalibrationRunData.value?.run_date;

      if (!startTime.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No Start Time', life: 5000 });
      }
    } 

    // Get iteration from report_iteration endpoint
    const iterationData = await queryReportIteration();
    if (iterationData) {
      iteration.value = iterationData?._data?.iteration;

      if (!iteration.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No Iteration', life: 5000 });
      } else {
        calculateProgress();
      }
    }
  }

  else if (calibrationStatus.value === 'Done') {

  }
});

/**
 * Calculate Progress
 */
const calculateProgress = (): number | void => {
  stopCriteria.value = userCalibrationRunData.value?.stop_criteria;
  if (stopCriteria.value) {
    progress.value = (iteration.value / stopCriteria.value) * 100;
    return progress.value;
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No Stop Criteria', life: 5000 });
  }
};
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
