<template>
  <div id="JobFilterDialog" ref="draggableDiv" class="mb-2 top-[20%] left-[30%] absolute z-100 w-[750px] h-[450px]"
    :class="isDragging ? 'cursor-move' : ''">

    <div id="Header" class="mb-2">
      <div class="mb-2 pt-1 ml-3 font-bold text-sm text-white cursor-[grabbing] ">Calibration Job Filters</div>
    </div>

    <div id="FilterDialog" class="px-5 py-0">
      <div class="grid grid-cols-3 gap-2">
        <div class="col-span-1">
          <div class="mb-2">
            <label class="text-center" for="HeadwaterBasinGage">Headwater Basin Gage</label><br>
            <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter text-center" v-model="uiGageId"
              :options="calibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
              aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select">
            </Select>
          </div>
          <hr class="bg-gray-950" />
          <div class="mt-2">
            <label for="DateFilterButtons">Date Filters *</label>
            <div id="DateFilterButtons" class="flex flex-column gap-2 text-center">
              <div>
                <RadioButton inputId="inputId1" name="inputName" v-model="whichDatesToFilter" :value="0"
                  checked="checked" @change="handleRadioClick(0)" aria-label="Filter with creation dates"
                  title="Filter with creation dates" />
                <label for="inputId1" class="text-sm font-light text-center">Creation Date</label>
              </div>

              <div>
                <RadioButton inputId="inputId2" name="inputName" v-model="whichDatesToFilter" :value="1"
                  @change="handleRadioClick(1)" aria-label="Filter with submit dates"
                  title="Filter with submit dates" />
                <label for="inputId2" class="text-sm font-light text-center">Submit Date</label>
              </div>

              <div>
                <RadioButton inputId="inputId3" name="inputName" v-model="whichDatesToFilter" :value="2"
                  @change="handleRadioClick(2)" aria-label="Filter with calibration periods"
                  title="Filter with calibration periods" />
                <label for="inputId3" class="text-sm font-light text-center">Calibration Period</label>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <span class="cursor-default">From:</span>
            <VueDatePicker id="CalDateStart" class="datePickers dp__theme_dark" v-model="calDateStart"
              time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00" :disabled="!useDateRange"
              @update:model-value="handleCalDateStart" aria-label="From Date" title="From Date" />
          </div>
          <div>
            <span class="cursor-default">To:</span>
            <VueDatePicker id="CalDateEnd" class="datePickers dp__theme_dark" v-model="calDateEnd" time-picker-inline
              text-input utc='preserve' format="yyyy-MM-dd HH:00" :disabled="!useDateRange"
              @update:model-value="handleCalDateEnd" aria-label="To date" title="To date" />
          </div>
          <div class="mt-3 ml-3">
            <Checkbox v-model="useDateRange" inputId="daterange" name="daterange" binary
              aria-label="Enable Date Filters" title="Enable Date Filters"></Checkbox>
            <span class="cursor-default">&nbsp;Enable Date Filters *</span>
          </div>
        </div>


        <div class="col-span-1 text-left ml-6">
          <div class="grid grid-rows-2">
            <div class="row-span-1">
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

            <div class="row-span-1">
              <div class="mt-2">
                <div id="CalValSelect" class="flex flex-column gap-2 text-center">
                  <div>
                    <Checkbox inputId="FilterCalibrations" name="FilterCalibrations" v-model="filterCalibrations"
                      :checked="true" binary aria-label="Filter calibration checkbox"
                      title="Filter calibration checkbox" />
                    <label for="FilterCalibrations" class="text-sm font-light text-center">Calibrations</label>
                  </div>
                  <div>
                    <Checkbox CalValId="FilterEvaluations" name="FilterEvaluations" v-model="filterEvaluations" binary
                      aria-label="Filter evaluations checkbox" title="Filter evaluations checkbox" />
                    <label for="FilterEvaluationsFilterEvaluations"
                      class="text-sm font-light text-center">Validations</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-1">
          <div>
            <label for="ModuleList" class="text-center">Modules</label>
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
          <div id="ButtonArea" class="flex mt-3 text-center">
            <Button class="ngenButtonDiv" label="Reset" @click="resetFilters($event)" aria-label="Reset filters"
              title="Reset filters">
            </Button>
            <Button class="ngenButtonDiv ml-6" label="Apply" @click="sendClose($event)" aria-label="Apply and close"
              title="Apply and close"></Button>
          </div>
        </div>
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
import RadioButton from "primevue/radiobutton";

import type { CalibrationJobListItem } from "@/composables/NextGenModel"
import { StatusTypes } from "@/composables/NextgenEnums";

import { useFormulationStore } from "~/stores/calibration/FormulationStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";

import { getCreationDateSpan } from "@/utils/CommonHelpers";
const { fetchFormulationModuleOptions } = useFormulationStore();

const userStore = useUserDataStore();

const { uiGageId, calibrationRunGageList, modulesFilterList, statusTypeFilterList,
  calDateStart, calDateEnd, earliestTime, latestTime, useDateRange, whichDatesToFilter,
  filterCalibrations, filterEvaluations } = storeToRefs(useUserDataStore());

const emit = defineEmits(["ModulesFilterDialogClosing"]);

const message = ref("Initial message");

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
          const target = e.target as HTMLElement | null;
          if (target && target.closest("#Header") !== null) {
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

            // Keep div within window bounds
            const maxX = window.innerWidth - draggableDiv.value.offsetWidth + (draggableDiv.value.offsetWidth );
            const maxY = window.innerHeight - draggableDiv.value.offsetHeight + (draggableDiv.value.offsetHeight);

            draggableDiv.value.style.left = Math.min(Math.max(-400, newX), maxX) + 'px';
            draggableDiv.value.style.top = Math.min(Math.max(0, newY), maxY) + 'px';
          }
        });

        document.addEventListener('mouseup', () => {
          isDragging.value = false;
        });
      }
      setFilterDateRange();
    }, 0)
  });
})

/**
 * Set the filter's date range when Date Filter type changes.
 * @param btn: number
 */
const handleRadioClick = (btn: number) => {
  setFilterDateRange();
}
const setFilterDateRange = () => {
  if (props.calJobs) {
    let trange: FilterTimeRange;
    if (whichDatesToFilter.value === 0) {
      trange = getCreationDateSpan(props.calJobs) as FilterTimeRange;
      if (trange) {
        earliestTime.value = calDateStart.value = trange.earliest;
        latestTime.value = calDateEnd.value = trange.latest;
      }
    } else if (whichDatesToFilter.value === 1) {
      trange = getSubmitDateSpan(props.calJobs) as FilterTimeRange;
      if (trange) {
        earliestTime.value = calDateStart.value = trange.earliest;
        latestTime.value = calDateEnd.value = trange.latest;
      }
    } else if (whichDatesToFilter.value === 2) {
      trange = getCalibrationDateSpan(props.calJobs) as FilterTimeRange;
      if (trange) {
        earliestTime.value = calDateStart.value = trange.earliest;
        latestTime.value = calDateEnd.value = trange.latest;
      }
    }
  }
}

/**
 * Let the caller close the dialog
 * @param: MouseEvent
 */
const sendClose = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  emit("ModulesFilterDialogClosing");
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
  whichDatesToFilter.value = 0;
  nextTick(() => {
    getCreationDateSpan(props.calJobs);
  })
}

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
  background-color: white;
  border: 2px solid #666666;
}


#ModuleList,
#StatusList {
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
