<template>
  <div id="BottomButtons" class="grid grid-cols-12 w-full">
    <div class="col-span-2">
      <button v-if="showOrHideSaveStartButton()" class="save-start actionBtn" @click="SaveStartTabContent"
        :title="btnSaveOrStart() + ' Button'" :aria-label="btnSaveOrStart() + ' Button'">
        {{ btnSaveOrStart() }}</button>
    </div>
    <div class="col-span-2">
      <button v-if="showOrHideResetCancelButton()" :class="getCalibrationTabIndex() < 5 ? 'reset' : 'cancel'"
        class="actionBtn" @click="ResetCancelTabContent" :title="btnResetOrCancel() + 'Button'"
        :aria-label="btnResetOrCancel() + 'Button'">{{ btnResetOrCancel() }}</button>
    </div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-2 text-right"><button v-if="getCalibrationTabIndex() > 1 && getCalibrationTabIndex() < 5"
        class="prev actionBtnSmall" @click="NavigatePrevContent" title="Previous" aria-label="Previous">&#8678;
        Prev</button></div>
    <div class="col-span-2"><button v-if="getCalibrationTabIndex() < 5" class="next actionBtnSmall"
        @click="NavigateNextContent" title="Next" aria-label="Next">Next <span>&#8680;</span></button></div>
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
  console.log("Save/Start Triggered")
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

  console.log("Stop/Reset Triggered")
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
  console.log("PREV Triggered")
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
  console.log("NEXT Triggered");
};

const showOrHideSaveStartButton = (): boolean => {
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

.save-start {
  background-color: #155e29;
}

.cancel {
  background-color: #aa0000;
}

.reset {
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
