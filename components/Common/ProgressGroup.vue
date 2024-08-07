<template>
   <client-only>
    <table id="ProgressTable" class="prevent-select">
      <tr>
        <td><i v-if="props.progress.headwater_basin_gage" class="pi pi-check font-bold  checkMark"></i></td>        
        <td class="ptype">Headwater Basin Gage</td>
      </tr>
      <tr>
        <td><i v-if="props.progress.formulation" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Formulation</td>
      </tr>
      <tr>
        <td><i v-if="props.progress.start_and_end_times" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Start and End Times</td>
      </tr>
      <tr>
        <td><i v-if="props.progress.calibration_stop_criteria" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">calibration Output Variable</td>
      </tr>
      <tr>
        <td><i v-if="props.progress.tuning_parameters" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Tuning Parameters</td>
      </tr>
      <tr>
        <td><i v-if="props.progress.optimization_algorithm" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">optimization Algorithm</td>
      </tr>
      <tr>
        <td><i v-if="props.progress.objective_function" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Objective Function</td>
      </tr>
      <tr>
        <td><i v-if="props.progress.calibration_stop_criteria" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Calibration Stop Criteria</td>
      </tr>
      <tr>
        <td><i v-if="props.progress.metrics_plot_inteval" class="pi pi-check font-bold checkMark"></i></td>
        <td class="ptype">Metrics / Plot Inteval</td>
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
    line-height: calc(1.3vw + 0.41vh);    // font-size: 14px;
  }
  .checkMark {
    text-align: right;
  }
  .ptype {
    width: 90%5%;

  }
}
</style>
