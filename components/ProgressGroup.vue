<template>
   <client-only>
    <table id="ProgressTable">
      <tr>
        <td class="ptype">Headwater Basin Gage</td>
        <td><input type="checkbox" v-model="props.progress.headwater_basin_gage" /></td>
      </tr>
      <tr>
        <td class="ptype">Formulation</td>
        <td><input type="checkbox" v-model="props.progress.formulation" /></td>
      </tr>
      <tr>
        <td class="ptype">Start and End Times</td>
        <td><input type="checkbox" v-model="props.progress.start_and_end_times" /></td>
      </tr>
      <tr>
        <td class="ptype">calibration Output Variable</td>
        <td><input type="checkbox" v-model="props.progress.calibration_stop_criteria" /></td>
      </tr>
      <tr>
        <td class="ptype">Tuning Paramters</td>
        <td><input type="checkbox" v-model="props.progress.tuning_parameters" /></td>
      </tr>
      <tr>
        <td class="ptype">optimization Algorithm</td>
        <td><input type="checkbox" v-model="props.progress.optimization_algorithm" /></td>
      </tr>
      <tr>
        <td class="ptype">Objective Function</td>
        <td><input type="checkbox" v-model="props.progress.objective_function" /></td>
      </tr>
      <tr>
        <td class="ptype">calibration Stop Criteria</td>
        <td><input type="checkbox" v-model="props.progress.calibration_stop_criteria" /></td>
      </tr>
      <tr>
        <td class="ptype">Metrics / Plot Inteval</td>
        <td><input type="checkbox" v-model="props.progress.metrics_plot_inteval" /></td>
      </tr>
    </table>
  </client-only>
</template>

<script lang="ts" setup>
const props = defineProps<{
  progress: Progress;
}>();
</script>

<style lang="scss" scoped>
#ProgressTable {
  width: 100%;

  tr {
    line-height: calc(1.3vw + 0.41vh);
  }
  td {
    // font-size: 14px;
    font-size: calc(0.45vw + 0.61vh);
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
