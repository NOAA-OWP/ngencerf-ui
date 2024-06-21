<template>
    <div id="LeftColumn" class="grid ">
        <div id="Tabs" class="row">
            <Tabs />
        </div>
        <div id="Aside" class="row">
            &nbsp;
        </div>
        <div id="ActionButtons">
            <ActionButtonGroup />
        </div>
    </div>
    <div id="RightColumn" class="grid ">
        <div id="LeafletMap">
            <!-- <LeafletMap /> -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import Tabs from '~/components/Tabs.vue';

</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#LeftColumn,
#RightColumn {   
    display: flex;
    height: 100%;
}

#LeftColumn {
    width: 1170px;
    float: left;
    margin-left: 20px;
}

#Tabs {
    width: 100%;
}

#RightColumn {
    float: right;
}

#Aside {
    // position: absolute;
    margin-top: 59px;
    position: fixed;
    width: 1170px;
    border: 1px solid #105D8E;
    height: 714px;
}

#ActionButtons {
    position: absolute;
    bottom: 100px;
}

#LeafletMap {
    display: block;
}
</style>
