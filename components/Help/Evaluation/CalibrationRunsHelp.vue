<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Evaluation Workflow - Calibration Runs Tab</div>
    <!-- <div class="_help-subtitle">&nbsp;</div> -->
    <p class="text-center">
      Displays table of previous calibration run with some basic details. User selects one of the runs in the list to
      evaluate.<br />If the run has multiple validation runs, the user will be provided a list of the associated calibrations
      runs to select from.
    </p>
    <hr class="mt-2 mb-4" />
    <div class="mb-1">Filter the entries in the table by:</div>
    <ul class="helpfile-ul mb-4 ml-8">
      <li>The Headwater Basin Gage</li>
      <li>Whether or not the calibration run has a validation run.</li>
    </ul>
    <p>User can right click on an entry in the table to Delete the selected job. User will remain on this tab.</p>
    <p>Once the job is selected, the job details are displayed in the summary area.</p>
    <p>The user can then click the Evaluate button to be taken to the visualizer for evaluation the calibration run or
      choose to setup a new validation run.</p>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

.helpfile-ul {
  list-style-type:disc !important;
}

._help-table .td1 {
  width: 300px;
}
</style>
