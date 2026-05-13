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
        <p v-if="!calibrationRunForHindcast?.hindcast_status || ['Saved','Ready'].includes(calibrationRunForHindcast?.hindcast_status)"
            class="prompt-txt mt-2 text-center">
            Select a configuration.
        </p>
        <br />
    </div>
    <div v-if="!calibrationRunForHindcast?.hindcast_status || ['Saved','Ready'].includes(calibrationRunForHindcast?.hindcast_status)">
        <DataTable :value="hindcastConfigurations" sortField="fcst_win" scrollable v-model:selection="hindcastConfiguration"
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
            <Column field="fcst_win" header="Hindcast Window" sortable>
                <template #body="slotProps">
                    <div :aria-label="'Hindcast Window is ' + slotProps.data.fcst_win"
                        :title="'Hindcast Window is ' + slotProps.data.fcst_win">
                        {{ slotProps.data.fcst_win }} hour{{ slotProps.data.fcst_win > 1 ? 's' : '' }}</div>
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
          Hindcast window: {{ hindcastConfiguration.fcst_win }} hour{{ hindcastConfiguration.fcst_win > 1 ? 's' : '' }}
        </li>
      </ul>
      <p class="prompt-txt mt-2 text-center">
        Fill out all the fields below.
      </p>
      <div v-show="coldStartRunsForHindcast?.length > 0" class="text-nowrap flex gap-2 mt-2">
        <input id="useSavedState_1" type="radio" :value="true" v-model="useSavedState" :disabled="!hindcastConfiguration"/>
        <label for="useSavedState_1" class="mr-6">Use Saved State</label>
        <input id="useSavedState_0" type="radio" :value="false" v-model="useSavedState" :disabled="!hindcastConfiguration"/>
        <label for="useSavedState_0">Use Manual Dates</label>
      </div>
      <div class="flex gap-6">
        <div class="grid grid-cols-[max-content_max-content_max-content_max-content]">
          <div v-if="useSavedState" class="text-nowrap text-right font-bold p-2 required-label">
            Saved State
          </div>
          <div v-if="useSavedState" class="text-nowrap p-1">
            <Select id="coldStartJobId" v-model="coldStartJobId" :options="formattedColdStartRunsForHindcast" 
              optionLabel="cold_start_date_display" optionValue="cold_start_run_id"
              aria-label="Saved State Select" title="Saved State Select"
              class="!w-[320px]" :disabled="!hindcastConfiguration">
            </Select>
          </div>
          <div v-if="useSavedState" class="text-nowrap text-right font-bold p-2">
            Cycle Date
          </div>
          <div v-if="useSavedState" class="text-nowrap p-1">
            {{ (cycleDate ? formatISOStringOrDateToYYYYMMDDHHMM(cycleDate) + 'Z' : 'None Selected') }}
          </div>
          <div v-if="!useSavedState" class="text-nowrap text-right font-bold p-2 required-label">
            Cold Start Date
          </div>
          <div v-if="!useSavedState" class="text-nowrap p-1">
            <VueDatePicker v-model="coldStartDate" class="dp__theme_dark" text-input format="yyyy-MM-dd"
              @update:model-value="convertColdStartDateStringToDateTimeObject" :enable-time-picker="false"
              :min-date="minCycleDate ? minCycleDate.toISO() : ''" 
              :max-date="maxCycleDate ? maxCycleDate.toISO() : ''" 
              :teleport="true" utc='preserve' 
              :disabled="!hindcastConfiguration"/>
          </div>
          <div v-if="!useSavedState" class="text-nowrap text-right font-bold p-2 required-label">
            Cold Start Hour
          </div>
          <div v-if="!useSavedState" class="text-nowrap p-1">
            <Select id="coldStartHour" v-model="coldStartHour" :options="coldStartHourList" default="12" 
              aria-label="Cold Start Hour Select" title="Cold Start Hour Select"
              class="!w-24" :disabled="!hindcastConfiguration">
            </Select>
          </div>
          <div v-if="!useSavedState" class="text-nowrap text-right font-bold p-2 required-label">
            Cycle Date
          </div>
          <div v-if="!useSavedState" class="text-nowrap p-1">
            <VueDatePicker v-model="cycleDate" class="dp__theme_dark" text-input format="yyyy-MM-dd"
              @update:model-value="convertCycleDateStringToDateTimeObject" :enable-time-picker="false"
              :min-date="minCycleDate ? minCycleDate.toISO() : ''" 
              :max-date="maxCycleDate ? maxCycleDate.toISO() : ''" 
              :teleport="true" utc='preserve' 
              :disabled="!hindcastConfiguration"/>
          </div>
          <div v-if="!useSavedState" class="text-nowrap text-right font-bold p-2 required-label">
            Cycle Hour
          </div>
          <div v-if="!useSavedState" class="text-nowrap p-1">
            <Select id="cycleHour" v-model="cycleHour" :options="cycleHourList" default="12" 
              aria-label="Cycle Hour Select" title="Cycle Hour Select"
              class="!w-24" :disabled="!hindcastConfiguration">
            </Select>
          </div>
          <div class="text-nowrap text-right font-bold p-2 required-label">
            Advance Interval
          </div>
          <div class="text-nowrap p-1">
            <Select id="intervalCycle" v-model="intervalCycle" :options="formattedIntervalCycleList" default="6"
              optionLabel="interval_display" optionValue="interval" 
              aria-label="Hindcast Advance Interval Select" title="Hindcast Advance Interval Select"
              class="!w-[160px]" :disabled="!hindcastConfiguration">
            </Select>
          </div>
          <div class="text-nowrap text-right font-bold p-2 required-label">
            Number of Intervals
          </div>
          <div class="text-nowrap p-1">
            <InputNumber id="jobIdEnd" class="!w-12" v-model="numIterations" :min="1"/>
          </div>
          <div v-if="useSavedState" class="col-span-4 h-[30px]">
            &nbsp;
          </div>
        </div>
        <div>
          <span>
            <div class="col-span-1 mr-4 p-1">
              <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Button" aria-label="Next Button"
                @click="goToRunStatusTab()">
                Next
              </Button>
            </div>
          </span>
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

const useSavedState = ref<boolean>(true);
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
  coldStartRunsForHindcast,
  coldStartJobId,
  intervalCycle,
  numIterations,
  hindcastJobStatus,
  coldStartJobStatus,
} = storeToRefs(useHindcastStore());

const { loadHindcastTab, getColdStartJobsForConfiguration, createAndRunHindcastJob } = useHindcastStore();

const minCycleDate = ref<any>();
const maxCycleDate = ref<any>();
const cycleHour = ref<number>();
const cycleHourList = ref<number[]>([]);
const intervalCycleList = ref<number[]>([]);
const coldStartHour = ref<number>();
const coldStartHourList = ref<number[]>(Array.from({ length: 24 }, (_, index) => index));

let intervalCycleListOptions = [1,3,6,12,18,24,36,48,60,72,84,96,108,120,180,240]
/**
 * Disable row if hindcast configuration is not active
 */
const rowClass = (data: any) => {
    return [{ 'pointer-events-none': (calibrationRunForHindcast?.value?.hindcast_status && calibrationRunForHindcast?.value?.hindcast_status !== 'Ready')}];
};

/**
 * Add row styling if hindcast configuration is not active.
 */
const rowStyle = (data: any) => {
    return {
        color: calibrationRunForHindcast?.value?.hindcast_status && calibrationRunForHindcast?.value?.hindcast_status !== 'Ready' ? 'grey' : 'black'
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
          const response = await getColdStartJobsForConfiguration();
          coldStartRunsForHindcast.value = response?._data?.cold_start_jobs;
          if (coldStartRunsForHindcast.value.length === 0) {
            useSavedState.value = false;
          }
          getIntervalCycleList();
          if (coldStartJobId.value) {
            useSavedState.value = true;
          } else {
            useSavedState.value = false;
            if (!cycleDate.value && !coldStartJobId.value) {
              cycleDate.value = maxCycleDate.value;
            }
          }
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
  getCycleHourList();
  getIntervalCycleList();
  if (hindcastConfiguration?.value) {
    hindcastConfigurationName.value = hindcastConfiguration.value.name;
    const response = await getColdStartJobsForConfiguration();
    coldStartRunsForHindcast.value = response?._data?.cold_start_jobs;
    if (coldStartRunsForHindcast.value.length === 0) {
      useSavedState.value = false;
    }
  } else {
    hindcastConfigurationName.value = '';
    coldStartRunsForHindcast.value = [];
  }
})

watch(useSavedState, async () => {
  if (!useSavedState.value) {
    coldStartJobId.value = undefined;
    if (!cycleDate.value) {
      cycleDate.value = maxCycleDate.value;
    }
  } else if (!coldStartJobId.value) {
    cycleDate.value = undefined;
  }
});

watch(coldStartJobId, async () => {
  coldStartDate.value = undefined;
  coldStartHour.value = undefined;
  if(coldStartJobId.value) {
    let selectedRun = coldStartRunsForHindcast.value.find(run => run.cold_start_run_id === coldStartJobId.value);
    if (selectedRun) {
      cycleDate.value = selectedRun.cold_start_cycle_date;
      try {
        cycleHour.value = cycleDate.value.getHours();
      } catch {
        cycleHour.value = cycleDate.value.hour;
      }
    }
  } else {
    cycleDate.value = undefined;
    cycleHour.value = undefined;
  }
});

const formattedColdStartRunsForHindcast = computed(() => {
  if (coldStartRunsForHindcast.value) {
    return coldStartRunsForHindcast.value.map(run => ({
      ...run,
      cold_start_date_display: 
       (convertISOStringOrDateToDateTime(run.cold_start_date)).toFormat('yyyy-MM-dd HH') + 'Z - ' +
       (convertISOStringOrDateToDateTime(run.cold_start_cycle_date)).toFormat('yyyy-MM-dd HH') + 'Z'
    }));
  }
  return [];
});

const formattedIntervalCycleList = computed(() => {
  if (intervalCycleList.value) {
    return intervalCycleList.value.map(option => ({
      interval: option,
      interval_display: option + (option > 1 ? ' hours' : ' hour')
    }))
  }
  return [];
})

const showNextButton = computed(() => {
  if (!hindcastConfiguration.value) {
    return false;
  }
  if (useSavedState.value && !coldStartJobId.value) {
    return false;
  }
  if (!useSavedState.value && 
    (
      (!coldStartDate.value || (!coldStartHour.value && coldStartHour.value !== 0)) || 
      (!cycleDate.value || (!cycleHour.value && cycleHour.value !== 0))
    )
  ) {
    return false;
  }
  if (!intervalCycle.value || !numIterations.value) {
    return false;
  }
  return true;
});

const getCycleHourList = () => {
  cycleHourList.value = [];
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

const getIntervalCycleList = () => {
  intervalCycleList.value = [];
  if (hindcastConfiguration?.value?.cycle_freq) {
    intervalCycleList.value = intervalCycleListOptions.filter(h => h % hindcastConfiguration.value.cycle_freq === 0)
  }
}

/**
 * Go to the Status Run tab
 */
const goToRunStatusTab = async() => {
  toast.removeAllGroups();
  if (!calibrationRunForHindcast.value?.hindcast_status || ['Saved','Ready'].includes(calibrationRunForHindcast.value?.hindcast_status)) {
    let alerts = [];
    if (!hindcastConfiguration.value) {
      alerts.push('You must select a configuration and then set the Cycle Date/Hour.');
    }
    if (!useSavedState.value) {
      if (!coldStartDate.value || (!coldStartHour.value && coldStartHour.value !== 0)) {
        alerts.push('Invalid Cold Start Date chosen. Make sure to choose a date and an hour.');
      } else {
        cycleDate.value = cycleDate.value.set({ hour: cycleHour.value, minute: 0, second: 0 });
        if (coldStartDate.value) {
          coldStartDate.value = coldStartDate.value.set({ hour: coldStartHour.value ? coldStartHour.value : 0, minute: 0, second: 0 });
        }
        if (coldStartDate.value && coldStartDate.value >= cycleDate.value) {
          alerts.push('Cold Start Date must be before the Cycle Date.');
        }
        // validate the day/hour to make sure it is within the availability window
        let latestHindcastDate = maxCycleDate.value.minus({ hours: hindcastConfiguration.value.availability_lag})
        if (latestHindcastDate < cycleDate.value) {
          alerts.push('Hindcast data is not yet available for your chosen cycle date.');
        }
      }
      if (!cycleDate.value || (!cycleHour.value && cycleHour.value !== 0)) {
        alerts.push('Invalid Cycle Date chosen. Make sure to choose a date within the available date range, and an hour that is available for your chosen configuration.');
      }
    } else if (!coldStartJobId.value) {
      alerts.push('You must choose a saved state.');
    } else {
      calibrationRunForHindcast.value.cold_start = coldStartRunsForHindcast.value.find(run => run.cold_start_run_id === coldStartJobId.value);
      cycleDate.value = calibrationRunForHindcast.value.cycle_date;
      coldStartDate.value = calibrationRunForHindcast.value.cold_start.cold_start_date;
    }
    if (!intervalCycle.value) { 
      alerts.push('Advance Interval must be chosen.');
    }
    if (!numIterations.value) { 
      alerts.push('Number of Intervals must be indicated.');
    }
    if (alerts.length > 0) {
      let summary = 'Hindcast Setup Error';
      let message = alerts.join('\n');
      const tMsg: ToastMessageOptions = { severity: 'error', summary: summary, detail: message, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
      return false;
    } else {
      //Input has passed frontend validation - use the server to validate
      const validateHindcastJobResponse = await createAndRunHindcastJob(
        calibrationRunForHindcast?.value?.calibration_run_id as number, 
        hindcastConfiguration?.value?.name as string,
        cycleDate.value,
        coldStartDate.value,
        coldStartJobId.value,
        intervalCycle.value,
        numIterations.value,
        true // validate_only
      );
      if (validateHindcastJobResponse.status < 200 || validateHindcastJobResponse.status >= 300) {
        let summary = 'Hindcast Setup Error';
        let message = validateHindcastJobResponse?._data?.errors ? validateHindcastJobResponse._data.errors.join('\n') : '';
        const tMsg: ToastMessageOptions = { severity: 'error', summary: summary, detail: message, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
        return false;
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
