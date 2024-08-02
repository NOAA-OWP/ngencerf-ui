<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div><AppHeader /></div>
      </div>
      <div class="h-full grid row-span-10 gap-2">
        <div class="grid grid-cols-12">
          <div class="col-span-8">
            <div class="h-full grid grid-rows-12">
              <div class="grid row-span-12">
                <LeftBlock />
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <RightBlock/>
          </div>
        </div>
      </div>
      <div class="row-span-1"><AppFooter /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppFooter from "~/components/Common/AppFooter.vue";
import AppHeader from "~/components/Common/AppHeader.vue";
import RightBlock from "~/components/Calibration/RightBlock.vue";
import LeftBlock from "~/components/Calibration/LeftBlock.vue";

</script>
<style lang="scss" scoped>

</style>
