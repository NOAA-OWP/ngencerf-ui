<!-- DataEntry.vue -->
<template>
  <div>
    <div style="width: 100%">
      <div id="LeftSideDiv" class="leftBox boxed">
        <LeftBlock />
      </div>
      <div id="RightSideDiv" class="rightBox boxed">
        <RightBlock />
      </div>
    </div>
    <div id="ActionButtons">
      Buttons go here
    </div>
  </div>
</template>
<style lang="css" scoped>
#ActionButtons {
  position:fixed;
  bottom: 80px;
  height: 80px;
  border: 1px solid #000;
  width: 100%;
}
.boxed {
  border: 0 1px 1px 0 solid #000;
}
.leftBox {
  overflow: hidden;
  width: 62%;
  float: left;
}
.rightBox {
  width: 38%;
  float: right;
}
</style>
