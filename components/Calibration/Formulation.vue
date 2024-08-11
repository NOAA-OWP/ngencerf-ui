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
                  <InputText v-model="formulation_name_input" class="inline-block w-64 p-1" aria-label="Input Forumulation Name" title="Input Formulation Name"></InputText>
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
                     <Dropdown v-model="filter_group" :options="fetch_formulation_module_covered_group_filter_options" optionLabel="name" optionValue="code" class="ml-2" placeholder="ALL"></Dropdown>
                  </div>
                  <Listbox id="ModuleList" v-model="selected_module_values" :options="fetch_formulation_module_options" multiple optionLabel="name" optionValue="code" class="w-full h-60"></Listbox>
               </div>
               <div class="col-span-2">&nbsp;</div>
               <div class="col-span-5">
                  <div class="group-cover-selection-wrapper w-60 float-left">
                     <div class="mt-2 mb-2" aria-label="List of groups covered by selection"
                        title="List of groups covered by selection"><strong>Groups Covered By Selections</strong></div>
                     <Listbox id="CoveredBy" :options="fetch_formulation_module_covered_group_options" optionLabel="name" optionValue="code" scrollHeight="18rem" class="w-full h-72">
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
                  <input type="checkbox" id="SlothCheck" class="ml-4" v-model="use_sloth_parameters" />
                  <label class="inline-block text-xl mb-2" for="SlothCheck">&nbsp;Add SLoTH output variable for
                     formulation</label>
               </span>
               <span v-show="use_sloth_parameters">
                  <label class="inline-block text-xl pl-10 pr-4" for="SlothName">SLoTH Name:</label><input
                     class="inline-block w-auto" id="SlothName" type="text">
                  <div class="ngenButtonDiv ml-3 inline-block">
                     <button id="SlothAddBtn">Add</button>
                  </div>
               </span>
               <div id="SlothDataTable" v-show="use_sloth_parameters" editMode="cell" class="items-center ml-10 mr-10 mt-4">
                  <DataTable class="stripe" :value="sloth_parameter_inputs" editMode="cell" scrollable scroll-height="300px">
                     <Column field="param_name" header="SLoTH Output Var" sortable></Column>
                     <Column field="param_count" header="Count" sortable>
                        <template #editor="{ data, field }">
                           <InputText v-model="data[ field ]" autofocus class="w-12 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="param_type" header="Type" sortable>
                        <template #editor="{ data, field }">
                           <InputText v-model="data[ field ]" autofocus class="w-20 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="param_units" header="Units" sortable>
                        <template #editor="{ data, field }">
                           <InputText v-model="data[ field ]" autofocus class="w-12 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="param_location" header="Location" sortable>
                        <template #editor="{ data, field }">
                           <InputText v-model="data[ field ]" autofocus class="w-20 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="maps_to_module" header="For Module" sortable>
                        <template #editor="{ data, field }">
                           <InputText v-model="data[ field ]" autofocus class="w-16 p-1"></InputText>
                        </template>
                     </Column>
                     <Column field="maps_to_variable_name" header="Module Param" sortable>
                        <template #editor="{ data, field }">
                           <InputText v-model="data[ field ]" autofocus fluid></InputText>
                        </template>
                     </Column>
                     <Column field="param_value" header="Value" sortable>
                        <template #editor="{ data, field }">
                           <InputText v-model="data[ field ]" autofocus class="w-12 p-1"></InputText>
                        </template>
                     </Column>
                  </DataTable>
               </div>
            </div>


         </div>

      </div>


   </div>

</template>

<script lang="ts" setup>
import Index from "~/pages/index.vue";
//import { mockFormulationSlothParametersData } from "~/mockApi/formulationSlothData";
import type { SlothParameter } from "~/composables/NextGenModel";
import { storeToRefs } from "pinia";
import { useFormulationStore } from "~/stores/calibration/FormulationStore";

const {
   filter_group,
   use_sloth_parameters,
   formulation_tab_data,
   selected_module_values,
   formulation_name_input,
   sloth_parameter_inputs,
   fetch_formulation_module_options,
   fetch_formulation_module_covered_group_filter_options,
   fetch_formulation_module_covered_group_options, 
   fetch_formulation_module_covered_groups
} = storeToRefs( useFormulationStore() )

const loading = ref(true);

onMounted(() => {
   setTimeout(() => {
      loading.value = false;
      formulation_name_input.value = formulation_tab_data.value?.formulation_name ?? ""
      selected_module_values.value = formulation_tab_data.value?.module_sources ?? []
      use_sloth_parameters.value = formulation_tab_data.value?.use_sloth ?? false
      sloth_parameter_inputs.value = formulation_tab_data.value?.sloth_parameters ?? []
      console.log( selected_module_values )
   }, 500);
});

const ModuleClicked = (e: MouseEvent) => {
   const ele = e.target as HTMLElement;
   const indexStr = ele.getAttribute("index");
   const index = parseInt(indexStr as string);
   const list = document.getElementById("ModulesList") as HTMLElement;
   const lines = list.querySelectorAll("li");
   const iele = lines[index] as HTMLElement;
   if (iele.classList.contains("liActive")) {
      iele.classList.remove("liActive");
   } else {
      iele.classList.add("liActive");
   }
};

const slothParameters = ref<SlothParameter[]>([])

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
