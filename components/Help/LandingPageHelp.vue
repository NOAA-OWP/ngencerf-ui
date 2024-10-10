<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Landing Page</div>
    <p style="text-align:center;">
      This page will display the number of processes that are currently running, if any, along with any calibration runs in process of being setup, but not yet run.
    </p>
    <p class="text-center" style="color:orange;font-size:0.8em;">
      WARNING: Clicking the browser refresh button logs you out of ngenCERF, usually on your next action.
    </p>
    <br />
    <br />
    <p style="text-align:center;">
      To setup or run a Calibration, click on the <strong>Calibration</strong> button in the header.
    </p>
    <p style="text-align:center;">
      To view the results of a calibration, validation, or run a new validation, click on the <strong>Evaluate</strong> button in the header.
    </p>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

._help-table .td1 {
  width: 200px;
}
</style>
