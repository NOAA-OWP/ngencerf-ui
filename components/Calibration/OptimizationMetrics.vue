<template>
   <div id="OptimizationMetrics" class="pl-5 pr-3">
      <div class="grid grid-cols-2 pt-3 gap-10">
         <div class="col-span-1">

            <div id="OptAlg" class="mt-2">
               <label for="OptimizationAlgorithm">Optimization Algorithm</label>
               <Select id="OptimizationAlgorithm" class="mt-1" v-model="uiOptimization"
                  :options="getOptimizationAlgorithmOptionsList" filter optionLabel="name" optionValue="name"
                  placeholder="" @change="optimizationSelectChange"></Select>
            </div>

         </div>
         <div class="col-span-1">

            <div class="mt-2">
               <div class="w-full">
                  <div class="flex mt-2 w-full">
                     <div class="text-left font-bold">Algorithm Parameter(s)</div>
                     <div id="ClearTableBtn" class="ml-auto">
                        <button @click="resetOptimizationInputs" class="c-blue font-normal underline">Clear
                           <!-- <i class="pi pi-arrow-up"></i>--></button>
                     </div>
                  </div>

                  <div id="AlgParamtable" class="w-full mt-1">
                     <DataTable :value="uiOptimizationInputs" scrollable editMode="cell" scroll-height="300px"
                        fixedHeader=true>
                        <Column field="name" header="Parameter" sortable></Column>
                        <Column field="value" header="Initial Value" sortable>
                           <template #editor="{ index }">
                              <InputText v-model="uiOptimizationInputs[index].value" autofocus class="w-12 p-1">
                              </InputText>
                           </template>
                        </Column>
                     </DataTable>
                  </div>
               </div>

            </div>
         </div>

         <div class="col-span-2">
            <div class="hr"></div>
         </div>

         <div class="col-span-1">
            <div id="ObjFunct">
               <label for="ObjectiveFunction<">Objective Function</label>
               <Select id="ObjectiveFunction" class="rounded-md" filter v-model="uiObjectiveFunction"
                  :options="getObjectiveFunctionOptionsList" optionLabel="name" optionValue="name" placeholder=""
                  @change="updateMetricFlowFieldVisibility"></Select>
               <div v-if="showObjectiveFunctionStreamFlow">
                  Flow Threshold: <InputNumber inputId="ofCategoricalFlowThreshold" v-model="uiStreamFlowThreshold"
                     class="w-24">
                  </InputNumber> m3/s
               </div>
               <div v-if="showObjectiveFunctionPeakFlow">
                  Peak Flow Threshold: <InputNumber inputId="ofEventBasedFlowThreshold" v-model="uiPeakFlowThreshold"
                     class="w-24"></InputNumber> quartile
               </div>
            </div>
         </div>

         <div class="col-span-1">
            <div id="Metrics">
               <div class="font-bold">Metrics</div><br>

               <Checkbox id="CalcCatMetCB" inputId="CalcCatMetCB" class="h-5 w-5 mr-3" style="display:inline-block"
                  :binary="true" v-model="cbIsCategorical" :disabled="cbCategoricalDisabled"
                  @change="toggleMetricStreamFlowInput" />
               <label for="CalcCatMetCB" class="inline">Calculate Categorical Metrics</label>
               <div class="pl-8">
                  <span class="text-sm ml-2">(POD, CSI, FAR)</span>
               </div>
               <div v-if="showMetricStreamFlow" id="FlowThreshold" class="mt-1 pl-8">
                  Flow Threshold: <InputNumber inputId="metricCategoricalFlowThreshold" v-model="uiStreamFlowThreshold"
                     class="w-24"></InputNumber> m3/s
               </div><br />

               <Checkbox id="CalEventMetCB" inputId="CalEventMetCB" class="h-5 w-5 mr-3 inline"
                  style="display:inline-block" :binary="true" v-model="cbIsEvenBased" :disabled="cbEventBasedDisabled"
                  @change="toggleMetricPeakFlowInput" />
               <label for="CalEventMetCB" class="inline">Calculate Event Based Metrics</label>
               <div class="pl-8">
                  <span class="text-sm ml-2">(PKBIAS, PKTE, EVBIAS)</span>
               </div>
               <div v-if="showMetricPeakFlow" id="FlowThreshold" class="mt-1 pl-8">
                  Peak Flow Threshold: <InputNumber inputId="metricEventBasedFlowThreshold"
                     v-model="uiPeakFlowThreshold" class="w-24"></InputNumber> quartile
               </div>
            </div>
         </div>

         <div class="col-span-2">
            <div class="hr"></div>
         </div>

         <div class="col-span-1">
            <!--REVIVING LOST CONTENT HERE-->
            <div id="CalibrationStopCriteria" class="bordered">
               <label for="StopCriteria">Calibration Stop Criteria:</label><br>
               <InputNumber id="StopCriteria" inputId="stopCriteria" v-model="uiStopCriteria" showButtons :min="0">
               </InputNumber>
               <div>Iterations per Worker</div>
            </div>
         </div>

         <div class="col-span-1">
            <div id="PlotGenFreq" class="bordered">
               <label for="PlotFrequency">Plot Generation Frequency (0 = off)</label><br>
               Once Every:&nbsp;&nbsp;<InputNumber id="PlotFrequency" class="w-[100px]" inputId="plotFrequency"
                  v-model="uiPlotFrequency" showButtons :min="0"></InputNumber>&nbsp;&nbsp;Iterations

            </div>
         </div>

         <br clear="all">
         <br clear="all">
         <br clear="all">
      </div>

      <div class="grid grid-rows-1" id="OptMetbuttons">
         <div id="OptMetBottomButtons" class="grid grid-cols-8">
            <div class="col-span-1 ngenButtonDiv bg-green mr-6 h-8">
               <button class="font-normal" title="Save" aria-label="Save Button" @click="saveOptMetData()">
                  Save
               </button>
            </div>
            <div class="col-span-1 mr-3">
            </div>
            <div class="col-span-4">&nbsp;</div>
            <div class="col-span-1">
               <div><button class="ngenButtonDiv ml-6 font-normal h-8 float-right" title="Previous Tab Button"
                     aria-label="Previous Tab Button" @click="goPrevTab()">Prev</button></div>
            </div>
            <div class="col-span-1 mr-4">
               <div><button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Tab Button"
                     aria-label="Next Tab Button" @click="goNextTab()">Next</button></div>
            </div>

         </div>
      </div>

      <div class="waitgif" v-if="optimizationStore_data_loading">
         <img src="@/assets/styles/img/wait.gif" />
      </div>
   </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted } from "vue";

import { useOptimizationStore } from '~/stores/calibration/OptimizationStore';
import { useToast } from "primevue/usetoast";
import { generalStore } from "~/stores/common/GeneralStore";
import { useUserDataStore } from "~/stores/common/UserDataStore"

const optimizationStore = useOptimizationStore();
const {
   uiObjectiveFunction,
   uiOptimization,
   uiOptimizationInputs,
   uiPeakFlowThreshold,
   uiPlotFrequency,
   uiStopCriteria,
   uiStreamFlowThreshold,
   optimizationStore_data_loading,
   getOptimizationAlgorithmOptionsList,
   getObjectiveFunctionOptionsList,
   showObjectiveFunctionPeakFlow,
   showObjectiveFunctionStreamFlow,
   getSelectedMetricInfo,
   getOptimizationInputUserData,
} = storeToRefs(optimizationStore);
const { loadOptimizationTabStaticData, saveOptimizationTabData, resetOptimizationInputs, resetUserSelectionOptimization } = optimizationStore;
const { fetchUserCalibrationRunData } = useUserDataStore();
const { getCalibrationTabIndex } = generalStore();
const toast = useToast();

//const isLoading = ref(true);

const cbCategoricalDisabled = ref<boolean>(false)
const cbEventBasedDisabled = ref<boolean>(false)
const cbIsCategorical = ref<boolean>(false)
const cbIsEvenBased = ref<boolean>(false)
const showMetricPeakFlow = ref<boolean>(false)
const showMetricStreamFlow = ref<boolean>(false)

onMounted(() => {
   toast.removeAllGroups();
})

/**
 * update objective function and metric peak flow/stream flow field visibility
 */
const updateMetricFlowFieldVisibility = () => {
   if (getSelectedMetricInfo.value) {
      //reset toggleable field available property
      cbCategoricalDisabled.value = false
      cbEventBasedDisabled.value = false
      showObjectiveFunctionStreamFlow.value = false
      showObjectiveFunctionPeakFlow.value = false
      uiStreamFlowThreshold.value = undefined
      uiPeakFlowThreshold.value = undefined
      showMetricStreamFlow.value = false
      showMetricPeakFlow.value = false

      const metricInfo = getSelectedMetricInfo.value?.pop()

      cbIsCategorical.value = metricInfo?.categorical ?? false
      cbIsEvenBased.value = metricInfo?.event_based ?? false

      if (metricInfo?.categorical == true) {
         showObjectiveFunctionStreamFlow.value = true
         cbCategoricalDisabled.value = true
      }
      if (metricInfo?.event_based == true) {
         showObjectiveFunctionPeakFlow.value = true
         cbEventBasedDisabled.value = true
      }
   }
}

/**
 * metric stream flow field visibility toggle 
 */
const toggleMetricStreamFlowInput = () => {
   if (!cbCategoricalDisabled.value && cbIsCategorical.value) {
      showMetricStreamFlow.value = true
   } else if (!cbIsCategorical.value) {
      showMetricStreamFlow.value = false
      uiStreamFlowThreshold.value = undefined
   }
}

/**
 * metric peak flow field visibility toggle 
 */
const toggleMetricPeakFlowInput = () => {
   if (!cbEventBasedDisabled.value && cbIsEvenBased.value) {
      showMetricPeakFlow.value = true
   } else if (!cbIsEvenBased.value) {
      showMetricPeakFlow.value = false
      uiPeakFlowThreshold.value = undefined
   }
}

/**
 * explicitly reload optimization input table data
 */
const optimizationSelectChange = () => {
   uiOptimizationInputs.value = getOptimizationInputUserData.value
}


const gotoNext = () => {
   const tabs = document.getElementsByClassName("tabs");
   const e = <HTMLElement>tabs[CalibrationTabs.tab_statusRun];
   e.click();
}


/**
 * explicitly watching loading status, as onmount happen prior to store loading. 
 * make sure we manage the display base on user input AFTER data loading has completed 
 */
watch(() => optimizationStore_data_loading.value, (loading_status) => {
   const metricInfo = getSelectedMetricInfo.value?.pop()

   if (metricInfo?.categorical == true) {
      showObjectiveFunctionStreamFlow.value = true
      cbCategoricalDisabled.value = true
      cbIsCategorical.value = true
   } else if (metricInfo?.categorical == false && uiStreamFlowThreshold.value) {
      showMetricStreamFlow.value = true
      cbIsCategorical.value = true
   }

   if (metricInfo?.event_based == true) {
      showObjectiveFunctionPeakFlow.value = true
      cbEventBasedDisabled.value = true
      cbIsEvenBased.value = true
   } else if (metricInfo?.event_based == false && uiPeakFlowThreshold.value) {
      showMetricPeakFlow.value = true
      cbIsEvenBased.value = true
   }
})


/**
* event bus for calibration button group click
*/
const saveOptMetData = () => {
   toast.removeAllGroups()
   const save_optimization_response = saveOptimizationTabData()
   save_optimization_response.then((response) => {
      if (response?.validation_errors) {
         useApiErrorResponseValidator(response?.validation_errors).forEach((message: String) => {
            toast.add({ severity: "error", summary: 'Error Saving Optimization Metrics Tab Data', detail: message })
         })
      } else {
         toast.add({ severity: 'info', summary: 'Optimization Metrics Tab Data Saved', detail: response?.message, life: 3000 })
         fetchUserCalibrationRunData()
      }
   })
};

const goNextTab = () => {
   if (!uiOptimization.value) {
      toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "All Calibration Times are required.", life: 3000 })
   }
   if (!uiObjectiveFunction.value) {
      toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "All Automatic Validation Times are required.", life: 3000 })
   }
   if (!uiOptimization.value || !uiObjectiveFunction.value) {
      setTimeout(() => gotoNext(), 3000);
   }
   gotoNext();
};

const goPrevTab = () => {
   const tabs = document.getElementsByClassName("tabs");
   const e = <HTMLElement>tabs[CalibrationTabs.tab_tuningControls];
   e.click();
};

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#ObjectiveFunction_list,
.p-select-list-container {
   position: relative;
   z-index: 2;
   max-height: 8rem !important;
}
</style>
