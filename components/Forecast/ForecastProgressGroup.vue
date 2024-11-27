<template>
  <table id="ForecastProgressTable" class="progressTable prevent-select">
    <tbody>
      <tr>
        <td><i v-if="userCalibrationRunData?.calibration_run_id" class="pi pi-check font-bold  checkMark"></i></td>
        <td data-tab="1" title="Calibration Run" aria-label="Calibration Run"
          @click="tabClicked">Calibration Run</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="2" title="Cycle" aria-label="Cycle" @click="tabClicked">Cycle</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
const userDataStore = useUserDataStore();
const { userCalibrationRunData } = storeToRefs(userDataStore);
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


