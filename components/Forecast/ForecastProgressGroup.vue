<template>
  <client-only>
   <table id="ForecastProgressTable" class="prevent-select">
     <tr>
       <td><i v-if="props.progress.headwater_basin_gage" class="pi pi-check font-bold  checkMark"></i></td>        
       <td class="ptype">Headwater Basin Gage</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.formulation" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Formulation</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.parameters_set" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Parameters Set</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.time_period" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Time Period</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.scaler_gridded_vars" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Scaler/Gridded Vars</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.output_variable" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Output Variable</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.parameters_set" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Parameters Set</td>
     </tr>

   </table>
 </client-only>
</template>

<script lang="ts" setup>
const props = defineProps<{
 progress: ForecastProgress;
}>();
</script>

<style lang="scss" scoped>
#ForecastProgressTable {
 width: 100%;
 margin-left: 15px;
 tr {
   line-height: calc(1.3vw + 0.41vh); 
 }
 .checkMark {
   text-align: right;
 }
 .ptype {
   width: 90%5%;

 }
}
</style>
