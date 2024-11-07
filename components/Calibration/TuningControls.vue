<template>
  <div id="TuningControls" class="">
    <div class="mt-3 mb-2">
      <div v-if="rangeDateFrom && rangeDateTo" class="text-left mt-1 text-xl c-blue-primary1 font-bold" id="RangeDates">
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
                      <label for="SimulationStart" class="whitespace-nowrap">Simulation Start </label>
                    </td>
                    <td class="text-left w-2/6" style="position: relative;">
                      <VueDatePicker id="SimulationStart" class="datePickers dp__theme_dark" v-model="simStartTime"
                        time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                        @update:model-value="handleSimStartUpdate" :disabled="!isTimeRangeSet()" />
                      <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div>  -->
                    </td>
                    <td class="pl-6 w-1/6">
                      <label for="SimulationEnd" class="whitespace-nowrap">Simulation End </label>
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
                      <label for="CalibrationStart" class="whitespace-nowrap">Calibration Start </label>
                    </td>
                    <td class="text-left w-2/6" style="position: relative;">
                      <VueDatePicker id="CalibrationStart" class="datePickers dp__theme_dark" v-model="calStartTime"
                        time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                        @update:model-value="handleCalStartUpdate" :disabled="!isTimeRangeSet()" />
                      <!-- /<div v-if="!isTimeRangeSet()" class="overlay"></div> -->
                    </td>
                    <td class="pl-6 w-1/6">
                      <label for="CalibrationEnd" class="whitespace-nowrap">Calibration End </label>
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
                          Start </label>
                      </td>
                      <td class="text-left w-2/6" style="position: relative;">
                        <VueDatePicker id="ValSimulationStart" class="datePickers dp__theme_dark"
                          v-model="avSimStartTime" time-picker-inline text-input utc='preserve'
                          format="yyyy-MM-dd HH:00" @update:model-value="handleAvSimStartUpdate"
                          :disabled="!isTimeRangeSet()" />
                        <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div> -->

                      </td>
                      <td class="pl-6 w-1/6">
                        <label for="ValSimulationEnd" class="whitespace-nowrap">Simulation End </label>
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
                        <label for="ValidationStart" class="whitespace-nowrap">Validation Start </label>
                      </td>
                      <td class="text-left w-2/6" style="position: relative;">
                        <VueDatePicker id="ValidationStart" class="datePickers dp__theme_dark" v-model="avCalStartTime"
                          time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                          @update:model-value="handleAvCalStartUpdate" :disabled="!isTimeRangeSet()" />
                        <!-- <div v-if="!isTimeRangeSet()" class="overlay"></div> -->
                      </td>
                      <td class="pl-6 w-1/6">
                        <label for="ValidationEnd" class="whitespace-nowrap">Validation End </label>
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


  <div class="pr-2">

    <div class="text-left">
      <div class="grid grid-cols-2 pb-3">

        <div class="col-span-2">
          <div class="mt-6 mb-3 hr"></div>
          <div class="mb-2 font-bold">Output Variable To Calibrate</div>
          <div class="mt-2 text-sm">
            <Select id="OutVar" class="varInputs" v-model="selectedOutputVariable" :disabled="!isFormulationDataSaved()"
              :options="outputVariables" optionLabel="output" optionValue="output">
            </Select>
            <!-- <div v-if="!isFormulationDataSaved()" class="overlay"></div> -->
          </div>
        </div>

        <div class="col-span-2 mt-5 mb-3 hr"></div>

        <div class="col-span-2">


          <div class="mb-2 font-bold mt-2">Calibration Tuning Parameters</div>
          <div id="UploadParams" class="ngenButtonDiv-alt bg-blue4 inline ml-3" style="position: relative;">
            <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />
            <button @click="triggerFileInput" :disabled="!isFormulationDataSaved()">Load Parameters File
              (optional)</button>
            <div v-if="!isFormulationDataSaved()" class="overlay"></div>
          </div>
        </div>

        <div class="col-span-1 mt-2">
          <div class="text-left mt-2">
            <div class="font-bold">Calibratable Parameters</div>
            <Select id="ParamName" class="varInputs mt-1" v-model="selectedParameter"
              :disabled="!isFormulationDataSaved()" :options="calibrationTuningParameters" optionLabel="output"
              optionValue="output">
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

        <div class="col-span-1 mt-2 relative">
          <button class="c-blue font-normal underline absolute bottom-[-5px] right-3 text-lg">Clear</button>
        </div>

      </div>
    </div>

    <div id="TuningDataList" class="mt-2 mb-10 overflow-auto max-h-[200px]" style="position: relative;">

      <ContextMenu :pt="{ root: { id: 'tuning-context-menu' } }" class="bg-white" ref="tuningContextMenu"
        :model="cmTuningParameterData"></ContextMenu>
      <DataTable :value="userSelectedCalibrationTuningParameters" scrollable scroll-height="200px"
        v-model:selection="selectedTuningParameterData" selectionMode="single" contextMenu
        v-model:contextMenuSelection="selectedTuningParameterData" @rowContextmenu="onRowContextMenu">
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

  <div class="grid grid-rows-1 mt-8 ActionButtonsBox" id="Tuningbuttons">
    <div id="TuningBottomButtons" class="grid grid-cols-8">
      <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
        <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
          <button class="font-normal" title="Save" aria-label="Save Button" @click="saveTuningData()">
            Save
          </button>
        </div>
      </span>
      <span v-else>
        <div class="col-span-1 mr-6 h-8 whitespace-nowrap">
          Run on {{ formatDateForRunOnString(startTimeDate) }}
        </div>
      </span>

      <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
        <div class="col-span-1 mr-3">
          <!--<button class="c-blue font-normal text-xl underline pt-1" title="Reset Button" @click="resetTuningData()"
            aria-label="Reset Button">Reset</button>-->
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
  <DynamicDialog />
  <div class="waitgif" v-if="isLoading">
    <img src="@/assets/styles/img/wait.gif" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { DateTime } from "luxon";
import Select from "primevue/select";

import { isValidDate, isValidDateTime, isNotNullOrUndefined } from "~/utils/CommonHelpers";
import { formatDateForDisplay, calculateTimeRange } from "~/utils/TimeHelpers";
import { generalStore } from "~/stores/common/GeneralStore";
import { useFormulationStore } from "~/stores/calibration/FormulationStore";
import { useRunStatusStore } from "~/stores/calibration/RunStatusStore";
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { makeProtectedApiCall } from '~/composables/UserAuth';
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { ifHydrofabricErrorsExist } from "~/utils/TuningControlsHelpers";
import { formatDateForRunOnString } from "~/utils/TimeHelpers";
import { useDialog } from "primevue/usedialog";
import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";
import type { DatePickerProps } from "primevue/datepicker";

const dialog = useDialog();
const nextPrevDialogOpened = ref<boolean>(false);

const format = formatDateForDisplay;
const isLoading = ref(false);

const { calibrationJobId } = storeToRefs(generalStore());
const { getCalibrationTabIndex } = generalStore();
const { ngencerfBaseUrl } = useBackendConfig();
const userDataStore = useUserDataStore();
const tuningStore = useTuningStore();
const runStatusStore = useRunStatusStore();
const { startTimeDate } = storeToRefs(useRunStatusStore());

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
  saveTuningTabRequestBody
} = storeToRefs(tuningStore);

const toast = useToast();
const selectedParameter = ref<any>(null);
const selectedOutputVariable = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isInitialSetupDone = ref(false);
const selectedTuningParameterData = ref();
const tuningContextMenu = ref();

const cmTuningParameterData = ref([
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteCalibrationTuningParameter(selectedTuningParameterData) }
]);

const onRowContextMenu = (event: any) => {
  tuningContextMenu.value.show(event.originalEvent);
};

let mainLeftAreaElement: HTMLElement | null = null;
let dataTableElement: HTMLElement | null = null;

onMounted(async () => {
  toast.removeAllGroups();

  mainLeftAreaElement = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (mainLeftAreaElement) { mainLeftAreaElement.scrollTo(0, 0); }

  // Check to see if there is a job. If not, don't initialize this tab!
  if (calibrationJobId.value) {
    // fetch user calibration data
    await fetchUserCalibrationRunData(); // how often should this be called? every visit to the Tuning tab?

    // if Tuning Tab static data is not loaded, fetch it
    if (loadTuningTabData?.value?._data?.modules.length === 0) {
      // console.log("fetching Tuning Tab data");
      await loadTuningTabStaticData();
      // console.log("loadTuningTabData after fetch from Tuning tab:", loadTuningTabData.value);
    } else {
      // console.log("Tuning Tab data already loaded. No need to fetch");
    }

    // check if Hydrofabric errors exist
    const hydrofabricErrorMessage = loadTuningTabData.value ? ifHydrofabricErrorsExist(loadTuningTabData.value._data) : '';
    if (hydrofabricErrorMessage) {
      toast.add({ severity: 'error', summary: 'Hydrofabric Error', detail: hydrofabricErrorMessage });
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

    // set output variable to calibrate
    if (userCalibrationRunData?.value?.output_variable_to_calibrate) {
      // console.log("userCalibrationRunData.value.output_variable_to_calibrate:", userCalibrationRunData.value.output_variable_to_calibrate);
      const { name, module } = userCalibrationRunData.value.output_variable_to_calibrate;

      // set output variable to calibrate only if it is not already set
      if (!selectedOutputVariable.value) {
        userOutputVariableToCalibrate.value.name = name;
        userOutputVariableToCalibrate.value.module = module;
        selectedOutputVariable.value = `${name} (${module})`;
      }
    };

    isInitialSetupDone.value = true; // set to true after initial setup
  } else {
    toast.add({ severity: 'warn', summary: 'No Calibration Job ID', detail: 'No calibration job ID found. Please go back to the Calibration Runs tab and select a job.' });
  }
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
    toast.add({ severity: 'warn', summary: 'Calibration Tuning Controls disabled', detail: 'You cannot interact with time controls because Forcing and Observational data is not set.' });
  }
};

const handleOutputVariablesParametersClick = (event: Event) => {
  if (!isFormulationDataSaved()) {
    event.preventDefault(); // Prevent any default action
    toast.add({ severity: 'warn', summary: 'Output Variables and Parameters disabled', detail: 'You cannot interact with output variables or parameters because Formulation data has not been saved.' });
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
  // get output variable object from newly-selected output variable
  const outputVariable = outputVariables?.value?.find((outputVar: any) => outputVar?.output === selectedOutputVariable?.value);

  // find module for newly-selected output variable
  const module = loadTuningTabData?.value?._data?.modules?.find((module: any) => module?.output_variables?.find((outputVar: any) => outputVar?.name === outputVariables.name));

  // set userOutputVariableToCalibrate with newly-selected output variable
  userOutputVariableToCalibrate.value = {
    name: outputVariable?.name,
    module: module?.name,
  }
  // console.log("selectedOutputVariable:", selectedOutputVariable.value);
  // console.log("userOutputVariableToCalibrate:", userOutputVariableToCalibrate.value);
});

// watch for changes to simStartTime. If simStartTime is set, set calStartTime to one year after simStartTime if not already set
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

// watch for changes to simEndTime. If simEndTime is set, set calEndTime to be the same as simEndTime if not already set
watch(simEndTime, () => {
  if ((!calEndTime.value || !isValidDateTime(calEndTime.value)) && simEndTime.value && isValidDateTime(simEndTime.value)) {
    calEndTime.value = simEndTime.value;
  }
  else if ((!calEndTime.value || !isValidDateTime(calEndTime.value)) && simEndTime.value && typeof simEndTime.value === 'string') {
    const simEndDateTime = DateTime.fromISO(simEndTime.value, { zone: 'utc' });
    calEndTime.value = simEndDateTime.value;
  }
});

// watch for changes to avSimStartTime. If avSimStartTime is set, set avCalStartTime to one year after avSimStartTime if not already set
watch(avSimStartTime, () => {
  if ((!avCalStartTime.value || !isValidDateTime(avCalStartTime.value)) && avSimStartTime.value && isValidDateTime(avSimStartTime.value)) {
    avCalStartTime.value = avSimStartTime.value.plus({ years: 1 });
  }
  else if ((!avCalStartTime.value || !isValidDateTime(avCalStartTime.value)) && avSimStartTime.value && typeof avSimStartTime.value === 'string') {
    const avSimStartDateTime = DateTime.fromISO(avSimStartTime.value, { zone: 'utc' });
    avCalStartTime.value = avSimStartDateTime.value.plus({ years: 1 });
  }
});

// watch for changes to avSimEndTime. If avSimEndTime is set, set avCalEndTime to be the same as avSimEndTime if not already set
watch(avSimEndTime, () => {
  if ((!avCalEndTime.value || !isValidDateTime(avCalEndTime.value)) && avSimEndTime.value && isValidDateTime(avSimEndTime.value)) {
    avCalEndTime.value = avSimEndTime.value;
  }
  else if ((!avCalEndTime.value || !isValidDateTime(avCalEndTime.value)) && avSimEndTime.value && typeof avSimEndTime.value === 'string') {
    const avSimEndDateTime = DateTime.fromISO(avSimEndTime.value, { zone: 'utc' });
    avCalEndTime.value = avSimEndDateTime.value;
  }
});

/**
 * Trigger file input dialog
 */
const triggerFileInput = () => {
  if (fileInput.value) {
    if (fileInput.value.value) {
      // console.log('fileInput.value.value is not empty. Resetting value');
      fileInput.value.value = '';
    }
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
  let errorMessage = '';
  let invalidParameters: any[] = [];
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
          if (
            isNotNullOrUndefined(param.param) &&
            isNotNullOrUndefined(param.min) &&
            isNotNullOrUndefined(param.max) &&
            isNotNullOrUndefined(param.init) &&
            isNotNullOrUndefined(param.model)) {
            // check if parameter is in the calibrationTuningParameters list, which is the list of calibratable parameters
            const isParameterInCalibratableList = calibrationTuningParameters?.value?.some((paramData: any) => paramData.name === param.param);

            // if parameter is not in the list of calibratable parameters, add it to the list of invalid parameters
            if (!isParameterInCalibratableList) {
              invalidParameters.push(param.param);
            }

            // check if parameter is already in the table
            const isParameterAlreadyInTable = userSelectedCalibrationTuningParameters?.value?.some((paramData: any) => paramData.name === param.param);

            // if parameter we are adding is already in the table, delete the parameter from the table so we can override it
            if (isParameterAlreadyInTable) {
              userSelectedCalibrationTuningParameters.value = userSelectedCalibrationTuningParameters?.value?.filter((paramData: any) => paramData.name !== param.param);
            }

            // add parameter to the table if it is in the list of calibratable parameters
            if (isParameterInCalibratableList) {
              userSelectedCalibrationTuningParameters?.value?.push({
                name: param.param,
                minimum: param.min,
                maximum: param.max,
                initial_value: param.init,
                module: param.model, // module?
              });
            }
          } else {
            errorMessage = response._data?.message;
            toast.add({ severity: 'error', summary: 'Invalid data in parameter file', detail: errorMessage });
          }
        });

        // scroll to the bottom of the page and table
        scrollToBottom();

        if (invalidParameters.length > 0) {
          toast.add({ severity: 'warn', summary: 'Invalid parameters in parameter file', detail: `The following parameters are not in the list of calibratable parameters: ${invalidParameters.join(', ')}` });
        }
      } else {
        toast.add({ severity: 'warn', summary: 'No data in parameter file' });
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'File upload failed' });
      console.error('File upload failed:', error);
    }
  } else {
    toast.add({ severity: 'warn', summary: 'No file selected' });
    console.error('No file selected');
  }
};

/**
 * Add selected calibration tuning parameter to the table when Add / Update button is clicked
 */
const addCalibrationTuningParameter = () => {
  const parameter = calibrationTuningParameters?.value?.find(param => param.output === selectedParameter.value);
  const isParameterAlreadyInTable = userSelectedCalibrationTuningParameters?.value?.find(param => param.name === parameter.name);

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

  // scroll to the bottom of the page and table
  scrollToBottom();
};

/**
 * Scroll page and table to the bottom
 */
const scrollToBottom = () => {
  // grab main left area and data table elements and scroll to bottom
  // using nextTick to ensure elements are up to date before scrolling
  nextTick(() => {
    mainLeftAreaElement = document.getElementById("MainLeftDataArea") as HTMLElement;
    dataTableElement = document.querySelector(".p-datatable-table-container") as HTMLElement;

    if (mainLeftAreaElement) {
      mainLeftAreaElement.scrollTo({
        top: mainLeftAreaElement.scrollHeight,
        behavior: 'smooth'
      });
    }

    if (dataTableElement) {
      dataTableElement.scrollTo({
        top: dataTableElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
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
const deleteCalibrationTuningParameter = (selectedTuningParameterData: any) => {
  userSelectedCalibrationTuningParameters.value = userSelectedCalibrationTuningParameters.value.filter((param: any) => param.name !== selectedTuningParameterData.value.name);
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
 * Validate and build save_tuning_tab request body. Return false if validation fails
 * @returns boolean
 */
const validateAndBuildRequestBody = (): boolean => {
  saveTuningTabRequestBody.value.calibration_run_id = calibrationJobId.value;

  if (areCalibrationTimesSet()) {
    if (areCalibrationTimesValidated()) {
      saveTuningTabRequestBody.value.calibration_times = {
        simulation_start_time: simStartTime.value,
        simulation_end_time: simEndTime.value,
        calibration_start_time: calStartTime.value,
        calibration_end_time: calEndTime.value
      };
    } else {
      return false;
    }
  }
  if (areValidationTimesSet()) {
    if (areValidationTimesValidated()) {
      saveTuningTabRequestBody.value.validation_times = {
        simulation_start_time: avSimStartTime.value,
        simulation_end_time: avSimEndTime.value,
        validation_start_time: avCalStartTime.value,
        validation_end_time: avCalEndTime.value
      };
    } else {
      return false;
    }
  }

  saveTuningTabRequestBody.value.automatic_validation = automatic_validation.value;

  if (areTuningParametersSet()) {
    saveTuningTabRequestBody.value.parameters = userSelectedCalibrationTuningParameters.value;
  }

  if (isOutputVariableSet()) {
    saveTuningTabRequestBody.value.output_variable_to_calibrate = userOutputVariableToCalibrate.value;
  }

  if (Object.keys(saveTuningTabRequestBody.value).length === 0) {
    toast.add({ severity: 'error', summary: 'No data to save', detail: 'No valid data has been entered to save'});
    return false;
  }

  return true;
};

/**
 * Check if all calibration times are set
 * @returns boolean
 */
const areCalibrationTimesSet = (): boolean => {
  return simStartTime.value && simEndTime.value && calStartTime.value && calEndTime.value;
};

/**
 * Check if all validation times are set
 * @returns boolean
 */
const areValidationTimesSet = (): boolean => {
  return avSimStartTime.value && avSimEndTime.value && avCalStartTime.value && avCalEndTime.value;
};

/**
 * Validate calibration_times
 * @returns boolean
 */
const areCalibrationTimesValidated = (): boolean => {
  // check if time_range is not set
  if (!rangeDateFrom.value || !rangeDateTo.value) {
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'time_range must be set' });
    return false;
  }

  // check if all calibration_times are not valid
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
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'time_range and/or calibration_times cannot be converted to Date objects'});
    return false;
  }

  // set conditions to check if calibration_times are not within time_range
  const isSimStartWithinRange = simStartDate >= rangeStartDate && simStartDate <= rangeEndDate;
  const isSimEndWithinRange = simEndDate >= rangeStartDate && simEndDate <= rangeEndDate;
  const isCalStartWithinRange = calStartDate >= rangeStartDate && calStartDate <= rangeEndDate;
  const isCalEndWithinRange = calEndDate >= rangeStartDate && calEndDate <= rangeEndDate;

  // check if calibration_times are not within time_range
  if (!isSimStartWithinRange || !isSimEndWithinRange || !isCalStartWithinRange || !isCalEndWithinRange) {
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'calibration_times must be within time_range'});
    return false;
  }

  // check if simulation_end_time is not after simulation_start_time
  if (simStartDate >= simEndDate) {
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'simulation_end_time must be after simulation_start_time'});
    return false;
  }

  // check if calibration_start_time is not within simulation_start_time and simulation_end_time
  if (calStartDate <= simStartDate || calStartDate > simEndDate) {
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'calibration_start_time must be within simulation_start_time and simulation_end_time'});
    return false;
  }

  // check if calibration_end_time is not after calibration_start_time and within simulation_end_time
  if (calEndDate <= calStartDate || calEndDate > simEndDate) {
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'calibration_end_time must be after calibration_start_time and within simulation_end_time'});
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

  // check if all validation_times are not valid
  if (!isValidDateTime(avSimStartTime.value) && !isValidDateTime(avSimEndTime.value) && !isValidDateTime(avCalStartTime.value) && !isValidDateTime(avCalEndTime.value)) {
    return false;
  }

  // convert times to Date objects
  const avSimStartDate = avSimStartTime.value.toJSDate();
  const avSimEndDate = avSimEndTime.value.toJSDate();
  const avCalStartDate = avCalStartTime.value.toJSDate();
  const avCalEndDate = avCalEndTime.value.toJSDate();
  const rangeStartDate = new Date(rangeDateFrom.value);
  const rangeEndDate = new Date(rangeDateTo.value);

  // check if Date objects are valid
  if (!avSimStartDate || !avSimEndDate || !avCalStartDate || !avCalEndDate || !rangeStartDate || !rangeEndDate) {
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'time_range and/or validation_times cannot be converted to Date objects for validation' });
    return false;
  }

  // if calibration_times are set, check if:
  // - validation simulation times do not encompass both calibration and validation times
  // - calibration times and validation times  do not overlap
  if ((isValidDateTime(simStartTime.value) && isValidDateTime(simEndTime.value) && isValidDateTime(calStartTime.value) && isValidDateTime(calEndTime.value))) {
    // convert times to Date objects. simEndTime is the latest time within calibration_times
    const simStartDate = simStartTime.value.toJSDate();
    const simEndDate = simEndTime.value.toJSDate();
    const calStartDate = calStartTime.value.toJSDate();
    const calEndDate = calEndTime.value.toJSDate();

    // set conditions to check if validation simulation times do not encompass both calibration and validation times
    const isAvSimStartAfterCalStart = avSimStartDate > calStartDate;
    const isAvSimEndBeforeCalEnd = avSimEndDate < calEndDate;
    const isAvSimStartAfterAvCalStart = avSimStartDate > avCalStartDate;
    const isAvSimEndBeforeAvCalEnd = avSimEndDate < avCalEndDate;

    // check if validation simulation times do not encompass both calibration and validation times
    if (isAvSimStartAfterCalStart || isAvSimEndBeforeCalEnd || isAvSimStartAfterAvCalStart || isAvSimEndBeforeAvCalEnd) {
      toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'Validation Simulation times must encompass both Calibration and Validation times'});
      return false;
    }

    // set conditions to check if calibration times and validation times overlap
    const isAvCalStartBeforeOrEqualToCalEnd = avCalStartDate <= calEndDate;
    const isAvCalEndAfterOrEqualToCalStart = avCalEndDate >= calStartDate;

    // check if calibration times and validation times overlap
    if (isAvCalStartBeforeOrEqualToCalEnd && isAvCalEndAfterOrEqualToCalStart) {
      toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'Calibration and Validation times must not overlap'});
      return false;
    }
  }

  // check if avSimEndDate is not after avSimStartDate
  if (avSimStartDate >= avSimEndDate) {
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'Validation Simulation End must be after Simulation Start'});
    return false;
  }

  // check if avCalStartDate is not within avSimStartDate and avSimEndDate
  if (avCalStartDate < avSimStartDate || avCalStartDate > avSimEndDate) {
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'Validation Calibration Start must be within Simulation Start and End'});
    return false;
  }

  // check if avCalEndDate is not after avCalStartDate and not less than avSimEndDate
  if (avCalEndDate <= avCalStartDate || avCalEndDate > avSimEndDate) {
    toast.add({ severity: 'error', summary: 'Unable to Save', detail: 'Validation Calibration End must be after Validation Calibration Start and less than or equal to Validation Simulation End'});
    return false;
  }

  return true;
};

/**
 * Check if tuning parameters are set
 * @returns boolean
 */
const areTuningParametersSet = (): boolean => {
  // check if no Calibration Tuning Parameters have been added 
  // TODO: add more parameter validation checks here. e.g. check if min < max, etc.
  if (
    userSelectedCalibrationTuningParameters.value &&
    userSelectedCalibrationTuningParameters.value.length > 0
  ) {
    return true;
  }

  return false;
};

/**
 * Check if Output Variable to Calibrate is set
 * @returns boolean
 */
const isOutputVariableSet = (): boolean => {
  // check if Output Variable to Calibrate is set
  if (userOutputVariableToCalibrate.value.name && userOutputVariableToCalibrate.value.module) {
    return true;
  }
  return false;
};

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
      const errorMessage = saveTuningTabResponse?._data.message;
      toast.add({
        severity: 'error',
        summary: 'Error Saving Tuning Tab Data',
        detail: errorMessage
      });
    }
    fetchUserCalibrationRunData();
  };

  if (!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
    toast.add({ severity: 'warn', summary: 'Unable to Save', detail: 'Update of a job already run is not allowed. Please clone to make any changes for a new calibration' });
  } else {
    // check if Tuning Tab data is validated before saving
    if (validateAndBuildRequestBody()) {
      handleSaveTuningTab();
    }
  }
};

/**
 * Reset Tuning Tab data
 */
const resetTuningData = () => {
  // hardResetTuningStore(); // disable for now
};

const validateTab = () => {
  /* Check the DateTimes */
  let error = false;
  let text = [];
  if (compareTimeEntries(userCalibrationRunData?.value?.calibration_times?.simulation_start_time || '', simStartTime.value)) {
    error = true;
    text.push("Simulation Start has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.calibration_times?.simulation_end_time || '', simEndTime.value)) {
    error = true;
    text.push("Simulation End has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.calibration_times?.calibration_start_time || '', calStartTime.value)) {
    error = true;
    text.push("Calibration Start has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.calibration_times?.calibration_end_time || '', calEndTime.value)) {
    error = true;
    text.push("Calibration End has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.validation_times?.simulation_start_time || '', avSimStartTime.value)) {
    error = true;
    text.push("Simulation Start has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.validation_times?.simulation_end_time || '', avSimEndTime.value)) {
    error = true;
    text.push("Simulation End has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.validation_times?.validation_start_time || '', avCalStartTime.value)) {
    error = true;
    text.push("Validation Start has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.validation_times?.validation_end_time || '', avCalEndTime.value)) {
    error = true;
    text.push("Validation End has changed");
  }

  /* selectedOutputVariable */
  if (selectedOutputVariable.value !== null &&
    selectedOutputVariable.value.indexOf(userCalibrationRunData?.value?.output_variable_to_calibrate.name) === -1) {
    error = true;
    text.push("Output Variable to Calibrate has changed");
  }

  return { error: error, text: text }
}

const compareTimeEntries = (txtDT: string, dT: Date) => {
  const dateProps = dT as DatePickerProps;
  if( !txtDT && dateProps.invalid ) {
    return false;
  }
  if( txtDT && dateProps.invalid ) {
    return true;
  }
  return new Date(dT).getTime() !== new Date(txtDT).getTime();
}

const restorePage = async () => {
  // set calibration times
  if (userCalibrationRunData?.value?.calibration_times) {
    const { simulation_start_time, simulation_end_time, calibration_start_time, calibration_end_time } = userCalibrationRunData.value.calibration_times;
    simStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
    simEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
    calStartTime.value = DateTime.fromISO(calibration_start_time, { zone: 'utc' });
    calEndTime.value = DateTime.fromISO(calibration_end_time, { zone: 'utc' });
  };

  // set automatic validation times
  if (userCalibrationRunData?.value?.validation_times) {
    const { simulation_start_time, simulation_end_time, validation_start_time, validation_end_time } = userCalibrationRunData.value.validation_times;
    avSimStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
    avSimEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
    avCalStartTime.value = DateTime.fromISO(validation_start_time, { zone: 'utc' });
    avCalEndTime.value = DateTime.fromISO(validation_end_time, { zone: 'utc' });
  };

  if (selectedOutputVariable.value !== null &&
    selectedOutputVariable.value.indexOf(userCalibrationRunData?.value?.output_variable_to_calibrate.name) === -1) {
  }
}

const gotoNext = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_optimizationMetrics];
  e.click();
}

const gotoPrev = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_formulation];
  e.click();
};

const goNextTab = () => {
  const errors = validateTab();
  if (errors.error) {
    showPrevNextDialog(errors.text, true);
  } else {
    gotoNext();
  }
};

const goPrevTab = () => {
  const errors = validateTab();
  if (errors.error) {
    showPrevNextDialog(errors.text, false);
  } else {
    gotoPrev();
  }
};

const showPrevNextDialog = (body: string[], next: boolean) => {
  if (!nextPrevDialogOpened.value) {
    dialog.open(MoveNextPrevDialog, {
      props: {
        header: "Unsaved changes!",
        style: {
          width: 'auto',
        },
        modal: true,
      },
      data: {
        body: body,
        direction: next
      },
      onClose: (opt) => {
        nextPrevDialogOpened.value = false;
        handleNextPrevDialogClose(opt);
      },

    })
    nextPrevDialogOpened.value = true
  }
}

const handleNextPrevDialogClose = (opt: any) => {
  if (opt.data.moveToNextResponse) {
    restorePage();
    if (opt.data.goNext) {
      gotoNext();
    } else {
      gotoPrev();
    }
  }
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

.p-select-width {
  width: 100%;
}
</style>
