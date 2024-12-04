<template>
  <div id="Footer" class="prevent-select cursor-default">
    <div class="grid grid-rows-1 gap-1">
      <div class="row-span-1 footerColor text-sm">
        <div id="FooterData" class="version">
          App Version: {{ info.release_info.version }}&nbsp; ({{
            info.release_info.date
          }}), Server Version: {{ serverInfo?.version }}, {{ serverInfo?.date }}
        </div>
        <div class="copyright">Copyright &COPY;2024, RTX</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import json from "@/assets/version.json";
import { useRoute } from "vue-router";
import type { ServerInfo } from "~/composables/NextGenModel";
import { useBackendConfig } from "~/composables/UseBackendConfig";

const { ngencerfBaseUrl } = useBackendConfig();

const location = useRoute();
const info = json;

const serverInfo = ref<ServerInfo>();

onMounted( () => {
  getFooterInformation();
})

// Get footer info
const getFooterInformation = () => {
    makeProtectedApiCall<FormulationTabData>(`${ngencerfBaseUrl}/calibration/get_footer/`, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: ""
    }).then((result) => {
      serverInfo.value = result._data;
    })
  }


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
