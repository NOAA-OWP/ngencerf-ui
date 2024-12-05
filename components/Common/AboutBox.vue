<template>
  <!-- About Box -->

  <div id="AboutBox">
    <div class="text-right sticky top-0">
      <img alt="Close" title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
        class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="closeAboutBox"/>
    </div>

    <div id="BoxContent">
      <div id="PgmName">
        NgenCERF
      </div>
      <hr class="mt-2" />
      <div id="FooterData">
        <table>
          <tbody>
            <tr>
              <td class="td1">App Version: </td>
              <td class="td2">{{ info.release_info.version }}</td>
            </tr>
            <tr>
              <td class="td1">Released: </td>
              <td class="td2"> {{ info.release_info.date }}</td>
            </tr>
            <tr>
              <td class="td1">&nbsp;</td>
              <td class="td2">&nbsp;</td>
            </tr>
            <tr>
              <td class="td1">Server Version: </td>
              <td class="td2">{{ serverInfo?.version }}</td>
            </tr>
            <tr>
              <td class="td1">Released: </td>
              <td class="td2">{{ serverInfo?.date }}</td>
            </tr>
            <tr>
              <td class="td1">Support Email: </td>
              <td class="td2">{{ serverInfo?.contact_email }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
import { useBackendConfig } from "~/composables/UseBackendConfig";
import type { ServerInfo } from "~/composables/NextGenModel";
import json from "@/assets/version.json";
const info = json;
const { ngencerfBaseUrl } = useBackendConfig();
const serverInfo = ref<ServerInfo>();
const mailTo = ref<string>();

onMounted(async () => {
  await getFooterInformation();
  mailTo.value = "mailto:" + serverInfo?.value?.contact_email;
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

const closeAboutBox = () => {
  useAccountEvent("aboutBoxEvent", "");

}

</script>
<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#AboutBox {
  position: absolute;
  left: Calc(50vw - 300px);
  top: Calc(50vh - 300px);
  border: 5px solid #ccc;
  z-index: 9999;
  width: 450px;
  height: 300px;
  background-color: white;


  #FooterData {
    padding: 15px;
    line-height: 1.5em;
    font-size: 1.1em;
  }

  hr {
    height: 2px;
    background-color: black;
  }

.td1 {
  text-align: right;
  padding-right: 10px;
}

.td2 {
  margin-left: 10px;
}

  #PgmName {
    display: inline-block;
    font: 40px "NeueFrutigerWorld-Bold", sans-serif;
    font-weight: bold;
    margin-left: 20px;
    margin-top: 15px;
  }
}
</style>
