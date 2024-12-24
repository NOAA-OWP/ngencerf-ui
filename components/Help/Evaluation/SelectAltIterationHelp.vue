<template>
  <div class="_help-page">
    <div class="_help-title">Evaluation - Select Alternate Iteration</div>
    <div class="_help-subtitle">
      Use these tables to select the alternate iteration to run a validation.
    </div>
    <hr class="mt-2 mb-4" />
    <p style="font-weight: bold;">Run Details</p>
    <p style="margin-left:20px;">This table shows the metrics calculated for each iteration.
      The first line, NWM 3.0, are the metric values calculated from the NWM 3.0 retrospective data. 
      The second line contains the metric values from the best iteration as determined by the calibration program.
      This table scrolls in unison with the Corresponding Calibration Tuning Parameters table.
    </p>

    <p style="font-weight: bold;">Corresponding Calibration Tuning Parameters</p>
    <p style="margin-left:20px;">This table shows the value of the tuning parameters for each iteration.
      The first line contains the values from the best iteration as determined by the calibration program.
      This table scrolls in unison with the Run Details table.
    </p>

    <p style="font-weight: bold;">Iterations in grey have already been run and are unselectable.</p>
    <p style="font-weight: bold;">Select the iteration and click Next.</p>
    <p style="margin-left:20px;">You may have to scroll the tab down a bit to see the Next button.</p>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

._help-table .td1 {
  width: 300px;
}
</style>
