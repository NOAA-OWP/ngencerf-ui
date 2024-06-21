<template TABS>
    <div id="MainTabs" class="flex">
        <ul>
            <li class="tabs activeTab" v-on:click="tabClicked">Headwater Basin Gage</li>
            <li class="tabs" v-on:click="tabClicked">Formulation</li>
            <li class="tabs" v-on:click="tabClicked">Tuning Controls</li>
            <li class="tabs" v-on:click="tabClicked">Optimization</li>
            <li class="tabs" v-on:click="tabClicked">Metrics / Plotting</li>
            <li class="tabs" v-on:click="tabClicked">Run / Status</li>

        </ul>
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
    // position: absolute;
    overflow-x: hidden;

    ul {
        z-index: 999;
        width: 1170px;
        margin-top: 10px;
        list-style: none;
        border-bottom: 2px solid #105D8E;
    }

    li {
        display: inline-block;
        margin-left: 1.5px;
    }

    .tabs {
        width: 193px;
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
