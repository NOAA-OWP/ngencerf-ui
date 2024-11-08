<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Evaluation Workflow - Select Parameter Set Tab</div>
    <!-- <div class="_help-subtitle">&nbsp;</div> -->
    <p class="text-center">
      Select the parameter set to use for the validation run.
    </p>
    <hr class="mt-2 mb-4" />
    <div class="mb-1">Run Details Table:</div>
    <ul class="helpfile-ul mb-4 ml-8">
      <li>The 1st row under the header is a sticky row and will contain the retrospective metrics. It will always remain
        just under the header.</li>
      <li>The 2nd row under the head is a sticky row and will contain the metrics associated with the best set of
        parameters determined from the calibration run. It will always remain just under the 1st row containing the
        retrospective metrics.</li>
    </ul>

    <div class="mb-1">Corresponding Calibration Parameters Table:</div>
    <ul class="helpfile-ul mb-4 ml-8">
      <li>The 1st row under the header is a sticky row and will contain the best set of parameters it will always remain just under the header.</li>
      <li>The same worker/iteration number shall be shown in both tables. In other words, they are tied together.</li>
    </ul>

    <p>Select a row and click Save to use that Parameter set for the validation run.</p>
    <p>Once the job is selected, the job details are displayed in the summary area.</p>

  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

.helpfile-ul {
  list-style-type: disc !important;
}

._help-table .td1 {
  width: 300px;
}
</style>
