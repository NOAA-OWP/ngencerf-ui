<template>
<div class="grid grid-rows-2">
  <div class="row-span-1">           
    <div id="RunDetailsTbl" class="text-left mt-3 p-3">
      <div class="tableTitle">Run Details</div>
      <DataTable id="cr-detail-list" :value="computedCalibrationRunDetailDataList" scrollable scroll-height="200px"
        table-style="min-width: 50rem" selectionMode="single" class="boxed" ref="calibrationRunDetailTable">
        <ColumnGroup type="header">
          <Row v-for="(row, index) in calibrationRunDetailDataListHeaders" :key="index">
            <Column v-for="( col, colIndex ) in row" :key="colIndex" :header="col.header" :colspan="col.colspan" :sortable="index==0" @click.top="sortCalibrationRunDetailDataList( col.field )"></Column>
          </Row>
        </ColumnGroup>
        <Column v-for="( col, colIndex ) in calibrationRunDetailTableColumn" :key="colIndex" :field="col.field" sortable></Column>      
      </DataTable>
    </div>
  </div>
  <div class="row-span-1 mt-3">           
    <div id="CalTuningParamsTbl" class="text-left mt-3 p-3">
      <div class="tableTitle">Corresponding Calibration Tuning Parameters</div>
      <DataTable class="dtable boxed" :value="computedtuningParametersDataList" scrollable scroll-height="200px"
        selectionMode="single" ref="tuningParametersTable"> 
        <ColumnGroup type="header">
          <Row v-for="(row, index) in tuningParametersDataListHeaders" :key="index">
            <Column v-for="( col, colIndex ) in row" :key="colIndex" :header="col.header" :colspan="col.colspan" :sortable="index==0"></Column>
          </Row>
        </ColumnGroup>
        <Column v-for="( col, colIndex ) in tuningParametersTableColumn" :key="colIndex" :field="col.field" sortable></Column> 
      </DataTable>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ColumnGroup from 'primevue/columngroup';
import ScrollTop from 'primevue/scrolltop';
import { useEvaluationAltIterationStore } from '~/stores/evaluation/EvaluationAltIterationStore';

const {     
    fetchCalibrationRunDetailDataList,
    fetchTuningParametersDataList,
    resetEvaluationAltIterationStore,
    sortCalibrationRunDetailDataList,
    sortTuningParametersDataList
} = useEvaluationAltIterationStore()

const {
  calibrationRunDetailDataListHeaders,
  tuningParametersDataListHeaders,
  calibrationRunDetailTableColumn,
  tuningParametersTableColumn,
  computedCalibrationRunDetailDataList,
  computedtuningParametersDataList
} = storeToRefs( useEvaluationAltIterationStore() )

const calibrationRunDetailTable = ref<HTMLTableElement>();
const tuningParametersTable = ref<HTMLTableElement>();

onMounted( () => {
    resetEvaluationAltIterationStore();
    fetchCalibrationRunDetailDataList();
    fetchTuningParametersDataList();

    const syncScroll = (source:any, target:any) => {
      source.addEventListener( "scroll", ( event: Event ) => {
        console.log( 'target', target.scrollTop );
        const { scrollTop } = event.target as HTMLElement;
        target.scrollTop = scrollTop;
      });
    };    

    syncScroll( calibrationRunDetailTable.value?.$el.children[0], tuningParametersTable.value?.$el.children[0] );
    syncScroll( tuningParametersTable.value?.$el.children[0], calibrationRunDetailTable.value?.$el.children[0] );
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
    background-color: #D8FFD8; 
}
#RunDetailsTbl .p-datatable-tbody > tr:nth-child(2) {
    background-color: #D8FFFF; 
}
#CalTuningParamsTbl .p-datatable-tbody > tr:nth-child(1) {
    background-color: #D8FFD8; 
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