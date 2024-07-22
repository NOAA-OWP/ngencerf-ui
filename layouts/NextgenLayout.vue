<template>
  <div class="h-full">
    <div class="grid grid-rows-12">
      <div class="row-span-1 boxed">
        <div><AppHeader /></div>
      </div>
      <div class="h-full grid row-span-10 gap-2">
        <div class="grid grid-cols-12 boxed">
          <div class="col-span-8 boxed">
            <div class="h-full grid grid-rows-12">
              <div class="grid row-span-11 boxed">
                <LeftBlock />
              </div>
              <div class="grid row-span-1 boxed">
                <div id="ActionButtons"><ActionButtonGroup /></div>
              </div>
            </div>
          </div>
          <div class="col-span-4 boxed">
            <RightBlock/>
          </div>
        </div>
      </div>
      <div class="row-span-1"><AppFooter /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppFooter from "~/components/AppFooter.vue";
import AppHeader from "~/components/AppHeader.vue";
import RightBlock from "~/components/RightBlock.vue";

</script>
<style lang="scss" scoped>
.boxed {
  //border: 1px solid #000;
}
</style>
