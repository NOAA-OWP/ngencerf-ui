<template>
  <div id="Footer" :class="location.name === 'PreviousRuns' || location.name === 'LandingPage' ? 'height80' : 'height120'">
    <div id="ActionButtons"
      v-if="isUserLoggedIn() && location.name !== 'LandingPage' && location.name !== 'PreviousRuns'">
      <ActionButtonGroup />
    </div>
    <div class="topBar">&nbsp</div>

    <div id="FooterData" class="version">
      Version {{ info.program_info.version }},&nbsp;&nbsp;{{
        info.program_info.release_date
      }}
    </div>
    <div class="copyright">Copyright &COPY;, Somebody</div>
  </div>
</template>

<script lang="ts" setup>
import json from "@/assets/versionInfo.json";
import ActionButtonGroup from "../Calibration/ActionButtonGroup.vue";
import { useUserDataStore } from "@/stores/common/UserDataStore";
const { isUserLoggedIn, getUserName } = useUserDataStore();
const location = useRoute();
const info = json;
</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";


#ActionButtons {
  padding: 8px 0 8px 0;
  width: 67vw;
}

.height80 {
  height: 60px;
}

.hight120 {
  height: 120px;
}

#Footer {
  font: 18px NeueFrutigerWorld-Book, sans-serif;
  position: absolute;
  bottom: 0;
  width: 100%;
  color: #fff;
  z-index: 9999;
  background-color: $ngwcp_primary3;
}



.topBar {
  background-color: black;
  height: 1px;
}

.version,
.copyright {
  display: block;
  margin-top: 10px;
}

.version {
  float: left;
  margin-left: 20px;
}

.copyright {
  float: right;
  margin-right: 20px;
}
</style>
