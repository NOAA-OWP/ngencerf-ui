<template>
  <div id="TuningControls">
    <div class="w-full mt-2">
      <div v-if="rangeDateFrom && rangeDateTo" class="text-center mt-1" id="RangeDates" >
        Range: {{ rangeDateFrom }} to {{ rangeDateTo }}
      </div>
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
                <div class="timeBlocks datepicker-wrapper" @click="handleCalibrationTimeControlsClick">
                  <div>Simulation Start:
                    <VueDatePicker 
                      class="datePickers dp__theme_dark" 
                      v-model="simStartTime" 
                      time-picker-inline
                      format="yyyy-MM-dd  hh:00"
                      :disabled="isCalibrationTuningControlsDisabled"
                    />
                    <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                  </div>
                  <div>Simulation End:
                    <VueDatePicker 
                      class="datePickers dp__theme_dark" 
                      v-model="simEndTime" 
                      time-picker-inline
                      format="yyyy-MM-dd  hh:00"
                      :disabled="isCalibrationTuningControlsDisabled"
                    />
                    <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                  </div>
                  <div>Calibration Start:
                    <VueDatePicker 
                      class="datePickers dp__theme_dark" 
                      v-model="calStartTime" 
                      time-picker-inline
                      format="yyyy-MM-dd  hh:00"
                      :disabled="isCalibrationTuningControlsDisabled"
                    />
                    <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                  </div>
                  <div>Calibration End:
                    <VueDatePicker 
                      class="datePickers dp__theme_dark" 
                      v-model="calEndTime" 
                      time-picker-inline
                      format="yyyy-MM-dd  hh:00"
                      :disabled="isCalibrationTuningControlsDisabled"
                    />
                    <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
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
                <div v-if="!automatic_validation" class="tabTitles">
                  Check the box above<br />to enable Automatic Validation
                </div>
                <div v-else>
                  <div class="timeBlocks datepicker-wrapper" @click="handleCalibrationTimeControlsClick">
                    <div>
                      Simulation Start:
                      <VueDatePicker class="datePickers dp__theme_dark" v-model="avSimStartTime" time-picker-inline
                        format="yyyy-MM-dd  hh:00" :disabled="isCalibrationTuningControlsDisabled" />
                      <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                    </div>
                    <div>
                      Simulation End:
                      <VueDatePicker class="datePickers dp__theme_dark" v-model="avSimEndTime" time-picker-inline
                        format="yyyy-MM-dd  hh:00" :disabled="isCalibrationTuningControlsDisabled" />
                      <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                    </div>
                    <div>
                      Val Start:
                      <VueDatePicker class="datePickers dp__theme_dark" v-model="avCalStartTime" time-picker-inline
                        format="yyyy-MM-dd  hh:00" :disabled="isCalibrationTuningControlsDisabled" />
                      <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                    </div>
                    <div>
                      Val End:
                      <VueDatePicker class="datePickers dp__theme_dark" v-model="avCalEndTime" time-picker-inline
                        format="yyyy-MM-dd  hh:00" :disabled="isCalibrationTuningControlsDisabled" />
                      <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
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
                    <option v-for="param in calibrationTuningParameters" :key="param.name" :value="param.name">
                      {{ param.name }}
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
                    <select id="OutVar" class="varInputs" v-model="selectedOutputVariable">
                      <option v-for="outputVariable in outputVariables" :key="outputVariable.name" :value="outputVariable.name">
                        {{ outputVariable.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="TuningDataList">
            <DataTable :value="userCalibrationTuningParameters" scrollable scroll-height="200px">
              <!-- parameter column, uneditable with light grey background -->
              <Column field="parameter" header="Parameter" sortable>
                <template #body="slotProps">
                  <span style="background-color: lightgrey; padding: 4px; display: block;">
                    {{ slotProps.data.name }}
                  </span>
                </template>
              </Column>
              
              <!-- min column, editable -->
              <Column field="min" header="Min" sortable>
                <template #body="slotProps">
                  <input
                    type="text"
                    v-model="slotProps.data.minimum"
                    @input="updateCalibrationTuningParameter(slotProps.index, 'minimum', $event?.target?.value)"
                    style="width: 100%;"
                  />
                </template>
              </Column>

              <!-- max column, editable -->
              <Column field="max" header="Max" sortable>
                <template #body="slotProps">
                  <input
                    type="text"
                    v-model="slotProps.data.maximum"
                    @input="updateCalibrationTuningParameter(slotProps.index, 'maximum', $event?.target?.value)"
                    style="width: 100%;"
                  />
                </template>
              </Column>

              <!-- initValue column, editable -->
              <Column field="initValue" header="Initial Value" sortable>
                <template #body="slotProps">
                  <input
                    type="text"
                    v-model="slotProps.data.initial_value"
                    @input="updateCalibrationTuningParameter(slotProps.index, 'initial_value', $event?.target?.value)"
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
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import { mockCalibrationTuningData } from "~/mockApi/calibrationAPIData";
import type { CalibrationTuningData } from "~/composables/NextGenModel";
import { calculateTimeRange, convertTimeZone } from "~/utils/TimeHelpers";
import { generalStore } from "~/stores/common/GeneralStore";
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { makeProtectedApiCall } from '~/composables/UserAuth';
import { useBackendConfig } from "~/composables/UseBackendConfig";

const toast = useToast();

const { calibrationJobId } = storeToRefs( generalStore() );
const { getCalibrationTabIndex } = generalStore();
const { ngencerfBaseUrl } = useBackendConfig();

const userDataStore = useUserDataStore();
const tuningStore = useTuningStore();
const { fetchTuningTabData, postSaveTuningTabData } = tuningStore;
const {
  loadCalibrationRunData,
  loadTuningTabData,
  isDataFetched,
  simStartTime,
  simEndTime,
  calStartTime,
  calEndTime,
  userCalibrationTimes,
  userCalibrationTuningParameters,
  userOutputVariableToCalibrate,
  outputVariables,
  automatic_validation,
  avSimStartTime,
  avSimEndTime,
  avCalStartTime,
  avCalEndTime,
  userValidationTimes,
  rangeDateFrom,
  rangeDateTo,
} = storeToRefs(tuningStore);

const loading = ref(true);

const calibrationTuningParameters = ref<any[]>([]);
const selectedParameter = ref<any>(null);
const selectedOutputVariable = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isCalibrationTuningControlsDisabled = computed(() => {
  return !loadCalibrationRunData.value?.calibration_times || Object.keys(loadCalibrationRunData.value?.calibration_times).length === 0;
});

onMounted(async () => {
  console.log("onMounted");

  console.log("isDataFetched:", isDataFetched.value);
  if (!isDataFetched.value) {
    console.log("fetching Tuning Tab Data...");
    await fetchTuningTabData(); // only fetch data if not already fetched
  }

  console.log("loadTuningTabData:", loadTuningTabData.value);
  console.log("loadCalibrationRunData:", loadCalibrationRunData.value);
  console.log("calibration_times:", loadCalibrationRunData.value?.calibration_times);
  console.log("validation_times:", loadCalibrationRunData.value?.validation_times);
  console.log("time_range:", loadCalibrationRunData.value?.time_range);

  // set calibration times
  if (loadCalibrationRunData.value?.calibration_times) {
    const { simulation_start_time, simulation_end_time, calibration_start_time,  calibration_end_time } = loadCalibrationRunData.value.calibration_times;
    simStartTime.value = simulation_start_time;
    simEndTime.value = simulation_end_time;
    calStartTime.value = calibration_start_time;
    calEndTime.value = calibration_end_time;
  };

  // set automatic validation times
  if (loadCalibrationRunData.value?.validation_times) {
    const { simulation_start_time, simulation_end_time, validation_start_time, validation_end_time } = loadCalibrationRunData.value.validation_times;
    
    avSimStartTime.value = simulation_start_time;
    avSimEndTime.value = simulation_end_time;
    avCalStartTime.value = validation_start_time;
    avCalEndTime.value = validation_end_time;
  };

  // set time range
  const timeRange = loadCalibrationRunData.value?.time_range;

  // check if timeRange is provided and not empty
  if (timeRange && timeRange.constructor === Object && Object.keys(timeRange).length > 0) {
    rangeDateFrom.value = timeRange?.start_time;
    rangeDateTo.value = timeRange?.end_time;
  } else {
    // timeRange not provided. set timeRange one month before and after the calibration times
    console.log("timeRange is null");
    const { rangeStart, rangeEnd } = calculateTimeRange(userCalibrationTimes);
    rangeDateFrom.value = rangeStart;
    rangeDateTo.value = rangeEnd;
  }

  if (isCalibrationTuningControlsDisabled) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration times are missing or empty', life: 10000 });
  }

  const calibrationTuningModules = loadTuningTabData.value?.modules;

  // set the calibration tuning parameters
  calibrationTuningParameters.value = calibrationTuningModules?.flatMap((module: any) => module.parameters.map((param: any) => ({
    name: param.name,
    minimum: param.minimum,
    maximum: param.maximum,
    initial_value: param.initial_value,
    module: module.name,
  }))) || [];
  console.log("userCalibrationTuningParameters:", calibrationTuningParameters.value);

  // set output variables to calibrate
  outputVariables.value = calibrationTuningModules?.flatMap((module: any) => module.output_variables.map((outputVar: any) => ({
    name: outputVar.name,
    description: outputVar.description,
    module: module.name,
  }))) || [];

  // set ouputvariable_to_calibrate
  if (loadCalibrationRunData.value.output_variable_to_calibrate) {
    const { name, module } = loadCalibrationRunData.value.output_variable_to_calibrate;
    userOutputVariableToCalibrate.value.name = name;
    userOutputVariableToCalibrate.value.module = module;
    selectedOutputVariable.value = name;
  };
});

const handleCalibrationTimeControlsClick = (event: Event) => {
  if (isCalibrationTuningControlsDisabled) {
    event.preventDefault(); // Prevent any default action
    toast.add({ severity: 'warn', summary: 'Calibration Tuning Controls disabled', detail: 'You cannot interact with time controls as calibration_times are not set.', life: 10000 });
  }
}

// watch for changes to the simulation and calibration times and handle validation
watch([simStartTime, simEndTime, calStartTime, calEndTime], () => {
  // convert ISO strings to Date objects
  const simStartDate = simStartTime.value ? new Date(simStartTime.value) : null;
  const simEndDate = simEndTime.value ? new Date(simEndTime.value) : null;
  const calStartDate = calStartTime.value ? new Date(calStartTime.value) : null;
  const calEndDate = calEndTime.value ? new Date(calEndTime.value) : null;

  if (simStartDate !== null || simEndDate !== null || calStartDate !== null || calEndDate !== null) {
    // convert range dates to Date objects
    const rangeStartDate = new Date(rangeDateFrom.value);
    const rangeEndDate = new Date(rangeDateTo.value);

    // ensure Simulation Start is within timeRange
    if (simStartDate !== null && (simStartDate < rangeStartDate || simStartDate > rangeEndDate)) {
      alert('Simulation Start must be within the defined time range');
      simStartTime.value = rangeStartDate.toISOString();
    }

    // ensure Simulation End is within timeRange
    if (simStartDate !== null && simEndDate !== null && (simEndDate < rangeStartDate || simEndDate > rangeEndDate)) {
      alert('Simulation Start mucs be selected first and Simulation End must be within the defined time range');
      simEndTime.value = new Date(Math.min(rangeEndDate.getTime(), simStartDate.getTime() + 60 * 60 * 1000)).toISOString();
    }

    // ensure Calibration Start is within timeRange
    if (simStartDate !== null &&  calStartDate !== null && (calStartDate < rangeStartDate || calStartDate > rangeEndDate)) {
      alert('Simulation Start must be selected first and Calibration Start must be within the defined time range');
      calStartTime.value = new Date(Math.max(rangeStartDate.getTime(), simStartDate.getTime())).toISOString();
    }

    // ensure Calibration End is within timeRange
    if (calStartDate !== null && calEndDate !== null && (calEndDate < rangeStartDate || calEndDate > rangeEndDate)) {
      alert('Calibration Start must be selected first and Calibration End must be within the defined time range');
      calEndTime.value = new Date(Math.min(rangeEndDate.getTime(), calStartDate.getTime() + 60 * 60 * 1000)).toISOString();
    }

    // ensure Sim end is after Sim start
    if (simStartDate !== null && simEndDate !== null && (simEndDate <= simStartDate) ){
      alert('Simulation End must be after Simulation Start');
      simEndTime.value = new Date(simStartDate.getTime() + 60 * 60 * 1000).toISOString();
    }

    // ensure Cal start is within Sim start and Sim end
    if (calStartDate !== null && simStartDate !== null && simEndDate !== null && (calStartDate < simStartDate || calStartDate > simEndDate)) {
      alert('Simulation Start must be selected first and Calibration Start must be within Simulation Start and End');
      calStartTime.value = new Date(Math.max(simStartDate.getTime(), rangeStartDate.getTime())).toISOString();
    }

    // ensure Cal end is after Cal start and within Sim end
    if (calEndDate !== null && calStartDate !== null && simEndDate !== null && (calEndDate <= calStartDate || calEndDate > simEndDate)) {
      alert('Calibration End must be after Calibration Start and within Simulation End');
      calEndTime.value = new Date(Math.min(simEndDate.getTime(), calStartDate.getTime() + 60 * 60 * 1000)).toISOString();
    }

    // save times in userCalibrationTimes
    simStartTime.value = simStartDate instanceof Date && !isNaN(simStartDate.getTime()) ? simStartDate.toISOString() : "";
    simEndTime.value = simEndDate instanceof Date && !isNaN(simEndDate.getTime()) ? simEndDate.toISOString() : "";
    calStartTime.value = calStartDate instanceof Date && !isNaN(calStartDate.getTime()) ? calStartDate.toISOString() : "";
    calEndTime.value = calEndDate instanceof Date && !isNaN(calEndDate.getTime()) ? calEndDate.toISOString() : "";
    console.log("userCalibrationTimes:", userCalibrationTimes);
  }
});

// watch for changes to selected output variable
watch(selectedOutputVariable, () => {
  const module = loadTuningTabData.value?.modules.find((module: any) => module.output_variables.find((outputVar: any) => outputVar.name === selectedOutputVariable.value));
  //console.log("module:", module);
  userOutputVariableToCalibrate.value = {
    name: selectedOutputVariable.value,
    module: module.name,
  }
  //console.log("selectedOutputVariable:", selectedOutputVariable.value);
  //console.log("userOutputVariableToCalibrate:", userOutputVariableToCalibrate.value);
});

// watch for changes to automatic automatic validation times and handle validation
watch([avSimStartTime, avSimEndTime, avCalStartTime, avCalEndTime], () => {
  // Calibration time controls must be set before Automatic Validation times
  if (!simStartTime.value || !simEndTime.value || !calStartTime.value || !calEndTime.value) {
    // TODO: don't empty values but prevent user from setting Automatic Validation times
    toast.add({ severity: 'error', summary: 'Error', detail: 'Calibration Time Controls must be set before Automatic Validation times', life: 10000 });

  } else {
    // convert ISO strings to Date objects
    const avSimStartDate = avSimStartTime.value ? new Date(avSimStartTime.value) : null;
    const avSimEndDate = avSimEndTime.value ? new Date(avSimEndTime.value) : null;
    const avCalStartDate = avCalStartTime.value ? new Date(avCalStartTime.value) : null;
    const avCalEndDate = avCalEndTime.value ? new Date(avCalEndTime.value) : null;

    if (avSimStartDate !== null || avSimEndDate !== null || avCalStartDate !== null || avCalEndDate !== null) {
      // convert range dates to Date objects
      const rangeStartDate = new Date(rangeDateFrom.value);
      const rangeEndDate = new Date(rangeDateTo.value);

      const simStartDate = simStartTime.value ? new Date(simStartTime.value) : null;
      const simEndDate = simEndTime.value ? new Date(simEndTime.value) : null;
      const calStartDate = calStartTime.value ? new Date(calStartTime.value) : null;

      // all av times need to be after simStartDate and simEndDate
      if (avSimStartDate && avSimEndDate && avCalStartDate && avCalEndDate && simEndDate && 
        (avSimStartDate <= simEndDate && avSimEndDate <= simEndDate && avCalStartDate <= simEndDate && avCalEndDate <= simEndDate)) {
        alert('All Automatic Validation times must be after Simulation Start and before Simulation End');
      }

      // avSimEndDate must be after avSimStartDate
      if (avSimStartDate && avSimEndDate && avSimEndDate <= avSimStartDate) {
        alert('Automatic Validation Simulation End must be after Simulation Start');
        avSimEndTime.value = new Date(avSimStartDate.getTime() + 60 * 60 * 1000).toISOString();
      }

      //avCalStartDate must be greater or equal to avSimStartDate and less than or equal to avSimEndDate
      if (avSimStartDate && avSimEndDate && avCalStartDate && (avCalStartDate < avSimStartDate || avCalStartDate > avSimEndDate)) {
        alert('Automatic Validation Calibration Start must be within Simulation Start and End');
        avCalStartTime.value = new Date(Math.max(avSimStartDate.getTime(), rangeStartDate.getTime())).toISOString();
      }

      // avCalEndDate must be greater to calStartDate and less than or equal to avSimEndDate
      if (avSimStartDate && avSimEndDate && calStartDate && avCalEndDate && (avCalEndDate <= calStartDate || avCalEndDate > avSimEndDate)) {
        alert('Automatic Validation Calibration End must be after Calibration Start and less than or eqaul to Automatic Validation Simulation End');
        avCalEndTime.value = new Date(Math.min(avSimEndDate.getTime(), calStartDate.getTime() + 60 * 60 * 1000)).toISOString();
      }
    }
    // save times in userValidationTimes
    avSimStartTime.value = avSimStartDate instanceof Date && !isNaN(avSimStartDate.getTime()) ? avSimStartDate.toISOString() : "";
    avSimEndTime.value =  avSimEndDate instanceof Date && !isNaN(avSimEndDate.getTime()) ? avSimEndDate.toISOString() : "";
    avCalStartTime.value =  avCalStartDate instanceof Date && !isNaN(avCalStartDate.getTime()) ? avCalStartDate.toISOString() : "";
    avCalEndTime.value =  avCalEndDate instanceof Date && !isNaN(avCalEndDate.getTime()) ? avCalEndDate.toISOString() : "";
    console.log("userValidationTimes:", userValidationTimes);
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
  //console.log('Upload button clicked');
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    try {
      const formData = new FormData();
      formData.append('user_parameter_file', file);
      formData.append('calibration_run_id', String(calibrationJobId.value));

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
        // Populate the Parameter table with the data from user-uploaded file
        response.user_parameter_file.forEach((param: any) => {
          userCalibrationTuningParameters?.value.push({
            name: param.param,
            minimum: param.min,
            maximum: param.max,
            initial_value: param.init,
            module: param.model, // module?
          });
        });
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'File upload failed', life: 10000 });
      console.error('File upload failed:', error);
    }
  } else {
    toast.add({ severity: 'error', summary: 'No file selected', life: 10000 });
    console.error('No file selected');
  }
};

/**
 * Add selected calibration tuning parameter to the table when Add / Update button is clicked
 */
const addParameterToTable = () => {
  const parameter = calibrationTuningParameters?.value?.find(param => param.name === selectedParameter.value);
  if (parameter) {
    userCalibrationTuningParameters.value.push({
      name: parameter.name,
      minimum: parameter.minimum,
      maximum: parameter.maximum,
      initial_value: parameter.initial_value,
      module: parameter.module,
    });
  }
};

/**
 * Update Calibration Tuning Parameter with new value
 * @param index The index of the item being updated
 * @param field The field ('min', 'max', or 'initValue') being updated
 * @param value The new value entered by the user
 */
 const updateCalibrationTuningParameter = (index: number, field: string, value: string) => {
  userCalibrationTuningParameters.value[index][field] = value; // this just tracks the data in the table and still needs to be added to calibrationTuningParameters
  //console.log("updated userCalibrationTuningParameters:", userCalibrationTuningParameters.value);

  // update the calibrationTuningParameters with the new values
  const parameter = calibrationTuningParameters?.value?.find(param => param.name === userCalibrationTuningParameters.value[index].name);
  if (parameter) {
    if (field === 'minimum') {
      parameter.minimum = value;
    } else if (field === 'maximum') {
      parameter.maximum = value;
    } else if (field === 'initial_value') {
      parameter.initial_value = value;
    }
  }
  //console.log("updated calibrationTuningParameters:", calibrationTuningParameters.value);
};

/**
 * Delete Calibration Tuning Parameter from the table and calibrationTuningParameters
 * @param index The index of the row to be deleted
 */
// const deleteCalibrationTuningParameter = (index: number) => {
//   // remove the parameter from userCalibrationTuningParameters and table
//   const parameter = userCalibrationTuningParameters.value[index].name;
//   console.log("deleting parameter:", parameter);
//   userCalibrationTuningParameters.value.splice(index, 1);
//   console.log("updated userCalibrationTuningParameters:", userCalibrationTuningParameters.value);

//   // remove the parameter from calibrationTuningParameters
//   const paramIndex = calibrationTuningParameters?.value?.findIndex(param => param.name === parameter);
//   if (paramIndex && paramIndex > -1) {
//     calibrationTuningParameters?.value?.splice(paramIndex, 1);
//   }
//   console.log("updated calibrationTuningParameters:", calibrationTuningParameters.value);
// };

/**
 * Handle automatic validation checkbox change
 */
const AutoValChecked = () => {
  const ele = <HTMLInputElement>document.getElementById("CheckTheBox");
  automatic_validation.value = ele.checked as boolean;
  // //console.log("automatic_validation:", automatic_validation.value);
};

/**
 * event bus for save click
 */
 useListen( 'calibrationButtonGroup:buttonClick', ( actionButton ) => {
   if( getCalibrationTabIndex() === 3 && actionButton == 'SAVE' ) {
      const saveTuningTabResponse = postSaveTuningTabData()
      console.log( `saveTabContent Tuning, should be tabIndex 3, on tabIndex ${getCalibrationTabIndex()}, save response: `, saveTuningTabResponse )
      saveTuningTabResponse.then( ( response ) => {
         toast.add({ severity: 'info', summary: 'Open', detail: response?.message, life: 3000 })
      }) 
   }
})
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

.datepicker-wrapper {
  position: relative;
  display: inline-block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0);
  cursor: not-allowed;
  z-index: 10; /* Ensure it sits above the date picker */
}
</style>
