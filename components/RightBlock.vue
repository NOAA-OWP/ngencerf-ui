<template>
  <div class="grid grid-cols-1">
    <div id="TopRightBlock" class="row">
      <div class="grid grid-cols-2" >
        <div id="GageCutout" class="col-span-1">
          <img id="GageCutoutImage" src="@/assets/styles/img/gagecurout.png" />
        </div>
        <div id="ProgressGroup" class="col-span-1">
          <ProgressGroup />
        </div>
      </div>
    </div>
    <div id="BottomRightBlock" class="row">Bottom</div>
  </div>
</template>
<style lang="scss" scoped>
#TopRightBlock {
  //height: 335px;
  overflow: hidden;
  padding: 10px;

}
#GageCutout {
 margin-right: 5px;
}

#ProgressGroup {
  background-color: #cccccc;
  border-radius: 30px;
  margin-left: 10px;
  padding: 10px

}

.boxed {
  border: 1px solid #000;
}
</style>
