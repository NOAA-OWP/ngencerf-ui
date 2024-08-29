<template>
    <div>Previous Runs</div>
 </template>

<script setup lang="ts">

</script>
//

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#PgTitle {
    text-align: center;
    font-size: 30px;
    margin-top: 40px;
    margin-bottom: 40px;
}

#NewButton {
    width: 147px;
    height: 33px;
    padding: 10px;
    border-radius: 20px;
    font-size: 21px;
}

#CalTable {
    width: 1000px;
    margin: 0 auto;
    //border: 1px solid $ngwcp_primary1;

    .table {
        thead tr th {
            background-color: #F5A4A4;
            border: 1px solid #000;
        }
    }
}
</style>