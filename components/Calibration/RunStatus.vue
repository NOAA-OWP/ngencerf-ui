<template>
  <div class="grid grid-rows-4 h-full w-full">
    <div class="row-span-1">
      <div id="AdditionalMetrics">
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
        <!-- left -->
        <div class="col-span-1 colWidth80">
          <div class="grid grid-rows-1">
            <div class="row-span-1">
              <div id="MetricsTable">
                Metric(s) <sup>*</sup>
                <br />
                <DataTable :value="metricTableData" scrollable scroll-height="300px" class="bordered"
                  style="height: 400px;">
                  <Column field="metric" header="Metric" sortable></Column>
                </DataTable>
                <div class="text-center mt-2">
                  * Right click on metric entry<br />for deletion options
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- right -->
        <div class="col-span-1 colWidth80">
          <div class="grid grid-rows-12 gap-2">
            <div class="row-span-7">
              <div id="DepInputsTable">
                Dependent Input(s)<br />
                <DataTable :value="dependentInputTableData" scrollable scroll-height="300px">
                  <Column field="name" header="Name" sortable></Column>
                  <Column field="value" header="Value" sortable></Column>
                </DataTable>
              </div>
            </div>
            <div class="row-span-3">
              <div id="PlotGenFreq">
                <p class="mb-3">Plot Generation Frequency (0 = off)</p>
                <div id="PlotGenFreqVal" class="mt-5">
                  Once every:&nbsp;&nbsp;<input type="number" />
                  &nbsp;&nbsp;iterations
                </div>
              </div>
            </div>
            <div class="row-span-2">
              <div id="ClearMetAndDep">
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

onMounted(() => {
  mockRunStatusMetricData().forEach((data, index) => {
    metricTableData.value.push(<RunMetric>data)
  })

  mockRunStatusDependentInputData().forEach((data, index) => {
    dependentInputTableData.value.push(<RunDependentInput>data)
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
  border: 1px solid $ngwcp_primary3;
  border-radius: 20px;
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
  // width: 300px;
  // height: 100px;
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

.colWidth80 {
  width: 80%;
  margin: 0 auto;
}

.bordered {

  border: 1px solid $ngwcp_primary3;
}
</style>
