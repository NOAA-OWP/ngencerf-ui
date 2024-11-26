<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>
      <div v-if="getMenuIndex() === 3 && getForecastTabIndex() === 1" class="grid row-span-10 gap-2">
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <div class="grid grid-rows-12 mx-auto px-4 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div class="overflow-auto">
                  <div id="MainLeftDataArea" class="overflow-auto"> 
                    <ForecastLeftBlock />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid row-span-10 gap-2">
        <div class="grid grid-cols-12">
          <div class="col-span-8">
            <div class="grid grid-rows-12 mx-auto px-4 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div id="MainLeftDataArea" class="overflow-auto"> 
                  <ForecastLeftBlock />
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <div class="grid grid-rows-12 mx-auto px-4 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div id="MainRightDataArea" class="overflow-auto"> 
                  <ForecastRightBlock />
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
import AppFooter from "~/components/Common/AppFooter.vue";
import AppHeader from "~/components/Common/AppHeader.vue";
import ForecastRightBlock from "~/components/Forecast/ForecastRightBlock.vue";
import ForecastLeftBlock from "~/components/Forecast/ForecastLeftBlock.vue";

import { generalStore } from "@/stores/common/GeneralStore";

const { getMenuIndex, getForecastTabIndex } = generalStore();

</script>

