<!-- tabs.vue -->
<template TABS>
  <div id="MainTabs">
    <div class="@md:bg" style="margin-left: 10px; overflow: hidden">
      <div data-tab="1" class="tabs activeTab" v-on:click="tabClicked" aria-label="Headwater Basin Gage tab" title="Headwater Basin Gage tab">
        Headwater Basin Gage
        <div :class="tabNotCompleted  ? 'errorDot' : 'noErrorDot'"></div>
      </div>
      <div data-tab="2" class="tabs" v-on:click="tabClicked" aria-label=" Formulation tab" title=" Formulation tab">
        Formulation
        <div :class="tabNotCompleted  ? 'errorDot' : 'noErrorDot'"></div>
      </div>
      <div data-tab="3" class="tabs" v-on:click="tabClicked" aria-label="Tuning Controls tab" title="Tuning Controls tab">
        Tuning Controls
        <div :class="tabNotCompleted  ? 'errorDot' : 'noErrorDot'"></div>
      </div>
      <div data-tab="4" class="tabs" v-on:click="tabClicked" aria-label=" Optimization / Metrics tab" title=" Optimization / Metrics tab">
        Optimization / Metrics
        <div :class="tabNotCompleted  ? 'errorDot' : 'noErrorDot'"></div>
      </div>
      <div data-tab="5" class="tabs" v-on:click="tabClicked" aria-label="Run Status tab" title="Run Status tab">
        Run / Status
        <div :class="tabNotCompleted  ? 'errorDot' : 'noErrorDot'"></div>
      </div>
      <div data-tab="6" class="tabs" v-on:click="tabClicked" aria-label="Results tab" title="Results tab">
        Results
        <div :class="tabNotCompleted  ? 'errorDot' : 'noErrorDot'"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
const { getTabIndex, setTabIndex } = generalStore();

const emit = defineEmits(["tabNumber"]);
const currentTab = ref(getTabIndex());

onMounted(() => {
  const allTabs = document.getElementsByClassName("tabs");
  const tab = <HTMLElement>allTabs[currentTab.value - 1];
  tab.click();
});

// temporary. Will be replaced by logic from each tab
const tabNotCompleted = ref(false);

const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele = event.currentTarget as HTMLElement;
  const allTabs = document.getElementsByClassName("tabs");

  // Remove highlighting from all tabs
  Object.keys(allTabs).forEach(function (key) {
    allTabs[key as any].classList.remove("activeTab");
  });

  // Note that the compiler sends errors when you don't check for null
  if (ele) {
    const cl = ele.classList;
    ele.classList.add("activeTab");
  }

  currentTab.value = Number(ele.getAttribute("data-tab"));
  if (currentTab.value) {
    setTabIndex(currentTab.value);
    emit("tabNumber", currentTab.value);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#MainTabs {
  overflow-x: hidden;
  margin-left: 20px;

  .tabs {
    font-size: 0.8vw;
    display: inline-block;
    vertical-align: bottom;
    width: 16%;
    height: 48px;
    background-color: #ffffff;
    color: black;//$ngwcp_primary3;
    text-align: center;
    padding-top: 13px;
    padding-left: 10px;
    border-radius: 10px 10px 0 0;
    border: 1px solid $ngwcp_primary1;
  }

  .errorDot {
    display: inline-block;
    background-color: black;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    margin-left: 3px;
  }
  .noErrorDot {
    display: inline-block;
    background-color: transparent;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    margin-left: 3px;
  }
  .activeTab {
    background-color: $ngwcp_primary1;
    color: #ffffff;
    font-weight: bold;
  }
}
</style>
