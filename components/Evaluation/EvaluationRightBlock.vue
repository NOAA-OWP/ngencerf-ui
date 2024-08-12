<template>
  <!-- EvaluationRightBlock -->
  <div v-if="displayRightBlock" id="EvaluationRightBlock" class="grid grid-cols-1">
    <div class="grid-rows-12">
      <div id="TopRightBlock" class="row-span-5">
        <div class="grid grid-cols-2">
          <div id="ProgressGroup" class="col-span-1">
            <ProgressGroup :progress="progress" />
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
import type { Progress } from "~/composables/NextGenModel";
import ProgressGroup from "../Common/ProgressGroup.vue";
import MessagesGroup from "../Common/MessagesGroup.vue";
import GageCutout from "../Common/GageCutout.vue";

import { generalStore } from "@/stores/common/GeneralStore";
const { getEvalRunSelected } = generalStore();

const displayRightBlock = ref(getEvalRunSelected());



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
};  // height: auto;
// width: 98%;

</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#TopRightBlock {
  padding: 10px;
  height: fit-content;
  border-bottom: 1px solid black;
}

#MessagesGroup {
  //max-height: 454px;
  // height: auto;
  // width: 98%;
  font-size: .9em;
}

#GageCutout {
  margin-right: 5px;
}

#ProgressGroup {
  margin-left: 10px;
  padding: 10px;
}

.boxed {
  border: 1px solid #000;
}
</style>