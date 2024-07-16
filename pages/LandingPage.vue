<template>
  <div class="pgTitle">Next Generation Water Prediction Capability (NGWPC) </div>
  <div id="CenterBox">
    <div>Welcome <strong>Herbert Hover</strong></div>
    <div>You have 0 current processes running</div>
    <div>You have 0 calibration setups to complete</div>
    <div id="ContinueBtn" @click="GoPreviousRuns">
    <button>Continue</button>
  </div>
  </div>

</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

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
  background-color: #cccccc;;
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
  margin-bottom: 30px;
}
</style>
