<template>
  <div id="TuningControls" class="ml-3">
    <div v-if="disableAll" class="text-red-600">
      Tuning Controls cannot be set until Formulation is set on the previous tab.
    </div>
    <div :style="`opacity: ${disableAll ? '50%' : '100%'}`">
      <div class="grid grid-cols-2">
        <div class="col-span-2">
          <div id="BoxLeft" class="text-left">
            <div id="BoxTopLeft" class="pt-2">
              <span class="tabTitles text-xl font-bold" aria-label="Simulation Configuration" title="Simulation Configuration">
                Simulation Configuration
              </span>
            </div>
            <div class="mt-3 mb-2 col-span-2">
                <div v-if="dateRangeBegin && dateRangeEnd" class="text-left mt-1 c-blue-primary1 font-bold" id="RangeDates"
                :aria-label="'Range is from ' + formatDate(dateRangeBegin) + ' to ' + formatDate(dateRangeEnd)"
                :title="'Range is from ' + formatDate(dateRangeBegin) + ' to ' + formatDate(dateRangeEnd)">
                Available Date Range: {{ formatDate(dateRangeBegin) }} to {{ formatDate(dateRangeEnd) }}
                </div>
            </div>
            <div class="pt-2">
              <div class="timeBlocks datepicker-wrapper w-[695px]" @click="handleCalibrationTimeControlsClick">
                <table class="table-auto border-collapse ml-0">
                  <tbody>
                    <!-- Row 1: Simulation Start -->
                    <tr>
                      <th scope="row" class="text-left pr-4 pb-1">
                        <label for="SimulationStart" class="whitespace-nowrap required-label"
                          :class="{ 'date-picker-error': timeControlError }">Simulation Start</label>
                      </th>
                      <td colspan="2" class="text-left pb-1">
                        <div class="flex items-center gap-3">
                          <!-- Container limits width so it aligns with inputs below -->
                          <div class="max-w-xs">
                            <VueDatePicker id="SimulationStart" class="datePickers dp__theme_dark"
                              :class="{ 'date-picker-error': timeControlError }"
                              v-model="calSimStartTime" text-input utc='preserve' format="yyyy-MM-dd"
                              :enable-time-picker="false" @update:model-value="handleCalSimStartUpdate" 
                              aria-label="Calibration Time Simulation Start"
                              title="Calibration Time Simulation Start" :teleport="true"
                              v-bind="minMaxSimStartProps"
                              :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)" />
                          </div>
                          <div v-if="timeControlError" class="date-picker-error whitespace-nowrap">
                            🛑 Simulation Start with durations falls outside available date range.
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!-- Row 2: Warmup Duration -->
                    <tr>
                      <th scope="row" class="text-left pr-4 pb-1">
                        <label for="WarmupDuration" class="whitespace-nowrap required-label">Warmup Duration</label>
                      </th>
                      <td class="text-left pr-2 pb-1 w-1">
                        <InputNumber id="WarmupDuration" v-model="warmupDuration" class="w-20 p-1" 
                          aria-label="Warmup Duration" title="Warmup Duration" v-bind="minMaxWarmupDurationProps"
                          :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)">
                        </InputNumber>
                      </td>
                      <td class="text-left pb-1 align-middle whitespace-nowrap">
                        months (min 0)
                      </td>
                    </tr>

                    <!-- Row 3: Calibration Duration -->
                    <tr>
                      <th scope="row" class="text-left pr-4 pb-1">
                        <label for="CalibrationDuration" class="whitespace-nowrap required-label">Calibration Duration</label>
                      </th>
                      <td class="text-left pr-2 pb-1 w-1">
                        <InputNumber id="CalibrationDuration" v-model="calibrationDuration" class="w-20 p-1" 
                          aria-label="Calibration Duration" title="Calibration Duration" v-bind="minMaxCalibrationDurationProps"
                          :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)">
                        </InputNumber>
                      </td>
                      <td class="text-left pb-1 align-middle whitespace-nowrap">
                        months (min 1)
                      </td>
                    </tr>

                    <!-- Row 4: Validation Window -->
                    <tr>
                      <th scope="row" class="text-left pr-4 pb-1">
                        <label for="ValidationWindow" class="whitespace-nowrap required-label">Validation Window</label>
                      </th>
                      <td colspan="2" class="text-left pb-1">
                        <!-- Flex container keeps radio options tightly grouped and aligned next to each other -->
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                          <label v-for="[label, val] in [['Before', 'before'], ['After', 'after']]" :key="label as string"
                            class="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" :value="val" v-model="validationWindow" class="accent-blue-600"
                              :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"/>
                            <span>{{ label }}</span>
                          </label>
                        </div>
                      </td>
                    </tr>

                    <!-- Row 5: Calibration Duration -->
                    <tr>
                      <th scope="row" class="text-left pr-4 pb-1">
                        <label for="validationWindowGap" class="whitespace-nowrap required-label">Validation Window Gap</label>
                      </th>
                      <td class="text-left pr-2 pb-1 w-1">
                        <InputNumber id="validationWindowGap" v-model="validationWindowGap" class="w-20 p-1" 
                          aria-label="Validation Window Gap" title="Validation Window Gap" v-bind="minMaxValidationWindowGapProps"
                          :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)">
                        </InputNumber>
                      </td>
                      <td class="text-left pb-1 align-middle whitespace-nowrap">
                        months (min 0)
                      </td>
                    </tr>

                    <!-- Row 6: Validation Duration -->
                    <tr>
                      <th scope="row" class="text-left pr-4">
                        <label for="ValidationDuration" class="whitespace-nowrap required-label">Validation Duration</label>
                      </th>
                      <td class="text-left pr-2 w-1">
                        <InputNumber id="ValidationDuration" v-model="validationDuration" class="w-20 p-1" 
                          aria-label="Validation Duration" title="Validation Duration" v-bind="minMaxValidationDurationProps"
                          :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)">
                        </InputNumber>
                      </td>
                      <td class="text-left align-middle whitespace-nowrap">
                        months (min 1)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pr-2" v-if="!userCalibrationRunData?.modules?.includes('LSTM')">
        <div class="text-left">
          <div class="hr my-3"></div>
          <div>
            <div class="font-bold text-xl required-label">Output Variable To Calibrate</div>
            <Select id="OutputVariable" class="varInputs mt-1" aria-label="Output Variable To Calibrate"
              :disabled="!isFormulationDataSaved() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
              title="Output Variable To Calibrate" v-model="selectedOutputVariableToCalibrate" :options="['Streamflow']"/>
          </div>
        </div>

        <div class="hr my-3"></div>

        <div class="grid grid-cols-2 pb-3">
          <div class="col-span-2">
            <div class="mb-0 font-bold text-xl mt-2 required-label">Calibration Tuning Parameters</div>
            <div class="mb-0 font-bold mt-2">Load Calibratable Parameters from File</div>
            <div class="mb-2 font-sm italic mt-0">(file contents added to table below)</div>
            <div id="UploadParams" class=" inline ml-3" style="position: relative;">
              <Button class="ngenButtonDiv-alt" @click="uploadTuningParamsDlgOpen"
                :disabled="!isFormulationDataSaved() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                aria-label="Load Parameters from File optional" title="Load Parameters from File optional">
                Select File(s) (optional)</Button>
            </div>
          </div>

          <div class="col-span-1 mt-2">
            <div class="text-left mt-2">
              <div class="font-bold">Select Individual Calibratable Parameter</div>
              <Select id="ParamName" class="varInputs mt-1" v-model="selectedParameter"
                :disabled="!isFormulationDataSaved() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                :options="calibrationTuningParameters" optionLabel="output" optionValue="output"
                aria-label="Select Calibratable Parameters" title="Select Calibratable Parameters">
                <template #option="slotProps">
                  <div>{{ slotProps.option.name }} &nbsp; ({{ slotProps.option.module }})</div>
                </template>
              </Select>
              <div id="UploadParams" class="inline-block ml-3 mt-3" @click="addCalibrationTuningParameter">
                <Button class="ngenButtonDiv-alt" aria-label="Add Selected Calibratable Parameter Button"
                  title="Add Selected Calibratable Parameter Button"
                  :disabled="!isFormulationDataSaved() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)">Add</Button>
              </div>
            </div>
          </div>

          <div class="col-span-1 mt-2 relative">
            <Button class="c-blue font-normal underline absolute bottom-[-5px] right-3 text-lg"
              @click="clearUserSelectedCalibrationTuningParameters()" aria-label="Clear Calibratable Parameters"
              title="Clear Calibratable Parameters"
              :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)">Clear</Button>
          </div>
        </div>
      </div>

      <div id="TuningDataList" v-if="!userCalibrationRunData?.modules?.includes('LSTM')" class="mt-2 mb-10 overflow-auto max-h-[200px]" style="position: relative;">
        <ContextMenu :pt="{ root: { id: 'tuning-context-menu' } }" class="bg-white" ref="tuningContextMenu"
          :model="cmTuningParameterData"></ContextMenu>
        <DataTable :value="userSelectedCalibrationTuningParameters" scrollable scroll-height="200px"
          v-model:selection="selectedTuningParameterData" selectionMode="single" contextMenu
          v-model:contextMenuSelection="selectedTuningParameterData" @rowContextmenu="onRowContextMenu" :rowClass="rowClass"
          :rowStyle="rowStyle">

          <!-- parameter column, uneditable -->
          <Column field="parameter" header="Parameter" sortable>
            <template #body="slotProps">
              <span style="background-color: lightgrey; padding: 4px; display: block;"
                :aria-label="'Parameter name is ' + slotProps.data.name" :title="'Parameter name is' + slotProps.data.name">
                {{ slotProps.data.name }} </span>
            </template>
          </Column>

          <!-- module column, uneditable -->
          <Column field="module" header="Module" sortable>
            <template #body="slotProps">
              <span style="background-color: lightgrey; padding: 4px; display: inline-block; white-space: nowrap;"
                :aria-label="'Module name is ' + slotProps.data.module" :title="'Module name is ' + slotProps.data.module">
                {{ slotProps.data.module }}
              </span>
            </template>
          </Column>

          <!-- min column, editable -->
          <Column field="min" sortable>
            <template #header>
              <span class="p-datatable-column-title">
              <span>
                Tuning Range Min<span class="required-asterisk" aria-hidden="true">*</span>
              </span>
              </span>
            </template>
            <template #body="slotProps">
              <input type="text" v-model="slotProps.data.minimum"
                @input="updateCalibrationTuningParameter(slotProps.index, 'minimum', $event)" style="width: 100%;"
                :aria-label="'Minimum value is ' + slotProps.data.minimum"
                :title="'Minimum value is ' + slotProps.data.minimum" />
            </template>
          </Column>

          <!-- max column, editable -->
          <Column field="max" sortable>
            <template #header>
              <span class="p-datatable-column-title">
              <span>
                Tuning Range Max<span class="required-asterisk" aria-hidden="true">*</span>
              </span>
              </span>
            </template>
            <template #body="slotProps">
              <input type="text" v-model="slotProps.data.maximum"
                @input="updateCalibrationTuningParameter(slotProps.index, 'maximum', $event)" style="width: 100%;"
                :aria-label="'Maximum value is ' + slotProps.data.maximum"
                :title="'Maximum value is ' + slotProps.data.maximum" />
            </template>
          </Column>

          <!-- initValue column, editable -->
          <Column field="initValue" sortable>
            <template #header>
              <span class="p-datatable-column-title">
              <span>
                Initial Run Value<span class="required-asterisk" aria-hidden="true">*</span>
              </span>
              </span>
            </template>
            <template #body="slotProps">
              <input type="text" v-model="slotProps.data.initial_value"
                @input="updateCalibrationTuningParameter(slotProps.index, 'initial_value', $event)" style="width: 100%;"
                :aria-label="'Initial value is ' + slotProps.data.initial_value"
                :title="'Initial value is ' + slotProps.data.initial_value" />
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="grid grid-rows-1 mt-8 mb-4 ActionButtonsBox" id="Tuningbuttons">
        <div id="TuningBottomButtons" class="grid grid-cols-8">
          <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
            <div class="col-span-1 mr-6 h-8" @click="saveTuningData()">
              <Button class="font-normal ngenButtonDiv-green" title="Save" aria-label="Save Button"
                :disabled="isLoading || tuningStore_data_loading">
                Save
              </Button>
            </div>
          </span>
          <span v-else>
            <div class="col-span-1 mr-6 h-8 whitespace-nowrap">
              {{ submitTimeDate ? 'Run on ' + formatDateForRunOnString(submitTimeDate) : 'Run on Unknown Date' }}
            </div>
          </span>
          <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
            <div class="col-span-1 mr-3">
              <Button v-if="tuningDataHasChanged || calibratableParametersHaveChanged" class="ngenButtonDiv-yellow" title="Revert All Changes"
                @click="restoreTab()" aria-label="Revert All Changes" :disabled="isLoading || tuningStore_data_loading">Revert</Button>
            </div>
          </span>
          <span v-else>
            <div class="col-span-1 mr-3">&nbsp;</div>
          </span>
          <div class="col-span-4">&nbsp;</div>
          <div class="col-span-1">
            <Button class="ngenButtonDiv ml-6 font-normal h-8 float-right" title="Previous Tab Button"
              aria-label="Previous Tab Button" @click="goPrevTab()" :disabled="isLoading || tuningStore_data_loading">Prev</Button>
          </div>
          <div class="col-span-1 mr-4">
            <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Tab Button" aria-label="Next Tab Button"
              @click="goNextTab()" :disabled="isLoading || tuningStore_data_loading">Next</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DynamicDialog />
  <div class="waitgif" v-if="isLoading || tuningStore_data_loading">
    <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { DateTime } from "luxon";
import Select from "primevue/select";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";

import type { DatePickerProps } from "primevue/datepicker";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { generalStore } from "@/stores/common/GeneralStore";
import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";

import { isCalibrationJobStatusSavedOrReady, isValidDateTime, isNotNullOrUndefined } from "@/utils/CommonHelpers";
import { formatISOStringOrDateToYYYYMMDDHHMM } from "@/utils/TimeHelpers";
import { makeProtectedApiCall } from '@/composables/UserAuth';
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { ifEDSErrorsExist } from "@/utils/TuningControlsHelpers";
import { formatDateForRunOnString } from "@/utils/TimeHelpers";
import { hilightTab } from '@/composables/TabHilight';

import FileUploadDialog from "../Common/FileUploadDialog.vue";

const dialog = useDialog();
const fileUploadDialogOpened = ref<boolean>(false);
const nextPrevDialogOpened = ref<boolean>(false);
const timeControlError = ref<boolean>(false);

const formatDate = formatISOStringOrDateToYYYYMMDD;

const { addToastRecord } = generalStore();
const { isLoading } = storeToRefs(generalStore());

const { calibrationJobId } = storeToRefs(generalStore());
const { ngencerfBaseUrl } = useBackendConfig();
const userDataStore = useUserDataStore();
const tuningStore = useTuningStore();
const { submitTimeDate } = storeToRefs(useRunStatusStore());

const {
  selectedModuleValues,
  slothParameterInputs
} = storeToRefs(useFormulationStore());

const { getAccessToken } = userDataStore;
const { userCalibrationRunData } = storeToRefs(userDataStore);
const { loadTuningTabStaticData, saveTuningTabData, validateTuningTimes, validateTuningParameters } = tuningStore;
const {
  tuningStore_data_loading,
  loadTuningTabData,
  calSimStartTime,
  calSimEndTime,
  calStartTime,
  calEndTime,
  valSimStartTime,
  valSimEndTime,
  valStartTime,
  valEndTime,
  dateRangeBegin,
  dateRangeEnd,
  selectedOutputVariableToCalibrate,
  calibrationTuningParameters,
  userSelectedCalibrationTuningParameters,
  calibratableParametersHaveChanged,
  tuningDataHasChanged,
  validateTuningTimesRequestBody,
  saveTuningTabRequestBody,
  tuningParametersAreValid
} = storeToRefs(tuningStore);

const props = defineProps({
  callGoToTab: {
    type: Function,
    required: false,
  },
  callNavDialog: {
    type: Function,
    required: false,
  },
});

const toast = useToast();
const selectedParameter = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isInitialSetupDone = ref<boolean>(false);
const selectedTuningParameterData = ref();
const tuningContextMenu = ref();

// new refs to handle time calculations instead of entering all times manually
const warmupDuration = ref<number>();
const calibrationDuration = ref<number>();
const validationWindowGap = ref<number>();
const validationWindow = ref<string>('after');
const validationDuration = ref<number>();

const calSimStartTimeMin = ref<any>();
const calSimStartTimeMax = ref<any>();
const warmupDurationMin = ref<number>(0);
const calibrationDurationMin = ref<number>(1);
const validationWindowGapMin = ref<number>(0);
const validationDurationMin = ref<number>(1);

const cmTuningParameterData = ref([
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteCalibrationTuningParameter(selectedTuningParameterData) }
]);

const onRowContextMenu = (event: any) => {
  tuningContextMenu.value.show(event.originalEvent);
};

let mainLeftAreaElement: HTMLElement | null = null;
let dataTableElement: HTMLElement | null = null;

const disableAll = computed(() => {
  return !isFormulationDataSaved();
});

onMounted(async () => {
  toast.removeAllGroups();

  mainLeftAreaElement = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (mainLeftAreaElement) { mainLeftAreaElement.scrollTo(0, 0); }

  // Check to see if there is a job. If not, don't initialize this tab!
  if (calibrationJobId.value) {
    if (userCalibrationRunData?.value?.submit_date) {
      submitTimeDate.value = new Date(userCalibrationRunData.value.submit_date);
    }

    if (!userSelectedCalibrationTuningParameters.value.length) {
      selectedTuningParameterData.value = null;
    }

    await loadTuningTabStaticData(true);
    tuningStore_data_loading.value = false;

    await nextTick();

    // check if EDS errors exist
    const edsErrorMessage = loadTuningTabData.value ? ifEDSErrorsExist(loadTuningTabData.value._data) : '';
    if (edsErrorMessage) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'EDS Error', detail: edsErrorMessage, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }

    if (userSelectedCalibrationTuningParameters.value.length > 0 && !userCalibrationRunData?.value?.modules?.includes('LSTM')) {
      validateTuningParameters().then(response => {
        if (response._data.parameter_warnings) {
          tuningParametersAreValid.value = false;
          toast.removeAllGroups();
          response._data.parameter_warnings.forEach((err: any) => {
            const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Tuning Parameters Warning', detail: err, life: ToastTimeout.timeoutWarn };
            toast.add(tMsg); addToastRecord(tMsg);
          });
        } else {
          tuningParametersAreValid.value = true;
        }
      });
    }

    // set calibration times
    if (userCalibrationRunData?.value?.calibration_times && Object.keys(userCalibrationRunData.value.calibration_times).length > 0) {
      const { simulation_start_time, simulation_end_time, calibration_start_time, calibration_end_time } = userCalibrationRunData.value.calibration_times;

      // set calibration times only if they are not already set
      // if a user purposely removes all times, they will be reset to the default values. Is that what we want?
      if (!isValidDateTime(calSimStartTime.value) && !isValidDateTime(calSimEndTime.value) && !isValidDateTime(calStartTime.value) && !isValidDateTime(calEndTime.value)) {
        calSimStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
        calSimEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
        calStartTime.value = DateTime.fromISO(calibration_start_time, { zone: 'utc' });
        calEndTime.value = DateTime.fromISO(calibration_end_time, { zone: 'utc' });
      }
    };

    // set automatic validation times
    if (userCalibrationRunData?.value?.validation_times && Object.keys(userCalibrationRunData.value.validation_times).length > 0) {
      const { simulation_start_time, simulation_end_time, validation_start_time, validation_end_time } = userCalibrationRunData.value.validation_times;

      // set automatic validation times only if they are not already set
      // if a user purposely removes all times, they will be reset to the default values. Is that what we want?
      if (!isValidDateTime(valSimStartTime.value) && !isValidDateTime(valSimEndTime.value) && !isValidDateTime(valStartTime.value) && !isValidDateTime(valEndTime.value)) {
        valSimStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
        valSimEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
        valStartTime.value = DateTime.fromISO(validation_start_time, { zone: 'utc' });
        valEndTime.value = DateTime.fromISO(validation_end_time, { zone: 'utc' });
      }
    };
    if (!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
      warmupDuration.value = userCalibrationRunData?.value?.time_controls?.warmup_duration;
      calibrationDuration.value = userCalibrationRunData?.value?.time_controls?.calibration_duration;
      validationWindowGap.value = userCalibrationRunData?.value?.time_controls?.validation_window_gap;
      validationWindow.value = userCalibrationRunData?.value?.time_controls?.validation_window_after_calibration ? 'after' : 'before';
      validationDuration.value = userCalibrationRunData?.value?.time_controls?.validation_duration;
    } else if (loadTuningTabData.value?._data?.time_controls) {
      // default time control inputs based on the server response
      warmupDuration.value = loadTuningTabData.value?._data?.time_controls?.warmup_duration;
      calibrationDuration.value = loadTuningTabData.value?._data?.time_controls?.calibration_duration;
      validationWindowGap.value = loadTuningTabData.value?._data?.time_controls?.validation_window_gap;
      validationWindow.value = loadTuningTabData.value?._data?.time_controls?.validation_window_after_calibration ? 'after' : 'before';
      validationDuration.value = loadTuningTabData.value?._data?.time_controls?.validation_duration;
    }
    
    if (!isValidDateTime(calSimStartTime.value)) {
      // default start time to the first midnight UTC on or after beginning of the date range
      const begin = DateTime.fromISO(dateRangeBegin.value, { zone: 'utc' });
      calSimStartTime.value =
        begin.hour === 0 && begin.minute === 0 && begin.second === 0
          ? begin.startOf('day')
          : begin.plus({ days: 1 }).startOf('day');
    }
    
    // min/max inputs no longer come from the server response 
    // min/max times should match the total date range instead
    const minTime = DateTime.fromISO(dateRangeBegin.value,{ zone: 'utc' });
    calSimStartTimeMin.value =
      minTime.equals(minTime.startOf('day'))
        ? minTime.startOf('day')
        : minTime.plus({ days: 1 }).startOf('day');
    const maxTime = DateTime.fromISO(dateRangeEnd.value,{ zone: 'utc' });
    calSimStartTimeMax.value = maxTime.startOf('day'); 

    nextTick(() => {
      isInitialSetupDone.value = true; // set to true after initial setup
    });
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'No Calibration Job ID', detail: 'No calibration job ID found. Please go back to the Calibration Runs tab and select a job.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
  
  nextTick(() => {
    hilightTab(CalibrationTabs.tab_tuningControls);
  });

  isLoading.value = false;
});

/**
 * Check if time_range is set
 * @returns boolean
 */
const isTimeRangeSet = (): boolean => {
  const timeRange = userCalibrationRunData?.value?.time_range;
  
  if (timeRange && Object.keys(timeRange).length > 0 && dateRangeBegin.value && dateRangeEnd.value) {
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
  if (selectedModuleValues?.value.length < 2 && slothParameterInputs?.value.length === 0) {
    return false;
  } else {
    return true;
  }
};

const handleCalibrationTimeControlsClick = (event: Event) => {
  if (!isTimeRangeSet()) {
    event.preventDefault(); // Prevent any default action if time_range is not set
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Calibration Tuning Controls are disabled', detail: 'You cannot interact with time controls because Gage and Forcing Source are not set.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

const normalizeToUtcMidnight = (value: Date | string) => {
  const d = typeof value === 'string'
    ? new Date(value)
    : value;

  return new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    0, 0, 0, 0
  ));
};

const handleCalSimStartUpdate = (value: any) => {
  if (!value) return;
  calSimStartTime.value = DateTime.fromJSDate(normalizeToUtcMidnight(value), { zone: 'utc' });
};

watch([calSimStartTime, warmupDuration, calibrationDuration, validationWindowGap, validationWindow, validationDuration], (newValues, oldValues) => {
  if (
    !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status) ||
    !DateTime.isDateTime(calSimStartTime.value) ||
    !isInitialSetupDone.value
  ) return;
  if (!warmupDuration.value) warmupDuration.value = minMaxWarmupDurationProps.value.min;
  if (!calibrationDuration.value) calibrationDuration.value = minMaxCalibrationDurationProps.value.min;
  if (!validationWindowGap.value) validationWindowGap.value = minMaxValidationWindowGapProps.value.min;
  if (!['after','before'].includes(validationWindow.value)) validationWindow.value = 'after';
  if (!validationDuration.value) validationDuration.value = minMaxValidationDurationProps.value.min;
  tuningDataHasChanged.value = true;
  calculateTimeValues();
});

const calculateTimeValues = async() => {
  toast.removeAllGroups();
  if (isValidDateTime(calSimStartTime.value)) {
    validateTuningTimesRequestBody.value.calibration_run_id = calibrationJobId.value;
    validateTuningTimesRequestBody.value.time_controls = {
      simulation_start_time: calSimStartTime.value,
      warmup_duration: warmupDuration.value,
      calibration_duration: calibrationDuration.value,
      validation_window_gap: validationWindowGap.value,
      validation_window_after_calibration: validationWindow.value === 'after' ? true : false,
      validation_duration: validationDuration.value
    }
    const validateTuningTimesResponse = await validateTuningTimes();
    if (validateTuningTimesResponse.ok) {
      // set calibration times
      if (validateTuningTimesResponse?._data?.calibration_times && Object.keys(validateTuningTimesResponse._data.calibration_times).length > 0) {
        calSimEndTime.value = DateTime.fromISO(validateTuningTimesResponse._data.calibration_times.simulation_end_time, { zone: 'utc' });
        calStartTime.value = DateTime.fromISO(validateTuningTimesResponse._data.calibration_times.calibration_start_time, { zone: 'utc' });
        calEndTime.value = DateTime.fromISO(validateTuningTimesResponse._data.calibration_times.calibration_end_time, { zone: 'utc' });
        userCalibrationRunData.value.calibration_times = {
          'simulation_start_time': calSimStartTime.value,
          'simulation_end_time': calSimEndTime.value,
          'calibration_start_time': calStartTime.value,
          'calibration_end_time': calEndTime.value,
        }
      }

      // set automatic validation times
      if (validateTuningTimesResponse?._data?.validation_times && Object.keys(validateTuningTimesResponse._data.validation_times).length > 0) {
        valSimStartTime.value = DateTime.fromISO(validateTuningTimesResponse._data.validation_times.simulation_start_time, { zone: 'utc' });
        valSimEndTime.value = DateTime.fromISO(validateTuningTimesResponse._data.validation_times.simulation_end_time, { zone: 'utc' });
        valStartTime.value = DateTime.fromISO(validateTuningTimesResponse._data.validation_times.validation_start_time, { zone: 'utc' });
        valEndTime.value = DateTime.fromISO(validateTuningTimesResponse._data.validation_times.validation_end_time, { zone: 'utc' });
        userCalibrationRunData.value.validation_times = {
          'simulation_start_time': valSimStartTime.value,
          'simulation_end_time': valSimEndTime.value,
          'validation_start_time': valStartTime.value,
          'validation_end_time': valEndTime.value,
        }
      }

      timeControlError.value = false;
    } else {
      timeControlError.value = true;
    }
  } else {
    timeControlError.value = true;
  }
}

const asDateTime = (v) => {
  if (!v) return null;
  if (DateTime.isDateTime(v)) return v;
  return DateTime.fromISO(v);
};

const toPickerDate = (iso) => {
  if (!iso) return null;

  const dt = DateTime.fromISO(iso, { zone: 'utc' });

  // IMPORTANT: shift into LOCAL day boundary
  return new Date(dt.year, dt.month - 1, dt.day);
};

const minMaxSimStartProps = computed(() => {
  return {
    minDate: calSimStartTimeMin.value ? new Date(calSimStartTimeMin.value.year, calSimStartTimeMin.value.month - 1, calSimStartTimeMin.value.day) : undefined,
    maxDate: calSimStartTimeMax.value ? new Date(calSimStartTimeMax.value.year, calSimStartTimeMax.value.month - 1, calSimStartTimeMax.value.day) : undefined
  };
});

const minMaxWarmupDurationProps = computed(() => {
  return {
    min: warmupDurationMin.value ? warmupDurationMin.value : 0
  };
});

const minMaxCalibrationDurationProps = computed(() => {
  return {
    min: calibrationDurationMin.value ? calibrationDurationMin.value : 0
  };
});

const minMaxValidationWindowGapProps = computed(() => {
  return {
    min: validationWindowGapMin.value ? validationWindowGapMin.value : 0
  };
})

const minMaxValidationDurationProps = computed(() => {
  return {
    min: validationDurationMin.value ? validationDurationMin.value : 0
  };
});

const uploadTuningParamsDlgOpen = () => {
  showTuningParamsFileUploadDialog('Tuning Parameter Files')
}

const showTuningParamsFileUploadDialog = (headerText: string) => {
  if (!fileUploadDialogOpened.value) {
    dialog.open(FileUploadDialog, {
      props: {
        header: `Upload ${headerText}`,
        style: {
          width: 'auto',
        },
        modal: true,
      },
      data: {
        selectMultiple: true,
        fileExtension: '.csv',
        inputName: 'user_parameter_files[]',
        calibrationRunId: calibrationJobId.value,
        formFileField: 'user_parameter_files',
        saveFunction: saveUserTuningParamsFiles
      },
      onClose: (opt) => {
        handleDialogClose(opt)
      },
    })
    fileUploadDialogOpened.value = true
  }
}

const handleDialogClose = (opt: any) => {
  if (opt.type === 'dialog-close' && !opt.data) {
    fileUploadDialogOpened.value = false;
    return;
  }

  if (opt && opt.data) {
    if (opt.data?.saveFileResponseResult?.status !== 200) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: `File upload Error`, detail: opt.data?.saveFileResponseResult?._data?.message, life: ToastTimeout.timeoutInfo };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: `File upload Error`, detail: "There was an error when trying to upload selected file(s).", life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
  }
  fileUploadDialogOpened.value = false
}

/**
 *
 * @param formData
 * @returns {GeneralApiSaveResponse | GeneralErrorResponse}
 */
async function saveUserTuningParamsFiles(formData: FormData) {
  toast.removeAllGroups();
  const saveUserTuningParamsFilesResponse = await makeProtectedApiCall<
    GeneralApiSaveResponse | GeneralErrorResponse
  >(`${ngencerfBaseUrl}/calibration/upload_user_parameters/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: formData,
  });
  if (saveUserTuningParamsFilesResponse.error && saveUserTuningParamsFilesResponse.error === TokenExpired) {
    alert("Your session had timed out");
    navigateTo('login');
  } else if (saveUserTuningParamsFilesResponse?._data.parsed_data) {
    // Populate the Parameter table with the data from user-uploaded file
    saveUserTuningParamsFilesResponse._data?.parsed_data?.forEach((file: any) => {
      let errorMessage = '';
      let invalidParameters: any[] = [];
      if (!file?.parameters) {
        // No parameters were returned for this file, so there was an error when reading it
        errorMessage = file?.message;
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Invalid data in parameter file ' + file?.name, detail: errorMessage, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      } else {
        file.parameters.forEach((param: any) => {
          if (
            isNotNullOrUndefined(param.param) &&
            isNotNullOrUndefined(param.min) &&
            isNotNullOrUndefined(param.max) &&
            isNotNullOrUndefined(param.init) &&
            isNotNullOrUndefined(param.model)) {
            // check if parameter is in the calibrationTuningParameters list and that the module name matches, which is the list of calibratable parameters
            const isParameterInCalibratableList = calibrationTuningParameters?.value?.some((paramData: any) => paramData.name === param.param && paramData.module === param.model);

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
          }
        });
        if (invalidParameters.length > 0) {
          const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Invalid parameters in parameter file ' + file?.name, detail: `The following parameters in the uploaded file were not imported because they are not calibratable:\n ${invalidParameters.join(', ')}`, life: ToastTimeout.timeoutWarn };
          toast.add(tMsg); addToastRecord(tMsg);
        } else if (file?.message) {
          const tMsg: ToastMessageOptions = { severity: 'info', summary: `File upload Completed`, detail: file.message, life: ToastTimeout.timeoutInfo };
          toast.add(tMsg); addToastRecord(tMsg);
        }
      }
    });

    calibratableParametersHaveChanged.value = true;

    // scroll to the bottom of the page and table
    scrollToBottom();
  } else {
    errorMessage = saveUserTuningParamsFilesResponse._data?.message;
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to process parameter file(s)', detail: errorMessage, life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
  return saveUserTuningParamsFilesResponse;
}


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

  // note that calibratable parameters have changed
  calibratableParametersHaveChanged.value = true;

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
  // note that calibratable parameters have changed
  calibratableParametersHaveChanged.value = true;
};

/**
 * Delete Calibration Tuning Parameter from the table
 */
const deleteCalibrationTuningParameter = (selectedTuningParameterData: any) => {
  userSelectedCalibrationTuningParameters.value = userSelectedCalibrationTuningParameters.value.filter((param: any) => param.name !== selectedTuningParameterData.value.name);
  
  // note that calibratable parameters have changed
  calibratableParametersHaveChanged.value = true;
};

/**
 * Clear userSelectedCalibrationTuningParameters
 */
const clearUserSelectedCalibrationTuningParameters = () => {
  userSelectedCalibrationTuningParameters.value = [];
  selectedTuningParameterData.value = null;

  // note that calibratable parameters have changed
  calibratableParametersHaveChanged.value = true;
};


/**
 * Validate and build save_tuning_tab request body. Return false if validation fails
 * @returns booleanvalidateAndBuildRequestBody
 */
const validateAndBuildRequestBody = (): boolean => {
  saveTuningTabRequestBody.value.calibration_run_id = calibrationJobId.value;

  saveTuningTabRequestBody.value.time_controls = {
    simulation_start_time: calSimStartTime.value,
    warmup_duration: warmupDuration.value,
    calibration_duration: calibrationDuration.value,
    validation_window_gap: validationWindowGap.value,
    validation_window_after_calibration: validationWindow.value === 'after' ? true : false,
    validation_duration: validationDuration.value
  };

  if (areTuningParametersSet()) {
    saveTuningTabRequestBody.value.parameters = userSelectedCalibrationTuningParameters.value;

    // check if any parameter initial values are out of range
    areParameterInitialValuesOutOfRange();
  } else {
    saveTuningTabRequestBody.value.parameters = [];
  }

  if (Object.keys(saveTuningTabRequestBody.value).length === 0) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'No data to save', detail: 'No valid data has been entered to save', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  return true;
};

/**
 * Check if all calibration times are set
 * @returns boolean
 */
const areCalibrationTimesSet = (): boolean => {
  return calSimStartTime.value && calSimEndTime.value && calStartTime.value && calEndTime.value;
};

/**
 * Check if all validation times are set
 * @returns boolean
 */
const areValidationTimesSet = (): boolean => {
  return valSimStartTime.value && valSimEndTime.value && valStartTime.value && valEndTime.value;
};

/**
 * Validate calibration_times
 * @returns boolean
 */
const areCalibrationTimesValidated = (): boolean => {
  // check if time_range is not set
  if (!dateRangeBegin.value || !dateRangeEnd.value) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Unable to Save', detail: 'time_range must be set', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if all calibration_times are not valid
  if (!isValidDateTime(calSimStartTime.value) && !isValidDateTime(calSimEndTime.value) && !isValidDateTime(calStartTime.value) && !isValidDateTime(calEndTime.value)) {
    return false;
  }

  // convert times to Date objects
  const rangeStartDate = new Date(dateRangeBegin.value);
  const rangeEndDate = new Date(dateRangeEnd.value);
  const simStartDate = calSimStartTime.value.toJSDate();
  const simEndDate = calSimEndTime.value.toJSDate();
  const calStartDate = calStartTime.value.toJSDate();
  const calEndDate = calEndTime.value.toJSDate();

  // check if time_range and calibration_times are null after converted to Date objects
  if (!rangeStartDate || !rangeEndDate || !simStartDate || !simEndDate || !calStartDate || !calEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Unable to Save', detail: 'time_range and/or calibration_times cannot be converted to Date objects', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // set conditions to check if calibration_times are not within time_range
  const isSimStartWithinRange = simStartDate >= rangeStartDate && simStartDate <= rangeEndDate;
  const isSimEndWithinRange = simEndDate >= rangeStartDate && simEndDate <= rangeEndDate;
  const isCalStartWithinRange = calStartDate >= rangeStartDate && calStartDate <= rangeEndDate;
  const isCalEndWithinRange = calEndDate >= rangeStartDate && calEndDate <= rangeEndDate;

  // check if calibration_times are not within time_range
  if (!isSimStartWithinRange || !isSimEndWithinRange || !isCalStartWithinRange || !isCalEndWithinRange) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Time out of range', detail: 'Calibration times must be within time_range. Was not saved.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if simulation_end_time is not after simulation_start_time
  if (simStartDate >= simEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Simulation time problem', detail: 'simulation_end_time must be after simulation_start_time. Was not saved.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if calibration_start_time is not within simulation_start_time and simulation_end_time
  if (calStartDate < simStartDate || calStartDate > simEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Time range problem', detail: 'calibration_start_time must be within simulation_start_time and simulation_end_time. Was not saved.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if calibration_end_time is not after calibration_start_time and within simulation_end_time
  if (calEndDate <= calStartDate || calEndDate > simEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Time range problem', detail: 'calibration_end_time must be after calibration_start_time and within simulation_end_time. Was not saved.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  return true;
};

/**
 * Validate validation_times
 * @returns boolean
 */
const areValidationTimesValidated = (): boolean => {
  // check if all validation_times are not valid
  if (!isValidDateTime(valSimStartTime.value) && !isValidDateTime(valSimEndTime.value) && !isValidDateTime(valStartTime.value) && !isValidDateTime(valEndTime.value)) {
    return false;
  }

  // convert times to Date objects
  const avSimStartDate = valSimStartTime.value.toJSDate();
  const avSimEndDate = valSimEndTime.value.toJSDate();
  const avCalStartDate = valStartTime.value.toJSDate();
  const avCalEndDate = valEndTime.value.toJSDate();
  const rangeStartDate = new Date(dateRangeBegin.value);
  const rangeEndDate = new Date(dateRangeEnd.value);

  // check if Date objects are valid
  if (!avSimStartDate || !avSimEndDate || !avCalStartDate || !avCalEndDate || !rangeStartDate || !rangeEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Unable to Save', detail: 'time_range and/or validation_times cannot be converted to Date objects for validation', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // if calibration_times are set, check if:
  // - validation simulation times do not encompass both calibration and validation times
  // - calibration times and validation times  do not overlap
  if ((isValidDateTime(calSimStartTime.value) && isValidDateTime(calSimEndTime.value) && isValidDateTime(calStartTime.value) && isValidDateTime(calEndTime.value))) {
    // convert times to Date objects. calSimEndTime is the latest time within calibration_times
    const simStartDate = calSimStartTime.value.toJSDate();
    const simEndDate = calSimEndTime.value.toJSDate();
    const calStartDate = calStartTime.value.toJSDate();
    const calEndDate = calEndTime.value.toJSDate();

    // set conditions to check if validation simulation times do not encompass both calibration and validation times
    const isAvSimStartAfterCalStart = avSimStartDate > calStartDate;
    const isAvSimEndBeforeCalEnd = avSimEndDate < calEndDate;
    const isAvSimStartAfterAvCalStart = avSimStartDate > avCalStartDate;
    const isAvSimEndBeforeAvCalEnd = avSimEndDate < avCalEndDate;

    // check if validation simulation times do not encompass both calibration and validation times
    if (isAvSimStartAfterCalStart || isAvSimEndBeforeCalEnd || isAvSimStartAfterAvCalStart || isAvSimEndBeforeAvCalEnd) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Unable to Save', detail: 'Validation Simulation times must encompass both Calibration and Validation times', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
      return false;
    }

    // set conditions to check if calibration times and validation times overlap
    const isAvCalStartBeforeOrEqualToCalEnd = avCalStartDate <= calEndDate;
    const isAvCalEndAfterOrEqualToCalStart = avCalEndDate >= calStartDate;

    // check if calibration times and validation times overlap
    if (isAvCalStartBeforeOrEqualToCalEnd && isAvCalEndAfterOrEqualToCalStart) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Overlapping Times', detail: 'Calibration and Validation times must not overlap', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
      return false;
    }
  }

  // set conditions to check if validation are not within time_range
  const isAvSimStartWithinRange = avSimStartDate >= rangeStartDate && avSimStartDate <= rangeEndDate;
  const isAvSimEndWithinRange = avSimEndDate >= rangeStartDate && avSimEndDate <= rangeEndDate;
  const isAvCalStartWithinRange = avCalStartDate >= rangeStartDate && avCalStartDate <= rangeEndDate;
  const isAvCalEndWithinRange = avCalEndDate >= rangeStartDate && avCalEndDate <= rangeEndDate;

  // check if calibration_times are not within time_range
  if (!isAvSimStartWithinRange || !isAvSimEndWithinRange || !isAvCalStartWithinRange || !isAvCalEndWithinRange) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Time out of range', detail: 'Validation times must be within time_range. Was not saved.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if avSimEndDate is not after avSimStartDate
  if (avSimStartDate >= avSimEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Time error', detail: 'Validation Simulation End must be after Simulation Start', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if avCalStartDate is not within avSimStartDate and avSimEndDate
  if (avCalStartDate < avSimStartDate || avCalStartDate > avSimEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Time error', detail: 'Validation and Calibration Start must be within Simulation Start and End', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if avCalEndDate is not after avCalStartDate and not less than avSimEndDate
  if (avCalEndDate <= avCalStartDate || avCalEndDate > avSimEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Time error', detail: 'Validation and Calibration End must be after Validation Calibration Start and less than or equal to Validation Simulation End', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
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
    userSelectedCalibrationTuningParameters.value.length > 0 &&
    !userCalibrationRunData?.value?.modules?.includes('LSTM')
  ) {
    return true;
  }

  return false;
};

/**
  * Save Tuning Tab data
  */
const saveTuningData = () => {
  // handle saving Tuning Tab data
  toast.removeAllGroups();
  tuningStore_data_loading.value = true;

  calculateTimeValues();

  if (timeControlError.value) {
    const tMsg: ToastMessageOptions = {
      severity: 'error',
      summary: "Error Saving Tuning Data",
      detail: "Simulation Start with durations falls outside available date range",
      life: ToastTimeout.timeoutError,
    };
    toast.add(tMsg); addToastRecord(tMsg);
    tuningStore_data_loading.value = false;
    return;
  }

  const handleSaveTuningTab = async () => {
    const saveTuningTabResponse = await saveTuningTabData();
    if (saveTuningTabResponse?.ok) {
      if (saveTuningTabRequestBody.value?.time_controls) {
        // times and calibratable parameters were both saved
        const tMsg: ToastMessageOptions = {
          severity: 'success', summary: `Success`,
          detail: "Saved Tuning Data",
          life: ToastTimeout.timeoutSuccess
        };
        toast.add(tMsg); addToastRecord(tMsg);
      } else {
        //only calibratable parameters were saved
        const tMsg: ToastMessageOptions = {
          severity: 'info', summary: `Partial Success`,
          detail: "Saved calibratable parameters only. Calibration and Validation times still need to be set properly.",
          life: ToastTimeout.timeoutSuccess
        };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (saveTuningTabResponse._data.parameter_warnings) {
        tuningParametersAreValid.value = false;
        toast.removeAllGroups();
        saveTuningTabResponse._data.parameter_warnings.forEach((err: any) => {
          const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Tuning Parameters Warning', detail: err, life: ToastTimeout.timeoutWarn };
          toast.add(tMsg); addToastRecord(tMsg);
        });
      } else {
        tuningParametersAreValid.value = true;
      }
      updateJobData();
      calibratableParametersHaveChanged.value = false;
      tuningDataHasChanged.value = false;
      await loadTuningTabStaticData(true);
      tuningStore_data_loading.value = false;
    } else {
      tuningStore_data_loading.value = false;

      let messageBody = '';
      if (saveTuningTabResponse._data && saveTuningTabResponse._data.response_type) {
        if (saveTuningTabResponse._data.response_type === "validation_error") {
          if (saveTuningTabResponse._data.validation_errors) {
            if (saveTuningTabResponse._data.validation_errors) {
              Object.keys(saveTuningTabResponse._data.validation_errors).forEach((error_type: string) => {
                if (Array.isArray(saveTuningTabResponse._data.validation_errors[error_type])) {
                  saveTuningTabResponse._data.validation_errors[error_type].forEach((error_item: any) => {
                    Object.keys(error_item).forEach((error_field: string) => {
                      error_item[error_field].forEach((message: string) => {
                        messageBody += error_field + ': ' + message + '\n';
                      });
                    });
                  })
                } else {
                  Object.keys(saveTuningTabResponse._data.validation_errors[error_type]).forEach((error_field: string) => {
                    saveTuningTabResponse._data.validation_errors[error_type][error_field].forEach((message: string) => {
                      messageBody += error_field + ': ' + message + '\n';
                    });
                  });
                }
              });
            }
          }
        }
      } 
      if (saveTuningTabResponse?._data?.response_type === 'error' && saveTuningTabResponse?._data?.message) {
        // string could be JSON - try parsing it; otherwise output it verbatim
        try {
          const jsonMessages = JSON.parse(saveTuningTabResponse._data.message);
          for (const message of jsonMessages) {
            messageBody += message + '\n';
          }
        } catch(e) {
          messageBody += saveTuningTabResponse._data.message;
        }
      }
      const tMsg: ToastMessageOptions = {
        severity: 'error',
        summary: `Error Saving Tuning Data`,
        detail: messageBody,
        life: ToastTimeout.timeoutError,
      };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  };

  const updateJobData = () => {
    if (userCalibrationRunData.value) {
      // simulation_start_time is in Luxon DateTime format. Calling toISO() to convert to string
      if (saveTuningTabRequestBody.value.time_controls && Object.keys(saveTuningTabRequestBody.value.time_controls).length) {
        userCalibrationRunData.value.time_controls = saveTuningTabRequestBody.value.time_controls;
        userCalibrationRunData.value.time_controls.simulation_start_time = userCalibrationRunData.value.time_controls.simulation_start_time.toISO();
      }
      
      if (saveTuningTabRequestBody.value.output_variable_to_calibrate) {
        userCalibrationRunData.value.output_variable_to_calibrate = saveTuningTabRequestBody.value.output_variable_to_calibrate;
      }
      userCalibrationRunData.value.parameters = userSelectedCalibrationTuningParameters.value;
      userCalibrationRunData.value.parameters_selected = userSelectedCalibrationTuningParameters.value.length > 0;
      userCalibrationRunData.value.last_updated_on = formatISOStringOrDateToYYYYMMDDHHMM(nowUTC());
    }
  };

  if (!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to Save', detail: 'Update of a job already run is not allowed. Please clone to make any changes for a new calibration', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  } else {
    // check if Tuning Tab data is validated before saving
    if (validateAndBuildRequestBody()) {
      handleSaveTuningTab();
    }
  }
};

const validateTab = (tabNumber?: number) => {
  // Don't try to validate if time controls are not accessible
  if (!isFormulationDataSaved() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
    return { error: false, text: [] };
  }
  let error = false;
  let text = [];
  // Validate only the input fields seen on screen, not the rest of the times
  if (compareTimeEntries(loadTuningTabData?.value?._data?.time_controls?.simulation_start_time || '', calSimStartTime.value)) {
    error = true;
    text.push("Simulation Start has changed");
  }
  if (loadTuningTabData?.value?._data?.time_controls?.warmup_duration !== warmupDuration.value) {
    error = true;
    text.push("Warmup Duration has changed");
  }
  if (loadTuningTabData?.value?._data?.time_controls?.calibration_duration !== calibrationDuration.value) {
    error = true;
    text.push("Calibration Duration has changed");
  }
  if (loadTuningTabData?.value?._data?.time_controls?.validation_window_gap !== validationWindowGap.value) {
    error = true;
    text.push("Validation Window Gap has changed");
  }
  if ((loadTuningTabData?.value?._data?.time_controls?.validation_window_after_calibration ? 'after' : 'before') !== validationWindow.value) {
    error = true;
    text.push("Validation Window has changed");
  }
  if (loadTuningTabData?.value?._data?.time_controls?.validation_duration !== validationDuration.value) {
    error = true;
    text.push("Validation Duration has changed");
  }
  /* if (userCalibrationRunData?.value?.output_variable_to_calibrate && selectedOutputVariableToCalibrate.value !== userCalibrationRunData?.value?.output_variable_to_calibrate) {
    error = true;
    text.push("Output Variable to Calibrate has changed");
  } */
  if (calibratableParametersHaveChanged.value) {
    error = true;
    text.push("Calibratable Parameters have changed");
  }

  return { error: error, text: text }
}

const compareTimeEntries = (txtDT: string, dT: Date) => {
  if(!txtDT || txtDT === '' || !dT) {
    return true;
  }
  const dateProps = dT as DatePickerProps;
  if (!txtDT && dateProps.invalid) {
    return false;
  }
  if (txtDT && dateProps.invalid) {
    return true;
  }
  return new Date(dT).getTime() !== new Date(txtDT).getTime();
}

const restoreTab = async () => {
  // reset time controls and calibratable parameters
  await loadTuningTabStaticData(true);

  if (loadTuningTabData.value?._data?.time_controls) {
    // default time control inputs based on the server response
    calSimStartTime.value = DateTime.fromISO(loadTuningTabData.value?._data?.time_controls?.simulation_start_time, { zone: 'utc' });
    warmupDuration.value = loadTuningTabData.value?._data?.time_controls?.warmup_duration;
    calibrationDuration.value = loadTuningTabData.value?._data?.time_controls?.calibration_duration;
    validationWindowGap.value = loadTuningTabData.value?._data?.time_controls?.validation_window_gap;
    validationWindow.value = loadTuningTabData.value?._data?.time_controls?.validation_window_after_calibration ? 'after' : 'before';
    validationDuration.value = loadTuningTabData.value?._data?.time_controls?.validation_duration;
  }

  calibratableParametersHaveChanged.value = false;
  tuningDataHasChanged.value = false;
}

const goNextTab = () => {
  const errors = validateTab();
  if (props.callNavDialog && errors.error) {
    props.callNavDialog(errors.text, true, 5);
  } else if (props.callGoToTab) {
    props.callGoToTab(5);
  }
};

const goPrevTab = () => {
  const errors = validateTab();
  if (props.callNavDialog && errors.error) {
    props.callNavDialog(errors.text, false, 3);
  } else if (props.callGoToTab) {
    props.callGoToTab(3);
  }
};

const rowClass = () => {
  return [{ "pointer-events-none": !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status) }];
}

const rowStyle = () => {
  let t = !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status);
  return {
    color: t ? "grey" : 'black',
    backgroundColor: t ? '#f0f0f0' : ''
  }
}

/**
 * Check if the initial value from userSelectedCalibrationTuningParameters is out of range
 * If they are, show a warning message
 */
const areParameterInitialValuesOutOfRange = () => {
  userSelectedCalibrationTuningParameters.value.forEach((param: any) => {
    if (param.initial_value && param.minimum && param.maximum) {
      checkInitialValueOutOfRange(
        param.name,
        parseFloat(param.initial_value),
        parseFloat(param.minimum),
        parseFloat(param.maximum)
      );
    }
  });
};

const checkInitialValueOutOfRange = (parameterName: string, initialValue: number, min: number, max: number) => {
  if (initialValue < min || initialValue > max) {
    const tMsg: ToastMessageOptions = {
      severity: 'warn',
      summary: 'WARNING',
      detail:
        `Parameter ${parameterName} initial value is outside the min/max range ` +
        `that will be used for parameter searching. Initial values will be used ` +
        `for the initial calibration iteration (i.e. iteration 0). For subsequent ` +
        `iterations, it will be constrained within the min/max range. You may ` +
        `proceed as is or update the min, max, or initial value and save again.`,
      life: ToastTimeout.timeoutWarn
    };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

defineExpose({
  validateTab,
  restoreTab
});

onUnmounted(async () => {
  saveTuningTabRequestBody.value = {};
  calSimStartTime.value = '';
  calSimEndTime.value = '';
  calStartTime.value = '';
  calEndTime.value = '';
  valSimStartTime.value = '';
  valSimEndTime.value = '';
  valStartTime.value = '';
  valEndTime.value = '';
  warmupDuration.value = 0;
  calibrationDuration.value = 1;
  validationWindowGap.value = 1;
  validationWindow.value = 'after';
  validationDuration.value = 1;
  loadTuningTabData.value = null;
  calibratableParametersHaveChanged.value = false;
  tuningDataHasChanged.value = false;
})

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#OutVar {
  width: 600px;
}

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

.date-picker-error {
  color: #aa0000;
}

.date-picker-error :deep(.dp__input) {
  color: #aa0000;
  border: 1px solid #aa0000;
}

.mmiInputs {
  width: 100px;
}

.varInputs {
  width: 400px;
}

.p-select-width {
  width: 100%;
}
</style>
