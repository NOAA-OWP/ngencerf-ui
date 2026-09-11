<template>
  <div id="OptimizationMetrics" class="mt-4">
    <div v-if="!userCalibrationRunData?.modules?.includes('LSTM')" class="grid grid-rows-12 gap-1">
      <div class="row-span-3">
        <div class="grid grid-cols-2 pt-3 gap-10">
          <div class="col-span-1">

            <div id="OptAlg" class="mt-2">
              <label for="OptimizationAlgorithm" class="required-label">Optimization Algorithm</label>
              <Select id="OptimizationAlgorithm" class="mt-1" v-model="uiOptimization"
                :options="getOptimizationAlgorithmOptionsList" filter optionLabel="name" optionValue="name"
                placeholder="" @change="optimizationSelectChange" aria-label="Optimization Algorithm"
                title="Optimization Algorithm"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></Select>
            </div>

          </div>
          <div class="col-span-1">
            <div class="mt-2">
              <div class="">
                <div class="flex mt-2">
                  <div class="text-left font-bold required-label">Algorithm Parameter(s)</div>
                  <div id="ClearTableBtn" class="ml-auto">
                    <Button id="ClrBtn" @click="resetOptimizationInputs" class="c-blue font-normal underline mr-2"
                      :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                      aria-label="Algorithm Parameters" title="Algorithm Parameter">Clear</Button>
                  </div>
                </div>

                <div id="AlgParamtable" class="mt-1">
                  <DataTable :value="uiOptimizationInputs" scrollable editMode="cell" scroll-height="300px"
                    fixedHeader=true>
                    <Column field="name" header="Parameter" sortable></Column>
                    <Column field="value" header="Initial Value" sortable>
                      <template #editor="{ index }">
                        <InputNumber v-model="uiOptimizationInputs[index].value" inputId="locale-us" locale="en-US"
                          :minFractionDigits="2" fluid autofocus class="w-20 p-1" aria-label="Initial Value"
                          title="Initial Value" @input="handleAlgorithmParameterChange">
                        </InputNumber>
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="row-span-1 hr">&nbsp;</div>

      <div class="row-span-4">
        <div class="grid grid-cols-2 gap-10">
          <div class="col-span-1">
            <div id="ObjFunct">
              <label for="ObjectiveFunction" class="required-label">Objective Function</label>
              <Select id="ObjectiveFunction" class="rounded-md" filter v-model="uiObjectiveFunction"
                :options="getObjectiveFunctionOptionsList" optionLabel="display_name" optionValue="name" placeholder=""
                @change="updateMetricFlowFieldVisibility()" aria-label="Objective Function" title="Objective Function"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></Select>
              <div v-if="uiObjectiveFunction" class="ml-3 mt-2">
                For {{ uiObjectiveFunction }} the Objective Function = 
                {{
                  ['KGE','NSE','NNSE','NSELOG','CORR','CSI','POD'].includes(uiObjectiveFunction.toUpperCase()) ? '1 - metric' :
                    (['RMSE','MAE','RSR','FAR','PKBIAS','PKTE','EVBIAS'].includes(uiObjectiveFunction.toUpperCase()) ? 'metric' :
                      ['PBIAS','LSEG_FDC','HSEG_FDC'].includes(uiObjectiveFunction.toUpperCase()) ? 'abs(metric)' : ''
                    )
                }}
              </div>
              <div v-if="showObjectiveFunctionThresholdCategorical" class="ml-3 mt-2">
                Categorical Threshold<span class="required-asterisk" aria-hidden="true">* </span>
                <InputNumber inputId="uiThresholdCategorical" v-model="uiThresholdCategorical"
                  :minFractionDigits="2" class="w-24" aria-label="Categorical Threshold" title="Categorical Threshold"
                  :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                  @input="handleOptimizationDataChange">
                </InputNumber> m3/s
              </div>
              <div v-if="showObjectiveFunctionThresholdEvent" class="ml-3 mt-2">
                Event Threshold<span class="required-asterisk" aria-hidden="true">* </span>
                <InputNumber inputId="ofEventBasedFlowThreshold" v-model="uiThresholdEvent"
                  :minFractionDigits="2" class="w-24" aria-label="Event Threshold" title="Event Threshold"
                  :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                  @input="handleOptimizationDataChange">
                </InputNumber> percentile (0.0-100.0)
              </div>
            </div>
          </div>

          <div class="col-span-1">
            <div id="Metrics">
              <div class="font-bold">Metrics</div><br>
              <span :style="`opacity: ${(cbCategoricalDisabled || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)) ? '50%' : '100%'}`">
                <Checkbox id="CalcCatMetCB" inputId="CalcCatMetCB" class="h-5 w-5 mr-3" style="display:inline-block"
                  :binary="true" v-model="cbIsCategorical" aria-label="Calculate Categorical Metrics Checkbox"
                  title="Calculate Categorical Metrics Checkbox"
                  :disabled="cbCategoricalDisabled || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                  @change="toggleMetricThresholdCategoricalInput" />
                <label for="CalcCatMetCB" class="inline">Calculate Categorical Metrics</label>
                <div class="pl-8">
                  <span class="text-sm ml-2">(POD, CSI, FAR)</span>
                </div>
              </span>
              <div v-if="showMetricThresholdCategorical && !cbCategoricalDisabled" id="FlowThreshold" class="mt-2 pl-8">
                Categorical Threshold<span class="required-asterisk" aria-hidden="true">* </span>
                <InputNumber inputId="metricCategoricalFlowThreshold" v-model="uiThresholdCategorical"
                  :minFractionDigits="2" class="w-24" aria-label="Categorical Threshold" title="Categorical Threshold"
                  :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                  @input="handleOptimizationDataChange"></InputNumber> m3/s
              </div><br />
              
              <span :style="`opacity: ${(cbEventBasedDisabled || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)) ? '50%' : '100%'}`">
                <Checkbox id="CalEventMetCB" inputId="CalEventMetCB" class="h-5 w-5 mr-3 inline"
                  style="display:inline-block" :binary="true" v-model="cbIsEventBased"
                  aria-label="Calculate Event Based Metrics Checkbox" title="Calculate Event Based Metrics Checkbox"
                  :disabled="cbEventBasedDisabled || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                  @change="toggleMetricThresholdEventInput" />
                <label for="CalEventMetCB" class="inline">Calculate Event Based Metrics</label>
                <div class="pl-8">
                  <span class="text-sm ml-2">(PKBIAS, PKTE, EVBIAS)</span>
                </div>
              </span>
              <div v-if="showMetricThresholdEvent && !cbEventBasedDisabled" id="ThresholdEvent" class="mt-2 pl-8">
                Event Threshold<span class="required-asterisk" aria-hidden="true">* </span>
                <InputNumber inputId="uiThresholdEvent" v-model="uiThresholdEvent" :min="0" :max="100" 
                  :minFractionDigits="2" class="w-24" aria-label=" Event Threshold" title=" Event Threshold"
                  :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                  @input="handleOptimizationDataChange"></InputNumber>
                percentile (0.0-100.0)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row-span-1 hr">&nbsp;</div>

      <div class="row-span-2 mb-4">
        <div class="grid grid-cols-2 gap-10">
          <div class="col-span-1">
            <!--REVIVING LOST CONTENT HERE-->
            <div id="CalibrationStopCriteria" class="bordered">
              <label for="StopCriteria" class="required-label">Calibration Stop Criteria</label><br>
              <InputNumber id="StopCriteria" inputId="stopCriteria" v-model="uiStopCriteria" showButtons :min="2"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                aria-label="Calibration Stop Criteria" title="Calibration Stop Criteria"
                @input="handleOptimizationDataChange">
              </InputNumber>
              <div class="ml-3 mt-1">Iterations per Worker</div>
            </div>
          </div>
          <div class="col-span-1">
            <div id="PlotGenFreq" class="bordered">
              <label for="PlotFrequency" class="required-label">Plot Generation Frequency</label><br>
              Once Every:&nbsp;&nbsp;<InputNumber id="PlotFrequency" class="w-[100px]" inputId="plotFrequency"
                v-model="uiPlotFrequency" showButtons :min="1" aria-label="Plot Generation Frequency"
                title="Plot Generation Frequency"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                @input="handleOptimizationDataChange">
              </InputNumber>
              &nbsp;&nbsp;Iterations
            </div>
          </div>
        </div>
        <DynamicDialog />
      </div>
    </div>
    <div v-else class="text-center">
      <p>LSTM does not require user selection of Optimization, Metrics, Calibration Stop Criteria, or Plot Frequency.</p>

      <p>Click "Next" to Continue.</p>
    </div>
    <div id="OptMetBottomButtons" class="absolute b-0 grid grid-cols-8 mt-6 ActionButtonsBox">
      <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
        <div class="col-span-1 mr-6 h-8">
          <Button v-if="!userCalibrationRunData?.modules?.includes('LSTM')" 
            class="font-normal ngenButtonDiv-green" title="Save" aria-label="Save Button"
            @click="saveOptMetData()" :disabled="isLoading || optimizationStore_data_loading">
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
        <div class="col-span-1">
          <Button v-if="optMetDataHasChanged && !userCalibrationRunData?.modules?.includes('LSTM')" class="ngenButtonDiv-yellow" title="Revert All Changes"
            @click="restoreTab()" aria-label="Revert All Changes" :disabled="isLoading || optimizationStore_data_loading">Revert</Button>
        </div>
      </span>
      <div class="col-span-4">&nbsp;</div>
      <div class="col-span-1">
        <Button class="ngenButtonDiv ml-6 font-normal h-8 float-right" title="Previous Tab Button"
          aria-label="Previous Tab Button" @click="goPrevTab()" :disabled="isLoading || optimizationStore_data_loading">Prev</Button>
      </div>
      <div class="col-span-1 mr-4">
        <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Tab Button" aria-label="Next Tab Button"
          @click="goNextTab()" :disabled="isLoading || optimizationStore_data_loading">Next</Button>
      </div>

    </div>

    <div class="waitgif" v-if="isLoading || optimizationStore_data_loading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";

import type { ToastMessageOptions } from "primevue/toast";

import { useOptimizationStore } from '@/stores/calibration/OptimizationStore';
import { useUserDataStore } from "@/stores/common/UserDataStore"
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";
import { generalStore } from "~/stores/common/GeneralStore";

import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";

import { formatDateForRunOnString } from "@/utils/TimeHelpers";
import { hilightTab } from '@/composables/TabHilight';
import { isCalibrationJobStatusSavedOrReady } from "@/utils/CommonHelpers";

const dialog = useDialog();
const nextPrevDialogOpened = ref<boolean>(false);

const optimizationStore = useOptimizationStore();
const {
  optimizationTabData,
  uiObjectiveFunction,
  uiOptimization,
  uiOptimizationInputs,
  uiThresholdEvent,
  uiPlotFrequency,
  uiStopCriteria,
  uiThresholdCategorical,
  optimizationStore_data_loading,
  getOptimizationAlgorithmOptionsList,
  getObjectiveFunctionOptionsList,
  showObjectiveFunctionThresholdEvent,
  showObjectiveFunctionThresholdCategorical,
  getOptimizationInputUserData,
  optMetDataHasChanged,
  algParamDataHasChanged,
  saveOptMetPayload
} = storeToRefs(optimizationStore);

const { loadOptimizationTabStaticData, setUserSelection, saveOptimizationTabData, resetOptimizationInputs } = optimizationStore;
const { fetchUserCalibrationRunData } = useUserDataStore();
const { userCalibrationRunData } = storeToRefs(useUserDataStore());
const { submitTimeDate } = storeToRefs(useRunStatusStore());
const toast = useToast();

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

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

const selectedMetric = ref<OptimizationMetricData>();
const cbCategoricalDisabled = ref<boolean>(false);
const cbEventBasedDisabled = ref<boolean>(false);
const cbIsCategorical = ref<boolean>(false);
const cbIsEventBased = ref<boolean>(false);
const showMetricThresholdEvent = ref<boolean>(false);
const showMetricThresholdCategorical = ref<boolean>(false);
const ele = document.getElementById("MainLeftDataArea") as HTMLElement;

onMounted(async() => {
  if (!optimizationTabData.value) {
    await loadOptimizationTabStaticData();
  }
  setUserSelection();
  
  toast.removeAllGroups();
  if (ele) { ele.scrollTo(0, 0); }
  
  if (userCalibrationRunData?.value?.submit_date) {
    submitTimeDate.value = new Date(userCalibrationRunData.value.submit_date);
  }

  updateMetricFlowFieldVisibility();

  if (userCalibrationRunData.value?.threshold_categorical) {
    cbIsCategorical.value = true;
    showMetricThresholdCategorical.value = true;
    uiThresholdCategorical.value = userCalibrationRunData.value?.threshold_categorical;
  }

  if (userCalibrationRunData.value?.threshold_event) {
    cbIsEventBased.value = true;
    showMetricThresholdEvent.value = true;
    uiThresholdEvent.value = userCalibrationRunData.value?.threshold_event;
  }

  nextTick(() => {
    hilightTab(CalibrationTabs.tab_optimizationMetrics);
  });

  isLoading.value = false;
})

/**
 * update objective function and metric peak flow/stream flow field visibility
 */
const updateMetricFlowFieldVisibility = () => {
  selectedMetric.value = optimizationTabData.value?.metrics.find(
    metric_data => metric_data.name === uiObjectiveFunction.value
  );

  if (selectedMetric.value) {
    if (selectedMetric?.value?.categorical === true) {
      showObjectiveFunctionThresholdCategorical.value = true;
      showMetricThresholdCategorical.value = false;
      cbIsCategorical.value = true;
      cbCategoricalDisabled.value = true;
    } else {
      showObjectiveFunctionThresholdCategorical.value = false;
      cbCategoricalDisabled.value = false;
      // if the checkbox remains checked (e.g. carried over from a forced state), keep showing its threshold field
      showMetricThresholdCategorical.value = cbIsCategorical.value;
    }
    if (selectedMetric?.value?.event_based === true) {
      showObjectiveFunctionThresholdEvent.value = true;
      showMetricThresholdEvent.value = false;
      cbIsEventBased.value = true;
      cbEventBasedDisabled.value = true;
    } else {
      showObjectiveFunctionThresholdEvent.value = false;
      cbEventBasedDisabled.value = false;
      // if the checkbox remains checked (e.g. carried over from a forced state), keep showing its threshold field
      showMetricThresholdEvent.value = cbIsEventBased.value;
    }
  }
};

/**
 * metric stream flow field visibility toggle 
 */
const toggleMetricThresholdCategoricalInput = () => {
  if (!cbCategoricalDisabled.value && cbIsCategorical.value) {
    showMetricThresholdCategorical.value = true;
  } else if (!cbIsCategorical.value) {
    showMetricThresholdCategorical.value = false;
    uiThresholdCategorical.value = undefined;
  }
  optMetDataHasChanged.value = true;
};

/**
 * metric peak flow field visibility toggle 
 */
const toggleMetricThresholdEventInput = () => {
  if (!cbEventBasedDisabled.value && cbIsEventBased.value) {
    showMetricThresholdEvent.value = true;
  } else if (!cbIsEventBased.value) {
    showMetricThresholdEvent.value = false;
    uiThresholdEvent.value = undefined;
  }
  optMetDataHasChanged.value = true;
};

/**
 * generic function to track any data change
 */
const handleOptimizationDataChange = () => {
  optMetDataHasChanged.value = true;
}

const handleAlgorithmParameterChange = () => {
  algParamDataHasChanged.value = true;
  optMetDataHasChanged.value = true;
}

/**
 * explicitly reload optimization input table data
 */
const optimizationSelectChange = () => {
  uiOptimizationInputs.value = getOptimizationInputUserData.value;
  algParamDataHasChanged.value = true;
  optMetDataHasChanged.value = true;
};

/**
 * explicitly watching loading status, as onmount happen prior to store loading. 
 * make sure we manage the display base on user input AFTER data loading has completed 
 */
watch(() => optimizationStore_data_loading.value, (loading_status) => {
  if (selectedMetric?.value?.categorical === true) {
    showObjectiveFunctionThresholdCategorical.value = true;
    cbCategoricalDisabled.value = true;
    cbIsCategorical.value = true;
  } else if (!selectedMetric?.value?.categorical && uiThresholdCategorical.value) {
    showMetricThresholdCategorical.value = true;
    cbIsCategorical.value = true;
  }

  if (selectedMetric?.value?.event_based === true) {
    showObjectiveFunctionThresholdEvent.value = true;
    cbEventBasedDisabled.value = true;
    cbIsEventBased.value = true;
  } else if (!selectedMetric?.value?.event_based && uiThresholdEvent.value) {
    showMetricThresholdEvent.value = true;
    cbIsEventBased.value = true;
  }
})

/**
* event bus for calibration button group click
*/
const saveOptMetData = () => {
  isLoading.value = true;
  if (!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to Save', detail: 'Update of a job already run is not allowed. Please clone to make any changes for a new calibration', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  } else {
    toast.removeAllGroups();
    saveOptimizationTabData().then(response => {
      if (response.status === 200) {
        const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Optimization Metrics Data Saved', detail: response?._data?.message, life: ToastTimeout.timeoutInfo };
        toast.add(tMsg); addToastRecord(tMsg);
        optMetDataHasChanged.value = false;
        algParamDataHasChanged.value = false;
      } else {
        useApiErrorResponsePreprocess(response).forEach(message => {
          const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Save Optimization Metrics Data Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status)};
          toast.add(tMsg); addToastRecord(tMsg);
        });
      }
      updateJobData();
      isLoading.value = false;
    });
  }
};

const updateJobData = () => {
  if (userCalibrationRunData.value) {
    userCalibrationRunData.value.optimization_inputs = saveOptMetPayload.value.optimization_inputs as [];
    userCalibrationRunData.value.optimization = saveOptMetPayload.value.optimization ?? '';
    userCalibrationRunData.value.objective_function = saveOptMetPayload.value.objective_function as string;
    userCalibrationRunData.value.threshold_categorical = saveOptMetPayload.value.threshold_categorical as number
    userCalibrationRunData.value.threshold_event = saveOptMetPayload.value.threshold_event as number
    userCalibrationRunData.value.stop_criteria = saveOptMetPayload.value.stop_criteria as number
    userCalibrationRunData.value.save_plot_iteration_frequency = saveOptMetPayload.value.save_plot_iteration_frequency as number
    userCalibrationRunData.value.save_output_iteration = saveOptMetPayload.value.save_output_iteration as boolean
    userCalibrationRunData.value.last_updated_on = formatISOStringOrDateToYYYYMMDDHHMM(nowUTC());
  }
};

const validateTab = (tabNumber?: number) => {
  let error = false;
  let text = [];
  if (!userCalibrationRunData?.value?.modules.includes('LSTM')) {
    // Only validate this page if LSTM is not part of the formulation
    let savedName = userCalibrationRunData?.value?.optimization ? userCalibrationRunData?.value?.optimization : '';
    let newName = uiOptimization.value ? uiOptimization.value : '';
    if (savedName !== newName) {
      error = true;
      text.push("Optimization Algorithm has been changed");
    }
    savedName = userCalibrationRunData?.value?.objective_function ? userCalibrationRunData?.value?.objective_function : '';
    newName = uiObjectiveFunction.value ? uiObjectiveFunction.value : '';
    if (savedName !== newName) {
      error = true;
      text.push("Objective Function has been changed");
    }
    if ((userCalibrationRunData?.value?.stop_criteria || 0) !== uiStopCriteria.value) {
      error = true;
      text.push("Calibration Stop Criteria has been changed");
    }
    if ((userCalibrationRunData?.value?.save_plot_iteration_frequency || 0) !== uiPlotFrequency.value) {
      error = true;
      text.push("Plot Generation Frequency has been changed");
    }

    if ((cbIsCategorical.value && !userCalibrationRunData.value?.threshold_categorical ) ||
      (!cbIsCategorical.value && userCalibrationRunData.value?.threshold_categorical ) ||
      (userCalibrationRunData?.value?.threshold_categorical || 0) !== (uiThresholdCategorical.value || 0)) {
      error = true;
      text.push("Calculate Categorical Metrics (Categorical Threshold) has been changed");
    }

    if ((cbIsEventBased.value && !userCalibrationRunData.value?.threshold_event ) ||
      (!cbIsEventBased.value && userCalibrationRunData.value?.threshold_event ) ||
      (userCalibrationRunData?.value?.threshold_event || 0) !== (uiThresholdEvent.value || 0)) {
      error = true;
      text.push("Calculate Event Based Metrics (Event Threshold) has been changed");
    }

    if (algParamDataHasChanged.value) {
      error = true;
      text.push("Algorithm Parameter(s) have been added or changed");
    }
  }
  return { error: error, text: text }
}

const restoreTab = async () => {
  await fetchUserCalibrationRunData();
  if (userCalibrationRunData.value) {
    uiOptimization.value = userCalibrationRunData?.value?.optimization;
    uiOptimizationInputs.value = userCalibrationRunData?.value?.optimization_inputs;
    uiObjectiveFunction.value = userCalibrationRunData?.value?.objective_function;
    uiStopCriteria.value = userCalibrationRunData?.value?.stop_criteria || 0;
    uiPlotFrequency.value = userCalibrationRunData?.value?.save_plot_iteration_frequency || 0;
    if (userCalibrationRunData.value?.threshold_categorical) {
      cbIsCategorical.value = true;
      showMetricThresholdCategorical.value = true;
      uiThresholdCategorical.value = userCalibrationRunData.value?.threshold_categorical;
    } else {
      cbIsCategorical.value = false;
      showMetricThresholdCategorical.value = false;
    }

    if (userCalibrationRunData.value?.threshold_event) {
      cbIsEventBased.value = true;
      showMetricThresholdEvent.value = true;
      uiThresholdEvent.value = userCalibrationRunData.value?.threshold_event;
    } else {
      cbIsEventBased.value = false;
      showMetricThresholdEvent.value = false;
    }
  }
  optMetDataHasChanged.value = false;
}

const goNextTab = () => {
  const errors = validateTab();
  if (props.callNavDialog && errors.error) {
    props.callNavDialog(errors.text, true, 6);
  } else if (props.callGoToTab) {
    props.callGoToTab(6);
  }
};

const goPrevTab = () => {
  const errors = validateTab();
  if (props.callNavDialog && errors.error) {
    props.callNavDialog(errors.text, false, 4);
  } else if (props.callGoToTab) {
    props.callGoToTab(4);
  }
};

defineExpose({
  validateTab,
  restoreTab
});

onUnmounted(async () => {
  optMetDataHasChanged.value = false;
  algParamDataHasChanged.value = false;
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#ObjectiveFunction_list,
.p-select-list-container {
  position: relative;
  z-index: 2;
  max-height: 8rem !important;
}

#ClrBtn {
  font-weight: bold;
}
#ClrBtn:hover {
  background-color: transparent;
  border: none;
  color: global.$ngwcp_primary3 !important;
}
</style>
