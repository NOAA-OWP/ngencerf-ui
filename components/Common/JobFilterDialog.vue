<template>
  <div id="JobFilterDialog" ref="draggableDiv" class="mb-2 top-[20%] left-[30%] absolute z-100 w-[505px] h-[454px]"
    :class="isDragging ? 'cursor-move' : ''">

    <div id="Header" class="mb-2">
      <div class="grid grid-cols-12 boxed">
        <div class="col-span-11">
          <div class="mb-2 pt-1 ml-3 font-bold text-sm text-white cursor-[grabbing] ">Calibration Job Filters</div>
        </div>
        <div id="CloseX" class="col-span-1 font-bold text-lg text-white text-center w-full cursor-pointer"
          @click="sendClose($event)"> X </div>
      </div>
    </div>

    <div id="FilterDialog" class="px-5 py-0">
      <div class="grid grid-cols-10 gap-2">
        <div class="col-span-4">
          <div class="mb-2">
            <label class="text-center" for="HeadwaterBasinGage">Headwater Basin Gage</label><br>
            <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter text-center" v-model="uiGageId"
              :options="calibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
              aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select">
            </Select>
          </div>
          <label for="StatusList">Status</label><br>
          <Listbox id="StatusList" v-model="statusTypeFilterList" :options="StatusTypes" optionLabel="status"
            optionValue="filterValue" multiple>
            <template #option="slotProps">
              <div v-bind:class="(slotProps.option.selected === true) ? 'font-bold' : ''">
                <div class="font-ui leading-none" :aria-label="slotProps.option.filterValue"
                  :title="slotProps.option.filterValue">
                  {{ slotProps.option.filterValue }}</div>
              </div>
            </template>
          </Listbox>
        </div>

        <div class="col-span-6">
          <div>
            <label for="ModuleList" class="ml-[100px]">Modules</label>
            <Listbox id="ModuleList" v-model="modulesFilterList" :options="fetchFormulationModuleOptions" multiple
              optionLabel="name" optionValue="name" class="h-60">
              <template #option="slotProps">
                <div v-bind:class="(slotProps.option.selected === true) ? 'pi pi-check font-bold' : ''">
                  <div class="font-ui pl-2 leading-none" :aria-label="slotProps.option.name"
                    :title="slotProps.option.name">
                    {{ slotProps.option.name }}</div>
                </div>
              </template>
            </Listbox>
          </div>
          <div id="ButtonArea" class="flex mt-3 ml-[24px]">
            <Button class="ngenButtonDiv" label="Clear" @click="resetFilters($event)" aria-label="Clear filters"
              title="Clear filters">
            </Button>
            <Button class="ngenButtonDiv ml-6" label="Apply" @click="sendApply($event)" aria-label="Apply and close"
              title="Apply"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Listbox from "primevue/listbox";
import Button from "primevue/button";

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

      // Setup for window isDragging
      if (draggableDiv.value) {
        draggableDiv.value.addEventListener('mousedown', (e: MouseEvent) => {
          const target = e.target as HTMLElement | null;
          if (target && target.closest("#Header") !== null && target.id !== "CloseX") {
            isDragging.value = true;
            offsetX = e.clientX - draggableDiv.value!.offsetLeft;
            offsetY = e.clientY - draggableDiv.value!.offsetTop;
          }
        });

        document.addEventListener('mousemove', (e: MouseEvent) => {
          if (!isDragging.value) return;
          if (draggableDiv.value) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            // Keep div within window bounds, but allow it to be some of it off the screen
            const maxX = window.innerWidth - draggableDiv.value.offsetWidth + (draggableDiv.value.offsetWidth);
            const maxY = window.innerHeight - draggableDiv.value.offsetHeight + (draggableDiv.value.offsetHeight);
            draggableDiv.value.style.left = Math.min(Math.max(-300, newX), maxX) + 'px';
            draggableDiv.value.style.top = Math.min(Math.max(0, newY), maxY - 50) + 'px';
          }
        });

        document.addEventListener('mouseup', () => {
          isDragging.value = false;
        });
      }
    }, 250) // Necessary to make sure that data has been retreived.
  });
})

/** Let the caller close the dialog
 * @param: MouseEvent
 */
const sendClose = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  emit("ModulesFilterDialogClosing");
};

/**
 * Let the caller APPLLY the dialog
 * @param: MouseEvent
 */
const sendApply = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  emit("ApplyJobFilters");
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
  border: 2px solid #666666;
}


#ModuleList,
#StatusList {
  border: 1px solid #888888;
}

</style>
