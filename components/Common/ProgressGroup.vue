<template>
  <table id="CalibrationProgressTable" class="prevent-select">
    <tbody>
      <template  v-for="(v, index) in CalibrationProgress">
      <tr>
        <td><i v-if="v.vif" key="{{v.vif}}" :class="v.vif ? 'checkMark' : ''"
            class="pi pi-check font-bold"></i></td>
        <td class="ptype whitespace-nowrap" :data-tab="index + 1" :title="v.title" :aria-label="v.title"
          @click="tabClicked">
          {{ v.content }}</td>
      </tr>
    </template>
    </tbody>
  </table>

</template>

<script lang="ts" setup>
import { useGageStore } from '~/stores/calibration/GageStore';
import { useFormulationStore } from '~/stores/calibration/FormulationStore';
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { useOptimizationStore } from '~/stores/calibration/OptimizationStore';
import { generalStore } from "@/stores/common/GeneralStore";
const { getCalibrationTabIndex, getMenuIndex } = generalStore();

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
const { gageData, gageTabData, selectedDomainValue, gageStore_data_loading, selectedForcingValue, selectedGageValue, getGageOptionsList, selectedObservationalValue, getDomainOptionsList, getForcingOptionsList, getObservationalOptionsList } = storeToRefs(gageStore)

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


const CalibrationProgress = [
  {
    vif: selectedDomainValue,
    title: "Headwater Basin Gage",
    content: "Headater Basin Gage"
  },
  {
    vif: formulationNameInput && selectedModuleValues.value.length,
    title: "Formulation",
    content: "Formulation"
  },
  {
    vif: calStartTime.value && calEndTime.value && simStartTime.value && simEndTime.value,
    title: "Start and End Times",
    content: "Start and End Times"
  },
  {
    vif: userOutputVariableToCalibrate.value.name,
    title: "Calibration Output Variable",
    content: "Calibration Output Variable"
  },
  {
    vif: userCalibrationTuningParameters.value.length,
    title: "Parameters",
    content: "Parameters"
  },
  {
    vif: uiOptimization.value,
    title: "Optimization Algorithm",
    content: "Optimization Algorithm"
  },
  {
    vif: uiObjectiveFunction.value,
    title: "Objective Function",
    content: "Objective Function"
  },
  {
    vif: uiStopCriteria.value,
    title: "Calibration Stop Criteri",
    content: "Calibration Stop Criteri"
  },
  {
    vif: uiPlotFrequency.value,
    title: "Metrics and Plot Inteval",
    content: "Metrics / Plot Inteval"
  }
]


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

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#CalibrationProgressTable {
  width: 100%;
  margin-left: 15px;

  table {
    tr {
      line-height: calc(1.3vw + 0.41vh); // font-size: 14px;
    }

    .checkMark {
      text-align: right;
    }

    .ptype {
      width: 90%;
      cursor: pointer;
    }

    .ptype:hover {
      color: $ngwcp_primary1;
    }
  }
}
</style>
