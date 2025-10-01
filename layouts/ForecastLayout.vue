<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>
      <div class="grid row-span-10 gap-2">
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <div class="grid grid-rows-12 mx-auto px-4 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div id="MainLeftDataParent" class="overflow-auto">
                  <div id="MainLeftDataArea" class="overflow-auto"> 
                    <ForecastLeftBlock />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";
import AppFooter from "~/components/Common/AppFooter.vue";
import AppHeader from "~/components/Common/AppHeader.vue";
import ForecastLeftBlock from "~/components/Forecast/ForecastLeftBlock.vue";

import { generalStore } from "@/stores/common/GeneralStore";

const { getMenuIndex, getForecastTabIndex, setForecastTabIndex } = generalStore();

onUnmounted(() => {
  // Reset tab index to 1 when we leave this layout, 
  // so that it doesn't try to mount the wrong tab when you return
  setForecastTabIndex(1);
})

</script>

