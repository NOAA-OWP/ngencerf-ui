<template>
    <div>
        <h1 class="mb-6 text-3xl font-bold text-center relative">
            Verification Configuration Selection
        </h1>
        <div style="font-size: 12px;font-weight: normal;margin-top:15px;"
            aria-label="'Verification Job ID is ' + verificationJobId ? verificationJobId : 'New'">
            <h2 style="font-size:1.5em; padding-top:5px;">
              Verification Job ID: 
              {{ verificationJobId ? verificationJobId : 'New' }}
            </h2>
            <h2 style="font-size:1.5em; padding-top:5px;">
              Data Source: 
              {{ userVerificationJobData?.forecast_run ? 'ngen' : 'nwm' }}
            </h2>
            <span v-if="userVerificationJobData?.forecast_run">
              <h2 style="font-size:1.5em; padding-top:5px;">
                Forecast Job ID: 
                {{ userVerificationJobData?.forecast_run.forecast_run_id }}
              </h2>
              <h2 style="font-size:1.5em; padding-top:5px;">
                Forecast Cycle Date: 
                <span v-if="userVerificationJobData.forecast_run.cycle_date">
                  {{ formatISOStringOrDateToYYYYMMDD(userVerificationJobData.forecast_run.cycle_date) }}
                </span>
              </h2>
            </span>
        </div>
        <p class="prompt-txt mt-2 text-center">
            <span v-if="userVerificationJobData?.forecast_run">
                If settings look right, click Next.
            </span>
            <span v-else>
                Upload a configuration file then click Next.
            </span>
        </p>
        <br/>
    </div>

    <div class="grid grid-rows-1 mt-8 mb-4 ActionButtonsBox" id="VerificationSetupButtons">
      <div id="VerificationSetupBottomButtons" class="grid grid-cols-8">
        <div v-if="!userVerificationJobData?.forecast_run" class="col-span-2" id="UploadParams" @click="triggerVerificationYamlFileInput">
          <input type="file" ref="verificationYamlFileInput" class="hidden" @change="handleVerificationYamlFileUpload" />
          <Button class="ngenButtonDiv-alt"
            :disabled="!['Saved','Ready'].includes(userVerificationJobData?.status)"
            aria-label="Upload Verification YAML File" title="Upload Verification YAML File">
            {{ selectedVerificationYamlFile ? 'Replace' : 'Upload' }} Verification YAML File</Button>
        </div>
        <div class="col-span-5"></div>
        <div class="col-span-1 mr-4">
          <Button v-if="userVerificationJobData?.status == 'Ready'" class="ngenButtonDiv ml-6 font-normal h-8" title="Next Tab Button" aria-label="Next Tab Button"
            @click="goNextTab()">Next</Button>
        </div>
      </div>
    </div>

    <div>
      <span v-if="selectedVerificationYamlFile" class="font-bold">YAML Configuration from {{ selectedVerificationYamlFile }}:</span>
      <div id="YamlConfigData"></div>
    </div>

    <div class="waitgif" v-if="isVerificationLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { storeToRefs } from "pinia";
import { DateTime } from "luxon";

import { generalStore } from "@/stores/common/GeneralStore";
const { verificationSetupHasChanged } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();

const verificationYamlFileInput = ref<HTMLInputElement | null>(null);

import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { useVerificationStore } from "@/stores/verification/VerificationStore";

const forecastStore = useForecastStore();
const verificationStore = useVerificationStore();

const { selectedForecastJob } = storeToRefs(forecastStore);
const { 
  verificationJobId, 
  userVerificationJobData, 
  selectedVerificationYamlFile,
  yamlConfigData,
  isVerificationLoading 
} = storeToRefs(verificationStore);
const { loadSelectedVerificationJob } = useVerificationStore();

const userDataStore = useUserDataStore();

import { useUserDataStore } from "@/stores/common/UserDataStore";
const { ngencerfBaseUrl } = useBackendConfig();
const { getAccessToken } = userDataStore;

import { hilightTab } from '@/composables/TabHilight';
onMounted(() => {
  hilightTab(VerificationTabs.tab_setupVerification);

  restoreTab();
  verificationSetupHasChanged.value = false;
  isVerificationLoading.value = false;
})

/**
 * Trigger file input dialog
 */
const triggerVerificationYamlFileInput = () => {
  if (verificationYamlFileInput.value) {
    if (verificationYamlFileInput.value.value) {
      verificationYamlFileInput.value.value = '';
    }
    verificationYamlFileInput.value.click();
  }
};

/**
 * Handle parameter file upload
 * @param event
 */
const handleVerificationYamlFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0]; // get the first file we see
  if (file) {
    try {
      const formData = new FormData();
      formData.append('verification_yaml_file', file);
      formData.append('verification_job_id', String(verificationJobId.value));

      const response: any = await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/upload_verification_yaml_file/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: formData,
        });
      if (response.error && response.error === TokenExpired) {
        alert("Your session had timed out");
        navigateTo('login');
      } else if (response?._data.verification_yaml_file) {
        selectedVerificationYamlFile.value = response?._data.verification_yaml_file;
        yamlConfigData.value = response?._data.yaml_config_data;
        // update the job so we have all of its current properties in memory
        let updated_job_response = await loadSelectedVerificationJob(verificationJobId.value);
        userVerificationJobData.value = updated_job_response._data;
      }
    } catch (error) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'File upload failed', life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
    renderYamlConfigData();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'No file selected', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

// Not sure save/update functions are needed since the update happens immediately on file upload
/* const saveTabData = () => {
  isVerificationLoading.value = true;
  if (userVerificationJobData?.value?.status && !['Saved','Ready'].includes(userVerificationJobData?.value?.status)) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to Save', detail: 'Update of a job already run is not allowed.', life: ToastTimeout.timeoutWarn };
    toast.add(tMsg); addToastRecord(tMsg);
  } else {
    toast.removeAllGroups();

    saveVerificationSetupData().then(response => {
      if (response.status === 400) {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Save Verification Setup Failed.', detail: response._data.message, life: ToastTimeout.timeoutError};
        toast.add(tMsg); addToastRecord(tMsg);
      } else if (response.status === 200) {
        updateVerificationSetupData(response);
      } else {
        useApiErrorResponsePreprocess(response).forEach(message => {
          const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Save Verification Setup Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
          toast.add(tMsg); addToastRecord(tMsg);
        });
        updateVerificationSetupData(response);
      }
      isVerificationLoading.value = false;
    });
  }
};

const updateVerificationSetupData = async (response: any) => {
  if (userVerificationJobData.value) {
    userVerificationJobData.value.verification_yaml_file_path = selectedVerificationYamlFile.value as string;
  }
} */

const formatYamlConfigData = (data: DynamicObject, indent: number=1) => {
  let htmlData = '';
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      if (key !== 'file_paths') {
        htmlData += '<div class="pl-' + indent*2 + '">' + key + ': ' + formatYamlConfigData(data[key],indent+1) + '</div>';
      }
    })
  } else {
    htmlData += data;
  }
  return htmlData;
}

const renderYamlConfigData = () => {
  if (yamlConfigData.value) {
    document.getElementById('YamlConfigData').innerHTML = formatYamlConfigData(yamlConfigData.value);
  } else {
    document.getElementById('YamlConfigData').innerHTML = '';
  }
}

const restoreTab = () => {
  // reset verification_yaml_file_path
  selectedVerificationYamlFile.value = userVerificationJobData?.value?.verification_yaml_file_path ? userVerificationJobData?.value?.verification_yaml_file_path.replace(/\\/g, '/').split('/').pop() : undefined;
  if (userVerificationJobData?.value?.yaml_config_data) {
    yamlConfigData.value = userVerificationJobData?.value?.yaml_config_data;
    renderYamlConfigData();
  }
  if (userVerificationJobData?.value?.yaml_config_error_message) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'YAML Configuration Error', detail: userVerificationJobData.value.yaml_config_error_message, life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

const validateTab = () => {
  let error = false;
  let text = [];
  if (!selectedVerificationYamlFile.value) {
    error = true;
    text.push("Verification YAML File has not been uploaded");
  }
  else if (selectedVerificationYamlFile.value != userVerificationJobData?.value?.verification_yaml_file_path.replace(/\\/g, '/').split('/').pop()) {
    error = true;
    text.push("Verification YAML File has been changed");
  }
  return { error: error, text: text }
}

const goNextTab = () => {
  //saveTabData();
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[VerificationTabs.tab_runStatus];
  e.click();
}

defineExpose({
  validateTab,
  restoreTab
});

onUnmounted(() => {
  selectedVerificationYamlFile.value = undefined
  yamlConfigData.value = {};
});

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#PgTitle {
  text-align: center;
  font-size: 30px;
  margin-top: 40px;
  margin-bottom: 40px;
}
</style>