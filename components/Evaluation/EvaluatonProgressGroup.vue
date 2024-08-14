<template>
  <client-only>
   <table id="EvaluationProgressTable" class="prevent-select">
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
       <td class="ptype">Progress Parameters set</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.calibration_output_variable" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Calibration Output Variable</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.metrics" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Metrics</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.time_period" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Time Period</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.output_variable" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Output Variable</td>
     </tr>
     <tr>
       <td><i v-if="props.progress.reference_dataset" class="pi pi-check font-bold checkMark"></i></td>
       <td class="ptype">Reference Dataset</td>
     </tr>

   </table>
 </client-only>
</template>

<script lang="ts" setup>
const props = defineProps<{
 progress: EvaluationProgress;
}>();
</script>

<style lang="scss" scoped>
#EvaluationProgressTable {
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
