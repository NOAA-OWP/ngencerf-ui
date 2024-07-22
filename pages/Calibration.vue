<!-- Calibration.vue -->
<template>
  <NextgenLayout>

  </NextgenLayout>
</template>

<script lang="ts" setup>
import NextgenLayout from "~/layouts/NextgenLayout.vue";
import type { Progress } from "~/composables/NextGenModel";


onMounted(() => {
  console.log(localStorage);
});


const progress: Progress = {
  headwater_basin_gage: true,
  formulation: false,
  start_and_end_times: false,
  calibration_output_variable: false,
  tuning_parameters: false,
  optimization_algorithm: false,
  objective_function: false,
  calibration_stop_criteria: false,
  metrics_plot_inteval: false,
};


</script>

<style lang="scss" scoped>

</style>
