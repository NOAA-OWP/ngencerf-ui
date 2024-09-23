<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>
      <div class="grid row-span-10">
        <div class="grid grid-rows-12">

          <div class="row-span-12 flex items-center justify-center h-screen-inner">

            <div id="CenterBox" class="bg-white mx-auto px-8 py-8 rounded-[10px] max-w-screen-lg">
              <div class="mx-auto px-8 text-center text-2xl">
                <h1 class="mt-8 mb-4 text-4xl font-bold">Next Generation Water Prediction Center </h1>

              <div>Welcome <strong>{{ getUserName() }}</strong></div>
              <div>You have {{ runningCalibrationJobs }} current processes running</div>
              <div>You have {{ savedCalibrationJobs }}  calibration setups to complete</div>
              <div id="ContinueBtn" class="ngenButtonDiv bg-blue1 btn-center mt-4" @click="GoPreviousRuns">
                <button>Continue</button>
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



</template>
<script setup lang="ts">
import AppHeader from '~/components/Common/AppHeader.vue';
import AppFooter from '~/components/Common/AppFooter.vue';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { useCalibrationJobStore } from "~/stores/CalibrationJobStore";
import { storeToRefs } from "pinia";
const calibrationJobStore = useCalibrationJobStore()
const { savedCalibrationJobs, runningCalibrationJobs } = storeToRefs( calibrationJobStore )
const { fetchUserCalibrationJobsListData, getUserName } = useUserDataStore()

fetchUserCalibrationJobsListData()

const GoPreviousRuns = async () => {
  await navigateTo("PreviousRuns");
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
/*
#CenterBox {
  border: 4px solid #105D84;
  line-height: 2em;
  font-size: 22px;
  padding-top: 20px;
  margin: 0 auto;
  width: 600px;
  height: 265px;
  background-color: $ngwcp_groupsbkg;
  ;
  border-radius: 50px;
  text-align: center;
}*/

/*
#ContinueBtn {
  margin: 30px auto 0 auto;
  width: 120px;
  height: 50px;
  background-color: $ngwcp_primary1;
  border-radius: 30px;
  color: #ffffff;
  border: 2px solid #000;
}

#ContinueBtn:hover {
  background-color: $ngwcp_primary2;
  color: #000;
}*/

#ContinueBtn {
  max-width: 110px;
}

.pgTitle {
  font-size: 30px;
  text-align: center;
  margin-top: 50px;
}
</style>
