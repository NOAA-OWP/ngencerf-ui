<template>
  <div id="BottomButtons" class="flex">
    <div>
      <div class="inline ngenButtonDiv bg-green mr-6" v-show="showOrHideSaveStartButton()">
        <button v-show="showOrHideSaveStartButton()" class="font-normal" @click.stop="SaveStartTabContent"
          :title="btnSaveOrStart() + ' Button'" :aria-label="btnSaveOrStart() + ' Button'">
          {{ btnSaveOrStart() }}</button>
      </div>

      <div class="inline mr-3" v-show="showOrHideResetCancelButton()">
        <button v-show="showOrHideResetCancelButton()" :class="getCalibrationTabIndex() < 6 ? 'reset' : 'cancel'"
          class="c-blue font-normal underline" @click.stop="ResetCancelTabContent" :title="btnResetOrCancel() + 'Button'"
          :aria-label="btnResetOrCancel() + 'Button'">{{ btnResetOrCancel() }}</button>
      </div>
    </div>

    <div class="ml-auto">
      <div class="inline ngenButtonDiv c-gray-md" v-show="getCalibrationTabIndex() > 2 && getCalibrationTabIndex() < 6">
        <button v-show="getCalibrationTabIndex() > 2 && getCalibrationTabIndex() < 6"
          class="prev actionBtnSmall font-normal" @click.stop="NavigatePrevContent" title="Previous"
          aria-label="Previous">Prev</button>
      </div>
      <div v-show="getCalibrationTabIndex() < 6" class="inline ngenButtonDiv ml-6"><button
          v-show="getCalibrationTabIndex() < 6" class="font-normal" @click.stop="NavigateNextContent" title="Next"
          aria-label="Next">Next</button></div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
import { useRunStatusStore } from "~/stores/calibration/RunStatusStore";

const { getMenuIndex, getCalibrationTabIndex, getEvaluationTabIndex, getForecastTabIndex } = generalStore();

const runStatusStore = useRunStatusStore();
const { calibrationStatus } = storeToRefs(runStatusStore);

const btnSaveOrStart = () => {
  switch (getMenuIndex()) {
    case 1: return getCalibrationTabIndex() < 6 ? "SAVE" : "START"; break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

const btnResetOrCancel = () => {
  switch (getMenuIndex()) {
    case 1: return getCalibrationTabIndex() < 6 ? "RESET" : "CANCEL"; break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

const SaveStartTabContent = async (e: MouseEvent) => {
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonSaveStart', getCalibrationTabIndex() < 6 ? "SAVE" : "START"); emitterOff('calibrationButtonSaveStart'); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

const ResetCancelTabContent = async (e: MouseEvent) => {
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonResetCancel', getCalibrationTabIndex() < 6 ? "RESET" : "CANCEL"); emitterOff('calibrationButtonResetCancel'); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

const NavigatePrevContent = (e: MouseEvent) => {
  console.log("Previous Click");
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonPrev', "PREV"); emitterOff('calibrationButtonPrev'); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

const NavigateNextContent = (e: MouseEvent) => {
  console.log("Next Click");
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonNext', "NEXT"); emitterOff('calibrationButtonNext'); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

const showOrHideSaveStartButton = (): boolean => {
  if (getCalibrationTabIndex() <= 5) {
    return true;
  }
  else if (getCalibrationTabIndex() === 6) {
    if (calibrationStatus.value === "Done") {
      return false;
    }
    else {
      return true;
    }
  }
  else {
    return false;
  }
};

const showOrHideResetCancelButton = (): boolean => {
  if (getCalibrationTabIndex() < 5) {
    return true;
  }
  else if (getCalibrationTabIndex() === 6) {
    if (calibrationStatus.value === "Done") {
      return false;
    }
    else {
      return true;
    }
  }
  else {
    return false;
  }
};

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#BottomButtons {
  margin-left: 15px;
  color: #ffffff;
  font-weight: bold;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.disabled {
  opacity: 0.8;
}
</style>
