<template>
  <div id="JobFilterDialog" class="JobsFilterBox mb-2 mt-4">

    <div id="FilterDialog">

      <div class="grid grid-cols-12 gap-2 text-sx">
        <div class="col-span-2" v-show="showGage">
          <label class="block text-left w-[90%]" for="HeadwaterBasinGage" aria-label="Headwater Basin Gage"
            title="Headwater Basin Gage">Headwater Basin Gage</label>
          <Select id="HeadwaterBasinGage" class="mt-1 basin-gage-filter text-left" v-model="uiGageId"
            :options="calibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
            aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select"
            :disabled="disableAll" @change="refreshJobList()">
          </Select>
        </div>

        <div class="col-span-2" v-show="showStatus">
          <label class="block text-left mb-1" for="StatusList" aria-label="Status Filter"
            title="Status Filter">Status</label>
          <MultiSelect id="StatusList" v-model="statusTypeFilterList" :options="StatusTypes" optionLabel="status"
            optionValue="filterValue" :maxSelectedLabels="3" class="JobsFilterSelect w-full" aria-label="Status Filter"
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

        <div class="col-span-4" v-show="showModules">
          <div class="grid grid-cols-2">
            <div class="col-span-2">
              <label for="ModuleList" class="block text-left mb-1" aria-label="Module Filter"
                title="Module Filter">Modules</label>
            </div>
            <div>
              <MultiSelect id="ModuleList" v-model="modulesFilterList" :options="fetchFormulationModuleOptions"
                optionLabel="display_name" optionValue="name" :maxSelectedLabels="3" class="JobsFilterSelect w-full" aria-label="Module Filter"
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
                optionValue="name" class="user-select" @change="refreshJobList()"
                v-show="modulesFilterList.length > 1" aria-label="Module Operator" title="Module Operator">
              </Select>
            </div>
          </div>
        </div>
        <div class="col-span-4">
          <div class="grid grid-cols-8">
            <div class="col-span-4" v-show="showArchived">
              <Checkbox v-model="includeArchivedJobs" inputId="ShowArchiveToggle" class="text-xs mt-[30px] ml-[28px]"
                aria-label="Include Archived Jobs" title="Include Archived Jobs" binary variant="filled" size="large"
                :pt="ptCheckbox" :disabled="disableAll" @click="refreshJobList()">
              </Checkbox>
              <label class="cursor-pointer align-center ml-2" for="ShowArchiveToggle" aria-label="Include Archived Jobs"
                title="Include Archived Jobs">Include Archived</label>
            </div>
            <div class="col-span-4 text-right mr-[16px]">
              <Button id="ClearFiltersButton" class="c-blue mt-[22px]" label="Clear Filters"
                @click="resetFilters()" aria-label="Clear filters" title="Clear filters" :disabled="filterActive">
              </Button><br />
              <Button id="RefreshJobList" class="c-blue mt-[5px]" label="Refresh List" @click="refreshJobList()"
                aria-label="Refresh Job List" title="Refresh Job List" :disabled="disableAll">
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import MultiSelect from 'primevue/multiselect';
import Select from "primevue/select";


import { StatusTypes } from "@/composables/NgencerfEnums";

import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";

const { fetchFormulationModuleOptions } = useFormulationStore();

const { uiGageId, calibrationRunGageList, modulesFilterList, moduleOperator, statusTypeFilterList, includeArchivedJobs } = storeToRefs(useUserDataStore());

const emit = defineEmits(["ModulesFilterDialogClosing", "RefreshJobList"]);

const ptCheckbox = ref({
  box: { style: { "border": "2px solid #0c5274" } },
});

const moduleOperatorList = [
  { name: "any" },
  { name: "all" }
]

interface Props {
  disableAll?: boolean;
  showGage?: boolean;
  showStatus?: boolean;
  showModules?: boolean;
  showArchived?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disableAll: true,
  showGage: true,
  showStatus: true,
  showModules: true,
  showArchived: true,
});

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      resetFilters();
    }, 250) // Necessary to make sure that data has been retreived.
  });
})

const filterActive = computed(() => {
  return (
    (props.showModules === false || uiGageId.value === '' || uiGageId.value === 'All') && 
    (props.showModules === false || modulesFilterList.value.length === 0) && 
    (props.showStatus === false || statusTypeFilterList.value === null || statusTypeFilterList.value.length === 0) &&
    (props.showArchived === false || includeArchivedJobs.value === false)
  );
});


const refreshJobList = () => {
  console.log("modulesFilterList:",modulesFilterList.value);
  emit("RefreshJobList");
}

/**
 * Reset filters
 */
const resetFilters = () => {
  if (props.showGage) uiGageId.value = 'All';
  if (props.showModules) {modulesFilterList.value = []; moduleOperator.value = 'any';}
  if (props.showStatus) statusTypeFilterList.value = [];
  if (props.showArchived) includeArchivedJobs.value = false;
  emit("RefreshJobList");
}

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
