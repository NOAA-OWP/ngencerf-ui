<template>
  <div id="JobFilterDialog">
    <div id="ModuleDialog">
      <div class="mb-1 font-bold text-base">Select Modules</div>

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
                  @update:model-value="handleCalDateStart" aria-label="aria-label" title="title" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row-span-1">
        <label for="ModuleList">Modules</label>
        <Listbox id="ModuleList" v-model="modulesFilterList" :options="fetchFormulationModuleOptions" multiple
          optionLabel="name" optionValue="name" class="h-60">
          <template #option="slotProps">
            <div v-bind:class="(slotProps.option.selected === true) ? 'pi pi-check font-bold' : 'pl-5'">
              <div class="font-ui pl-2 leading-none" :aria-label="slotProps.option.name" :title="slotProps.option.name">
                {{ slotProps.option.name }}</div>
            </div>
          </template>
        </Listbox>
      </div>
      <div class="row-span-1 boxed">
        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="sendClose()"></Button>
          <Button type="button" label="Ok"></Button>
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

import type { CalibrationJobListItem } from "@/composables/NextGenModel"

import { useFormulationStore } from "~/stores/calibration/FormulationStore";
const { fetchFormulationModuleOptions } = useFormulationStore();

import { useUserDataStore } from "~/stores/common/UserDataStore";
const userStore = useUserDataStore();
const { uiGageId, calibrationRunGageList, modulesFilterList } = storeToRefs(useUserDataStore());

import { defineEmits } from "vue";
const emit = defineEmits(["ModulesFilterDialogClosing"]);

const calDateStart = ref<any>(new Date("Jan 01 2025"));
const calDateEnd = ref<any>(new Date());

const useDateRange = ref<boolean>(false);

const earliestTime = ref<Date>();
const latestTime = ref<Date>();

const statusTypeFilter = ref<string>("");

const showArchivedJobsOnly = ref<boolean>(false);

const props = defineProps<{
  calJobs: CalibrationJobListItem[];
}>();


onMounted(() => {
  console.log(uiGageId, calibrationRunGageList)
  nextTick(() => {
    setTimeout(() => {
      findEarliestAndLatest(props.calJobs);
    }, 0)
  })
})

const sendClose = () => {
  emit("ModulesFilterDialogClosing");
};


const filterByDateRange = (data: any[], calDateStart: string, calDateEnd: string) => {
  const startDate = new Date(calDateStart).getTime();
  const endDate = new Date(calDateEnd).getTime();

  return data.filter((item) => {
    const itemDate = new Date(item.created_at).getTime();
    return itemDate >= startDate && itemDate <= endDate;
  });
}


const findEarliestAndLatest = (items: CalibrationJobListItem[]) => {
  if (!items.length) return null;

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


</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#JobFilterDialog {
  width: 800px;
  height: 500px;
  padding: 15px;
  position: absolute;
  top: 20%;
  left: 30%;
  background-color: white;
  border: 2px solid #666666;
  z-index: 99;
}

#ModuleList {
  width: 230px;
  border: 1px solid #888888;
}

#HeadwaterBasinGage {
  width: auto;
}

#CalDateEnd,
#CalDateStart {
  padding: 0 4px;
  width: 100%;

  :first-child {
    > :first-child {
      > :first-child {
        font-size: 1em;
      }
    }
  }
}
</style>
