<!-- tabs.vue -->
<template TABS>
    <div id="MainTabs" class="">
        <div class="@md:bg" style="margin-left: 10px; overflow:hidden;">
            <div class="tabs activeTab" v-on:click="tabClicked">Headwater Basin Gage</div>
            <div class="tabs" v-on:click="tabClicked">Formulation</div>
            <div class="tabs" v-on:click="tabClicked">Tuning Controls</div>
            <div class="tabs" v-on:click="tabClicked">Optimization</div>
            <div class="tabs" v-on:click="tabClicked">Metrics / Plotting</div>
            <div class="tabs" v-on:click="tabClicked">Run / Status</div>

        </div>
    </div>
</template>

<script lang="ts" setup>

const tabClicked = (event: Event) => {
    event.preventDefault();
    const ele = event.currentTarget as HTMLElement;
    const allTabs = document.getElementsByClassName("tabs");
    Object.keys(allTabs).forEach(function (key) {
        allTabs[key as any].classList.remove("activeTab");
    });
    if (ele) {
        const cl = ele.classList;
        ele.classList.add("activeTab");
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#MainTabs {
    overflow-x: hidden;

    .tabs {
        font-size: .8vw;
        display: inline-block;
        vertical-align: bottom;
        width: 16%;
        height: 48px;
        background-color: #ffffff;
        color: #000000;
        text-align: center;
        padding-top: 13px;
        border-radius: 30px 30px 0 0;
        border: 1px solid #105D8E;
    }

    .activeTab {
        background-color: #105D8E;
        color: #ffffff;
        font-weight: bold;
    }

}
</style>
