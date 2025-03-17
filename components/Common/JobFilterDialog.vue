<template>
  <div id="JobFilterDialog" class="mb-2 mt-4">

    <div id="FilterDialog">

      <div class="grid grid-cols-12 gap-2 text-sx">
        <div class="col-span-3">
          <label class="block text-left" for="HeadwaterBasinGage">Headwater Basin Gage</label>
          <Select id="HeadwaterBasinGage" class="mt-2 basin-gage-filter" v-model="uiGageId"
            :options="calibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
            aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select">
          </Select>
        </div>

        <div class="col-span-3">
          <label class="block text-left mb-1" for="StatusList">Status</label>
          <MultiSelect id="StatusList" v-model="statusTypeFilterList" :options="StatusTypes" optionLabel="status"
            optionValue="filterValue" :maxSelectedLabels="3" showClear class="w-full">
            <template #header>
              <div class="absolute cursor-pointer top-3 left-10">&nbsp; Select All Items</div>
            </template>
            <template #option="slotProps">
              <div class="font-ui leading-none" :aria-label="slotProps.option.filterValue"
                :title="slotProps.option.filterValue">
                {{ slotProps.option.filterValue }}
              </div>
            </template>
          </MultiSelect>
        </div>

        <div class="col-span-3">
          <div>
            <label for="ModuleList" class="block text-left mb-1">Modules</label>
            <MultiSelect id="ModuleList" v-model="modulesFilterList" :options="fetchFormulationModuleOptions"
              optionLabel="name" optionValue="name" :maxSelectedLabels="3" showClear class="w-full">
              <template #header>
                <div class="absolute cursor-pointer top-3 left-10">&nbsp; Select All Items</div>
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

        <div class="col-span-3 mt-8 mr-3">
          <Button class="ngenButtonDiv text-xs" label="Apply" @click="sendApply($event)" aria-label="Apply and close"
            title="Apply and close">
          </Button>
          <Button class="ngenButtonDiv ml-6 text-xs" label="Clear" @click="resetFilters($event)"
            aria-label="Clear filters" title="Clear filters">
          </Button>
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

import { useFormulationStore } from "~/stores/calibration/FormulationStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";

const { fetchFormulationModuleOptions } = useFormulationStore();

const userStore = useUserDataStore();
const { uiGageId, calibrationRunGageList, modulesFilterList, statusTypeFilterList } = storeToRefs(userStore);

const emit = defineEmits(["ModulesFilterDialogClosing", "ApplyJobFilters"]);

const showArchivedJobsOnly = ref<boolean>(false);

const draggableDiv = ref<HTMLDivElement | null>(null);
const isDragging = ref<boolean>(false);
let offsetX = 0;
let offsetY = 0;

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

/** Let the caller close the dialog
 * @param: MouseEvent
 */
const sendClose = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  // emit("ModulesFilterDialogClosing");
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

#CloseX:hover {
  color: global.$ngwcp_primary2;
}

#ModuleList,
#StatusList {
  border: 1px solid #888888;
}

</style>
