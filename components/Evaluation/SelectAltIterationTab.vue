<template>
  <client-only>
    <div class="h-screen-inner pr-2">
      <div id="RunDetailsTbl" class="text-left mt-3 pr-3 pl-3 pt-1">
        <div class="tableTitle">Run Details - Calibration Job ID {{ calibrationJobId }}</div>
        <DataTable id="cr-detail-list" :value="computedCalibrationRunDetailDataList" scrollable scroll-height="250px"
          @row-select="onDetailTableRowSelect" @row-unselect="onTableRowUnselect" table-style="min-width: 50rem"
          selectionMode="single" class="boxed" ref="calibrationRunDetailTable"
          v-model:selection="selectedCalibrationByIterationDetailRow"
          :rowClass="( {validation_run_id} ) => validation_run_id > 0 ? 'disabled-row' : ''">
          <ColumnGroup type="header">
            <Row>
              <Column v-for="( col, colIndex ) in calibrationRunDetailTableColumn" :key="colIndex" :header="col.header"
                :field="col.field" :hidden="col.hidden ?? false" :class="col.styles ?? []" sortable></Column>
            </Row>
            <Row v-for="(row, index) in calibrationRunDetailDataListHeaders" :key="index" :pt="{ id: index }">
              <Column v-for="( col, colIndex ) in row" :key="colIndex" :header="col.header" :class="col.styles ?? []" :colspan="col.colspan">
              </Column>
            </Row>
          </ColumnGroup>
          <Column v-for="( col, colIndex ) in calibrationRunDetailTableColumn" :key="colIndex" :field="col.field"
            :hidden="col.hidden ?? false" :class="col.styles ?? []"></Column>
        </DataTable>
        <div class="text-sm">* Metric used as Objective Function</div>
      </div>

      <div class="mt-1">
        <div id="CalTuningParamsTbl" class="text-left pr-3 pl-3 pt-1">
          <div class="tableTitle">Corresponding Calibration Tuning Parameters</div>
          <DataTable class="dtable boxed" :value="computedtuningParametersDataList" scrollable scroll-height="200px"
            @row-select="onParameterTableRowSelect" @row-unselect="onTableRowUnselect" selectionMode="single"
            ref="tuningParametersTable" v-model:selection="selectedCalibrationByIterationParameterRow"
            :rowClass="( {validation_run_id} ) => validation_run_id > 0 ? 'disabled-row' : ''">
            <ColumnGroup type="header">
              <Row :class="['table-header']">
                <Column v-for="( col, colIndex ) in tuningParametersTableColumn" :key="colIndex" :header="col.header"
                  :field="col.field" :hidden="col.hidden ?? false" sortable></Column>
              </Row>
              <Row v-for="(row, index) in tuningParametersDataListHeaders" :key="index">
                <Column v-for="( col, colIndex ) in row" :key="colIndex" :header="col.header" :colspan="col.colspan">
                </Column>
              </Row>
            </ColumnGroup>
            <Column v-for="( col, colIndex ) in tuningParametersTableColumn" :key="colIndex" :header="col.header"
              :field="col.field" :hidden="col.hidden ?? false"></Column>
          </DataTable>
        </div>
      </div>

      <div class="b-0 grid grid-cols-8 mt-6 ActionButtonsBox"
        v-show="evaluateIterationRunId && evaluateIterationRunId > 0">
        <div class="col-span-7"></div>
        <div class="col-span-1 mr-4">
          <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Validate Selected Iteration" aria-label="Run Button"
            @click="navigateToEvaluateStatus">
            Next
          </Button>
        </div>
      </div>
    </div>

  </client-only>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";

import type { DataTableRowClickEvent } from 'primevue/datatable';
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { useEvaluationAltIterationStore } from '@/stores/evaluation/EvaluationAltIterationStore';
import { generalStore } from '@/stores/common/GeneralStore';
import { useEvaluationRunStatusStore } from '@/stores/evaluation/EvaluationRunStatusStore';

import { hilightTab } from '@/composables/TabHilight';

const { addToastRecord } = generalStore();

const toast = useToast();
const {
  fetchCalibrationDataByIterationDataList,
  resetEvaluationAltIterationStore,
} = useEvaluationAltIterationStore();

const {
  calibrationRunDetailDataListHeaders,
  tuningParametersDataListHeaders,
  calibrationRunDetailTableColumn,
  tuningParametersTableColumn,
  computedCalibrationRunDetailDataList,
  computedtuningParametersDataList,
} = storeToRefs(useEvaluationAltIterationStore());

const { clearRunningStatusInfo } = useEvaluationRunStatusStore();
const { iterationValidationRunId } = storeToRefs(useEvaluationRunStatusStore());
const { calibrationJobId, evaluateIterationRunId, evaluateValidationRunId, evaluateDisplayIterationNumber } = storeToRefs(generalStore());

const selectedCalibrationByIterationDetailRow = ref<any>();
const selectedCalibrationByIterationParameterRow = ref<any>();

const calibrationRunDetailTable = ref<HTMLTableElement>();
const tuningParametersTable = ref<HTMLTableElement>();

onMounted(() => {
  hilightTab(EvaluationTabs.tab_selectAltIteration);

  nextTick(() => {
    resetEvaluationAltIterationStore();
    fetchCalibrationDataByIterationDataList();

    const syncScroll = (source: any, target: any) => {
      source.addEventListener("scroll", (event: Event) => {
        const { scrollTop } = event.target as HTMLElement;
        target.scrollTop = scrollTop;
      });
    };

    syncScroll(((calibrationRunDetailTable.value as any)?.$el as HTMLTableElement).children[0], ((tuningParametersTable.value as any)?.$el as HTMLTableElement)?.children[0]);
    syncScroll(((tuningParametersTable.value as any)?.$el as HTMLTableElement)?.children[0], ((calibrationRunDetailTable.value as any)?.$el as HTMLTableElement)?.children[0]);
  })
})

const onDetailTableRowSelect = (event: DataTableRowClickEvent) => {
  if (event.data.validation_run_id === "") {
    evaluateIterationRunId.value = event.data.iteration_id;
  } else {
    evaluateIterationRunId.value = 0;
  }
  evaluateDisplayIterationNumber.value = event.data.iteration_num;
  const paramDataIndex = computedtuningParametersDataList.value.findIndex(paramData => paramData.iteration_id === event.data.iteration_id);
  selectedCalibrationByIterationParameterRow.value = computedtuningParametersDataList.value[paramDataIndex];
}

const onParameterTableRowSelect = (event: DataTableRowClickEvent) => {
  if (event.data.validation_run_id === "") {
    evaluateIterationRunId.value = event.data.iteration_id;
  } else {
    evaluateIterationRunId.value = 0;
  }
  evaluateDisplayIterationNumber.value = event.data.iteration_num;
  const detailDataIndex = computedCalibrationRunDetailDataList.value.findIndex(paramData => paramData.iteration_id === event.data.iteration_id);
  selectedCalibrationByIterationDetailRow.value = computedCalibrationRunDetailDataList.value[detailDataIndex];
}

const onTableRowUnselect = (event: DataTableRowClickEvent) => {
  selectedCalibrationByIterationParameterRow.value = null;
  selectedCalibrationByIterationDetailRow.value = null;
  evaluateIterationRunId.value = 0;
  evaluateDisplayIterationNumber.value = 0;
}

const navigateToEvaluateStatus = (event: any) => {
  if (evaluateIterationRunId.value && evaluateIterationRunId.value > 0) {
    iterationValidationRunId.value = evaluateValidationRunId.value = 0;
    clearRunningStatusInfo();
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_runStatus];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Iteration ID', detail: 'Please select a iteration job first.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}
</script>

<style scoped>
#RunDetailsTbl .p-datatable-thead>tr:nth-child(2) th,
#RunDetailsTbl .p-datatable-thead>tr:nth-child(2) th:hover {
  background-color: #8BE3ED !important; /* replaced global.$ngwcp_blue_md */
  border: #8BE3ED;
  color: var(--p-datatable-row-color) !important;
}

#RunDetailsTbl .p-datatable-thead>tr:nth-child(3) th,
#RunDetailsTbl .p-datatable-thead>tr:nth-child(3) th:hover {
  background-color: #D8FFFF !important; /* replaced global.$ngwcp_blue_lt */
  border: #D8FFFF;
  color: var(--p-datatable-row-color) !important;
}

#CalTuningParamsTbl .p-datatable-thead>tr:nth-child(2) th,
#CalTuningParamsTbl .p-datatable-thead>tr:nth-child(2) th:hover {
  background-color: #D8FFFF !important; /* replaced global.$ngwcp_blue_lt */
  border: #D8FFFF;
  color: var(--p-datatable-row-color) !important;
}

.p-datatable-tbody .p-datatable-selectable-row.disabled-row td {
  font-weight: 500;
  color: darkgray;
}

table#cr-detail-list2 {
  text-align: left;
  position: relative;
  border-collapse: collapse;
}

table#cr-detail-list2 tbody {
  height: 200px;
  overflow-y: scroll;
  display: block;
}

table#cr-detail-list2 thead {
  display: block;
}

table#cr-detail-list2 th,
table#cr-detail-list2 td {
  padding: 0.25rem;
}

table#cr-detail-list2 th {
  background: white;
  position: sticky;
  top: 0;
  /* Don't forget this, required for the stickiness */
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}

th.p-datatable-header-cell.bg-objective-function-col,
th.p-datatable-header-cell.bg-objective-function-col:hover {
  background-color: rgb(204, 85, 0) !important;
}

#RunDetailsTbl .p-datatable-thead>tr:nth-child(2) th.bg-objective-function-col,
#RunDetailsTbl .p-datatable-thead>tr:nth-child(2):hover th.bg-objective-function-col {
  background-color: rgb(246, 189, 148) !important;
  border: rgb(246, 189, 148);
}

#RunDetailsTbl .p-datatable-thead>tr:nth-child(3) th.bg-objective-function-col,
#RunDetailsTbl .p-datatable-thead>tr:nth-child(3):hover th.bg-objective-function-col {
  background-color: rgb(255, 241, 230) !important;
  border: rgb(255, 241, 230);
}

tr.p-datatable-selectable-row td.bg-objective-function-col {
  background-color: rgb(252, 248, 242) !important;
}

tr.p-datatable-selectable-row:hover td.bg-objective-function-col {
  background-color: rgb(245, 238, 233)  !important;
}

tr.p-datatable-selectable-row.p-datatable-row-selected:hover td.bg-objective-function-col {
  background-color: rgb(255, 236, 221) !important;
}
</style>