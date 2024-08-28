<template>
  <div id="TuningControls">
    <div class="w-full mt-2">
      <div class="text-center mt-1" id="RangeDates">Range: {{ rangeDateFrom }} to {{ rangeDateTo }}</div>
    </div>
    <div class="grid grid-rows-10">
      <div class="row-span-1">
        <div class="grid grid-cols-2">

          <div class="col-span-1">
            <div id="BoxLeft">
              <div id="BoxTopLeft" class="pt-2">
                <span class="tabTitles">Calibration Time Controls</span>
              </div>
              <div id="BoxBottomLeft" class="pt-2">
                <div class="timeBlocks">
                  <div>Simulation Start:
                    <VueDatePicker class="datePickers dp__theme_dark" v-model="simStartTime" time-picker-inline
                      format="yyyy-MM-dd  hh:00" />
                  </div>
                  <div>Simulation End:
                    <VueDatePicker class="datePickers dp__theme_dark" v-model="simEndTime" time-picker-inline
                      format="yyyy-MM-dd  hh:00" />
                  </div>
                  <div>Calibration Start:
                    <VueDatePicker class="datePickers dp__theme_dark" v-model="calStartTime" time-picker-inline
                      format="yyyy-MM-dd  hh:00" />
                  </div>
                  <div>Calibration End:
                    <VueDatePicker class="datePickers dp__theme_dark" v-model="calEndTime" time-picker-inline
                      format="yyyy-MM-dd  hh:00" />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div class="col-span-1">
            <div id="BoxRight">
              <div id="BoxTopRight" class="pt-2" @click="AutoValChecked">
                <input type="checkbox" id="CheckTheBox"></input>
                <label for="CheckTheBox">Automatic Validation</label>
              </div>
              <div id="BoxBottomRight" class="pt-2">
                <div v-if="!autoValidation" class="tabTitles">
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

      <div class="row-span-2">
        <div class="grid grid-rows-2">

          <div class="row-span-1 text-center">
            <div class="grid grid-cols-2">
              <div class="col-span-1 m-auto">

                <div class="text-left ">
                  <div class="mb-2 font-bold">Calibration Tuning Parameters</div>
                  <div class="inline-block text-left">Parameters File (optional):</div><br />
                  <select id="ParamFile" class="varInputs inline-block mt-2">
                    <option value="" selected disabled>...</option>
                  </select>
                  <div id="UploadParams" class="ngenButtonDiv inline ml-3">
                    <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />
                    <button @click="triggerFileInput">UPLOAD</button>
                  </div>
                </div>

                <div class="text-left  mt-5">
                  <div class="inline-block text-left">Name:</div><br />
                  <select id="ParamName" class="varInputs inline-block mt-2" v-model="selectedParameter">
                    <option v-for="param in calibrationTuningParameters" :key="param.parameter" :value="param.parameter">
                      {{ param.parameter }}
                    </option>
                  </select>
                  <div id="UploadParams" class="ngenButtonDiv inline ml-3">
                    <button @click="addParameterToTable">Add / Update</button>
                  </div>
                </div>
              </div>

              <div class="col-span-1 m-auto">
                <div class="">
                  <div class="mb-2 font-bold">Output Variable To Calibrate</div>
                  <div class="mt-2">
                    <select id="OutVar" class="varInputs">
                      <option value="" selected disabled>...</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="TuningDataList">
            <DataTable :value="calibrationTuningDataList" scrollable scroll-height="200px">
              <!-- parameter column, uneditable with light grey background -->
              <Column field="parameter" header="Parameter" sortable>
                <template #body="slotProps">
                  <span style="background-color: lightgrey; padding: 4px; display: block;">
                    {{ slotProps.data.parameter }}
                  </span>
                </template>
              </Column>
              
              <!-- min column, editable -->
              <Column field="min" header="Min" sortable>
                <template #body="slotProps">
                  <input
                    type="text"
                    v-model="slotProps.data.min"
                    style="width: 100%;"
                  />
                </template>
              </Column>

              <!-- max column, editable -->
              <Column field="max" header="Max" sortable>
                <template #body="slotProps">
                  <input
                    type="text"
                    v-model="slotProps.data.max"
                    style="width: 100%;"
                  />
                </template>
              </Column>

              <!-- initValue column, editable -->
              <Column field="initValue" header="Initial Value" sortable>
                <template #body="slotProps">
                  <input
                    type="text"
                    v-model="slotProps.data.initValue"
                    style="width: 100%;"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>

      </div>

      <div class="row-span-6">
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
import { calculateTimeRange, convertTimeZone } from "~/utils/TimeHelpers";
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { makeProtectedApiCall } from '~/composables/UserAuth';
// import { useFileStorage } from 'nuxt-file-storage';
import { useBackendConfig } from "~/composables/UseBackendConfig";

const { ngencerfBaseUrl } = useBackendConfig();

const userDataStore = useUserDataStore();
const tuningStore = useTuningStore();
const { fetchTuningTabData } = tuningStore;
const {
  loadCalibrationRunData,
  loadTuningTabData,
  isDataFetched,
  userCalibrationTimes,
  userCalibrationTuningParameters,
  userOuptutVariableToCalibrate,
} = storeToRefs(tuningStore);

const loading = ref(true);

const simStartTime = ref();
const simEndTime = ref();
const calStartTime = ref();
const calEndTime = ref();

const avSimStartTime = ref();
const avSimEndTime = ref();
const avCalStartTime = ref();
const avCalEndTime = ref();

const autoValidation = ref(false);
const datetime = ref();

const rangeDateFrom = ref();
const rangeDateTo = ref();

const calibrationTuningDataList = ref<any[]>([]);
const calibrationTuningParameters = ref<any[]>([]);
const selectedParameter = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);


onMounted(async () => {
  console.log("onMounted");
  setTimeout(() => {
    loading.value = false;
  }, 500);

  console.log("isDataFetched:", isDataFetched.value);
  if (!isDataFetched.value) {
    await fetchTuningTabData();
  }

  console.log("loadTuningTabData:", loadTuningTabData.value);
  console.log("loadCalibrationRunData:", loadCalibrationRunData.value);
  console.log("calibration_times:", loadCalibrationRunData.value?.calibration_times);

  const calibrationTimes = loadCalibrationRunData.value?.calibration_times;
  if (calibrationTimes) {
    const { rangeStart, rangeEnd } = calculateTimeRange(calibrationTimes);
    rangeDateFrom.value = rangeStart;
    rangeDateTo.value = rangeEnd;
  } else {
    console.log("calibration_times is missing or invalid");
  }

  const timeRange = loadCalibrationRunData.value.time_range;
  if (timeRange && Object.keys(timeRange).length === 0 && timeRange.constructor === Object) {
    console.log("timeRange is null");
    // set timeRange to a test value. timeRange must encompass the entire time range of calibration_times
  } else {
    console.log("timeRange:", timeRange);
  }

  // set the calibration tuning parameters
  const calibrationTuningModules = loadTuningTabData.value?.modules;
  calibrationTuningParameters.value = calibrationTuningModules?.flatMap((module: any) => module.parameters.map((param: any) => ({
    parameter: param.name,
    min: param.minimum,
    max: param.maximum,
    initValue: param.initial_value
  }))) || [];
});

// watch for changes to the simulation and calibration times and handle validation
watch([simStartTime, simEndTime, calStartTime, calEndTime], ([newSimStart, newSimEnd, newCalStart, newCalEnd]) => {
  // convert ISO strings to Date objects
  const simStartDate = new Date(newSimStart);
  const simEndDate = new Date(newSimEnd);
  const calStartDate = new Date(newCalStart);
  const calEndDate = new Date(newCalEnd);

  // convert range dates to Date objects
  const rangeStartDate = new Date(rangeDateFrom.value);
  const rangeEndDate = new Date(rangeDateTo.value);

  // ensure Simulation Start is within timeRange
  if (simStartDate < rangeStartDate || simStartDate > rangeEndDate) {
    alert('Simulation Start must be within the defined time range');
    simStartTime.value = rangeStartDate.toISOString();
  }

  // ensure Simulation End is within timeRange
  if (simEndDate < rangeStartDate || simEndDate > rangeEndDate) {
    alert('Simulation End must be within the defined time range');
    simEndTime.value = new Date(Math.min(rangeEndDate.getTime(), simStartDate.getTime() + 60 * 60 * 1000)).toISOString();
  }

  // ensure Calibration Start is within timeRange
  if (calStartDate < rangeStartDate || calStartDate > rangeEndDate) {
    alert('Calibration Start must be within the defined time range');
    calStartTime.value = new Date(Math.max(rangeStartDate.getTime(), simStartDate.getTime())).toISOString();
  }

  // ensure Calibration End is within timeRange
  if (calEndDate < rangeStartDate || calEndDate > rangeEndDate) {
    alert('Calibration End must be within the defined time range');
    calEndTime.value = new Date(Math.min(rangeEndDate.getTime(), calStartDate.getTime() + 60 * 60 * 1000)).toISOString();
  }

  // ensure Sim end is after Sim start
  if (simEndDate <= simStartDate) {
    alert('Simulation End must be after Simulation Start');
    simEndTime.value = new Date(simStartDate.getTime() + 60 * 60 * 1000).toISOString();
  }

  // ensure Cal start is within Sim start and Sim end
  if (calStartDate < simStartDate || calStartDate > simEndDate) {
    alert('Calibration Start must be within Simulation Start and End');
    calStartTime.value = new Date(Math.max(simStartDate.getTime(), rangeStartDate.getTime())).toISOString();
  }

  // ensure Cal end is after Cal start and within Sim end
  if (calEndDate <= calStartDate || calEndDate > simEndDate) {
    alert('Calibration End must be after Calibration Start and within Simulation End');
    calEndTime.value = new Date(Math.min(simEndDate.getTime(), calStartDate.getTime() + 60 * 60 * 1000)).toISOString();
  }
});

/**
 * Trigger file input dialog
 */
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

/**
 * Handle parameter file upload
 * @param event
 */
const handleFileUpload = async (event: Event) => {
  console.log('Upload button clicked');
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    try {
      const formData = new FormData();
      formData.append('user_parameter_file', file);
      formData.append('calibration_run_id', '6');

      const response: any = await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/upload_user_parameters/`, 
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userDataStore.getAccessToken()}`,
          },
          body: formData,
        });

      if (response) {
        console.log('File uploaded successfully:', response);
        // Populate the Parameter table with the data from user-uploaded file
        response.user_parameter_file.forEach((param: any) => {
          calibrationTuningDataList.value.push({
            parameter: param.param,
            min: param.min,
            max: param.max,
            initValue: param.init,
          });
        })
      }
    } catch (error) {
      console.error('File upload failed:', error);
    }
  } else {
    console.error('No file selected');
  }
};

/**
 * Add selected calibration tuning parameter to the table when Add / Update button is clicked
 */
const addParameterToTable = () => {
  const parameter = calibrationTuningParameters.value.find(param => param.parameter === selectedParameter.value);
  if (parameter) {
    calibrationTuningDataList.value.push({
      parameter: parameter.parameter,
      min: parameter.min,
      max: parameter.max,
      initValue: parameter.initValue,
    });
  }
};


const AutoValChecked = () => {
  const ele = <HTMLInputElement>document.getElementById("CheckTheBox");
  autoValidation.value = ele.checked as boolean;
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#TuningControls {
  margin-left: 10px;
  width: 60vw;
}

#BoxLeft,
#BoxRight {
  width: 400px;
  margin-left: auto;
  margin-right: auto;
}

#BoxTopLeft,
#BoxTopRight {
  width: 200px;
  height: 35px;
  background-color: $ngwcp_groupsbkg;
  font-size: 0.9em;
}

#BoxTopLeft {
  border-radius: 20px 20px 0 0;
}

#BoxTopRight {
  margin-left: 200px;
  border-radius: 20px 20px 0 0;
}

#BoxTopRight input {
  width: 20px;
  margin: 2px 0 0 20px;
}

#BoxBottomLeft,
#BoxBottomRight {
  border-radius: 0 20px 20px 20px;
  height: 150px;
  background-color: $ngwcp_groupsbkg;
}

#BoxBottomRight {
  border-radius: 20px 0 20px 20px;
}

#AddUpdateBtn {
  height: 40px;
}

#TuningDataList {
  margin: 0 auto;
  width: 750px;
  border: 1px solid black;
  padding: 8px;
}


.mup30 {
  margin-top: -140px;
}

.timeBlocks {
  font-size: 0.8em;
  text-align: right;
  margin-right: 34px;
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
  width: 220px;
}

input,
select {
  border-radius: 5px;
}

</style>
