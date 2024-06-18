<template>
    <div>
        <div v-for="item in fonts">
            <p :class="item">{{item}} The Quick Brown Fox</p>
        </div>
    </div>
</template>
<script lang="ts" setup>
const fonts = [
    "ObjektivMk2_Bd",
    "ObjektivMk2_Lt",
    "ObjektivMk2_Rg",
    "NeueFrutigerWorld-Bold",
    "NeueFrutigerWorld-Book",
    "NeueFrutigerWorld-BookIt",
    "NeueFrutigerWorld-Medium",
    "NeueFrutigerWorld-MediumIt"
];
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

</style>
