<template>
  <div class="_help-page">
    <div class="_help-title">Landing Page</div>
    <p style="text-align:center;line-height:20px;">
      Choose workflow to enter
    </p>
    <br />
    <p style="text-align:center;line-height:20px;">
      Displays number of calibration jobs running or being setup.
    </p>
    <br />
    <p style="text-align:center;line-height:20px;">
      There are 4 Workflows<br />
      <b>Calibration</b>, <b>Evaluation</b>, <b>Forecast</b> and <b>Verification</b> (aka Reforecast).
    </p>
    <div style="margin-top: 20px; margin-left:40px;">
      <ul style="list-style-type: disc;">
        <li> Click the Calibration button to setup, view or run a Calibration job.</li>
        <li> Click the Evaluation button to evaluate previously run calibration jobs.</li>
        <li> Click the Forecast button to run or view a forecast.</li>
        <li> Click the Verfification button to run or view a verification job.</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
