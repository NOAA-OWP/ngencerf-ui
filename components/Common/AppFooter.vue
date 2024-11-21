<template>
  <div id="Footer" class=" prevent-select cursor-default">
    <div class="grid grid-rows-1 gap-1">
      <div class="row-span-1 footerColor">
        <div id="FooterData" class="version">
          App {{ info.program_info.version }},&nbsp;&nbsp;{{
            info.program_info.release_date
          }}, Server {{ serverInfo?.version }}
        </div>
        <div class="copyright">Copyright &COPY;2024, RTX</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import json from "@/assets/versionInfo.json";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useRoute } from "vue-router";
import type { ServerInfo } from "~/composables/NextGenModel";
import { useBackendConfig } from "~/composables/UseBackendConfig";

const { isUserLoggedIn, userCalibrationRunData, getAccessToken } = useUserDataStore();
const { ngencerfBaseUrl } = useBackendConfig();

const location = useRoute();
const info = json;

const serverInfo = ref<ServerInfo>();

</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#Footer {
  font-size: 18px;
  font-family: NeueFrutigerWorld-Book, sans-serif;
  position: absolute;
  bottom: 0;
  width: 100%;
  color: black;
  z-index: 9;

}

#FooterData {
  height: 40px;
  z-index: 9;
}

.footerColor {
  background-color: $ngwcp_background;
}

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
