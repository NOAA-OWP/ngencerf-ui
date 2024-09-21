FormulationName<template>
   <div id="Formulation">

      <div class="grid grid-rows-12">
         <div class="grid row-span-1">
            <div class="grid grid-cols-8">
               <div class="col-span-2">&nbsp;</div>
               <div class="col-span-4">
                  <div id="FormulationName" class="inline-block ml-20 mr-5 mt-3" aria-label="Forumulation Name"
                     title="Formulation Name">
                     Forumulation Name:
                  </div>
                  <InputText v-model="formulationNameInput" class="inline-block w-64 p-1" aria-label="Input Forumulation Name" title="Input Formulation Name" required></InputText>
               </div>
               <div class="col-span-2">&nbsp;</div>
            </div>
         </div>

         <div class="row-span-5">
            <div class="grid grid-cols-12">
               <div class="col-span-3">&nbsp;</div>
               <div class="col-span-2">
                  <div class="mt-2 text-left"><strong>Modules</strong></div>
                  <div class="mb-2 mt-2" aria-label="Group Select" title="Group Select">
                     Groups: 
                     <Dropdown v-model="filterGroup" :options="fetchFormulationModuleCoveredGroupFilterOptions" optionLabel="description" optionValue="name" class="ml-2" placeholder="ALL"></Dropdown>
                  </div>
                  <Listbox id="ModuleList" v-model="selectedModuleValues" :options="fetchFormulationModuleOptions" multiple optionLabel="name" optionValue="name" class="w-full h-60"></Listbox>
               </div>
               <div class="col-span-2">&nbsp;</div>
               <div class="col-span-5">
                  <div class="group-cover-selection-wrapper w-60 float-left">
                     <div class="mt-2 mb-2" aria-label="List of groups covered by selection"
                        title="List of groups covered by selection"><strong>Groups Covered By Selections</strong></div>
                     <Listbox id="CoveredBy" :options="fetchFormulationModuleCoveredGroupOptions" optionLabel="name" optionValue="name" scrollHeight="18rem" class="w-full h-72">
                        <template #option="slotProps">
                           <div v-bind:class="( slotProps.option.selected == true)?'pi pi-check font-bold':'pl-5'">{{ slotProps.option.name }}</div>
                        </template>
                     </Listbox>
                  </div>
               </div>
               <div class="col-span-1">&nbsp;</div>
            </div>
         </div>
         <div class="row-span-6">
            <div>
               <span class="text-left ml-40">
                  <input type="checkbox" id="SlothCheck" class="ml-4" v-model="useSlothParameters" />
                  <label class="inline-block text-xl mb-2" for="SlothCheck">&nbsp;Add SLoTH output variable for
                     formulation</label>
               </span>
               <span v-show="useSlothParameters">
                  <label class="inline-block text-xl pl-10 pr-4" for="SlothName">SLoTH Name:</label>
                  <input class="inline-block w-auto" id="SlothName" type="text" v-model="new_sloth_variable_name">
                  <div class="ngenButtonDiv ml-3 inline-block">
                     <button id="SlothAddBtn" @click="addSlothVariable">Add</button>
                  </div>
               </span>
               <div id="SlothDataTable" v-show="useSlothParameters" editMode="cell" class="items-center ml-10 mr-10 mt-4">

                  <ContextMenu :pt="{ root: { id: 'loth-param-context-menu' } }" class="bg-white" ref="slothParamContextMenu"
                :model="cmSlothParameterData"></ContextMenu>               
                  <DataTable  class="stripe" id="sloth-params-list" :value="slothParameterInputs" editMode="cell" scrollable scroll-height="400px"
                     table-style="min-width: 50rem" v-model:selection="selectedSlothParameterData" selectionMode="single"
                     contextMenu v-model:contextMenuSelection="selectedSlothParameterData" @rowContextmenu="onRowContextMenu">
                     <Column field="param_name" header="SLoTH Output Var" sortable></Column>
                     <Column field="param_count" header="Count" sortable>
                        <template #editor="{ index }">
                           <InputText v-model="slothParameterInputs[ index ].param_count" autofocus class="w-12 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="param_type" header="Type" sortable>
                        <template #editor="{ index }">
                           <InputText v-model="slothParameterInputs[ index ].param_type" autofocus class="w-20 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="param_units" header="Units" sortable>
                        <template #editor="{ index }">
                           <InputText v-model="slothParameterInputs[ index ].param_units" autofocus class="w-12 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="param_location" header="Location" sortable>
                        <template #editor="{ index }">
                           <InputText v-model="slothParameterInputs[ index ].param_location" autofocus class="w-20 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="maps_to_module" header="For Module" sortable>
                        <template #editor="{ index}">
                           <InputText v-model="slothParameterInputs[ index ].maps_to_module" autofocus class="w-16 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="maps_to_variable_name" header="Module Param" sortable>
                        <template #editor="{ index }">
                           <InputText v-model="slothParameterInputs[ index ].maps_to_variable_name" autofocus fluid></InputText>
                        </template>
                     </Column>
                     <Column field="param_value" header="Value" sortable>
                        <template #editor="{ index }">
                           <InputText v-model="slothParameterInputs[ index ].param_value" autofocus class="w-12 p-1"></InputText>
                        </template>
                     </Column>
                  </DataTable>
               </div>
            </div>
         </div>
      </div>
      <div class="waitgif" v-if="isLoading">
         <img src="@/assets/styles/img/wait.gif" />
      </div>
   </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useFormulationStore } from "~/stores/calibration/FormulationStore";
import { generalStore } from "~/stores/common/GeneralStore";
import { useToast } from "primevue/usetoast";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import type { SlothParameterData } from '~/composables/NextGenModel';
import { calibrationNextTabNavigate, calibrationPrevTabNavigate } from "~/composables/TabClickEvent";
import { useApiErrorResponseValidator } from "~/composables/ValidationHandlers";

const isLoading = ref(true);
const new_sloth_variable_name = ref<string>("")
const selectedSlothParameterData = ref<SlothParameterData>()
const slothParamContextMenu = ref() //sloth parameter table context menu

onMounted( () => {
   isLoading.value = false;
})
const cmSlothParameterData = ref([
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteSelectedSlothParameterData( selectedSlothParameterData ) }
])
const onRowContextMenu = (event: any) => {
   slothParamContextMenu.value.show(event.originalEvent)
}
const {
   filterGroup,
   useSlothParameters,
   selectedModuleValues,
   formulationNameInput,
   slothParameterInputs,
   fetchFormulationModuleOptions,
   fetchFormulationModuleCoveredGroupFilterOptions,
   fetchFormulationModuleCoveredGroupOptions, 
   data_loading
} = storeToRefs( useFormulationStore() )

const { loadFormulationTabStaticData, addNewSlothVariable, saveFormulationTabData, resetUserSelectionFormulation, deleteSlothVariable } = useFormulationStore()
const { fetchUserCalibrationRunData } = useUserDataStore()
const { getCalibrationTabIndex } = generalStore()
const toast = useToast();

//load static data of this tab
loadFormulationTabStaticData()

/**
 * add sloth variable entry to table and reset name field
 */
const addSlothVariable = () => {
   if( new_sloth_variable_name.value.trim() != '') {
      addNewSlothVariable( new_sloth_variable_name.value )
      new_sloth_variable_name.value = ''
   }
}

const deleteSelectedSlothParameterData = ( selectedSlothParameterData: any ) => {
   deleteSlothVariable( selectedSlothParameterData.value.param_name )
}
/**
 * event bus for calibration button group click
 */
useListen( 'calibrationButtonSaveStart', ( actionButton ) => {
   if( getCalibrationTabIndex() === 2 && actionButton == 'SAVE' ) {
      toast.removeAllGroups()
      const save_formulation_response = saveFormulationTabData()
      save_formulation_response.then( ( response ) => {
         if ( response?.validation_errors ) {
            useApiErrorResponseValidator( response?.validation_errors ).forEach( ( message: String ) => {
               toast.add({ severity: "error", summary: 'Error Saving Formulation Tab Data', detail: message })
            })            
         } else {
            toast.add({ severity: 'info', summary: 'Formulation Tab Data Saved', detail: response?.message, life: 3000 })
            fetchUserCalibrationRunData()
         }         
      }) 
   }
})

useListen( 'calibrationButtonResetCancel', ( actionButton) => {
   if( getCalibrationTabIndex() == 2 && actionButton == 'RESET' ) {
      resetUserSelectionFormulation()
   }
})

useListen( 'calibrationButtonPrev', ( actionButton ) => {
   const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[0];
  e.click();
})

useListen('calibrationButtonNext', (actionButton) => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[2];
  e.click();
})

useListen('calibrationButtonNext', ( actionIndex: number ) => {
   if ( actionIndex == 2 ) {
      calibrationNextTabNavigate( actionIndex )
   }
})
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
