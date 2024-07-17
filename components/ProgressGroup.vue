<template>
  <div>
    <table id="ProgressTable">
      <tr >
        <td class="ptype">Headwater Basin Gage</td>
        <td><input type="checkbox" checked/></td>
      </tr>
      <tr>
        <td class="ptype" disabled>Formulation</td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td class="ptype">Start and End Times</td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td class="ptype">Catdbration Output Variable</td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td class="ptype">Tuning Paramters</td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td class="ptype">Ooptimization Algorithm</td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td class="ptype">Objective Function</td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td class="ptype">Catdbration Stop Criteria</td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td class="ptype">Metrics / Plot Inteval</td>
        <td><input type="checkbox" /></td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss" scoped>
#ProgressTable {
    width: 100%;
    tr {
        line-height: 32px;
    }
  td {
    font-size: 14px;
  }
  .ptype {
    width: 80%;
    padding-left: 10px;
  }
  input[type="checkbox"] {
    height: 20px;
    width: 20px;
  }
}
</style>
