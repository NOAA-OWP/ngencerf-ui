<template>
  <div id="PgTitle" class="mt-4 text-center text-xl">
    <div class="tabTitles pb-3">Validation Run Setup</div>
  </div>
  <div class="grid grid-rows-9">
    <div class="row-span-2">
      <div class="grid grid-cols-2">
        <div class="col-span-1 timeBox">
          <div>Simulation Start:
            <VueDatePicker class="datePickers dp__theme_dark" v-model="simStartTime" time-picker-inline utc
              format="yyyy-mm-dd  hh:mm" />
          </div>
          <div>Simulation End:
            <VueDatePicker class="datePickers dp__theme_dark" v-model="simEndTime" time-picker-inline utc
              format="yyyy-mm-dd  hh:mm" />
          </div>
        </div>
        <div class="col-span-1 timeBox">
          <div>Validation Start:
            <VueDatePicker class="datePickers dp__theme_dark" v-model="calStartTime" time-picker-inline utc
              format="yyyy-mm-dd  hh:mm" />
          </div>
          <div>Validation End:
            <VueDatePicker class="datePickers dp__theme_dark" v-model="calEndTime" time-picker-inline utc
              format="yyyy-mm-dd  hh:mm" />
          </div>
        </div>
      </div>
    </div>

    <div id="ValRunSelects" class="row-span-1">
      <div class="grid grid-cols-2">
        <div class="col-span-1">
          Scalar Values<br />
          <select id="ScalarValues" class="selects mt-2">
            <option>...</option>
          </select>
          <button class="ngenButtonDiv addBtn">Add</button>
        </div>

        <div class="col-span-1">
          Gridded/semi-distributed Variables<br />
          <select id="GriddedVars" class="selects mt-2">
            <option>...</option>
          </select>
          <button class="ngenButtonDiv addBtn">Add</button>
        </div>
      </div>
    </div>



    <div id="SvTables" class="row-span-6 mt-5">
      <div class="grid grid-cols-2">
        <div class="col-span-1">

          <div id="ScalarTable" class="text-center mt-3 bordered p-3">
            <DataTable class="dtable" :value="scalerTempData" scrollable scroll-height="220px" fixedHeader=true>
              <Column field="parameter" header="Variable" sortable></Column>
              <Column field="init_value" header="Associated Reference Dataset" sortable></Column>
            </DataTable>
            <div class="mb-5 ngenButtonDiv clearTableBtn"><button>Clear <i class="pi pi-arrow-up"></i></button>
            </div>

          </div>
        </div>

        <div class="col-span-1">

          <div id="GriddedTable" class="text-center mt-3 bordered p-3">
            <DataTable class="dtable" :value="griddedTempData" scrollable scroll-height="220px" fixedHeader=true>
              <Column field="parameter" header="Variable" sortable></Column>
              <Column field="init_value" header="Associated Reference Dataset" sortable></Column>
            </DataTable>
            <div class="mb-5 ngenButtonDiv clearTableBtn"><button>Clear <i class="pi pi-arrow-up"></i></button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const simStartTime = ref();
const simEndTime = ref();
const calStartTime = ref();
const calEndTime = ref();

const scalerTempData = [
  {
    parameter: "Streamflow",
    init_value: "NWM v3.0 Retrospectdive"
  },
  {
    parameter: "Basin-Averaged SWE",
    init_value: "SNOTEL"
  },
  {
    parameter: "Basin-Averaged Soil Moisture",
    init_value: "SCAN"
  }
];

const griddedTempData = [
  {
    parameter: "Streamflow",
    init_value: "SNODAS"
  },
  {
    parameter: "Soil Moisture",
    init_value: "NWM v3.0 Retrospectdive"
  },
]

</script>

<style lang="scss" scoped>
#ValRunSelects>div>div {
  margin: 0 auto;
}

#ScalarTable,
#GriddedTable {
  width: 515px;
  margin: 0 auto;
}

.timeBox {
  margin: 0 auto;
  padding: 15px;
  text-align: right;
  border: 1px solid #000;
  border-radius: 10px;
}

.clearTableBtn {
  width: 100px;
  height: 40px;
}

.dtable {
  border: 1px solid black;
  margin-bottom: 8px;
}
.selects {
  width: 200px;
}

.addBtn {
  margin-left: 8px;
  width: 80px;
}

.datePickers {
  width: 250px;
  display: inline-block;
}
</style>
