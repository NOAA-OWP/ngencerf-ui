<template>
  <div id="Formulation" class="">
    <div class="grid grid-rows-7 pt-4 text-sm">
      <div class="row-span-5">
        <div class="grid grid-cols-8">
          <div class="col-span-8">
            <div id="FormulationName" class="block mt-1" aria-label="Forumulation Name" title="Formulation Name">
              <label for="formulationNameInput" class="text-lg">Formulation Name </label>
              <InputText id="formulationNameInput" v-model="formulationNameInput" class="inline-block w-64 p-1"
                aria-label="Input Forumulation Name" title="Input Formulation Name" required></InputText>
            </div>
          </div>
        </div>
        <div class="mb-2 hr mt-3"></div>
        <div class="grid grid-cols-12">
          <div class="col-span-5">
            <div class="text-left text-lg mt-2"><strong>Formulation Modules</strong></div>
            <div class="mb-2 mt-2" aria-label="Group Select" title="Group Select">

              <div class="font-bold">Groups Filter
                <Select id="Groups" v-model="filterGroup" filter
                  :options="fetchFormulationModuleCoveredGroupFilterOptions" optionLabel="description"
                  optionValue="name" placeholder="Select group..."></Select>
              </div>
            </div>
            <div class="pt-4 mb-1 font-bold text-base">Select Modules</div>
            <Listbox id="ModuleList" v-model="selectedModuleValues" :options="fetchFormulationModuleOptions" multiple
              optionLabel="name" optionValue="name" class="h-60">
              <template #option="slotProps">
                <div v-bind:class="(slotProps.option.selected == true) ? 'pi pi-check font-bold' : 'pl-5'">
                  <div class="font-ui pl-2 leading-none">{{ slotProps.option.name }}</div>
                </div>
              </template>
            </Listbox>
          </div>
          <div class="col-span-2">&nbsp;</div>
          <div class="col-span-5">
            <div class="group-cover-selection-wrapper w-80 float-left">
              <div class="mt-5 mb-2 pl-4 text-lg" aria-label="List of groups covered by selection"
                title="List of groups covered by selection"><strong>Groups Covered By Selections</strong></div>
              <Listbox id="CoveredBy" :options="fetchFormulationModuleCoveredGroupOptions" optionLabel="name"
                optionValue="name" scrollHeight="18rem" class="border-0">
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
      <div class="row-span-2 -mt-2">

        <div class="flex">
          <span class="text-left pt-1">
            <input type="checkbox" id="SlothCheck" class="ml-2" v-model="useSlothParameters" />
            <label class="inline-block text-[18px]" for="SlothCheck">&nbsp;Add SLoTH output variable for formulation</label>
          </span>
          <span v-show="useSlothParameters" class="ml-auto pr-2">
            <label class="inline-block  text-[16px] pl-10 pr-4" for="SlothName">SLoTH Name</label>
            <input class="inline-block w-auto" id="SlothName" type="text" v-model="new_sloth_variable_name"
              @keypress="addSlothOnEnter($event)">
            <div class="ngenButtonDiv ml-3 inline-block">
              <button id="SlothAddBtn" @click="addSlothVariable">Add</button>
            </div>
          </span>
        </div>

        <div id="SlothDataTable" v-show="useSlothParameters" class="items-center pl-2 pr-2 mt-2 overflow-auto max-h-[157px]">

          <ContextMenu :pt="{ root: { id: 'loth-param-context-menu' } }" class="bg-white" ref="slothParamContextMenu"
            :model="cmSlothParameterData"></ContextMenu>
          <DataTable class="stripe" id="sloth-params-list" :value="slothParameterInputs" editMode="cell" scrollable
            scroll-height="157px" table-style="min-width: 50rem" v-model:selection="selectedSlothParameterData"
            selectionMode="single" contextMenu v-model:contextMenuSelection="selectedSlothParameterData"
            @rowContextmenu="onRowContextMenu">
            <Column field="param_name" header="SLoTH Output Var" sortable></Column>
            <Column field="param_count" header="Count" sortable>
              <template #editor="{ index }">
                <InputNumber v-model="slothParameterInputs[index].param_count" autofocus class="w-12 p-1">
                </InputNumber>
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

      <div id="FormulationBottomButtons" class="grid grid-cols-8 mt-3 ActionButtonsBox">
        <span v-if="isCalibrationJobStatusSavedOrReady(calibrationStatus)">
          <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
            <button class="font-normal" title="Save" aria-label="Save Button" @click="saveFormulationData()">
              Save
            </button>
          </div>
        </span>
        <span v-else>
          <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">&nbsp;</div>
        </span>
        <span v-if="isCalibrationJobStatusSavedOrReady(calibrationStatus)">
          <div class="col-span-1 mr-3">
            <!--<button class="c-blue font-normal text-xl underline pt-1" title="Reset Button"
              @click="resetFormulationData()" aria-label="Reset Button">Reset</button>-->
          </div>
        </span>
        <span v-else>
          <div class="col-span-1 mr-3"></div>
        </span>

        <div class="col-span-4">&nbsp;</div>
        <div class="col-span-1">
          <div><button class="ngenButtonDiv ml-6 font-normal h-8 float-right" title="Previous Tab Button"
              aria-label="Previous Tab Button" @click="goPrevTab()">Prev</button></div>
        </div>
        <div class="col-span-1 mr-4">
          <div><button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Tab Button" aria-label="Next Tab Button"
              @click="goNextTab()">Next</button></div>
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
import { isCalibrationJobStatusSavedOrReady } from "~/utils/CommonHelpers";
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
const { fetchUserCalibrationRunData, userCalibrationRunData } = useUserDataStore()
const { getCalibrationTabIndex } = generalStore();
import { useRunStatusStore } from "~/stores/calibration/RunStatusStore";
import { data } from "autoprefixer";
const runStatusStore = useRunStatusStore();
const { calibrationStatus } = storeToRefs(runStatusStore);
let mainLeftAreaElement: HTMLElement | null = null;
let dataTableElement: HTMLElement | null = null;

const toast = useToast();

onMounted(() => {
  toast.removeAllGroups();
  mainLeftAreaElement = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (mainLeftAreaElement) { mainLeftAreaElement.scrollTo(0, 0); }

});

const addSlothOnEnter = (e: KeyboardEvent) => {
  const ele = e.target as HTMLElement;
  if (e.key === "Enter" && new_sloth_variable_name.value.trim() != '') {
    addSlothVariable();
  }
};

/**
 * add sloth variable entry to table and reset name field
 */
const addSlothVariable = () => {
  if (new_sloth_variable_name.value.trim() != '') {
    addNewSlothVariable(new_sloth_variable_name.value);
    new_sloth_variable_name.value = '';
  }

  // grab main left area and data table elements and scroll to bottom
  /// using nextTick to ensure elements are up to date before scrolling
  nextTick(() => {
    mainLeftAreaElement = document.getElementById("MainLeftDataArea") as HTMLElement;
    dataTableElement = document.querySelector(".p-datatable-table-container") as HTMLElement;

    if (mainLeftAreaElement) {
      mainLeftAreaElement.scrollTo({
        top: mainLeftAreaElement.scrollHeight,
        behavior: 'smooth'
      });
    }

    if (dataTableElement) {
      dataTableElement.scrollTo({
        top: dataTableElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
}

const deleteSelectedSlothParameterData = (selectedSlothParameterData: any) => {
  deleteSlothVariable(selectedSlothParameterData.value.param_name);
}


/**
* event bus for calibration button group click
*/
const saveFormulationData = () => {
  toast.removeAllGroups()
  const save_formulation_response = saveFormulationTabData();
  save_formulation_response.then((response) => {
    if (response?.validation_errors) {
      useApiErrorResponseValidator(response?.validation_errors).forEach((message: String) => {
        toast.add({ severity: "error", summary: response?.message, detail: message })
      })
    } else {
      toast.add({ severity: 'info', summary: 'Formulation Tab Data Saved', detail: response?.message, life: 3000 })
      fetchUserCalibrationRunData();
    }
  })
}

const resetFormulationData = () => {
  resetUserSelectionFormulation()
}

const goNextTab = () => {
  // let err = false;
  // let txt = "Please correct the following:";
  // if (!userCalibrationRunData?.formulation_name ) {
  //   txt += "\nA Formulation Name is required.";
  //   err = true;  // let err = false;
  // let txt = "Please correct the following:";
  // if (!userCalibrationRunData?.formulation_name ) {
  //   txt += "\nA Formulation Name is required.";
  //   err = true;
  // }
  // if (!userCalibrationRunData?.modules.length ) {
  //   txt += "\nModule Selection is required."
  //   err = true;
  // }
  // if (err) {
  //   toast.add({ severity: 'warn', summary: "Tab data is incomplete", detail: txt, life: 5000 });
  //   return;
  // }
  // }
  // if (!userCalibrationRunData?.modules.length ) {
  //   txt += "\nModule Selection is required."
  //   err = true;
  // }
  // if (err) {
  //   toast.add({ severity: 'warn', summary: "Tab data is incomplete", detail: txt, life: 5000 });
  //   return;
  // }
  gotoNext();
}

const gotoNext = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_tuningControls];
  e.click();
}
const goPrevTab = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_headwaterBasinGage];
  e.click();
}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#Groups, #formulationNameInput {
  width: 256px;
}
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

#ModuleList .p-listbox-option {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
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
/*
#FormulationBottomButtons {
  height: 54px;
  width: 100%;
}
*/
</style>
