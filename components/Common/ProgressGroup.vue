<template>
   <client-only>
    <table id="ProgressTable" class="prevent-select">
      <tr>
        <td class="ptype">Headwater Basin Gage</td>
        <td><i v-if="props.progress.headwater_basin_gage" class="pi pi-check font-bold"></i></td>        
      </tr>
      <tr>
        <td class="ptype">Formulation</td>
        <td><i v-if="props.progress.formulation" class="pi pi-check font-bold"></i></td>
      </tr>
      <tr>
        <td class="ptype">Start and End Times</td>
        <td><i v-if="props.progress.start_and_end_times" class="pi pi-check font-bold"></i></td>
      </tr>
      <tr>
        <td class="ptype">calibration Output Variable</td>
        <td><i v-if="props.progress.calibration_stop_criteria" class="pi pi-check font-bold"></i></td>
      </tr>
      <tr>
        <td class="ptype">Tuning Parameters</td>
        <td><i v-if="props.progress.tuning_parameters" class="pi pi-check font-bold"></i></td>
      </tr>
      <tr>
        <td class="ptype">optimization Algorithm</td>
        <td><i v-if="props.progress.optimization_algorithm" class="pi pi-check font-bold"></i></td>
      </tr>
      <tr>
        <td class="ptype">Objective Function</td>
        <td><i v-if="props.progress.objective_function" class="pi pi-check font-bold"></i></td>
      </tr>
      <tr>
        <td class="ptype">Calibration Stop Criteria</td>
        <td><i v-if="props.progress.calibration_stop_criteria" class="pi pi-check font-bold"></i></td>
      </tr>
      <tr>
        <td class="ptype">Metrics / Plot Inteval</td>
        <td><i v-if="props.progress.metrics_plot_inteval" class="pi pi-check font-bold"></i></td>
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
  .ptype {
    width: 85%;
    padding-left: 10px;
  }
}
</style>
