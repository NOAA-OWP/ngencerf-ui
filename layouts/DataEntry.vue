<!-- DataEntry.vue -->
<template>
  <div>
    <div style="width: 100%">
      <div id="LeftSideDiv" class="leftBox">
        <LeftBlock />
        <div id="ActionButtons"><ActionButtonGroup /></div>
      </div>
      <div id="RightSideDiv" class="rightBox">
        <RightBlock :progress="progress"/>
      </div>
     
    </div>
    
  </div>
</template>
<script lang="ts" setup>
import type { Progress } from "~/composables/NextGenModel";

const props = defineProps<{
  progress: Progress;
}>();

</script>
<style lang="css" scoped>
#ActionButtons {
  position: fixed;
  bottom: 70px;
  height: 70px;
  /* border: 1px solid #000; */
  width: 100%;
  padding-top: 3px;
  max-width: 1020px;
  min-width: 884px;
}
.boxed {
  border: 1 solid #000;
}
.leftBox {
  overflow: hidden;
  width: 66%;
  float: left;
}
.rightBox {
  overflow: hidden;
  width: 34%;
  margin-right: 20px;
  margin-top: -40px;
  float: right;
}
</style>
