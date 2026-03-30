<template>
    <Transition name="slide-fade">
      <div id="MessagesGroupWindow" v-if="showMessagesGroup">
        <div class="text-right sticky top-0">
          <img title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
            class="absolute cursor-pointer right-0 mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
        </div>
        <MessagesGroup />
      </div>
    </Transition>
    <div>
        <div style="font-size: 12px;font-weight: normal;margin-top:15px;"
            :aria-label="'Gage ID is ' + calibrationRunForHindcast?.gage_id"
            :title="'Gage ID is  ' + calibrationRunForHindcast?.gage_id">
            <h2>
              Gage ID: 
              {{ calibrationRunForHindcast?.gage_id }}
            </h2>
        </div>
        <div style="font-size: 12px;font-weight: normal;margin-top:2px;"
            :aria-label="'Domain is ' + calibrationRunForHindcast?.domain_name"
            :title="'Domain ID is  ' + calibrationRunForHindcast?.domain_name">
            <h2 style="font-size:1.5em; padding-top:5px;">
              Domain: 
              {{ calibrationRunForHindcast?.domain_name }}
            </h2>
        </div>
        <div style="font-size: 12px;font-weight: normal;margin-top:2px;"
            :aria-label="'Calibration Job ID is ' + calibrationRunForHindcast?.calibration_run_id"
            :title="'Calibration Job ID is  ' + calibrationRunForHindcast?.calibration_run_id">
            <h2 style="font-size:1.5em; padding-top:5px;">
                <a v-if="userCalibrationRunData" href="#" class="c-blue underline"
                  @click="toggleMessagesGroup">
                  Calibration Job ID: 
                  {{ calibrationRunForHindcast?.calibration_run_id }}
                </a>
            </h2>
        </div>
        <h1 class="mb-6 text-3xl font-bold text-center relative">
            Hindcast Configuration Selection
        </h1>
        <p  v-if="!calibrationRunForHindcast?.hindcast_status || ['Saved','Ready'].includes(calibrationRunForHindcast?.hindcast_status)"
            class="prompt-txt mt-2 text-center">
            Select a configuration, choose Cycle Date/Hour and optional Cold Start Date, then click Next.
        </p>
        <br />
    </div>
    <div v-if="!calibrationRunForHindcast?.hindcast_status || ['Saved','Ready'].includes(calibrationRunForHindcast?.hindcast_status)">
        <DataTable :value="hindcastConfigurations" sortField="hcst_win" scrollable v-model:selection="hindcastConfiguration"
            selectionMode="single" :rowClass="rowClass" :rowStyle="rowStyle">
            <Column field="name" header="Configuration" sortable>
                <template #body="slotProps">
                    <div :aria-label="'Configuration is ' + slotProps.data.name" 
                      :title="'Configuration is ' + slotProps.data.name">
                      {{ slotProps.data.name }}</div>
                </template>
            </Column>
            <Column field="availability_lag" header="Most Recent Hindcast Available" sortable>
                <template #body="slotProps">
                    <div :aria-label="'Most Recent Hindcast Available is ' + slotProps.data.availability_lag"
                        :title="'Most Recent Hindcast Available is ' + slotProps.data.availability_lag">
                        {{ slotProps.data.availability_lag }} hour{{ slotProps.data.availability_lag > 1 ? 's' : '' }} 
                        before current time</div>
                </template>
            </Column>
            <Column field="cycle_freq" header="Cycle Hours Available" sortable>
                <template #body="slotProps">
                    <div :aria-label="'Cycle Hours Available: ' + slotProps.data.cycle_freq"
                        :title="'Cycle Hours Available: ' + slotProps.data.cycle_freq">
                        {{ slotProps.data.cycle_freq > 1 ? 
                            'Every ' + slotProps.data.cycle_freq + ' hours from ' + slotProps.data.cycle_start + 'Z to ' + slotProps.data.cycle_end + 'Z'
                            : 'Every hour' 
                        }}
                        </div>
                </template>
            </Column>
            <Column field="hcst_win" header="Hindcast Window" sortable>
                <template #body="slotProps">
                    <div :aria-label="'Hindcast Window is ' + slotProps.data.hcst_win"
                        :title="'Hindcast Window is ' + slotProps.data.hcst_win">
                        {{ slotProps.data.hcst_win }} hour{{ slotProps.data.hcst_win > 1 ? 's' : '' }}</div>
                </template>
            </Column>
        </DataTable>
    </div>
    <div v-if="calibrationRunForHindcast?.hindcast_status && !['Saved','Ready'].includes(calibrationRunForHindcast?.hindcast_status)" class="text-normal mt-2 mx-auto text-center">
      This hindcast has already been run. Click Next to see status.
      <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Button" aria-label="Next Button"
        @click="goToRunStatusTab()">
        Next
      </Button>
    </div>
    <div v-else-if="hindcastConfiguration" class="grid place-items-center" style="margin-top:15px;">
      <div class="font-bold">Availability for {{ hindcastConfiguration.name }}:</div>
      <ul>
        <li v-if="hindcastConfiguration.availability_lag > 0">
          Most recent hindcast available: {{ hindcastConfiguration.availability_lag }} 
          hour{{ hindcastConfiguration.availability_lag > 1 ? 's' : '' }} before current time
        </li>
        <li>
          Cycle hours available: {{ cycleHourList.length < 24 ? cycleHourList.join(', ') : '0-23' }}
        </li>
        <li>
          Hindcast window: {{ hindcastConfiguration.hcst_win }} hour{{ hindcastConfiguration.hcst_win > 1 ? 's' : '' }}
        </li>
      </ul>
      <div class="grid grid-cols-5">
        <div class="text-nowrap text-right font-bold p-1">
          Cold Start Date
        </div>
        <div class="text-nowrap p-1">
          <VueDatePicker v-model="coldStartDate" class="dp__theme_dark" text-input format="yyyy-MM-dd"
            @update:model-value="convertColdStartDateStringToDateTimeObject" :enable-time-picker="false"
            :min-date="minCycleDate ? minCycleDate.toISO() : ''" 
            :max-date="maxCycleDate ? maxCycleDate.toISO() : ''" 
            :teleport="true" utc='preserve' 
            :disabled="!hindcastConfiguration"/>
        </div>
        <div class="text-nowrap text-right font-bold p-1 required-label">Cycle Date</div>
        <div class="text-nowrap p-1">
          <VueDatePicker v-model="cycleDate" class="dp__theme_dark" text-input format="yyyy-MM-dd"
            @update:model-value="convertCycleDateStringToDateTimeObject" :enable-time-picker="false"
            :min-date="minCycleDate ? minCycleDate.toISO() : ''" 
            :max-date="maxCycleDate ? maxCycleDate.toISO() : ''" 
            :teleport="true" utc='preserve' 
            :disabled="!hindcastConfiguration"/>
        </div>
        <div>
          <span v-if="cycleDate && (cycleHour || cycleHour === 0) && hindcastConfiguration">
            <div class="col-span-1 mr-4 p-1">
              <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Button" aria-label="Next Button"
                @click="goToRunStatusTab()">
                Next
              </Button>
            </div>
          </span>
        </div>
        <div class="text-nowrap text-right font-bold p-1">
          Cold Start Hour
        </div>
        <div class="text-nowrap p-1">
          <Select id="coldStartHour" v-model="coldStartHour" :options="coldStartHourList" default="12" 
            aria-label="Cold Start Hour Select" title="Cold Start Hour Select"
            :disabled="!hindcastConfiguration">
          </Select>
        </div>
        <div class="text-nowrap text-right font-bold p-1 required-label">Cycle Hour</div>
        <div class="text-nowrap p-1">
          <Select id="cycleHour" v-model="cycleHour" :options="cycleHourList" default="12" 
            aria-label="Cycle Hour Select" title="Cycle Hour Select"
            :disabled="!hindcastConfiguration">
          </Select>
        </div>
      </div>
    </div>
    <div class="waitgif" v-if="isLoading"> <img alt="Please wait..." src="@/assets/styles/img/wait.gif" /> </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import VueDatePicker from "@vuepic/vue-datepicker";
import { DateTime } from "luxon";

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { useUserDataStore } from "@/stores/common/UserDataStore"
import { useHindcastStore } from '@/stores/hindcast/HindcastStore';
import { generalStore } from '~/stores/common/GeneralStore';

import { hilightTab } from '@/composables/TabHilight';

import MessagesGroup from "../Common/MessagesGroup.vue";

const { calibrationJobId, isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();

const showMessagesGroup = ref<boolean>(false);

const { userCalibrationRunData } = storeToRefs(useUserDataStore());
const { fetchUserCalibrationRunData } = useUserDataStore();

const {
  calibrationRunForHindcast,
  coldStartDate,
  cycleDate,
  hindcastConfigurations,
  hindcastConfiguration,
  hindcastConfigurationName,
  hindcastJobStatus,
  coldStartJobStatus,
} = storeToRefs(useHindcastStore());

const { loadHindcastTab } = useHindcastStore();

const minCycleDate = ref<any>();
const maxCycleDate = ref<any>();
const cycleHour = ref<number>();
const cycleHourList = ref<number[]>([]);
const coldStartHour = ref<number>();
const coldStartHourList = ref<number[]>(Array.from({ length: 24 }, (_, index) => index));

/**
 * Disable row if hindcast configuration is not active
 */
const rowClass = (data: any) => {
    return [{ 'pointer-events-none': (hindcastJobStatus.value && hindcastJobStatus.value !== 'Ready')}];
};

/**
 * Add row styling if hindcast configuration is not active.
 */
const rowStyle = (data: any) => {
    return {
        color: (hindcastJobStatus.value && hindcastJobStatus.value !== 'Ready') ? 'grey' : 'black'
    };
};


onMounted(async () => {
    toast.removeAllGroups(); // clear all toast messages
    isLoading.value = false; // set isLoading to false
    
    if (!cycleHour.value && cycleDate.value) {
      try {
        cycleHour.value = cycleDate.value.getHours();
      } catch {
        cycleHour.value = cycleDate.value.hour;
      }
    }

    minCycleDate.value = DateTime.utc(2022, 1, 1, 12, 0, 0);
    maxCycleDate.value = DateTime.utc();

    if (!cycleDate.value) {
      cycleDate.value = maxCycleDate.value;
    }
    
    if (!coldStartHour.value && coldStartDate.value) {
      try {
        coldStartHour.value = coldStartDate.value.getHours();
      } catch {
        coldStartHour.value = coldStartDate.value.hour;
      }
    }

    // scroll to top of the page
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); }

    // highlight the tab when selected
    hilightTab(HindcastTabs.tab_setupHindcast);

    nextTick(async () => {
        // load userCalibrationRunData so we can show details on user request
        calibrationJobId.value = calibrationRunForHindcast.value?.calibration_run_id;
        await fetchUserCalibrationRunData();
        // load tab data to populate hindcastConfigurations
        const loadHindcastTabResponse: any = await loadHindcastTab();
        if (loadHindcastTabResponse?._data?.forecast_configuration_values) {
          hindcastConfigurations.value = loadHindcastTabResponse?._data?.forecast_configuration_values;
        } else {
          const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Unable to load hindcast configurations. Did you select a valid calibration job?', life: ToastTimeout.timeoutError };
          toast.add(tMsg); addToastRecord(tMsg);
        }
        if (hindcastConfiguration.value) {
            getCycleHourList();
        }
    });
});

const toggleMessagesGroup = async () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

// Convert coldStartDate and cycleDate strings to Date objects
// VueDatePicker sets these to strings, so we need to convert them to Date objects
const convertCycleDateStringToDateTimeObject = (value: string) => {
  if (cycleDate.value) {
      cycleDate.value = DateTime.fromISO(value, { zone: 'utc' });
  }
}
const convertColdStartDateStringToDateTimeObject = (value: string) => {
  if (coldStartDate.value) {
      coldStartDate.value = DateTime.fromISO(value, { zone: 'utc' });
  }
}

watch(hindcastConfiguration, async () => {
  cycleHourList.value = [];
  getCycleHourList();
  hindcastConfigurationName.value = hindcastConfiguration?.value?.name;
})

const getCycleHourList = () => {
  if (hindcastConfiguration?.value) {
    let h = hindcastConfiguration?.value?.cycle_start;
    while (h <= hindcastConfiguration?.value?.cycle_end) {
      cycleHourList.value.push(h);
      h += hindcastConfiguration?.value?.cycle_freq;
    }
    nextTick(async () => {
      document.getElementById('MainLeftDataArea').parentNode.scrollTop = document.getElementById('MainLeftDataArea').parentNode.scrollHeight;
    });
  }
}

/**
 * Go to the Status Run tab
 */
const goToRunStatusTab = () => {
    if (!calibrationRunForHindcast.value?.hindcast_status || ['Saved','Ready'].includes(calibrationRunForHindcast.value?.hindcast_status)) {
        if (!hindcastConfiguration.value) {
          const alert = window.alert('You must select a configuration and then set the Cycle Date/Hour.');
          return false;
        } else if (!cycleDate.value || (!cycleHour.value && cycleHour.value !== 0)) {
          const alert = window.alert('Invalid Cycle Date chosen.\n\nMake sure to choose a date within the available date range, and an hour that is available for your chosen configuration.');
          return false;
        } else if (!coldStartDate.value && (coldStartHour.value && coldStartHour.value > 0)) {
          const alert = window.alert('Invalid Cold Start Date chosen.\n\nMake sure to choose a date and an hour, or leave both fields empty to run a hindcast without a cold start.');
          return false;
        } else {
          cycleDate.value = cycleDate.value.set({ hour: cycleHour.value, minute: 0, second: 0 });
          if (coldStartDate.value) {
            coldStartDate.value = coldStartDate.value.set({ hour: coldStartHour.value ? coldStartHour.value : 0, minute: 0, second: 0 });
          }
          if (coldStartDate.value && coldStartDate.value >= cycleDate.value) {
            const alert = window.alert('Cold Start Date must be before the Cycle Date.');
            return false;
          }
          // validate the day/hour to make sure it is within the availability window
          let latestHindcastDate = maxCycleDate.value.minus({ hours: hindcastConfiguration.value.availability_lag})
          if (latestHindcastDate < cycleDate.value) {
              const alert = window.alert('Hindcast data might not yet be available for your chosen cycle date.');
          }
        }
    }
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[HindcastTabs.tab_hindcastRunStatus] as HTMLElement;
    e.click();
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#MessagesGroupWindow {
  z-index: 100;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}
</style>
