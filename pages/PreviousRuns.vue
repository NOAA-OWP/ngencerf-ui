<template>
  <div id="PgTitle">Previous Calibration Runs
    &nbsp;&nbsp;<span id="NewButton" @click="NewCalibration"><button>New</button></span></div>
  <div>   
    <div id="CalTable">
    <!-- <DataTable
      class="display table table-hover table-striped"
      width="50%"
    >
      <thead>
        <tr>
          <th>Run ID</th>
          <th>Forumulation Name</th>
          <th>Headwater Basin Gage</th>
          <th>Run Date</th>
          <th>Calibration Period</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Hello</td>
          <td>There</td>
        </tr>
      </tbody>
    </DataTable> -->
</div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
// import DataTable from "datatables.net-vue3";
// import DataTablesCore from "datatables.net";
// import "datatables.net-select";
// import "datatables.net-responsive";

//DataTable.use(DataTablesCore);


const NewCalibration = async () => {
  await navigateTo("Calibration");
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
//@import "datatables.net-dt";

#PgTitle {
    text-align:center;
    font-size: 30px;
    margin-top: 40px;
    margin-bottom: 40px;
}
#NewButton {
    width: 147px;
    height: 33px;
    background-color: #105D86;   
    color: #fff;
    padding: 10px;
    border-radius: 20px;
    font-size: 21px;
}
#CalTable {
    width: 80%;
    margin: 0 auto;
    border: 1px solid $ngwcp_primary1;

    .table {
        thead tr th{
            background-color: #F5A4A4;
            border: 1px solid #000;
        }
    }
}

</style>
