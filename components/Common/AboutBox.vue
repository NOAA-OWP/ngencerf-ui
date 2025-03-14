<template>
  <!-- About Box -->
  <div id="AboutBox" ref="aboutBox" class="absolute h-auto rounded-lg">
    <div class="text-right sticky top-0">
      <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
        class="absolute cursor-pointer right-0 boxed mt-2 mr-2" @click="closeAboutBox" />
    </div>

    <div id="BoxContent">
      <div id="PgmName" class="inline-block font-bold ml-4 mt-3 text-lg">
        About
      </div>
      <hr class="mt-2" />

      <div id="FooterData" class="pt-[15px] pl-[15px] leading-6">

        <div class="grid grid-cols-12">
          <div class="col-span-11">
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
          <div class="col-span-1 mt-5 text-center">
            <img class="inline cursor-pointer w-[48px]" alt="Copy Table Data" src="@/assets/styles/img/copy.png"
              @click="copyGitInfoToClipboard()" /> <br />
            <Button class="nobg" @click="copyGitInfoToClipboard()">Copy </Button>
          </div>
        </div>

      </div>

      <div class="p-4">
        <DataTable :value="gitInfoArray" class="p-datatable-sm" scrollable :scroll-height="scrollHeight"
          scroller="true">
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
import { useToast } from "primevue/usetoast";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";

import type { CombinedVerstionInfo } from "@/composables/NextGenModel";
import additionalGitInfo from "@/assets/git_info.json";

import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from '@/stores/common/UserDataStore';

const toast = useToast();
const { addToastRecord } = generalStore();
const { getServerInfo } = generalStore();
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
  }, 250);

})

onUnmounted(() => {
  window.removeEventListener('resize', function (event) {
    //
  });
})

const resizeNotifications = () => {
  let box = document.getElementById("AboutBox")?.clientHeight ?? 0;
  let row1 = document.getElementById("FooterData")?.clientHeight ?? 0;
  let h = box - row1 - 100;
  if (h <= 100) {
    h = 100;
  }
  scrollHeight.value = h + "px";

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
  })
}

const gitInfoArray = computed(() => {
  const infoArray = Object.entries(gitInfo.value).map(([repository, info]) => ({ repository, ...info }));
  return [...infoArray, { repository: 'ngencerf_ui', ...addedGitInfo.ngencerf_ui }];
});

const formatDate = (dateString: string) => {
  return dateString ? new Date(dateString).toLocaleString() : 'N/A';
};

const closeAboutBox = () => {
  useAccountEvent("aboutBoxEvent", "");
  popupActive.value = false;
}


const useClipboard = () => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      const tMsg: ToastMessageOptions = { severity: 'success', summary: 'Clipboard', detail: 'CSV copied to clipboard', life: ToastTimeout.timeout5000 };
      toast.add(tMsg); addToastRecord(tMsg);
    } catch (err) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Clipboard Error', detail: err, life: ToastTimeout.timeout5000 };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  };
  return { copyToClipboard };
};

const convertToCSV = (dataArray: any[]) => {
  if (!dataArray.length) return '';
  const headers = Object.keys(dataArray[0]).join(',');
  const rows = dataArray.map(item =>
    Object.values(item).map(value => `"${(value as string).replace(/"/g, '""')}"`).join(',')
  );
  return [headers, ...rows].join('\n');
};

const { copyToClipboard } = useClipboard();

const copyGitInfoToClipboard = () => {
  const csvData = convertToCSV(gitInfoArray.value);
  copyToClipboard(csvData);
};

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#AboutBox {
  right: 5px;
  top: 90px;
  border: 5px solid #ccc;
  z-index: 99;
  width: 1400px;
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

.nobg:hover {
  background-color: transparent !important;
  border: none;
  color: black;
}
</style>
