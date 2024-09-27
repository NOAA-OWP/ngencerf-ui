<!-- Tabs.vue -->
<template Tabs>
  <div id="MainTabs" class="sticky top-0 bg-white mr-2">

    <span v-if="currentMenu === 1"> <!-- CALIBRATION TABS -->
      <div class="@md:bg" style="margin-left: 10px; overflow: hidden">
        <div class="@md:bg" style="margin-left: 10px; overflow: hidden">
          <div data-tab="1" data-menu-tab="10" class="tabs activeTab prevent-select" v-on:click="tabClicked"
            aria-label="Calibration Runs tab" title="Calibration Runs tab">
            Calibration Runs
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="2" data-menu-tab="11" class="tabs prevent-select" v-on:click="tabClicked"
            aria-label="Headwater Basin Gage tab" title="Headwater Basin Gage tab">
            Headwater Basin Gage
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="3" data-menu-tab="12" class="tabs prevent-select" v-on:click="tabClicked"
            aria-label=" Formulation tab" title=" Formulation tab">
            Formulation
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="4" data-menu-tab="13" class="tabs prevent-select" v-on:click="tabClicked"
            aria-label="Tuning Controls tab" title="Tuning Controls tab">
            Tuning Controls
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="5" data-menu-tab="14" class="tabs prevent-select" v-on:click="tabClicked"
            aria-label=" Optimization / Metrics tab" title=" Optimization / Metrics tab">
            Optimization / Metrics
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
          <div data-tab="6" data-menu-tab="15" class="tabs prevent-select" v-on:click="tabClicked"
            aria-label="Run Status tab" title="Run Status tab">
            Run / Status
            <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
          </div>
        </div>
      </div>
    </span>

    <span v-else-if="currentMenu === 2"> <!-- EVALUATION TABS -->
      <div class="@md:bg" style="margin-left: 10px; overflow: hidden">
        <div data-tab="1" data-menu-tab="21" class="tabs activeTab prevent-select" v-on:click="tabClicked"
          aria-label="Calibration Runs tab" title="Calibration Runs tab">
          Calibration Runs
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="2" data-menu-tab="22" class="tabs prevent-select" v-on:click="tabClicked"
          aria-label="Evaluate Tab" title=" Evaluate tab">
          Evaluate
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="3" data-menu-tab="23" class="tabs prevent-select" v-on:click="tabClicked"
          aria-label="Setup a Validation Run tab" title="Setup a Validation Run tab">
          Setup a Validation Run
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="4" data-menu-tab="24" class="tabs prevent-select" v-on:click="tabClicked"
          aria-label="Select Parameters Set tab" title=" Select Parameters Set tab tab">
          Select Parameters Set
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="5" data-menu-tab="25" class="tabs prevent-select" v-on:click="tabClicked"
          aria-label="Review Setup and Run tab" title="Review Setup and Run tab">
          Review Setup / Run
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="6" data-menu-tab="26" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Status tab"
          title="Status tab">
          Status
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
      </div>
    </span>

    <span v-else-if="currentMenu === 3"> <!-- FORECAST TABS -->
      <div class="@md:bg" style="margin-left: 10px; overflow: hidden">
        <div data-tab="1" data-menu-tab="31" class="tabs activeTab prevent-select" v-on:click="tabClicked"
          aria-label="Previous Runs tab" title="Previous Runs tab">
          Previous Runs
          <div :class="tabNotCompleted ? 'erorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="2" data-menu-tab="32" class="tabs prevent-select" v-on:click="tabClicked"
          aria-label="Setup Forecast and Run Tab" title="Setup Forecast / Run tab">
          Setup Forecast / Run
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="3" data-menu-tab="33" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Status tab"
          title="Status">
          Status
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="4" data-menu-tab="34" class="tabs prevent-select" v-on:click="tabClicked"
          aria-label="Results tab" title="Results tab">
          Results
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
      </div>
    </span>


    <span v-else-if="currentMenu === 4"> <!-- FORECAST TABS -->
      <div class="@md:bg" style="margin-left: 10px; overflow: hidden">
        <div data-tab="1" data-menu-tab="41" class="tabs activeTab prevent-select" v-on:click="tabClicked"
          aria-label="Calibration Runs tab" title="Calibration Runs tab">
          Calibration Runs
          <div :class="tabNotCompleted ? 'erorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="2" data-menu-tab="42" class="tabs prevent-select" v-on:click="tabClicked"
          aria-label="Setup Forecast and Run Tab" title="Setup Forecast / Run tab">
          Setup Forecast / Run
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="3" data-menu-tab="43" class="tabs prevent-select" v-on:click="tabClicked" aria-label="Status tab"
          title="Status">
          Status
          <div :class="tabNotCompleted ? 'errorDot' : 'noErrorDot'"></div>
        </div>
        <div data-tab="4" data-menu-tab="44" class="tabs prevent-select" v-on:click="tabClicked"
          aria-label="Results tab" title="Results tab">
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
const { getCalibrationTabIndex, getEvaluationTabIndex, getForecastTabIndex, getVerificationTabIndex, getMenuIndex } = generalStore();
const emit = defineEmits(["tabNumber"]);
const currentCalibrationTab = ref(getCalibrationTabIndex());
const currentEvaluationTab = ref(getEvaluationTabIndex());
const currentForecastTab = ref(getForecastTabIndex());
const currentVerificationTab = ref(getVerificationTabIndex());
const currentMenu = ref(getMenuIndex());

onMounted(() => {
  const allTabs = document.getElementsByClassName("tabs");
  const tab = currentMenu.value === 1 ? <HTMLElement>allTabs[currentCalibrationTab.value - 1] : <HTMLElement>allTabs[currentEvaluationTab.value - 1];
  tab.click();
});

// temporary. Will be replaced by logic from each tab
const tabNotCompleted = ref(false);

const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele = event.currentTarget as HTMLElement;
  const allTabs = document.getElementsByClassName("tabs");
  // Remove highlighting from all tabs
  Object.keys(allTabs).forEach(function (key) {
    allTabs[key as any].classList.remove("activeTab");
  });

  // Note that the compiler sends errors when you don't check for null
  if (ele) {
    const cl = ele.classList;
    ele.classList.add("activeTab");
  }

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
