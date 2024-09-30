<template>
  <div id="TuningControls pl-8" class="pl-4">
    <div class="w-full mt-3 mb-2">
      <div v-if="rangeDateFrom && rangeDateTo" class="w-full text-left mt-1 text-xl c-blue-primary1 font-bold"
        id="RangeDates">
        RANGE: {{ rangeDateFrom }} to {{ rangeDateTo }}
      </div>
    </div>
    <div class="">
      <div class="">
        <div class="grid grid-cols-2">

          <div class="col-span-2">
            <div id="BoxLeft" class="text-left">
              <div id="BoxTopLeft" class="pt-2">
                <span class="tabTitles font-bold">Calibration Time Controls</span>
              </div>
              <div id="BoxBottomLeft" class="pt-2">
                <div class="timeBlocks datepicker-wrapper w-[695px]" @click="handleCalibrationTimeControlsClick">

                  <table class="table-auto border-collapse ml-0 table-fixed">
                    <tbody>
                      <tr>
                        <td class="w-1/6">
                          <label for="SimulationStart" class="whitespace-nowrap">Simulation Start:</label>
                        </td>
                        <td class="text-left w-2/6" style="position: relative;">
                          <VueDatePicker id="SimulationStart" class="datePickers dp__theme_dark" v-model="simStartTime"
                            time-picker-inline text-input format="yyyy-MM-dd HH:00"
                            :disabled="!isTimeRangeSet()" />
                          <div v-if="!isTimeRangeSet()" class="overlay"></div>
                        </td>
                        <td class="pl-6 w-1/6">
                          <label for="SimulationEnd" class="whitespace-nowrap">Simulation End:</label>
                        </td>
                        <td class="text-left w-2/6" style="position: relative;">
                          <VueDatePicker id="SimulationEnd" class="datePickers dp__theme_dark" v-model="simEndTime"
                            time-picker-inline text-input format="yyyy-MM-dd HH:00"
                            :disabled="!isTimeRangeSet()" />
                          <div v-if="!isTimeRangeSet()" class="overlay"></div>
                        </td>
                      </tr>
                      <tr>
                        <td class="w-1/6">
                          <label for="CalibrationStart" class="whitespace-nowrap">Calibration Start:</label>
                        </td>
                        <td class="text-left w-2/6" style="position: relative;">
                          <VueDatePicker id="CalibrationStart" class="datePickers dp__theme_dark" v-model="calStartTime"
                            time-picker-inline text-input format="yyyy-MM-dd HH:00"
                            :disabled="!isTimeRangeSet()" />
                          <div v-if="!isTimeRangeSet()" class="overlay"></div>
                        </td>
                        <td class="pl-6 w-1/6">
                          <label for="CalibrationEnd" class="whitespace-nowrap">Calibration End:</label>
                        </td>
                        <td class="text-left w-2/6" style="position: relative;">
                          <VueDatePicker id="CalibrationEnd" class="datePickers dp__theme_dark" v-model="calEndTime"
                            time-picker-inline text-input format="yyyy-MM-dd HH:00"
                            :disabled="!isTimeRangeSet()" />
                          <div v-if="!isTimeRangeSet()" class="overlay"></div>
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div id="BoxTopRight" class="pt-4">
                <!-- <input type="checkbox" id="CheckTheBox" class="inline w-auto mr-2"></input> -->
                <label for="CheckTheBox" class="inline">Automatic Validation Time Controls</label>
              </div>
              <div id="BoxBottomRight" class="pt-0 ml-0">
                <div v-if="!automatic_validation" class="tabTitles">
                  Check the box above to enable Automatic Validation
                </div>

                <div v-else>
                  <div class="timeBlocks datepicker-wrapper w-[695px]" @click="handleCalibrationTimeControlsClick">

                    <table class="table-auto border-collapse ml-0 table-fixed">
                      <tbody>
                        <tr>

                          <td class="w-1/6">
                            <label for="ValSimulationStart" class="whitespace-nowrap">Simulation
                              Start:</label>
                          </td>
                          <td class="text-left w-2/6" style="position: relative;">
                            <VueDatePicker id="ValSimulationStart" class="datePickers dp__theme_dark"
                              v-model="avSimStartTime" time-picker-inline text-input format="yyyy-MM-dd HH:00"
                              :disabled="!isTimeRangeSet()" />
                            <div v-if="!isTimeRangeSet()" class="overlay"></div>

                          </td>
                          <td class="pl-6 w-1/6">
                            <label for="ValSimulationEnd" class="whitespace-nowrap">Simulation End:</label>
                          </td>
                          <td class="text-left w-2/6" style="position: relative;">
                            <VueDatePicker id="ValSimulationEnd" class="datePickers dp__theme_dark"
                              v-model="avSimEndTime" time-picker-inline text-input format="yyyy-MM-dd HH:00"
                              :disabled="!isTimeRangeSet()" />
                            <div v-if="!isTimeRangeSet()" class="overlay"></div>
                          </td>

                        </tr>
                        <tr>

                          <td class="w-1/6">
                            <label for="ValidationStart" class="whitespace-nowrap">Validation Start:</label>
                          </td>
                          <td class="text-left w-2/6" style="position: relative;">
                            <VueDatePicker id="ValidationStart" class="datePickers dp__theme_dark"
                              v-model="avCalStartTime" time-picker-inline text-input format="yyyy-MM-dd HH:00"
                              :disabled="!isTimeRangeSet()" />
                            <div v-if="!isTimeRangeSet()" class="overlay"></div>
                          </td>
                          <td class="pl-6 w-1/6">
                            <label for="ValidationEnd" class="whitespace-nowrap">Validation End:</label>
                          </td>
                          <td class="text-left w-2/6" style="position: relative;">
                            <VueDatePicker id="ValidationEnd" class="datePickers dp__theme_dark" v-model="avCalEndTime"
                              time-picker-inline text-input format="yyyy-MM-dd HH:00"
                              :disabled="!isTimeRangeSet()" />
                            <div v-if="!isTimeRangeSet()" class="overlay"></div>

                          </td>

                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="">
        <div class="grid grid-rows-2">

          <div class="row-span-1 text-left">
            <div class="grid grid-cols-2">

              <div class="col-span-2">
                <div class="">
                  <div class="mt-6 mb-3 hr"></div>
                  <div class="mb-2 font-bold">Output Variable To Calibrate</div>
                  <div class="mt-2 text-sm" style="position: relative;">
                    <Select
                      id="OutVar"
                      class="varInputs"
                      v-model="selectedOutputVariable"
                      :disabled="!isFormulationDataSet()" 
                      :options="outputVariables"
                      optionLabel="name"
                      optionValue="name"
                    >
                    </Select>
                    <div v-if="!isFormulationDataSet()" class="overlay"></div>
                  </div>
                </div>
              </div>

              <div class="col-span-2">
                <div class="mt-5 mb-3 hr"></div>
                <div class="text-left">
                  <div class="mb-2 font-bold">Calibration Tuning Parameters</div>
                  <div class="inline-block text-left text-sm"><label for="ParamFile">Parameters File (optional):</label>
                  </div><br />
                  <!-- <br />
                  <Select id="ParamFile" class="varInputs inline-block mt-2 text-sm">
                    <option value="" selected disabled>...</option>                    
                  </Select> -->
                  <div id="UploadParams" class="ngenButtonDiv-alt bg-blue4 inline ml-3" style="position: relative;">
                    <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />
                    <button @click="triggerFileInput" :disabled="!isFormulationDataSet()">Load</button>
                    <div v-if="!isFormulationDataSet()" class="overlay"></div>
                  </div>
                </div>

                <div class="text-left mt-3 text-sm" style="position: relative;">
                  <div class="inline-block text-left"><label for="ParamName">Name:</label></div><br />
                  <Select 
                    id="ParamName" 
                    class="varInputs inline-block mt-2"
                    v-model="selectedParameter" 
                    :disabled="!isFormulationDataSet()"
                    :options="calibrationTuningParameters"
                    optionLabel="name"
                    optionValue="name" >
                  </Select>
                  <div id="UploadParams" class="ngenButtonDiv-alt bg-blue4 inline ml-3">
                    <button @click="addParameterToTable" :disabled="!isFormulationDataSet()">Add</button>
                  </div>
                  <div v-if="!isFormulationDataSet()" class="overlay"></div>
                </div>
              </div>

            </div>
          </div>

          <div id="TuningDataList" class="mt-5" style="position: relative;">
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
                  <input type="text" v-model="slotProps.data.minimum"
                    @input="updateCalibrationTuningParameter(slotProps.index, 'minimum', $event?.target?.value)"
                    style="width: 100%;" />
                </template>
              </Column>

              <!-- max column, editable -->
              <Column field="max" header="Max" sortable>
                <template #body="slotProps">
                  <input type="text" v-model="slotProps.data.maximum"
                    @input="updateCalibrationTuningParameter(slotProps.index, 'maximum', $event?.target?.value)"
                    style="width: 100%;" />
                </template>
              </Column>

              <!-- initValue column, editable -->
              <Column field="initValue" header="Initial Value" sortable>
                <template #body="slotProps">
                  <input type="text" v-model="slotProps.data.initial_value"
                    @input="updateCalibrationTuningParameter(slotProps.index, 'initial_value', $event?.target?.value)"
                    style="width: 100%;" />
                </template>
              </Column>
            </DataTable>
            <div v-if="!isFormulationDataSet()" class="overlay"></div>
          </div>

        </div>

      </div>
    </div>
    <div class="waitgif" v-if="isLoading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>


</template>

<script lang="ts" setup>

import { useToast } from "primevue/usetoast";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { DateTime } from "luxon";

import { calculateTimeRange } from "~/utils/TimeHelpers";
import { generalStore } from "~/stores/common/GeneralStore";
import { useFormulationStore } from "~/stores/calibration/FormulationStore";
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { makeProtectedApiCall } from '~/composables/UserAuth';
import { useBackendConfig } from "~/composables/UseBackendConfig";

const { calibrationJobId } = storeToRefs(generalStore());
const { getCalibrationTabIndex } = generalStore();
const { ngencerfBaseUrl } = useBackendConfig();
const userDataStore = useUserDataStore();
const tuningStore = useTuningStore();

const {
  formulationNameInput,
  selectedModuleValues,
  slothParameterInputs
} = storeToRefs(useFormulationStore());

const { fetchUserCalibrationRunData, getAccessToken } = userDataStore;
const { userCalibrationRunData } = storeToRefs(userDataStore);
const { fetchTuningTabData, postSaveTuningTabData } = tuningStore;
const {
  loadTuningTabData,
  simStartTime,
  simEndTime,
  calStartTime,
  calEndTime,
  userCalibrationTuningParameters,
  userOutputVariableToCalibrate,
  outputVariables,
  automatic_validation,
  avSimStartTime,
  avSimEndTime,
  avCalStartTime,
  avCalEndTime,
  rangeDateFrom,
  rangeDateTo,
} = storeToRefs(tuningStore);

const toast = useToast();
const isLoading = ref(true);
const calibrationTuningParameters = ref<any[]>([]);
const selectedParameter = ref<any>(null);
const selectedOutputVariable = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isInitialSetupDone = ref(false);

onMounted(async () => {
  await fetchUserCalibrationRunData(); // this sets userCalibrationRunData
  loadTuningTabData.value =  await fetchTuningTabData();

  // console.log("loadTuningTabData:", loadTuningTabData?.value?._data);
  // console.log("userCalibrationRunData:", userCalibrationRunData.value);
  // console.log("calibration_times:", userCalibrationRunData.value?.calibration_times);
  // console.log("validation_times:", userCalibrationRunData.value?.validation_times);
  // console.log("time_range:", userCalibrationRunData.value?.time_range);

  // set calibration times
  if (userCalibrationRunData.value?.calibration_times) {
    const { simulation_start_time, simulation_end_time, calibration_start_time, calibration_end_time } = userCalibrationRunData.value.calibration_times;
    simStartTime.value = simulation_start_time;
    simEndTime.value = simulation_end_time;
    calStartTime.value = calibration_start_time;
    calEndTime.value = calibration_end_time;
  };

  // set automatic validation times
  if (userCalibrationRunData.value?.validation_times) {
    const { simulation_start_time, simulation_end_time, validation_start_time, validation_end_time } = userCalibrationRunData.value.validation_times;

    avSimStartTime.value = simulation_start_time;
    avSimEndTime.value = simulation_end_time;
    avCalStartTime.value = validation_start_time;
    avCalEndTime.value = validation_end_time;
  };

  // set time range
  const timeRange = userCalibrationRunData.value?.time_range;

  // check if timeRange is provided and not empty
  if (timeRange && timeRange.constructor === Object && Object.keys(timeRange).length > 0) {
    rangeDateFrom.value = timeRange?.start_time;
    rangeDateTo.value = timeRange?.end_time;
  } else {
    // time_range is not set. Cannot proceed
    toast.add({ severity: 'warn', summary: 'time_range is not set', life: 10000 });
  }

  const calibrationTuningModules = loadTuningTabData.value?._data?.modules;

  // set the calibration tuning parameters
  calibrationTuningParameters.value = calibrationTuningModules?.flatMap((module: any) => module?.parameters?.map((param: any) => ({
    name: param.name,
    minimum: param.minimum,
    maximum: param.maximum,
    initial_value: param.initial_value,
    module: module.name,
  }))) || [];
  console.log("calibrationTuningParameters:", calibrationTuningParameters.value);

  // set output variables
  outputVariables.value = calibrationTuningModules?.flatMap((module: any) => module?.output_variables?.map((outputVar: any) => ({
    name: outputVar.name,
    description: outputVar.description,
    module: module.name,
  }))) || [];
  console.log("outputVariables:", outputVariables.value);

  // set ouput_variable_to_calibrate
  if (userCalibrationRunData?.value?.output_variable_to_calibrate) {
    console.log("userCalibrationRunData.value.output_variable_to_calibrate:", userCalibrationRunData.value.output_variable_to_calibrate);
    const { name, module } = userCalibrationRunData.value.output_variable_to_calibrate;
    userOutputVariableToCalibrate.value.name = name;
    userOutputVariableToCalibrate.value.module = module;
    selectedOutputVariable.value = name;
    console.log('selectedOutputVariable:', selectedOutputVariable.value);
  };

  isInitialSetupDone.value = true; // set to true after initial setup

  isLoading.value = false;
});

/**
 * Check if time_range is set
 * @returns boolean
 */
const isTimeRangeSet = (): boolean => {
  const timeRange = userCalibrationRunData?.value?.time_range;
  
  if (timeRange && Object.keys(timeRange).length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Check if formulation data is set
 * @returns boolean
 */
const isFormulationDataSet = (): boolean => {
  if (formulationNameInput.value == "" && selectedModuleValues?.value.length === 0 && slothParameterInputs?.value.length === 0) {
    return false;
  } else {
    return true;
  }
};

const handleCalibrationTimeControlsClick = (event: Event) => {
  if (!isTimeRangeSet()) {
    event.preventDefault(); // Prevent any default action if time_range is not set
    toast.add({ severity: 'warn', summary: 'Calibration Tuning Controls disabled', detail: 'You cannot interact with time controls because time_range is not set.', life: 10000 });
  }
};

const handleFormulationNotSet = (event: Event) => {
  if (!isFormulationDataSet()) {
    event.preventDefault(); // Prevent any default action
    toast.add({ severity: 'warn', summary: 'Output Variables and Parameters disabled', detail: 'You cannot interact with output variables or paraemters because formulation data is not set.', life: 10000 });
  }
};

// watch for changes to selected output variable
watch(selectedOutputVariable, () => {
  // find module for newly-selected output variable
  const module = loadTuningTabData?.value?._data?.modules?.find((module: any) => module?.output_variables?.find((outputVar: any) => outputVar?.name === selectedOutputVariable?.value));

  // set userOutputVariableToCalibrate with newly-selected output variable
  userOutputVariableToCalibrate.value = {
    name: selectedOutputVariable?.value,
    module: module?.name,
  }
  //console.log("selectedOutputVariable:", selectedOutputVariable.value);
  //console.log("userOutputVariableToCalibrate:", userOutputVariableToCalibrate.value);
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
  const file = target.files?.[0]; // get the first file we see
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
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: formData,
        });

      if (response._data) {
        // Populate the Parameter table with the data from user-uploaded file
        response._data?.user_parameter_file?.forEach((param: any) => {
          userCalibrationTuningParameters?.value?.push({
            name: param.param,
            minimum: param.min,
            maximum: param.max,
            initial_value: param.init,
            module: param.model, // module?
          });
        });
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'File upload failed', life: 3000 });
      console.error('File upload failed:', error);
    }
  } else {
    toast.add({ severity: 'error', summary: 'No file selected', life: 3000 });
    console.error('No file selected');
  }
};

/**
 * Add selected calibration tuning parameter to the table when Add / Update button is clicked
 */
const addParameterToTable = () => {
  const parameter = calibrationTuningParameters?.value?.find(param => param.name === selectedParameter.value);
  if (parameter) {
    userCalibrationTuningParameters?.value?.push({
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
 * @param fullValidation If true, perform full validation. If false, perform partial validation
 */
const areCalibrationTimesValidated = (fullValidation: boolean = true): boolean => {
  // check if time_range is not set
  if (fullValidation && (!rangeDateFrom.value || !rangeDateTo.value)) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range must be set', life: 10000 });
    return false;
  }

  // check if calibration_times are not set
  if (fullValidation && (!simStartTime.value || !simEndTime.value || !calStartTime.value || !calEndTime.value)) {
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
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range and/or calibration_times cannot be converted to Date objects', life: 3000 });
    return false;
  }

  // set conditions to check if calibration_times are not within time_range
  const isSimStartWithinRange = simStartDate >= rangeStartDate && simStartDate <= rangeEndDate;
  const isSimEndWithinRange = simEndDate >= rangeStartDate && simEndDate <= rangeEndDate;
  const isCalStartWithinRange = calStartDate >= rangeStartDate && calStartDate <= rangeEndDate;
  const isCalEndWithinRange = calEndDate >= rangeStartDate && calEndDate <= rangeEndDate;

  // check if calibration_times are not within time_range
  if (!isSimStartWithinRange || !isSimEndWithinRange || !isCalStartWithinRange || !isCalEndWithinRange) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'calibration_times must be within time_range', life: 3000 });
    return false;
  }

  // check if simulation_end_time is not after simulation_start_time
  if (simStartDate >= simEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'simulation_end_time must be after simulation_start_time', life: 3000 });
    return false;
  }

  // check if calibration_start_time is not within simulation_start_time and simulation_end_time
  if (calStartDate <= simStartDate || calStartDate > simEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'calibration_start_time must be within simulation_start_time and simulation_end_time', life: 3000 });
    return false;
  }

  // check if calibration_end_time is not after calibration_start_time and within simulation_end_time
  if (calEndDate <= calStartDate || calEndDate > simEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'calibration_end_time must be after calibration_start_time and within simulation_end_time', life: 3000 });
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
      toast.add({ severity: 'error', summary: 'Error', detail: 'If Automatic Validation is enabled, Validation Times Controls must be set', life: 3000 });
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
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range and/or validation_times cannot be converted to Date objects', life: 3000 });
    return false;
  }

  // convert simeEndTime to Date object. simEndTime is the lastest time within calibration_times
  const simEndDate = new Date(simEndTime.value);

  // set conditions to check if validation_times are not after calibration_times
  const isAvSimStartAfterCalEnd = avSimStartDate > simEndDate;
  const isAvSimEndAfterCalEnd = avSimEndDate > simEndDate;
  const isAvCalStartAfterCalEnd = avCalStartDate > simEndDate;
  const isAvCalEndAfterCalEnd = avCalEndDate > simEndDate;

  // console.log('avSimStartDate:', avSimStartDate);
  // console.log('avSimEndDate:', avSimEndDate);
  // console.log('avCalStartDate:', avCalStartDate);
  // console.log('avCalEndDate:', avCalEndDate);
  // console.log('simEndDate:', simEndDate);

  // check if validation_times are not after calibration_times
  if (!isAvSimStartAfterCalEnd || !isAvSimEndAfterCalEnd || !isAvCalStartAfterCalEnd || !isAvCalEndAfterCalEnd) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'All validation_times must be after calibration_times', life: 10000 });
    return false;
  }

  // check if avSimEndDate is not after avSimStartDate
  if (avSimStartDate >= avSimEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Automatic Validation Simulation End must be after Simulation Start', life: 3000 });
    return false;
  }

  // check if avCalStartDate is not within avSimStartDate and avSimEndDate
  if (avCalStartDate < avSimStartDate || avCalStartDate > avSimEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Automatic Validation Calibration Start must be within Simulation Start and End', life: 3000 });
    return false;
  }

  // check if avCalEndDate is not after avCalStartDate and not less than avSimEndDate
  if (avCalEndDate <= avCalStartDate || avCalEndDate > avSimEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Automatic Validation Calibration End must be after Calibration Start and less than or equal to Automatic Validation Simulation End', life: 3000 });
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
    toast.add({ severity: 'error', summary: 'Error', detail: 'At least one Calibration Tuning Parameter must be added', life: 3000 });
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
    toast.add({ severity: 'error', summary: 'Error', detail: 'Output Variable to Calibrate must be selected', life: 3000 });
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
        `saveTabContent Tuning, should be tabIndex 4, on tabIndex ${getCalibrationTabIndex()}, save response: `,
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
  if (getCalibrationTabIndex() === 4 && actionButton === 'SAVE') {
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

useListen('calibrationButtonPrev', (actionButton) => {
  if (getCalibrationTabIndex() == 4 && actionButton === "PREV") {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[2];
    e.click();
  }
});

useListen('calibrationButtonNext', (actionButton) => {
  if (getCalibrationTabIndex() == 4 && actionButton === "NEXT") {
    let hasError = false;
    if (!(calStartTime.value && calEndTime.value && simStartTime.value && simEndTime.value)) {
      toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "All Calibration Times are required.", life: 3000 })
      hasError = true;
    }
    if (!(avSimStartTime.value && avSimEndTime.value && avCalStartTime.value && avCalEndTime.value)) {
      hasError = true;
      toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "All Automatic Validation Times are required.", life: 3000 })
    }
    if (!userOutputVariableToCalibrate.value.name) {
      toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "No Output Variable selected.", life: 3000 })
      hasError = true;
    }
    if (hasError) {
      setTimeout(() => gotoNext(), 3000);
      return;
    }
    gotoNext();
  }
});

const gotoNext = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[4];
  e.click();
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#AddUpdateBtn {
  height: 40px;
}

.mup30 {
  margin-top: -140px;
}

.timeBlocks {
  font-size: 0.8em;
}

.datePickers {
  width: 230px;
  display: inline-block;
  text-align: center;
}

.mmiInputs {
  width: 100px;
}

.varInputs {
  width: 400px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0);
  cursor: not-allowed;
  z-index: 10;
}
</style>
