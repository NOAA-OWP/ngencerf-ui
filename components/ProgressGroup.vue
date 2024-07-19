<template>
   <client-only>
    <table id="ProgressTable">
      <tr>
        <td :class="(!props.progress.headwater_basin_gage ? 'ptype dim' : 'ptype ')">Headwater Basin Gage</td>
        <td><input tabindex="-1" readonly type="checkbox" @click.prevent v-model="props.progress.headwater_basin_gage" /></td>
      </tr>
      <tr>
        <td :class="(!props.progress.formulation ? 'ptype dim' : 'ptype ')">Formulation</td>
        <td><input tabindex="-1" readonly type="checkbox" @click.prevent v-model="props.progress.formulation" /></td>
      </tr>
      <tr>
        <td :class="(!props.progress.start_and_end_times ? 'ptype dim' : 'ptype ')">Start and End Times</td>
        <td><input tabindex="-1" readonly type="checkbox" @click.prevent v-model="props.progress.start_and_end_times" /></td>
      </tr>
      <tr>
        <td :class="(!props.progress.calibration_output_variable ? 'ptype dim' : 'ptype ')">calibration Output Variable</td>
        <td><input tabindex="-1" readonly type="checkbox" @click.prevent v-model="props.progress.calibration_stop_criteria" /></td>
      </tr>
      <tr>
        <td :class="(!props.progress.tuning_parameters ? 'ptype dim' : 'ptype ')">Tuning Parameters</td>
        <td><input tabindex="-1" readonly type="checkbox" @click.prevent v-model="props.progress.tuning_parameters" /></td>
      </tr>
      <tr>
        <td :class="(!props.progress.optimization_algorithm ? 'ptype dim' : 'ptype ')">optimization Algorithm</td>
        <td><input tabindex="-1" readonly type="checkbox" @click.prevent v-model="props.progress.optimization_algorithm" /></td>
      </tr>
      <tr>
        <td :class="(!props.progress.objective_function ? 'ptype dim' : 'ptype ')">Objective Function</td>
        <td><input tabindex="-1" readonly type="checkbox" @click.prevent v-model="props.progress.objective_function" /></td>
      </tr>
      <tr>
        <td :class="(!props.progress.calibration_stop_criteria ? 'ptype dim' : 'ptype ')">Calibration Stop Criteria</td>
        <td><input tabindex="-1" readonly type="checkbox" @click.prevent v-model="props.progress.calibration_stop_criteria" /></td>
      </tr>
      <tr>
        <td :class="(!props.progress.metrics_plot_inteval ? 'ptype dim' : 'ptype ')">Metrics / Plot Inteval</td>
        <td><input ttabindex="-1" readonly type="checkbox" @click.prevent v-model="props.progress.metrics_plot_inteval" /></td>
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
.dim {
  opacity: .5;
}
</style>
