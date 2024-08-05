<template>
  <div id="OptimizationMetrics">
    <div class="grid grid-cols-2 pt-3 gap-10 ml-5">
      <div class="grid col-span-1">
        <div class="flex-row">
          <div class="flex row-span-1">
            <div id="OptAlg" class="bordered">
              Optimization Algorithm<br />
              Name:&nbsp;&nbsp;
              <select class="rounded-md">
                <option></option>
              </select>
            </div>
          </div>
          <div class="flex-row mt-2">
            <div class="text-center">Algorithm Parameter(s)</div>
            <div id="AlgParamtable" class="text-center mt-3">
              <DataTable :value="algorithm_parameters" scrollable scroll-height="300px" fixedHeader=true>
                <Column field="parameter" header="Parameter" sortable></Column>
                <Column field="initValue" header="Initial Value" sortable></Column>
              </DataTable>
            </div>
            <div id="ClearTableBtn" class="mb-5 ngenButtonDiv"><button>Clear <i class="pi pi-arrow-up"></i></button>
            </div>
          </div>
          <div class="flex-row">
            <div id="CalStop" class="bordered">
              Calibration Stop Criteria:<br />
              <input type="number" /><span class="ml-2">Interations</span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid col-span-1" style="border-left: 1px solid black">

        <div class="flex-row">
          <div id="ObjFunct" class="bordered">
            Objective Function<br />
            Name:&nbsp;&nbsp;
            <select class="rounded-md">
              <option></option>
            </select>
          </div>
        </div>
        <div class="flex-row">
          <div id="Metrics" class="bordered">
            Metrics<br />
            <input id="CalcCatMetCB" type="checkbox" class="h-5 w-5 mr-3 inline" @click="ShowFlowThreshold" />
            <label for="CalcCatMetCB">Calculate Categorical Metrics</label>
            <div v-if="showFlowThreshold" id="FlowThreshold" class="mt-3">
              Flow Threshold: <input class="h-7" type="number" /> m3/s
            </div>
          </div>
        </div>
        <div class="flex-row">
          <div id="PlotGenFreq" class="bordered">
            Plot Generation Frequency (0 = off)<br />
            Once Every:&nbsp;&nbsp;<input type="number" />&nbsp;&nbsp;Interations
          </div>
        </div>

      </div>
    </div>
    <div class="waitgif" v-if="loading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AlgorithmParameter } from '~/composables/NextGenModel';
import { mockAlogorithmParameterData } from '~/mockApi/calibrationAPIData';

const loading = ref(true);
const showFlowThreshold = ref(false);

const ShowFlowThreshold = (e: MouseEvent) => {
  const ele = <HTMLInputElement>document.getElementById("CalcCatMetCB");
  showFlowThreshold.value = ele.checked as boolean;

}
const algorithm_parameters = ref<AlgorithmParameter[]>([])

onMounted(() => {
  mockAlogorithmParameterData().forEach((param, index) => {
    algorithm_parameters.value.push(<AlgorithmParameter>param)
  });
  setTimeout(() => {
    loading.value = false;
  }, 500);
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
  background-color: $ngwcp_groupsbkg;
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
  border-radius: 20px;
  border: 1px solid #888888;
}
</style>
