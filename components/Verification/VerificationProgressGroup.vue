<template>
  <table id="VerificationProgressTable" class="prevent-select">
    <tbody>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold  checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="1" title="Calibration Run" aria-lable="Calibration Run"
          @click="tabClicked">
          Calibration Run</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype" data-tab="2" title="Parameter Set" aria-lable="Parameter Set" @click="tabClicked">
          Parameter Set</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Run Type" aria-lable="Run Type"
          @click="tabClicked">
          Run Type</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Forcing Source"
          aria-lable="Forcing Source" @click="tabClicked">Forcing Source</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Time Period" aria-lable="Time Period"
          @click="tabClicked">Time Period</td>
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
    currentVerificationTab.value = Number(ele.getAttribute("data-tab"));
    emit("tabNumber", currentVerificationTab.value);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#VerificationProgressTable {
  width: 100%;
  margin-left: 15px;

  table {
    tr {
      line-height: calc(1.3vw + 0.41vh); // font-size: 14px;
    }

    .checkMark {
      text-align: right;
    }

    .ptype {
      width: 90%;
      cursor: pointer;
    }

    .ptype:hover {
      color: $ngwcp_primary1;
    }
  }
}
</style>
