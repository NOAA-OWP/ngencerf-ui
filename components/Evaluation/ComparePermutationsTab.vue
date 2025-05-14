<template>
    <Transition name="slide-fade">
      <div id="MessagesGroupWindow" v-if="showMessagesGroup">
        <div class="text-right sticky top-0">
          <img title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
            class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
        </div>
        <MessagesGroup />
      </div>
    </Transition>
    <div id="ComparePermutationsPage">
        <div v-if="plotList && plotList.length >= 2" class="pl-6 pr-2 pt-2">
            <div class="flex mt-3">
                <label for="DisplayOptions" class="pr-2 pt-3">Display </label>
                <div class="inline-block w-2/3">
                    <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName" :options="plotList"
                        optionLabel="name" optionValue="name">
                    </Select>
                </div>
            </div>
        </div>
        <h1 class="mt-4 mb-4">Compare Calibration Jobs for Gage {{ uiGageId }}</h1>
        <div id="SupplementalTableArea" v-if="selectedSupplementalTable">
          <div id="SupplementalTableArea" class="p-2">
            <div v-if="performanceMetricsData && performanceMetricsData.length > 0 && selectedSupplementalTable === 1">
              <ContextMenu :pt="{ root: { id: ' cp-context-menu' } }" class="bg-white" ref="cpContextMenu"
                :model="cmCompareRun"></ContextMenu>
              <DataTable id="performanceMetricsTable" :value="performanceMetricsData" fixedHeader=true 
                  scrollable scroll-height="500px" :multi-sort="true" selectionMode="single"
                  v-model:selection="selectedDataRow" @rowContextmenu="onRowCpContextMenu">
                <Column v-for="(col, colIndex) in performanceMetricsColumns" :key="colIndex" :header="col.header"
                  :field="col.field"></Column>
              </DataTable>
            </div>
          </div>
        </div>
        <div v-if="plotTables.length > 0 && selectedSupplementalTable === 0">
            <ContextMenu :pt="{ root: { id: ' cp-context-menu-' } }" class="bg-white" ref="cpContextMenu"
              :model="cmCompareRun"></ContextMenu>
            <div v-for="(table, index) in plotTables">
                <h2 class="mt-2 mb-1">{{ table.title }}</h2>
                <DataTable :id="'plotTableHTML-' + index " :value="table.data" fixedHeader=true 
                    scrollable scroll-height="500px" :multi-sort="true" selectionMode="single"
                    v-model:selection="selectedDataRow" @rowContextmenu="onRowCpContextMenu">
                    <Column v-for="col of table.columns" :key="col.value" :field="col.value" :header="col.header"
                        :sortable="true" :pt="col.value === 'formulation_name' ? ptColumnText : (col.value === 'calibration_run_id' ? ptColumnId : ptColumn)"></Column>
                </DataTable>
            </div>
        </div>
    </div>
    <div class="waitgif" v-if="isComparePermutationsLoading">
        <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import { useToast } from 'primevue/usetoast';
import { DateTime } from "luxon";


import type { DynamicObject, DataTableContextMenuOption } from "@/composables/NgencerfModels";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";
import { formatISOStringOrDateToYYYYMMDD } from "@/utils/TimeHelpers";
import { isValidDate, isValidDateTime } from "@/utils/CommonHelpers";

import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { useEvaluationSupplementalDataStore } from "@/stores/evaluation/EvaluationSupplementalDataStore";
import { generalStore } from '@/stores/common/GeneralStore';
import { useRunStatusStore } from '@/stores/calibration/RunStatusStore';
import { useUserDataStore } from '@/stores/common/UserDataStore';

import MessagesGroup from "../Common/MessagesGroup.vue";

import { hilightTab } from '@/composables/TabHilight';

import * as Plot from "@observablehq/plot";

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();
const evaluationSupplementalDataStore = useEvaluationSupplementalDataStore();
const runStatusStore = useRunStatusStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const showMessagesGroup = ref<boolean>(false);

const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const {
    plotNames,
    plotList,
    selectedPlotName
} = storeToRefs(runStatusStore);
const {
  uiGageId,
  selectedCalibrationCompareRuns,
} = storeToRefs(evaluationCalibrationRunStore);
const {
    queryGetPlotNamesForComparison,
    queryGetPlotsForComparison,
    loadSelectedCalibrationRun
} = evaluationCalibrationRunStore;
const {
  queryGetPerformanceMetricsForComparison
} = evaluationSupplementalDataStore;

const isComparePermutationsLoading = ref<boolean>(false);

const plotTables = ref<DynamicObject>({});
const plotTableData = ref<any[]>([]);
//this model is for highlighting purpose
const selectedDataRow = ref<DynamicObject>();
const cpContextMenu = ref(); //compare run context menu
const cmCompareRun = ref<DataTableContextMenuOption[]>([]);

const initTablesBarChartMetrics = [
    {'name': 'calib', 'title': 'Calibration Period Best Run Metrics', data: [], columns: []},
    {'name': 'valid', 'title': 'Validation Period Best Run Metrics', data: [], columns: []},
    {'name': 'full', 'title': 'Full Period Best Run Metrics', data: [], columns: []},
]

const selectedSupplementalTable = ref<number>(0);
const supplementalTableOptions = ref<any[]>([
  'Performance Metrics Table'
]);
const performanceMetrics = ref<APIResponse>({});
const performanceMetricsData = ref<any[]>([]);
const performanceMetricsColumns = ref<any[]>([]);

// Display our runs in numeric order
selectedCalibrationCompareRuns.value.sort((a, b) => a['calibration_run_id'] - b['calibration_run_id']);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "right", "padding-right": "10px !important", "white-space": "nowrap" } }
});
const ptColumnText = ref(JSON.parse(JSON.stringify(toRaw(ptColumn.value))));
ptColumnText.value.bodyCell.style['text-align'] = 'left';
const ptColumnId = ref(JSON.parse(JSON.stringify(toRaw(ptColumn.value))));
ptColumnId.value.bodyCell.style['text-align'] = 'center';

onMounted(() => {
    isComparePermutationsLoading.value = true;
    selectedPlotName.value = '';
    nextTick(async () => {
        hilightTab(EvaluationTabs.tab_compare);

        const response = await queryGetPlotNamesForComparison();
        if (response.ok) {
          plotNames.value = response;
          plotList.value = ((plotNames?.value as any)?._data as PlotNames)?.plot_names;

          // Add Supplemental Table Options to the dropdown
          for (let t = 0; t < supplementalTableOptions.value.length; t++) {
            if (!plotList.value.some(item => item.name === supplementalTableOptions.value[t])) {
              plotList.value.push({ name: supplementalTableOptions.value[t], description: '' });
            }
          }

          // If we only have one plot option, hide the dropdown and just default to that option
          if (plotList.value.length === 1) {
              selectedPlotName.value = plotList.value[0].name
          }
        } else {
          toast.removeAllGroups();
          const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error getting plot names', life: ToastTimeout.timeout5000 };
          toast.add(tMsg); addToastRecord(tMsg);
        }
    })
    isComparePermutationsLoading.value = false;
});

const viewCalibrationDetails = async (calibration_run_id: number) => {
  isComparePermutationsLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isComparePermutationsLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const onRowCpContextMenu = (event: any) => {
  cmCompareRun.value = [];
  const cpRowData = event.data as DynamicObject;
  cpContextMenu.value.show(event.originalEvent);
  cmCompareRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-fw-pisearch', command: () => viewCalibrationDetails(cpRowData.calibration_run_id) })
}

// Reset refs when selectedPlotTable changes
const resetUserPlotRefs = (exceptions: any): void => {
  if( !Array.isArray(exceptions) ) {
    exceptions = [];
  }

  // plot file refs
  if (!exceptions.includes('selectedPlotName')) {
    selectedPlotName.value = null;
  }

  // plot table refs
  plotTables.value = {};
  plotTableData.value = [];

  // supplemental table refs (metrics)
  if (!exceptions.includes('selectedSupplementalTable')) {
    selectedSupplementalTable.value = 0;
  }
  performanceMetrics.value = {};
  performanceMetricsData.value = [];
  performanceMetricsColumns.value = [];
}

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  // is the selected option a plot or supplemental table?
  if (selectedPlotName.value && (supplementalTableOptions.value as any).includes(selectedPlotName.value)) {
    selectedSupplementalTable.value = (supplementalTableOptions.value as any).indexOf(selectedPlotName.value) + 1;
    // reset all of our plot refs by selectedPlotName and selectedSupplementalTable
    resetUserPlotRefs(['selectedPlotName','selectedSupplementalTable']);
    if (selectedSupplementalTable.value === 1) {
      // Get Performance Metrics - put each one into the table as its own row
      performanceMetrics.value = await queryGetPerformanceMetricsForComparison();
      performanceMetricsColumns.value = [
        { header: 'Job ID', field: 'calibration_run_id' }, 
        { header: 'Formulation Name', field: 'formulation_name' }
      ];

      if (performanceMetrics.value?._data) {
        for (let s = 0; s < performanceMetrics.value?._data?.statuses.length; s++) {
          // First add the metric names and the values from our Calibration run
          let row_data = {
            'calibration_run_id': performanceMetrics.value?._data?.statuses[s].calibration_run_id, 
            'formulation_name': performanceMetrics.value?._data?.statuses[s].formulation_name
          };
          if (performanceMetrics.value?._data?.statuses[s].performance_metrics) {
            Object.keys(performanceMetrics.value?._data.statuses[s].performance_metrics).forEach(key => {
              if(performanceMetricsColumns.value.findIndex(col => col['field'] === key) === -1) {
                let column_header_words = key.split("_");
                for (let w = 0; w < column_header_words.length; w++) {
                  let word = column_header_words[w]
                  column_header_words[w] = word.charAt(0).toUpperCase() + word.slice(1);
                }
                let column_header = column_header_words.join(" ");
                performanceMetricsColumns.value.push({ header: column_header, field: key });
              }
              row_data[key] = performanceMetrics.value?._data?.statuses[s].performance_metrics[key];
            });
          }
          performanceMetricsData.value.push(row_data);
        }
      }
      if (!performanceMetricsData.value.length) {
        const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Performance Metrics data is not available', life: ToastTimeout.timeout5000 };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    }
  } else if (selectedPlotName.value) {
    // reset all of our plot refs except for selectedPlotName
    resetUserPlotRefs(['selectedPlotName']);
    getPlotTableData();
  }
});

const getPlotTableData = async () => {
    if (selectedPlotName.value === 'Bar Chart Metrics') {
        // special case for Bar Chart Metrics - initialize data with three distinct tables for each period 
        plotTables.value = initTablesBarChartMetrics;
        // get selected plot file name and url from server
        const response: any = await queryGetPlotsForComparison(
            selectedPlotName.value, // plotName
            uiGageId.value, // gage_id
        );
        if (response?._data?.plots) {
            // Loop through each plot and assign the data to individual tables for calib/valid/full
            for (let p = 0; p < response?._data?.plots.length; p++) {
                for (let i = 0; i < response?._data?.plots[p].plot_data?.length; i++) {
                    let t = plotTables.value.findIndex(table => table.name === response?._data?.plots[p].plot_data[i].period)
                    if (t >= 0) {
                        plotTables.value[t].data.push(response?._data?.plots[p].plot_data[i]);
                    }
                }
            }
            // Now create the column list for each table, and round all numeric values to 5 digits max
            for (let t = 0; t < plotTables.value.length; t++) {
                Object.keys(plotTables.value[t].data[0]).forEach(key => {
                    let header = key;
                    switch(key) {
                        case 'calibration_run_id':
                            header = 'Run ID';
                            break;
                        case 'formulation_name':
                            header = 'Formulation Name';
                            break;
                        case 'run_date':
                            header = 'Run Date';
                            break;
                        case 'run':
                        case 'period':
                            header = '';
                            break;
                    }
                    if (header != '') {
                        plotTables.value[t].columns.push({ header: header, value: key })
                    }
                })
                for (let r = 0; r < plotTables.value[t].data.length; r++) {
                    Object.keys(plotTables.value[t].data[r]).forEach(key => {
                        if (plotTables.value[t].data[r][key] === null || plotTables.value[t].data[r][key] === '') {
                            plotTables.value[t].data[r][key] = 'N/A';
                        } else if (!isNaN(parseFloat(plotTables.value[t].data[r][key])) && isFinite(plotTables.value[t].data[r][key]) && plotTables.value[t].data[r][key].toString().indexOf('.') > 0) {
                            // attempt to round to 5 digits - just display as is if there are any problems doing this
                            try {
                                plotTables.value[t].data[r][key] = Number(plotTables.value[t].data[r][key]).toFixed(5);
                            } catch (error) {
                                console.error('Error rounding value ' + plotTables.value[t].data[r][key] + ': ', error);
                            }
                        }
                    });
                }
            }
        } else {
          toast.removeAllGroups();
          const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error getting plots', life: ToastTimeout.timeout5000 };
          toast.add(tMsg); addToastRecord(tMsg);
        }
    } else {
      toast.removeAllGroups();
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error getting plots', life: ToastTimeout.timeout5000 };
      toast.add(tMsg); addToastRecord(tMsg);
    }
}

const toggleMessagesGroup = async () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#MessagesGroupWindow {
  z-index: 999;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}
</style>