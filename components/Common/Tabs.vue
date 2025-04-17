<!-- Tabs.vue -->
<template Tabs>
  <client-only>
    <div id="MainTabs" class="sticky top-0 bg-white mr-2">

      <span v-if="currentMenu === 1"> <!-- CALIBRATION TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs activeTab prevent-select" v-on:click="tabClicked"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <span v-show="calibrationJobId && currentCalibrationTab > 1">
            <div data-tab="2" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Headwater Basin Gage tab"
              title="Headwater Basin Gage tab">
              Headwater Basin Gage
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="3" class="tabs prevent-select" v-on:click="tabClicked" aria-label=" Formulation tab"
              title=" Formulation tab">
              Formulation
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="4" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Tuning Controls tab"
              title="Tuning Controls tab">
              Tuning Controls
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="5" class="tabs prevent-select" v-on:click="tabClicked"
              aria-label=" Optimization / Metrics tab" title=" Optimization / Metrics tab">
              Optimization / Metrics
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="6" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Status Run tab"
              title="Status Run tab">
              Status / Run
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
          </span>
        </div>

      </span>

      <span v-else-if="currentMenu === 2"> <!-- EVALUATION TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs activeTab prevent-select pl-25 mr-10" v-on:click="tabClicked"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <span v-show="calibrationJobId > 0">
            <div data-tab="2" class="tabs prevent-select pl-25 mr-10" v-on:click="tabClicked" aria-label="Evaluate Tab"
              v-show="evaluateValidationRunId > 0 && (evaluateValidationRunStatus && evaluateValidationRunStatus !== 'Running')"
              title=" Evaluate tab">
              Evaluate
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="3" class="tabs prevent-select pl-25 mr-10" v-on:click="tabClicked"
              aria-label="Select Alternate Iteration tab" title="Select Alternate Iteration tab">
              Select Alternate Iteration
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <span
              v-show="(evaluateIterationRunId && evaluateIterationRunId > 0) || (evaluateValidationRunId && evaluateValidationRunId > 0)">
              <div data-tab="4" class="tabs prevent-select pl-25 mr-10" v-on:click="tabClicked"
                aria-label="Run Validation tab" title="Run Validation tab">
                Run / Status
                <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
              </div>
            </span>
          </span>
        </div>
      </span>

      <span v-else-if="currentMenu === 3"> <!-- FORECAST TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs activeTab prevent-select" v-on:click="tabClicked"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <div data-tab="2" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Forecast Runs Tab"
            title="Forecast Runs Tab">
            Forecast Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[3].includes(currentForecastTab)" data-tab="3"
            class="tabs prevent-select" v-on:click="tabClicked" aria-label="Setup Forecast Tab"
            title="Setup Forecast tab">
            Setup Forecast
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[4].includes(currentForecastTab)" data-tab="4"
            class="tabs prevent-select" v-on:click="tabClicked" aria-label="Status/Run tab" title="Status/Run Tab">
            Status/Run
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="overallForcingDownloadForecastStatus === 'Done'" data-tab="5" class="tabs prevent-select" v-on:click="tabClicked"
            aria-label="Results tab" title="Results tab">
            Results
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
        </div>
      </span>

      <span v-else-if="currentMenu === 4"> <!-- VERIFICATION TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs activeTab prevent-select" v-on:click="tabClicked"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <div data-tab="2" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Setup Forecast and Run Tab"
            title="Setup Forecast / Run tab">
            Setup Forecast / Run
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="3" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Status tab" title="Status">
            Status
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div id="results-tab" data-tab="4" class="tabs prevent-select" v-on:click="tabClicked"
            aria-label="Results tab" title="Results tab">
            Results
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
        </div>
      </span>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import type { ToastMessageOptions } from "primevue/toast";


import { generalStore } from "@/stores/common/GeneralStore";
import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { ToastTimeout } from "@/composables/NextgenEnums";

const {
  calibrationJobId,
  evaluateValidationRunId,
  evaluateIterationRunId,
  evaluateValidationRunStatus
} = storeToRefs(generalStore());
const {
  getCalibrationTabIndex,
  getEvaluationTabIndex,
  getForecastTabIndex,
  getVerificationTabIndex,
  getMenuIndex,
  addToastRecord
} = generalStore();
const {
  forecastJobId,
  forecastCycle,
  selectedForecastJob,
  calibrationRunsForForecast,
  calibrationRunForForecast,
  overallForcingDownloadForecastStatus
} = storeToRefs(useForecastStore());
const {
  resetUserSelectedForecastCalibrationRun,
  loadSelectedCalibrationRun,
} = useForecastStore();

const emit = defineEmits(["tabNumber"]);
const currentCalibrationTab = ref(getCalibrationTabIndex());
const currentEvaluationTab = ref(getEvaluationTabIndex());
const currentForecastTab = ref(getForecastTabIndex());
const currentVerificationTab = ref(getVerificationTabIndex());
const currentMenu = ref(getMenuIndex());
const toast = useToast();

// temporary. Will be replaced by logic from each tabuserCalibrationRunData
const tabNotCompleted = ref(false);

const tabClicked = (event: Event) => {
  console.log("tabClicked");
  const activeTab = document.querySelector('.tabs.activeTab') as HTMLElement | null;
  if (activeTab) {
    // the active tab before clicking on a new tab
    console.log('activeTab: ', activeTab.getAttribute("title"));
  }
  event.preventDefault();
  const ele: HTMLElement = event.currentTarget as HTMLElement;
  const tabTitle: string | null = ele.getAttribute("title");
  const clickedFrom: string | null = ele.getAttribute("data-tab-triggered-from");
  console.log("clickedFrom: ", clickedFrom);

  // this is to check if a user has selected a Forecast row from the Forecast Runs tab and clicks on the Setup Forecast tab
  // this will check if the user has selected a Forecast row. if not, it will show a warning message and prevent the user from navigating to the Setup Forecast tab
  // if the user has selected a Forecast row, it will clear previous Forecast data to start setting up a new Forecast
  // TODO: add a check to see if the user has selected a Forecast row from the Forecast Runs tab
  if (currentMenu.value === 3 && tabTitle === "Setup Forecast tab") {
    console.log('selectedForecastJob: ', selectedForecastJob.value);
    if (!selectedForecastJob.value && clickedFrom === 'Forecast-ForecastRunsTab') {
      event.preventDefault();

      const tMsg: ToastMessageOptions = {
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a Forecast Run first',
        life: ToastTimeout.timeout10000,
      };
      toast.add(tMsg); addToastRecord(tMsg);
      return; // don't proceed to navigate to the tab
    } else {
      console.log('clearing out previous Forecast data and setting up calibrationRunForForecast based on selectedForecastJob');
      nextTick(async () => {
        // clear all user-selected forecast data
        resetUserSelectedForecastCalibrationRun();

        // set calibrationRunForForecast based on selectedForecastJob
        calibrationRunForForecast.value = calibrationRunsForForecast.value.find((calibrationRun: CalibrationRunForForecast) => {
          return calibrationRun.calibration_run_id === selectedForecastJob.value?.calibration_run_id;
        }) as CalibrationRunForForecast;
        console.log('calibrationRunForForecast: ', calibrationRunForForecast.value);

        // set userCalibrationRunData
        await loadSelectedCalibrationRun(selectedForecastJob?.value?.calibration_run_id as number);
        console.log('userCalibrationRunData: ', calibrationRunForForecast.value);
      });
    }
  }

  nextTick(() => {
    // Send the selected tab info to the active tab set with emit
    if (currentMenu.value === 1) {
      currentCalibrationTab.value = Number(ele.getAttribute("data-tab"));
      emit("tabNumber", currentCalibrationTab.value);
    } else if (currentMenu.value === 2) {
      currentEvaluationTab.value = Number(ele.getAttribute("data-tab"));
      emit("tabNumber", currentEvaluationTab.value);
    } else if (currentMenu.value === 3) {
      currentForecastTab.value = Number(ele.getAttribute("data-tab"));
      emit("tabNumber", currentForecastTab.value);
    } else if (currentMenu.value === 4) {
      currentVerificationTab.value = Number(ele.getAttribute("data-tab"));
      emit("tabNumber", currentVerificationTab.value);
    }
  })
}
</script>
<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#MainTabs {
  overflow-x: hidden;
  border-bottom: 3px solid #d9d9d9;
  z-index: 11;

  .tabs {
    font-size: 16px;
    display: inline-block;
    vertical-align: bottom;
    height: 43px;
    color: black;
    font-weight: bold;
    text-align: center;
    padding-top: 13px;
    padding-left: 10px;
    cursor: pointer;
  }

  .tabs:hover {
    color: global.$ngwcp_primary1;
  }

  .errorDot {
    display: inline-block;
    background-color: black;
    width: 10px;
    height: 10px;
    border-radius: 100%;
  }

  .noErrorDot {
    display: inline-block;
    background-color: transparent;
    width: 10px;
    height: 10px;
    border-radius: 100%;
  }

  .activeTab {
    border-bottom: 5px solid global.$ngwcp_primary1;
  }
}
</style>
