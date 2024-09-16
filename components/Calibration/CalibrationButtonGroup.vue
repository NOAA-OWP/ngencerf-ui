<template>
  <div id="BottomButtons" class="grid grid-cols-12 w-full">
    <div class="col-span-2">
      <button v-if="getCalibrationTabIndex() < 6" class="start actionBtn" @click="SaveStartTabContent"
        :title="btnSaveOrStart() + ' Button'" :aria-label="btnSaveOrStart() + ' Button'">
        {{ btnSaveOrStart() }}</button>
    </div>
    <div class="col-span-2">
      <button v-if="getCalibrationTabIndex() < 6" :class="getCalibrationTabIndex() < 5 ? 'save' : 'stop'"
        class="actionBtn" @click="ResetStopTabContent" :title="btnResetOrStop() + 'Button'"
        :aria-label="btnResetOrStop() + 'Button'">{{ btnResetOrStop() }}</button>
    </div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-2 text-right"><button v-if="getCalibrationTabIndex() < 5 && getCalibrationTabIndex() !== 1"  class="prev actionBtnSmall" @click="NavigatePrevContent" title="Previous"
        aria-label="Previous">&#8678;
        Prev</button></div>
    <div class="col-span-2"><button v-if="getCalibrationTabIndex() < 5" class="next actionBtnSmall"
        @click="NavigateNextContent" title="Next" aria-label="Next">Next <span>&#8680;</span></button></div>
  </div>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
const { getMenuIndex, getCalibrationTabIndex, getEvaluationTabIndex, getForecastTabIndex } = generalStore();

const btnSaveOrStart = () => {
  switch (getMenuIndex()) {
    case 1: return getCalibrationTabIndex() < 5 ? "SAVE" : "START"; break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }

};
const btnResetOrStop = () => {
  switch (getMenuIndex()) {
    case 1: return getCalibrationTabIndex() < 5 ? "RESET" : "STOP"; break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

const SaveStartTabContent = async (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonSaveStart', getCalibrationTabIndex() < 5 ? "SAVE" : "START"); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  } 
  console.log("Save/Start Triggered")
}

const ResetStopTabContent = async (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonResetStop', getCalibrationTabIndex() < 5 ? "RESET" : "STOP"); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }

  console.log("Stop/Reset Triggered")
}

const NavigatePrevContent = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonPrev', "PREV"); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
  console.log("PREV Triggered")
}

const NavigateNextContent = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonNext', "NEXT"); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }4
  console.log("NEXT Triggered");
}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#BottomButtons {
  margin-left: 15px;
  color: #ffffff;
  font-weight: bold;
}

.actionBtn {
  display: inline-block;
  width: 95%;
  height: 55px;
  border: 5px solid #59b4c1;
  border-radius: 10px;
  margin-right: 20px;
}

.actionBtnSmall {
  display: inline-block;
  width: 105px;
  height: 55px;
  border-radius: 10px;
  border: 3px solid #59b4c1;
  margin-right: 3px;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.start {
  background-color: #155e29;
}

.stop {
  background-color: #aa0000;
}

.save {
  background-color: #333333;
}

.reset {
  background-color: #000000;
}

.prev {
  background-color: #000000;
  display: inline-block;
}

.next {
  background-color: #000000;
  display: inline-block;
}

.disabled {
  opacity: 0.8;
}
</style>
