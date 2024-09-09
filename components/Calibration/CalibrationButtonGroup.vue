<template>
  <div id="BottomButtons" class="grid grid-cols-12 w-full">
    <div class="col-span-2">
      <button v-if="getCalibrationTabIndex() < 6" class="start actionBtn" @click="SaveStartTabContent">{{ getCalibrationTabIndex() < 5 ? "SAVE" : "START" }}</button>
    </div>
    <div class="col-span-2">
      <button v-if="getCalibrationTabIndex() < 6" :class="getCalibrationTabIndex() < 5 ? 'save' : 'stop'" class="actionBtn" @click="ResetStopTabContent">{{ getCalibrationTabIndex() < 5 ? "RESET" : "STOP" }}</button>
    </div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-2 text-right"><button class="prev actionBtnSmall" @click="NavigatePrevContent">&#8678; Prev</button></div>
    <div class="col-span-2"><button v-if="getCalibrationTabIndex() < 6" class="next actionBtnSmall" @click="NavigateNextContent">Next <span>&#8680;</span></button></div>
  </div>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
//import { useToast } from "primevue/usetoast";
const { getCalibrationTabIndex } = generalStore();

const tabIndex = getCalibrationTabIndex();
//const toast = useToast();

const SaveStartTabContent =  async () => {  
  useEvent( 'calibrationButtonSaveStart', getCalibrationTabIndex() < 5 ? "SAVE" : "START" )
}

const ResetStopTabContent = async () => {
  useEvent( 'calibrationButtonResetStop', getCalibrationTabIndex() < 5 ? "RESET" : "STOP" )
}

const NavigatePrevContent = () => {
  useEvent( 'calibrationButtonPrev', "PREV" )
}

const NavigateNextContent = () => {
  useEvent( 'calibrationButtonNext', "NEXT" )
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
