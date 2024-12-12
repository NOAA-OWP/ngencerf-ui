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
                <div class="overflow-auto">
                  <div id="MainLeftDataArea" class="overflow-auto"> 
                    <EvaluationLeftBlock />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--
      <div v-if="getMenuIndex() === 2 && getEvaluationTabIndex() === 2" class="grid row-span-10 gap-2">
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <div class="grid grid-rows-12 mx-auto px-4 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div class="overflow-auto">
                  <div id="MainLeftDataArea" class="overflow-auto"> 
                    <EvaluationLeftBlock />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid row-span-10 gap-2">
        <div class="grid grid-cols-12">
          <div :class="userCalibrationRunData ? 'col-span-8' : 'col-span-12'">
            <div class="grid grid-rows-12 mx-auto px-4 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div id="MainLeftDataArea" class="overflow-auto"> 
                  <EvaluationLeftBlock />
                </div>
              </div>
            </div>
          </div>          
          <div class="col-span-4" v-if="userCalibrationRunData">
            <div class="grid grid-rows-12 mx-auto px-4 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div id="MainRightDataArea" class="overflow-auto"> 
                  <EvaluationRightBlock />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      -->

      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppFooter from "~/components/Common/AppFooter.vue";
import AppHeader from "~/components/Common/AppHeader.vue";
import EvaluationRightBlock from "~/components/Evaluation/EvaluationRightBlock.vue";
import EvaluationLeftBlock from "~/components/Evaluation/EvaluationLeftBlock.vue";

import { storeToRefs } from "pinia";
import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";

const { getMenuIndex, getEvaluationTabIndex } = generalStore();
const { userCalibrationRunData } = storeToRefs( useUserDataStore() );

</script>

