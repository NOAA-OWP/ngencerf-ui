<template>
  <div id="JobFilterDialog" ref="draggableDiv" :class="isDragging ? 'cursor-move' : ''">
    <div id="Header" class="w-full h-8 mb-2">
      <div class="grid grid-cols-2">
        <div class="col-span-1">
          <div class="mb-2 pt-1 ml-3 font-bold text-base text-white">Calibration Job Filters</div>
        </div>
        <div class="col-span-1">
          <!-- <div class="mr-5 mt-[3px] nomove text-right">
            <ToggleSwitch v-model="autoEffect"></ToggleSwitch>&nbsp; <div
              class="text-white text-bold inline-block">Auto Change</div>
          </div> -->
        </div>
      </div>
    </div>
    <div id="FilterDialog">
      <div class="grid grid-cols-3 gap-2">
        <div class="col-span-1">
          <div class="nomove">
            <label class="text-center nomove" for="HeadwaterBasinGage">Headwater Basin Gage</label><br>
            <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter text-center nomove" v-model="uiGageId"
              :options="calibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
              aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select">
            </Select>
          </div>
          <div class="mt-5 nomove">
            From:
            <VueDatePicker id="CalDateStart" class="datePickers dp__theme_dark nomove" v-model="calDateStart"
              time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00" :disabled="!useDateRange"
              @update:model-value="handleCalDateStart" aria-label="aria-label" title="title" />
          </div>
          <div class="nomove">
            To:
            <VueDatePicker id="CalDateEnd" class="datePickers dp__theme_dark nomove" v-model="calDateEnd"
              time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00" :disabled="!useDateRange"
              @update:model-value="handleCalDateEnd" aria-label="aria-label" title="title" />
          </div>
          <div class="mt-3 nomove">
            <Checkbox class="nomove" v-model="useDateRange" inputId="daterange" name="daterange" binary></Checkbox>
            Enable From/To Filter
          </div>
        </div>

        <div class="col-span-1 text-left ml-6">
          <div class="nomove">
            <label class="nomove" for="StatusList">Status</label><br>
            <Listbox id="StatusList" v-model="statusTypeFilterList" :options="StatusTypes" optionLabel="status"
              optionValue="filterValue" multiple class="nomove">
              <template #option="slotProps">
                <div v-bind:class="(slotProps.option.selected === true) ? 'pi pi-check font-bold' : 'pl-2'">
                  <div class="font-ui leading-none nomove" :aria-label="slotProps.option.filterValue"
                    :title="slotProps.option.filterValue">
                    {{ slotProps.option.filterValue }}</div>
                </div>
              </template>
            </Listbox>
          </div>
        </div>

        <div class="col-span-1">
          <div class="nomove">
            <label for="ModuleList" class="text-center nomove">Modules</label>
            <Listbox id="ModuleList" v-model="modulesFilterList" :options="fetchFormulationModuleOptions" multiple
              optionLabel="name" optionValue="name" class="h-60 nomove">
              <template #option="slotProps">
                <div class="nomove"
                  v-bind:class="(slotProps.option.selected === true) ? 'pi pi-check font-bold' : 'pl-2'">
                  <div class="font-ui pl-2 leading-none nomove" :aria-label="slotProps.option.name"
                    :title="slotProps.option.name">
                    {{ slotProps.option.name }}</div>
                </div>
              </template>
            </Listbox>
          </div>
        </div>
      </div>

      <div id="ButtonArea" class="flex justify-end gap-5 nomove">
        <Button class="ngenButtonDiv nomove" label="Reset" @click="resetFilters($event)" :disabled="enableReset">
        </Button>
        <Button class="ngenButtonDiv nomove" label="Close" @click="sendClose($event)"></Button>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import Listbox from "primevue/listbox";
import Button from "primevue/button";
import VueDatePicker from "@vuepic/vue-datepicker";
import { DateTime } from "luxon";
import Checkbox from 'primevue/checkbox';
import ToggleSwitch from 'primevue/toggleswitch';

import type { CalibrationJobListItem } from "@/composables/NextGenModel"
import { findEarliestAndLatest } from "@/utils/CommonHelpers";
import { StatusTypes } from "@/composables/NextgenEnums";

import { useFormulationStore } from "~/stores/calibration/FormulationStore";
const { fetchFormulationModuleOptions } = useFormulationStore();

import { useUserDataStore } from "~/stores/common/UserDataStore";
const userStore = useUserDataStore();
const { uiGageId, calibrationRunGageList, modulesFilterList, statusTypeFilterList,
  calDateStart, calDateEnd, earliestTime, latestTime, useDateRange } = storeToRefs(useUserDataStore());

const emit = defineEmits(["ModulesFilterDialogClosing"]);

const autoEffect = ref<boolean>(false);

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
      if (draggableDiv.value) {
        draggableDiv.value.addEventListener('mousedown', (e: MouseEvent) => {
          if (e && e.target) {
            if ((e.target as HTMLElement).classList.contains('nomove')) {
              return;
            }
          }
          isDragging.value = true;
          offsetX = e.clientX - draggableDiv.value!.offsetLeft;
          offsetY = e.clientY - draggableDiv.value!.offsetTop;
        });

        document.addEventListener('mousemove', (e: MouseEvent) => {
          if (!isDragging.value) return;
          if (draggableDiv.value) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // Keep div within window bounds
            const maxX = window.innerWidth - draggableDiv.value.offsetWidth + (draggableDiv.value.offsetWidth / 2);
            const maxY = window.innerHeight - draggableDiv.value.offsetHeight + (draggableDiv.value.offsetHeight / 2);

            draggableDiv.value.style.left = Math.min(Math.max(0, newX), maxX) + 'px';
            draggableDiv.value.style.top = Math.min(Math.max(0, newY), maxY) + 'px';
          }
        });

        document.addEventListener('mouseup', () => {
          isDragging.value = false;
        });
      }
      findEarliestAndLatest(props.calJobs);
      if (props.calJobs) {
        const trange = findEarliestAndLatest(props.calJobs);
        if (trange) {
          earliestTime.value = calDateStart.value = trange.earliest;
          latestTime.value = calDateEnd.value = trange.latest;
        }
      }

    }, 0)
  });
})

const sendClose = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  emit("ModulesFilterDialogClosing");
};

const resetFilters = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  uiGageId.value = 'All';
  modulesFilterList.value = [];
  statusTypeFilterList.value = [];
  nextTick(() => {
    findEarliestAndLatest(props.calJobs);
  })
}

const enableReset = computed(() => {
  return false;
  // return (uiGageId.value !== 'All' || modulesFilterList.value.length > 0
  //      || statusTypeFilterList.value.length > 0 || useDateRange.value === false) === true;
})

// Template for the "Archived" column (Yes/No display)
const archivedTemplate = (rowData: any) => {
  return rowData.archived ? 'Yes' : 'No';
};


/**
 * Save filter start date
 * @param e 
 */
const handleCalDateStart = (value: any) => {
  if (typeof value === 'string') {
    calDateStart.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};
/**
 * Save filter end date
 * @param e 
 */
const handleCalDateEnd = (value: any) => {
  if (typeof value === 'string') {
    calDateEnd.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};


</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#ModuleList,
#StatusList {
  .p-listbox {
    border-radius: 0px;
  }

  .p-listbox-list {
    padding: 0px !important;
  }

  .p-listbox-list-container {
    margin-top: 7px;
  }

  .p-listbox-option-selected {
    background-color: global.$ngwcp_green_lt !important;
  }

  --p-listbox-option-padding,
  .p-listbox-option {
    padding: 0 !important;
  }
}

#Header {
  background-color: global.$ngwcp_primary3;
}

#JobFilterDialog {
  width: 750px;
  height: 435px;
  position: absolute;
  top: 20%;
  left: 30%;
  background-color: white;
  border: 2px solid #666666;
  z-index: 99;
}

#FilterDialog {
  padding: 0 15px;
}

.p-listbox {
  border-radius: 0px;
}

.p-listbox-list {
  padding: 0px !important;
}

.p-listbox-list-container {
  margin-top: 7px;
}

.p-listbox-option-selected {
  background-color: global.$ngwcp_green_lt !important;
}

.p-listbox-option {
  padding: 0 !important;
}


#ModuleList {
  border: 1px solid #888888;
  width: 230px;
}


#ButtonArea {
  position: fixed;
  margin-left: 20px;
  margin-top: -6px;
}

#HeadwaterBasinGage {
  width: auto;
}

#StatusList {
  width: 145px;
  border: 1px solid #888888;
}


#CalDateEnd,
#CalDateStart {
  padding: 0 4px;
  width: auto;

  :first-child {
    > :first-child {
      > :first-child {
        font-size: 1em;
      }
    }
  }
}
</style>
