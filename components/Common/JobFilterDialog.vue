<template>
  <div id="JobFilterDialog" ref="draggableDiv" :class="isDragging ? 'cursor-move' : ''">
    <div id="Header" class="w-full h-8 mb-2">
      <div class="mb-2 pt-1 ml-3 font-bold text-base text-white">Calibration Job Filters</div>
    </div>
    <div id="ModuleDialog">
      <div class="mb-3">
        <div class="grid grid-cols-4">

          <!-- Gage Select -->
          <div class="col-span-1 text-center">
            <label class="text-center" for="HeadwaterBasinGage">Headwater Basin Gage</label><br>
            <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter text-center" v-model="uiGageId"
              :options="calibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
              aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select">
            </Select>
          </div>

          <!-- Date Range -->
          <div class="col-span-3">
            <div class="grid grid-cols-3 text-center align-top">
              <div class="col-span-1 small-label">From</div>
              <div class="col-span-1 small-label font-bold">Date Range</div>
              <div class="col-span-1 small-label">To</div>
            </div>
            <div class="grid grid-cols-9">
              <div class="col-span-4">
                <VueDatePicker id="CalDateStart" class="datePickers dp__theme_dark" v-model="calDateStart"
                  time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00" :disabled="!useDateRange"
                  @update:model-value="handleCalDateStart" aria-label="aria-label" title="title" />
              </div>
              <div class="col-span-1 text-center">
                <Checkbox v-model="useDateRange" inputId="daterange" name="daterange" binary></Checkbox>
              </div>
              <div class="col-span-4">
                <VueDatePicker id="CalDateEnd" class="datePickers dp__theme_dark" v-model="calDateEnd"
                  time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00" :disabled="!useDateRange"
                  @update:model-value="handleCalDateEnd" aria-label="aria-label" title="title" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row-span-1">
        <div class="grid grid-cols-3">
          <div class="col-span-1">
            <label for="ModuleList" class="text-center">Modules</label>
            <Listbox id="ModuleList" v-model="modulesFilterList" :options="fetchFormulationModuleOptions" multiple
              optionLabel="name" optionValue="name" class="h-60">
              <template #option="slotProps">
                <div v-bind:class="(slotProps.option.selected === true) ? 'pi pi-check font-bold' : 'pl-5'">
                  <div class="font-ui pl-2 leading-none" :aria-label="slotProps.option.name"
                    :title="slotProps.option.name">
                    {{ slotProps.option.name }}</div>
                </div>
              </template>
            </Listbox>
          </div>
          <div class="col-span-1 text-center">
            <label for="StatusTypeFilter">Status</label><br>
            <Select id="StatusTypeFilter" class="mr-3" v-model="statusTypeFilter" :options="StatusTypes" filter
              optionLabel="status" optionValue="filterValue" placeholder="Any" aria-label="Select" title="Select">
            </Select>
          </div>
          <div class="col-span-1">&nbsp;</div>
        </div>

      </div>

      <div id="ButtonArea" class="flex justify-end gap-5">
        <Button class="ngenButtonDiv" label="Reset" @click="resetFilters()" :disabled="enableReset"></Button>
        <Button class="ngenButtonDiv" label="Close" @click="sendClose()"></Button>
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

import type { CalibrationJobListItem } from "@/composables/NextGenModel"

import { useFormulationStore } from "~/stores/calibration/FormulationStore";
const { fetchFormulationModuleOptions } = useFormulationStore();

import { useUserDataStore } from "~/stores/common/UserDataStore";
const userStore = useUserDataStore();
const { uiGageId, calibrationRunGageList, modulesFilterList, statusTypeFilter, 
  calDateStart, calDateEnd, earliestTime, latestTime, useDateRange } = storeToRefs(useUserDataStore());

import { defineEmits } from "vue";
const emit = defineEmits(["ModulesFilterDialogClosing"]);

const showArchivedJobsOnly = ref<boolean>(false);

const draggableDiv = ref<HTMLDivElement | null>(null);
const isDragging = ref<boolean>(false);
let offsetX = 0;
let offsetY = 0;

const props = defineProps<{
  calJobs: CalibrationJobListItem[];
}>();


onMounted(() => {
  console.log(uiGageId, calibrationRunGageList);
  nextTick(() => {
    setTimeout(() => {
      if (draggableDiv.value) {
        draggableDiv.value.addEventListener('mousedown', (e: MouseEvent) => {
          if( e && e.target ) {
            if( (e.target as HTMLElement).tagName === "LI")
            return;
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
    }, 0)
  });
})

const sendClose = () => {
  emit("ModulesFilterDialogClosing");
};

const resetFilters = () => {
  uiGageId.value = 'All';
  modulesFilterList.value = [];
  statusTypeFilter.value = "Any";
  nextTick( () => {
    findEarliestAndLatest(props.calJobs);
  })
}

const enableReset = computed(() => {
  return (uiGageId.value !== 'All' && modulesFilterList.value.length > 0
       && statusTypeFilter.value !== "Any" && useDateRange.value === false) === true;
})

const findEarliestAndLatest = (items: CalibrationJobListItem[]) => {
  if (!items.length) return null

  let earliest = items[0].created_at;
  let latest = items[0].created_at;

  for (const item of items) {
    if (new Date(item.created_at) < new Date(earliest)) {
      earliest = item.created_at;
    }
    if (new Date(item.created_at) > new Date(latest)) {
      latest = item.created_at;
    }
  }

  earliestTime.value = calDateStart.value = earliest;
  latestTime.value = calDateEnd.value = latest;

};


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

#Header {
  background-color: global.$ngwcp_primary3;
}
#JobFilterDialog {
  width: 750;
  height: 500px;
  position: absolute;
  top: 20%;
  left: 30%;
  background-color: white;
  border: 2px solid #666666;
  z-index: 99;
}

#ModuleDialog {
  padding: 0 15px;
}
#ModuleList {
  border: 1px solid #888888;
}

#ButtonArea {
  position: fixed;
  margin-left: 586px;
  margin-top: -36px;
}

#HeadwaterBasinGage {
  width: auto;
}

#StatusTypeFilter {
  width: 170px;
}

#CalDateEnd,
#CalDateStart {
  padding: 0 4px;
  width: 100%;

  :first-child {
    > :first-child {
      > :first-child {
        font-size: 1.2em;
      }
    }
  }
}
</style>
