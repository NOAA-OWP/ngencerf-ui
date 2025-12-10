<template>
  <div id="JobFilterDialog" class="JobsFilterBox mb-2 mt-4">

    <div id="FilterDialog">

      <div class="grid grid-cols-6 gap-2 text-sx">
        <div class="col-span-5">
          <div class="flex flex-wrap gap-2">
            <div v-show="showGage" class="whitespace-nowrap">
              <label class="block text-left w-[90%]" for="HeadwaterBasinGage" aria-label="Headwater Basin Gage"
                title="Headwater Basin Gage">Headwater Basin Gage</label>
              <Select id="HeadwaterBasinGage" class="mt-1 basin-gage-filter text-left w-40" v-model="uiGageId"
                :options="calibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
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
              <label for="ModuleList" class="block text-left mb-1" aria-label="Module Filter"
                title="Module Filter">Modules</label>
              <div class="flex gap-2 w-70">
                <div>
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
                <div>
                  <Select id="ModuleOperator" v-model="moduleOperator" :options="moduleOperatorList" optionLabel="name"
                    optionValue="name" class="user-select w-12" @change="refreshJobList()"
                    v-show="modulesFilterList.length > 1" aria-label="Module Operator" title="Module Operator">
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
                    v-bind="minMaxCreatedAtProps" :teleport="true" utc='preserve'/>
                </div>
                <div>
                  <label class="block text-left mb-1" for="createdAtEnd" aria-label="Created Before Filter"
                    title="Created Before Filter">Created Before</label>
                  <VueDatePicker id="createdAtEnd" v-model="createdAtEnd" class="dp__theme_dark w-40" text-input format="yyyy-MM-dd"
                    @update:model-value="convertCreatedAtEndStringToDateTimeObject" :enable-time-picker="false"
                    v-bind="minMaxCreatedAtProps" :teleport="true" utc='preserve'/>
                </div>
              </div>
              <div class="flex gap-2" v-show="showJobId">
                <div>
                  <label class="block text-left mb-1" for="jobIdStart" aria-label="Job ID Start Filter"
                    title="Job ID Start Filter">Job ID Start</label>
                  <InputNumber id="jobIdStart" class="w-24" v-model="jobIdStart" v-bind="minMaxJobIdProps"/>
                </div>
                <div>
                  <label class="block text-left mb-1" for="jobIdEnd" aria-label="Job ID End Filter"
                    title="Job ID End Filter">Job ID End</label>
                  <InputNumber id="jobIdEnd" class="w-24" v-model="jobIdEnd" v-bind="minMaxJobIdProps"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="text-right mr-[16px] whitespace-nowrap">
            <Button id="ClearFiltersButton" class="c-blue mt-[22px]" label="Clear Filters"
              @click="resetFilters()" aria-label="Clear filters" title="Clear filters" :disabled="filterInactive">
            </Button><br />
            <Button id="RefreshJobList" class="c-blue mt-[5px]" label="Refresh List" @click="clearGageList(); refreshJobList()"
              aria-label="Refresh Job List" title="Refresh Job List" :disabled="disableAll">
            </Button>
            <div v-show="showArchived">
              <Checkbox v-model="includeArchivedJobs" inputId="ShowArchiveToggle" class="text-xs"
                aria-label="Include Archived Jobs" title="Include Archived Jobs" binary variant="filled" size="large"
                :pt="ptCheckbox" :disabled="disableAll" @change="refreshJobList()">
              </Checkbox>
              <label class="cursor-pointer align-center ml-2" for="ShowArchiveToggle" aria-label="Include Archived Jobs"
                title="Include Archived Jobs">Include Archived</label>
            </div>
          </div>
        </div>
      </div>

      <div v-show="showBulkJobAction && totalSize > 1 && !filterInactive">
        <hr class="border-t-2 border-gray-300 my-4">
        <div class="flex gap-2">
          <div>
            Apply bulk action to filtered jobs:
          </div>
          <div>
            <Select id="selectedBulkJobAction" v-model="selectedBulkJobAction" :disabled="disableAll"
              :options="bulkJobActionsListDisplay" optionLabel="name" optionValue="value" 
              class="user-select w-12" aria-label="Select Bulk Job Action" title="Select Bulk Job Action">
            </Select>
          </div>
          <div v-show="totalPages > 1">
            <Select id="selectedBulkJobActionScope" v-model="selectedBulkJobActionScope" :disabled="disableAll"
              :options="bulkJobActionScopeList" optionLabel="name" optionValue="value" 
              class="user-select w-12" aria-label="Select This Page or All Pages" title="Select This Page or All Pages">
            </Select>
          </div>
          <div>
            <Button v-if="selectedBulkJobAction" class="ngenButtonDiv ml-8" @click="bulkJobAction()" :disabled="disableAll"
              aria-label="Apply Bulk Action" title="Apply Bulk Action">Apply Bulk Action</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, defineExpose } from 'vue';
const instance = getCurrentInstance();

import Button from "primevue/button";
import MultiSelect from 'primevue/multiselect';
import Select from "primevue/select";
import VueDatePicker from "@vuepic/vue-datepicker";
import { DateTime } from "luxon";

import { StatusTypes, JobStatusAction } from "@/composables/NgencerfEnums";

import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";

const { fetchFormulationModuleOptions } = useFormulationStore();

const { 
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
  selectedBulkJobActionScope
} = storeToRefs(useUserDataStore());

const emit = defineEmits(["ModulesFilterDialogClosing", "RefreshJobList", "BulkJobAction","update:currentPage"]);

const ptCheckbox = ref({
  box: { style: { "border": "2px solid #0c5274" } },
});

/**
 * @returns {SelectOption[]}
 */
const calibrationRunGageList = computed(() => {
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
  disableAll?: boolean;
  totalSize?: number;
  totalPages?: number;
  currentPage?: number;
  showGage?: boolean;
  showStatus?: boolean;
  showModules?: boolean;
  showArchived?: boolean;
  showCreatedAt?: boolean;
  showJobId?: boolean;
  showBulkActions?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  disableAll: true,
  totalSize: 0,
  totalPages: 1,
  currentPage: 1,
  showGage: true,
  showStatus: true,
  showModules: true,
  showArchived: true,
  showCreatedAt: true,
  showJobId: true,
  showBulkActions: () => [],
});

const moduleOperatorList = [
  { name: "All" },
  { name: "Any" }
]
const bulkJobActionsList: { name: string, value: number }[] = [
  {name: 'select an action', value: 0, show: true},
  ...Object.keys(JobStatusAction).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: JobStatusAction[key as keyof typeof JobStatusAction]
  }))
];
const bulkJobActionScopeList = [
  { name: "this page only", value: false },
  { name: "all pages", value: true }
]
const showBulkJobAction = ref<boolean>(false);

const bulkJobActionsListDisplay = computed(() => {
  // if specific bulk actions are passed in based on archived/locked status of jobs in list, 
  // AND we're only applying a bulk action to a single page (selectedBulkJobActionScope = false), 
  // filter the available actions here
  if (props.showBulkActions.length > 0 && !selectedBulkJobActionScope.value) {
    return bulkJobActionsList.filter(option => {
      return props.showBulkActions.includes(option.value)
    });
  }
  // otherwise, allow all bulk actions
  return bulkJobActionsList;
})

const filterInactive = computed(() => {
  return (
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
  console.log('props:',props);
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

const bulkJobAction = () => {
  if (selectedBulkJobAction.value && selectedBulkJobAction.value > 0) {
    emit("BulkJobAction");
  }
}

/**
 * Reset filters
 */
const resetFilters = () => {
  uiGageId.value = 'All';
  modulesFilterList.value = []; 
  moduleOperator.value = 'All';
  statusTypeFilterList.value = [];
  includeArchivedJobs.value = false;
  createdAtStart.value = null;
  createdAtEnd.value = null;
  minCreatedAt.value = null;
  maxCreatedAt.value = null;
  jobIdStart.value = null;
  jobIdEnd.value = null;
  minJobId.value = null;
  maxJobId.value = null;
  selectedBulkJobAction.value = 0;
  selectedBulkJobActionScope.value = false;
  refreshJobList();
}

defineExpose({ resetFilters });

onMounted(() => {
  if (instance?.vnode?.props?.onBulkJobAction) {
    showBulkJobAction.value = true;
  }
})

onUnmounted(() => {
  resetFilters();
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
</style>
