<template>
  <div id="OptimizationMetrics">
    <div class="grid grid-cols-2 pt-3 gap-10 ml-5">
      <div class="grid col-span-1">
        <div class="grid grid-rows-8">
          <div class="row-span-1">
            <div id="OptAlg"  class="text-center bordered" >
              Optimization Algorithm<br />
              Name:&nbsp;&nbsp;
              <select class="rounded-md">
                <option></option>
              </select>
            </div>
          </div>
          <div class="row-span-4 mt-5">
            <div id="AlgParamtable"  class="text-center" >
              Algorithm Parameter(s)
              <table style="height: 270px; max-width: 480px; margin: 0 auto">
                <tr>
                  <td>
                    <DataTable :value="algorithm_parameters" scrollable scroll-height="300px" >
                      <Column field="parameter" header="Parameter" sortable></Column>
                      <Column field="initValue" header="Initial Value" sortable></Column>
                    </DataTable> 
                  </td>
                </tr>
              </table>
              <div id="ClearTableBtn" class="text-center"><button>Clear <i class="pi pi-arrow-up"></i></button></div>
            </div>
          </div>
          <div class="row-span-2">
            <div id="CalStop" class="text-center bordered">
              Calibration Stop Criteria:<br />
              <input type="number" /><br />
              Interations
            </div>
          </div>
        </div>
      </div>
      <div class="grid col-span-1" style="border-left: 1px solid black">
        <div class="grid grid-rows-6">
          <div class="row-span-1">
            <div id="ObjFunct" class="text-center bordered" >
              Objective Function<br />
              Name:&nbsp;&nbsp;
              <select class="rounded-md">
                <option></option>
              </select>
            </div>
          </div>
          <div class="row-span-1">
            <div id="Metrics" class="text-center bordered" >
              Metrics<br />
              <input
                id="CalcCatMetCB"
                type="checkbox"
                class="h-5 w-5 mr-3 inline"
                @click="ShowFlowThreshold"
              />
              <label for="CalcCatMetCB">Calculate Categorical Metrics</label>
              <div v-if="showFlowThreshold" id="FlowThreshold" class="mt-3">
                Flow Threshold: <input class="h-7" type="number" /> m3/s
              </div>
            </div>
          </div>
          <div class="row-span-1">
            <div id="PlotGenFreq" class="text-center bordered">
              Plot Generation Frequency (0 = off)<br />
              Once Every:&nbsp;&nbsp;<input
                type="number"
              />&nbsp;&nbsp;Interations
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AlgorithmParameter } from '~/composables/NextGenModel';
import { mockAlogorithmParameterData } from '~/mockApi/calibrationAPIData';

const showFlowThreshold = ref(false);

const ShowFlowThreshold = (e:MouseEvent) => {
  const ele = <HTMLInputElement>document.getElementById("CalcCatMetCB");
    showFlowThreshold.value = ele.checked as boolean;

}

const algorithm_parameters = ref<AlgorithmParameter[]>([])

onMounted( () => {
  mockAlogorithmParameterData().forEach( (param, index ) => {
    algorithm_parameters.value.push( <AlgorithmParameter>param )
  });
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
  padding: 15px;
  line-height: 2em;
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

#AlgParamtable table {
  width: 100%;
  background-color: $ngwcp_groupsbkg;
}

#ClearTableBtn {
  background-color: $ngwcp_primary1;
  height: 40px;
  width: 70px;
  color: white;
  border-radius: 10px;
  padding: 8px 0 0 8px;
  margin: 8px 0 0 62px;
  border: 1px solid #888888;
}
.rounded {

  border: 1px solid #000;
}

.bordered {
  border-radius: 20px;
  border: 1px solid #888888;
}
</style>
