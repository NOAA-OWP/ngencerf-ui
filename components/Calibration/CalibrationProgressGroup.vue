<template>

    <table id="CalibrationProgressTable" class="prevent-select">
      <tr>
        <td><i v-if="selectedDomainValue" :class="selectedDomainValue ? 'checkMark' : ''" class="pi pi-check font-bold"></i></td>        
        <td class="ptype">Headwater Basin Gage</td>
      </tr>
      <tr>
        <td><i v-if="formulationNameInput && selectedModuleValues.length" :class="formulationNameInput && selectedModuleValues.length ? 'checkMark' : ''"  class="pi pi-check font-bold"></i></td>
        <td class="ptype">Formulation</td>
      </tr>
      <tr>
        <td><i v-if="calStartTime && calEndTime && simStartTime && simEndTime" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Start and End Times</td>
      </tr>
      <tr>
        <td><i v-if="userOutputVariableToCalibrate.name" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Calibration Output Variable</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationTuningParameters.length" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Tuning Parameters</td>
      </tr>
      <tr>
        <td><i v-if="uiOptimization" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Optimization Algorithm</td>
      </tr>
      <tr>
        <td><i v-if="uiObjectiveFunction" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Objective Function</td>
      </tr>
      <tr>
        <td><i v-if="uiStopCriteria" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Calibration Stop Criteria</td>
      </tr>
      <tr>
        <td><i v-if="uiPlotFrequency" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Metrics / Plot Inteval</td>
      </tr>
    </table>

</template>

<script lang="ts" setup>
import { useGageStore } from '~/stores/calibration/GageStore';
import { useFormulationStore } from '~/stores/calibration/FormulationStore';
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { useOptimizationStore } from '~/stores/calibration/OptimizationStore';
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
      } = storeToRefs( optimizationStore )

const gageStore = useGageStore();
const { gageData, gageTabData, selectedDomainValue, data_loading, selectedForcingValue, selectedGageValue, getGageOptionsList, selectedObservationalValue, getDomainOptionsList, getForcingOptionsList, getObservationalOptionsList } = storeToRefs( gageStore )

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

</script>

<style lang="scss" scoped>
#CalibrationProgressTable {
  width: 100%;
  margin-left: 15px;
  tr {
    line-height: calc(1.3vw + 0.41vh);    // font-size: 14px;
  }
  .checkMark {
    text-align: right;
  }
  .ptype {
    width: 90%;

  }
}
</style>
