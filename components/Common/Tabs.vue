<!-- Tabs.vue -->
<template Tabs>
  <client-only>
    <div id="MainTabs" class="sticky top-0 bg-white mr-2">

      <span v-if="currentMenu === 1"> <!-- CALIBRATION TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <span data-tab="1" class="tabs prevent-select" @click="tabClicked"
            :class="{activeTab: currentTab === 1, disabled: isLoading}"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </span>
          <span v-show="calibrationJobId && currentTab > 1">
            <div data-tab="2" class="tabs prevent-select" @click="tabClicked" 
              :class="{activeTab: currentTab === 2, disabled: isLoading}"
              aria-label="Headwater Basin Gage tab" title="Headwater Basin Gage tab">
              Headwater Basin Gage
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="3" class="tabs prevent-select" @click="tabClicked" 
              :class="{activeTab: currentTab === 3, disabled: isLoading}"
              aria-label="Formulation tab" title="Formulation tab">
              Formulation
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="4" class="tabs prevent-select" @click="tabClicked" 
              :class="{activeTab: currentTab === 4, disabled: isLoading}"
              aria-label="Tuning Controls tab" title="Tuning Controls tab">
              Tuning Controls
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="5" class="tabs prevent-select" @click="tabClicked"
              :class="{activeTab: currentTab === 5, disabled: isLoading}"
              aria-label=" Optimization / Metrics tab" title=" Optimization / Metrics tab">
              Optimization / Metrics
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
            <div data-tab="6" class="tabs prevent-select" @click="tabClicked" 
              :class="{activeTab: currentTab === 6, disabled: isLoading}"
              aria-label="Status Run tab" title="Status Run tab">
              Status / Run
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
          </span>
        </div>

      </span>

      <span v-else-if="currentMenu === 2"> <!-- EVALUATION TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <div data-tab="1" class="tabs prevent-select pl-25 mr-10" @click="tabClicked"
            :class="{activeTab: currentTab === 1, disabled: isLoading}"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <span v-show="calibrationJobId > 0 && selectedCalibrationCompareRuns.length === 0">
            <div data-tab="2" class="tabs prevent-select pl-25 mr-10" @click="tabClicked" 
              :class="{activeTab: currentTab === 2, disabled: isLoading}"
              v-show="evaluateValidationRunId > 0 && (evaluateValidationRunStatus && evaluateValidationRunStatus !== 'Running')"
              aria-label="Evaluate Tab" title=" Evaluate tab">
              Evaluate
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
          </span>
          <span v-show="selectedCalibrationCompareRuns.length >= 2">
            <div data-tab="3" class="tabs prevent-select pl-25 mr-10" @click="tabClicked" 
              :class="{activeTab: currentTab === 3, disabled: isLoading}"
              aria-label="Compare Permutations Tab" title="Compare Permutations Tab">
              Compare Permutations
              <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
            </div>
          </span>
          <span v-show="calibrationJobId > 0 && selectedCalibrationCompareRuns.length === 0">
            <span v-show="computedCalibrationValidationRunList.length >= 1 && !['Submitted','Running'].includes(evaluateValidationRunStatus) && !selectedCalibrationModules?.some(item => item.toLowerCase() === 'lstm')">
              <div data-tab="4" class="tabs prevent-select pl-25 mr-10" @click="tabClicked"
                :class="{activeTab: currentTab === 4, disabled: isLoading}"
                aria-label="Select Alternate Iteration tab" title="Select Alternate Iteration tab">
                Select Alternate Iteration
                <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
              </div>
            </span>
            <span v-show="runStatusTabVisible || (evaluateValidationRunId > 0 && ['Submitted','Running'].includes(evaluateValidationRunStatus))">
              <div data-tab="5" class="tabs prevent-select pl-25 mr-10" @click="tabClicked"
                :class="{activeTab: currentTab === 5, disabled: isLoading}"
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
          <div data-tab="1" class="tabs prevent-select" @click="tabClicked"
            :class="{activeTab: currentTab === 1, disabled: isLoading}"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="2" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 2, disabled: isLoading}"
            aria-label="Forecast Runs Tab" title="Forecast Runs Tab">
            Forecast Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="3" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 3, disabled: isLoading}"
            v-show="[3].includes(currentTab) || (calibrationRunForForecast && (!calibrationRunForForecast?.forecast_status || ['Saved','Ready'].includes(calibrationRunForForecast?.forecast_status)) && !forecastJobId && currentTab <= 5)"
            aria-label="Setup Forecast Tab" title="Setup Forecast Tab">
            Setup Forecast
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="4" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 4, disabled: isLoading}"
            v-show="[4].includes(currentTab) || (calibrationRunForForecast && (calibrationRunForForecast?.configuration || forecastConfigurationName) && currentTab <= 5)" 
            aria-label="Forecast Run/Status tab" title="Forecast Run/Status Tab">
            Forecast Run/Status
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="5" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 5, disabled: isLoading}"
            v-show="[5].includes(currentTab) || (calibrationRunForForecast && (calibrationRunForForecast?.forecast_status === 'Done' || overallColdStartForecastStatus === 'Done') && currentTab <= 5)" 
            aria-label="Forecast Results Tab" title="Forecast Results Tab">
            Forecast Results
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
        </div>
      </span>

      <span v-else-if="currentMenu === 4"> <!-- HINDCAST TABS -->
        <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
          <div data-tab="1" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 1, disabled: isLoading}"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="2" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 2, disabled: isLoading}"
            aria-label="Hindcast Runs Tab" title="Hindcast Runs Tab">
            Hindcast Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="3" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 3, disabled: isLoading}"
            v-show="[3].includes(currentTab) || (calibrationRunForHindcast && (!calibrationRunForHindcast?.hindcast_status || ['Saved','Ready'].includes(calibrationRunForHindcast?.hindcast_status)) && !hindcastJobId && currentTab <= 5)"
            aria-label="Setup Hindcast Tab" title="Setup Hindcast Tab">
            Setup Hindcast
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="4" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 4, disabled: isLoading}"
            v-show="[4].includes(currentTab) || (calibrationRunForHindcast && (calibrationRunForHindcast?.configuration || hindcastConfigurationName) && currentTab <= 5)" 
            aria-label="Hindcast Run/Status tab" title="Hindcast Run/Status Tab">
            Hindcast Run/Status
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="5" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 5, disabled: isLoading}"
            v-show="[5].includes(currentTab) || (calibrationRunForHindcast && (calibrationRunForHindcast?.hindcast_status === 'Done' || overallColdStartHindcastStatus === 'Done') && currentTab <= 5)" 
            aria-label="Hindcast Results Tab" title="Hindcast Results Tab">
            Hindcast Results
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="6" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 6, disabled: isLoading}"
            aria-label="Verification Runs Tab" title="Verification Runs Tab">
            Verification Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="7" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 7, disabled: isLoading}"
            v-show="[7].includes(currentTab) || (selectedVerificationJob && currentTab >= 6)" 
            aria-label="Verification Run/Status Tab" title="Verification Run/Status Tab">
            Verification Run/Status
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="8" class="tabs prevent-select" @click="tabClicked" 
            :class="{activeTab: currentTab === 8, disabled: isLoading}"
            v-show="[8].includes(currentTab) || (selectedVerificationJob && selectedVerificationJob.status === 'Done' && currentTab >= 6)" 
            aria-label="Verification Results Tab" title="Verification Results Tab">
            Verification Results
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
        </div>
      </span>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore"
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { useEvaluationRunStatusStore } from '@/stores/evaluation/EvaluationRunStatusStore';
import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { useHindcastStore } from "@/stores/hindcast/HindcastStore";
import { useVerificationStore } from "@/stores/hindcast/VerificationStore";

import { useDialog } from "primevue/usedialog";
import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";

const dialog = useDialog();
const navDialogOpened = ref<boolean>(false);

const {
  isLoading,
  calibrationJobId,
  evaluateValidationRunId,
  evaluateValidationRunStatus
} = storeToRefs(generalStore());
const {
  getMenuIndex,
  getCalibrationTabIndex,
  getEvaluationTabIndex,
  getForecastTabIndex,
  getHindcastTabIndex,
  setCalibrationTabIndex,
  setEvaluationTabIndex,
  setForecastTabIndex,
  setHindcastTabIndex,
} = generalStore();

const { startTab } = storeToRefs(useUserDataStore());

const {
  selectedCalibrationCompareRuns,
  selectedCalibrationModules,
  computedCalibrationValidationRunList
} = storeToRefs(useEvaluationCalibrationRunStore());

const { runStatusTabVisible } = storeToRefs(useEvaluationRunStatusStore());

const { calibrationRunForForecast, forecastJobId, forecastConfigurationName, overallColdStartForecastStatus } = storeToRefs(useForecastStore());

const { selectedVerificationJob } = storeToRefs(useVerificationStore());

const { calibrationRunForHindcast, hindcastJobId, hindcastConfigurationName, overallColdStartHindcastStatus } = storeToRefs(useHindcastStore());

const emit = defineEmits(["tabNumber"]);

const currentTab = computed(() => {
  switch (currentMenu.value) {
    case 1:
      return getCalibrationTabIndex();
    case 2:
      return getEvaluationTabIndex();
    case 3:
      return getForecastTabIndex();
    case 4:
      return getHindcastTabIndex();
    default:
      return 0;
  }
});
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

onMounted( () => {
  if (startTab?.value > 1) {
    goToTab(startTab.value);
    startTab.value = 1;
  } else if (currentTab.value === 0) {
    goToTab(1);
  }
})

const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele: HTMLElement = event.currentTarget as HTMLElement;
  const tabNumber = Number(ele.getAttribute("data-tab"));
  if (props.callTabValidator) {
    const errors = props.callTabValidator(tabNumber);
    if (errors.error) {
      showTabNavDialog(errors.text, true, tabNumber);
    } else {
      goToTab(tabNumber);
    }
  } else {
    goToTab(tabNumber);
  }
}

const goToTab = (tabNumber: number) => {
  // Send the selected tab info to the active tab set with emit
  switch (currentMenu.value) {
    case 1:
      setCalibrationTabIndex(tabNumber);
      break;
    case 2:
      setEvaluationTabIndex(tabNumber);
      break;
    case 3:
      setForecastTabIndex(tabNumber);
      break;
    case 4:
      setHindcastTabIndex(tabNumber);
      break;
  }
  emit("tabNumber", tabNumber);
}

const showTabNavDialog = (body: string[], next: boolean, tabNumber: number) => {
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
        handleTabNavDialogClose(opt, tabNumber);
      },
    })
    navDialogOpened.value = true;
  }
}

const handleTabNavDialogClose = (opt: any, tabNumber: number) => {
  if (opt.data && opt.data.moveToNextResponse) {
    if (props.callTabRestore) {
      props.callTabRestore();
    }
    goToTab(tabNumber);
  }
  if (opt.type && opt.type === 'dialog-close') {
    return;
  }
}

defineExpose({
  showTabNavDialog,
  goToTab
});
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
