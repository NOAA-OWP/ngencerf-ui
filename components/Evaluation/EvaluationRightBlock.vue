<template>
  <!-- EvaluationRightBlock -->
  <div v-if="displayRightBlock" id="EvaluationRightBlock" class="grid grid-cols-1">
    <div class="grid-rows-12">
      <div id="TopRightBlock" class="row-span-5">
        <div class="grid grid-cols-2">
          <div id="ProgressGroup" class="col-span-1">
            <EvaluatonProgressGroup :progress="progress" />
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
import type { EvaluationProgress } from "~/composables/NextGenModel";
import EvaluatonProgressGroup from "./EvaluatonProgressGroup.vue";
import MessagesGroup from "../Common/MessagesGroup.vue";
import GageCutout from "../Common/GageCutout.vue";

import { generalStore } from "@/stores/common/GeneralStore";
const { getEvalRunSelected } = generalStore();

const displayRightBlock = ref(getEvalRunSelected());


const progress: EvaluationProgress = {
  headwater_basin_gage: true,
  formulation: false,
  parameters_set: false,
  calibration_output_variable: false,
  metrics: false,
  time_period: false,
  output_variable: false,
  reference_dataset: false,
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