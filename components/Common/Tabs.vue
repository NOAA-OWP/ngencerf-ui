<!-- Tabs.vue -->
<template Tabs>
  <client-only>
    <div id="MainTabs" class="sticky top-0 bg-white mr-2">

      <span v-if="currentMenu === 1"> <!-- CALIBRATION TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs activeTab prevent-select" @click="tabClicked"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <span v-show="calibrationJobId && currentCalibrationTab > 1">
            <div data-tab="2" class="tabs prevent-select" @click="tabClicked" aria-label="Headwater Basin Gage tab"
              title="Headwater Basin Gage tab">
              Headwater Basin Gage
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="3" class="tabs prevent-select" @click="tabClicked" aria-label="Formulation tab"
              title="Formulation tab">
              Formulation
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="4" class="tabs prevent-select" @click="tabClicked" aria-label="Tuning Controls tab"
              title="Tuning Controls tab">
              Tuning Controls
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="5" class="tabs prevent-select" @click="tabClicked"
              aria-label=" Optimization / Metrics tab" title=" Optimization / Metrics tab">
              Optimization / Metrics
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="6" class="tabs prevent-select" @click="tabClicked" aria-label="Status Run tab"
              title="Status Run tab">
              Status / Run
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
          </span>
        </div>

      </span>

      <span v-else-if="currentMenu === 2"> <!-- EVALUATION TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs activeTab prevent-select pl-25 mr-10" @click="tabClicked"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <span v-show="calibrationJobId > 0 && selectedCalibrationCompareRuns.length === 0">
            <div data-tab="2" class="tabs prevent-select pl-25 mr-10" @click="tabClicked" aria-label="Evaluate Tab"
              v-show="evaluateValidationRunId > 0 && (evaluateValidationRunStatus && evaluateValidationRunStatus !== 'Running')"
              title=" Evaluate tab">
              Evaluate
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
          </span>
          <span v-show="selectedCalibrationCompareRuns.length >= 2">
            <div data-tab="3" class="tabs prevent-select pl-25 mr-10" @click="tabClicked" aria-label="Compare Permutations Tab"
              title="Compare Permutations Tab">
              Compare Permutations
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
          </span>
          <span v-show="calibrationJobId > 0 && selectedCalibrationCompareRuns.length === 0">
            <span v-show="computedCalibrationValidationRunList.length >= 1 && !['Submitted','Running'].includes(evaluateValidationRunStatus) && !selectedCalibrationModules?.some(item => item.toLowerCase() === 'lstm')">
              <div data-tab="4" class="tabs prevent-select pl-25 mr-10" @click="tabClicked"
                aria-label="Select Alternate Iteration tab" title="Select Alternate Iteration tab">
                Select Alternate Iteration
                <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
              </div>
            </span>
            <span v-show="runStatusTabVisible || (evaluateValidationRunId > 0 && ['Submitted','Running'].includes(evaluateValidationRunStatus))">
              <div data-tab="5" class="tabs prevent-select pl-25 mr-10" @click="tabClicked"
                aria-label="Run / Status" title="Run / Status">
                Run / Status
                <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
              </div>
            </span>
          </span>
        </div>
      </span>

      <span v-else-if="currentMenu === 3"> <!-- FORECAST TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs activeTab prevent-select" @click="tabClicked"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <div data-tab="2" class="tabs prevent-select" @click="tabClicked" aria-label="Forecast Runs Tab"
            title="Forecast Runs Tab">
            Forecast Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[3].includes(currentForecastTab) || (calibrationRunForForecast && (!calibrationRunForForecast?.forecast_status || ['Saved','Ready'].includes(calibrationRunForForecast?.forecast_status)) && currentForecastTab <= 5)" data-tab="3"
            class="tabs prevent-select" @click="tabClicked" aria-label="Setup Forecast Tab"
            title="Setup Forecast Tab">
            Setup Forecast
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[4].includes(currentForecastTab) || (calibrationRunForForecast && calibrationRunForForecast?.configuration && currentForecastTab <= 5)" 
            data-tab="4" class="tabs prevent-select" @click="tabClicked" 
            aria-label="Forecast Run/Status tab" title="Forecast Run/Status Tab">
            Forecast Run/Status
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[5].includes(currentForecastTab) || (calibrationRunForForecast && calibrationRunForForecast?.forecast_status === 'Done' && currentForecastTab <= 5)" 
            data-tab="5" class="tabs prevent-select" @click="tabClicked"
            aria-label="Forecast Results Tab" title="Forecast Results Tab">
            Forecast Results
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="6" class="tabs prevent-select" @click="tabClicked"
            aria-label="Verification Runs Tab" title="Verification Runs Tab">
            Verification Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[7].includes(currentForecastTab) || (selectedVerificationJob && currentForecastTab >= 6)" 
            data-tab="7" class="tabs prevent-select" @click="tabClicked" 
            aria-label="Verification Run/Status Tab" title="Verification Run/Status Tab">
            Verification Run/Status
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[8].includes(currentForecastTab) || (selectedVerificationJob && selectedVerificationJob.status === 'Done' && currentForecastTab >= 6)" 
            id="results-tab" data-tab="8" class="tabs prevent-select" @click="tabClicked"
            aria-label="Verification Results Tab" title="Verification Results Tab">
            Verification Results
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
        </div>
      </span>

      <span v-else-if="currentMenu === 4"> <!-- HINDCAST TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs activeTab prevent-select" @click="tabClicked"
            aria-label="Hindcast Runs Tab" title="Hindcast Runs Tab">
            Hindcast Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
        </div>
      </span>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { useEvaluationRunStatusStore } from '@/stores/evaluation/EvaluationRunStatusStore';
import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { useVerificationStore } from "~/stores/forecast/VerificationStore";

const {
  calibrationJobId,
  evaluateValidationRunId,
  evaluateValidationRunStatus
} = storeToRefs(generalStore());
const {
  getCalibrationTabIndex,
  getEvaluationTabIndex,
  getForecastTabIndex,
  getHindcastTabIndex,
  getMenuIndex,
} = generalStore();

const {
  selectedCalibrationCompareRuns,
  selectedCalibrationModules,
  computedCalibrationValidationRunList
} = storeToRefs(useEvaluationCalibrationRunStore());

const { runStatusTabVisible } = storeToRefs(useEvaluationRunStatusStore());

const { calibrationRunForForecast } = storeToRefs(useForecastStore());

const { selectedVerificationJob } = storeToRefs(useVerificationStore());

const emit = defineEmits(["tabNumber"]);
const currentCalibrationTab = ref(getCalibrationTabIndex());
const currentEvaluationTab = ref(getEvaluationTabIndex());
const currentForecastTab = ref(getForecastTabIndex());
const currentHindcastTab = ref(getHindcastTabIndex());
const currentMenu = ref(getMenuIndex());

// temporary. Will be replaced by logic from each tabuserCalibrationRunData
const tabNotCompleted = ref(false);

const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele: HTMLElement = event.currentTarget as HTMLElement;

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
      currentHindcastTab.value = Number(ele.getAttribute("data-tab"));
      emit("tabNumber", currentHindcastTab.value);
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
