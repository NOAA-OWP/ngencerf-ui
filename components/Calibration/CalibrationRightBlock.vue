<template>
   <!-- CalibrationRightBlock -->
  <div class="grid grid-cols-1">
    <div class="grid-rows-12">
      <div id="TopRightBlock" class="row-span-5">
        <div class="grid grid-cols-2">
          <div id="ProgressGroup" class="col-span-1">
            <CalibrationProgressGroup :progress="progress" />
          </div>
          <div id="GageCutout" class="col-span-1">
            <GageCutout />
          </div>

        </div>
      </div>
      <div id="BottomRightBlock" class="row-span-7">
        <div id="MessagesGroup">
          <MessagesGroup />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { CalibrationProgress } from "~/composables/NextGenModel";
import CalibrationProgressGroup from "./CalibrationProgressGroup.vue";
import MessagesGroup from "../Common/MessagesGroup.vue";
import GageCutout from "../Common/GageCutout.vue";

const progress: CalibrationProgress = {
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
@import "@/assets/styles/styles.scss";

#TopRightBlock {
  padding: 10px;
  height: fit-content;
  border-bottom: 1px solid black;
}

#MessagesGroup {
  font-size: .9em;
}

#GageCutout {
  margin-right: 5px;
}

#ProgressGroup {
  padding: 10px;
}

.boxed {
  border: 1px solid #000;
}
</style>
