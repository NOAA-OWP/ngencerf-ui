<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleMessagesGroup" alt="Close"/>
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <div id="EvaluatePage">
    <div class="pl-6 pr-2 pt-2">
      <div class="flex mt-2">
        <div class="w-2/3">
          <label for="DisplayOptions" class="pr-2 pt-3">Display </label>
          <div class="inline-block w-2/3">
            <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName" :options="plotList"
              optionLabel="name" optionValue="name">
            </Select>
          </div>
        </div>
        <div class="ml-auto">
          <span id="NewButton" class="ngenButtonDiv-alt bg-blue4"><button id="NewValidationBtn"
              @click="gotoSelectAlternateIteration">New Validation</button></span>
          <br clear="all">
          <a href="#" class="inline-block p-1 c-blue text-sm underline mt-1" @click="toggleMessagesGroup">Show
            Calibration Details</a>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2">
      <div class="text-center">
        <div id="GraphArea" class="p-2" v-if="selectedPlotFileUrl">
          <img :src="selectedPlotFileUrl" :alt="selectedPlotName" />
        </div>
      </div>
      <div>
        <div id="PlotTableArea" class="p-2" v-if="plotTableData.length > 0">
          <div v-if="plotTableList && plotTableList.length > 1">
            <label for="PlotTableOptions" class="pr-2 pt-3">Select Simulation Time Period Data Table </label>
            <Select id="PlotTableOptions" class="p-select" v-model="selectedPlotTable"
              :options="plotTableList" optionLabel="name" optionValue="name">
            </Select>
          </div>
          <div class="pt-6 pb-2">
            <DataTable :value="plotTableData" scrollable scroll-height="500px" fixedHeader=true :multi-sort="true">
              <Column v-for="col of plotTableColumns" :key="col.value" :field="col.value" :header="col.header" sortable></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
    <div id="SupplementalTableArea" class="p-2" v-if="selectedSupplementalTable">
      <DataTable :value="iterationMetricsData" scrollable scroll-height="500px" fixedHeader=true :multi-sort="true"
        v-if="iterationMetricsData && selectedSupplementalTable == 1">
        <Column v-for="( col, colIndex ) in iterationMetricsColumns" :key="colIndex" :header="col.header"
          :field="col.field" sortable></Column>
      </DataTable>
      <DataTable :value="iterationParamsData" scrollable scroll-height="500px" fixedHeader=true :multi-sort="true"
        v-if="iterationParamsData && selectedSupplementalTable == 2">
        <Column v-for="( col, colIndex ) in iterationParamsColumns" :key="colIndex" :header="col.header"
          :field="col.field" sortable></Column>
      </DataTable>
      <DataTable :value="performanceMetricsData" fixedHeader=true
        v-if="performanceMetricsData && performanceMetricsData.length > 0 && selectedSupplementalTable == 3">
        <Column v-for="( col, colIndex ) in performanceMetricsColumns" :key="colIndex" :header="col.header"
          :field="col.field"></Column>
      </DataTable>
      <div v-if="calibrationLogList && calibrationLogList.length > 0 && selectedSupplementalTable == 4">
        <label for="CalibrationLogOptions" class="pr-2 pt-3">Select Calibration Log</label>
        <Select v-if="calibrationLogList.length > 1" id="CalibrationLogOptions" class="p-select" 
          v-model="selectedCalibrationLog" :options="calibrationLogList" optionLabel="name" optionValue="name">
        </Select>
        <div id="CalibrationLogDisplay" class="h-500 overflow-scroll">
          <div v-html="calibrationLogDisplay"></div>
        </div>
      </div>
      <div v-if="validationLogData && validationLogData != '' && selectedSupplementalTable == 5">
        <label for="ValidationLogDisplay" class="pr-2 pt-3">Validation Log</label>
        <div id="ValidationLogDisplay" class="h-500 overflow-scroll">
          <div v-html="validationLogData"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generalStore } from '~/stores/common/GeneralStore';
import { useRunStatusStore } from '~/stores/calibration/RunStatusStore';
import { useEvaluationSupplementalDataStore } from '~/stores/evaluation/EvaluationSupplementalDataStore';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { useToast } from 'primevue/usetoast';
import type { DynamicObject } from "~/composables/NextGenModel";

import MessagesGroup from "../Common/MessagesGroup.vue";

const runStatusStore = useRunStatusStore();
const EvaluationSupplementalDataStore = useEvaluationSupplementalDataStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const showMessagesGroup = ref(false);

const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());
const { getCalibrationTabIndex } = generalStore();
const {
  plotList,
  plotNames,
  selectedPlotName,
  selectedPlotFilename,
  selectedPlotFileUrl
} = storeToRefs(runStatusStore);
const {
  iterations,
  iterationMetricsData,
  iterationParamsData,
  iterationMetricsColumns,
  iterationParamsColumns,
  selectedSupplementalTable,
  performanceMetrics,
  performanceMetricsData,
  logs,
  calibrationLogData,
  validationLogData,
} = storeToRefs(EvaluationSupplementalDataStore);

const { userCalibrationRunData } = storeToRefs(userDataStore);
const { fetchUserCalibrationRunData } = userDataStore;

const {
  queryGetPlotNames,
  queryGetPlot,
} = runStatusStore;
const {
  queryGetIterations,
  queryGetPerformanceMetrics,
  queryGetLogs,
} = EvaluationSupplementalDataStore;

const plotTables = ref<DynamicObject>({});
const plotTableList = ref<any[]>([]);
const selectedPlotTable = ref<string>('');
const plotTableData = ref<any[]>([]);
const plotTableColumns = ref<any[]>([]);
const performanceMetricsColumns = [{ header: 'Metric', field: 'metric' }];
const calibrationLogList = ref<any[]>([]);
const calibrationLogDisplay = ref<string>('');
const selectedCalibrationLog = ref<string>('');
const supplementalTableOptions = [
  'Iteration Metrics Table',
  'Iteration Parameters Table',
  'Performance Metrics Table',
  'Calibration Logs',
  'Validation Log'
]

onMounted(async () => {
  if (!userCalibrationRunData?.value) {
    await fetchUserCalibrationRunData();
  }

  console.log('userCalibrationRunData: ', userCalibrationRunData.value);

  // Get Plot Names
  plotNames.value = await queryGetPlotNames();
  console.log('plotNames:', plotNames.value?._data);

  // setting plotList and selectedPlotName will populate the dropdown
  plotList.value = plotNames.value?._data?.plot_names;

  // Get Iteration Data
  iterations.value = await queryGetIterations();
  console.log('iterations:', iterations.value?._data);

  // Add Iteration Metrics/Parameters Tables to the dropdown
  if (iterations.value?._data.iteration_data) {
    plotList.value.push({ name: supplementalTableOptions[0], description: '' });
    plotList.value.push({ name: supplementalTableOptions[1], description: '' });
  }

  // set up arrays for iterationMetricsData and iterationParamsData
  iterationMetricsData.value = [];
  iterationParamsData.value = [];
  iterationMetricsColumns.value = [{ header: 'Iteration', field: 'iteration' }];
  iterationParamsColumns.value = [{ header: 'Iteration', field: 'iteration' }];
  for (let i = 0; i < iterations.value?._data?.iteration_data.length; i++) {
    const iterationMetricsRecord: DynamicObject = {};
    iterationMetricsRecord['iteration'] = iterations.value?._data?.iteration_data[i].iteration_num;
    for (let m = 0; m < iterations.value?._data?.iteration_data[i].metrics.length; m++) {
      let metric_name = iterations.value?._data?.iteration_data[i].metrics[m].metric_name;
      iterationMetricsRecord[metric_name] = iterations.value?._data?.iteration_data[i].metrics[m].metric_value;
      if ((iterationMetricsRecord[metric_name] === null || iterationMetricsRecord[metric_name] == '') && iterationMetricsRecord[metric_name] != 0) {
        iterationMetricsRecord[metric_name] = 'N/A';
      } else if (!isNaN(parseFloat(iterationMetricsRecord[metric_name])) && isFinite(iterationMetricsRecord[metric_name])) {
        iterationMetricsRecord[metric_name] = iterationMetricsRecord[metric_name].toFixed(5);
      }
      if (i == 0) {
        iterationMetricsColumns.value.push({ header: metric_name, field: metric_name });
      }
    }
    iterationMetricsData.value.push(iterationMetricsRecord);
    const iterationParamsRecord: DynamicObject = {};
    iterationParamsRecord['iteration'] = iterations.value?._data?.iteration_data[i].iteration_num;
    for (let p = 0; p < iterations.value?._data?.iteration_data[i].parameters.length; p++) {
      let param_name = iterations.value?._data?.iteration_data[i].parameters[p].parameter_name;
      iterationParamsRecord[param_name] = iterations.value?._data?.iteration_data[i].parameters[p].parameter_value;
      if ((iterationParamsRecord[param_name] === null || iterationParamsRecord[param_name] == '') && iterationParamsRecord[param_name] != 0) {
        iterationParamsRecord[param_name] = 'N/A';
      } else if (!isNaN(parseFloat(iterationParamsRecord[param_name])) && isFinite(iterationParamsRecord[param_name])) {
        iterationParamsRecord[param_name] = iterationParamsRecord[param_name].toFixed(5);
      }
      if (i == 0) {
        iterationParamsColumns.value.push({ header: param_name, field: param_name });
      }
    }
    iterationParamsData.value.push(iterationParamsRecord);
  }
  console.log('iterationMetricsData:', iterationMetricsData.value);
  console.log('iterationMetricsColumns:', iterationMetricsColumns);
  console.log('iterationParamsData:', iterationParamsData.value);
  console.log('iterationParamsColumns:', iterationParamsColumns);

  // Get Performance Metrics - put each one into the table as its own row
  performanceMetrics.value = await queryGetPerformanceMetrics();
  performanceMetricsData.value = [];
  if (performanceMetrics.value?._data) {
    console.log('performanceMetrics:', performanceMetrics.value?._data);
    if (performanceMetrics.value?._data?.performance_metrics) {
      // First add the metric names and the values from our Calibration run
      performanceMetricsColumns.push({ header: 'Calibration Job ID ' + calibrationJobId.value, field: 'calibration_job_id_' + calibrationJobId.value });
      Object.keys(performanceMetrics.value?._data.performance_metrics).forEach(key => {
        performanceMetricsData.value.push({ 'metric': key });
        performanceMetricsData.value.at(-1)['calibration_job_id_' + calibrationJobId.value] = performanceMetrics.value?._data.performance_metrics[key];
      });
      // Now go through the values from our Validations and add each metric value to the appropriate row
      if (performanceMetrics.value?._data?.validations) {
        for (let v = 0; v < performanceMetrics.value?._data?.validations.length; v++) {
          let validation_run_id = performanceMetrics.value?._data?.validations[v].validation_run_id;
          performanceMetricsColumns.push({ header: 'Validation Job ID ' + validation_run_id, field: 'validation_job_id_' + validation_run_id });
          if (performanceMetrics.value?._data?.validations[v]?.performance_metrics) {
            Object.keys(performanceMetrics.value?._data?.validations[v].performance_metrics).forEach(key => {
              // Loop through our existing rows and see if we have this metric already
              let metricRow = -1;
              for (let m = 0; m < performanceMetricsData.value.length; m++) {
                if (performanceMetricsData.value[m].metric == key) {
                  metricRow = m;
                  performanceMetricsData.value[m]['validation_job_id_' + validation_run_id] = performanceMetrics.value?._data?.validations[v].performance_metrics[key];
                  break;
                }
              }
              if (metricRow == -1) {
                // We didn't find this metric, so create a new row for it
                performanceMetricsData.value.push({ 'metric': key });
                performanceMetricsData.value.at(-1)['validation_job_id_' + validation_run_id] = performanceMetrics.value?._data?.validations[v].performance_metrics[key];
              }
            });
          }
        }
        // Now clean up our metric names so that they display nicely
        for (let m = 0; m < performanceMetricsData.value.length; m++) {
          let column_header_words = performanceMetricsData.value[m].metric.split("_");
          for (let w = 0; w < column_header_words.length; w++) {
            let word = column_header_words[w]
            column_header_words[w] = word.charAt(0).toUpperCase() + word.slice(1);
          }
          let column_header = column_header_words.join(" ");
          performanceMetricsData.value[m].metric = column_header;
        }
      }
    }
    console.log('performanceMetricsData:', performanceMetricsData.value);
    console.log('performanceMetricsColumns:', performanceMetricsColumns);
  }

  // Add Performance Metrics Table to the dropdown
  plotList.value.push({ name: supplementalTableOptions[2], description: '' });
  console.log('plotList:', plotList.value);

  // Get Calibration/Validation Logs
  logs.value = await queryGetLogs();
  calibrationLogData.value = {};
  calibrationLogList.value = [];
  validationLogData.value = '';
  if (logs.value?._data?.logs) {
    console.log('logs: ', logs.value?._data?.logs);
    for (let l = 0; l < logs.value?._data?.logs.length; l++) {
      Object.keys(logs.value?._data?.logs[l]).forEach(key => {
        let logText = "";
        for (let t = 0; t < logs.value?._data?.logs[l][key].length; t++) {
          logText += logs.value?._data?.logs[l][key][t] + '<br/>\n';
        }
        calibrationLogData.value[key] = logText;
        calibrationLogList.value.push({ name: key });
      });
    }
    if (calibrationLogList.value.length > 0) {
      selectedCalibrationLog.value = calibrationLogList.value[0]['name'];
    }
    console.log('calibrationLogData: ', calibrationLogData.value);
    console.log('calibrationLogList: ', calibrationLogList.value);
    if (logs.value?._data?.validations) {
      for (let v = 0; v < logs.value?._data?.validations.length; v++) {
        if (logs.value?._data?.validations[v].validation_job_id == evaluateValidationRunId.value) {
          let logText = "";
          if (logs.value?._data?.validations[v].log) {
            for (let t = 0; t < logs.value?._data?.validations[v].log.length; t++) {
              logText += logs.value?._data?.validations[v].log[t] + '<br/>\n';
            }
          }
          validationLogData.value = logText;
          break;
        }
      }
      console.log('validationLogData: ', validationLogData.value);
    }
  }

  // Add Calibration/Validation Logs to the dropdown
  if (logs.value?._data?.logs) {
    plotList.value.push({ name: supplementalTableOptions[3], description: '' });
    if (logs.value?._data?.validations) {
      plotList.value.push({ name: supplementalTableOptions[4], description: '' });
    }
  }

  // make sure page loads with no plot selected
  selectedPlotName.value = null;
  selectedPlotFilename.value = null;
  selectedPlotFileUrl.value = null;
  selectedSupplementalTable.value = 0;
});

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  // is the selected option a plot or iteration table?
  if (supplementalTableOptions.includes(selectedPlotName.value)) {
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedSupplementalTable.value = supplementalTableOptions.indexOf(selectedPlotName.value) + 1;
    if (selectedSupplementalTable.value == 1 && iterationMetricsData.value.length == 0) {
      toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no iteration metrics', life: 5000 });
    }
    if (selectedSupplementalTable.value == 2 && iterationParamsData.value.length == 0) {
      toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no iteration parameters', life: 5000 });
    }
    if (selectedSupplementalTable.value == 3 && performanceMetricsData.value.length == 0) {
      toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no performance metrics', life: 5000 });
    }
    if (selectedSupplementalTable.value == 4 && calibrationLogList.value.length == 0) {
      toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no logs', life: 5000 });
    }
    if (selectedSupplementalTable.value == 5 && validationLogData.value == '') {
      toast.add({ severity: 'info', summary: 'Validation Run ' + evaluateValidationRunId.value + ' has no logs', life: 5000 });
    }
    plotTableData.value = [];
    plotTableColumns.value = [];
  } else if (selectedPlotName.value) {
    selectedSupplementalTable.value = 0;
    // get selected plot file name and url from server
    const response: any = await queryGetPlot(selectedPlotName.value, true);

    if (response?._data) {
      if (response?._data?.plot_file_name && response?._data?.plot_url) {
        selectedPlotFilename.value = response?._data?.plot_file_name;
        selectedPlotFileUrl.value = response?._data?.plot_url;
      } else {
        selectedPlotFilename.value = null;
        selectedPlotFileUrl.value = null;
        toast.removeAllGroups();
        toast.add({ severity: 'info', summary: 'Plot graph is currently unavailable', life: 5000 });
      }

      if (response?._data?.plot_data && response?._data?.plot_data.length > 0) {
        plotTables.value = {};
        plotTableList.value = [];
        selectedPlotTable.value = '';
        plotTableData.value = [];
        if (Array.isArray(response?._data?.plot_data[0])) {
          // special case - we are dealing with an array of multiple tables, instead of a single table
          for (let i = 0; i < response?._data?.plot_data.length; i++) {
            // i is the iteration number - we need to get the table name from the iteration data row
            let iteration_data_row = response?._data?.plot_data[i];
            // table_name is the name of the run - should be the same across the entire iteration data row
            let table_name = iteration_data_row[0].run;
            // make sure our table is named in plotTables
            if (!(table_name in plotTables.value)) {
              plotTables.value[table_name] = [];
            }
            // now go through and add rows to our table
            for (let d = 0; d < iteration_data_row.length; d++) {
              let data_row = iteration_data_row[d];
              delete data_row.run;
              plotTables.value[table_name].push(data_row);
            }
          }
          // find the name of our first table and make that one selected by default
          Object.keys(plotTables.value).forEach(key => {
            plotTableList.value.push({ name: key });
          });
          selectedPlotTable.value = plotTableList.value[0].name;
          if (selectedPlotTable.value != '') {
            plotTableData.value = plotTables.value[selectedPlotTable.value];
          } else {
            plotTableData.value = [];
          }
        } else {
          let max_rows = response?._data?.plot_data.length;
          plotTables.value = { default_table: [] };
          if (response?._data?.plot_data.length > 100) {
            // limit to first 100 rows for now - eventually need to find a way to let the user change the date range dynamically
            max_rows = 100;
          }
          for (let d = 0; d < max_rows; d++) {
            let data_row = response?._data?.plot_data[d];
            if ("metrics" in data_row) {
              for (let d = 0; d < data_row.metrics.length; d++) {
                data_row[data_row.metrics[d].name] = data_row.metrics[d].value;
              }
              delete data_row.metrics;
            }
            if ("parameters" in data_row) {
              for (let d = 0; d < data_row.parameters.length; d++) {
                data_row[data_row.parameters[d].name] = data_row.parameters[d].value;
              }
              delete data_row.parameters;
            }
            plotTables.value.default_table.push(data_row);
          }
          plotTableData.value = plotTables.value.default_table;
          if (plotTableData.value.length < response?._data?.plot_data.length) {
            toast.add({ severity: 'info', summary: 'Displaying ' + plotTableData.value.length + ' of ' + response?._data?.plot_data.length + ' records', life: 5000 });
          }
        }
      } else {
        plotTableData.value = [];
        plotTableColumns.value = [];
        toast.removeAllGroups();
        toast.add({ severity: 'info', summary: 'Plot data is currently unavailable', life: 5000 });
      }
    } else {
      selectedPlotFilename.value = null;
      selectedPlotFileUrl.value = null;
      plotTableData.value = [];
      plotTableColumns.value = [];
      toast.removeAllGroups();
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting plot', life: 5000 });
    }
  }
});

// Handle selectedPlotTable changes
watch(selectedPlotTable, async () => {
  if (selectedPlotTable.value != '') {
    plotTableData.value = plotTables.value[selectedPlotTable.value];
  }
});

// set plotTableColumns whenever plotTableData is changed
watch(plotTableData, async () => {
  plotTableColumns.value = [];
  if (plotTableData.value.length > 0) {
    Object.keys(plotTableData.value[0]).forEach(key => {
      let column_header_words = key.split("_");
      for (let w = 0; w < column_header_words.length; w++) {
        let word = column_header_words[w]
        column_header_words[w] = word.charAt(0).toUpperCase() + word.slice(1);
      }
      let column_header = column_header_words.join(" ");
      plotTableColumns.value.push({ header: column_header, value: key });
    });
    for (let d = 0; d < plotTableData.value.length; d++) {
      Object.keys(plotTableData.value[d]).forEach(key => {
        if (plotTableData.value[d][key] != 0 && (plotTableData.value[d][key] === null || plotTableData.value[d][key] == '')) {
          plotTableData.value[d][key] = 'N/A';
        } else if (!isNaN(parseFloat(plotTableData.value[d][key])) && isFinite(plotTableData.value[d][key]) && plotTableData.value[d][key].toString().indexOf('.') > 0) {
          // attempt to round to 5 digits - just display as is if there are any problems doing this
          try {
            plotTableData.value[d][key] = Number(plotTableData.value[d][key]).toFixed(5);
          } catch (error) {
            console.error('Error rounding value ' + plotTableData.value[d][key] + ': ', error);
          }
        }
      });
    }
    console.log('plotTableData: ', plotTableData.value);
    console.log('plotTableColumns: ', plotTableColumns.value);
  }
});

// Handle selectedCalibrationLog changes
watch(selectedCalibrationLog, async () => {
  if (selectedCalibrationLog.value != '') {
    calibrationLogDisplay.value = calibrationLogData.value[selectedCalibrationLog.value];
  }
});

const gotoSelectAlternateIteration = () => {
  nextTick(() => {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[2];
    e.click();
  })

}

const newValidation = () => {
  alert('newValidation');
  //tabChanged.value = 3;
}
const toggleMessagesGroup = () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#DisplayOptions {
  width: 375px;
  margin-left: 0px;
}

#GraphArea img {
  margin: 20px auto;
}

#MessagesGroupWindow {
  z-index: 9999;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}

#CalibrationLogDisplay, #ValidationLogDisplay {
  max-height: 400px;
}
</style>