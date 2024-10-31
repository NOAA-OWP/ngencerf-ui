<template>
  <div id="Footer" class=" prevent-select cursor-default">
    <div class="grid grid-rows-1 gap-1">
      <div class="row-span-1 footerColor">
        <div id="FooterData" class="version">
          Version {{ info.program_info.version }},&nbsp;&nbsp;{{
            info.program_info.release_date
          }}
        </div>
        <!-- <div class="text-center">
          Job ID: {{userCalibrationRunData?.calibration_run_id}}, 
        </div> -->
        <div class="copyright">Copyright &COPY;2024, RTX</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import json from "@/assets/versionInfo.json";
import { generalStore } from "~/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useRoute } from "vue-router";

const { getCalibrationTabIndex } = generalStore();

const { isUserLoggedIn, userCalibrationRunData } = useUserDataStore();
const location = useRoute();
const info = json;

const canDisplayBeforeRun = computed(() => {
  return isUserLoggedIn() && location.name !== 'LandingPage' && location.name !== 'Login';
});

</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#Footer {
  font: 18px NeueFrutigerWorld-Book, sans-serif;
  position: absolute;
  bottom: 0;
  width: 100%;
  color: black;
  z-index: 9;

}

#FooterData {
  /*height: 50px;*/
  height: 40px;
  z-index: 9;
}

.footerColor {
  background-color: $ngwcp_background;
  ;
}

/*
.topBar {
  background-color: black;
  height: 1px;
}*/

.version,
.copyright {
  display: block;
  margin-top: 16px;
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
