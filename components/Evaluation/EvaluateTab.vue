<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
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

          <table class="mt-2" style="width:100%">
            <tbody>
              <tr>
                <td class="text-left font-bold" style="width: 40px;font-size:0.9em;">
                  <label for="validationJobId">Validation Job ID </label>
                </td>
                <td class="pl-3">
                  <div id="validationJobId">{{ evaluateValidationRunId }}</div>
                </td>
              </tr>
              <tr>
                <td class="text-left font-bold" style="width: 140px;font-size:0.9em;">
                  <label for="resultsPathname">Results Pathname</label>
                </td>
                <td class="pl-3">
                  <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
                </td>
              </tr>
            </tbody>
          </table>

        </div>
        <div class="ml-auto">
          <span id="NewButton" class="ngenButtonDiv-alt bg-blue4"><button id="NewValidationBtn"
              @click="gotoSelectAlternateIteration">New Validation</button></span>
          <br />
          <a href="#" class="inline-block p-1 c-blue text-sm underline mt-1" @click="toggleMessagesGroup">Show
            Calibration Details</a>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2">
      <div class="text-center">
        <div id="GraphArea" class="p-2" v-if="selectedPlotName && selectedPlotFileUrl">
          <img :src="selectedPlotFileUrl" :alt="selectedPlotName" />
        </div>
      </div>
      <div>
        <div class="text-center" v-if="plotTableErrorMessage != '' && selectedSupplementalTable == 0">
          {{ plotTableErrorMessage }}
        </div>
        <div id="PlotTableArea" class="p-2" v-if="plotTableData.length > 0">
          <div v-if="plotTableList && plotTableList.length > 1">
            <label for="PlotTableOptions" class="pr-2 pt-3">Select Simulation Time Period Data Table </label>
            <Select id="PlotTableOptions" class="p-select" v-model="selectedPlotTable" :options="plotTableList"
              optionLabel="name" optionValue="name">
            </Select>
          </div>
          <div class="pt-6 pb-2">
            <div v-if="plotTableData.length > 0 && plotTableTotalSize > 0">
              <div>Rows {{ plotTableStartRow }} to {{ plotTableEndRow }} of {{ plotTableTotalSize }}</div>
              <div v-if="plotTableTotalPages > 1">
                <label for="PlotTablePageNumber" class="pr-2 pt-3">Go to Page:</label>
                <input type="number" min="1" :max="plotTableTotalPages" v-model="plotTableCurrentPage">
              </div>
              <div class="text-center" v-if="plotTableTotalPages > 1">
                <!-- Previous page -->
                <span v-if="plotTableCurrentPage > 1" class="pagingLink">
                  <a @click="gotoPlotTablePage(plotTableCurrentPage - 1)">
                    &lt;
                  </a>
                </span>
                <span v-for="page of plotTablePageOptions">
                  <!-- Current page -->
                  <span v-if="page.number == plotTableCurrentPage" class="pagingLink active">
                    {{ page.number }}
                  </span>

                  <!--- Other page numbers to show-->
                  <span v-else-if="(page.number >= 1 && page.number <= 2) ||
                    (page.number >= (plotTableCurrentPage - 1) && page.number <= (plotTableCurrentPage + 1)) ||
                    (page.number >= (plotTableTotalPages - 1) && page.number <= plotTableTotalPages)"
                    class="pagingLink">
                    <a @click="gotoPlotTablePage(page.number)">
                      {{ page.number }}
                    </a>
                  </span>

                  <!-- Show "..." in gaps where page numbers are not sequential - this should only happen if current page +/-2 doesn't fit the above criteria -->
                  <span v-else-if="page.number == (plotTableCurrentPage - 2) ||
                    page.number == (plotTableCurrentPage + 2)" class="pagingLink">
                    ...
                  </span>
                </span>
                <!-- Next page -->
                <span v-if="plotTableCurrentPage < plotTableTotalPages" class="pagingLink">
                  <a @click="gotoPlotTablePage(plotTableCurrentPage + 1)">
                    &gt;
                  </a>
                </span>
              </div>
            </div>
            <DataTable id="plotTableHTML" :value="plotTableData" fixedHeader=true scrollable scroll-height="500px"
              :multi-sort="true">
              <Column v-for="col of plotTableColumns" :key="col.value" :field="col.value" :header="col.header"
                :sortable="plotTableTotalPages == 1"></Column>
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
      <div class="pl-4" v-if="calibrationLogList && calibrationLogList.length > 0 && selectedSupplementalTable == 4">
        <div v-if="calibrationLogList.length > 1">
          <label for="CalibrationLogOptions" class="pr-2 pt-3">Select Calibration Log</label>
          <Select id="CalibrationLogOptions" class="p-select" v-model="selectedCalibrationLog"
            :options="calibrationLogList" optionLabel="name" optionValue="name">
          </Select>
        </div>
        <div v-if="calibrationLogList.length == 1"><b>{{ selectedCalibrationLog }}</b></div>
        <div id="CalibrationLogDisplay" class="p-2 gray-border mt-5 h-600 overflow-scroll">
          <div v-html="calibrationLogDisplay" class="whitespace-nowrap"></div>
        </div>
      </div>
      <div class="pl-4" v-if="validationLogList && validationLogList.length > 0 && selectedSupplementalTable == 5">
        <div v-if="validationLogList.length > 1">
          <label for="validationLogOptions" class="pr-2 pt-3">Select Validation Log</label>
          <Select id="validationLogOptions" class="p-select" v-model="selectedValidationLog"
            :options="validationLogList" optionLabel="name" optionValue="name">
          </Select>
        </div>
        <div v-if="validationLogList.length == 1"><b>{{ selectedValidationLog }}</b></div>
        <div id="ValidationLogDisplay" class="p-2 gray-border mt-5 h-600 overflow-scroll">
          <div v-html="validationLogDisplay" class="whitespace-nowrap"></div>
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
import { hilightTab } from '~/composables/TabHilight';

import MessagesGroup from "../Common/MessagesGroup.vue";
import { nextTick } from 'vue';

const runStatusStore = useRunStatusStore();
const EvaluationSupplementalDataStore = useEvaluationSupplementalDataStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const showMessagesGroup = ref<Boolean>(false);

const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());

const {
  resultsPathname
} = storeToRefs(runStatusStore);
const {
  plotList,
  plotNames,
  selectedPlotName,
  selectedPlotFilename,
  selectedPlotFileUrl,
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
  loadRunStatusStore,
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
const plotTableTotalSize = ref<number>(0);
const plotTablePageSize = ref<number>(100);
const plotTableCurrentPage = ref<number>(1);
const plotTableTotalPages = ref<number>(1);
const plotTablePageOptions = ref<any[]>([]);
const plotTableStartRow = ref<number>(1);
const plotTableEndRow = ref<number>(plotTablePageSize.value);
const plotTableErrorMessage = ref<string>('');
const performanceMetricsColumns = [{ header: 'Metric', field: 'metric' }];
const calibrationLogList = ref<any[]>([]);
const calibrationLogDisplay = ref<string>('');
const selectedCalibrationLog = ref<string>('');
const validationLogList = ref<any[]>([]);
const validationLogDisplay = ref<string>('');
const selectedValidationLog = ref<string>('');
const supplementalTableOptions = [
  'Iteration Metrics Table',
  'Iteration Parameters Table',
  'Performance Metrics Table',
  'Calibration Logs',
  'Validation Logs'
]

onMounted(() => {
  nextTick(async () => {
    hilightTab(EvaluationTabs.tab_evaluate);

    // make sure page loads with no plot selected
    selectedPlotName.value = null;
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedSupplementalTable.value = 0;

    if (!userCalibrationRunData?.value) {
      await fetchUserCalibrationRunData();
    }

    // Load Run Status Store to load resultsPathname
    await loadRunStatusStore();

    // Get Plot Names
    if (!plotNames?.value?._data?.plot_names || plotNames?.value?._data?.plot_names.length === 0) {
      plotNames.value = await queryGetPlotNames();
    }

    if (plotNames.value?._data?.plot_names) {
      // setting plotList will populate the dropdown
      plotList.value = plotNames?.value?._data?.plot_names;
    } else {
      toast.removeAllGroups();
      toast.add({ severity: 'warn', summary: 'Warning', detail: 'Error getting Plot Names' });
    }

    console.log('userCalibrationRunData: ', userCalibrationRunData.value);

    // Get Iteration Data
    iterations.value = await queryGetIterations();
    console.log('iterations:', iterations.value?._data);

    // Add Iteration Metrics/Parameters Tables to the dropdown
    if (iterations.value?._data?.iteration_data) {
      if (!plotList.value.some(item => item.name == supplementalTableOptions[0])) {
        plotList.value.push({ name: supplementalTableOptions[0], description: '' });
      }
      if (!plotList.value.some(item => item.name == supplementalTableOptions[1])) {
        plotList.value.push({ name: supplementalTableOptions[1], description: '' });
      }
    }

    // set up arrays for iterationMetricsData and iterationParamsData
    iterationMetricsData.value = [];
    iterationParamsData.value = [];
    iterationMetricsColumns.value = [{ header: 'Iteration', field: 'iteration' }];
    iterationParamsColumns.value = [{ header: 'Iteration', field: 'iteration' }];
    if (iterations.value?._data?.iteration_data) {
      for (let i = 0; i < iterations.value?._data?.iteration_data?.length; i++) {
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
          performanceMetricsData.value.at(-1)['calibration_job_id_' + calibrationJobId.value] = performanceMetrics.value?._data?.performance_metrics[key];
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
    if (!plotList.value.some(item => item.name == supplementalTableOptions[2])) {
      plotList.value.push({ name: supplementalTableOptions[2], description: '' });
    }
    console.log('plotList:', plotList.value);

    // Get Calibration/Validation Logs
    logs.value = await queryGetLogs(
      (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0 // validation_run_id
    );
    console.log('logs: ', logs.value);
    calibrationLogData.value = {};
    calibrationLogList.value = [];
    validationLogData.value = {};
    validationLogList.value = [];
    if (logs.value?._data?.logs) {
      if (logs.value?._data?.logs.length == 0) {
        // try to get calibration logs separately
        let calibration_logs = await queryGetLogs(evaluateValidationRunId.value);
        if (calibration_logs._data?.logs) {
          logs.value._data.logs = calibration_logs._data?.logs;
        }
      }
      console.log('logs: ', logs.value?._data?.logs);
      for (let l = 0; l < logs.value?._data?.logs.length; l++) {
        Object.keys(logs.value?._data?.logs[l]).forEach(key => {
          let logText = "";
          for (let t = 0; t < Math.min(logs.value?._data?.logs[l][key].length, 1000); t++) {
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
      console.log('selectedCalibrationLog: ', selectedCalibrationLog.value);
    }
    if (logs.value?._data?.validations) {
      for (let v = 0; v < logs.value?._data?.validations.length; v++) {
        console.log('validation_run_id: ', logs.value?._data?.validations[v].validation_run_id);
        if (logs.value?._data?.validations[v].validation_run_id == evaluateValidationRunId.value) {
          if (logs.value?._data?.validations[v].logs) {
            for (let l = 0; l < logs.value?._data?.validations[v].logs?.length; l++) {
              Object.keys(logs.value?._data?.validations[v].logs[l]).forEach(key => {
                let logText = "";
                for (let t = 0; t < Math.min(logs.value?._data?.validations[v].logs[l][key].length, 1000); t++) {
                  logText += logs.value?._data?.validations[v].logs[l][key][t] + '<br/>\n';
                }
                validationLogData.value[key] = logText;
                validationLogList.value.push({ name: key });
              });
            }
          }
          break;
        }
      }
      if (validationLogList.value.length > 0) {
        selectedValidationLog.value = validationLogList.value[0]['name'];
      }
      console.log('validationLogData: ', validationLogData.value);
      console.log('validationLogList: ', validationLogList.value);
      console.log('selectedValidationLog: ', selectedValidationLog.value);
    }

    // Add Calibration/Validation Logs to the dropdown
    if (logs.value?._data?.logs) {
      if (!plotList.value.some(item => item.name == supplementalTableOptions[3])) {
        plotList.value.push({ name: supplementalTableOptions[3], description: '' });
      }
      if (logs.value?._data?.validations) {
        if (!plotList.value.some(item => item.name == supplementalTableOptions[4])) {
          plotList.value.push({ name: supplementalTableOptions[4], description: '' });
        }
      }
    }

    // make sure page loads with no plot selected
    /* Relocated to top of onMounted to prevent errors. */
    // selectedPlotName.value = null;
    // selectedPlotFilename.value = null;
    // selectedPlotFileUrl.value = null;
    // selectedSupplementalTable.value = 0;
  })
});

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  // is the selected option a plot or iteration table?
  if (selectedPlotName.value && supplementalTableOptions.includes(selectedPlotName.value)) {
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedSupplementalTable.value = supplementalTableOptions.indexOf(selectedPlotName.value) + 1;
    if (selectedSupplementalTable.value === 1 && !iterationMetricsData.value.length) {
      toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no iteration metrics', life: 5000 });
    }
    if (selectedSupplementalTable.value === 2 && !iterationParamsData.value.length) {
      toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no iteration parameters', life: 5000 });
    }
    if (selectedSupplementalTable.value === 3 && !performanceMetricsData.value.length) {
      toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no performance metrics', life: 5000 });
    }
    if (selectedSupplementalTable.value === 4 && !calibrationLogList.value.length) {
      toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no logs', life: 5000 });
    }
    if (selectedSupplementalTable.value === 5 && !validationLogList.value.length) {
      toast.add({ severity: 'info', summary: 'Validation Run ' + evaluateValidationRunId.value + ' has no logs', life: 5000 });
    }
    plotTableData.value = [];
    plotTableColumns.value = [];
  } else if (selectedPlotName.value) {
    selectedSupplementalTable.value = 0;
    plotTableCurrentPage.value = 1;

    // get selected plot file name and url from server
    const response: any = await queryGetPlot(
      selectedPlotName.value !== null ? selectedPlotName.value : '', // plotName
      true, // include_data
      true, // force_include_plot
      (evaluateValidationRunId.value) ? 0 : calibrationJobId.value, // calibration_run_id
      (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
      0, // start
      plotTablePageSize.value // limit
    );

    if (response?._data) {
      if (response?._data?.plot_file_path && response?._data?.plot_url) {
        selectedPlotFilename.value = response?._data?.plot_file_path;
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
        if (response?._data?.pagination_metadata?.count) {
          plotTableTotalSize.value = response?._data?.pagination_metadata?.count;
        } else {
          plotTableTotalSize.value = response?._data?.plot_data.length;
        }
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
          adjustPlotTableColumns();
        } else {
          plotTables.value = { default_table: [] };
          for (let d = 0; d < response?._data?.plot_data.length; d++) {
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
          adjustPlotTableColumns();
        }
        plotTableStartRow.value = 1;
        plotTableEndRow.value = plotTableData.value.length;
        plotTableTotalPages.value = Math.ceil(plotTableTotalSize.value / plotTablePageSize.value);
      } else {
        plotTableData.value = [];
        plotTableColumns.value = [];
        plotTableErrorMessage.value = 'Data internally calculated by program and unavailable for table display.';
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
  console.log('selectedPlotName changed');
  if (selectedPlotTable.value != '') {
    plotTableData.value = plotTables.value[selectedPlotTable.value];
    adjustPlotTableColumns();
  }
});

// set plotTableColumns whenever plotTableData is changed
function adjustPlotTableColumns() {
  console.log('adjusting plotTableColumns');
  plotTableErrorMessage.value = '';
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
    //console.log('plotTableData: ', plotTableData.value);
    //console.log('plotTableColumns: ', plotTableColumns.value);
  }
}

// Set up paging options
watch(plotTableTotalPages, async () => {
  plotTablePageOptions.value = [];
  for (let p = 1; p <= plotTableTotalPages.value; p++) {
    plotTablePageOptions.value.push({ 'number': p });
  }
});

function gotoPlotTablePage(page: number) {
  plotTableCurrentPage.value = page;
}

// Watch for page number changes in plot table
watch(plotTableCurrentPage, async () => {
  if (plotTableCurrentPage.value < 1 || plotTableCurrentPage.value > Math.ceil(plotTableTotalSize.value / plotTablePageSize.value)) {
    console.log('ERROR: Page number + ' + plotTableCurrentPage.value + ' out of bounds');
  } else {
    plotTableStartRow.value = (plotTablePageSize.value * (plotTableCurrentPage.value - 1)) + 1;
    plotTableEndRow.value = Math.min(plotTableStartRow.value + (plotTablePageSize.value - 1), plotTableTotalSize.value);
    console.log('Loading rows ' + plotTableStartRow.value + '-' + plotTableEndRow.value + ' from the ' + plotTableTotalSize.value + ' total stored in the backend');
    const response: any = await queryGetPlot(
      selectedPlotName.value !== null ? selectedPlotName.value : '', // plotName
      true, // include_data
      false, // force_include_plot
      (evaluateValidationRunId.value) ? 0 : calibrationJobId.value, // calibration_run_id
      (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
      plotTableStartRow.value - 1, // start
      plotTablePageSize.value // limit
    );
    if (response?._data?.plot_data) {
      plotTableData.value = response?._data?.plot_data;
    }
  }
});

// Handle selectedCalibrationLog/selectedValidationLog changes
watch(selectedCalibrationLog, async () => {
  if (selectedCalibrationLog.value != '') {
    calibrationLogDisplay.value = calibrationLogData.value[selectedCalibrationLog.value];
  }
});
watch(selectedValidationLog, async () => {
  if (selectedValidationLog.value != '') {
    validationLogDisplay.value = validationLogData.value[selectedValidationLog.value];
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

#CalibrationLogDisplay,
#ValidationLogDisplay {
  max-height: 400px;
}

#validationJobId {
  font-size: 0.9em;
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
}

#resultsPathname {
  font-size: 0.9em;
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
}

.gray-border {
  border: 2px solid #d9d9d9;
}

.pagingLink {
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 8px;
}

.pagingLink a:hover {
  text-decoration: underline;
  cursor: pointer;
}

.pagingLink.active {
  font-weight: bold;
}
</style>