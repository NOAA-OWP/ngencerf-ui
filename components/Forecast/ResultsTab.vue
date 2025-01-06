<template>
  <div class="col-span-2">
    <table style="width:100%">
      <tbody>
        <tr height="38px">
          <th scope="row" class="text-right font-bold" style="width: 140px;">
            <label class="text-right" for="resultsPathname" style="width: 140px;">Results Pathname</label>
          </th>
          <td class="pl-5">
            <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
          </td>
        </tr>
        <tr height="32px">
          <th scope="row" class="text-right"><label for="DisplayOptions">Display</label></th>
          <td class="pl-5">
            <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName" :options="forecastPlotNamesList"
              optionLabel="name" optionValue="name">
            </Select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <div v-if="selectedPlotFileUrl" id="GraphArea" class="p-2">
      <img :src="selectedPlotFileUrl" alt="Selected Plot" />
    </div>
    <div v-else id="GraphArea" class="p-2">
      <!--Data Display-->
    </div>
  </div>
</template>

<script setup lang="ts">

import { hilightTab } from '@/composables/TabHilight';
import { useToast } from 'primevue/usetoast';
import { useForecastStore } from '@/stores/forecast/ForecastStore';

const {
  forecastJobId,
  resultsPathname,
  forecastPlotNamesList,
  selectedPlotName,
  selectedPlotFilename,
  selectedPlotFileUrl,
} = storeToRefs(useForecastStore());

const {
  loadForecastResultsTabData,
} = useForecastStore();

const toast = useToast();

onMounted(async () => {
  toast.removeAllGroups();
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  hilightTab(ForecastTabs.tab_results);

  // load Results tab data
  await loadForecastResultsTabData();
});

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  let plotNotAvailableMessage: string = selectedPlotName.value?.toString() + ' plot is not yet available.';

  // get selected plot file name and url from server
  const response: any = await queryGetPlot(selectedPlotName.value as string); // store this in RunStatusStore

  if (response?._data?.plot_file_path && response?._data?.plot_url) {
    selectedPlotFilename.value = response?._data?.plot_file_path;
    selectedPlotFileUrl.value = response?._data?.plot_url;
  } else {
    toast.removeAllGroups();
    selectedPlotFilename.value = "";
    selectedPlotFileUrl.value = "";
    toast.add({ severity: 'warn', summary: 'Warning', detail: plotNotAvailableMessage });
  }
});

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#resultsPathname {
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
}
</style>