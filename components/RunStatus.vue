<template>
  <div class="grid grid-rows-4 ml-10 h-full w-full">
    <div class="row-span-1">
      <div id="AdditionalMetrics" class="bordered">
        <strong class="">Additional Metrics</strong>
        &nbsp;&nbsp;&nbsp;&nbsp;Name:&nbsp;&nbsp;
        <select>
          <option>RMSE</option>
        </select>
        <div id="AddButton" class="inline-block">
          <button>Add</button>
        </div>
      </div>
    </div>
    <div class="grid grid-rows-3 mt-5">
      <div class="grid grid-cols-2">
        <div id="MetricsTable">
          <div class="col-span-1">
            Metric(s) <sup>*</sup><br />
            <br />
            <DataTable :value="metricTableData" scrollable scroll-height="300px" >
              <Column field="metric" header="Metric" sortable></Column>
            </DataTable> 
          </div>
          <div class="text-center">
            * Right click on metric entry<br />for deletion options
          </div>
        </div>
        <div id="DepInputsTable">
          <div class="col-span-1">
            <div class="grid grid-rows-3">
              <div class="row-span-1">
                <div class="col-span-1">
                  Dependent Input(s)<br />
                  <br />
                  <DataTable :value="dependentInputTableData" scrollable scroll-height="300px" >
                    <Column field="name" header="Name" sortable></Column>
                    <Column field="value" header="Value" sortable></Column>
                  </DataTable> 
                </div>
              </div>
            </div>
            <div class="row-span-1">
              <div id="PlotGenFreq">
                <p class="mb-3">Plot Generation Frequency (0 = off)</p>
                <div id="PlotGenFreqVal" class="mt-5">
                  Once every:&nbsp;&nbsp;<input type="number"/>
                  &nbsp;&nbsp;iterations
                </div>
              </div>
            </div>
            <div class="row-span-1">
              <div id="ClearMetAndDep" class="mt-20">
                <button>Clear Metrics and Dependent Inputs</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RunDependentInput, RunMetric } from '~/composables/NextGenModel';
import { mockRunStatusDependentInputData, mockRunStatusMetricData } from '~/mockApi/calibrationAPIData';

const metricTableData = ref<RunMetric[]>([])
const dependentInputTableData = ref<RunDependentInput[]>([])

onMounted( () => {
  mockRunStatusMetricData().forEach( (data, index ) => {
    metricTableData.value.push( <RunMetric>data )
  })

  mockRunStatusDependentInputData().forEach( (data, index ) => {
    dependentInputTableData.value.push( <RunDependentInput>data )
  })
})
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#AdditionalMetrics {
  margin: 20px auto 0 auto;
  padding: 20px;
  width: 600px;
  height: 70px;
  background-color: $ngwcp_groupsbkg;
  select {
    width: 200px;
  }
}

#AddButton {
  width: 72px;
  height: 27px;
  border-radius: 10px;
  background-color: $ngwcp_primary1;
  color: white;
  text-align: center;
  padding-top: 2px;
  margin-left: 35px;
}

#MetricsTable {
  margin: 0 auto;
  width: 300px;
  height: 100px;
  background-color: $ngwcp_groupsbkg;
}

#PlotGenFreq {
  padding: 20px;
  width: 425px;
  height: 110px;
  background-color: $ngwcp_groupsbkg;
  border-radius: 10px;
  input {
    width: 200px;
  }
}

#ClearMetAndDep {
  width: 425px;
  height: 60px;
  border-radius: 20px;
  background-color: $ngwcp_primary1;
  color: white;
  padding: 15px 10px;
  text-align: center;
  font-weight: 600;
  border: 2px solid black;
}
#ClearMetAndDep:hover {
  background-color: $ngwcp_primary3;
}
.bordered {
  border-radius: 20px;
  border: 1px solid #888888;
}
</style>
