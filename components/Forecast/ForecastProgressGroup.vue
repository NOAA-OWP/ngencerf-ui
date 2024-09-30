<template>
  <table id="ForecastProgressTable" class="progressTable prevent-select">
    <tbody>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold  checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="1" title="Headwater Basin Gage" aria-label="Headwater Basin Gage"
          @click="tabClicked">
          Headwater Basin Gage</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype" data-tab="2" title="Formulation" aria-label="Formulation" @click="tabClicked">Formulation</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Parameters Set" aria-label="Parameters Set"
          @click="tabClicked">
          Parameters Set</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Time Period" aria-label="Time Period"
          @click="tabClicked">Time Period</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Scaler and Gridded Vars"
          aria-label="Scaler and Gridded Vars" @click="tabClicked">Scaler/Gridded Varss</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="4" title="Output Variable" aria-label="Output Variable"
          @click="tabClicked">Output Variable</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="4" title="Parameters Set" aria-label="Parameters Set"
          @click="tabClicked">
          Parameters Set</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
const { getForecastTabIndex, getMenuIndex } = generalStore();
const currentForecastTab = ref(getForecastTabIndex());
const emit = defineEmits(["tabNumber"]);

const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele = event.currentTarget as HTMLElement;
  const allTabs = document.getElementsByClassName("tabs");
  // Remove highlighting from all tabs
  Object.keys(allTabs).forEach(function (key) {
    allTabs[key as any].classList.remove("activeTab");
  });

  const tabNum = Number(ele.getAttribute("data-tab")) - 1;
  allTabs[tabNum].classList.add("activeTab");
  const e = allTabs[tabNum] as HTMLElement;
  e.click();

  // Send the selected tab info to the active tab set with emit
  if (getMenuIndex() === 1) {
    currentForecastTab.value = Number(ele.getAttribute("data-tab"));
    emit("tabNumber", currentForecastTab.value);
  }
}

</script>


