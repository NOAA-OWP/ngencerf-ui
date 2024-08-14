<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>
      <div class="h-full grid row-span-10">
        <div class="grid grid-rows-12">
          <div class="row-span-2">
            <div class="pgTitle">Next Generation Water Prediction Capability (NGWPC) </div>
          </div>
          <div class="row-span-10">
            <div id="CenterBox">
              <div>Welcome <strong>Herbert Hover</strong></div>
              <div>You have 0 current processes running</div>
              <div>You have 0 calibration setups to complete</div>
              <div id="ContinueBtn" @click="GoPreviousRuns">
                <button>Continue</button>
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

const GoPreviousRuns = () => {
  navigateTo("PreviousRuns");
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

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
}

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
}

.pgTitle {
  font-size: 30px;
  text-align: center;
  margin-top: 50px;
}
</style>
