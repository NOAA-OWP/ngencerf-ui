<template>
  <!-- About Box -->
  <div id="AboutBox" ref="aboutBox" class="absolute h-auto rounded-lg">
    <div id="AboutBoxContents" style="direction: ltr">
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
              <div class="nobg cursor-default">Copy</div>
            </div>
          </div>

        </div>

        <div class="p-4">
          <DataTable :value="gitInfoArray" class="p-datatable-sm text-sm" scrollable :scroll-height="scrollHeight"
            scroller="true">
            <Column v-for="(item, index) in Array.from(uniqueFields)" :key="item" :field="item"
              :sortable="index === 0 ? true : false" :header="Array.from(uniqueHeaders)[index]">
              <template #body="{ data }">
                {{ formatTableOutput(data, item) }}
              </template>
            </Column>
          </DataTable>
        </div>
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

import type { CombinedVerstionInfo, GitData } from "@/composables/NextGenModel";

import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from '@/stores/common/UserDataStore';

import { formatISOStringOrDateToYYYYMMDDHHMM } from "@/utils/TimeHelpers";

const toast = useToast();
const { addToastRecord } = generalStore();
const { getServerInfo } = generalStore();
const { getAccessToken, isUserLoggedIn } = useUserDataStore();

const { ngencerfBaseUrl } = useBackendConfig();

const { popupActive } = storeToRefs(generalStore());

const combinedVersionInfo = ref<CombinedVerstionInfo>();

const gitInfo = ref<Record<string, GitData>>({});
// Added reactive variable to store optional git_info.json data loaded at runtime
const addedGitInfo = ref<any>(null);

const scrollHeight = ref<string>(); // Default height

const aboutBox = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
let resizeObserver: ResizeObserver | null = null;

const foundFields = ref<string[]>();

const uniqueFields = new Set<string>();
const uniqueHeaders = new Set<string>(); //NOSONAR (Removes erronious message that this variable is not used. It is.)

onMounted(async () => {
  combinedVersionInfo.value = getServerInfo();

  // Dynamically load git_info.json from the public directory
  const git_info_file = '/ngencerf_ui_git_info.json'
  fetch(git_info_file)
    .then(response => {
      if (!response.ok) {
        throw new Error(git_info_file + ' not found');
      }
      return response.json();
    })
    .then(data => {
      addedGitInfo.value = transformComponent(data);
    })
    .catch(err => {
      console.warn('Optional ' + git_info_file + ' not loaded:', err);
      addedGitInfo.value = {};
    });

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

  if (aboutBox.value) {
    // Initialize ResizeObserver to listen for changes.
    resizeObserver = new ResizeObserver((entries) => {
      resizeNotifications();
    });
    // Start observing the element.
    resizeObserver.observe(aboutBox.value);
  }

  await getGitInformation();

  setTimeout(() => {
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
  }, 250);
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
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

/**
 * Returns an array of unique field names from an array of objects or an object of objects.
 * @param arr - The input array of objects or an object of objects.
 * @returns A string array containing unique field names.
 */
function getUniqueFields(arr: unknown): string[] {
  let data: unknown[] = [];
  // If arr is already an array, use it directly.
  if (Array.isArray(arr)) {
    data = arr;
  }
  // If arr is an object (but not an array), convert its values to an array.
  else if (arr && typeof arr === 'object') {
    data = Object.values(arr);
  } else {
    console.error('Input is not an array or an object of objects');
    return [];
  }

  // Iterate over each item in the data array.
  data.forEach(item => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      Object.keys(item).forEach(key => {
        uniqueFields.add(key);
        let s = key.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        uniqueHeaders.add(s);
      });
    } else {
      console.warn('Skipping non-object item:', item);
    }
  });
  return Array.from(uniqueFields);
}

const formatTableOutput = (field: Record<string, string>, item: string) => {
  if (item.indexOf("_hash") !== -1) { return field[item].substring(0, 8) }
  if (item.indexOf("_date") !== -1) { return formatISOStringOrDateToYYYYMMDDHHMM(field[item]) }
  return field[item];
}

const gitInfoArray = computed(() => {
  let infoArray = Object.entries(gitInfo.value).map(([repository, info]) => ({ repository, ...info }));
  // Append additional git info if it was loaded
  if (infoArray.length && addedGitInfo.value && Object.keys(addedGitInfo.value).length > 0) {
    addedGitInfo.value.repository = 'ngencerf_ui';
    infoArray.push(addedGitInfo.value);
  }
  getUniqueFields(infoArray);
  return infoArray;
});

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

function transformComponent(componentGitInfo: any) {
  // Ensure we have a string for tags
  const tags = (componentGitInfo.ngencerf_ui.tags || "").trim();
  const newComp = { release: "", build_date: "", commit_hash: "", commit_date: "", author: "", message: "" };
  // If tags is empty, set release to "dev (<branch>)", otherwise use tags.
  if (tags === "") {
    const branch = `dev (${componentGitInfo.ngencerf_ui.branch || "<unknown>"})`;
    newComp.release = branch;
  } else {
    newComp.release = tags;
  }
  // Insert keys in the desired order: build_date, then commit_hash.
  newComp.build_date = componentGitInfo.ngencerf_ui.build_date || "";
  newComp.commit_hash = componentGitInfo.ngencerf_ui.commit_hash || "";
  // If tags is empty, add commit_date, author, and message if they exist.
  if (tags === "") {
    if ("commit_date" in componentGitInfo.ngencerf_ui) {
      newComp.commit_date = componentGitInfo.ngencerf_ui.commit_date || "";
    }
    if ("author" in componentGitInfo.ngencerf_ui) {
      newComp.author = componentGitInfo.ngencerf_ui.author || "";
    }
    if ("message" in componentGitInfo.ngencerf_ui) {
      newComp.message = componentGitInfo.ngencerf_ui.message || "";
    }
  }
  return newComp;
}


</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#AboutBox {
  right: 5px;
  top: 90px;
  border: 5px solid #ccc;
  z-index: 99;
  width: auto;
  max-width: 90%;
  background-color: white;
  resize: both;
  overflow-x: scroll;
  overflow-y: hidden;
  direction: rtl;
  min-width: 400px;
  min-height: 200px;

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
