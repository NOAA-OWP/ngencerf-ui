<template>
  <div id="TuningControls pl-8" class="pl-4">
    <div class="w-full mt-3 mb-2">
      <div v-if="rangeDateFrom && rangeDateTo" class="w-full text-left mt-1 text-xl c-blue-primary1 font-bold"
        id="RangeDates">
        RANGE: {{ format(rangeDateFrom) }} GMT to {{ format(rangeDateTo) }} GMT
      </div>
    </div>
    <div class="">
      <div class="">
        <div class="grid grid-cols-2">

          <div class="col-span-2">
            <div id="BoxLeft" class="text-left">
              <div id="BoxTopLeft" class="pt-2">
                <small>* All times entered must be in GMT</small><br>
                <span class="tabTitles font-bold">Calibration Time Controls</span>
              </div>
              <div id="BoxBottomLeft" class="pt-2">
                <div class="timeBlocks datepicker-wrapper w-[695px]" @click="handleCalibrationTimeControlsClick">

                  <table class="table-auto border-collapse ml-0">
                    <tbody>
                      <tr>
                        <td class="w-1/6">
                          <label for="SimulationStart" class="whitespace-nowrap">Simulation Start:</label>
                        </td>
                        <td class="text-left w-2/6" style="position: relative;">
                          <VueDatePicker id="SimulationStart" class="datePickers dp__theme_dark" v-model="simStartTime"
                            time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                            @update:model-value="handleSimStartUpdate" :disabled="!isTimeRangeSet()" />
                          <div v-if="!isTimeRangeSet()" class="overlay"></div>
                        </td>
                        <td class="pl-6 w-1/6">
                          <label for="SimulationEnd" class="whitespace-nowrap">Simulation End:</label>
                        </td>
                        <td class="text-left w-2/6" style="position: relative;">
                          <VueDatePicker id="SimulationEnd" class="datePickers dp__theme_dark" v-model="simEndTime"
                            time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                            @update:model-value="handleSimEndUpdate" :disabled="!isTimeRangeSet()" />
                          <div v-if="!isTimeRangeSet()" class="overlay"></div>
                        </td>
                      </tr>
                      <tr>
                        <td class="w-1/6">
                          <label for="CalibrationStart" class="whitespace-nowrap">Calibration Start:</label>
                        </td>
                        <td class="text-left w-2/6" style="position: relative;">
                          <VueDatePicker id="CalibrationStart" class="datePickers dp__theme_dark" v-model="calStartTime"
                            time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                            @update:model-value="handleCalStartUpdate" :disabled="!isTimeRangeSet()" />
                          <div v-if="!isTimeRangeSet()" class="overlay"></div>
                        </td>
                        <td class="pl-6 w-1/6">
                          <label for="CalibrationEnd" class="whitespace-nowrap">Calibration End:</label>
                        </td>
                        <td class="text-left w-2/6" style="position: relative;">
                          <VueDatePicker id="CalibrationEnd" class="datePickers dp__theme_dark" v-model="calEndTime"
                            time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                            @update:model-value="handleCalEndUpdate" :disabled="!isTimeRangeSet()" />
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

                    <table class="table-auto border-collapse ml-0">
                      <tbody>
                        <tr>

                          <td class="w-1/6">
                            <label for="ValSimulationStart" class="whitespace-nowrap">Simulation
                              Start:</label>
                          </td>
                          <td class="text-left w-2/6" style="position: relative;">
                            <VueDatePicker id="ValSimulationStart" class="datePickers dp__theme_dark"
                              v-model="avSimStartTime" time-picker-inline text-input utc='preserve'
                              format="yyyy-MM-dd HH:00" @update:model-value="handleAvSimStartUpdate"
                              :disabled="!isTimeRangeSet()" />
                            <div v-if="!isTimeRangeSet()" class="overlay"></div>

                          </td>
                          <td class="pl-6 w-1/6">
                            <label for="ValSimulationEnd" class="whitespace-nowrap">Simulation End:</label>
                          </td>
                          <td class="text-left w-2/6" style="position: relative;">
                            <VueDatePicker id="ValSimulationEnd" class="datePickers dp__theme_dark"
                              v-model="avSimEndTime" time-picker-inline text-input utc='preserve'
                              format="yyyy-MM-dd HH:00" @update:model-value="handleAvSimEndUpdate"
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
                              v-model="avCalStartTime" time-picker-inline text-input utc='preserve'
                              format="yyyy-MM-dd HH:00" @update:model-value="handleAvCalStartUpdate"
                              :disabled="!isTimeRangeSet()" />
                            <div v-if="!isTimeRangeSet()" class="overlay"></div>
                          </td>
                          <td class="pl-6 w-1/6">
                            <label for="ValidationEnd" class="whitespace-nowrap">Validation End:</label>
                          </td>
                          <td class="text-left w-2/6" style="position: relative;">
                            <VueDatePicker id="ValidationEnd" class="datePickers dp__theme_dark" v-model="avCalEndTime"
                              time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                              @update:model-value="handleAvCalEndUpdate" :disabled="!isTimeRangeSet()" />
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


      <div class="grid grid-rows-2">

        <div class="row-span-1 text-left">
          <div class="grid grid-cols-2">

            <div class="col-span-2">
              <div class="mt-6 mb-3 hr"></div>
              <div class="mb-2 font-bold">Output Variable To Calibrate</div>
              <div class="mt-2 text-sm" style="position: relative;">
                <Select id="OutVar" class="varInputs" v-model="selectedOutputVariable"
                  :disabled="!isFormulationDataSet()" :options="outputVariables" optionLabel="name">
                  <!-- <template #optiongroup="slotProps">
                        <div class="flex items-left">
                          <div>{{ slotProps.option.name }} </div>
                        </div>
                      </template> -->
                </Select>
                <div v-if="!isFormulationDataSet()" class="overlay"></div>
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
                <div class="inline-block text-left"><label for="ParamName">Calibratable Parameters:</label></div>
                <br />
                <Select id="ParamName" class="varInputs inline-block mt-2" v-model="selectedParameter"
                  :disabled="!isFormulationDataSet()" :options="calibrationTuningParameters" optionLabel="name"
                  optionValue="name">
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
                  @input="updateCalibrationTuningParameter(slotProps.index, 'minimum', $event)" style="width: 100%;" />
              </template>
            </Column>

            <!-- max column, editable -->
            <Column field="max" header="Max" sortable>
              <template #body="slotProps">
                <input type="text" v-model="slotProps.data.maximum"
                  @input="updateCalibrationTuningParameter(slotProps.index, 'maximum', $event)" style="width: 100%;" />
              </template>
            </Column>

            <!-- initValue column, editable -->
            <Column field="initValue" header="Initial Value" sortable>
              <template #body="slotProps">
                <input type="text" v-model="slotProps.data.initial_value"
                  @input="updateCalibrationTuningParameter(slotProps.index, 'initial_value', $event)"
                  style="width: 100%;" />
              </template>
            </Column>
          </DataTable>
          <div v-if="!isFormulationDataSet()" class="overlay"></div>
        </div>

      </div>



      <div class="waitgif" v-if="isLoading">
        <img src="@/assets/styles/img/wait.gif" />
      </div>
    </div>
  </div>


</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { useToast } from "primevue/usetoast";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { DateTime } from "luxon";
import Select from "primevue/select";

import { isValidDateTime } from "~/utils/CommonHelpers";
import { formatDateForDisplay, calculateTimeRange } from "~/utils/TimeHelpers";
import { generalStore } from "~/stores/common/GeneralStore";
import { useFormulationStore } from "~/stores/calibration/FormulationStore";
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { makeProtectedApiCall } from '~/composables/UserAuth';
import { useBackendConfig } from "~/composables/UseBackendConfig";

const format = formatDateForDisplay;
const isLoading = ref(false);

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
const calibrationTuningModules = ref<any>();
const calibrationTuningParameters = ref<any[]>([]);
const selectedParameter = ref<any>(null);
const selectedOutputVariable = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isInitialSetupDone = ref(false);

onMounted(async () => {
  toast.removeAllGroups();

  // fetch user calibration data
  await fetchUserCalibrationRunData(); // how often should this be called? every visit to the Tuning tab?
  
  // if Tuning Tab static data is not loaded, fetch it
  console.log("loadTuningTabData:", loadTuningTabData?.value);
  if (loadTuningTabData?.value?._data.modules.length === 0) {
    // toast.add({ severity: 'info', summary: 'Fetching Tuning Tab Data...', detail: "Fetching Tuning Tab data...", life: 3000 });
    await fetchTuningTabData();
  }
  calibrationTuningModules.value = loadTuningTabData.value?._data?.modules;

  if (calibrationTuningModules.value) {
    // set calibration tuning parameters dropdown
    calibrationTuningParameters.value = calibrationTuningModules?.value?.flatMap((module: any) => module?.parameters?.map((param: any) => ({
      name: param.name,
      minimum: param.minimum,
      maximum: param.maximum,
      initial_value: param.initial_value,
      user_selected_for_tuning: param.user_selected_for_tuning,
      module: module.name,
    }))) || [];
    // console.log("calibrationTuningParameters:", calibrationTuningParameters.value);

    // set calibration tuning parameters data table with user-selected parameters but without the user_selected_for_tuning flag
    userCalibrationTuningParameters.value = calibrationTuningParameters.value?.filter((param: any) => param?.user_selected_for_tuning)?.map((param: any) => ({
      name: param.name,
      minimum: param.minimum,
      maximum: param.maximum,
      initial_value: param.initial_value,
      module: param.module,
    })) || [];
    console.log("userCalibrationTuningParameters:", userCalibrationTuningParameters.value);

    // set output variables
    outputVariables.value = calibrationTuningModules?.value?.flatMap((module: any) => module?.output_variables?.map((outputVar: any) => ({
      name: outputVar.name,
      description: outputVar.description,
      module: module.name,
    }))) || [];
  } else {
    toast.add({ severity: 'warn', summary: 'Tuning Modules not loaded', detail: 'Must set Formulation data before proceeding' });
  }

  // console.log("outputVariables:", outputVariables.value);

  // console.log("loadTuningTabData:", loadTuningTabData?.value._data);
  // console.log("userCalibrationRunData:", userCalibrationRunData.value);
  // console.log("calibration_times:", userCalibrationRunData.value?.calibration_times);
  // console.log("validation_times:", userCalibrationRunData.value?.validation_times);
  // console.log("time_range:", userCalibrationRunData.value?.time_range);

  // set calibration times
  if (userCalibrationRunData?.value?.calibration_times) {
    const { simulation_start_time, simulation_end_time, calibration_start_time, calibration_end_time } = userCalibrationRunData.value.calibration_times;

    simStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
    // console.log("simStartTime:", simStartTime.value);

    simEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
    // console.log("simEndTime:", simEndTime.value);

    calStartTime.value = DateTime.fromISO(calibration_start_time, { zone: 'utc' });
    // console.log("calStartTime:", calStartTime.value);

    calEndTime.value = DateTime.fromISO(calibration_end_time, { zone: 'utc' });
    // console.log("calEndTime:", calEndTime.value);
  };

  // set automatic validation times
  if (userCalibrationRunData?.value?.validation_times) {
    const { simulation_start_time, simulation_end_time, validation_start_time, validation_end_time } = userCalibrationRunData.value.validation_times;

    avSimStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
    // console.log("avSimStartTime:", avSimStartTime.value);

    avSimEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
    // console.log("avSimEndTime:", avSimEndTime.value);

    avCalStartTime.value = DateTime.fromISO(validation_start_time, { zone: 'utc' });
    // console.log("avCalStartTime:", avCalStartTime.value);

    avCalEndTime.value = DateTime.fromISO(validation_end_time, { zone: 'utc' });
    // console.log("avCalEndTime:", avCalEndTime.value);
  };

  // set time range
  const timeRange = userCalibrationRunData?.value?.time_range;
  // check if timeRange is provided and not empty
  if (timeRange?.start_time && timeRange?.end_time) {
    rangeDateFrom.value = timeRange?.start_time;
    rangeDateTo.value = timeRange?.end_time;
  } else {
    // time_range is not set. Cannot proceed
    toast.add({ severity: 'warn', summary: 'Time Range not set', detail: 'Must set Forcing and Observational data before proceeding' });
  }

  // set ouput variable to calibrate
  if (userCalibrationRunData?.value?.output_variable_to_calibrate) {
    console.log("userCalibrationRunData.value.output_variable_to_calibrate:", userCalibrationRunData.value.output_variable_to_calibrate);
    const { name, module } = userCalibrationRunData.value.output_variable_to_calibrate;
    userOutputVariableToCalibrate.value.name = name;
    userOutputVariableToCalibrate.value.module = module;
    selectedOutputVariable.value = userOutputVariableToCalibrate.value;
    // console.log('selectedOutputVariable:', selectedOutputVariable.value);
  };

  isInitialSetupDone.value = true; // set to true after initial setup

  useListen('calibrationButtonPrev', (actionButton) => {
    if (getCalibrationTabIndex() == 4 && actionButton === "PREV") {
      const tabs = document.getElementsByClassName("tabs");
      const e = <HTMLElement>tabs[2];
      e.click();
    }
  });

  useListen('calibrationButtonNext', (actionButton) => {
    if (getCalibrationTabIndex() == 4 && actionButton === "NEXT") {
      if (!(calStartTime.value && calEndTime.value && simStartTime.value && simEndTime.value)) {
        toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "All Calibration Times are required.", life: 3000 })
      }
      if (!(avSimStartTime.value && avSimEndTime.value && avCalStartTime.value && avCalEndTime.value)) {
        toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "All Automatic Validation Times are required.", life: 3000 })
      }
      if (!userOutputVariableToCalibrate.value.name) {
        toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "No Output Variable selected.", life: 3000 })
      }
      toast.removeAllGroups();
      gotoNext();
    }
  });

  /**
   * Save Tuning Tab data
   */
  useListen('calibrationButtonSaveStart', (actionButton) => {
    // handle saving Tuning Tab data
    const handleSaveTuningTab = async () => {
      const saveTuningTabResponse = await postSaveTuningTabData();
      console.log(
        `saveTabContent Tuning, should be tabIndex 4, on tabIndex ${getCalibrationTabIndex()}, save response: `,
        saveTuningTabResponse
      );

      if (saveTuningTabResponse?.ok) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Saved Tuning Tab data',
          life: 3000,
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error saving Tuning Tab data'
        });
      }
    };

    // check if the current tab is the Tuning tab and the actionButton is 'SAVE'
    if (getCalibrationTabIndex() === 4 && actionButton === 'SAVE') {
      // check if Tuning Tab data is validated before saving
      if (isTuningTabDataValidated()) {
        handleSaveTuningTab();
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Calibration Tab not 3 or actionButton not SAVE',
      });
      console.error('getCalibrationTabIndex:', getCalibrationTabIndex());
      console.error('actionButton:', actionButton);
    }
  });
});

onUnmounted(() => {
  emitterOff('calibrationButtonSaveStart');
  emitterOff('calibrationButtonNext');
  emitterOff('calibrationButtonPrev');
})


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
  console.log("formulationNameInput:", formulationNameInput.value);
  if (formulationNameInput.value == "" && selectedModuleValues?.value.length === 0 && slothParameterInputs?.value.length === 0) {
    console.log('formulation is not set');
    return false;
  } else {
    console.log('formulation is set');
    return true;
  }
};

const handleCalibrationTimeControlsClick = (event: Event) => {
  if (!isTimeRangeSet()) {
    event.preventDefault(); // Prevent any default action if time_range is not set
    toast.add({ severity: 'warn', summary: 'Calibration Tuning Controls disabled', detail: 'You cannot interact with time controls because Forcing and Observational data is not set.'});
  }
};

const handleFormulationNotSet = (event: Event) => {
  if (!isFormulationDataSet()) {
    event.preventDefault(); // Prevent any default action
    toast.add({ severity: 'warn', summary: 'Output Variables and Parameters disabled', detail: 'You cannot interact with output variables or paraemters because Formulation data is not set.' });
  }
};

const handleSimStartUpdate = (value: any) => {
  // console.log('handleSimStartUpdate called');
  if (typeof value === 'string') {
    simStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  // console.log('typeof simStartTime:', typeof simStartTime.value);
  // console.log('simStartTime:', simStartTime.value);
};

const handleSimEndUpdate = (value: any) => {
  // console.log('handleSimEndUpdate called');
  if (typeof value === 'string') {
    simEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  // console.log('typeof simEndTime:', typeof simEndTime.value);
  // console.log('simEndTime:', simEndTime.value);
};

const handleCalStartUpdate = (value: any) => {
  // console.log('handleCalStartUpdate called');
  if (typeof value === 'string') {
    calStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  // console.log('typeof calStartTime:', typeof calStartTime.value);
  // console.log('calStartTime:', calStartTime.value);
};

const handleCalEndUpdate = (value: any) => {
  // console.log('handleCalEndUpdate called');
  if (typeof value === 'string') {
    calEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  // console.log('typeof calEndTime:', typeof calEndTime.value);
  // console.log('calEndTime:', calEndTime.value);
};

const handleAvSimStartUpdate = (value: any) => {
  // console.log('handleAvSimStartUpdate called');
  if (typeof value === 'string') {
    avSimStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  // console.log('typeof avSimStartTime:', typeof avSimStartTime.value);
  // console.log('avSimStartTime:', avSimStartTime.value);
};

const handleAvSimEndUpdate = (value: any) => {
  // console.log('handleAvSimEndUpdate called');
  if (typeof value === 'string') {
    avSimEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  //   console.log('typeof avSimEndTime:', typeof avSimEndTime.value);
  //   console.log('avSimEndTime:', avSimEndTime.value);
};

const handleAvCalStartUpdate = (value: any) => {
  // console.log('handleAvCalStartUpdate called');
  if (typeof value === 'string') {
    avCalStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  // console.log('typeof avCalStartTime:', typeof avCalStartTime.value);
  // console.log('avCalStartTime:', avCalStartTime.value);
};

const handleAvCalEndUpdate = (value: any) => {
  // console.log('handleAvCalEndUpdate called');
  if (typeof value === 'string') {
    avCalEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  // console.log('typeof avCalEndTime:', typeof avCalEndTime.value);
  // console.log('avCalEndTime:', avCalEndTime.value);
  // console.log('avCalEndTimeString:', avCalEndTime.value.toISO());
};

// watch for changes to selected output variable
watch(selectedOutputVariable, () => {
  // find module for newly-selected output variable
  const module = loadTuningTabData?.value?._data?.modules?.find((module: any) => module?.output_variables?.find((outputVar: any) => outputVar?.name === selectedOutputVariable?.value.name));

  // set userOutputVariableToCalibrate with newly-selected output variable
  userOutputVariableToCalibrate.value = {
    name: selectedOutputVariable?.value.name,
    module: module?.name,
  }
  console.log("selectedOutputVariable:", selectedOutputVariable.value);
  console.log("userOutputVariableToCalibrate:", userOutputVariableToCalibrate.value);
});

// watch for changes to simStartTime
watch(simStartTime, () => {
  // console.log('watch simStartTime called');
  // console.log('typeof simStartTime:', typeof simStartTime.value);
  // console.log('simStartTime:', simStartTime.value);
  const simStartTimeString = simStartTime.value.toISO();
  // console.log('simStartTimeString:', simStartTimeString);

  if ((!calStartTime.value || !isValidDateTime(calStartTime.value)) && simStartTime.value && isValidDateTime(simStartTime.value)) {
    calStartTime.value = simStartTime.value.plus({ years: 1 }); // set calStartTime to one year after simStartTime
    // console.log('calStartTime:', calStartTime.value);
    const calStartTimeString = calStartTime.value.toISO();
    // console.log('calStartTimeString:', calStartTimeString);
  }
  else if ((!calStartTime.value || !isValidDateTime(calStartTime.value)) && simStartTime.value && typeof simStartTime.value === 'string') {
    // console.log('simStartTime.value is a string. This should not happen'); // the simStartTime binding might call this watch function when it is a string. ooof.
    const simStartDateTime = DateTime.fromISO(simStartTime.value, { zone: 'utc' });
    calStartTime.value = simStartDateTime.value.plus({ years: 1 });
    // console.log('calStartTime:', calStartTime.value);
  }
});

// watch for changes to avSimStartTime
watch(avSimStartTime, () => {
  // console.log('watch avSimStartTime called');
  // console.log('typeof avSimStartTime:', typeof avSimStartTime.value);
  // console.log('avSimStartTime:', avSimStartTime.value);
  const avSimStartTimeString = avSimStartTime.value.toISO();
  // console.log('avSimStartTimeString:', avSimStartTimeString);

  if ((!avCalStartTime.value || !isValidDateTime(avCalStartTime.value)) && avSimStartTime.value && isValidDateTime(avSimStartTime.value)) {
    avCalStartTime.value = avSimStartTime.value.plus({ years: 1 });
    // console.log('avCalStartTime:', avCalStartTime.value);
    const avCalStartTimeString = avCalStartTime.value.toISO();
    // console.log('avCalStartTimeString:', avCalStartTimeString);
  }
  else if ((!avCalStartTime.value || !isValidDateTime(avCalStartTime.value)) && avSimStartTime.value && typeof avSimStartTime.value === 'string') {
    // console.log('avSimStartTime.value is a string. This should not happen'); // the avSimStartTime binding might call this watch function when it is a string. ooof.
    const avSimStartDateTime = DateTime.fromISO(avSimStartTime.value, { zone: 'utc' });
    avCalStartTime.value = avSimStartDateTime.value.plus({ years: 1 });
    // console.log('avCalStartTime:', avCalStartTime.value);
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
      toast.add({ severity: 'error', summary: 'File upload failed' });
      console.error('File upload failed:', error);
    }
  } else {
    toast.add({ severity: 'error', summary: 'No file selected' });
    console.error('No file selected');
  }
};

/**
 * Add selected calibration tuning parameter to the table when Add / Update button is clicked
 */
const addParameterToTable = () => {
  const parameter = calibrationTuningParameters?.value?.find(param => param.name === selectedParameter.value);
  const isParameterAlreadyInTable = userCalibrationTuningParameters?.value?.find(param => param.name === selectedParameter.value);

  // add parameter to table if it is not already in the table
  if (!isParameterAlreadyInTable && parameter) {
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
const updateCalibrationTuningParameter = (index: number, field: string, ev: Event) => {
  const valEv = ev.target as HTMLInputElement;
  const value = valEv?.value;
  // update userCalibrationTuningParameters with the new value
  userCalibrationTuningParameters.value[index][field] = value;

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
  return areCalibrationTimesValidated() || areValidationTimesValidated() || areParametersValidated() || isOutputVariableValidated();
};

/**
 * Validate calibration_times
 * @param fullValidation If true, perform full validation. If false, perform partial validation
 */
const areCalibrationTimesValidated = (fullValidation: boolean = true): boolean => {
  // check if time_range is not set
  if (fullValidation && (!rangeDateFrom.value || !rangeDateTo.value)) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'time_range must be set' });
    return false;
  }

  // check if calibration_times are not set
  if (fullValidation && (!simStartTime.value || !simEndTime.value || !calStartTime.value || !calEndTime.value)) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'calibration_times must be set' });
    return false;
  }

  // convert times to Date objects
  const rangeStartDate = new Date(rangeDateFrom.value);
  const rangeEndDate = new Date(rangeDateTo.value);
  const simStartDate = simStartTime.value.toJSDate();
  const simEndDate = simEndTime.value.toJSDate();
  const calStartDate = calStartTime.value.toJSDate();
  const calEndDate = calEndTime.value.toJSDate();

  // check if time_range and calibration_times are null after converted to Date objects
  if (!rangeStartDate || !rangeEndDate || !simStartDate || !simEndDate || !calStartDate || !calEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range and/or calibration_times cannot be converted to Date objects' });
    return false;
  }

  // set conditions to check if calibration_times are not within time_range
  const isSimStartWithinRange = simStartDate >= rangeStartDate && simStartDate <= rangeEndDate;
  const isSimEndWithinRange = simEndDate >= rangeStartDate && simEndDate <= rangeEndDate;
  const isCalStartWithinRange = calStartDate >= rangeStartDate && calStartDate <= rangeEndDate;
  const isCalEndWithinRange = calEndDate >= rangeStartDate && calEndDate <= rangeEndDate;

  // check if calibration_times are not within time_range
  if (!isSimStartWithinRange || !isSimEndWithinRange || !isCalStartWithinRange || !isCalEndWithinRange) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'calibration_times must be within time_range' });
    return false;
  }

  // check if simulation_end_time is not after simulation_start_time
  if (simStartDate >= simEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'simulation_end_time must be after simulation_start_time' });
    return false;
  }

  // check if calibration_start_time is not within simulation_start_time and simulation_end_time
  if (calStartDate <= simStartDate || calStartDate > simEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'calibration_start_time must be within simulation_start_time and simulation_end_time' });
    return false;
  }

  // check if calibration_end_time is not after calibration_start_time and within simulation_end_time
  if (calEndDate <= calStartDate || calEndDate > simEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'calibration_end_time must be after calibration_start_time and within simulation_end_time' });
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

  // check if automatic_validation is enabled and validation_times are set
  if (automatic_validation.value) {
    if (!avSimStartTime.value || !avSimEndTime.value || !avCalStartTime.value || !avCalEndTime.value) {
      toast.add({ severity: 'warn', summary: 'Warning', detail: 'If Automatic Validation is enabled, Validation Times Controls must be set' });
      return false;
    }
  }

  // convert times to Date objects
  const avSimStartDate = avSimStartTime.value.toJSDate();
  const avSimEndDate = avSimEndTime.value.toJSDate();
  const avCalStartDate = avCalStartTime.value.toJSDate();
  const avCalEndDate = avCalEndTime.value.toJSDate();
  const rangeStartDate = new Date(rangeDateFrom.value)
  const rangeEndDate = new Date(rangeDateTo.value);

  // check if Date objects are valid
  if (!avSimStartDate || !avSimEndDate || !avCalStartDate || !avCalEndDate || !rangeStartDate || !rangeEndDate) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range and/or validation_times cannot be converted to Date objects' });
    return false;
  }

  // if calibration_times are set, check if validation_times are not after calibration_times
  if ((simStartTime.value && simEndTime.value && calStartTime.value && calEndTime.value)) {
    // convert simeEndTime to Date object. simEndTime is the lastest time within calibration_times
    const simEndDate = simEndTime.value.toJSDate();

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
      toast.add({ severity: 'warn', summary: 'Warn', detail: 'All validation_times must be after calibration_times' });
      return false;
    }
  }

  // check if avSimEndDate is not after avSimStartDate
  if (avSimStartDate >= avSimEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Automatic Validation Simulation End must be after Simulation Start' });
    return false;
  }

  // check if avCalStartDate is not within avSimStartDate and avSimEndDate
  if (avCalStartDate < avSimStartDate || avCalStartDate > avSimEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Automatic Validation Calibration Start must be within Simulation Start and End' });
    return false;
  }

  // check if avCalEndDate is not after avCalStartDate and not less than avSimEndDate
  if (avCalEndDate <= avCalStartDate || avCalEndDate > avSimEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Automatic Validation Calibration End must be after Calibration Start and less than or equal to Automatic Validation Simulation End' });
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
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'At least one Calibration Tuning Parameter must be added' });
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
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Output Variable to Calibrate must be selected' });
    return false;
  }
  return true;
};

const gotoNext = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[4];
  e.click();
}

// const getGroups = (groups: string[]) => {
//   let txt = "";
//   groups.forEach(element => {
//     txt += element;
//     if (groups[groups.length - 1] !== element) {
//       txt += ", ";
//     }
//   });
//   return txt;
// }

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
