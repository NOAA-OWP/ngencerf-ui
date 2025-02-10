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
  <div id="EvaluatePage">

    <div class="grid grid-rows-3 gap-y-0">
      <div class="row-span-1 mt-3">
        <div class="grid grid-cols-2">

          <div class="col-span-1 pl-8">
            <label for="DisplayOptions">Display </label>
            <div class="inline-block w-2/3">
              <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName" :options="plotList"
                optionLabel="name" optionValue="name" :disabled="!plotList">
              </Select>
            </div>
          </div>
          <div class="col-span-1 pr-8">
            <div class="text-right">
              <span id="NewButton" class="ngenButtonDiv-alt bg-blue4" @click="gotoSelectAlternateIteration">
                <Button id="NewValidationBtn">New Validation</button></span>
            </div>
          </div>

        </div>
      </div>

      <div class="row-span-1 mt-3">
        <div class="grid grid-cols-4">

          <div class="col-span-2">
            <div class="text-left pt9em pl-8">
              <label for="calibrationJobId" class="text-bold">Calibration Job ID </label>{{ calibrationJobId }}
              <div class="inline-block ml-16">
                <label for="evaluateValidationRunId" class="text-bold">Validation Job ID</label> {{
                  evaluateValidationRunId }}
              </div>
            </div>
          </div>

          <div class="col-span-1">&nbsp;</div>
          <div class="col-span-1 text-right pr-8">
            <a v-if="userCalibrationRunData" href="#" class="c-blue text-sm underline mt-1 text-right"
              @click="toggleMessagesGroup">Show Calibration Details</a>
          </div>
        </div>
      </div>

      <div class="row-span-1">
        <div class="grid grid-cols-4">
          <div class="col-span-2 pl-8 flex items-center space-x-2 w-full">
            <label for="resultsPathname" class="text-xs whitespace-nowrap font-bold">Results Pathname</label>
            <span class="flex-grow">
              <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled
                class="w-full" />
            </span>
          </div>
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

        <div class="text-center"
          v-if="plotTableErrorMessage !== '' && selectedSupplementalTable === 0 && selectedLogCategory == ''">
          <div class="grid place-items-center" style="height: 45vh;">
            <div>
              {{ plotTableErrorMessage }}
            </div>
          </div>
        </div>

        <div id="PlotTableArea" class="p-2" v-if="plotTableData.length > 0">
          <div v-if="plotTableList && plotTableList.length > 1">
            <label for="PlotTableOptions" class="pr-2 pt-3">Select Simulation Time Period Data Table </label>
            <Select id="PlotTableOptions" class="p-select" v-model="selectedPlotTable" :options="plotTableList"
              optionLabel="name" optionValue="name">
            </Select>
          </div>
          <div class="pt-6 pb-2">
            <div v-if="plotTableData.length > 0 && plotTableTotalSize > 0" class="pagination-box">
              <div class="pagination-rows">Rows {{ plotTableStartRow }} to {{ plotTableEndRow }} of {{
                plotTableTotalSize }}</div>
              <Paging v-model:currentPage="plotTableCurrentPage" :totalPages=plotTableTotalPages />
            </div>
            <DataTable id="plotTableHTML" :value="plotTableData" fixedHeader=true scrollable scroll-height="500px"
              :multi-sort="true">
              <Column v-for="col of plotTableColumns" :key="col.value" :field="col.value" :header="col.header"
                :sortable="plotTableTotalPages === 1" :pt="ptColumn"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
    <div id="SupplementalTableArea" class="p-2" v-if="selectedSupplementalTable">
      <DataTable :value="iterationMetricsData" scrollable scroll-height="500px" fixedHeader=true :multi-sort="true"
        v-if="iterationMetricsData && selectedSupplementalTable === 1">
        <Column v-for="( col, colIndex ) in iterationMetricsColumns" :key="colIndex" :header="col.header"
          :field="col.field" sortable></Column>
      </DataTable>
      <DataTable :value="iterationParamsData" scrollable scroll-height="500px" fixedHeader=true :multi-sort="true"
        v-if="iterationParamsData && selectedSupplementalTable === 2">
        <Column v-for="( col, colIndex ) in iterationParamsColumns" :key="colIndex" :header="col.header"
          :field="col.field" sortable></Column>
      </DataTable>
      <DataTable :value="performanceMetricsData" fixedHeader=true
        v-if="performanceMetricsData && performanceMetricsData.length > 0 && selectedSupplementalTable === 3">
        <Column v-for="( col, colIndex ) in performanceMetricsColumns" :key="colIndex" :header="col.header"
          :field="col.field"></Column>
      </DataTable>
    </div>
    <div id="LogDisplayArea" class="p-2"
      v-if="selectedLogCategory != '' && selectedLogList && selectedLogList.length > 0">
      <div class="pl-4">
        <div v-if="selectedLogList.length > 1">
          <label for="selectedLogOptions" class="pr-2 pt-3">Select {{ capitalCase(selectedLogCategory) }} Log</label>
          <Select id="selectedLogOptions" class="p-select" v-model="selectedLogName" :options="selectedLogList"
            optionLabel="name" optionValue="name">
          </Select>
        </div>
        <div v-if="selectedLogList.length === 1" style="font-size: 0.9em;"><b
            style="width:160px; display:inline-block;">Log File Name</b> {{ selectedLogName }}</div>

        <div class="flex justify-end" style="margin-top:-23px;">
          <div class="ml-auto">
            <div>Rows {{ selectedLogStartRow }} to {{ selectedLogEndRow }} of {{ selectedLogTotalSize }}</div>
            <Paging v-model:currentPage="selectedLogCurrentPage" :totalPages=selectedLogTotalPages />
          </div>
        </div>

        <div id="selectedLogDisplay" class="p-2 gray-border mt-2 h-600 overflow-scroll">
          <div v-html="selectedLogDisplay" class="whitespace-nowrap"></div>
        </div>
      </div>
    </div>

    <!-- Grid Data -->
    <div v-if="selectedPlotName && gridDisplayOptions.includes(selectedPlotName)"
      class="p-4 min-h-screen overflow-visible">
      <div class="grid grid-cols-3 gap-4 mt-4 p-2">
        <div class="flex flex-col items-center p-2">
          <h1 class="text-xl font-bold">SNODAS</h1>
          <div class="flex items-center justify-center space-x-2 p-2 w-full">
            <RadioButton v-model="selectedGridType" inputId="gridType1" value="gridded" name="gridType" />
            <label for="gridType1">Gridded</label>
            <RadioButton v-model="selectedGridType" inputId="gridType2" value="catchment" name="gridType" />
            <label for="gridType2">Catchment Means</label>
          </div>
          <p class="text-[12px] text-gray-600 text-center">Snow Water Equivalent (SWE) - Raw Values</p>
        </div>
        <div class="flex flex-col items-center p-2">
          <h1 class="text-xl font-bold">Simulated</h1>
          <p class="text-[12px] text-gray-600 mt-9">Snow Water Equivalent (SWE) - Catchment Means</p>
        </div>
        <div class="p-2 relative overflow-visible">
          <label for="simulatedSources" class="block text-sm font-medium text-gray-700">Select Simulated Source</label>
          <Select v-model="selectedSimulatedSource" :options="simulatedSources" inputId="simulatedSources"
            class="w-full mt-1" placeholder="Select" />
          <div class="flex justify-end">
            <button class="c-blue text-sm underline mt-6 ml-auto">Show SWE Time Series</button>
          </div>
          <div class="text-sm font-semibold text-blue-800 mt-3">
            <p>Ranges:</p>
            <p><span class="font-bold">Calibration:</span> 2014-01-01 to 2015-04-30</p>
            <p><span class="font-bold">Validation:</span> 2015-05-01 to 2016-05-18</p>
          </div>

          <div class="mt-3 relative z-10">
            <VueDatePicker v-model="selectedEvaluateDate" class="datePickers dp__theme_dark"
              text-input format="yyyy-MM-dd" :enable-time-picker="false" :teleport="true" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import { useToast } from 'primevue/usetoast';
import VueDatePicker from "@vuepic/vue-datepicker";

import type { DynamicObject } from "@/composables/NextGenModel";

import { generalStore } from '@/stores/common/GeneralStore';
import { useRunStatusStore } from '@/stores/calibration/RunStatusStore';
import { useEvaluationSupplementalDataStore } from '@/stores/evaluation/EvaluationSupplementalDataStore';
import { useUserDataStore } from '@/stores/common/UserDataStore';

import MessagesGroup from "../Common/MessagesGroup.vue";
import Paging from "../Common/Paging.vue";

import { hilightTab } from '@/composables/TabHilight';

import * as Plot from "@observablehq/plot";

const runStatusStore = useRunStatusStore();
const EvaluationSupplementalDataStore = useEvaluationSupplementalDataStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const showMessagesGroup = ref<Boolean>(false);

const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "right", "padding-right": "10px !important" } }
});

const {
  resultsPathname
} = storeToRefs(runStatusStore);
const {
  plotList,
  plotNames,
  selectedPlotName,
  selectedPlotFilename,
  selectedPlotFileUrl,
  simulatedSources,
  selectedSimulatedSource,
  gridTypes,
  selectedGridType,
  selectedEvaluateDate
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
  queryGetLogNames,
  queryGetLogData,
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
const plotTableStartRow = ref<number>(1);
const plotTableEndRow = ref<number>(plotTablePageSize.value);
const plotTableErrorMessage = ref<string>('');
const iterations = ref<APIResponse>({});
const iterationMetricsData = ref<any[]>([]);
const iterationParamsData = ref<any[]>([]);
const iterationMetricsColumns = ref<any[]>([]);
const iterationParamsColumns = ref<any[]>([]);
const selectedSupplementalTable = ref<number>(0);
const performanceMetrics = ref<APIResponse>({});
const performanceMetricsData = ref<any[]>([]);
const performanceMetricsColumns = [{ header: 'Metric', field: 'metric' }];
const logs = ref<APIResponse>({});
const logDataPageSize = ref<number>(1000);
const logLists = ref<DynamicObject>({});
const selectedLogCategory = ref<string>('');
const selectedLogList = ref<any[]>([]);
const selectedLogName = ref<string>('');
const selectedLogDisplay = ref<string>('');
const selectedLogTotalSize = ref<number>(0);
const selectedLogCurrentPage = ref<number>(1);
const selectedLogTotalPages = ref<number>(1);
const selectedLogStartRow = ref<number>(1);
const selectedLogEndRow = ref<number>(logDataPageSize.value);
const supplementalTableOptions = [
  'Iteration Metrics Table',
  'Iteration Parameters Table',
  'Performance Metrics Table'
]
const gridDisplayOptions = [
  "Snow Water Equivalent",
]

onMounted(() => {
  nextTick(async () => {
    hilightTab(EvaluationTabs.tab_evaluate);

    // make sure page loads with no plots/tables selected
    selectedPlotName.value = null;
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedSupplementalTable.value = 0;

    // Load Run Status Store to load resultsPathname
    await loadRunStatusStore();

    console.log('userCalibrationRunData initial', userCalibrationRunData.value);
    if (!userCalibrationRunData.value) {
      await fetchUserCalibrationRunData();
      console.log('userCalibrationRunData after fetch', userCalibrationRunData.value);
    }

    // Get Plot Names
    if (!plotNames?.value?._data?.plot_names || !plotNames?.value?._data?.plot_names.length) {
      plotNames.value = await queryGetPlotNames();
    }

    if (plotNames.value?._data?.plot_names) {
      // setting plotList will populate the dropdown
      plotList.value = plotNames?.value?._data?.plot_names;
    } else {
      toast.removeAllGroups();
      toast.add({ severity: 'warn', summary: 'Warning', detail: 'Error getting Plot Names' });
    }

    // Add Supplemental Table Options to the dropdown
    for (let t = 0; t < supplementalTableOptions.length; t++) {
      if (!plotList.value.some(item => item.name === supplementalTableOptions[t])) {
        plotList.value.push({ name: supplementalTableOptions[t], description: '' });
      }
    }

    // Get Names of ALL Logs
    if (!logs.value?._data || !logs.value?._data?.length) {
      logs.value = await queryGetLogNames(
        (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0 // validation_run_id
      );
      //console.log('logs: ', logs.value);
      for (let l = 0; l < logs.value?._data?.log_names.length; l++) {
        Object.keys(logs.value?._data?.log_names[l]).forEach(key => {
          let logList = [];
          for (let n = 0; n < logs.value?._data?.log_names[l][key].length; n++) {
            logList.push({ 'name': logs.value?._data?.log_names[l][key][n] });
          }
          logLists.value[key] = logList;
        });
      }

      // Add Log Options to the dropdown
      Object.keys(logLists.value).forEach(key => {
        let optionName = capitalCase(key) + ' Logs';
        if (!plotList.value.some(item => item.name === optionName)) {
          plotList.value.push({ name: optionName, description: '' });
        }
      });

      //console.log('logLists: ', logLists.value);
    }

    // add grid display options to the dropdown if not added already
    gridDisplayOptions.forEach(option => {
      if (!plotList.value.some(item => item.name === option)) {
        plotList.value.push({ name: option, description: '' });
      }
    });
  })
});

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  // is the selected option a plot or iteration table?
  // console.log('selectedPlotName: ', selectedPlotName.value);
  if (selectedPlotName.value && supplementalTableOptions.includes(selectedPlotName.value)) {
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedSupplementalTable.value = supplementalTableOptions.indexOf(selectedPlotName.value) + 1;
    if (selectedSupplementalTable.value === 1) {
      // Get Iteration Data
      if (!iterations.value?._data || !iterations.value?._data?.length) {
        iterations.value = await queryGetIterations();
      }
      //console.log('iterations:', iterations.value?._data);

      // set up array for iterationMetricsData
      iterationMetricsData.value = [];
      iterationMetricsColumns.value = [{ header: 'Iteration', field: 'iteration' }];
      if (iterations.value?._data?.iteration_data) {
        for (let i = 0; i < iterations.value?._data?.iteration_data?.length; i++) {
          const iterationMetricsRecord: DynamicObject = {};
          iterationMetricsRecord['iteration'] = iterations.value?._data?.iteration_data[i].iteration_num;
          for (let m = 0; m < iterations.value?._data?.iteration_data[i].metrics.length; m++) {
            let metric_name = iterations.value?._data?.iteration_data[i].metrics[m].metric_name;
            iterationMetricsRecord[metric_name] = iterations.value?._data?.iteration_data[i].metrics[m].metric_value;
            if ((iterationMetricsRecord[metric_name] === null || iterationMetricsRecord[metric_name] === '') && iterationMetricsRecord[metric_name]) {
              iterationMetricsRecord[metric_name] = 'N/A';
            } else if (!isNaN(parseFloat(iterationMetricsRecord[metric_name])) && isFinite(iterationMetricsRecord[metric_name])) {
              iterationMetricsRecord[metric_name] = iterationMetricsRecord[metric_name].toFixed(5);
            }
            if (i === 0) {
              iterationMetricsColumns.value.push({ header: metric_name, field: metric_name });
            }
          }
          iterationMetricsData.value.push(iterationMetricsRecord);
        }
      }
      //console.log('iterationMetricsData:', iterationMetricsData.value);
      //console.log('iterationMetricsColumns:', iterationMetricsColumns);
      if (!iterationMetricsData.value.length) {
        toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no iteration metrics', life: 5000 });
      }
    } else if (selectedSupplementalTable.value === 2) {
      // Get Iteration Data
      if (!iterations.value?._data || !iterations.value?._data?.length) {
        iterations.value = await queryGetIterations();
      }
      //console.log('iterations:', iterations.value?._data);

      // set up array for iterationParamsData
      iterationParamsData.value = [];
      iterationParamsColumns.value = [{ header: 'Iteration', field: 'iteration' }];
      if (iterations.value?._data?.iteration_data) {
        for (let i = 0; i < iterations.value?._data?.iteration_data?.length; i++) {
          const iterationParamsRecord: DynamicObject = {};
          iterationParamsRecord['iteration'] = iterations.value?._data?.iteration_data[i].iteration_num;
          for (let p = 0; p < iterations.value?._data?.iteration_data[i].parameters.length; p++) {
            let param_name = iterations.value?._data?.iteration_data[i].parameters[p].parameter_name;
            iterationParamsRecord[param_name] = iterations.value?._data?.iteration_data[i].parameters[p].parameter_value;
            if ((iterationParamsRecord[param_name] === null || iterationParamsRecord[param_name] === '') && iterationParamsRecord[param_name]) {
              iterationParamsRecord[param_name] = 'N/A';
            } else if (!isNaN(parseFloat(iterationParamsRecord[param_name])) && isFinite(iterationParamsRecord[param_name])) {
              iterationParamsRecord[param_name] = iterationParamsRecord[param_name].toFixed(5);
            }
            if (i === 0) {
              iterationParamsColumns.value.push({ header: param_name, field: param_name });
            }
          }
          iterationParamsData.value.push(iterationParamsRecord);
        }
      }
      //console.log('iterationParamsData:', iterationParamsData.value);
      //console.log('iterationParamsColumns:', iterationParamsColumns);
      if (!iterationParamsData.value.length) {
        toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no iteration parameters', life: 5000 });
      }
    } else if (selectedSupplementalTable.value === 3) {
      // Get Performance Metrics - put each one into the table as its own row
      if (!performanceMetrics.value?._data || !performanceMetrics.value?._data?.length) {
        performanceMetrics.value = await queryGetPerformanceMetrics();
      }

      performanceMetricsData.value = [];
      if (performanceMetrics.value?._data) {
        //console.log('performanceMetrics:', performanceMetrics.value?._data);
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
              let validation_type = performanceMetrics.value?._data?.validations[v].validation_type;
              if (validation_type == 'valid_iteration') {
                validation_type = 'Iter';
              } else if (validation_type == 'valid_control') {
                validation_type = 'Control';
              } else if (validation_type == 'valid_best') {
                validation_type = 'Best';
              }
              if (performanceMetrics.value?._data?.validations[v].iteration_num !== null) {
                if (validation_type != 'Iter') {
                  validation_type += ': Iter';
                }
                validation_type += ' ' + performanceMetrics.value?._data?.validations[v].iteration_num;
              }
              performanceMetricsColumns.push({ header: 'Validation Job ID ' + validation_run_id + ' (' + validation_type + ')', field: 'validation_job_id_' + validation_run_id });
              if (performanceMetrics.value?._data?.validations[v]?.performance_metrics) {
                Object.keys(performanceMetrics.value?._data?.validations[v].performance_metrics).forEach(key => {
                  // Loop through our existing rows and see if we have this metric already
                  let metricRow = -1;
                  for (let m = 0; m < performanceMetricsData.value.length; m++) {
                    if (performanceMetricsData.value[m].metric === key) {
                      metricRow = m;
                      performanceMetricsData.value[m]['validation_job_id_' + validation_run_id] = performanceMetrics.value?._data?.validations[v].performance_metrics[key];
                      break;
                    }
                  }
                  if (metricRow === -1) {
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
        //console.log('performanceMetricsData:', performanceMetricsData.value);
        //console.log('performanceMetricsColumns:', performanceMetricsColumns);
      }
      if (!performanceMetricsData.value.length) {
        toast.add({ severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no performance metrics', life: 5000 });
      }
    }
    plotTableData.value = [];
    plotTableColumns.value = [];
    selectedLogCategory.value = '';
    selectedLogList.value = [];
  }
  // selectedPlotName is a log 
  else if (selectedPlotName.value && selectedPlotName.value.includes(" Logs") && selectedPlotName.value.replace(" Logs", "").toLowerCase() in logLists.value) {
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    plotTableData.value = [];
    plotTableColumns.value = [];
    selectedSupplementalTable.value = 0;
    selectedLogName.value = '';
    selectedLogCategory.value = selectedPlotName.value.replace(" Logs", "").toLowerCase();
  }
  // selectedPlotName is a grid display option
  else if (selectedPlotName.value && gridDisplayOptions.includes(selectedPlotName.value)) {
    // clear out previous Display data
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    plotTableErrorMessage.value = '';
    plotTableData.value = [];
    plotTableColumns.value = [];
    selectedSupplementalTable.value = 0;
    selectedLogCategory.value = '';
    selectedLogList.value = [];
    selectedLogName.value = '';



  } else if (selectedPlotName.value) {
    selectedSupplementalTable.value = 0;
    selectedLogCategory.value = '';
    selectedLogList.value = [];
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
          if (selectedPlotTable.value !== '') {
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
  //console.log('selectedPlotName changed');
  if (selectedPlotTable.value !== '') {
    plotTableData.value = plotTables.value[selectedPlotTable.value];
    adjustPlotTableColumns();
  }
});

// set plotTableColumns whenever plotTableData is changed
function adjustPlotTableColumns() {
  //console.log('adjusting plotTableColumns');
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
        if (plotTableData.value[d][key] && (plotTableData.value[d][key] === null || plotTableData.value[d][key] === '')) {
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

// Watch for page number changes in plot table
watch(plotTableCurrentPage, async () => {
  if (plotTableCurrentPage.value < 1 || plotTableCurrentPage.value > Math.ceil(plotTableTotalSize.value / plotTablePageSize.value)) {
    console.log('ERROR: Page number ' + plotTableCurrentPage.value + ' out of bounds');
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

// Handle selectedLogCategory changes
watch(selectedLogCategory, async () => {
  selectedLogList.value = logLists.value[selectedLogCategory.value];
  // start with the first log
  selectedLogName.value = selectedLogList.value[0].name;
  console.log('selectedLogCategory: ', selectedLogCategory.value);
  console.log('selectedLogList: ', selectedLogList.value);
  console.log('selectedLogName: ', selectedLogName.value);
  if (!selectedLogList.value.length) {
    toast.add({ severity: 'info', summary: selectedPlotName.value + ' not available', life: 5000 });
  }
});

// Handle selectedLogName changes
watch(selectedLogName, async () => {
  if (selectedLogName.value !== '') {
    selectedLogCurrentPage.value = 1;
    const response: any = await queryGetLogData(
      selectedLogCategory.value, // log_category,
      selectedLogName.value, // log_name
      (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
      0, // start
      logDataPageSize.value // limit
    );
    if (response?._data) {
      let logText = '';
      for (let t = 0; t < response?._data?.log_data.length; t++) {
        logText += response?._data?.log_data[t] + '<br/>\n';
      }
      selectedLogDisplay.value = logText;
      selectedLogTotalSize.value = response?._data?.pagination_metadata?.count;
      selectedLogTotalPages.value = Math.ceil(selectedLogTotalSize.value / logDataPageSize.value);
      selectedLogStartRow.value = 1;
      if (selectedLogTotalPages.value === 1) {
        selectedLogEndRow.value = selectedLogTotalSize.value;
      } else {
        selectedLogEndRow.value = logDataPageSize.value;
      }
      console.log('Loading rows ' + selectedLogStartRow.value + '-' + selectedLogEndRow.value + ' from the ' + selectedLogTotalSize.value + ' total stored in the backend');
    }
    plotTables.value = {};
    plotTableList.value = [];
    plotTableData.value = [];
  }
});

// Watch for page number changes in logs
watch(selectedLogCurrentPage, async () => {
  if (selectedLogCurrentPage.value < 1 || selectedLogCurrentPage.value > selectedLogTotalPages.value) {
    console.log('ERROR: Page number ' + selectedLogCurrentPage.value + ' out of bounds');
  } else {
    selectedLogStartRow.value = (logDataPageSize.value * (selectedLogCurrentPage.value - 1)) + 1;
    if (selectedLogCurrentPage.value === selectedLogTotalPages.value) {
      selectedLogEndRow.value = selectedLogTotalSize.value;
    } else {
      selectedLogEndRow.value = (selectedLogStartRow.value + logDataPageSize.value) - 1;
    }
    const response: any = await queryGetLogData(
      selectedLogCategory.value, // log_category,
      selectedLogName.value, // log_name
      (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
      selectedLogStartRow.value - 1, // start
      logDataPageSize.value // limit
    );
    if (response?._data) {
      let logText = '';
      for (let t = 0; t < response?._data?.log_data.length; t++) {
        logText += response?._data?.log_data[t] + '<br/>\n';
      }
      selectedLogDisplay.value = logText;
    }
    console.log('Loading rows ' + selectedLogStartRow.value + '-' + selectedLogEndRow.value + ' from the ' + selectedLogTotalSize.value + ' total stored in the backend');
  }
});

function capitalCase(str: string) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

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
const toggleMessagesGroup = async () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

onUnmounted(() => {
  // make sure page clears all selected plots/tables when the user leaves
  selectedPlotName.value = null;
  selectedPlotFilename.value = null;
  selectedPlotFileUrl.value = null;
  selectedSupplementalTable.value = 0;
  selectedLogName.value = '';
  selectedLogList.value = [];
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#DisplayOptions {
  width: 375px;
  margin-left: 0px;
}

#CalibrationLogOptions {
  width: 268px;
}

#validationLogOptions {
  width: 275px;
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

#selectedLogDisplay,
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


.layout__table {
  position: relative;
  display: block;
}

.layout__row {
  display: flex;
}

.layout__row div {
  line-height: 2em;
}

.center-label {
  display: flex;
  align-items: center
}

.datePickers {
  width: 230px;
  display: inline-block;
  text-align: center;
}
</style>