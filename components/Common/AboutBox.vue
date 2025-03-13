<template>
  <!-- About Box -->
  <div id="AboutBox" ref="aboutBox" class="absolute h-auto">
    <div class="text-right sticky top-0">
      <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
        class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="closeAboutBox" />
    </div>

    <div id="BoxContent">
      <div id="PgmName" class="inline-block font-bold ml-4 mt-3 text-lg">
        About
      </div>
      <hr class="mt-2" />

      <div id="FooterData" class="pt-[15px] pl-[15px] leading-6">
        <div class="relative block text-left">
          <div class="flex">
            <div class="w-[150px]">ngenCERF Version:</div>
            <div class="w-[150px]"> {{ combinedVersionInfo?.ngenCerf_version }} </div>
          </div>
          <div class="flex">
            <div class="w-[150px]"> ngenCERF Date: </div>
            <div class=" w-[150px]"> {{ combinedVersionInfo?.ngenCerf_date }} </div>
          </div>
          <div class="flex">
            <div class="w-[150px]"> Support Email: </div>
            <div class="w-[150px]">
              <a class="hlink" :href="'mailto:' + combinedVersionInfo?.contact_email">{{
                combinedVersionInfo?.contact_email }}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4">
        <DataTable :value="gitInfoArray" class="p-datatable-sm" scrollable scroll-height="400px">
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
import type { CombinedVerstionInfo } from "@/composables/NextGenModel";
import additionalGitInfo from "@/assets/git_info.json";
import { generalStore } from "@/stores/common/GeneralStore";
const { getServerInfo } = generalStore();
import { useUserDataStore } from '@/stores/common/UserDataStore';

const { getAccessToken, isUserLoggedIn } = useUserDataStore();

const { ngencerfBaseUrl } = useBackendConfig();

const { popupActive } = storeToRefs(generalStore());

const addedGitInfo = additionalGitInfo;
const combinedVersionInfo = ref<CombinedVerstionInfo>();

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
  combinedVersionInfo.value = getServerInfo();

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
  if (!isUserLoggedIn()) {
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

const cleanAdditionalInfo = () => {
  const validKeys = ["commit_hash", "build_date", "commit_date", "author", "message"];
  Object.keys(addedGitInfo.ngencerf_ui).forEach(key => {
    if (!validKeys.includes(key)) {
      delete addedGitInfo.ngencerf_ui[key];
    }
  });
};

const gitInfoArray = computed(() => {
  const infoArray = Object.entries(gitInfo.value).map(([repository, info]) => ({ repository, ...info }));
  cleanAdditionalInfo();
  return [...infoArray, { repository: 'ngencerf_ui', ...addedGitInfo.ngencerf_ui }];
});
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
  right: 5px;
  top: 90px;
  border: 5px solid #ccc;
  z-index: 9999;
  width: 1600px;
  background-color: white;

  hr {
    height: 2px;
    background-color: black;
  }

  .hlink {
    text-decoration: underline;
    color: blue;
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
