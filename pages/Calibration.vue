<template>
    <div id="LeftColumn" class="grid grid-cols-4 gap-4">
        <div>&nbsp;
            <AllFonts />
        </div>

    </div>
    <div id="RightColumn" class="grid grid-cols-4 gap-4">
        <div id="LeafletMap"><LeafletMap /></div>
    </div>
</template>
<script lang="ts" setup>


</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#LeftColumn, #RightColumn {
    display: flex;
    height:100%;
}
#LeftColumn {
    width: 40%;
    float:left;

}

#RightColumn {
    width: 50%;
    float:right;

}
#LeafletMap {
    display: block;
}
</style>
