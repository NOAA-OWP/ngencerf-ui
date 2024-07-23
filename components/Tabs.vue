<!-- tabs.vue -->
<template TABS>
  <div id="MainTabs" class="">
    <div class="@md:bg" style="margin-left: 10px; overflow: hidden">
      <div data-tab="1" class="tabs activeTab" v-on:click="tabClicked">
        Headwater Basin Gage
      </div>
      <div data-tab="2" class="tabs" v-on:click="tabClicked">Formulation</div>
      <div data-tab="3" class="tabs" v-on:click="tabClicked">
        Tuning Controls
      </div>
      <div data-tab="4" class="tabs" v-on:click="tabClicked">
        Optimization / Metrics
      </div>
      <div data-tab="5" class="tabs" v-on:click="tabClicked">Run / Status</div>
      <div data-tab="6" class="tabs" v-on:click="tabClicked">Results</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";
const { getTabIndex, setTabIndex } = generalStore();

const emit = defineEmits(["tabNumber"]);
const currentTab = ref(1);

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

  .tabs {
    font-size: 0.8vw;
    display: inline-block;
    vertical-align: bottom;
    width: 16%;
    height: 48px;
    background-color: #ffffff;
    color: #000000;
    text-align: center;
    padding-top: 13px;
    border-radius: 30px 30px 0 0;
    border: 1px solid $ngwcp_primary1;
  }

  .activeTab {
    background-color: $ngwcp_primary1;
    color: #ffffff;
    font-weight: bold;
  }
}
</style>
