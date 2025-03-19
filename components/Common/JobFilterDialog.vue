<template>
  <div id="JobFilterDialog" class="mb-2 mt-4">

    <div id="FilterDialog">

      <div class="grid grid-cols-12 gap-6 text-sx">
        <div class="col-span-2">
          <label class="block text-left" for="HeadwaterBasinGage" aria-label="Headwater Basin Gage"
            title="Headwater Basin Gage">Headwater Basin Gage</label>
          <Select id="HeadwaterBasinGage" class="mt-2 basin-gage-filter text-left" v-model="uiGageId"
            :options="calibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
            aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select">
          </Select>
        </div>

        <div class="col-span-2">
          <label class="block text-left mb-1" for="StatusList" aria-label="Status Filter"
            title="Status Filter">Status</label>
          <MultiSelect id="StatusList" v-model="statusTypeFilterList" :options="StatusTypes" optionLabel="status"
            optionValue="filterValue" :maxSelectedLabels="3" class="w-full" aria-label="Status Filter"
            title="Status Filter">
            <template #header>
              <div class="absolute cursor-pointer top-2 left-[48px]">&nbsp; Select All Items</div>
            </template>Headw
            <template #option="slotProps">
              <div class="font-ui leading-none" :aria-label="slotProps.option.filterValue"
                :title="slotProps.option.filterValue">
                {{ slotProps.option.filterValue }}
              </div>
            </template>
          </MultiSelect>
        </div>

        <div class="col-span-2">
          <div>
            <label for="ModuleList" class="block text-left mb-1" aria-label="Module Filter"
              title="Module Filter">Modules</label>
            <MultiSelect id="ModuleList" v-model="modulesFilterList" :options="fetchFormulationModuleOptions"
              optionLabel="name" optionValue="name" :maxSelectedLabels="3" class="w-full" aria-label="Module Filter"
              title="Module Filter">
              <template #header>
                <div class="absolute cursor-pointer top-2 left-[58px]">&nbsp; Select All Items</div>
              </template>
              <template #option="slotProps">
                <div class="font-ui pl-2 leading-none" :aria-label="slotProps.option.name"
                  :title="slotProps.option.name">
                  {{ slotProps.option.name }}&nbsp;
                </div>
              </template>
            </MultiSelect>
          </div>
        </div>

        <div class="col-span-4 mt-8">
          <Button class="ngenButtonDiv text-xs ml-[0.5rem] " label="Apply" @click="sendApply($event)"
            aria-label="Apply and close" title="Apply and close">
          </Button>
          <Button id="CleareFiltersButton" class="ml-[3.5rem] text-lg" label="Clear Filters"
            @click="resetFilters($event)" aria-label="Clear filters" title="Clear filters" :disabled="filterActive">
          </Button>
        </div>

        <div class="col-span-2">
          <Checkbox v-model="includeArchivedJobs" inputId="ShowArchiveToggle" class="text-xs mt-[48px]"
            aria-label="Include Archived Jobs" title="Include Archived Jobs" binary variant="filled" size="large"
            @change="archivedJobsToggle()" :pt="ptCheckbox">
          </Checkbox>
          <label class="pl-4 cursor-pointer" for="ShowArchiveToggle" aria-label="Include Archived Jobs"
            title="Include Archived Jobs">Include Archived</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import MultiSelect from 'primevue/multiselect';
import Select from "primevue/select";


import type { CalibrationJobListItem } from "@/composables/NextGenModel"
import { StatusTypes } from "@/composables/NextgenEnums";

import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";

const {fetchUserCalibrationJobsListData} = useUserDataStore()

const { fetchFormulationModuleOptions } = useFormulationStore();

const userStore = useUserDataStore();
const { uiGageId, calibrationRunGageList, modulesFilterList, statusTypeFilterList, includeArchivedJobs } = storeToRefs(userStore);

const emit = defineEmits(["ModulesFilterDialogClosing", "ApplyJobFilters"]);

const draggableDiv = ref<HTMLDivElement | null>(null);
const isDragging = ref<boolean>(false);
let offsetX = 0;
let offsetY = 0;


const ptCheckbox = ref({
  box: { style: { "border": "2px solid #0c5274" } },
});

const props = defineProps<{
  calJobs: CalibrationJobListItem[];
}>();

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      externalResetFilters();
    }, 250) // Necessary to make sure that data has been retreived.
  });
})

const filterActive = computed(() => {
  return (modulesFilterList.value.length === 0 && (statusTypeFilterList.value === null || statusTypeFilterList.value.length === 0) && uiGageId.value === 'All')
});


/** Let the caller close the dialog
 * @param: MouseEvent
 */
const sendClose = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
};

/**
 * Let the caller APPLLY the dialog
 * @param: MouseEvent
 */
const sendApply = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  emit("ApplyJobFilters");
  sendClose(e);
};

/**
 * Define a method to be called by the parent
 * to reset the filters
 */
const externalResetFilters = () => {
  const mouseEvent = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': true,
  });
  resetFilters(mouseEvent);
};

// Expose the method to the parent
defineExpose({
  externalResetFilters
});

/**
 * Update the job list when applyJobFilters changes
 */;
const archivedJobsToggle = async () => {
  await fetchUserCalibrationJobsListData()
  emit("ApplyJobFilters");
}

/**
 * Reset filters
 */
const resetFilters = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  uiGageId.value = 'All';
  modulesFilterList.value = [];
  statusTypeFilterList.value = [];
  emit("ApplyJobFilters");
}

// Template for the "Archived" column (Yes/No display)
const archivedTemplate = (rowData: any) => {
  return rowData.archived ? 'Yes' : 'No';
};


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

#CleareFiltersButton {
  color: blue;
  text-decoration: underline;
  font-weight: normal;
}

#CleareFiltersButton:hover {
  background-color: transparent;
  border: none;
  font-weight: bold;
}

#CleareFiltersButton:disabled {
  color: #555;
}

label {
  cursor:default;
}
</style>
