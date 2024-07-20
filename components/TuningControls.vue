<template>
  <div>
    <div class="grid grid-rows-12 gap-2">
      <div class="row-span-5">
        <div class="grid grid-cols-2">
          <div class="col-span-1">
            <div id="BoxLeft">
              <div id="BoxTopLeft">
                <span class="tabTitles">Calibration Time Controls</span>
              </div>
              <div id="BoxBottomLeft" class="pt-2">
                <div class="timeBlocks">
                 <div>Simulation Start: <VueDatePicker class="datePickers dp__theme_dark" v-model="simStartTime" time-picker-inline utc format="yyyy-mm-dd  hh:mm" /></div>
                <div>Simulation End: <VueDatePicker class="datePickers dp__theme_dark" v-model="simEndTime" time-picker-inline utc  format="yyyy-mm-dd  hh:mm"/></div>
                <div>Calibration Start: <VueDatePicker class="datePickers dp__theme_dark" v-model="calStartTime" time-picker-inline utc  format="yyyy-mm-dd  hh:mm"/></div>
                <div>Calibration End: <VueDatePicker class="datePickers dp__theme_dark" v-model="calEndTime" time-picker-inline utc format="yyyy-mm-dd  hh:mm" /></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-1">
            <div id="BoxRight">
              <div id="BoxTopRight" class="pt-2">
                <input type="checkbox" id="CheckTheBox" @change="AutoValChecked">Automatic Validation</input>
              </div>
              <div id="BoxBottomRight" class="pt-2">
                <div v-if="!autoValidation" class="tabTitles text-center" >
                    Check the box above<br />to enable Automatic Validation
                </div>
                <div v-else>
                    <div class="timeBlocks">
                 <div>Simulation Start: <VueDatePicker class="datePickers dp__theme_dark" v-model="simStartTime" time-picker-inline utc  format="yyyy-mm-dd  hh:mm"/></div>
                <div>Simulation End: <VueDatePicker class="datePickers dp__theme_dark" v-model="simEndTime" time-picker-inline utc  format="yyyy-mm-dd  hh:mm"/></div>
                <div>Val Start: <VueDatePicker class="datePickers dp__theme_dark" v-model="calStartTime" time-picker-inline utc  format="yyyy-mm-dd  hh:mm"/></div>
                <div>Val End: <VueDatePicker class="datePickers dp__theme_dark" v-model="calEndTime" time-picker-inline utc  format="yyyy-mm-dd  hh:mm"/></div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row-span-2"></div>

      <div class="row-span-5"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const simStartTime = ref();
const simEndTime = ref();
const calStartTime = ref();
const calEndTime = ref();

const autoValidation = ref(false);
const datetime = ref();
const AutoValChecked = () => {
     const ele = <HTMLInputElement>document.getElementById("CheckTheBox");
     autoValidation.value = ele.checked as boolean;
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#BoxLeft {
  margin: 10px 0 0 30px;
}
#BoxTopLeft, #BoxTopRight {
  width: 200px;
  height: 35px;
  background-color: $ngwcp_groupsbkg;
  border-radius: 20px 20px 0 0;
  font-size: .9em;
}    

#BoxTopRight input { 
    width: 20px;
    margin: 2px 0 0 20px;    
}

#BoxBottomLeft , #BoxBottomRight{
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  height: 150px;
  background-color: $ngwcp_groupsbkg;
}

#BoxRight {
  margin: 10px 0 0 50px;
}

.timeBlocks {
    font-size: .8em;
    text-align: right;
    margin-right: 20px;
}

:root .datePickers > div > div:nth-child(2) > div > div:nth-child(1) > div > input
{
    display:none;
}
.datePickers {
    width: 70%;
    display: inline-block;
    border-radius: 20px;
}
.tabTitles {
    padding: 15px;
}

</style>
