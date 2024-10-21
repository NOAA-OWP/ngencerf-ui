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
                    <a href="#" class="p-2 c-blue font-normal underline" @click="toggleMessagesGroup">Show Calibration Details</a>
                </div>
                <div class="ml-auto mt-2">
                    <span id="NewButton" class="ngenButtonDiv-alt bg-blue4"><button id="NewValidationBtn" @click="gotoSelectAlternateIteration">New Validation</button></span>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2">
            <div class="text-center">
                <div id="GraphArea" class="p-2" v-if="selectedPlotFileUrl">
                    <img :src="selectedPlotFileUrl" alt="Image" />
                </div>
                <div id="GraphArea" class="p-2" v-else>
                    Data Display
                </div>
            </div>
            <div class="text-center">
                <div id="TableArea" class="p-2" v-if="selectedPlotName">
                    <!-- <DataTable :value="selectedPlotData" scrollable scroll-height="500px"
                        fixedHeader=true :multi-sort="true">
                        <Column v-for="col of selectedPlotDataColumns" :key="col.value" :field="col.value" :header="col.text" sortable></Column>
                    </DataTable> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { generalStore } from '~/stores/common/GeneralStore';
import { useRunStatusStore } from '~/stores/calibration/RunStatusStore';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { useToast } from 'primevue/usetoast';

import MessagesGroup from "../Common/MessagesGroup.vue";

const runStatusStore = useRunStatusStore();
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
    selectedPlotFileUrl,
    tabChanged,
} = storeToRefs(runStatusStore);

const { userCalibrationRunData } = storeToRefs(userDataStore);
const { fetchUserCalibrationRunData } = userDataStore;

const {
  queryGetPlotNames,
  queryGetPlot,
} = runStatusStore;

onMounted(async () => {
    if (!userCalibrationRunData?.value || userCalibrationRunData?.value.error) {
        await fetchUserCalibrationRunData();
    }
    console.log('plotNames:', plotNames.value?._data);
    // Get Plot Names
    if (!plotNames?.value?._data) {
        plotNames.value = await queryGetPlotNames();
    } else {
        console.log('plotNames:', plotNames.value?._data);
    }
});

// setting plotList and selectedPlotName will populate the dropdown
plotList.value = plotNames.value?._data?.plot_names;
console.log('plotList:', plotList.value);

// set selectedPlotName to the first plot name if it is not already set
if (plotList.value && !selectedPlotName.value) {
    selectedPlotName.value = plotList?.value[0]?.name;
    console.log('selectedPlotName:', selectedPlotName.value);
}

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  // get selected plot file name and url from server
  const response: any = await queryGetPlot(selectedPlotName.value);

  if (response?._data?.plot_file_name && response?._data?.plot_url) {
    selectedPlotFilename.value = response?._data?.plot_file_name;
    selectedPlotFileUrl.value = response?._data?.plot_url;
  } else {
    toast.removeAllGroups();
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error getting plot', life: 5000 });
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

// use dummy table data for now
const selectedPlotDataColumns = [
  { text: 'Iteration', value: 'iteration' },
  { text: 'DDS', value: 'dds' },
];
const selectedPlotData = [
  {'iteration': 0, 'dds': 1.4894664522},
  {'iteration':1, 'dds': 1.4894664522},
  {'iteration':2, 'dds': 1.4894664522},
  {'iteration':3, 'dds': 1.4894664522},
  {'iteration':4, 'dds': 1.5262780533},
  {'iteration':5, 'dds': 1.5262780533},
  {'iteration':6, 'dds': 1.5659216391},
  {'iteration':7, 'dds': 1.5659216391},
  {'iteration':8, 'dds': 1.6027335402},
  {'iteration':9, 'dds': 1.642377123},
  {'iteration':10, 'dds': 1.6820207118},
  {'iteration':11, 'dds': 1.7244959823},
  {'iteration':12, 'dds': 1.7244959823},
  {'iteration':13, 'dds': 1.7244959823},
  {'iteration':14, 'dds': 1.7244959823},
  {'iteration':15, 'dds': 1.7244959823},
  {'iteration':16, 'dds': 1.7669712528},
  {'iteration':17, 'dds': 1.7244959823},
];
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