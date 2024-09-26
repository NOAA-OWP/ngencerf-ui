<template>
  <!-- CalibrationRightBlock -->
  <div id="CalibrationRightBlock" class="grid grid-cols-1">
    <div class="grid-rows-12">
      <div id="TopRightBlock" class="row-span-5">
        <div class="grid grid-cols-3">
          <div class="col-span-3 mb-3">
            <h2>Progress</h2>
          </div>
          <div id="ProgressGroup" class="col-span-2">
            <CalibrationProgressGroup />
          </div>
          <div id="GageCutout" class="col-span-1">
            <GageCutout />
          </div>
        </div>
      </div>
      <div id="BottomRightBlock" class="row-span-7">
        <div id="MessagesGroup">
          <!-- <CalibrationMessagesGroup /> -->
           <MessagesGroup />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CalibrationProgressGroup from "./CalibrationProgressGroup.vue";
import MessagesGroup from "../Common/MessagesGroup.vue";
//import CalibrationMessagesGroup from "./CalibrationMessagesGroup.vue";
import GageCutout from "../Common/GageCutout.vue";
</script>
