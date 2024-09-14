<template>
   <div id="OptimizationMetrics">
      <div class="grid grid-cols-2 pt-3 gap-10 ml-5">
         <div class="grid col-span-1">
         <div class="flex-row">
            <div class="flex row-span-1">
               <div id="OptAlg" class="bordered">
               Optimization Algorithm<br />
               Name:&nbsp;&nbsp;
               <Select clas="rounded-md" v-model="uiOptimization" :options="getOptimizationAlgorithmOptionsList" optionLabel="name"
               optionValue="name" placeholder="" @change="optimizationSelectChange"></Select>
               </div>
            </div>
            <div class="flex-row mt-2">
               <div class="text-center">Algorithm Parameter(s)</div>
               <div id="AlgParamtable" class="text-center mt-3 bordered p-3">
               <DataTable :value="uiOptimizationInputs" scrollable  editMode="cell" scroll-height="300px" fixedHeader=true>
                  <Column field="name" header="Parameter" sortable></Column>
                  <Column field="value" header="Initial Value" sortable>
                     <template #editor="{ index }">
                        <InputText v-model="uiOptimizationInputs[ index ].value" autofocus class="w-12 p-1"></InputText>
                     </template>
                  </Column>
               </DataTable>
               </div>
               <div id="ClearTableBtn" class="mb-5 ngenButtonDiv"><button @click="resetOptimizationInputs">Clear <i class="pi pi-arrow-up"></i></button>
               </div>
            </div>
            <div class="flex-row">
               <div id="CalStop" class="bordered">
               Calibration Stop Criteria:<br />
               <InputNumber inputId="stop-criteria" v-model="uiStopCriteria" showButtons :min="0"></InputNumber><span class="ml-2">Interations</span>
               </div>
            </div>
         </div>
         </div>
         <div class="grid col-span-1" style="border-left: 1px solid black">

         <div class="flex-row">
            <div id="ObjFunct" class="bordered">
               Objective Function<br />
               Name:&nbsp;&nbsp;
               <Select class="rounded-md" v-model="uiObjectiveFunction" :options="getObjectiveFunctionOptionsList" optionLabel="name"
               optionValue="name" placeholder="" @change="updateMetricFlowFieldVisibility"></Select>
               <div v-if="showObjectiveFunctionStreamFlow">
               Flow Threshold: <InputNumber inputId="ofCategoricalFlowThreshold" v-model="uiStreamFlowThreshold" class="w-24"></InputNumber> m3/s
               </div>
               <div v-if="showObjectiveFunctionPeakFlow">
               Peak Flow Threshold: <InputNumber inputId="ofEventBasedFlowThreshold" v-model="uiPeakFlowThreshold" class="w-24"></InputNumber> quantile
               </div>
            </div>
         </div>
         <div class="flex-row">
            <div id="Metrics" class="bordered">
               <div>Metrics</div>
               <Checkbox inputId="CalcCatMetCB" class="h-5 w-5 mr-3 inline" :binary="true" v-model="cbIsCategorical" :disabled="cbCategoricalDisabled" @change="toggleMetricStreamFlowInput" />
               <label for="CalcCatMetCB">Calculate Categorical Metrics</label>
               <div v-if="showMetricStreamFlow" id="FlowThreshold" class="mt-3">
               Flow Threshold: <InputNumber inputId="metricCategoricalFlowThreshold" v-model="uiStreamFlowThreshold" class="w-24"></InputNumber> m3/s
               </div>
               <br/><br/>
               <Checkbox inputId="CalEventMetCB" class="h-5 w-5 mr-3 inline" :binary="true" v-model="cbIsEvenBased" :disabled="cbEventBasedDisabled" @change="toggleMetricPeakFlowInput" />
               <label for="CalEventMetCB">Calculate Event Based Metrics</label>
               <div v-if="showMetricPeakFlow" id="FlowThreshold" class="mt-3">
               Peak Flow Threshold: <InputNumber inputId="metricEventBasedFlowThreshold" v-model="uiPeakFlowThreshold" class="w-24"></InputNumber> quantile
               </div>
            </div>
         </div>
         <div class="flex-row">
            <div id="PlotGenFreq" class="bordered">
               Plot Generation Frequency (0 = off)<br />
               Once Every:&nbsp;&nbsp;<InputNumber inputId="plotFrequency" v-model="uiPlotFrequency" showButtons :min="0"></InputNumber> &nbsp;&nbsp;Interations
            </div>
         </div>

         </div>
      </div>
      <div class="waitgif" v-if="data_loading">
         <img src="@/assets/styles/img/wait.gif" />
      </div>
   </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import type { AlgorithmParameter, GeneralErrorResponse } from '~/composables/NextGenModel';
import { useOptimizationStore } from '~/stores/calibration/OptimizationStore';
import { useToast } from "primevue/usetoast";
import { generalStore } from "~/stores/common/GeneralStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";

const optimizationStore = useOptimizationStore()
const { 
      uiObjectiveFunction,
      uiOptimization,
      uiOptimizationInputs,
      uiPeakFlowThreshold,
      uiPlotFrequency,
      uiStopCriteria,
      uiStreamFlowThreshold,
      data_loading,
      getOptimizationAlgorithmOptionsList,
      getObjectiveFunctionOptionsList,
      showObjectiveFunctionPeakFlow,
      showObjectiveFunctionStreamFlow,
      getSelectedMetricInfo,
      getOptimizationInputUserData
      } = storeToRefs( optimizationStore )
const { saveOptimizationTabData, resetOptimizationInputs, resetUserSelection } = optimizationStore
const { fetchUserCalibrationRunData } = useUserDataStore()
const { getCalibrationTabIndex } = generalStore()
const toast = useToast()
      
const cbCategoricalDisabled = ref<boolean>( false )
const cbEventBasedDisabled = ref<boolean>( false )
const cbIsCategorical = ref<boolean>( false )
const cbIsEvenBased = ref<boolean>( false )
const showMetricPeakFlow = ref<boolean>( false )
const showMetricStreamFlow = ref<boolean>( false )



console.log("uiObjectiveFunction",uiObjectiveFunction);
console.log("uiOptimization",uiOptimization);
console.log("uiOptimizationInputs",uiOptimizationInputs);
/**
 * update objective function and metric peak flow/stream flow field visibility
 */
const updateMetricFlowFieldVisibility = () => {
   if( getSelectedMetricInfo.value ) {      
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

      if( metricInfo?.categorical == true ) {
         showObjectiveFunctionStreamFlow.value = true
         cbCategoricalDisabled.value = true
      }
      if( metricInfo?.event_based == true ) {
         showObjectiveFunctionPeakFlow.value = true
         cbEventBasedDisabled.value = true
      }   
   }   
}

/**
 * metric stream flow field visibility toggle 
 */
const toggleMetricStreamFlowInput = () => {
   if ( !cbCategoricalDisabled.value && cbIsCategorical.value ) {
      showMetricStreamFlow.value = true
   } else if( !cbIsCategorical.value ) {
      showMetricStreamFlow.value = false
      uiStreamFlowThreshold.value = undefined
   }
}

/**
 * metric peak flow field visibility toggle 
 */
const toggleMetricPeakFlowInput = () => {
   if( !cbEventBasedDisabled.value && cbIsEvenBased.value ) {
      showMetricPeakFlow.value = true
   } else if ( !cbIsEvenBased.value ) {
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

/**
 * event bus for calibration button group click
 */
useListen( 'calibrationButtonSaveStart', ( actionButton ) => {
   if( getCalibrationTabIndex() === 4 && actionButton == 'SAVE' ) {
      toast.removeAllGroups()
      const save_optimization_response = saveOptimizationTabData()
      
      save_optimization_response.then( ( response ) => {
         if ( response?.status == 'error' ) {
            toast.add({ severity: response?.status, summary: 'Error Saving Optimization Metrics Tab Data', detail: response?.message })
         } else {
            toast.add({ severity: 'info', summary: 'Optimization Metrics Tab Data Saved', detail: response?.message, life: 3000 })
            fetchUserCalibrationRunData()
         }
      })
   }
})

useListen( 'calibrationButtonResetStop', ( actionButton) => {
  if( getCalibrationTabIndex() == 4 && actionButton == 'RESET' ) {
    resetUserSelection()
  }
})

/**
 * explicitly watching loading status, as onmount happen prior to store loading. 
 * make sure we manage the display base on user input AFTER data loading has completed 
 */
watch( () => data_loading.value, ( loading_status ) => {
   const metricInfo = getSelectedMetricInfo.value?.pop()
   
   if( metricInfo?.categorical == true ) {
      showObjectiveFunctionStreamFlow.value = true
      cbCategoricalDisabled.value = true
      cbIsCategorical.value = true
   } else if( metricInfo?.categorical == false && uiStreamFlowThreshold.value ) {
      showMetricStreamFlow.value = true
      cbIsCategorical.value = true
   }

   if( metricInfo?.event_based == true ) {
      showObjectiveFunctionPeakFlow.value = true
      cbEventBasedDisabled.value = true
      cbIsEvenBased.value = true
   } else if( metricInfo?.event_based == false && uiPeakFlowThreshold.value ) {
      showMetricPeakFlow.value = true
      cbIsEvenBased.value = true
   }
})

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#CalStop,
#ObjFunct,
#Metrics,
#PlotGenFreq,
#OptAlg {
   width: 381px;
   //background-color: $ngwcp_groupsbkg;
   margin: 0 auto;
   padding: 10px;
   line-height: 2em;
}

#CalStop {
   margin-top: 20px;
}

#OptAlg select,
#ObjFunct select,
#Metrics select {
   width: 80%;
}

#ObjFunct input,
#FlowThreshold input,
#PlotGenFreq input {
   display: inline;
   width: 50%;
   height: 26px;
}

#CalStop input,
#PlotGenFreq input {
   width: 30%;
   height: 26px;
}

#AlgParamtable {
   width: 370px;
   margin: 5px auto 5px auto;
   max-height: 160px !important;
   overflow: hidden;
}

#ClearTableBtn {
   height: 32px;
   width: 370px;
   padding: 5px 0 0 5px;
   margin: 8px auto;
}

.rounded {
   border: 1px solid #000;
}

.bordered {
   border-radius: 8px;
   border: 1px solid #888888;
}
</style>
