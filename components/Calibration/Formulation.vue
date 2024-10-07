<template>
  <div id="Formulation" class="ml-6">

    <div class="grid grid-rows-12 pt-4 text-sm">
      <div class="grid row-span-1">
        <div class="grid grid-cols-8">
          <div class="col-span-8">
            <div id="FormulationName" class="block mt-2" aria-label="Forumulation Name" title="Formulation Name">
              <label for="formulationNameInput">Forumulation Name:</label>
            </div>
            <InputText id="formulationNameInput" v-model="formulationNameInput" class="inline-block w-64 p-1"
              aria-label="Input Forumulation Name" title="Input Formulation Name" required></InputText>
          </div>
        </div>
      </div>

      <div class="row-span-5">
        <div class="mb-2 hr"></div>
        <div class="grid grid-cols-12">
          <div class="col-span-5">
            <div class="text-left text-lg"><strong>Formulation Modules</strong></div>
            <div class="mb-2 mt-2" aria-label="Group Select" title="Group Select">

              <div class="font-bold">Groups Filter
                <Select id="Groups" class="" v-model="filterGroup" filter
                  :options="fetchFormulationModuleCoveredGroupFilterOptions" optionLabel="description"
                  optionValue="name" placeholder="ALL"></Select>
              </div>
            </div>
            <div class="mb-1 font-bold">Select Modules:</div>
            <Listbox id="ModuleList" v-model="selectedModuleValues" :options="fetchFormulationModuleOptions" multiple
              optionLabel="name" optionValue="name" class="w-full h-60"></Listbox>
          </div>
          <div class="col-span-2">&nbsp;</div>
          <div class="col-span-5">
            <div class="group-cover-selection-wrapper w-80 float-left">
              <div class="mt-2 mb-2 pl-4 text-lg" aria-label="List of groups covered by selection"
                title="List of groups covered by selection"><strong>Groups Covered By Selections:</strong></div>
              <Listbox id="CoveredBy" :options="fetchFormulationModuleCoveredGroupOptions" optionLabel="name"
                optionValue="name" scrollHeight="18rem" class="w-full border-0">
                <template #option="slotProps">
                  <div v-bind:class="(slotProps.option.selected == true) ? 'pi pi-check font-bold' : 'pl-5'"><span
                      class="font-ui pl-2">{{ slotProps.option.name }}</span></div>
                </template>
              </Listbox>
            </div>
          </div>
          <div class="col-span-1">&nbsp;</div>
        </div>
        <div class="mt-3 mb-5 hr"></div>
      </div>
      <div class="row-span-6">
        <div>
          <div class="flex">
            <span class="text-left pt-1">
              <input type="checkbox" id="SlothCheck" class="ml-2" v-model="useSlothParameters" />
              <label class="inline-block text-[18px]" for="SlothCheck">&nbsp;Add SLoTH output variable for
                formulation</label>
            </span>
            <span v-show="useSlothParameters" class="ml-auto pr-2">
              <label class="inline-block  text-[16px] pl-10 pr-4" for="SlothName">SLoTH Name:</label>
              <input class="inline-block w-auto" id="SlothName" type="text" v-model="new_sloth_variable_name">
              <div class="ngenButtonDiv ml-3 inline-block">
                <button id="SlothAddBtn" @click="addSlothVariable">Add</button>
              </div>
            </span>
          </div>
          <div id="SlothDataTable" v-show="useSlothParameters" editMode="cell"
            class="w-full items-center pl-2 pr-2 mt-2">

            <ContextMenu :pt="{ root: { id: 'loth-param-context-menu' } }" class="bg-white" ref="slothParamContextMenu"
              :model="cmSlothParameterData"></ContextMenu>
            <DataTable class="stripe" id="sloth-params-list" :value="slothParameterInputs" editMode="cell" scrollable
              scroll-height="400px" table-style="min-width: 50rem" v-model:selection="selectedSlothParameterData"
              selectionMode="single" contextMenu v-model:contextMenuSelection="selectedSlothParameterData"
              @rowContextmenu="onRowContextMenu">
              <Column field="param_name" header="SLoTH Output Var" sortable></Column>
              <Column field="param_count" header="Count" sortable>
                <template #editor="{ index }">
                  <InputText v-model="slothParameterInputs[index].param_count" autofocus class="w-12 p-1">
                  </InputText>
                </template>
              </Column>
              <Column field="param_type" header="Type" sortable>
                <template #editor="{ index }">
                  <Select v-model="slothParameterInputs[index].param_type"
                    :options="fetchFormulationSlothParameterTypeOptions" optionLabel="name" optionValue="name"></Select>
                </template>
              </Column>
              <Column field="param_units" header="Units" sortable>
                <template #editor="{ index }">
                  <Select v-model="slothParameterInputs[index].param_units"
                    :options="fetchFormulationSlothParameterUnitOptions" optionLabel="name" optionValue="name"></Select>
                </template>
              </Column>
              <Column field="param_location" header="Location" sortable>
                <template #editor="{ index }">
                  <InputText v-model="slothParameterInputs[index].param_location" autofocus class="w-20 p-1">
                  </InputText>
                </template>
              </Column>
              <Column field="maps_to_module" header="For Module" sortable>
                <template #editor="{ index }">
                  <Select v-model="slothParameterInputs[index].maps_to_module" filter
                    :options="fetchSelectedFormulationModuleOptions" optionLabel="name" optionValue="name"></Select>
                </template>
              </Column>
              <Column field="maps_to_variable_name" header="Module Param" sortable>
                <template #editor="{ index }">
                  <InputText v-model="slothParameterInputs[index].maps_to_variable_name" autofocus fluid>
                  </InputText>
                </template>
              </Column>
              <Column field="param_value" header="Value" sortable>
                <template #editor="{ index }">
                  <InputNumber v-model="slothParameterInputs[index].param_value" autofocus :minFractionDigits="0"
                    :maxFractionDigits="2" class="w-12 p-1" fluid>
                  </InputNumber>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
    <div class="waitgif" v-if="formulationStore_data_loading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted } from "vue";
import { useFormulationStore } from "~/stores/calibration/FormulationStore";
import { generalStore } from "~/stores/common/GeneralStore";
import { useToast } from "primevue/usetoast";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import type { SlothParameterData } from '~/composables/NextGenModel';
import { useApiErrorResponseValidator } from "~/composables/ValidationHandlers";

const isLoading = ref(false);
const new_sloth_variable_name = ref<string>("")
const selectedSlothParameterData = ref<SlothParameterData>()
const slothParamContextMenu = ref() //sloth parameter table context menu


const cmSlothParameterData = ref([
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedSlothParameterData(selectedSlothParameterData) }
])
const onRowContextMenu = (event: any) => {
  slothParamContextMenu.value.show(event.originalEvent)
}
const {
  formulationStore_data_loading,
  filterGroup,
  useSlothParameters,
  selectedModuleValues,
  formulationNameInput,
  slothParameterInputs,
  fetchFormulationModuleOptions,
  fetchFormulationModuleCoveredGroupFilterOptions,
  fetchFormulationModuleCoveredGroupOptions,
  fetchFormulationSlothParameterTypeOptions,
  fetchFormulationSlothParameterUnitOptions,
  fetchSelectedFormulationModuleOptions
} = storeToRefs(useFormulationStore());

const { loadFormulationTabStaticData, addNewSlothVariable, saveFormulationTabData, resetUserSelectionFormulation, deleteSlothVariable } = useFormulationStore()
const { fetchUserCalibrationRunData } = useUserDataStore()
const { getCalibrationTabIndex } = generalStore()
const toast = useToast();


onMounted(() => {
  toast.removeAllGroups();
  /**
 * event bus for calibration button group click
 */
  useListen('calibrationButtonSaveStart', (actionButton) => {
    if (getCalibrationTabIndex() === 3 && actionButton == 'SAVE') {
      toast.removeAllGroups()
      const save_formulation_response = saveFormulationTabData()
      save_formulation_response.then((response) => {
        if (response?.validation_errors) {
          useApiErrorResponseValidator(response?.validation_errors).forEach((message: String) => {
            toast.add({ severity: "error", summary: 'Error Saving Formulation Tab Data', detail: message })
          })
        } else {
          toast.add({ severity: 'info', summary: 'Formulation Tab Data Saved', detail: response?.message, life: 3000 })
          fetchUserCalibrationRunData();
        }
      })
    }
  })

  useListen('calibrationButtonResetCancel', (actionButton) => {
    if (getCalibrationTabIndex() == 3 && actionButton == 'RESET') {
      resetUserSelectionFormulation()
    }
  })

  useListen('calibrationButtonNext', (actionButton) => {
    if (getCalibrationTabIndex() == 3 && actionButton === "NEXT") {
      if (!formulationNameInput.value) {
        toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "A Forumulation Name is required.", life: 3000 })
      }
      if (!selectedModuleValues.value.length) {
        toast.add({ severity: 'warn', summary: `Data requirement error`, detail: "Module Selection is required.", life: 3000 })
      }
      if (!formulationNameInput.value || !selectedModuleValues.value.length) {
        return;
      }
      const tabs = document.getElementsByClassName("tabs");
      const e = <HTMLElement>tabs[3];
      e.click();
    }
  })

  useListen('calibrationButtonPrev', (actionButton) => {
    if (getCalibrationTabIndex() == 3 && actionButton === "PREV") {
      const tabs = document.getElementsByClassName("tabs");
      const e = <HTMLElement>tabs[1];
      e.click();
    }
  })
})

onUnmounted(() => {
  emitterOff('calibrationButtonSaveStart');
  emitterOff('calibrationButtonPrev');
  emitterOff('calibrationButtonNext');
})


/**
 * add sloth variable entry to table and reset name field
 */
const addSlothVariable = () => {
  if (new_sloth_variable_name.value.trim() != '') {
    addNewSlothVariable(new_sloth_variable_name.value)
    new_sloth_variable_name.value = ''
  }
}

const deleteSelectedSlothParameterData = (selectedSlothParameterData: any) => {
  deleteSlothVariable(selectedSlothParameterData.value.param_name)
}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#Formulation {
  width: auto;
}

#FormulationName {
  font-size: 1.2em;
}

#SlothCheck {
  height: 20px;
  width: 20px;
}

ul#ModulesList {
  border: 1px solid #000;
  height: 250px;
  overflow-y: scroll;

  li {
    background-color: #eee;
    border-bottom: 1px solid #000;
    padding: 2px 2px 2px 5px;
  }

  li:hover {
    background-color: $ngwcp_secondary3;
    color: black;
  }

  .liActive {
    background-color: $ngwcp_primary3;
    color: white;
  }
}

#ModuleGroupSelect {
  width: 125px;

}

table#CoveredBy {

  tr td {
    line-height: 2em;
  }
}

#SlothBackground {
  height: 301px;
  width: 35vw;
  background-color: $ngwcp_groupsbkg;
  border-radius: 20px;
  border: 1px solid #000;
  padding: 10px 15px;
  margin-left: 20px;
}

#AddUpdate {
  width: 132px;
  height: 55px;

  button {
    padding-top: 8px;
  }
}

h1 {
  margin-top: 20px;
  text-align: center;
}

.slothLable {
  text-align: right;
  width: 120px;
}
</style>
