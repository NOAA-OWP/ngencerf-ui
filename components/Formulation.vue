<template>
  <div id="Formulation">
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-5 gap-20">
        <div class="grid grid-cols-2 gap-15">
          <div class="col-span-1">
            <div class="mt-2 text-center">Modules</div>
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

          <div class="col-span-1">
            <div class="mt-2 text-center">Groups CoveredBy Selections</div>
            <div>
              <ul id="ModuleCoveredList">
                <li
                  v-for="(module, index) in formulation_covered_groups"
                  :index="index"
                >
                  {{ module }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-7">
        <div class="grid grid-rows-12 gap-3">
          <div class="row-span-1">
            <div id="FormulationName" class="inline-block ml-20 mr-5 mt-3">
              Forumulation Name:
            </div>
            <div class="inline-block"><input type="text" /></div>
          </div>
          <div class="row-span-11">
            <div id="SlothBackground">
              <div class="slothTitle text-xl mb-2">SLoTH Output Variable</div>
              <div class="ml-8">
                <div class="text-right inline-block w-1/5 mr-4 mb-2">
                  SLoth Name:
                </div>
                <input class="w-3/5 rounded-lg" type="text" /><br />
                <div class="text-right inline-block w-1/5 mr-4 mb-2">
                  For Module:
                </div>
                <select class="w-3/5 rounded-lg">
                  <option value="" selected disabled>...</option>
                </select>
                <br />
                <div class="text-right inline-block w-1/5 mr-4 mb-2">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Index from "~/pages/index.vue";

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
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#Formulation {
  width: 60vw;
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
  width: 615px;
  background-color: $ngwcp_groupsbkg;
  border-radius: 30px;
  border: 1px solid #000;
  padding: 15px;
  margin-left: 20px;
}

.nlgButton {
  width: 132px;
  height: 75px;
  background-color: $ngwcp_primary1;
  color: white;
  border-radius: 20px;
}
h1 {
  margin-top: 20px;
  text-align: center;
}
</style>
