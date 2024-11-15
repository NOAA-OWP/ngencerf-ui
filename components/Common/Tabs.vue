<!-- Tabs.vue -->
<template Tabs>
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
          <div data-tab="5" class="tabs prevent-select" v-on:click="tabClicked" aria-label=" Optimization / Metrics tab"
            title=" Optimization / Metrics tab">
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
        <span v-show="calibrationJobId > 0 && loadCalibrationDataComplete == true">
          <div data-tab="2" class="tabs prevent-select pl-25 mr-10" v-on:click="tabClicked" aria-label="Evaluate Tab" v-show="evaluateValidationRunId > 0"
            title=" Evaluate tab">
            Evaluate
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="3" class="tabs prevent-select pl-25 mr-10" v-on:click="tabClicked"
            aria-label="Select Alternate Iteration tab" title="Select Alternate Iteration tab">
            Select Alternate Iteration
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <span v-show="evaluateIterationRunId && evaluateIterationRunId > 0">
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
        <span data-tab="1" class="tabs activeTab prevent-select" v-on:click="tabClicked" aria-label="Previous Runs tab"
          title="Previous Runs tab">
          Previous Runs
          <div :class="tabNotCompleted ? 'erorDot' : 'noErrorDot'"></div>
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
        <div data-tab="4" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Results tab"
          title="Results tab">
          Results
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
      </div>
    </span>


    <span v-else-if="currentMenu === 4"> <!-- FORECAST TABS -->
      <div class="@md:bg" style="margin-left: 0px; overflow: hidden">
        <span data-tab="1" class="tabs activeTab prevent-select" v-on:click="tabClicked"
          aria-label="Calibration Runs tab" title="Calibration Runs tab">
          Calibration Runs
          <div :class="tabNotCompleted ? 'erorDot' : 'noErrorDot'"></div>
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
        <div data-tab="4" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Results tab"
          title="Results tab">
          Results
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
      </div>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { generalStore } from "@/stores/common/GeneralStore";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore"

const { calibrationJobId, evaluateValidationRunId, evaluateIterationRunId } = storeToRefs(generalStore());
const { getCalibrationTabIndex, getEvaluationTabIndex, getForecastTabIndex, getVerificationTabIndex, getMenuIndex } = generalStore();
const emit = defineEmits(["tabNumber"]);
const currentCalibrationTab = ref(getCalibrationTabIndex());
const currentEvaluationTab = ref(getEvaluationTabIndex());
const currentForecastTab = ref(getForecastTabIndex());
const currentVerificationTab = ref(getVerificationTabIndex());
const currentMenu = ref(getMenuIndex());

//store specific import
const { loadCalibrationDataComplete } = storeToRefs(useEvaluationCalibrationRunStore())

// temporary. Will be replaced by logic from each tabuserCalibrationRunData
const tabNotCompleted = ref(false);

// onMounted(() => {
//   const observerCallback = (mutationsList: any) => {
//     for (const mutation of mutationsList) {
//       if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
//         const targetElement = mutation.target;
//         if (targetElement.classList.contains('activeTab')) {
//           console.log('activeTab class added to', targetElement);
//           console.trace('Trace for activeTab class addition');
//         } else {
//           console.log('activeTab class removed from', targetElement);
//           console.trace('Trace for activeTab class removal');
//         }
//       }
//     }
//   };

//   const observer = new MutationObserver(observerCallback);

//   // Observe all elements with the class 'tabs' for attribute changes
//   const tabsElements = document.querySelectorAll('.tabs');
//   console.log("tabElements length: ", tabsElements.length)
//   tabsElements.forEach((el) => {
//     observer.observe(el, { attributes: true, attributeFilter: ['class'] });
//   });

//   // Cleanup observer on component unmount
//   onBeforeUnmount(() => {
//     observer.disconnect();
//   });
// });


const tabClicked = (event: Event) => {
  console.log("Tab Clicked Event ", event.target)
  event.preventDefault();
  const ele = event.currentTarget as HTMLElement;
  const allTabs = document.getElementsByClassName("tabs");
  // Remove highlighting from all tabs
  Object.keys(allTabs).forEach(function (key) {
    allTabs[key as any].classList.remove("activeTab");
  });

  // Note that the compiler sends errors when you don't check for null
  if (ele) {
    //const cl = ele.classList;
    ele.classList.add("activeTab");
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
@import "@/assets/styles/styles.scss";

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
    color: $ngwcp_primary1;
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
    border-bottom: 5px solid $ngwcp_primary1;
  }
}
</style>
