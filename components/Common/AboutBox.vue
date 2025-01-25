<template>
  <!-- About Box -->
  <div id="AboutBox">
    <div class="text-right sticky top-0">
      <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
        class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="closeAboutBox" />
    </div>

    <div id="BoxContent">
      <div id="PgmName">
        About
      </div>
      <hr class="mt-2" />
      <div id="FooterData">
        <table>
          <tbody>
            <tr>
              <td class="td1">ngenCERF Version: </td>
              <td class="td2">{{ serverInfo?.ngenCerf_version }}</td>
            </tr>
            <tr>
              <td class="td1">ngenCERF Date: </td>
              <td class="td2"> {{ serverInfo?.ngenCerf_date }}</td>
            </tr>
            <tr>
              <td class="td1">&nbsp;</td>
              <td class="td2">&nbsp;</td>
            </tr>
            <tr>
              <td class="td1">UI Version: </td>
              <td class="td2">{{ info.release_info.version }}</td>
            </tr>
            <tr>
              <td class="td1">UI Date: </td>
              <td class="td2"> {{ info.release_info.date }}</td>
            </tr>
            <tr>
              <td class="td1">UI Commit: </td>
              <td class="td2">{{ info.release_info.commit }}</td>
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
              <td class="td1">Server Date: </td>
              <td class="td2">{{ serverInfo?.date }}</td>
            </tr>
            <tr>
              <td class="td1">Server Commit:</td>
              <td class="td2">{{ serverInfo?.commit_hash }}</td>
            </tr>
            <tr>
              <td class="td1">&nbsp;</td>
              <td class="td2">&nbsp;</td>
            </tr>
            <tr>
              <td class="td1">Support Email: </td>
              <td class="td2">
                <a class="hlink" :href="'mailto:' + serverInfo?.contact_email">{{ serverInfo?.contact_email }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import type { ServerInfo } from "@/composables/NextGenModel";
import json from "@/assets/version.json";
import { generalStore } from "@/stores/common/GeneralStore";
const { getServerInfo } = generalStore();

const info = json;
const serverInfo = ref<ServerInfo>();

onMounted(async () => {
  serverInfo.value = getServerInfo();
})

const closeAboutBox = () => {
  useAccountEvent("aboutBoxEvent", "");
}

</script>
<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#AboutBox {
  position: absolute;
  right: 5px;
  top: 90px;
  border: 5px solid #ccc;
  z-index: 9999;
  width: 544px;
  height: 400px;
  background-color: white;


  #FooterData {
    padding: 15px;
    line-height: 1.5em;
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

  .commit-hash {
    padding: 3px !important;
  }

  .hlink {
    text-decoration: underline;
    color: blue;
  }

  #PgmName {
    display: inline-block;
    font: 20px "NeueFrutigerWorld-Bold", sans-serif;
    font-weight: bold;
    margin-left: 20px;
    margin-top: 15px;
  }
}
</style>
