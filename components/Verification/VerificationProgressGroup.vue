<template>
  <table id="VerificationProgressTable" class="progressTable prevent-select">
    <tbody>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold  checkMark"></i></td>
        <td data-tab="1" title="Calibration Run" aria-label="Calibration Run" @click="tabClicked">
          Calibration Run</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="2" title="Parameter Set" aria-label="Parameter Set" @click="tabClicked">
          Parameter Set</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="3" title="Run Type" aria-label="Run Type" @click="tabClicked">
          Run Type</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="3" title="Forcing Source" aria-label="Forcing Source" @click="tabClicked">Forcing Source</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="3" title="Time Period" aria-label="Time Period" @click="tabClicked">Time Period</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
const { getVerificationTabIndex, getMenuIndex } = generalStore();
const currentVerificationTab = ref(getVerificationTabIndex());
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
    currentVerificationTab.value = Number(ele.getAttribute("data-tab"));
    emit("tabNumber", currentVerificationTab.value);
  }
}
</script>
