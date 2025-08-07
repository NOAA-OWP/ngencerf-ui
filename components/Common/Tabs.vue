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
            <span v-show="computedCalibrationValidationRunList.length >= 1 && !selectedCalibrationModules?.some(item => item.toLowerCase() === 'lstm')">
              <div data-tab="4" class="tabs prevent-select pl-25 mr-10" @click="tabClicked"
                aria-label="Select Alternate Iteration tab" title="Select Alternate Iteration tab">
                Select Alternate Iteration
                <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
              </div>
            </span>
            <span v-show="runStatusTabVisible || (evaluateValidationRunId > 0 && evaluateValidationRunStatus === 'Running')">
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
          <div v-show="[3].includes(currentForecastTab) || calibrationRunForForecast && (!calibrationRunForForecast?.forecast_status || ['Saved','Ready'].includes(calibrationRunForForecast?.forecast_status))" data-tab="3"
            class="tabs prevent-select" @click="tabClicked" aria-label="Setup Forecast Tab"
            title="Setup Forecast Tab">
            Setup Forecast
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[4].includes(currentForecastTab) || (calibrationRunForForecast && calibrationRunForForecast?.configuration)" data-tab="4"
            class="tabs prevent-select" @click="tabClicked" aria-label="Run/Status tab" title="Run/Status Tab">
            Run/Status
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[5].includes(currentForecastTab) || calibrationRunForForecast && calibrationRunForForecast?.forecast_status === 'Done'" data-tab="5" class="tabs prevent-select" @click="tabClicked"
            aria-label="Results tab" title="Results tab">
            Results
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
        </div>
      </span>

      <span v-else-if="currentMenu === 4"> <!-- VERIFICATION TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs activeTab prevent-select" @click="tabClicked"
            aria-label="Forecast Runs Tab" title="Forecast Runs Tab">
            Forecast Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <span data-tab="2" class="tabs prevent-select" @click="tabClicked"
            aria-label="Verification Runs Tab" title="Verification Runs Tab">
            Verification Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <div v-show="[3].includes(currentVerificationTab) || (userVerificationJobData && (userVerificationJobData.status || ['Saved','Ready'].includes(userVerificationJobData.status)))"
            data-tab="3" class="tabs prevent-select" @click="tabClicked" 
            aria-label="Setup Verification Tab" title="Setup Verification Tab">
            Setup Verification
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[4].includes(currentVerificationTab) || userVerificationJobData" 
            data-tab="4" class="tabs prevent-select" @click="tabClicked" 
            aria-label="Run/Status Tab" title="Run/Status Tab">
            Run/Status
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div v-show="[5].includes(currentVerificationTab) || (userVerificationJobData && userVerificationJobData.status === 'Done')" 
            id="results-tab" data-tab="5" class="tabs prevent-select" @click="tabClicked"
            aria-label="Results Tab" title="Results Tab">
            Results
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
        </div>
      </span>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { storeToRefs } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { useEvaluationRunStatusStore } from '@/stores/evaluation/EvaluationRunStatusStore';
import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { useVerificationStore } from "@/stores/verification/VerificationStore";

import { useDialog } from "primevue/usedialog";
import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";

const dialog = useDialog();
const navDialogOpened = ref<boolean>(false);

const {
  calibrationJobId,
  evaluateValidationRunId,
  evaluateValidationRunStatus
} = storeToRefs(generalStore());
const {
  getCalibrationTabIndex,
  getEvaluationTabIndex,
  getForecastTabIndex,
  getVerificationTabIndex,
  getMenuIndex,
} = generalStore();

const {
  selectedCalibrationCompareRuns,
  selectedCalibrationModules,
  computedCalibrationValidationRunList
} = storeToRefs(useEvaluationCalibrationRunStore());

const { 
  runStatusTabVisible
} = storeToRefs(useEvaluationRunStatusStore());

const {
  calibrationRunForForecast,
  forecastConfiguration,
  forecastJobStatus,
  overallForcingDownloadForecastStatus
} = storeToRefs(useForecastStore());

const {
  verificationJobId,
  verificationJobStatus,
  userVerificationJobData
} = storeToRefs(useVerificationStore());

const emit = defineEmits(["tabNumber"]);
const currentCalibrationTab = ref(getCalibrationTabIndex());
const currentEvaluationTab = ref(getEvaluationTabIndex());
const currentForecastTab = ref(getForecastTabIndex());
const currentVerificationTab = ref(getVerificationTabIndex());
const currentMenu = ref(getMenuIndex());

// temporary. Will be replaced by logic from each tabuserCalibrationRunData
const tabNotCompleted = ref(false);

const props = defineProps({
  callTabValidator: {
    type: Function,
    required: false,
  },
  callTabRestore: {
    type: Function,
    required: false,
  }
});

const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele: HTMLElement = event.currentTarget as HTMLElement;
  if (props.callTabValidator) {
    const errors = props.callTabValidator();
    if (errors.error) {
      showTabNavDialog(errors.text, true, ele);
    } else {
      goToTab(ele);
    }
  } else {
    goToTab(ele);
  }
}

const goToTab = (ele: HTMLElement) => {
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

const showTabNavDialog = (body: string[], next: boolean, ele: HTMLElement) => {
  if (!navDialogOpened.value) {
    dialog.open(MoveNextPrevDialog, {
      props: {
        header: "Unsaved changes!",
        style: {
          width: 'auto',
        },
        modal: true,
      },
      data: {
        body: body,
        direction: next
      },
      onClose: (opt) => {
        navDialogOpened.value = false;
        handleTabNavDialogClose(opt, ele);
      },

    })
    navDialogOpened.value = true;
  }
}

const handleTabNavDialogClose = (opt: any, ele: HTMLElement) => {
  if (opt.data && opt.data.moveToNextResponse) {
    if (props.callTabRestore) {
      props.callTabRestore();
    }
    goToTab(ele);
  }
  if (opt.type && opt.type === 'dialog-close') {
    return;
  }
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
