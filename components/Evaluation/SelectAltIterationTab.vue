<template>
<div class="grid grid-rows-2">
  <div class="row-span-1">           
    <div id="RunDetailsTbl" class="text-left mt-3 p-3">
      <div class="tableTitle">Run Details</div>
      <DataTable id="cr-detail-list" :value="computedCalibrationRunDetailDataList" scrollable scroll-height="200px"
        table-style="min-width: 50rem" selectionMode="single" class="boxed" ref="calibrationRunDetailTable">
        <template #header>
        <table>
        <tr v-for="(row, index) in calibrationRunDetailDataListHeaders" :key="index">
          <th v-for="( col, colIndex ) in row" :key="colIndex" :colspan="col.colspan">{{ col.header }}</th>
        </tr>
        </table>
        </template>
        <Column v-for="( col, colIndex ) in calibrationRunDetailTableColumn" :key="colIndex" :header="col.header" :field="col.field" :hidden="col.hidden ?? false" sortable></Column>      
      </DataTable>      
    </div>
  </div>
  <div class="row-span-1 mt-3">           
    <div id="CalTuningParamsTbl" class="text-left mt-3 p-3">
      <div class="tableTitle">Corresponding Calibration Tuning Parameters</div>
      <DataTable class="dtable boxed" :value="computedtuningParametersDataList" scrollable scroll-height="200px"
        selectionMode="single" ref="tuningParametersTable"> 
        <template #header>
          <table>
          <tr v-for="(row, index) in tuningParametersDataListHeaders" :key="index">
            <th v-for="( col, colIndex ) in row" :key="colIndex" :colspan="col.colspan">{{ col.header }}</th>
          </tr>
          </table>
        </template>
        <Column v-for="( col, colIndex ) in tuningParametersTableColumn" :key="colIndex" :header="col.header" :field="col.field" :hidden="col.hidden ?? false" sortable></Column> 
      </DataTable>
    </div>
  </div>
  <div class="row-span-1 mt-4 ActionButtonsBox">
    <div class="grid grid-cols-8">
      <span>
        <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
          <button class="font-normal" title="Run" aria-label="Run Button" @click="">
            Run
          </button>
        </div>
      </span>
      <span>
        <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
          <button class="font-normal" title="Cancel" aria-label="Cancel Button" @click="">
            Cancel
          </button>
        </div>
      </span>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useEvaluationAltIterationStore } from '~/stores/evaluation/EvaluationAltIterationStore';

const {     
  fetchCalibrationDataByIterationDataList,
    resetEvaluationAltIterationStore,
} = useEvaluationAltIterationStore()

const {
  calibrationRunDetailDataListHeaders,
  tuningParametersDataListHeaders,
  calibrationRunDetailTableColumn,
  tuningParametersTableColumn,
  computedCalibrationRunDetailDataList,
  computedtuningParametersDataList,
} = storeToRefs( useEvaluationAltIterationStore() )

const calibrationRunDetailTable = ref<HTMLTableElement>();
const tuningParametersTable = ref<HTMLTableElement>();

onMounted( () => {
  nextTick( () => {
    resetEvaluationAltIterationStore();
    fetchCalibrationDataByIterationDataList();
    //fetchTuningParametersDataList();

    const syncScroll = (source:any, target:any) => {
      source.addEventListener( "scroll", ( event: Event ) => {
        const { scrollTop } = event.target as HTMLElement;
        target.scrollTop = scrollTop;
      });
    };    

    syncScroll( calibrationRunDetailTable.value?.children[0], tuningParametersTable.value?.children[0] );
    syncScroll( tuningParametersTable.value?.children[0], calibrationRunDetailTable.value?.children[0] );
  })
})

/*
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
*/
</script>

<style lang="scss">
@import "/assets/styles/styles.scss";
#RunDetailsTbl .p-datatable-tbody > tr:nth-child(1) {
    background-color: $ngwcp_green_lt; 
}
#RunDetailsTbl .p-datatable-tbody > tr:nth-child(2) {
    background-color: $ngwcp_blue_lt; 
}
#CalTuningParamsTbl .p-datatable-tbody > tr:nth-child(1) {
    background-color: $ngwcp_green_lt; 
}

table#cr-detail-list2 {
  text-align: left;
  position: relative;
  border-collapse: collapse; 
}

table#cr-detail-list2 tbody {
  height:200px; 
  overflow-y:scroll; 
  display:block;
}

table#cr-detail-list2 thead { display:block; }

table#cr-detail-list2 th, table#cr-detail-list2 td {
  padding: 0.25rem;
}

table#cr-detail-list2 th {
  background: white;
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}
/*
#RunDetailsTbl, #CalTuningParamsTbl {
    width: 900px;
    margin: 0 auto;
}

.tableTitle {
    margin: 15px 0 10px 0;
    font-size: 1.5em;

}
*/
</style>