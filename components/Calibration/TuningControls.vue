<template>
  <div id="TuningControls">
    <div class="w-full mt-2">
      <div v-if="rangeDateFrom && rangeDateTo" class="text-center mt-1" id="RangeDates" >
        Range:&nbsp; <span class="font-bold">{{ rangeDateFrom }}</span>&nbsp; to  &nbsp;<span class="font-bold">{{ rangeDateTo }}</span>
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
                      class="datePickers" 
                      v-model="simStartTime" 
                      time-picker-inline
                      format="yyyy-MM-dd  hh:00"
                      :disabled="isCalibrationTuningControlsDisabled"
                    />
                    <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                  </div>
                  <div>Simulation End:
                    <VueDatePicker 
                      class="datePickers" 
                      v-model="simEndTime" 
                      time-picker-inline
                      format="yyyy-MM-dd  hh:00"
                      :disabled="isCalibrationTuningControlsDisabled"
                    />
                    <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                  </div>
                  <div>Calibration Start:
                    <VueDatePicker 
                      class="datePickers" 
                      v-model="calStartTime" 
                      time-picker-inline
                      format="yyyy-MM-dd  hh:00"
                      :disabled="isCalibrationTuningControlsDisabled"
                    />
                    <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                  </div>
                  <div>Calibration End:
                    <VueDatePicker 
                      class="datePickers" 
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
                      <VueDatePicker class="datePickers" v-model="avSimStartTime" time-picker-inline
                        format="yyyy-MM-dd  hh:00" :disabled="isCalibrationTuningControlsDisabled" />
                      <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                    </div>
                    <div>
                      Simulation End:
                      <VueDatePicker class="datePickers" v-model="avSimEndTime" time-picker-inline
                        format="yyyy-MM-dd  hh:00" :disabled="isCalibrationTuningControlsDisabled" />
                      <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                    </div>
                    <div>
                      Val Start:
                      <VueDatePicker class="datePickers" v-model="avCalStartTime" time-picker-inline
                        format="yyyy-MM-dd  hh:00" :disabled="isCalibrationTuningControlsDisabled" />
                      <div v-if="isCalibrationTuningControlsDisabled" class="overlay"></div>
                    </div>
                    <div>
                      Val End:
                      <VueDatePicker class="datePickers" v-model="avCalEndTime" time-picker-inline
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
                  <div class="mt-4 mb-4 font-bold">Calibration Tuning Parameters</div>
                  <div class="inline-block text-left">Parameters File (optional):</div>
                  <!-- <br />
                  <select id="ParamFile" class="varInputs inline-block mt-2">
                    <option value="" selected disabled>...</option>                    
                  </select> -->
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
    <!-- <div class="waitgif" v-if="loading">
      <img src="@/assets/styles/img/wait.gif" />
    </div> -->
  </div>

  
</template>

<script lang="ts" setup>
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { DateTime } from "luxon";

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

const calibrationTuningParameters = ref<any[]>([]);
const selectedParameter = ref<any>(null);
const selectedOutputVariable = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isInitialSetupDone = ref(false);
const isCalibrationTuningControlsDisabled = computed(() => {
  return !loadCalibrationRunData.value || !loadCalibrationRunData.value?.calibration_times || Object.keys(loadCalibrationRunData.value?.calibration_times).length === 0;
});

onMounted(async () => {
  console.log("onMounted");

  if (!isDataFetched.value) {
    //toast.add({ severity: 'info', summary: 'Fetching Tuning Tab Data...', detail: "Fetching Tuning Tab data...", life: 3000 });
    await fetchTuningTabData(); // only fetch data if not already fetched
    // loading.value = false;
  } else {
    // loading.value = true;
    //toast.add({ severity: 'info', summary: 'Tuning Tab Data already fetched', detail: 'Tuning Tab Data already fetched', life: 3000 });
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
    const { rangeStart, rangeEnd } = calculateTimeRange(
      calStartTime.value,
      calEndTime.value,
      simStartTime.value,
      simEndTime.value
    );
    rangeDateFrom.value = new DateTime(rangeStart).toFormat("yyyy-MM-dd  HH:mm:ss");
    rangeDateTo.value =  new DateTime(rangeEnd).toFormat("yyyy-MM-dd  HH:mm:ss");

    console.log("rangeDateFrom:", rangeDateFrom.value);
    console.log("rangeDateTo:", rangeDateTo.value);
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
  console.log("calibrationTuningParameters:", calibrationTuningParameters.value);

  // set output variables
  outputVariables.value = calibrationTuningModules?.flatMap((module: any) => module.output_variables.map((outputVar: any) => ({
    name: outputVar.name,
    description: outputVar.description,
    module: module.name,
  }))) || [];

  // set ouput_variable_to_calibrate
  if (loadCalibrationRunData.value.output_variable_to_calibrate) {
    const { name, module } = loadCalibrationRunData.value.output_variable_to_calibrate;
    userOutputVariableToCalibrate.value.name = name;
    userOutputVariableToCalibrate.value.module = module;
    selectedOutputVariable.value = name;
  };

  isInitialSetupDone.value = true; // set to true after initial setup
});

const handleCalibrationTimeControlsClick = (event: Event) => {
  if (isCalibrationTuningControlsDisabled) {
    event.preventDefault(); // Prevent any default action
    toast.add({ severity: 'warn', summary: 'Calibration Tuning Controls disabled', detail: 'You cannot interact with time controls as calibration_times are not set.', life: 10000 });
  }
}

// watch for changes to the simulation and calibration times and handle validation
watch([simStartTime, simEndTime, calStartTime, calEndTime], () => areCalibrationTimesValidated());

// watch for changes to selected output variable
watch(selectedOutputVariable, () => {
  // find module for newly-selected output variable
  const module = loadTuningTabData.value?.modules.find((module: any) => module.output_variables.find((outputVar: any) => outputVar.name === selectedOutputVariable.value));
  
  // set userOutputVariableToCalibrate with newly-selected output variable
  userOutputVariableToCalibrate.value = {
    name: selectedOutputVariable?.value,
    module: module?.name,
  }
  //console.log("selectedOutputVariable:", selectedOutputVariable.value);
  //console.log("userOutputVariableToCalibrate:", userOutputVariableToCalibrate.value);
});

// watch for changes to automatic automatic validation times and handle validation
watch([avSimStartTime, avSimEndTime, avCalStartTime, avCalEndTime], () => {
  // check if automatic_validation is enabled and validation_times are set
  if (avSimStartTime.value && avSimEndTime.value && avCalStartTime.value && avCalEndTime.value &&  automatic_validation.value) {
    // validate validation_times
    areValidationTimesValidated();
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

      if (response._data) {
        // Populate the Parameter table with the data from user-uploaded file
        response._data?.user_parameter_file.forEach((param: any) => {
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
  // update userCalibrationTuningParameters with the new value
  userCalibrationTuningParameters.value[index][field] = value;
  //console.log("updated userCalibrationTuningParameters:", userCalibrationTuningParameters.value);

  // update calibrationTuningParameters with the new value
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
 * Handle automatic validation checkbox change
 */
const AutoValChecked = () => {
  const ele = <HTMLInputElement>document.getElementById("CheckTheBox");
  automatic_validation.value = ele.checked as boolean;
  // //console.log("automatic_validation:", automatic_validation.value);
};

/**
 * Validate all Tuning tab data before saving
 */
const isTuningTabDataValidated = () => {
  return areCalibrationTimesValidated() && areValidationTimesValidated() && areParametersValidated() && isOutputVariableValidated();
};

/**
 * Validate calibration_times
 */
const areCalibrationTimesValidated = (): boolean => {
  // check if time_range is not set
  if (!rangeDateFrom.value || !rangeDateTo.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range must be set', life: 10000 });
    return false;
  }
  
  // check if calibration_times are not set
  if (!simStartTime.value || !simEndTime.value || !calStartTime.value || !calEndTime.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'calibration_times must be set', life: 10000 });
    return false;
  }

  // convert times to Date objects
  const rangeStartDate = new Date(rangeDateFrom.value);
  const rangeEndDate = new Date(rangeDateTo.value);
  const simStartDate = new Date(simStartTime.value);
  const simEndDate = new Date(simEndTime.value);
  const calStartDate = new Date(calStartTime.value);
  const calEndDate = new Date(calEndTime.value);

  // check if time_range and calibration_times are null after converted to Date objects
  if (!rangeStartDate || !rangeEndDate || !simStartDate || !simEndDate || !calStartDate || !calEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range and/or calibration_times cannot be converted to Date objects', life: 10000 });
    return false;
  }

  // set conditions to check if calibration_times are not within time_range
  const isSimStartWithinRange = simStartDate >= rangeStartDate && simStartDate <= rangeEndDate;
  const isSimEndWithinRange = simEndDate >= rangeStartDate && simEndDate <= rangeEndDate;
  const isCalStartWithinRange = calStartDate >= rangeStartDate && calStartDate <= rangeEndDate;
  const isCalEndWithinRange = calEndDate >= rangeStartDate && calEndDate <= rangeEndDate;

  // check if calibration_times are not within time_range
  if (!isSimStartWithinRange || !isSimEndWithinRange || !isCalStartWithinRange || !isCalEndWithinRange) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'calibration_times must be within time_range', life: 10000 });
    return false;
  }

  // check if simulation_end_time is not after simulation_start_time
  if (simStartDate >= simEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'simulation_end_time must be after simulation_start_time', life: 10000 });
    return false;
  }

  // check if calibration_start_time is not within simulation_start_time and simulation_end_time
  if (calStartDate <= simStartDate || calStartDate > simEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'calibration_start_time must be within simulation_start_time and simulation_end_time', life: 10000 });
    return false;
  }

  // check if calibration_end_time is not after calibration_start_time and within simulation_end_time
  if (calEndDate <= calStartDate || calEndDate > simEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'calibration_end_time must be after calibration_start_time and within simulation_end_time', life: 10000 });
    return false;
  }

  return true;
};

/**
 * Validate validation_times
 */
const areValidationTimesValidated = (): boolean => {
  // check if automatic_validation is not enabled
  if (!automatic_validation.value) {
    return true;
  }

  // check if calibration_times are set and validated
  if (!areCalibrationTimesValidated()) {
    return false; // areCalibrationTimesValidated() will show error messages
  }

  // check if automatic_validation is enabled and validation_times are set
  if (automatic_validation.value) {
    if (!avSimStartTime.value || !avSimEndTime.value || !avCalStartTime.value || !avCalEndTime.value) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'If Automatic Validation is enabled, Validation Times Controls must be set', life: 10000 });
      return false;
    }
  }

  // convert times to Date objects
  const avSimStartDate = new Date(avSimStartTime.value);
  const avSimEndDate = new Date(avSimEndTime.value);
  const avCalStartDate = new Date(avCalStartTime.value);
  const avCalEndDate = new Date(avCalEndTime.value);
  const rangeStartDate = new Date(rangeDateFrom.value);
  const rangeEndDate = new Date(rangeDateTo.value);

  // check if Date objects are valid
  if (!avSimStartDate || !avSimEndDate || !avCalStartDate || !avCalEndDate || !rangeStartDate || !rangeEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range and/or validation_times cannot be converted to Date objects', life: 10000 });
    return false;
  }

  // convert simeEndTime to Date object. simEndTime is the lastest time within calibration_times
  const simEndDate = new Date(simEndTime.value);

  // set conditions to check if validation_times are not after calibration_times
  const isAvSimStartAfterCalEnd = avSimStartDate > simEndDate;
  const isAvSimEndAfterCalEnd = avSimEndDate > simEndDate;
  const isAvCalStartAfterCalEnd = avCalStartDate > simEndDate;
  const isAvCalEndAfterCalEnd = avCalEndDate > simEndDate;


  // check if validation_times are not after calibration_times
  if (isAvSimStartAfterCalEnd || isAvSimEndAfterCalEnd || isAvCalStartAfterCalEnd || isAvCalEndAfterCalEnd) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'All validation_times must be after calibration_times', life: 10000 });
    return false;
  }

  // check if avSimEndDate is not after avSimStartDate
  if (avSimStartDate >= avSimEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Automatic Validation Simulation End must be after Simulation Start', life: 10000 });
    return false;
  }

  // check if avCalStartDate is not within avSimStartDate and avSimEndDate
  if (avCalStartDate < avSimStartDate || avCalStartDate > avSimEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Automatic Validation Calibration Start must be within Simulation Start and End', life: 10000 });
    return false;
  }

  // check if avCalEndDate is not after avCalStartDate and not less than avSimEndDate
  if (avCalEndDate <= avCalStartDate || avCalEndDate > avSimEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Automatic Validation Calibration End must be after Calibration Start and less than or equal to Automatic Validation Simulation End', life: 10000 });
    return false;
  }

  return true
};

/**
 * Validate parameters
 */
const areParametersValidated = (): boolean => {
  // check if no Calibration Tuning Parameters have been added
  if (userCalibrationTuningParameters.value.length === 0) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'At least one Calibration Tuning Parameter must be added', life: 10000 });
    return false;
  }

  // TODO: add more parameter validation checks here. e.g. check if min < max, etc.
  return true;
};

/**
 * Validate output_variable_to_calibrate
 */
const isOutputVariableValidated = (): boolean => {
  // check if Output Variable to Calibrate is set
  if (!userOutputVariableToCalibrate.value.name || !userOutputVariableToCalibrate.value.module) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Output Variable to Calibrate must be selected', life: 10000 });
    return false;
  }
  return true;
};

/**
 * Save Tuning Tab data
 */
useListen('calibrationButtonSaveStart', (actionButton) => {
  // handle saving Tuning Tab data
  const handleSaveTuningTab = async () => {
    try {
      const saveTuningTabResponse = await postSaveTuningTabData();
      console.log(
        `saveTabContent Tuning, should be tabIndex 3, on tabIndex ${getCalibrationTabIndex()}, save response: `,
        saveTuningTabResponse
      );

      toast.add({
        severity: 'info',
        summary: 'Saved Tuning Tab data',
        detail: 'Saved Tuning Tab data',
        life: 3000,
      });
    } catch (error) {
      console.error('Error saving tuning tab data:', error);
      toast.add({
        severity: 'error',
        summary: 'Error saving Tuning Tab data',
        detail: 'Error saving Tuning Tab data',
        life: 3000,
      });
    }
  };

  // check if the current tab is the Tuning tab and the actionButton is 'SAVE'
  if (getCalibrationTabIndex() === 3 && actionButton === 'SAVE') {
    // check if Tuning Tab data is validated before saving
    if (isTuningTabDataValidated()) {
      handleSaveTuningTab();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error saving Tuning Tab data',
        detail: 'Tuning Tab data is not validated',
        life: 3000,
      });
    }
  } else {
    toast.add({
      severity: 'error',
      summary: 'Calibration Tab not 3 or actionButton not SAVE',
      detail: 'Calibration Tab not 3 or actionButton not SAVE',
      life: 3000,
    });
    console.error('getCalibrationTabIndex:', getCalibrationTabIndex());
    console.error('actionButton:', actionButton);
  }
});

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
  margin: 20px auto;
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
  font-weight: 600;
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
