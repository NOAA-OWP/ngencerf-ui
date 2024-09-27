<template>
  <table id="CalibrationProgressTable" class="progressTable prevent-select">
    <tbody>
      <tr>
        <td><i v-if="userCalibrationRunData?.gage?.gage_id"
            :class="(userCalibrationRunData?.gage?.gage_id) ? 'checkMark' : ''" class="pi pi-check font-bold"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="1" title="Headwater Basin Gage" aria-label="Headwater Basin Gage"
          @click="tabClicked">
          Headwater Basin Gage</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.formulation_name && userCalibrationRunData?.modules.length"
            :class="userCalibrationRunData?.formulation_name && userCalibrationRunData?.modules.length ? 'checkMark' : ''"
            class="pi pi-check font-bold"></i></td>
        <td class="ptype" data-tab="2" title="Formulation" aria-label="Formulation" @click="tabClicked">Formulation</td>
      </tr>
      <tr>
        <td><i v-if="checkStartEndTimeValues()" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Start and End Times" aria-label="Start and End Times"
          @click="tabClicked">
          Start and End Times</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.output_variable_to_calibrate.name &&
          userCalibrationRunData?.output_variable_to_calibrate.module" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Calibration Output Variable"
          aria-label="Calibration Output Variable" @click="tabClicked">Calibration Output Variable</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Tuning Parameters" aria-label="Tuning Parameters"
          @click="tabClicked">Tuning Parameters</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.optimization" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="4" title="Optimization Algorithm"
          aria-label="Optimization Algorithm" @click="tabClicked">Optimization Algorithm</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.objective_function" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="4" title="Objective Function" aria-label="Objective Function"
          @click="tabClicked">
          Objective Function</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.stop_criteria" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="4" title="Calibration Stop Criteria"
          aria-label="Calibration Stop Criteria" @click="tabClicked">Calibration Stop Criteria</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.save_plot_iteration_frequency" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="4" title="Metrics and Plot Inteval"
          aria-label="Metrics and Plot Inteval" @click="tabClicked">Metrics / Plot Inteval</td>
      </tr>
    </tbody>
  </table>

</template>

<script lang="ts" setup>
import type { UserCalibrationRunData } from "~/composables/NextGenModel";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { useGageStore } from '~/stores/calibration/GageStore';
import { useFormulationStore } from '~/stores/calibration/FormulationStore';
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { useOptimizationStore } from '~/stores/calibration/OptimizationStore';
import { generalStore } from "@/stores/common/GeneralStore";
const { getCalibrationTabIndex, getMenuIndex } = generalStore();

const userDataStore = useUserDataStore();
const { userCalibrationRunData } = storeToRefs(userDataStore);

const currentCalibrationTab = ref(getCalibrationTabIndex());

const emit = defineEmits(["tabNumber"]);

const tuningStore = useTuningStore();
const forumlationStore = useFormulationStore();
const { formulationNameInput, selectedModuleValues } = storeToRefs(forumlationStore);
const optimizationStore = useOptimizationStore()
const {
  uiObjectiveFunction,
  uiOptimization,
  uiOptimizationInputs,
  uiPeakFlowThreshold,
  uiPlotFrequency,
  uiStopCriteria,
  uiStreamFlowThreshold,
  getOptimizationAlgorithmOptionsList,
  getObjectiveFunctionOptionsList,
  showObjectiveFunctionPeakFlow,
  showObjectiveFunctionStreamFlow,
  getSelectedMetricInfo,
  getOptimizationInputUserData
} = storeToRefs(optimizationStore)

const gageStore = useGageStore();
const { gageData, gageTabData, selectedDomainValue, data_loading, selectedForcingValue, selectedGageValue, getGageOptionsList, selectedObservationalValue, getDomainOptionsList, getForcingOptionsList, getObservationalOptionsList } = storeToRefs(gageStore)

const {
  simStartTime,
  simEndTime,
  calStartTime,
  calEndTime,
  userCalibrationTuningParameters,
  userOutputVariableToCalibrate,
  avSimStartTime,
  avSimEndTime,
  avCalStartTime,
  avCalEndTime,
} = storeToRefs(tuningStore);


const checkStartEndTimeValues = () => {
  return (
    userCalibrationRunData.value?.calibration_times.calibration_end_time &&
    userCalibrationRunData.value?.calibration_times.calibration_start_time &&
    userCalibrationRunData.value?.calibration_times.simulation_end_time &&
    userCalibrationRunData.value?.calibration_times.simulation_start_time &&
    userCalibrationRunData.value?.validation_times.simulation_end_time &&
    userCalibrationRunData.value?.validation_times.simulation_start_time &&
    userCalibrationRunData.value?.validation_times.validation_end_time &&
    userCalibrationRunData.value?.validation_times.validation_start_time
  )
}


const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele = event.currentTarget as HTMLElement;
  const allTabs = document.getElementsByClassName("tabs");
  // Remove highlighting from all tabs
  Object.keys(allTabs).forEach(function (key) {
    allTabs[key as any].classList.remove("activeTab");
  });

  const tabNum = Number(ele.getAttribute("data-tab")) - 1;
  allTabs[tabNum].classList.add("activeTab");
  const e = allTabs[tabNum] as HTMLElement;
  e.click();

  // Send the selected tab info to the active tab set with emit
  if (getMenuIndex() === 1) {
    currentCalibrationTab.value = Number(ele.getAttribute("data-tab"));
    emit("tabNumber", currentCalibrationTab.value);
  }
}
</script>
