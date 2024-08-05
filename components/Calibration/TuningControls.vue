<template>
  <div id="TuningControls">
    <div class="grid grid-rows-12 gap-2">
      <div class="row-span-4">
        <div class="grid grid-cols-2">
          <div class="col-span-1">
            <div id="BoxLeft">
              <div id="BoxTopLeft">
                <span class="tabTitles">Calibration Time Controls</span>
              </div>
              <div id="BoxBottomLeft" class="pt-2">
                <div class="timeBlocks">
                  <div>Simulation Start:
                    <VueDatePicker class="datePickers dp__theme_dark" v-model="simStartTime" time-picker-inline utc
                      format="yyyy-mm-dd  hh:mm" />
                  </div>
                  <div>Simulation End:
                    <VueDatePicker class="datePickers dp__theme_dark" v-model="simEndTime" time-picker-inline utc
                      format="yyyy-mm-dd  hh:mm" />
                  </div>
                  <div>Calibration Start:
                    <VueDatePicker class="datePickers dp__theme_dark" v-model="calStartTime" time-picker-inline utc
                      format="yyyy-mm-dd  hh:mm" />
                  </div>
                  <div>Calibration End:
                    <VueDatePicker class="datePickers dp__theme_dark" v-model="calEndTime" time-picker-inline utc
                      format="yyyy-mm-dd  hh:mm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-1">
            <div id="BoxRight">
              <div id="BoxTopRight" class="pt-2">
                <input type="checkbox" id="CheckTheBox" v-on:change="AutoValChecked"></input>
                <label for="CheckTheBox">Automatic Validation</label>
              </div>
              <div id="BoxBottomRight" class="pt-2">
                <div v-if="!autoValidation" class="tabTitles text-center">
                  Check the box above<br />to enable Automatic Validation
                </div>
                <div v-else>
                  <div class="timeBlocks">
                    <div>
                      Simulation Start:
                      <VueDatePicker class="datePickers dp__theme_dark" v-model="avSimStartTime" time-picker-inline utc
                        format="yyyy-mm-dd  hh:mm" />
                    </div>
                    <div>
                      Simulation End:
                      <VueDatePicker class="datePickers dp__theme_dark" v-model="avSimEndTime" time-picker-inline utc
                        format="yyyy-mm-dd  hh:mm" />
                    </div>
                    <div>
                      Val Start:
                      <VueDatePicker class="datePickers dp__theme_dark" v-model="avCalStartTime" time-picker-inline utc
                        format="yyyy-mm-dd  hh:mm" />
                    </div>
                    <div>
                      Val End:
                      <VueDatePicker class="datePickers dp__theme_dark" v-model="avCalEndTime" time-picker-inline utc
                        format="yyyy-mm-dd  hh:mm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row-span-3 mt-3">
        <div class="grid grid-rows-2">
          <div class="row-span-1 text-center">
            <div class="grid grid-cols-2">
              <div class="col-span-1">
                <label for="OutVar">Output Variable to Calibrate</label><br />
                <select id="OutVar" class="varInputs">
                  <option value="" selected disabled>...</option>
                </select>
              </div>
              <div class="col-span-1">
                <label for="TuningParam">Tuning Parameter</label><br />
                Name:
                <select id="TuningParam" class="varInputs">
                  <option value="" selected disabled>...</option>
                </select>
                &nbsp;
                <div id="AddUpdateBtn" class="inline ngenButtonDiv">
                  <button> Add / Update </button>
                </div>
              </div>
            </div>
          </div>

          <div class="row-span-1 mt-4">
            <div class="grid grid-cols-6">
              <div class="col-span-3">&nbsp;</div>
              <div class="col-span-1">Min: <input class="mmiInputs" type="number" id="tpMin" /></div>
              <div class="col-span-1">Max: <input class="mmiInputs" type="number" id="tpMax" /></div>
              <div class="col-span-1">Initial: <input class="mmiInputs" type="number" id="tpInitial" /></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-span-5">
        <div id="TuningDataList">
          <DataTable :value="calibrationTuningDataList" scrollable scroll-height="300px">
            <Column field="parameter" header="Parameter" sortable></Column>
            <Column field="min" header="Min" sortable></Column>
            <Column field="max" header="Max" sortable></Column>
            <Column field="initValue" header="Initial Value" sortable></Column>
          </DataTable>
        </div>
      </div>
    </div>
    <div class="waitgif" v-if="loading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { mockCalibrationTuningData } from "~/mockApi/calibrationAPIData";
import type { CalibrationTuningData } from "~/composables/NextGenModel";

const loading = ref(true);

const simStartTime = ref();
const simEndTime = ref();
const calStartTime = ref();
const calEndTime = ref();
20
const avSimStartTime = ref();
const avSimEndTime = ref();
const avCalStartTime = ref();
const avCalEndTime = ref();

const autoValidation = ref(false);
const datetime = ref();

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});

const AutoValChecked = () => {
  const ele = <HTMLInputElement>document.getElementById("CheckTheBox");
  autoValidation.value = ele.checked as boolean;
};

const calibrationTuningDataList = ref<CalibrationTuningData[]>([])

onMounted(() => {
  mockCalibrationTuningData().forEach((tuningData, index) => {
    calibrationTuningDataList.value.push(<CalibrationTuningData>tuningData)
  })
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#TuningControls {
  margin-left: 10px;
  width: 60vw;
}

#BoxLeft {
  margin: 10px 0 0 30px;
}

#BoxTopLeft,
#BoxTopRight {
  width: 200px;
  height: 35px;
  background-color: $ngwcp_groupsbkg;
  border-radius: 20px 20px 0 0;
  font-size: 0.9em;
}

#BoxTopRight input {
  width: 20px;
  margin: 2px 0 0 20px;
}

#BoxBottomLeft,
#BoxBottomRight {
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  height: 150px;
  background-color: $ngwcp_groupsbkg;
}

#BoxRight {
  margin: 10px 0 0 50px;
}

#AddUpdateBtn {
  height: 40px;
}

#TuningDataList {
  margin: 0 auto;
  width: 750px;
}

.timeBlocks {
  font-size: 0.8em;
  text-align: right;
  margin-right: 20px;

}

.datePickers {
  width: 250px;
  display: inline-block;
  border-radius: 5px;
}

.tabTitles {
  padding: 15px;
}

.mmiInputs {
  width: 100px;
}

.varInputs {
  width: 280px;
}

input,
select {
  border-radius: 5px;
}
</style>
