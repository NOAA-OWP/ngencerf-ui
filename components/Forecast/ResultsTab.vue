<template>
  <div class="col-span-2">
    <table>
      <tbody>
        <tr height="38px">
          <th scope="row" class="text-right font-bold">
            <div style="width: 140px;">Forecast Job ID</div>
          </th>
          <td class="pl-5">{{ forecastJobId ?? '-'.repeat(30) }}</td>
        </tr>
        <tr height="38px">
          <th scope="row" class="text-right font-bold" style="width: 140px;">
            <label class="text-right" for="resultsPathname" style="width: 140px;">Results Pathname</label>
          </th>
          <td class="pl-5">
            <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
          </td>
        </tr>
        <tr height="32px">
          <th scope="row" class="text-right font-bold">
            <div style="width: 140px;">Cycle</div>
          </th>
          <td class="pl-5">{{ (forecastCycle as ForecastCycle).name ?? '-'.repeat(30) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <div v-if="forecastPlot" id="GraphArea" class="p-2">
      <img :src="forecastPlot.plot_url" alt="Selected Plot" />
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
  forecastCycle,
  resultsPathname,
  forecastPlot,
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
  const messages: string[] = await loadForecastResultsTabData();

  if (messages.length > 0) {
    messages.forEach((message: string) => {
      toast.add({ severity: 'error', summary: 'Error', detail: message });
    });
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