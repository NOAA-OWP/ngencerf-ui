<template>
    <div>
        <h1 class="mb-6 text-3xl font-bold text-center relative">
            Verification Setup
        </h1>
        <div style="font-size: 12px;font-weight: normal;margin-top:15px;"
            aria-label="'Verification Job ID is ' + verificationJobId ? verificationJobId : 'New'">
            <h2 style="font-size:1.5em; padding-top:5px;">
              Verification Job ID: 
              {{ verificationJobId ? verificationJobId : 'New' }}
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
             If settings look right, click Next.
        </p>
        <br/>
    </div>

    <div class="grid grid-rows-1 mt-8 mb-4 ActionButtonsBox" id="VerificationSetupButtons">
      <div id="VerificationSetupBottomButtons" class="grid grid-cols-8">
        <div class="col-span-7"></div>
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

import { generalStore } from "@/stores/common/GeneralStore";
const { addToastRecord } = generalStore();

const toast = useToast();

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

  renderYamlConfigData();
  isVerificationLoading.value = false;
})

// TO DO: Display only the relevant information instead of formatting the entire YAML file
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
  // reset verification_yaml_file_path
  selectedVerificationYamlFile.value = userVerificationJobData?.value?.verification_yaml_file_path ? userVerificationJobData?.value?.verification_yaml_file_path.replace(/\\/g, '/').split('/').pop() : undefined;
  if (userVerificationJobData?.value?.yaml_config_data) {
    yamlConfigData.value = userVerificationJobData?.value?.yaml_config_data;
  }
  if (userVerificationJobData?.value?.yaml_config_error_message) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'YAML Configuration Error', detail: userVerificationJobData.value.yaml_config_error_message, life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
  if (yamlConfigData.value) {
    document.getElementById('YamlConfigData').innerHTML = formatYamlConfigData(yamlConfigData.value);
  } else {
    document.getElementById('YamlConfigData').innerHTML = '';
  }
};

const goNextTab = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[VerificationTabs.tab_runStatus];
  e.click();
}

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