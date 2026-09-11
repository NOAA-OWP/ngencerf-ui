<template>
  <!-- Download CLI Box -->
  <div id="DownloadCliBoxContents" style="direction: ltr" class="flex-1 overflow-y-auto">

    <div id="BoxContent" class="mx-auto max-w-7xl">
      <!-- Header -->
      <div>
        <div>
          <h1 class="p-4 text-3xl font-bold inline-block">
            <span>Download ngenCerf CLI</span>
          </h1>

          <p class="m-4 text-gray-600">
            The <b>ngenCerf</b> Command Line Interface (CLI) lets you run jobs and
            interact with the server from your local machine.
          </p>
        </div>
      </div>

      <!-- Download Section -->
      <section class="rounded-lg border bg-white mx-4 p-4 shadow-sm">

        <h2 class="text-2xl font-semibold">
          1. Download the CLI
        </h2>

        <p class="mt-1">
          Choose your operating system.
        </p>

        <div class="mt-6 grid gap-6 md:grid-cols-3">

          <!-- Windows -->
          <div class="flex flex-col items-center rounded-lg border p-4 text-center">

            <div class="mb-4 text-6xl text-blue-600">
              <a :href="ngencerfBaseUrl + '/static/latest/windows/ngencerf.exe'">
                <font-awesome-icon :icon="faWindows" />
              </a>
            </div>

            <h3 class="text-xl font-semibold !text-black">
              Windows
            </h3>

            <p class="mb-6 text-gray-500">
              File: <b>ngenCerf.exe</b>
            </p>
            
            <a :href="ngencerfBaseUrl + '/static/latest/windows/ngencerf.exe'">
              <button class="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                <font-awesome-icon
                  :icon="faDownload"
                  class="text-sm"
                />
                <span>Download for Windows</span>
              </button>
            </a>

          </div>

          <!-- macOS -->
          <div class="flex flex-col items-center rounded-lg border p-4 text-center">

            <div class="mb-4 text-6xl">
              <a :href="ngencerfBaseUrl + '/static/latest/macos/ngencerf'">
                <font-awesome-icon :icon="faApple" />
              </a>
            </div>

            <h3 class="text-xl font-semibold !text-black">
              macOS
            </h3>

            <p class="mb-6 text-gray-500">
              File: <b>ngenCerf</b>
            </p>

            <a :href="ngencerfBaseUrl + '/static/latest/macos/ngencerf'">
              <button class="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                <font-awesome-icon
                  :icon="faDownload"
                  class="text-sm"
                />
                <span>Download for macOS</span>
              </button>
            </a>

          </div>

          <!-- Linux -->
          <div class="flex flex-col items-center rounded-lg border p-4 text-center">

            <div class="mb-4 text-6xl">
              <a :href="ngencerfBaseUrl + '/static/latest/linux/ngencerf'">
                <font-awesome-icon :icon="faLinux" />
              </a>
            </div>

            <h3 class="text-xl font-semibold !text-black">
              Linux
            </h3>

            <p class="mb-6 text-gray-500">
              File: <b>ngenCerf</b>
            </p>

            <a :href="ngencerfBaseUrl + '/static/latest/linux/ngencerf'">
              <button class="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                <font-awesome-icon
                  :icon="faDownload"
                  class="text-sm"
                />
                <span>Download for Linux</span>
              </button>
            </a>

          </div>

        </div>

      </section>

      <!-- Installation -->
      <section class="rounded-lg border bg-white mx-4 mt-4 p-4 shadow-sm">

        <h2 class="text-2xl font-semibold">
          2. Installation & Usage
        </h2>

        <div class="mt-6 grid gap-8 lg:grid-cols-3">

          <div>
            <h3 class="mb-4 flex items-center gap-2 text-xl font-semibold !text-black">
              <font-awesome-icon :icon="faWindows" />
              Windows
            </h3>
            
            <ol class="space-y-2 list-decimal pl-6">
              <li>Download <b>ngenCerf.exe</b>.</li>
              <li>Save it in a directory where you want to keep command-line tools, such as 
                <b>C:\Users\&lt;your-username&gt;\bin</b>.</li>
              <li>You can run it directly from that directory using <b>.\ngencerf.exe</b>.</li>
              <li>Optionally, add that directory to your Windows <b>PATH</b> so you can run it from anywhere 
                using <b>ngencerf</b>.</li>
            </ol>
          </div>

          <div class="border-l border-gray-200 pl-8">
            <h3 class="mb-4 flex items-center gap-2 text-xl font-semibold !text-black">
              <font-awesome-icon :icon="faApple" />
              macOS
            </h3>

            <ol class="space-y-2 list-decimal pl-6">
              <li>Download <b>ngenCerf</b>.</li>
              <li>Open Terminal in the download directory and make it executable using:
                <div class="flex items-center justify-between rounded border bg-gray-50 mt-2 p-3 font-mono text-sm">
                  <span>
                    {{ commandList[0] }}
                  </span>

                  <button
                    type="button"
                    class="ml-4 text-gray-500 hover:text-blue-600"
                    title="Copy to clipboard"
                    @click="copyCommand(commandList[0]);"
                  >
                    <font-awesome-icon :icon="faCopy" />
                  </button>
                </div>
              </li>
              <li>You can run it directly from the download directory using <b>./ngencerf</b>.</li>
              <li>Optionally, move it to a directory on your <b>PATH</b>, such as <b>/usr/local/bin</b>, 
                so you can run it from anywhere using <b>ngencerf</b>.</li>
            </ol>
          </div>

          <div class="border-l border-gray-200 pl-8">
            <h3 class="mb-4 flex items-center gap-2 text-xl font-semibold !text-black">
              <font-awesome-icon :icon="faLinux" />
              Linux
            </h3>

            <ol class="space-y-2 list-decimal pl-6">
              <li>Download <b>ngenCerf</b>.</li>
              <li>Open a terminal in the download directory and make it executable using:
                <div class="flex items-center justify-between rounded border bg-gray-50 mt-2 p-3 font-mono text-sm">
                  <span>
                    {{ commandList[1] }}
                  </span>

                  <button
                    type="button"
                    class="ml-4 text-gray-500 hover:text-blue-600"
                    title="Copy to clipboard"
                    @click="copyCommand(commandList[1]);"
                  >
                    <font-awesome-icon :icon="faCopy" />
                  </button>
                </div>
              </li>
              <li>You can run it directly from the download directory using <b>./ngencerf</b>.</li>
              <li>Optionally, move it to a directory on your <b>PATH</b>, such as <b>/usr/local/bin</b>, 
                so you can run it from anywhere using <b>ngencerf</b>.</li>
            </ol>
          </div>

        </div>

      </section>

      <!-- Configure URL -->
      <section class="rounded-lg border bg-white mx-4 my-4 p-4 shadow-sm">

        <h2 class="text-2xl font-semibold">
          3. Configure the Server URL
        </h2>

        <div class="mt-6 grid gap-8 lg:grid-cols-3">

          <div>
            <ul class="space-y-2 list-disc pl-6">
              <li>
                Before using the CLI, tell it which server to connect to.
                <div class="flex items-center justify-between rounded border bg-gray-50 mt-2 p-3 font-mono text-sm">
                  <span>
                    {{ commandList[2] }}
                  </span>

                  <button
                    type="button"
                    class="ml-4 text-gray-500 hover:text-blue-600"
                    title="Copy to clipboard"
                    @click="copyCommand(commandList[2]);"
                  >
                    <font-awesome-icon :icon="faCopy" />
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <div class="border-l border-gray-200 pl-8">
            <ul class="space-y-2 list-disc pl-6">
              <li>
                The CLI saves this URL and uses it for future commands.
              </li>
              <li>
                You can save multiple server URLs. The most recently added server URL becomes the active server.
              </li>
            </ul>
          </div>

          <div class="border-l border-gray-200 pl-8">
            <ul class="space-y-2 list-disc pl-6">
              <li>
                To display your saved servers:
                <div class="flex items-center justify-between rounded border bg-gray-50 mt-2 p-3 font-mono text-sm">
                  <span>
                    {{ commandList[3] }}
                  </span>

                  <button
                    type="button"
                    class="ml-4 text-gray-500 hover:text-blue-600"
                    title="Copy to clipboard"
                    @click="copyCommand(commandList[3]);"
                  >
                    <font-awesome-icon :icon="faCopy" />
                  </button>
                </div>
              </li>

              <li>
                To switch to another saved server:
                <div class="flex items-center justify-between rounded border bg-gray-50 mt-2 p-3 font-mono text-sm">
                  <span>
                    {{ commandList[4] }}
                  </span>

                  <button
                    type="button"
                    class="ml-4 text-gray-500 hover:text-blue-600"
                    title="Copy to clipboard"
                    @click="copyCommand(commandList[4]);"
                  >
                    <font-awesome-icon :icon="faCopy" />
                  </button>
                </div>
              </li>
            </ul>

          </div>

        </div>

      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { generalStore } from "@/stores/common/GeneralStore";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faLinux,
  faApple,
  faWindows,
} from '@fortawesome/free-brands-svg-icons'
import { 
  faCircleInfo,
  faDownload,
  faCopy
} from '@fortawesome/free-solid-svg-icons'

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";
import type { CombinedVersionInfo } from "@/composables/NgencerfModels";

const toast = useToast();

const { addToastRecord, getServerInfo } = generalStore();
const { popupActive } = storeToRefs(generalStore());

const { ngencerfBaseUrl } = useBackendConfig();

const combinedVersionInfo = ref<CombinedVersionInfo>();

const downloadCliBox = ref<HTMLElement | null>(null);

const commandList = [
  'chmod +x ngencerf',
  'chmod +x ngencerf',
  'ngencerf url add ' + ngencerfBaseUrl,
  'ngencerf url list',
  'ngencerf url select <number>'
]

const copyCommand = async(command: string) => {
  toast.removeAllGroups();
  try {
    await navigator.clipboard.writeText(command);
    const tMsg: ToastMessageOptions = { severity: 'info', detail: 'Copied code to clipboard', life: ToastTimeout.timeoutInfo };
    toast.add(tMsg); addToastRecord(tMsg);
  } catch (err) {
    const tMsg: ToastMessageOptions = { severity: 'error', detail: 'Error copying code to clipboard: ' + err, life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

onMounted(async () => {
  combinedVersionInfo.value = getServerInfo();
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#DownloadCliBox {
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
</style>
