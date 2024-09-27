<template>
  <div id="BottomButtons" class="flex">
    <div>
      <div class="inline ngenButtonDiv bg-green mr-6" v-if="showOrHideSaveStartButton()">
        <button v-if="showOrHideSaveStartButton()" class="font-normal" @click="SaveStartTabContent"
          :title="btnSaveOrStart() + ' Button'" :aria-label="btnSaveOrStart() + ' Button'">
          {{ btnSaveOrStart() }}</button>
      </div>

      <div class="inline mr-3" v-if="showOrHideResetCancelButton()">
        <button v-if="showOrHideResetCancelButton()" :class="getCalibrationTabIndex() < 5 ? 'reset' : 'cancel'"
          class="c-blue font-normal underline" @click="ResetCancelTabContent" :title="btnResetOrCancel() + 'Button'"
          :aria-label="btnResetOrCancel() + 'Button'">{{ btnResetOrCancel() }}</button>
      </div>
    </div>

    <div class="ml-auto">
      <div class="inline ngenButtonDiv c-gray-md" v-if="getCalibrationTabIndex() > 1 && getCalibrationTabIndex() < 5">
        <button v-if="getCalibrationTabIndex() > 1 && getCalibrationTabIndex() < 5"
          class="prev actionBtnSmall font-normal" @click="NavigatePrevContent" title="Previous"
          aria-label="Previous">Prev</button>
      </div>
      <div v-if="getCalibrationTabIndex() < 5" class="inline ngenButtonDiv ml-6"><button
          v-if="getCalibrationTabIndex() < 5" class="font-normal" @click="NavigateNextContent" title="Next"
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
    case 1: return getCalibrationTabIndex() < 5 ? "SAVE" : "START"; break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

const btnResetOrCancel = () => {
  switch (getMenuIndex()) {
    case 1: return getCalibrationTabIndex() < 5 ? "RESET" : "CANCEL"; break;
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
};

const ResetCancelTabContent = async (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonResetCancel', getCalibrationTabIndex() < 5 ? "RESET" : "CANCEL"); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

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
};

const NavigateNextContent = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  switch (getMenuIndex()) {
    case 1: useEvent('calibrationButtonNext', "NEXT"); break;
    case 2: break;
    case 3: break;
    case 4: break;
    default: break;
  }
};

const showOrHideSaveStartButton = (): boolean => {
  if (getCalibrationTabIndex() <= 4) {
    return true;
  }
  else if (getCalibrationTabIndex() === 5) {
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
  if (getCalibrationTabIndex() < 4) {
    return true;
  }
  else if (getCalibrationTabIndex() === 5) {
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
