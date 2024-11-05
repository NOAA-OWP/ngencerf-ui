<template>
    <Transition name="slide-fade">
        <div id="MessagesGroupWindow" v-if="showMessagesGroup">
            <div class="text-right sticky top-0">
            <img title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
                class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleMessagesGroup" />
            </div>
            <MessagesGroup/>
        </div>
    </Transition>
    <div id="EvaluatePage">
        <div class="pl-6 pr-2 pt-2">
            <div class="flex mt-2">
                <div class="w-2/3">     
                    <label for="DisplayOptions" class="pr-2 pt-3">Display </label>
                    <div class="inline-block w-2/3">
                        <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName"
                            :options="plotList" optionLabel="name" optionValue="name" >
                        </Select>
                    </div>
                </div>
                <div class="ml-auto">
                    <span id="NewButton" class="ngenButtonDiv-alt bg-blue4"><button id="NewValidationBtn" @click="gotoSelectAlternateIteration">New Validation</button></span>
                    <br clear="all">
                    <a href="#" class="inline-block p-1 c-blue text-sm underline mt-1" @click="toggleMessagesGroup">Show Calibration Details</a>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2">
            <div class="text-center">
                <div id="GraphArea" class="p-2" v-if="selectedPlotFileUrl">
                    <img :src="selectedPlotFileUrl" alt="Image" />
                </div>
            </div>
        </div>

        <div id="TableArea" class="p-2" v-if="selectedIterationTable">
            <DataTable :value="iterationMetricsData" scrollable scroll-height="500px"
                fixedHeader=true :multi-sort="true" v-if="iterationMetricsData && selectedIterationTable == 1">
                <Column v-for="col of iterationMetricsColumns" :key="col.value" :field="col.value" :header="col.text" sortable></Column>
            </DataTable>
            <DataTable :value="iterationParamsData" scrollable scroll-height="500px"
                fixedHeader=true :multi-sort="true" v-if="iterationParamsData && selectedIterationTable == 2">
                <Column v-for="col of iterationParamsColumns" :key="col.value" :field="col.value" :header="col.text" sortable></Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { generalStore } from '~/stores/common/GeneralStore';
import { useRunStatusStore } from '~/stores/calibration/RunStatusStore';
import { useEvaluationIterationDataStore } from '~/stores/evaluation/EvaluationIterationDataStore';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { useToast } from 'primevue/usetoast';
import type { DynamicObject } from "~/composables/NextGenModel";

import MessagesGroup from "../Common/MessagesGroup.vue";

const runStatusStore = useRunStatusStore();
const evaluationIterationDataStore = useEvaluationIterationDataStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const showMessagesGroup = ref(false);

const { calibrationJobId } = storeToRefs(generalStore());
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
    selectedIterationTable
} = storeToRefs(evaluationIterationDataStore);

const { userCalibrationRunData } = storeToRefs(userDataStore);
const { fetchUserCalibrationRunData } = userDataStore;

const {
  queryGetPlotNames,
  queryGetPlot,
} = runStatusStore;
const {
  queryGetIterations,
} = evaluationIterationDataStore;

const iterationMetricsColumns = [];
const iterationParamsColumns = [];
const iterationOptions = ['Custom - Iteration Metrics Table','Custom - Iteration Parameters Table'];

onMounted(async () => {
    if (!userCalibrationRunData?.value || userCalibrationRunData?.value.error) {
        await fetchUserCalibrationRunData();
    }

    // Get Plot Names
    if (!plotNames?.value?._data) {
        plotNames.value = await queryGetPlotNames();
    }
    console.log('plotNames:', plotNames.value?._data);

    // setting plotList and selectedPlotName will populate the dropdown
    plotList.value = plotNames.value?._data?.plot_names;

    // Get Iteration Data
    if (!iterations?.value?._data) {
        iterations.value = await queryGetIterations();
    }
    console.log('iterations:', iterations.value?._data);

    if (iterations.value?._data.iteration_data) {
        for (let o = 0; o < iterationOptions.length; o++) {
            let plotListItem = {'name': iterationOptions[o], 'description': ''};
            if (!plotList.value.includes(plotListItem)) {
                plotList.value.push(plotListItem);
            }
        }
    }
    console.log('plotList:', plotList.value);

    // set up arrays for iterationMetricsData and iterationParamsData
    iterationMetricsData.value = [];
    iterationParamsData.value = [];
    for (let i = 0; i < iterations.value?._data?.iteration_data.length; i++) {
        const iterationMetricsRecord: DynamicObject = {};
        for (let m = 0; m < iterations.value?._data?.iteration_data[i].metrics.length; m++) {
            let metric_name = iterations.value?._data?.iteration_data[i].metrics[m].metric_name;
            iterationMetricsRecord[metric_name] = iterations.value?._data?.iteration_data[i].metrics[m].metric_value;
            if (iterationMetricsRecord[metric_name] === null) {
                iterationMetricsRecord[metric_name] = 'N/A';
            } else if (!isNaN(parseFloat(iterationMetricsRecord[metric_name])) && isFinite(iterationMetricsRecord[metric_name])) {
                iterationMetricsRecord[metric_name] = iterationMetricsRecord[metric_name].toFixed(5);
            }
            if (i == 0) {
                iterationMetricsColumns.push({text: metric_name, value: metric_name});
            }
        }
        iterationMetricsData.value.push(iterationMetricsRecord);
        const iterationParamsRecord: DynamicObject = {};
        for (let p = 0; p < iterations.value?._data?.iteration_data[i].parameters.length; p++) {
            let param_name = iterations.value?._data?.iteration_data[i].parameters[p].parameter_name;
            iterationParamsRecord[param_name] = iterations.value?._data?.iteration_data[i].parameters[p].parameter_value;
            if (iterationParamsRecord[param_name] === null) {
                iterationParamsRecord[param_name] = 'N/A';
            } else if (!isNaN(parseFloat(iterationParamsRecord[param_name])) && isFinite(iterationParamsRecord[param_name])) {
                iterationParamsRecord[param_name] = iterationParamsRecord[param_name].toFixed(5);
            }
            if (i == 0) {
                iterationParamsColumns.push({text: param_name, value: param_name});
            }
        }
        iterationParamsData.value.push(iterationParamsRecord);
    }
    console.log('iterationMetricsData:', iterationMetricsData.value);
    console.log('iterationMetricsColumns:', iterationMetricsColumns);
    console.log('iterationParamsData:', iterationParamsData.value);
    console.log('iterationParamsColumns:', iterationParamsColumns);
});

// set selectedPlotName to the first plot name if it is not already set
if (plotList.value && !selectedPlotName.value) {
    selectedPlotName.value = plotList?.value[0]?.name;
    console.log('selectedPlotName:', selectedPlotName.value);
}

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  // is the selected option a plot or iteration table?
  if(iterationOptions.includes(selectedPlotName.value)) {
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedIterationTable.value = iterationOptions.indexOf(selectedPlotName.value)+1;
  } else {
    selectedIterationTable.value = null;
    // get selected plot file name and url from server
    const response: any = await queryGetPlot(selectedPlotName.value);

    if (response?._data?.plot_file_name && response?._data?.plot_url) {
        selectedPlotFilename.value = response?._data?.plot_file_name;
        selectedPlotFileUrl.value = response?._data?.plot_url;
    } else {
        toast.removeAllGroups();
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting plot', life: 5000 });
    }
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
    if(showMessagesGroup.value) {
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
</style>