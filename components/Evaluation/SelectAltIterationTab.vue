<template>
          
  <div id="RunDetailsTbl" class="text-left mt-3 p-3">
    <div class="tableTitle">Run Details</div>
    <DataTable id="cr-detail-list" :value="computedCalibrationRunDetailDataList" scrollable scroll-height="200px" @row-select="onDetailTableRowSelect" @row-unselect="onTableRowUnselect"
      table-style="min-width: 50rem" selectionMode="single" class="boxed" ref="calibrationRunDetailTable" v-model:selection="selectedCalibrationByIterationDetailRow">
      <ColumnGroup type="header">
        <Row>
          <Column v-for="( col, colIndex ) in calibrationRunDetailTableColumn" :key="colIndex" :header="col.header" :field="col.field" :hidden="col.hidden ?? false" :class="col.styles ?? []" sortable></Column>
        </Row>
        <Row v-for="(row, index) in calibrationRunDetailDataListHeaders" :key="index" :pt="{ id: index }">
          <Column v-for="( col, colIndex ) in row" :key="colIndex" :header="col.header" :colspan="col.colspan"></Column>
        </Row>
      </ColumnGroup>
      <Column v-for="( col, colIndex ) in calibrationRunDetailTableColumn" :key="colIndex" :field="col.field" :hidden="col.hidden ?? false"></Column>
    </DataTable>      
  </div>
 
  <div class="mt-3">           
    <div id="CalTuningParamsTbl" class="text-left mt-3 p-3">
      <div class="tableTitle">Corresponding Calibration Tuning Parameters</div>
      <DataTable class="dtable boxed" :value="computedtuningParametersDataList" scrollable scroll-height="200px"  @row-select="onParameterTableRowSelect" @row-unselect="onTableRowUnselect"
        selectionMode="single" ref="tuningParametersTable" v-model:selection="selectedCalibrationByIterationParameterRow"> 
        <ColumnGroup type="header">
          <Row :class="['table-header']">
            <Column v-for="( col, colIndex ) in tuningParametersTableColumn" :key="colIndex" :header="col.header" :field="col.field" :hidden="col.hidden ?? false" sortable></Column> 
          </Row>
          <Row v-for="(row, index) in tuningParametersDataListHeaders" :key="index">
            <Column v-for="( col, colIndex ) in row" :key="colIndex" :header="col.header" :colspan="col.colspan"></Column>
          </Row>
        </ColumnGroup>
        <Column v-for="( col, colIndex ) in tuningParametersTableColumn" :key="colIndex" :header="col.header" :field="col.field" :hidden="col.hidden ?? false"></Column> 
      </DataTable>
    </div>
  </div>

  <div class="mt-4 ActionButtonsBox">
    <div class="grid grid-cols-8">
      <span>
        <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
          <button class="font-normal" title="Validate Selected Iteration" aria-label="Run Button" @click="navigateToEvaluateStatus">
            Next
          </button>
        </div>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { useEvaluationAltIterationStore } from '~/stores/evaluation/EvaluationAltIterationStore';
import { useToast } from "primevue/usetoast";
import { generalStore } from '~/stores/common/GeneralStore';
import { useValidationRunStatusStore } from '~/stores/evaluation/ValidationRunStatusStore';

const toast = useToast();
const {     
  fetchCalibrationDataByIterationDataList,
  resetEvaluationAltIterationStore,
  createNewValidationJob
} = useEvaluationAltIterationStore();

const {
  calibrationRunDetailDataListHeaders,
  tuningParametersDataListHeaders,
  calibrationRunDetailTableColumn,
  tuningParametersTableColumn,
  computedCalibrationRunDetailDataList,
  computedtuningParametersDataList,
  userSelectedCalibrationIterationId,
} = storeToRefs( useEvaluationAltIterationStore() );

const { clearRunningStatusInfo } = useValidationRunStatusStore();

const { evaluateIterationRunId } = storeToRefs( generalStore() );

const selectedCalibrationByIterationDetailRow = ref<any>();
const selectedCalibrationByIterationParameterRow = ref<any>();

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
    
    syncScroll( calibrationRunDetailTable.value?.$el.children[0], tuningParametersTable.value?.$el.children[0] );
    syncScroll( tuningParametersTable.value?.$el.children[0], calibrationRunDetailTable.value?.$el.children[0] );
  })
})

const onDetailTableRowSelect = ( event: DataTableRowClickEvent ) => {
  //userSelectedCalibrationIterationId.value = event.data.iteration_id;
  evaluateIterationRunId.value = event.data.iteration_id;
  const paramDataIndex = computedtuningParametersDataList.value.findIndex( paramData => paramData.iteration_id == event.data.iteration_id );
  selectedCalibrationByIterationParameterRow.value = computedtuningParametersDataList.value[ paramDataIndex ];
}

const onParameterTableRowSelect = ( event: DataTableRowClickEvent ) => {
  //userSelectedCalibrationIterationId.value = event.data.iteration_id;
  evaluateIterationRunId.value = event.data.iteration_id;
  const detailDataIndex = computedCalibrationRunDetailDataList.value.findIndex( paramData => paramData.iteration_id == event.data.iteration_id );
  selectedCalibrationByIterationDetailRow.value = computedCalibrationRunDetailDataList.value[ detailDataIndex ];
}

const onTableRowUnselect = ( event: DataTableRowClickEvent ) => {
  selectedCalibrationByIterationParameterRow.value = null;
  selectedCalibrationByIterationDetailRow.value = null;
  //userSelectedCalibrationIterationId.value = null;
  evaluateIterationRunId.value = 0;
}

const navigateToEvaluateStatus = ( event : any ) => {
  if ( evaluateIterationRunId.value && evaluateIterationRunId.value > 0 ) {
    clearRunningStatusInfo();
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[ EvaluationTabs.tab_runStatus ];
    e.click();
    // createNewValidationJob().then( response => {
    //   if ( response.status == 201 ) {
    //     if ( response?._data && response?._data?.validation_run_id && response?._data?.validation_run_id > 0 ) {
    //       evaluateValidationRunId.value = response._data.validation_run_id;
    //       const tabs = document.getElementsByClassName("tabs");
    //       const e = <HTMLElement>tabs[3];
    //       e.click();
    //     } else {
    //       toast.add({ severity: "error", summary: 'Create Validation Job Failed.', detail: "Unable to Retrieve Valid Validation Job Id", life: 10000 });
    //     }      
    //   } else {
    //     useApiErrorResponsePreprocess( response ).forEach( message => {
    //       toast.add({ severity: useApiResponseToastSeverityCode( response?.status ), summary: 'Create Validation Job Failed.', detail: message, life: 10000 });
    //     });
    //   }
    // })
  } else {
    toast.add({ severity: 'warn', summary: 'Missing Iteration ID', detail: 'Pleasea select a iteration job first.', life: 6000 })
  }
}
</script>

<style lang="scss">
@import "/assets/styles/styles.scss";

#RunDetailsTbl .p-datatable-thead > tr:nth-child(2) th {
    background-color: $ngwcp_green_lt; 
    border: $ngwcp_green_lt; 
    color: var(--p-datatable-row-color);
}
#RunDetailsTbl .p-datatable-thead > tr:nth-child(3) th {
    background-color: $ngwcp_blue_lt; 
    border: $ngwcp_blue_lt; 
    color: var(--p-datatable-row-color);
}
#CalTuningParamsTbl .p-datatable-thead > tr:nth-child(2) th {
    background-color: $ngwcp_green_lt; 
    border: $ngwcp_green_lt; 
    color: var(--p-datatable-row-color);
}

.p-datatable-tbody .p-datatable-selectable-row td {
    font-size: 0.8em;
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

th.p-datatable-header-cell.bg-objective-function-col,
th.p-datatable-header-cell.bg-objective-function-col:hover {
    background-color: rgb(251 146 60);
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