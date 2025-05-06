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
        <div v-if="plotTables.length > 0">
            <div v-for="(table, index) in plotTables">
                <h2 class="mt-2 mb-1">{{ table.title }}</h2>
                <DataTable id="plotTableHTML{{ index }}" :value="table.data" fixedHeader=true 
                    scrollable scroll-height="500px" :multi-sort="true">
                    <Column v-for="col of table.columns" :key="col.value" :field="col.value" :header="col.header"
                        :sortable="true" :pt="ptColumn"></Column>
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


import type { DynamicObject } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";
import { formatISOStringOrDateToYYYYMMDD } from "@/utils/TimeHelpers";
import { isValidDate, isValidDateTime } from "@/utils/CommonHelpers";

import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { generalStore } from '@/stores/common/GeneralStore';
import { useRunStatusStore } from '@/stores/calibration/RunStatusStore';
import { useUserDataStore } from '@/stores/common/UserDataStore';

import MessagesGroup from "../Common/MessagesGroup.vue";

import { hilightTab } from '@/composables/TabHilight';

import * as Plot from "@observablehq/plot";

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();
const runStatusStore = useRunStatusStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const showMessagesGroup = ref<Boolean>(false);

const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const {
    plotNames,
    plotList,
    selectedPlotName
} = storeToRefs(runStatusStore);
const {
  uiGageId,
  selectedCalibrationCompareRuns
} = storeToRefs(evaluationCalibrationRunStore);
const {
    //queryGetPlotNamesForComparison,
    queryGetPlotsForComparison
} = evaluationCalibrationRunStore;

const isComparePermutationsLoading = ref<boolean>(false);

const expandPlotTable = ref<Boolean>(false);
const plotTables = ref<DynamicObject>({});
const plotTableErrorMessage = ref<string>('');

const initTablesBarChartMetrics = [
    {'name': 'calib', 'title': 'Calibration Period Best Run Metrics', data: [], columns: []},
    {'name': 'valid', 'title': 'Validation Period Best Run Metrics', data: [], columns: []},
    {'name': 'full', 'title': 'Full Period Best Run Metrics', data: [], columns: []},
]

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "right", "padding-right": "10px !important", "white-space": "nowrap" } }
});

onMounted(() => {
    isComparePermutationsLoading.value = true;
    nextTick(async () => {
        hilightTab(EvaluationTabs.tab_compare);

        // Hard-coding plotList for now since we only allow one plot type
        plotList.value = [{
            "name": "Bar Chart Metrics",
            "description": "Bar chart comparing metrics from best and control validation runs for each evaluation period of the best global, local and best cost values at each iteration",
            "timeseries_available": false
        }]
        //plotNames.value = await queryGetPlotNamesForComparison();
        //plotList.value = ((plotNames?.value as any)?._data as PlotNames)?.plot_names;
        if (plotList.value.length === 1) {
            selectedPlotName.value = plotList.value[0].name
            getPlotTableData();
        }
    })
    isComparePermutationsLoading.value = false;
});

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
    if (selectedPlotName.value) {
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
            console.log('plotTables: ', plotTables.value);
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

</style>