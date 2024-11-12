<template>
  <!-- Setup Forecast Runs Tab -->
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-4">
      <div class="row-span-1">
        <div class="col-span-1 mt-8">
          <h2>Cycle</h2><br />
          <Dropdown class="mt-2" id="ShortRangeForecast" v-model="cycle" :options="cycleOptions"
            placeholder="Short Range Forecast"></Dropdown>
        </div>
      </div>

      <div class="row-span-2">&nbsp;</div>

      <div class="row-span-1">
        <h2>Status: {{ Status }}</h2><br />
        <Button class="ngenButtonDiv-green w-40">Run</Button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">

const cycle = ref();
const cycleOptions = ref();

const Status = ref("Ready");
</script>

<style lang="scss" scoped>
.p-select {
  width: 300px;
  border: 1px solid #ccc !important;
  height: 40px;
}
</style>