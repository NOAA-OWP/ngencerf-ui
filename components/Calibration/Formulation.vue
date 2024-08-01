FormulationName<template>
  <div id="Formulation">

    <div class="grid grid-rows-12">
      <div class="grid row-span-1">
        <div class="grid grid-cols-8">
          <div class="col-span-2">&nbsp;</div>
          <div class="col-span-4">
            <div id="FormulationName" class="inline-block ml-20 mr-5 mt-3" aria-label="Forumulation Name" title="Formulation Name">
              Forumulation Name:
            </div>
            <div class="inline-block" aria-label="Input Forumulation Name" title="Input Formulation Name" ><input type="text" /></div>
          </div>
          <div class="col-span-2">&nbsp;</div>
        </div>
      </div>

      <div class="row-span-5">
        <div class="grid grid-cols-12">
          <div class="col-span-3">&nbsp;</div>
          <div class="col-span-2">
            <div class="mt-2 text-center"><strong>Modules</strong></div>
            <div class="mb-2 mt-2" aria-label="Group Select" title="Group Select">
              Groups: <select id="ModuleGroupSelect" class="ml-2">
                <option value="all" selected>All</option>
              </select>
            </div>
            <ul id="ModulesList">
              <li v-for="(module, index) in formulation_modules" :index="index" @click="ModuleClicked">
                {{ module }}
              </li>
            </ul>
          </div>
          <div class="col-span-2">&nbsp;</div>
          <div class="col-span-5">
            <div class="group-cover-selection-wrapper w-60 float-left">
              <div class="mt-2 mb-2 text-center"  aria-label="List of groups covered by selection" title="List of groups covered by selection"><strong>Groups Covered <br />By Selections</strong></div>
              <table id="CoveredBy" class="ml-10">
                <tr>
                  <td class="checkArea"><i v-if="true" class="pi pi-check font-bold"></i></td>
                  <td class="pl-3">Glacier</td>
                </tr>
                <tr>
                  <td class="checkArea"><i v-if="true" class="pi pi-check font-bold"></i></td>
                  <td class="pl-3">Snowmelt</td>
                </tr>
                <tr>
                  <td class="checkArea"><i v-if="true" class="pi pi-check font-bold"></i></td>
                  <td class="pl-3">Evapotranspiration</td>
                </tr>
                <tr>
                  <td class="checkArea"><i v-if="true" class="pi pi-check font-bold"></i></td>
                  <td class="pl-3">Rainfall / Runoff</td>
                </tr>
                <tr>
                  <td class="checkArea"><i v-if="true" class="pi pi-check font-bold"></i></td>
                  <td class="pl-3">Soil Moisture</td>
                </tr>
                <tr>
                  <td class="checkArea"><i v-if="true" class="pi pi-check font-bold"></i></td>
                  <td class="pl-3">Channel Routing</td>
                </tr>
                <tr>
                  <td class="checkArea"><i v-if="true" class="pi pi-check font-bold"></i></td>
                  <td class="pl-3">Coastal</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="col-span-1">&nbsp;</div>
        </div>
      </div>
      <div class="row-span-6">


        <div class="text-center">
          <input type="checkbox" id="SlothCheck" class="ml-4" @click="showSloth" />
          <label class="inline-block text-xl mb-2" for="SlothCheck">&nbsp;Add SLoTH output variable for
            formulation</label>
          <label class="inline-block text-xl pl-10 pr-4" for="SlothName">SLoTH Name:</label><input
            class="inline-block w-auto" id="SlothName" type="text">
          <div class="ngenButtonDiv ml-3 inline-block">
            <button id="SlothAddBtn">Add</button>
          </div>
          <div id="SlothDataTable" v-show="showSlothVariables" class="items-center ml-10 mr-10 mt-4">
            <DataTable class="stripe" :value="slothParameters" scrollable scroll-height="300px">
              <Column field="outputVar" header="SLoTH Output Var" sortable></Column>
              <Column field="COUNT" header="Count" sortable></Column>
              <Column field="TYPE" header="Type" sortable></Column>
              <Column field="UNITS" header="Units" sortable></Column>
              <Column field="LOCATION" header="Location" sortable></Column>
              <Column field="module" header="For Module" sortable></Column>
              <Column field="moduleParam" header="Module Param" sortable></Column>
              <Column field="value" header="Value" sortable></Column>
            </DataTable>
          </div>
        </div>


      </div>

    </div>


  </div>

</template>

<script lang="ts" setup>
import Index from "~/pages/index.vue";
import { mockFormulationSlothParametersData } from "~/mockApi/formulationSlothData";
import type { SlothParameter } from "~/composables/NextGenModel";

const loading = ref(true);

const formulation_modules = [
  "Sloth",
  "GC2D",
  "TopFlow",
  "Noah-OWP",
  "Snow-17",
  "UEB",
  "CFE-S",
  "CFE-X",
  "TopModel",
  "Sac-SMA",
  "LASAM",
  "SMP",
  "SoilFreezeThaw",
  "T-Route",
  "LSTM",
  "SCHISM",
  "SFINCS",
  "Unit Hydrograph",
];

const formulation_covered_groups = [
  "Inject",
  "Glacier",
  "Snowmelt",
  "Evapotranspiration",
  "Rainfall / Runoff",
  "Soil Moisture",
  "Channel Routing",
  "Coastal",
];

const showSlothVariables = ref(false);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});

const showSloth = (e: MouseEvent) => {
  const ele = <HTMLInputElement>document.getElementById("SlothCheck");
  showSlothVariables.value = ele.checked as boolean;

}

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

onMounted(() => {
  mockFormulationSlothParametersData().forEach((slothData: any, index) => {
    console.log(slothData);
    slothParameters.value.push(slothData)
  })
});
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
