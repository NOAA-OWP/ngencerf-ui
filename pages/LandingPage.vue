<template>
  <client-only>
    <div class="h-full">
      <div class="grid grid-rows-3 h-full">
        <div class="row-span-1">
          <div>
            <AppHeader />
          </div>
        </div>
        <div class="row-span-1">
          <div id="CenterBox" class="bg-white mx-auto px-8 py-8 rounded-[10px] max-w-screen-lg">
            <div class="mx-auto px-8 text-center text-2xl mt-8 mb-8 ">
              <h1 class="text-4xl font-bold">Next Generation Water Prediction Capability</h1>
              <div class="pt-8 pb-8">Welcome <strong>{{ getUserName() }}</strong></div>
              <div>You have {{ runningCalibrationJobs }} current processes running</div>
              <div>You have {{ savedCalibrationJobs }} calibration setups to complete</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </client-only>
</template>
<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import AppHeader from '@/components/Common/AppHeader.vue';
import AppFooter from '@/components/Common/AppFooter.vue';
import { useUserDataStore } from '@/stores/common/UserDataStore';
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { storeToRefs } from "pinia";

const { savedCalibrationJobs, runningCalibrationJobs } = storeToRefs(useCalibrationJobStore());
const { fetchUserCalibrationJobsListData, getUserName } = useUserDataStore()

onMounted(() => {
  nextTick(() => {
    fetchUserCalibrationJobsListData();
  })
})

</script>
