<template>
<div class="grid grid-rows-2">
  <div class="row-span-1">           
    <div id="RunDetailsTbl" class="text-left mt-3 p-3">
      <div class="tableTitle">Run Details</div>
      <DataTable id="cr-detail-list" :value="calibrationRunDetailDataList" scrollable scroll-height="400px"
        table-style="min-width: 50rem" selectionMode="single" class="boxed">
        <Column field="iteration" header="Iteration" sortable></Column>
        <Column field="objective_function_value" header="Objective Function Value" sortable></Column>
        <Column field="metric_1" header="Metric 1" sortable></Column>
        <Column field="metric_2" header="Metric 2" sortable></Column>
        <Column field="metric_3" header="Metric 3" sortable></Column>
        <Column field="metric_4" header="Metric 4" sortable></Column>
        <Column field="metric_5" header="Metric 5" sortable></Column>
      </DataTable>
    </div>
  </div>
  <div class="row-span-1 mt-3">           
    <div id="CalTuningParamsTbl" class="text-left mt-3 p-3">
      <div class="tableTitle">Corresponding Calibration Tuning Parameters</div>
      <DataTable class="dtable boxed" :value="tuningParametersDataList" scrollable scroll-height="200px" fixedHeader=true>
        <Column field="iteration" header="Iteration" sortable></Column>
        <Column field="param_1" header="Param 1" sortable></Column>
        <Column field="param_2" header="Param 2" sortable></Column>
        <Column field="param_3" header="Param 3" sortable></Column>
        <Column field="param_4" header="Param 4" sortable></Column>
        <Column field="param_5" header="Param 5" sortable></Column>
        <Column field="param_6" header="Param 6" sortable></Column>
      </DataTable>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useEvaluationAltIterationStore } from '~/stores/evaluation/EvaluationAltIterationStore';

const {     
    fetchCalibrationRunDetailDataList,
    fetchTuningParametersDataList
} = useEvaluationAltIterationStore()

const calibrationRunDetailDataList = ref<any[]>([]);
const tuningParametersDataList = ref<any[]>([]);

onMounted( () => {
    calibrationRunDetailDataList.value = fetchCalibrationRunDetailDataList();
    tuningParametersDataList.value = fetchTuningParametersDataList();
})

const runDetailData = [
    { iteration: "NWM 3.0", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
    { iteration: "Best: 123", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
    { iteration: "0", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
    { iteration: "1", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
    { iteration: "2", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
    { iteration: "3", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
]

const tuningParamsData = [
    { iteration: "Best: 123", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", },
    { iteration: "0", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", },
    { iteration: "1", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", },
    { iteration: "2", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", },
    { iteration: "3", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", }
]

</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#RunDetailsTbl, #CalTuningParamsTbl {
    width: 900px;
    margin: 0 auto;
}

.tableTitle {
    margin: 15px 0 10px 0;
    font-size: 1.5em;

}
</style>