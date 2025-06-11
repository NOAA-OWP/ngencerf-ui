<template>
  <div id="ForecastRunsFilterDialog" class="JobsFilterBox mb-1 mt-4">

    <div id="FilterDialog">

      <div class="grid grid-cols-12 gap-2 text-sx items-end">
        <div class="col-span-2 pb-[8px]">
          <label class="block text-left w-[90%]" for="HeadwaterBasinGage" aria-label="Headwater Basin Gage"
            title="Headwater Basin Gage">Headwater Basin Gage</label>
          <Select id="HeadwaterBasinGage" class="mt-1 basin-gage-filter text-left" v-model="uiGageId"
            :options="forecastRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
            aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select"
            :disabled="disableAll">
          </Select>
        </div>

        <div class="col-span-6 pb-[5px]">                      
          <Button class="ngenButtonDiv ml-[9px] inline-block align-bottom" label="Apply Filters"
            @click="sendApply($event)" aria-label="Apply and close" title="Apply and close"
            :disabled="disableAll">
          </Button>                  
        </div>

        <div class="col-span-4 text-right mr-3">
          <Button id="CleareFiltersButton" class="c-blue mt-[2px]" label="Clear Filters" @click="resetFilters($event)"
            aria-label="Clear filters" title="Clear filters" :disabled="filterActive">
          </Button><br />
          <Button id="RefreshJobList" class="c-blue mt-[2px]" label="Refresh List" @click="refreshJobList()"
            aria-label="Refresh Job List" title="Refresh Job List" :disabled="disableAll">
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import Select from "primevue/select";

import type { ForecastJob } from "@/composables/NgencerfModels"

import { useForecastStore } from "@/stores/forecast/ForecastStore";

const { uiGageId, forecastRunGageList } = storeToRefs(useForecastStore());

const emit = defineEmits(["ApplyJobFilters", "ResetJobFilters", "RefreshJobList"]);

const props = defineProps<{
  forecastJobs: ForecastJob[];
  disableAll: boolean;
}>();


const filterActive = computed(() => {
  return uiGageId.value === 'All' || uiGageId.value === '';
});

const refreshJobList = () => {
  emit("RefreshJobList");
}

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
  emit("ResetJobFilters");
}

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#Header {
  background-color: global.$ngwcp_primary3;
}

#ForecastRunsFilterDialog {
  background-color: white;
  padding-bottom: 5px;
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