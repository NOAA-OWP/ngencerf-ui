<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-4">
      <div class="row-span-2">
        <div class="grid grid-cols-2  mb-5 mt-10">
          <div class="col-span-1 ml-10">
            Select Run Typ:e<br />
            <div class="mt-5">
              <RadioButton v-model="observedForcing" inputId="observedForcing" name="observedForcing" />
              <label for="observedForcing" class="ml-4">Use Observed Forcing</label><br />
            </div>
            <div class="mt-5">
              <RadioButton v-model="forcingSource" inputId="forcingSource" name="forcingSource"></RadioButton>
              <label for="observedForcing" class="ml-4">Use Forecast Forcing</label>
            </div>
          </div>

          <div class="col-span-1">
            Select Forcing Type:<br />
            <Dropdown class="mt-5" id="Groups" v-model="forcingType" :options="forcingOptions"></Dropdown>
          </div>
        </div>
      </div>

      <div class="row-span-2 mt-10">
        <div class="grid grid-cols-2">
          <div class="col-span-1 ml-10">
            <div class="mt-5">
              <label for="observedForcing" class="ml-4">Use Forecast Forcing</label>
              <Dropdown class="mt-5" id="Groups" v-model="forcingType" :options="forcingOptions"></Dropdown>
            </div>
          </div>
          <div class="col-span-1">
            <div class="mt-5">
              <label for="observedForcing" class="ml-4">Use Forecast Forcing</label>
              <Dropdown class="mt-5" id="Groups" v-model="forcingType" :options="forcingOptions"></Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';
onMounted(() => {
  hilightTab(ForecastTabs.tab_selectAltIteration);
  
})


const observedForcing = ref();
const forcingSource = ref();

const forcingType = ref();
const forcingOptions = ref([]);
</script>

<style lang="scss" scoped>
.p-select {
  width: 300px;
  border: 1px solid #ccc !important;
  height: 40px;
}
</style>