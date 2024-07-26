<template>
  <div id="Formulation" class="shrink-0">
    <div class="grid grid-cols-6 p-2 gap-2">
      <div class="col-1 col-span-1 row-span-2 p-2">
        <div class="mt-2 text-center">Modules</div>
        <div class="ml-6 mt-2">
          Group:
          <select id="ModuleGroupSelect" class="ml-3">
            <option value="all" selected>All</option>
          </select>
        </div>
        <ul id="ModulesList">
          <li
            v-for="(module, index) in formulation_modules"
            :index="index"
            @click="ModuleClicked"
          >
            {{ module }}
          </li>
        </ul>
      </div>
      <div class="col-2 col-span-5 p-2">
        <div class="group-cover-selection-wrapper w-60 float-left">
          <div class="mt-2 text-center">Groups CoveredBy Selections</div>
          <ul id="ModuleCoveredList">
            <li
              v-for="(module, index) in formulation_covered_groups"
              :index="index"
            >
              {{ module }}
            </li>
          </ul>
        </div><!-- /selection-wrapper -->
        <div class="sloth-variable-input-form ml-60">
          <div id="FormulationName" class="inline-block ml-20 mr-5 mt-3">
            Forumulation Name:
          </div>
          <div class="inline-block"><input type="text" /></div>
          <div id="SlothBackground">
            <div class="slothTitle text-xl mb-2">SLoTH Output Variable</div>
            <div>
              <div class="text-right inline-block slothLable mr-4 mb-2">
                SLoth Name:
              </div>
              <input class="w-3/5 rounded-lg" type="text" /><br />
              <div class="text-right inline-block slothLable mr-4 mb-2">
                For Module:
              </div>
              <select class="w-3/5 rounded-lg">
                <option value="" selected disabled>...</option>
              </select>
              <br />
              <div class="text-right inline-block slothLable mr-4 mb-2">
                Module Param:
              </div>
              <input class="w-3/5 rounded-lg" type="text" /><br />
            </div>

            <div class="grid grid-rows-1 mt-4">
              <div class="grid grid-cols-2">
                <div class="col-span-1">
                  <div class="text-right inline-block w-1/5 mr-4 mb-2">
                    Value:
                  </div>
                  <input class="w-3/5 rounded-lg" type="number" /><br />
                  <div id="AddUpdate">
                    <button class="nlgButton mt-4 ml-10">Add / Update</button>
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="text-right inline-block w-1/5 mr-4 mb-2">
                    Count:
                  </div>
                  <input class="w-3/5 rounded-lg" type="number" /><br />
                  <div class="text-right inline-block w-1/5 mr-4 mb-2">
                    Type:
                  </div>
                  <select class="w-3/5 rounded-lg" type="number">
                    <option value="" selected disabled>...</option>
                  </select>
                  <br />
                  <div class="text-right inline-block w-1/5 mr-4 mb-2">
                    Units:
                  </div>
                  <select class="w-3/5 rounded-lg" type="number">
                    <option value="" selected disabled>...</option>
                  </select>
                  <br />
                  <div class="text-right inline-block w-1/5 mr-4 mb-2">
                    Location:
                  </div>
                  <select class="w-3/5 rounded-lg" type="number">
                    <option value="" selected disabled>...</option>
                  </select>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div> <!-- /input-form-wrapper -->
      </div>
      <div class="col-2 col-span-5 p-2">
        <DataTable :value="slothParameters" scrollable scroll-height="300px" >
          <Column field="outputVar" header="SLoTH Output Var" sortable></Column>
          <Column field="metadata" header="Metadata Properties" sortable></Column>
          <Column field="module" header="For Module" sortable></Column>
          <Column field="moduleParam" header="Module Param" sortable></Column>
          <Column field="value" header="Value" sortable></Column>
        </DataTable> 
      </div>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import Index from "~/pages/index.vue";
import { mockFormulationSlothParametersData } from "~/mockApi/formulationSlothData";
import type { SlothParameter } from "~/composables/NextGenModel";

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
  mockFormulationSlothParametersData().forEach( ( slothData: any, index ) => {
      console.log( slothData );
      slothParameters.value.push( slothData )
    })
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#Formulation {
  width: auto;
}
ul#ModulesList,
ul#ModuleCoveredList {
  border: 1px solid #000;
  margin: 20px 0 0 20px;
  li {
    background-color: $ngwcp_groupsbkg;
    border-bottom: 1px solid #000;
    padding: 2px 2px 2px 5px;
  }
  .liActive {
    background-color: #977752;
  }
}

#ModuleGroupSelect {
  width: 130px;

}
ul#ModulesList {
  li {
    background-color: $ngwcp_groupsbkg;
  }
  li:hover {
    background-color: $ngwcp_primary3;
    color: white;
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

.nlgButton {
  width: 132px;
  height: 55px;
  background-color: $ngwcp_primary1;
  color: white;
  border-radius: 20px;
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
