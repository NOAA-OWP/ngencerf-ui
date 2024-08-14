<template>
  <div id="Footer" class=" prevent-select cursor-default">
    <div class="grid grid-rows-2 gap-1">
      <div class="row-span-1">
        <div class="grid grid-cols-3">
          <div class="col-span-2">

            <span v-if="location.name === 'Calibration'">
              <div id="ActionButtons" class="footerColor"
                v-if="isUserLoggedIn() && location.name !== 'LandingPage' && location.name !== 'PreviousRuns' && location.name !== 'Login'">
                <CalibrationButtonGroup />
              </div>
            </span>

            <span v-else>
              <div id="ActionButtons" class="footerColor"
                v-if="isUserLoggedIn() && location.name !== 'LandingPage' && location.name !== 'PreviousRuns' && location.name !== 'Login'">
                <EvaluationButtonGroup/>
              </div>             
            </span>
          </div>
        </div>
      </div>

      <div class="row-span-1 footerColor">
        <div class="topBar">&nbsp</div>
        <div id="FooterData" class="version">
          Version {{ info.program_info.version }},&nbsp;&nbsp;{{
            info.program_info.release_date
          }}
        </div>
        <div class="copyright">Copyright &COPY;2024, RTX</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import json from "@/assets/versionInfo.json";
import CalibrationButtonGroup from "../Calibration/CalibrationButtonGroup.vue";
import EvaluationButtonGroup from "../Evaluation/EvaluationButtonGroup.vue";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useRoute } from "vue-router";

const { isUserLoggedIn, getUserName } = useUserDataStore();
const location = useRoute();
const info = json;
</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#ActionButtons {
  height: 60px;
  padding: 8px 0 8px 0;
  height: 60px;
  background: $ngwcp_background;
}

#Footer {
  font: 18px NeueFrutigerWorld-Book, sans-serif;
  position: absolute;
  bottom: 0;
  width: 100%;
  color: black;
  z-index: 9999;

}

#FooterData {
  height: 50px;
  z-index: 9999;
}

.footerColor {
  background-color: $ngwcp_background;
  ;
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
