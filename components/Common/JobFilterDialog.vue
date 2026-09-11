<template>
  <div id="JobFilterDialog">
    <div id="FilterDialog" class="JobsFilterBox mb-2 mt-4" :style="`opacity: ${disableAll ? '50%' : '100%'}`">

      <div class="grid grid-cols-6 gap-2 text-sx">
        <div class="col-span-5">
          <div class="flex flex-wrap gap-2">
            <div v-show="showGage" class="whitespace-nowrap">
              <label class="block text-left w-[90%]" for="Domain" aria-label="Domain"
                title="Domain">Domain</label>
              <Select id="Domain" class="mt-1 basin-gage-filter text-left w-32" v-model="uiDomainName" 
                :options="getDomainOptionsList" optionLabel="display_name" optionValue="name" placeholder="All" 
                aria-label="Domain Filter Select" title="Domain Filter Select"
                :disabled="disableAll" @change="refreshJobList(); updateGageList();">
              </Select>
            </div>

            <div v-show="showGage" class="whitespace-nowrap">
              <label class="block text-left w-[90%]" for="HeadwaterBasinGage" aria-label="Headwater Basin Gage"
                title="Headwater Basin Gage">Headwater Basin Gage</label>
              <Select id="HeadwaterBasinGage" class="mt-1 basin-gage-filter text-left w-40" v-model="uiGageId"
                :options="filterGageList" filter optionLabel="name" optionValue="name" placeholder="All"
                aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select"
                :disabled="disableAll" @change="refreshJobList();">
              </Select>
            </div>
            
            <div v-show="showStatus" class="whitespace-nowrap">
              <label class="block text-left mb-1" for="StatusList" aria-label="Status Filter"
                title="Status Filter">Status</label>
              <MultiSelect id="StatusList" v-model="statusTypeFilterList" :options="StatusTypes" optionLabel="status"
                optionValue="filterValue" :maxSelectedLabels="3" class="JobsFilterSelect w-40" aria-label="Status Filter"
                title="Status Filter" :disabled="disableAll" @change="refreshJobList()">
                <template #header>
                  <div class="absolute cursor-pointer top-2 left-[38px]">&nbsp; Select All Items</div>
                </template>
                <template #option="slotProps">
                  <div class="font-ui leading-none" :aria-label="slotProps.option.filterValue"
                    :title="slotProps.option.filterValue">
                    {{ slotProps.option.filterValue }}
                  </div>
                </template>
              </MultiSelect>
            </div>

            <div v-show="showModules" class="whitespace-nowrap">
              <div class="flex gap-2 w-70">
                <div>
                  <label for="ModuleList" class="block text-left mb-1" aria-label="Module Filter"
                    title="Module Filter">Modules</label>
                  <MultiSelect id="ModuleList" v-model="modulesFilterList" :options="fetchFormulationModuleOptions"
                    optionLabel="display_name" optionValue="name" :maxSelectedLabels="3" class="JobsFilterSelect w-40" aria-label="Module Filter"
                    title="Module Filter" :disabled="disableAll" @change="refreshJobList()">
                    <template #header>
                      <div class="absolute cursor-pointer top-2 left-[38px]">&nbsp; Select All Items</div>
                    </template>
                    <template #option="slotProps">
                      <div class="font-ui pl-2 leading-none" :aria-label="slotProps.option.name"
                        :title="slotProps.option.name">
                        {{ slotProps.option.display_name }}&nbsp;
                      </div>
                    </template>
                  </MultiSelect>
                </div>
                <div v-show="modulesFilterList.length > 1">
                  <label for="ModuleList" class="block text-left mb-1" aria-label="Module Filter"
                    title="Module Filter">Module Match</label>
                  <Select id="ModuleOperator" v-model="moduleOperator" :options="moduleOperatorList" optionLabel="display_name"
                    optionValue="name" class="user-select w-12" @change="refreshJobList()"
                    aria-label="Module Operator" title="Module Operator">
                  </Select>
                </div>
              </div>
            </div>
            <div class="flex gap-2" v-show="showCreatedAt || showJobId">
              <div class="flex gap-2" v-show="showCreatedAt">
                <div>
                  <label class="block text-left mb-1" for="createdAtStart" aria-label="Created After Filter"
                    title="Created After Filter">Created After</label>
                  <VueDatePicker id="createdAtStart" v-model="createdAtStart" class="dp__theme_dark w-40" text-input format="yyyy-MM-dd"
                    @update:model-value="convertCreatedAtStartStringToDateTimeObject" :enable-time-picker="false"
                    v-bind="minMaxCreatedAtProps" :disabled="disableAll" :teleport="true" utc='preserve'/>
                </div>
                <div>
                  <label class="block text-left mb-1" for="createdAtEnd" aria-label="Created Before Filter"
                    title="Created Before Filter">Created Before</label>
                  <VueDatePicker id="createdAtEnd" v-model="createdAtEnd" class="dp__theme_dark w-40" text-input format="yyyy-MM-dd"
                    @update:model-value="convertCreatedAtEndStringToDateTimeObject" :enable-time-picker="false"
                    v-bind="minMaxCreatedAtProps" :disabled="disableAll" :teleport="true" utc='preserve'/>
                </div>
              </div>
              <div class="flex gap-2" v-show="showJobId">
                <div>
                  <label class="block text-left mb-1" for="jobIdStart" aria-label="Job ID Start Filter"
                    title="Job ID Start Filter">{{ props.jobType !== '' ? props.jobType + ' ' : '' }}Job ID Start</label>
                  <InputNumber id="jobIdStart" :class="props.jobType !== '' ? 'w-40' : 'w-24'" v-model="jobIdStart" v-bind="minMaxJobIdProps" :disabled="disableAll"/>
                </div>
                <div>
                  <label class="block text-left mb-1" for="jobIdEnd" aria-label="Job ID End Filter"
                    title="Job ID End Filter">{{ props.jobType !== '' ? props.jobType + ' ' : '' }}Job ID End</label>
                  <InputNumber id="jobIdEnd" :class="props.jobType !== '' ? 'w-40' : 'w-24'" v-model="jobIdEnd" v-bind="minMaxJobIdProps" :disabled="disableAll"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="text-right mr-[16px] whitespace-nowrap">
            <Button id="ClearFiltersButton" class="c-blue mt-[22px]" label="Clear Filters"
              @click="resetFilters();" aria-label="Clear filters" title="Clear filters" :disabled="filterInactive || disableAll">
            </Button><br />
            <Button id="RefreshJobList" class="c-blue mt-[5px]" label="Refresh List" @click="clearGageList(); refreshJobList()"
              aria-label="Refresh Job List" title="Refresh Job List" :disabled="disableAll">
            </Button>
            <div v-show="showArchived">
              <Checkbox v-model="includeArchivedJobs" inputId="ShowArchiveToggle" class="text-xs"
                aria-label="Include Archived Jobs" title="Include Archived Jobs" binary variant="filled" size="large"
                :pt="ptCheckbox" :disabled="disableAll" @change="refreshJobList(); updateGageList();">
              </Checkbox>
              <label class="cursor-pointer align-center ml-2" for="ShowArchiveToggle" aria-label="Include Archived Jobs"
                title="Include Archived Jobs">Include Archived</label>
            </div>
          </div>
        </div>
      </div>

      <div v-show="showBulkActions && totalSize > 1">
        <hr class="border-t-2 border-gray-300 my-4">
        <div class="flex gap-2">
          <div :style="`opacity: ${props.selectedJobs.length === 0 ? '50%' : '100%'}`">
            Apply bulk action to selected jobs:
          </div>
          <div>
            <Select id="selectedBulkJobAction" v-model="selectedBulkJobAction" :disabled="disableAll || props.selectedJobs.length == 0"
              :options="bulkJobActionsListDisplay" optionLabel="name" optionValue="value" @change="bulkJobAction()"
              class="user-select w-12" aria-label="Select Bulk Job Action" title="Select Bulk Job Action">
            </Select>
          </div>
          <div>
            <Button id="SelectallJobIds" class="c-blue mt-[5px]" label="Select All Jobs" @click="selectallJobIds()"
              aria-label="Select All Jobs" title="Select All Jobs" :disabled="allSelected">
            </Button>
          </div>
          <div v-if="totalPages > 1">
            <Button id="SelectvisibleJobIds" class="c-blue mt-[5px]" label="Select Visible Jobs" @click="selectvisibleJobIds()"
              aria-label="Select Visible Jobs" title="Select Visible Jobs" :disabled="visibleSelected">
            </Button>
          </div>
          <div>
            <Button id="DeselectallJobIds" class="c-blue mt-[5px]" label="Deselect All Jobs" @click="deselectallJobIds()"
              aria-label="Deselect All Jobs" title="Deselect All Jobs" :disabled="props.selectedJobs.length == 0">
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div id="MultJobOpsDlg" v-if="showMultiOps">
      <div id="MultJobOps" class="modal-overlay p-4 w-[400px] h-auto bg-[#eee] border border-black rounded-xl">
        <h2>Multiple Job Operations</h2>

        <div class="absolute right-1 top-1 font-bold text-xl pl-1 pr-1" title="Close"
          aria-label="Close"><img alt="Close" class="w-5 cursor-pointer" aria-label="Close"
            src="@/assets/styles/img/xclose.png" @click="closeMultJobsWindow()"></div>
        <hr />
        <div class="mt-3">
          There {{ selectedJobIds.length > 1 ? 'are ' : 'is ' }} {{ selectedJobIds.length }} 
          selected job{{ selectedJobIds.length > 1 ? 's' : '' }}{{ selectedJobIds.length <= 10 ? ':' : '.' }}
        </div>

        <div v-if="selectedJobIds.length <= 10">
          {{ selectedJobsText }}
        </div>

        <div>
          <div class="font-bold font-lg">Are you sure you want to<br /> {{ actionTypeDisplay }} the selected jobs?</div>
          <Button class="ngenButtonDiv mt-3" @click="actionSelect(true)" :aria-label="actionTypeDisplay + 'selected jobs'"
            :title="actionTypeDisplay + 'selected jobs'">Yes</Button>
          <Button class="ngenButtonDiv mt-3 ml-3" @click="actionSelect(false)" :aria-label="actionTypeDisplay + 'selected jobs'"
            :title="actionTypeDisplay + 'selected jobs'">Cancel</Button>       
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue';
const instance = getCurrentInstance();

import Button from "primevue/button";
import MultiSelect from 'primevue/multiselect';
import Select from "primevue/select";
import VueDatePicker from "@vuepic/vue-datepicker";
import { DateTime } from "luxon";
import { useToast } from "primevue/usetoast";
import type { ToastMessageOptions } from "primevue/toast";
const toast = useToast();

import { StatusTypes, JobStatusAction } from "@/composables/NgencerfEnums";

import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useGageStore } from "@/stores/calibration/GageStore";

const { isLoading } = storeToRefs(generalStore());
const { fetchFormulationModuleOptions } = useFormulationStore();
const { filterGroup } = storeToRefs(useFormulationStore());

const { addToastRecord } = generalStore();

const { 
  uiDomainName,
  uiGageId, 
  uiGageList, 
  modulesFilterList, 
  moduleOperator, 
  statusTypeFilterList, 
  includeArchivedJobs,
  createdAtStart,
  createdAtEnd,
  minCreatedAt,
  maxCreatedAt,
  jobIdStart,
  jobIdEnd,
  minJobId,
  maxJobId,
  selectedBulkJobAction,
  preFilterList
} = storeToRefs(useUserDataStore());

const { getDomainOptionsList } = storeToRefs(useGageStore());

const emit = defineEmits([
  "ModulesFilterDialogClosing", 
  "RefreshJobList", 
  "ResetFilters", 
  "UpdateGageList",
  "BulkJobAction", 
  "selectallJobIds",
  "selectvisibleJobIds",
  "deselectallJobIds",
  "update:currentPage",
  "update:selectedJobs"
]);

const ptCheckbox = ref({
  box: { style: { "border": "2px solid #0c5274" } },
});

/**
 * @returns {SelectOption[]}
 */
const filterGageList = computed(() => {
  let gageOptionList = <SelectOption[]>[];
  gageOptionList.push({
    name: "All",
    description: "All",
  });
  uiGageList.value.forEach((gage_id) => {
    const checkGageIndex =
      gageOptionList.findIndex(
        (gageOption) => gageOption.name === gage_id
      ) !== -1;
    if (!checkGageIndex) {
      gageOptionList.push({
        name: gage_id,
        description: gage_id,
      });
    }
  });
  return gageOptionList;
});

interface Props {
  jobType?: string;
  selectedJobs?: any[];
  allJobIds?: number[];
  visibleJobIds?: number[];
  disableAll?: boolean;
  totalSize?: number;
  totalPages?: number;
  currentPage?: number;
  showDomain?: boolean;
  showGage?: boolean;
  showStatus?: boolean;
  showModules?: boolean;
  showArchived?: boolean;
  showCreatedAt?: boolean;
  showJobId?: boolean;
  showBulkActions?: number[];
  deleteJobs?: (jobs: number[]) => Promise<any>;
  archiveJobs?: (jobs: number[], archive: boolean) => Promise<any>;
  lockJobs?: (jobs: number[], lock: boolean) => Promise<any>;
}

const props = withDefaults(defineProps<Props>(), {
  jobType: '',
  selectedJobs: () => [],
  allJobIds: () => [],
  visibleJobIds: () => [],
  disableAll: false,
  totalSize: 0,
  totalPages: 1,
  currentPage: 1,
  showDomain: true,
  showGage: true,
  showStatus: true,
  showModules: true,
  showArchived: true,
  showCreatedAt: true,
  showJobId: true,
  showBulkActions: () => [],
  deleteJobs: () => Promise.resolve(),
  archiveJobs: () => Promise.resolve(),
  lockJobs: () => Promise.resolve(),
});

const moduleOperatorList = [
  { name: 'All', display_name: "Match all selected" },
  { name: 'Any', display_name: "Match any selected" }
]
const bulkJobActionsList: { name: string, value: number }[] = [
  {name: 'select an action', value: 0, show: true},
  ...Object.keys(JobStatusAction).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: JobStatusAction[key as keyof typeof JobStatusAction]
  }))
];

const bulkJobActionsListDisplay = computed(() => {
  // if specific bulk actions are passed in based on archived/locked status of jobs in list, 
  // filter the available actions here
  if (props.showBulkActions.length > 0) {
    return bulkJobActionsList.filter(option => {
      return props.showBulkActions.includes(option.value)
    });
  }
  // otherwise, allow all bulk actions
  return bulkJobActionsList;
})

const filterInactive = computed(() => {
  return (
    (props.showDomain === false || uiDomainName.value === '' || uiDomainName.value === 'All') && 
    (props.showGage === false || uiGageId.value === '' || uiGageId.value === 'All') && 
    (props.showModules === false || modulesFilterList.value.length === 0) && 
    (props.showStatus === false || statusTypeFilterList.value === null || statusTypeFilterList.value.length === 0) &&
    (props.showArchived === false || includeArchivedJobs.value === false) &&
    (props.showCreatedAt === false || (createdAtStart.value === null && createdAtEnd.value === null)) &&
    (props.showJobId === false || (jobIdStart.value === null && jobIdEnd.value === null))
  );
});

const minMaxCreatedAtProps = computed(() => {
  // hack - setting timestamps to noon the datepicker doesn't seem to understand that it's already getting UTC dates
  const props = {};
  if (minCreatedAt.value) {
    props.minDate = new Date(minCreatedAt.value.split('T')[0] + 'T12:00:00Z');
  }
  if (maxCreatedAt.value) {
    props.maxDate = new Date(maxCreatedAt.value.split('T')[0] + 'T12:00:00Z');
  }
  return props;
});

const minMaxJobIdProps = computed(() => {
  const props = {};
  props.min = minJobId.value ?? 1;
  if (maxJobId.value) {
    props.max = maxJobId.value;
  }
  return props;
});

// Convert createdAtStart string to Date object
// VueDatePicker sets createdAtStart to a string, so we need to convert it to a Date object
const convertCreatedAtStartStringToDateTimeObject = (value: string) => {
  if (createdAtStart.value) {
    createdAtStart.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  refreshJobList();
}

// Convert createdAtEnd string to Date object
// VueDatePicker sets createdAtEnd to a string, so we need to convert it to a Date object
const convertCreatedAtEndStringToDateTimeObject = (value: string) => {
  if (createdAtEnd.value) {
    createdAtEnd.value = DateTime.fromISO(value, { zone: 'utc' });
  }
  refreshJobList();
}

watch(jobIdStart, () => {
  refreshJobList();
});
watch(jobIdEnd, () => {
  refreshJobList();
});
watch(bulkJobActionsListDisplay, () => {
  // if the display options for bulk action changes and the previously selected action is removed,
  // set the selected value back to the "select an action" placeholder
  if(!bulkJobActionsListDisplay.value.some(option => option.value === selectedBulkJobAction.value)) {
    selectedBulkJobAction.value = 0;
    document.getElementById('selectedBulkJobAction').selectedIndex = 0;
  }
});

const clearGageList = () => {
  uiGageList.value = [];
}

const refreshJobList = () => {
  // when changing any filter, reset current page to 1
  emit('update:currentPage', 1);
  emit("RefreshJobList");
}

const selectedJobs = ref<any[]>([]);
const jobIDField = computed(() => {
  if (props.selectedJobs.length > 0) {
    const firstItem = props.selectedJobs[0];
    if ('verification_run_id' in firstItem) {
      return 'verification_run_id';
    } else if ('forecast_run_id' in firstItem) {
      return 'forecast_run_id';
    } else if ('hindcast_run_id' in firstItem) {
      return 'hindcast_run_id';
    }
  }
  return 'calibration_run_id';
})

const selectallJobIds = () => {
  // select all jobs on ALL pages
  selectedJobs.value = props.allJobIds.map(
    id => ({ [jobIDField.value]: id })
  );
}

const selectvisibleJobIds = () => {
  // select all jobs on current page only
  selectedJobs.value = props.visibleJobIds.map(
    id => ({ calibration_run_id: id })
  );
}

const deselectallJobIds = () => {
  selectedJobs.value = [];
}

watch(selectedJobs, (jobs) => {
  emit('update:selectedJobs', jobs)
})

const selectedJobIds = computed(() => {
  return props.selectedJobs.map(run => run?.calibration_run_id).sort((a, b) => a - b);
})

const selectedJobsText = computed(() => {
  if (selectedJobIds.value.length === 0) return '';
  if (selectedJobIds.value.length === 1) return selectedJobIds.value[0];
  return `${selectedJobIds.value.slice(0, -1).join(', ')} and ${selectedJobIds.value[selectedJobIds.value.length - 1]}`;
})

const allSelected = computed(() => {
  if (selectedJobIds.value.length !== props.allJobIds.length) return false;
  const sorted1 = selectedJobIds.value.slice().sort((a, b) => a - b);
  const sorted2 = props.allJobIds.slice().sort((a, b) => a - b);
  return sorted1.every((val, index) => val === sorted2[index]);
})

const visibleSelected = computed(() => {
  if (selectedJobIds.value.length !== props.visibleJobIds.length) return false;
  const sorted1 = selectedJobIds.value.slice().sort((a, b) => a - b);
  const sorted2 = props.visibleJobIds.slice().sort((a, b) => a - b);
  return sorted1.every((val, index) => val === sorted2[index]);
})

const bulkJobAction = async () => {
  if (selectedBulkJobAction.value && selectedBulkJobAction.value > 0 && props.selectedJobs.length > 0) {
    showMultiOps.value = true;
    // wait a tick for the multi-job menu to display so that it only shows the confirm button
    nextTick(async () => {
      // ask the user to confirm the action - MultipleJobOperations will take care of the rest
      confirmBulkAction(selectedBulkJobAction.value);
    });
  } else {
    const tMsg: ToastMessageOptions = { severity: "error", summary: 'No Jobs Selected.', detail: 'A bulk action cannot be applied when no jobs are selected.', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

/**
 * Reset filters
 */
const resetFilters = (refresh_job_list: boolean=true) => {
  emit("ResetFilters");
  if(refresh_job_list) {
    refreshJobList();
  }
  updateGageList();
}

/**
 * Update gage list
 */
const updateGageList = () => {
  emit("UpdateGageList");
}

const showMultiOps = ref<boolean>(false);
const disableAll = computed(() => {
  return props.disableAll || showMultiOps.value;
})

const actionType = ref<number>()
const actionTypeDisplay = computed(() => {
  for (const key in JobStatusAction) {
    if (JobStatusAction[key] === actionType.value) {
      return key;
    }
  }
})

const confirmBulkAction = (action: number) => {
  actionType.value = action;
}

const actionSelect = (action: boolean) => {
  if(action && actionType.value) {
   changeSelectedJobStatus(actionType.value);
  }
  closeMultJobsWindow();
}

const confirmAction = useConfirm();
const changeSelectedJobStatus = (jobStatusAction: number) => {
  let ty = "";
  let label = "";
  if (jobStatusAction === JobStatusAction.delete) {
    ty = "Delete"
    label = "DELETE"
  } else if (jobStatusAction === JobStatusAction.archive) {
    ty = "Archive"
    label = "ARCHIVE"
  } else if (jobStatusAction === JobStatusAction.unarchive) {
    ty = "Unarchive (restore)"
    label = "Unarchive (restore)"
  } else if (jobStatusAction === JobStatusAction.lock) {
    ty = "Lock"
    label = "LOCK"
  } else if (jobStatusAction === JobStatusAction.unlock) {
    ty = "Unlock"
    label = "Unlock"
  }

  if (selectedJobIds.value.length === 0) return;

  // for lock and unlock, no need to confirm, just do it
  if (jobStatusAction === JobStatusAction.lock) {
    acceptLock(true);
  }
  else if (jobStatusAction === JobStatusAction.unlock) {
    acceptLock(false);
  }
  else {
    let confirmMessage = "Are you sure you want to " + ty.toLowerCase() + " "
    if (selectedJobIds.value.length > 10) {
      confirmMessage += "the " + selectedJobIds.value.length + " selected calibration runs?";
    } else if (selectedJobIds.value.length > 1) {
      confirmMessage += "calibration runs " + selectedJobsText.value + "?";
    } else {
      const selectedRunName = (props.selectedJobs[0].job_name) ? " titled '" + props.selectedJobs[0].job_name + "'" : " (untitled)";
      confirmMessage += "calibration run " + selectedJobIds.value[0] + selectedRunName + "?";
      if (props.selectedJobs[0].status === "Running") confirmMessage += " The running calibration will be aborted."
    }

    confirmAction.require({
      message: confirmMessage,
      header: 'Confirm ' + ty,
      icon: 'pi pi-exclamation-triangle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptProps: {
        label: label
      },
      accept: () => {
        if (jobStatusAction === JobStatusAction.delete) {
          acceptDelete();
        }
        else if (jobStatusAction === JobStatusAction.archive) {
          acceptArchive(true);
        }
        else if (jobStatusAction === JobStatusAction.unarchive) {
          acceptArchive(false);
        }
      },
      reject: () => {
        document.getElementById('selectedBulkJobAction').selectedIndex = 0;
      }
    })
  }
}

/**
 * Accept the deletion of one or more jobs
 */
const acceptDelete = () => {
  isLoading.value = true;
  // keep track of whether we're deleting the entire list
  let deleteAllJobs = allSelected.value;
  props.deleteJobs(selectedJobIds.value).then(async (response) => {
    if (response.status === 200) {
      toast.removeAllGroups();
      response._data?.summaries.forEach(summary => {
        const tMsg: ToastMessageOptions = { severity: summary.message_type, 
          summary: 'Delete Job' + (selectedJobIds.value.length > 1 ? 's' : ''), 
          detail: summary.message, 
          life: 
            summary.message_type === 'error' ? ToastTimeout.timeoutError :
            summary.message_type === 'warn' ? ToastTimeout.timeoutWarn :
            ToastTimeout.timeoutSuccess
        };
        toast.add(tMsg); addToastRecord(tMsg);
      })
      if (deleteAllJobs) {
        // if we just deleted the entire list, clear filters and inform the user
        resetFilters();
        const tMsg: ToastMessageOptions = { 
          severity: "info", 
          summary: 'All Jobs Deleted', 
          detail: 'All jobs in your filtered list were deleted. Resetting filters to show your remaining jobs.', 
          life: ToastTimeout.timeoutInfo 
        };
        toast.add(tMsg); addToastRecord(tMsg);
      } else {
        refreshJobList();
      }
      isLoading.value = false;
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Jobs Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
      isLoading.value = false;
    }
  });
  selectedJobs.value = [];
  selectedBulkJobAction.value = 0;
}

/**
 * Accept archiving of one or more jobs
 */
const acceptArchive = (archiveJobs: boolean) => {
  isLoading.value = true;
  // keep track of whether we're archiving the entire list
  let archiveAllJobs = allSelected.value && archiveJobs;
  props.archiveJobs(selectedJobIds.value, archiveJobs).then(async (response) => {
    if (response.status === 200) {
      toast.removeAllGroups();
      response._data?.summaries.forEach(summary => {
        const tMsg: ToastMessageOptions = { severity: summary.message_type, 
          summary: (archiveJobs ? 'Archive' : 'Un-Archive') + ' Job' + (selectedJobIds.value.length > 1 ? 's' : ''), 
          detail: summary.message, 
          life: 
            summary.message_type === 'error' ? ToastTimeout.timeoutError :
            summary.message_type === 'warn' ? ToastTimeout.timeoutWarn :
            ToastTimeout.timeoutSuccess
        };
        toast.add(tMsg); addToastRecord(tMsg);
      })
      if (archiveAllJobs && !includeArchivedJobs.value) 
      {
        // if we just archived the entire list and we're not showing archived jobs, inform the user
        const tMsg: ToastMessageOptions = { 
          severity: "info", 
          summary: 'All Jobs Archived', 
          detail: 'All jobs in your filtered list were archived. Click "Include Archived" to see them.', 
          life: ToastTimeout.timeoutInfo 
        };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      refreshJobList();
      isLoading.value = false;
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: (archiveJobs ? 'Archive' : 'Un-Archive') + ' Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
      isLoading.value = false;
    }
  });
  selectedJobs.value = [];
  selectedBulkJobAction.value = 0;
}


/**
 * Accept locking of one or more jobs
 */
const acceptLock = (lockJobs: boolean) => {
  props.lockJobs(selectedJobIds.value, lockJobs).then(async (response) => {
    if (response.status === 200) {
      toast.removeAllGroups();
      response._data?.summaries.forEach(summary => {
        const tMsg: ToastMessageOptions = { severity: summary.message_type, 
          summary: (lockJobs ? 'Lock' : 'Unlock') + ' Job' + (selectedJobIds.value.length > 1 ? 's' : ''), 
          detail: summary.message,  
          life: 
            summary.message_type === 'error' ? ToastTimeout.timeoutError :
            summary.message_type === 'warn' ? ToastTimeout.timeoutWarn :
            ToastTimeout.timeoutSuccess
        };
        toast.add(tMsg); addToastRecord(tMsg);
      })
      refreshJobList();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: (lockJobs ? 'Lock' : 'Unlock') + ' Calibration Job Failed.', detail: message, life: useApiResponseToastSeverityLife(response?.status) };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedJobs.value = [];
  selectedBulkJobAction.value = 0;
}

/**
 * Close Mult Jobs Window
 * 
 */
const closeMultJobsWindow = () => {
  selectedJobs.value = [];
  showMultiOps.value = false;
  selectedBulkJobAction.value = 0;
};


defineExpose({ 
  selectallJobIds,
  selectvisibleJobIds,
  deselectallJobIds,
  selectedJobIds,
  selectedJobsText,
  bulkJobAction,
  resetFilters,
  confirmBulkAction,
  changeSelectedJobStatus
});

onMounted(() => {
  resetFilters(false);
  if (preFilterList.value) {
    Object.keys(preFilterList.value).forEach(key => {
      switch(key) {
        case 'status':
          statusTypeFilterList.value = [preFilterList.value[key]];
          break;
        // other pre-filter cases can be added here as necessary
      }
    });
    nextTick(async () => {
      refreshJobList();
      preFilterList.value = {};
    });
  }
})

onUnmounted(() => {
  resetFilters(false);
  clearGageList();
})

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#Header {
  background-color: global.$ngwcp_primary3;
}

#JobFilterDialog {
  background-color: white;
  padding-bottom: 5px;
}

#ModuleList,
#StatusList {
  border: 1px solid #888888;
}

.c-blue {
  text-decoration: underline;
  color: blue;
  font-weight: normal !important;
}

.c-blue:hover {
  color: blue !important;
  background-color: transparent;
  font-weight: bold;
  border: none;
}

.c-blue:disabled {
  color: #555 !important;
}

label {
  cursor: default;
}

#MultJobOpsDlg {
  position: fixed;
  top: 33%;
  z-index: 10;
  left: 40%;
}
</style>