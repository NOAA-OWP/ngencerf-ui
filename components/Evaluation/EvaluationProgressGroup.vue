<template>
    <table id="EvaluationProgressTable" class="prevent-select">
      <tbody>
        <tr>
          <td><i v-if="false" class="pi pi-check font-bold  checkMark"></i></td>
          <td class="ptype">Headwater Basin Gage</td>
        </tr>
        <tr>
          <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
          <td class="ptype">Formulation</td>
        </tr>
        <tr>
          <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
          <td class="ptype">Progress Parameters set</td>
        </tr>
        <tr>
          <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
          <td class="ptype">Calibration Output Variable</td>
        </tr>
        <tr>
          <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
          <td class="ptype">Metrics</td>
        </tr>
        <tr>
          <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
          <td class="ptype">Time Period</td>
        </tr>
        <tr>
          <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
          <td class="ptype">Output Variable</td>
        </tr>
        <tr>
          <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
          <td class="ptype">Reference Dataset</td>
        </tr>
      </tbody>
    </table>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#EvaluationProgressTable {
  width: 100%;
  margin-left: 15px;

  table {
    tr {
      line-height: calc(1.3vw + 0.41vh); // font-size: 14px;
    }

    .checkMark {
      text-align: right;
    }

    .ptype {
      width: 90%;
      cursor: pointer;
    }

    .ptype:hover {
      color: $ngwcp_primary1;
    }
  }
  }
</style>
