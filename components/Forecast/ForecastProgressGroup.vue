<template>
  <table id="ForecastProgressTable" class="prevent-select">
    <tbody>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold  checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="1" title="Headwater Basin Gage" aria-lable="Headwater Basin Gage"
          @click="tabClicked">
          Headwater Basin Gage</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype" data-tab="2" title="Formulation" aria-lable="Formulation" @click="tabClicked">Formulation</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Parameters Set" aria-lable="Parameters Set"
          @click="tabClicked">
          Parameters Set</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Time Period" aria-lable="Time Period"
          @click="tabClicked">Time Period</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="3" title="Scaler and Gridded Vars"
          aria-lable="Scaler and Gridded Vars" @click="tabClicked">Scaler/Gridded Varss</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="4" title="Output Variable" aria-lable="Output Variable"
          @click="tabClicked">Output Variable</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype whitespace-nowrap" data-tab="4" title="Parameters Set" aria-lable="Parameters Set"
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

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#ForecastProgressTable {
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
