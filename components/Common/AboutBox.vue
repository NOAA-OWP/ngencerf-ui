<template>
  <!-- About Box -->
  <div id="AboutBox" ref="aboutBox">
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

        <div class="layout__table">
          <div class="grid grid-cols-4">
            <div class="row-span-1">
              <div class="layout__row">
                <div class="layout__cell td1">ngenCERF Version:</div>
                <div class="layout__cell td2"> {{ serverInfo?.ngenCerf_version }} </div>
              </div>
              <div class="layout__row">
                <div class="layout__cell td1"> ngenCERF Date: </div>
                <div class="layout__cell td2"> {{ serverInfo?.ngenCerf_date }} </div>
              </div>
              <div class="layout__row">
                <div class="layout__cell"> </div>
                <div class="layout__cell"> </div>
              </div>
              <div class="layout__row">
                <div class="layout__cell td1"> UI Version: </div>
                <div class="layout__cell td2"> {{ info.release_info.version }} </div>
              </div>
              <div class="layout__row">
                <div class="layout__cell td1"> UI Date: </div>
                <div class="layout__cell td2"> {{ info.release_info.date }} </div>
              </div>
              <div class="layout__row">
                <div class="layout__cell td1"> UI Commit: </div>
                <div class="layout__cell td2"> {{ info.release_info.commit.substring(0, 8) }} </div>
              </div>
            </div>

            <div class="row-span-1">
              <div class="layout__row">
                <div class="layout__cell td1"> Server Version: </div>
                <div class="layout__cell td2"> {{ serverInfo?.version }} </div>
              </div>
              <div class="layout__row">
                <div class="layout__cell td1"> Server Date: </div>
                <div class="layout__cell td2"> {{ serverInfo?.date }} </div>
              </div>
              <div class="layout__row">
                <div class="layout__cell td1"> Server Commit: </div>
                <div class="layout__cell td2"> {{ serverInfo?.commit_hash.substring(0, 8) }} </div>
              </div>
              <div class="layout__row spacer"></div>
              <div class="layout__row">
                <div class="layout__cell td1"> Support Email: </div>
                <div class="layout__cell td2">
                  <a class="hlink" :href="'mailto:' + serverInfo?.contact_email">{{ serverInfo?.contact_email }}</a>
                </div>
              </div>
            </div>
            <div class="row-span-2">&nbsp;</div>
          </div>
        </div>
      </div>

      <div class="p-4">
        <DataTable :value="gitInfoArray" class="p-datatable-sm">
          <Column field="repository" header="Repository"></Column>
          <Column field="release" header="Release"></Column>
          <Column field="build_date" header="Build Date">
            <template #body="{ data }">{{ formatDate(data.build_date) }}</template>
          </Column>
          <Column field="commit_hash" header="Commit Hash">
            <template #body="{ data }">{{ data.commit_hash.substring(0, 8) }}</template>
          </Column>
          <Column field="commit_date" header="Commit Date">
            <template #body="{ data }">{{ formatDate(data.commit_date) }}</template>
          </Column>
          <Column field="author" header="Author"></Column>
          <Column field="message" header="Message"></Column>

        </DataTable>
      </div>


    </div>



  </div>

</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import type { ServerInfo } from "@/composables/NextGenModel";
import json from "@/assets/version.json";
import { generalStore } from "@/stores/common/GeneralStore";
const { getServerInfo } = generalStore();
import { useUserDataStore } from '@/stores/common/UserDataStore';

const { getAccessToken, isUserLoggedIn } = useUserDataStore();

const { ngencerfBaseUrl } = useBackendConfig();

const { popupActive } = storeToRefs(generalStore());

const info = json;
const serverInfo = ref<ServerInfo>();

const gitInfo = ref<Record<string, GitInfo>>({});

const scrollHeight = ref<string>(); // Default height

const aboutBox = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

interface GitInfo {
  release: string;
  build_date: string;
  commit_hash: string;
  commit_date: string;
  author: string;
  message: string;
}


onMounted(async () => {
  serverInfo.value = getServerInfo();

    getGitInformation();

  if (aboutBox.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Resize when visible
            resizeNotifications();
          }
        });
      },
      { threshold: 0.5 } // Triggers when at least 50% of the div is visible
    );
    observer.observe(aboutBox.value);
  }

  window.addEventListener('resize', function (event) {
    resizeNotifications();
  });

  setTimeout(() => {
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
  }, 1000);

})

onUnmounted(() => {
  window.removeEventListener('resize', function (event) {
    //
  });
})

const resizeNotifications = () => {
  let box = document.getElementById("aboutBox")?.clientHeight ?? 0;
  scrollHeight.value = box + "px";
}

// Get footer infongenCERF
const getGitInformation = () => {
  if (!isUserLoggedIn() ) {
    return null;
  }
  makeProtectedApiCall<FormulationTabData>(`${ngencerfBaseUrl}/calibration/get_git_info/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getAccessToken()}`,
      "Content-Type": 'application/json'
    },
    body: ""
  }).then((result) => {
    gitInfo.value = result._data.git_info;
    console.log(gitInfo.value);
  })
}

const gitInfoArray = computed(() =>
  Object.entries(gitInfo.value).map(([repository, info]) => ({ repository, ...info }))
);

const formatDate = (dateString: string) => {
  return dateString ? new Date(dateString).toLocaleString() : 'N/A';
};

const closeAboutBox = () => {
  useAccountEvent("aboutBoxEvent", "");
  popupActive.value = false;
}

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#AboutBox {
  position: absolute;
  right: 5px;
  top: 90px;
  border: 5px solid #ccc;
  z-index: 9999;
  width: 1600px;
  height: auto;
  background-color: white;


  #FooterData {
    padding: 15px;
    line-height: 1.5em;
  }

  hr {
    height: 2px;
    background-color: black;
  }

  .layout__table {
    position: relative;
    display: block;
  }

  .layout__row {
    display: flex;
  }

  .layout__row.spacer {
    padding-bottom: 20px;
  }

  .layout__cell.td1 {
    width: 150px;
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

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
