<template>
  <table id="ForecastProgressTable" class="progressTable prevent-select">
    <tbody>
      <tr>
        <td><i :class="(calibrationRunForForecast?.calibration_run_id) ? 'checkMark': ''"
            class="pi pi-check font-bold"></i></td>
        <td data-tab="1" title="Calibration Run" aria-label="Calibration Run"
          @click="tabClicked">Calibration Run</td>
      </tr>
      <tr>
        <td><i :class="(forecastConfiguration?.is_active) ? 'checkMark': ''"
            class="pi pi-check font-bold"></i></td>
        <td data-tab="2" title="Configuration" aria-label="Configuration" @click="tabClicked">Configuration</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
import { useForecastStore } from "@/stores/forecast/ForecastStore";

const { forecastConfiguration, calibrationRunForForecast } = useForecastStore();
const { getForecastTabIndex, getMenuIndex } = generalStore();
const currentForecastTab = ref(getForecastTabIndex());
const emit = defineEmits(["tabNumber"]);

const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele = event.currentTarget as HTMLElement;
  const allTabs = document.getElementsByClassName("tabs");
  const tabNum = Number(ele.getAttribute("data-tab")) - 1;
  const e = allTabs[tabNum] as HTMLElement;
  e.click();

  // Send the selected tab info to the active tab set with emit
  if (getMenuIndex() === 1) {
    currentForecastTab.value = Number(ele.getAttribute("data-tab"));
    emit("tabNumber", currentForecastTab.value);
  }
}

</script>


