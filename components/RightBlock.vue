<template>
  <div class="grid grid-cols-1">
    <div class="grid-rows-12">
      <div id="TopRightBlock" class="row-span-5">
        <div class="grid grid-cols-2">
          <div id="GageCutout" class="col-span-1">
            <img
              id="GageCutoutImage"
              src="@/assets/styles/img/gagecurout.png"
            />
          </div>
          <div id="ProgressGroup" class="col-span-1">
            <ProgressGroup :progress="progress" />
          </div>
        </div>
      </div>
      <div id="BottomRightBlock" class="row-span-7">
        <div id="MessagesGroup"><MessagesGroup /></div>
      </div>
    </div>
  </div> 
</template>
<script lang="ts" setup>

const props = defineProps<{
  progress: Progress;
}>();


</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#TopRightBlock {
  overflow: hidden;
  padding: 10px;
  height: fit-content;
}
#MessagesGroup {
  max-height: 454px;
}
#GageCutout {
  margin-right: 5px;
}

#ProgressGroup {
  background-color: $ngwcp_groupsbkg;
  border-radius: 30px;
  margin-left: 10px;
  padding: 10px;
  border: 1px solid #000;
}

#MessagesGroup {
  height: auto;
  width: 100%;
  background-color: $ngwcp_groupsbkg;
  border-radius: 30px;
  border: 1px solid #000;
}
.boxed {
  border: 1px solid #000;
}
</style>
