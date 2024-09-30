<template>
  <!-- EvaluationRightBlock -->
  <div id="EvaluationRightBlock" class="grid grid-cols-1">
    <div class="grid-rows-12">
      <div id="TopRightBlock" class="row-span-5">
        <div class="grid grid-cols-5">
          <div class="col-span-5 mb-3">
            <h2>Progress</h2>
          </div>
          <div id="ProgressGroup" class="col-span-3">
            <EvaluationProgressGroup" />
          </div>
          <div id="GageCutout" class="col-span-2">
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

import EvaluationProgressGroup from "./EvaluationProgressGroup.vue";
import MessagesGroup from "../Common/MessagesGroup.vue";
//import EvaluationMessagesGroup from "./EvaluationMessagesGroup.vue";
import GageCutout from "../Common/GageCutout.vue";
import { generalStore } from "@/stores/common/GeneralStore";
</script>
