<template>
   <!-- CalibrationRightBlock -->
  <div class="grid grid-cols-1">
    <div class="grid-rows-12">
      <div id="TopRightBlock" class="row-span-5">        
        <div class="grid grid-cols-3">
          <div class="col-span-3 mb-3">
            <h2>Progress</h2>
          </div>
          <div id="ProgressGroup" class="col-span-2">
            <CalibrationProgressGroup" />
          </div>
          <div id="GageCutout" class="col-span-1">
            <GageCutout />
          </div>

        </div>
      </div>
      <div id="BottomRightBlock" class="row-span-7">
        <div id="MessagesGroup">
          <CalibrationMessagesGroup />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CalibrationProgressGroup from "./CalibrationProgressGroup.vue";
import GageCutout from "../Common/GageCutout.vue";


</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#TopRightBlock {
  padding: 10px;
  height: fit-content;
}

#MessagesGroup {
  font-size: .9em;
}

#GageCutout {
  margin-right: 5px;
  max-height: 300px;
  //overflow: scroll;
}
/*
#ProgressGroup {
  padding: 10px;
}
*/
.boxed {
  border: 1px solid #000;
}
</style>
