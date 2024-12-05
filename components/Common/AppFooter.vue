<template>



  <div id="Footer" class="prevent-select cursor-default">
    <div id="FloatingInfo">
      <div id="AppDate" class="hidden text-left">Application Release Date: {{ info.release_info.date }}<br /></div>
      <div id="ServerDate" class="hidden text-left">Server Release Date: {{ serverInfo?.date }}</div>
    </div>
    <div class="grid grid-rows-1 gap-1">
      <div class="row-span-1 footerColor text-sm">
        <div id="FooterData" class="version">
          <span @mouseenter="showAppInfo" @mouseleave="hideAppInfo">App Version:
            {{ info.release_info.version }}</span>&nbsp;&nbsp;&nbsp;
          <span @mouseenter="showServerInfo" @mouseleave="hideServerInfo">Server Version:
            {{ serverInfo?.version }}</span>
        </div>
        <div class="copyright">Copyright &COPY;2024, RTX</div>
      </div>
    </div>
  </div>
</template>
line-
<script lang="ts" setup>
import json from "@/assets/version.json";
import type { ServerInfo } from "~/composables/NextGenModel";
import { useBackendConfig } from "~/composables/UseBackendConfig";
const { ngencerfBaseUrl } = useBackendConfig();
const info = json;
const serverInfo = ref<ServerInfo>();

onMounted(() => {
  console.log("Calling get footer info from User Account on mounted")
  getFooterInformation();
})

const showAppInfo = () => {
  const e = document.getElementById('AppDate');
  (e as HTMLElement).style.display = "inline-block"
}

const hideAppInfo = () => {
  const e = document.getElementById('AppDate');
  (e as HTMLElement).style.display = "none"
}

const showServerInfo = () => {
  const e = document.getElementById('ServerDate');
  (e as HTMLElement).style.display = "inline-block"
}

const hideServerInfo = () => {
  const e = document.getElementById('ServerDate');
  (e as HTMLElement).style.display = "none"
}


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

#FloatingInfo {
  position:sticky;
  margin-left: 20px;
  height: 2em;
  font-size: 0.8em;
  z-index: 9999;
}



#AppDate, #ServerDate {
  border: 2px solid black;
  padding: 10px;
  border-radius: 10px;
}
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
