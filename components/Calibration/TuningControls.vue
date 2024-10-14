<template>
  <div id="TuningControls" class="w-full">
    <div class="mt-3 mb-2">
      <div v-if="rangeDateFrom && rangeDateTo" class="w-full text-left mt-1 text-xl c-blue-primary1 font-bold"
        id="RangeDates">
        RANGE: {{ format(rangeDateFrom) }} GMT to {{ format(rangeDateTo) }} GMT
      </div>
    </div>
    <div class="grid grid-cols-2">

      <div class="col-span-2">
        <div id="BoxLeft" class="text-left">
          <div id="BoxTopLeft" class="pt-2">
            <span class="tabTitles font-bold">Calibration Time Controls <span class="font-normal"><small>(* All
                  times entered must be in GMT)</small></span></span>
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
                      <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div>  -->
                    </td>
                    <td class="pl-6 w-1/6">
                      <label for="SimulationEnd" class="whitespace-nowrap">Simulation End:</label>
                    </td>
                    <td class="text-left w-2/6" style="position: relative;">
                      <VueDatePicker id="SimulationEnd" class="datePickers dp__theme_dark" v-model="simEndTime"
                        time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                        @update:model-value="handleSimEndUpdate" :disabled="!isTimeRangeSet()" />
                      <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div> -->
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
                     <!-- /<div v-if="!isTimeRangeSet()" class="overlay"></div> -->
                    </td>
                    <td class="pl-6 w-1/6">
                      <label for="CalibrationEnd" class="whitespace-nowrap">Calibration End:</label>
                    </td>
                    <td class="text-left w-2/6" style="position: relative;">
                      <VueDatePicker id="CalibrationEnd" class="datePickers dp__theme_dark" v-model="calEndTime"
                        time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                        @update:model-value="handleCalEndUpdate" :disabled="!isTimeRangeSet()" />
                      <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div> -->
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
                        <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div> -->

                      </td>
                      <td class="pl-6 w-1/6">
                        <label for="ValSimulationEnd" class="whitespace-nowrap">Simulation End:</label>
                      </td>
                      <td class="text-left w-2/6" style="position: relative;">
                        <VueDatePicker id="ValSimulationEnd" class="datePickers dp__theme_dark" v-model="avSimEndTime"
                          time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                          @update:model-value="handleAvSimEndUpdate" :disabled="!isTimeRangeSet()" />
                        <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div> -->
                      </td>

                    </tr>
                    <tr>

                      <td class="w-1/6">
                        <label for="ValidationStart" class="whitespace-nowrap">Validation Start:</label>
                      </td>
                      <td class="text-left w-2/6" style="position: relative;">
                        <VueDatePicker id="ValidationStart" class="datePickers dp__theme_dark" v-model="avCalStartTime"
                          time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                          @update:model-value="handleAvCalStartUpdate" :disabled="!isTimeRangeSet()" />
                        <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div> -->
                      </td>
                      <td class="pl-6 w-1/6">
                        <label for="ValidationEnd" class="whitespace-nowrap">Validation End:</label>
                      </td>
                      <td class="text-left w-2/6" style="position: relative;">
                        <VueDatePicker id="ValidationEnd" class="datePickers dp__theme_dark" v-model="avCalEndTime"
                          time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                          @update:model-value="handleAvCalEndUpdate" :disabled="!isTimeRangeSet()" />
                        <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div> -->
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

        <div class="col-span-1">
          <div class="mt-6 mb-3 hr"></div>
          <div class="mb-2 font-bold">Output Variable To Calibrate</div>
          <div class="mt-2 text-sm">
            <Select id="OutVar" class="varInputs" v-model="selectedOutputVariable" :disabled="!isFormulationDataSaved()"
              :options="outputVariables" optionLabel="name" optionValue="name" >
            </Select>
            <!-- <div v-if="!isFormulationDataSaved()" class="overlay"></div> -->
          </div>

          <div class="text-left mt-2">
            <div class="font-bold">Calibratable Parameters:</div>
            <Select id="ParamName" class="varInputs mt-1" v-model="selectedParameter"
              :disabled="!isFormulationDataSaved()" :options="calibrationTuningParameters" optionLabel="name" optionValue="name" >
              <template #option="slotProps">
                <div>{{ slotProps.option.name }} &nbsp; ({{ slotProps.option.module }})</div>
              </template>
            </Select>
            <div id="UploadParams" class="ngenButtonDiv-alt bg-blue4 inline ml-3">
              <button @click="addCalibrationTuningParameter" :disabled="!isFormulationDataSaved()">Add</button>
            </div>
            <!-- <div v-if="!isFormulationDataSaved()" class="overlay"></div> -->
          </div>

        </div>

        <div class="col-span-1">
          <div class="mt-5 mb-3 hr"></div>

          <div class="mb-2 font-bold">Calibration Tuning Parameters</div>
          <div id="UploadParams" class="ngenButtonDiv-alt bg-blue4 inline ml-3" style="position: relative;">
            <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />
            <button @click="triggerFileInput" :disabled="!isFormulationDataSaved()">Load Parameters File
              (optional)</button>
            <div v-if="!isFormulationDataSaved()" class="overlay"></div>
          </div>


        </div>

      </div>
    </div>

    <div id="TuningDataList" class="mt-2 mb-2" style="position: relative;">
      <ContextMenu :pt="{ root: { id: 'tuning-context-menu' } }" class="bg-white" ref="tuningContextMenu"
        :model="cmTuningParameterData"></ContextMenu>
      <DataTable :value="userSelectedCalibrationTuningParameters" scrollable scroll-height="200px"
        v-model:selection="selectedTuningParamaterData" selectionMode="single" contextMenu
        v-model:contextMenuSelection="selectedTuningParamaterData" @rowContextmenu="onRowContextMenu">
        <!-- parameter column, uneditable -->
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
      <!-- <div v-if="!isFormulationDataSaved()" class="overlay"></div> -->
    </div>
  </div>

  <div class="grid grid-rows-1 mt-8" id="Tuningbuttons">
    <div id="TuningBottomButtons" class="grid grid-cols-8">
      <span v-if="userCalibrationRunData?.status !== 'Running'">
        <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
          <button class="font-normal" title="Save" aria-label="Save Button" @click="saveTuningData()">
            Save
          </button>
        </div>
      </span>
      <span v-else>
        <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">&nbsp;</div>
      </span>

      <span v-if="userCalibrationRunData?.status !== 'Running'">
        <div class="col-span-1 mr-3">
          <button class="c-blue font-normal text-xl underline pt-1" title="Reset Button" @click="resetTuningData()"
            aria-label="Reset Button">Reset</button>
        </div>
      </span>

      <span v-else>
        <div class="col-span-1 mr-3">&nbsp;</div>
      </span>

      <div class="col-span-4">&nbsp;</div>
      <div class="col-span-1">
        <div><button class="ngenButtonDiv ml-6 font-normal h-8 float-right" title="Previous Tab Button"
            aria-label="Previous Tab Button" @click="goPrevTab()">Prev</button></div>
      </div>
      <div class="col-span-1 mr-4">
        <div><button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Tab Button" aria-label="Next Tab Button"
            @click="goNextTab()">Next</button></div>
      </div>

    </div>
  </div>

  <div class="waitgif" v-if="isLoading">
    <img src="@/assets/styles/img/wait.gif" />
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
const { loadTuningTabStaticData, saveTuningTabData, hardResetTuningStore } = tuningStore;
const {
  loadTuningTabData,
  simStartTime,
  simEndTime,
  calStartTime,
  calEndTime,
  calibrationTuningParameters,
  userSelectedCalibrationTuningParameters,
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
const selectedParameter = ref<any>(null);
const selectedOutputVariable = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isInitialSetupDone = ref(false);
const selectedTuningParamaterData = ref();
const tuningContextMenu = ref();

const cmTuningParameterData = ref([
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteCalibrationTuningParameter(selectedTuningParamaterData) }
]);

const onRowContextMenu = (event: any) => {
  tuningContextMenu.value.show(event.originalEvent);
};

onMounted(async () => {
  toast.removeAllGroups();

  // fetch user calibration data
  await fetchUserCalibrationRunData(); // how often should this be called? every visit to the Tuning tab?

  // if Tuning Tab static data is not loaded, fetch it
  if (loadTuningTabData?.value?._data?.modules.length === 0) {
    console.log("fetching Tuning Tab data");
    await loadTuningTabStaticData();
    console.log("loadTuningTabData after fetch from Tuning tab:", loadTuningTabData.value);
  } else {
    console.log("Tuning Tab data already loaded. No need to fetch");
  }

  // set time range
  const timeRange = loadTuningTabData.value?._data?.time_range;
  // check if timeRange is provided and not empty
  if (timeRange?.start_time && timeRange?.end_time) {
    rangeDateFrom.value = timeRange?.start_time;
    rangeDateTo.value = timeRange?.end_time;
    console.log("rangeDateFrom:", rangeDateFrom.value);
    console.log("rangeDateTo:", rangeDateTo.value);
  }

  calibrationTuningModules.value = loadTuningTabData.value?._data?.modules;
  console.log("calibrationTuningModules:", calibrationTuningModules.value);

  if (calibrationTuningModules?.value.length > 0) {
    // set calibration tuning parameters dropdown if not already set
    if (!calibrationTuningParameters.value || calibrationTuningParameters.value.length === 0) {
      calibrationTuningParameters.value = calibrationTuningModules?.value?.flatMap((module: any) => module?.parameters?.map((param: any) => ({
        name: param.name,
        minimum: param.minimum,
        maximum: param.maximum,
        initial_value: param.initial_value,
        user_selected_for_tuning: param.user_selected_for_tuning,
        module: module.name,
      }))) || [];
      console.log("calibrationTuningParameters:", calibrationTuningParameters.value);
    }

    // set calibration tuning parameters data table with user-selected parameters set to true if not already set, but without the user_selected_for_tuning flag
    if (!userSelectedCalibrationTuningParameters.value || userSelectedCalibrationTuningParameters.value.length === 0) {
      userSelectedCalibrationTuningParameters.value = calibrationTuningParameters.value?.filter((param: any) => param?.user_selected_for_tuning)?.map((param: any) => ({
        name: param.name,
        minimum: param.minimum,
        maximum: param.maximum,
        initial_value: param.initial_value,
        module: param.module,
      })) || [];
      console.log("userSelectedCalibrationTuningParameters:", userSelectedCalibrationTuningParameters.value);
    }

    // set output variables if not already set
    if (!outputVariables.value || outputVariables.value.length === 0) {
      outputVariables.value = calibrationTuningModules?.value?.flatMap((module: any) => module?.output_variables?.map((outputVar: any) => ({
        name: outputVar.name,
        description: outputVar.description,
        module: module.name,
      }))) || [];
      console.log("outputVariables:", outputVariables.value);
    }
  }

  // set calibration times
  if (userCalibrationRunData?.value?.calibration_times) {
    const { simulation_start_time, simulation_end_time, calibration_start_time, calibration_end_time } = userCalibrationRunData.value.calibration_times;

    // set calibration times only if they are not already set
    // if a user purposely removes all times, they will be reset to the default values. Is that what we want?
    if (!isValidDateTime(simStartTime.value) && !isValidDateTime(simEndTime.value) && !isValidDateTime(calStartTime.value) && !isValidDateTime(calEndTime.value)) {
      simStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
      simEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
      calStartTime.value = DateTime.fromISO(calibration_start_time, { zone: 'utc' });
      calEndTime.value = DateTime.fromISO(calibration_end_time, { zone: 'utc' });
    }
  };

  // set automatic validation times
  if (userCalibrationRunData?.value?.validation_times) {
    const { simulation_start_time, simulation_end_time, validation_start_time, validation_end_time } = userCalibrationRunData.value.validation_times;

    // set automatic validation times only if they are not already set
    // if a user purposely removes all times, they will be reset to the default values. Is that what we want?
    if (!isValidDateTime(avSimStartTime.value) && !isValidDateTime(avSimEndTime.value) && !isValidDateTime(avCalStartTime.value) && !isValidDateTime(avCalEndTime.value)) {
      avSimStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
      avSimEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
      avCalStartTime.value = DateTime.fromISO(validation_start_time, { zone: 'utc' });
      avCalEndTime.value = DateTime.fromISO(validation_end_time, { zone: 'utc' });
    }
  };

  // set ouput variable to calibrate
  if (userCalibrationRunData?.value?.output_variable_to_calibrate) {
    console.log("userCalibrationRunData.value.output_variable_to_calibrate:", userCalibrationRunData.value.output_variable_to_calibrate);
    const { name, module } = userCalibrationRunData.value.output_variable_to_calibrate;

    // set output variable to calibrate only if it is not already set
    if (!selectedOutputVariable.value){
      userOutputVariableToCalibrate.value.name = name;
      userOutputVariableToCalibrate.value.module = module;
      selectedOutputVariable.value = userOutputVariableToCalibrate.value.name;
    }
  };

  isInitialSetupDone.value = true; // set to true after initial setup
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
 * Check if formulation data has been saved
 * @returns boolean
 */
const isFormulationDataSaved = (): boolean => {
  if (formulationNameInput.value == "" && selectedModuleValues?.value.length === 0 && slothParameterInputs?.value.length === 0) {
    // console.log('formulation is not set');
    return false;
  } else {
    // console.log('formulation is set');
    return true;
  }
};

const handleCalibrationTimeControlsClick = (event: Event) => {
  if (!isTimeRangeSet()) {
    event.preventDefault(); // Prevent any default action if time_range is not set
    toast.add({ severity: 'warn', summary: 'Calibration Tuning Controls disabled', detail: 'You cannot interact with time controls because Forcing and Observational data is not set.', life: 5000 });
  }
};

const handleOutputVariablesParametersClick = (event: Event) => {
  if (!isFormulationDataSaved()) {
    event.preventDefault(); // Prevent any default action
    toast.add({ severity: 'warn', summary: 'Output Variables and Parameters disabled', detail: 'You cannot interact with output variables or paraemters because Formulation data has not been saved.', life: 5000 });
  }
};

const handleSimStartUpdate = (value: any) => {
  if (typeof value === 'string') {
    simStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleSimEndUpdate = (value: any) => {
  if (typeof value === 'string') {
    simEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleCalStartUpdate = (value: any) => {
  if (typeof value === 'string') {
    calStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleCalEndUpdate = (value: any) => {
  if (typeof value === 'string') {
    calEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleAvSimStartUpdate = (value: any) => {
  if (typeof value === 'string') {
    avSimStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleAvSimEndUpdate = (value: any) => {
  if (typeof value === 'string') {
    avSimEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleAvCalStartUpdate = (value: any) => {
  if (typeof value === 'string') {
    avCalStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleAvCalEndUpdate = (value: any) => {
  if (typeof value === 'string') {
    avCalEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
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
  console.log("selectedOutputVariable:", selectedOutputVariable.value);
  console.log("userOutputVariableToCalibrate:", userOutputVariableToCalibrate.value);
});

// watch for changes to simStartTime. If simStartTime is set, set calStartTime to one year after simStartTime
watch(simStartTime, () => {
  if ((!calStartTime.value || !isValidDateTime(calStartTime.value)) && simStartTime.value && isValidDateTime(simStartTime.value)) {
    calStartTime.value = simStartTime.value.plus({ years: 1 }); // set calStartTime to one year after simStartTime
  }
  else if ((!calStartTime.value || !isValidDateTime(calStartTime.value)) && simStartTime.value && typeof simStartTime.value === 'string') {
    // console.log('simStartTime.value is a string. This should not happen'); // the simStartTime binding might call this watch function when it is a string. ooof.
    const simStartDateTime = DateTime.fromISO(simStartTime.value, { zone: 'utc' });
    calStartTime.value = simStartDateTime.value.plus({ years: 1 });
  }
});

// watch for changes to avSimStartTime. If avSimStartTime is set, set avCalStartTime to one year after avSimStartTime
watch(avSimStartTime, () => {
  if ((!avCalStartTime.value || !isValidDateTime(avCalStartTime.value)) && avSimStartTime.value && isValidDateTime(avSimStartTime.value)) {
    avCalStartTime.value = avSimStartTime.value.plus({ years: 1 });
  }
  else if ((!avCalStartTime.value || !isValidDateTime(avCalStartTime.value)) && avSimStartTime.value && typeof avSimStartTime.value === 'string') {
    const avSimStartDateTime = DateTime.fromISO(avSimStartTime.value, { zone: 'utc' });
    avCalStartTime.value = avSimStartDateTime.value.plus({ years: 1 });
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

      if (response?._data.user_parameter_file) {
        // Populate the Parameter table with the data from user-uploaded file
        response._data?.user_parameter_file?.forEach((param: any) => {
          if (param.param && param.min && param.max && param.init && param.model) {
            userSelectedCalibrationTuningParameters?.value?.push({
              name: param.param,
              minimum: param.min,
              maximum: param.max,
              initial_value: param.init,
              module: param.model, // module?
            });
          } else {
            toast.add({ severity: 'warn', summary: 'Invalid data in parameter file' , life: 5000});
          }
        });
      } else {
        toast.add({ severity: 'warn', summary: 'No data in parameter file', life: 5000 });
      }
    } catch (error) {
      toast.add({ severity: 'warn', summary: 'File upload failed', life: 5000 });
      console.error('File upload failed:', error);
    }
  } else {
    toast.add({ severity: 'warn', summary: 'No file selected', life: 5000 });
    console.error('No file selected');
  }
};

/**
 * Add selected calibration tuning parameter to the table when Add / Update button is clicked
 */
const addCalibrationTuningParameter = () => {
  const parameter = calibrationTuningParameters?.value?.find(param => param.name === selectedParameter.value);
  const isParameterAlreadyInTable = userSelectedCalibrationTuningParameters?.value?.find(param => param.name === selectedParameter.value);

  // add parameter to table if it is not already in the table
  if (!isParameterAlreadyInTable && parameter) {
    userSelectedCalibrationTuningParameters?.value?.push({
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
  // update userSelectedCalibrationTuningParameters with the new value
  userSelectedCalibrationTuningParameters.value[index][field] = value;

  // update calibrationTuningParameters with the new value
  const parameter = calibrationTuningParameters?.value?.find(param => param.name === userSelectedCalibrationTuningParameters.value[index].name);
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
 * Delete Calibration Tuning Parameter from the table
 */
const deleteCalibrationTuningParameter = (selectedTuningParamaterData: any) => {
  userSelectedCalibrationTuningParameters.value = userSelectedCalibrationTuningParameters.value.filter((param: any) => param.name !== selectedTuningParamaterData.value.name);
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
 * Calibration and Validation times must either be fully set or empty (not partially set) to be valid
 * @returns boolean
 */
const isTuningTabDataValidated = () => {
  return (areCalibrationTimesFullySetOrEmpty() && areValidationTimesFullySetOrEmpty()) && (areCalibrationTimesValidated() || areValidationTimesValidated() || areParametersValidated() || isOutputVariableValidated());
};

/**
 * Check if all calibration times are set or empty
 * @returns boolean
 */
const areCalibrationTimesFullySetOrEmpty = (): boolean => {
  const areCalibrationTimesFullySet: boolean = isValidDateTime(simStartTime.value) && isValidDateTime(simEndTime.value) && isValidDateTime(calStartTime.value) && isValidDateTime(calEndTime.value);
  const areCalibrationTimesEmpty: boolean = !isValidDateTime(simStartTime.value) && !isValidDateTime(simEndTime.value) && !isValidDateTime(calStartTime.value) && !isValidDateTime(calEndTime.value);
  
  if (areCalibrationTimesFullySet || areCalibrationTimesEmpty) {
    return true;
  } else {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Calibration times must be fully set or left empty' });
    return false;
  }
};

/**
 * Check if all validation times are set or empty
 * @returns boolean
 */
const areValidationTimesFullySetOrEmpty = (): boolean => {
  const areValidationTimesFullySet: boolean = isValidDateTime(avSimStartTime.value) && isValidDateTime(avSimEndTime.value) && isValidDateTime(avCalStartTime.value) && isValidDateTime(avCalEndTime.value);
  const areValidationTimesEmpty: boolean = !isValidDateTime(avSimStartTime.value) && !isValidDateTime(avSimEndTime.value) && !isValidDateTime(avCalStartTime.value) && !isValidDateTime(avCalEndTime.value);
  
  if (areValidationTimesFullySet || areValidationTimesEmpty) {
    return true;
  } else {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Validation times must be fullly set or left empty' });
    return false;
  }
};

/**
 * Validate calibration_times
 * @returns boolean
 */
const areCalibrationTimesValidated = (): boolean => {
  // check if time_range is not set
  if (!rangeDateFrom.value || !rangeDateTo.value) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'time_range must be set' });
    return false;
  }

  // check if all calibration_times are not set
  if (!isValidDateTime(simStartTime.value) && !isValidDateTime(simEndTime.value) && !isValidDateTime(calStartTime.value) && !isValidDateTime(calEndTime.value)) {
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
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range and/or calibration_times cannot be converted to Date objects', life: 5000 });
    return false;
  }

  // set conditions to check if calibration_times are not within time_range
  const isSimStartWithinRange = simStartDate >= rangeStartDate && simStartDate <= rangeEndDate;
  const isSimEndWithinRange = simEndDate >= rangeStartDate && simEndDate <= rangeEndDate;
  const isCalStartWithinRange = calStartDate >= rangeStartDate && calStartDate <= rangeEndDate;
  const isCalEndWithinRange = calEndDate >= rangeStartDate && calEndDate <= rangeEndDate;

  // check if calibration_times are not within time_range
  if (!isSimStartWithinRange || !isSimEndWithinRange || !isCalStartWithinRange || !isCalEndWithinRange) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'calibration_times must be within time_range', life: 5000 });
    return false;
  }

  // check if simulation_end_time is not after simulation_start_time
  if (simStartDate >= simEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'simulation_end_time must be after simulation_start_time', life: 5000 });
    return false;
  }

  // check if calibration_start_time is not within simulation_start_time and simulation_end_time
  if (calStartDate <= simStartDate || calStartDate > simEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'calibration_start_time must be within simulation_start_time and simulation_end_time', life: 5000 });
    return false;
  }

  // check if calibration_end_time is not after calibration_start_time and within simulation_end_time
  if (calEndDate <= calStartDate || calEndDate > simEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'calibration_end_time must be after calibration_start_time and within simulation_end_time' , life: 5000});
    return false;
  }

  return true;
};

/**
 * Validate validation_times
 * @returns boolean
 */
const areValidationTimesValidated = (): boolean => {
  // check if automatic_validation is not enabled
  if (!automatic_validation.value) {
    return true;
  }

  // check if all validation_times are not set
  if (!isValidDateTime(avSimStartTime.value) && !isValidDateTime(avSimEndTime.value) && !isValidDateTime(avCalStartTime.value) && !isValidDateTime(avCalEndTime.value)) {
    return false;
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
    toast.add({ severity: 'error', summary: 'Error', detail: 'time_range and/or validation_times cannot be converted to Date objects', life: 5000 });
    return false;
  }

  // if calibration_times are set, check if validation_times are not after calibration_times
  if ((isValidDateTime(simStartTime.value) && isValidDateTime(simEndTime.value) && isValidDateTime(calStartTime.value) && isValidDateTime(calEndTime.value))) {
    // convert simeEndTime to Date object. simEndTime is the lastest time within calibration_times
    const simEndDate = simEndTime.value.toJSDate();

    // set conditions to check if validation_times are not after calibration_times
    const isAvSimStartAfterCalEnd = avSimStartDate > simEndDate;
    const isAvSimEndAfterCalEnd = avSimEndDate > simEndDate;
    const isAvCalStartAfterCalEnd = avCalStartDate > simEndDate;
    const isAvCalEndAfterCalEnd = avCalEndDate > simEndDate;

    // check if validation_times are not after calibration_times
    if (!isAvSimStartAfterCalEnd || !isAvSimEndAfterCalEnd || !isAvCalStartAfterCalEnd || !isAvCalEndAfterCalEnd) {
      toast.add({ severity: 'warn', summary: 'Warn', detail: 'All validation_times must be after calibration_times', life: 5000 });
      return false;
    }
  }

  // check if avSimEndDate is not after avSimStartDate
  if (avSimStartDate >= avSimEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Automatic Validation Simulation End must be after Simulation Start', life: 5000 });
    return false;
  }

  // check if avCalStartDate is not within avSimStartDate and avSimEndDate
  if (avCalStartDate < avSimStartDate || avCalStartDate > avSimEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Automatic Validation Calibration Start must be within Simulation Start and End', life: 5000 });
    return false;
  }

  // check if avCalEndDate is not after avCalStartDate and not less than avSimEndDate
  if (avCalEndDate <= avCalStartDate || avCalEndDate > avSimEndDate) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Automatic Validation Calibration End must be after Calibration Start and less than or equal to Automatic Validation Simulation End', life: 5000 });
    return false;
  }

  return true;
};

/**
 * Validate parameters
 * @returns boolean
 */
const areParametersValidated = (): boolean => {
  // check if no Calibration Tuning Parameters have been added TODO: add more parameter validation checks here. e.g. check if min < max, etc.
  if (userSelectedCalibrationTuningParameters.value.length === 0) {
    // toast.add({ severity: 'warn', summary: 'Warning', detail: 'At least one Calibration Tuning Parameter must be added' });
    return false;
  }

  return true;
};

/**
 * Validate output_variable_to_calibrate
 * @returns boolean
 */
const isOutputVariableValidated = (): boolean => {
  // check if Output Variable to Calibrate is set
  if (!userOutputVariableToCalibrate.value.name || !userOutputVariableToCalibrate.value.module) {
    // toast.add({ severity: 'warn', summary: 'Warning', detail: 'Output Variable to Calibrate must be selected' });
    return false;
  }
  return true;
};

const gotoNext = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_optimizationMetrics];
  e.click();
}

/**
  * Save Tuning Tab data
  */
const saveTuningData = () => {
  // handle saving Tuning Tab data
  const handleSaveTuningTab = async () => {
    const saveTuningTabResponse = await saveTuningTabData();
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

  // check if Tuning Tab data is validated before saving
  if (isTuningTabDataValidated()) {
    handleSaveTuningTab();
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Tuning Data Is Not Valid',
      detail: 'You must provide valid calibration times, validation times, output variable to calibrate, or calibration tuning parameters before saving.',
    });
  }
};

/**
 * Reset Tuning Tab data
 */
  const resetTuningData = () => {
  // hardResetTuningStore(); // disable for now
};

const goPrevTab = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_formulation];
  e.click();
};

const goNextTab = () => {
  let err = false;
  let txt = "Please correct the following:";
  if (!(userCalibrationRunData.value?.calibration_times.calibration_end_time &&
    userCalibrationRunData.value?.calibration_times.calibration_start_time &&
    userCalibrationRunData.value?.calibration_times.simulation_end_time &&
    userCalibrationRunData.value?.calibration_times.simulation_start_time)) {
    txt += "\nAll Calibration Times are required.";
    err = true;
  }
  if (!(userCalibrationRunData.value?.validation_times.simulation_end_time &&
    userCalibrationRunData.value?.validation_times.simulation_start_time &&
    userCalibrationRunData.value?.validation_times.validation_end_time &&
    userCalibrationRunData.value?.validation_times.validation_start_time)) {
    txt += "\nAll Automatic Validation Times are required."
    err = true;
  }
  if (!userOutputVariableToCalibrate.value.name) {
    txt += "\nNo Output Variable selected."
    err = true;
  }
  if(!(userCalibrationRunData?.value?.output_variable_to_calibrate?.module)) {
    txt += "\nNo Output Varialbe to calibration"
  }
  if(!(userCalibrationRunData?.value?.parameters_selected)) {
    txt += "\nNo Paramters selected"
  }

  if (err) {
    toast.add({ severity: 'warn', summary: "Tab data is incomplete", detail: txt, life: 5000 });
    return;
  }
  gotoNext();
};

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

.p-select-width {
  width: 100%;
}
</style>
