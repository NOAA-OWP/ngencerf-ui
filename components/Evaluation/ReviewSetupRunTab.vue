<template>
    <div class="grid grid-rows-11">
        <div class="row-span-1">
            <div id="CalibrationRunId" class="mt-5">
                Calibration Run ID {{ 265 }}
            </div>
        </div>
        <div class="row-span-5">
            <div class="grid grid-cols-2">
                <div class="col-span-1">
                    <div id="ScalarTable" class="text-left mt-3 bordered p-3">
                        <div class="tableTitle">Scalar Variables</div>
                        <DataTable class="dtable" :value="scalerTempData" scrollable scroll-height="220px"
                            fixedHeader=true>
                            <Column field="parameter" header="Variable" sortable></Column>
                            <Column field="init_value" header="Associated Reference Dataset" sortable></Column>
                        </DataTable>
                    </div>

                </div>
                <div class="col-span-1">
                    <div id="GriddedTable" class="text-le mt-3 bordered p-3">
                        <div class="tableTitle">Gridded/Semi-Distributed Variables</div>
                        <DataTable class="dtable" :value="griddedTempData" scrollable scroll-height="220px"
                            fixedHeader=true>
                            <Column field="parameter" header="Variable" sortable></Column>
                            <Column field="init_value" header="Associated Reference Dataset" sortable></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
        <div class="row-span-5">
            <div class="grid grid-cols-2">
                <div class="col-span-1">

                    <div id="InterationTable" class="text-center mt-3 bordered p-3">
                        <div class="tableTitle"> Interation {{ 87 }}</div>
                        <DataTable class="dtable" :value="griddedTempData" scrollable scroll-height="220px"
                            fixedHeader=true>
                            <Column field="parameter" header="Variable" sortable></Column>
                            <Column field="init_value" header="Associated Reference Dataset" sortable></Column>
                        </DataTable>
                    </div>
                </div>

                <div class="col-span-1">
                    <div class="timeBlocks">
                        <div>
                            Simulation Start:
                            <VueDatePicker class="datePickers dp__theme_dark" v-model="avSimStartTime"
                                time-picker-inline utc format="yyyy-mm-dd  hh:mm" />
                        </div>
                        <div>
                            Simulation End:
                            <VueDatePicker class="datePickers dp__theme_dark" v-model="avSimEndTime" time-picker-inline
                                utc format="yyyy-mm-dd  hh:mm" />
                        </div>
                        <div>
                            Validation Start:
                            <VueDatePicker class="datePickers dp__theme_dark" v-model="avCalStartTime"
                                time-picker-inline utc format="yyyy-mm-dd  hh:mm" />
                        </div>
                        <div>
                            Validation End:
                            <VueDatePicker class="datePickers dp__theme_dark" v-model="avCalEndTime" time-picker-inline
                                utc format="yyyy-mm-dd  hh:mm" />
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

//temp data
const scalerTempData = [
    { parameter: "Streamflow", init_value: "NWM v3.0 Retrospectdive" },
    { parameter: "Basin-Averaged SWE", init_value: "SNOTEL" },
    { parameter: "Basin-Averaged Soil Moisture", init_value: "SCAN" }
];

const griddedTempData = [
    { parameter: "Streamflow", init_value: "SNODAS" },
    { parameter: "Soil Moisture", init_value: "NWM v3.0 Retrospectdive" },
]

const avSimStartTime = ref();
const avSimEndTime = ref();
const avCalStartTime = ref();
const avCalEndTime = ref();
</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#CalibrationRunId {
    font-size: 2em;
    text-align: center;
}
.timeBlocks {
    width: 460px;
    font-size: 0.9em;
    text-align: right;
    margin: 0 auto;
    border: 1px solid black;
    border-radius: 10px;
    padding: 8px;
}

.datePickers {
    width: 320px;
    padding-right: 15px;
    display: inline-block;
    border-radius: 5px;
}

.tableTitle {
    margin: 15px 0 10px 0;
    font-size: 1.5em;
}
</style>