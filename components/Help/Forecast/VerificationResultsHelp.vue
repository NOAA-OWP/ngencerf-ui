<template>
  <div class="_help-page">
    <div class="_help-title">Forecast - Verification Results Tab</div>
    <p id="help-subtitle" class="_help-subtitle">
      Displays results for the selected Verification run.
    </p>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>
    <hr class="my-6 border-black" />
    <p class="text-center font-medium">
        All times referenced are in Coordinated Universal Time (UTC).
    </p>
    <hr class="my-6 border-black" />
    <table class="_help-table" aria-describedby="help-subtitle">
      <thead>
        <tr>
          <th class="td1">Item</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td1">Display</td>
          <td class="td2">Select a plot or log to display.</td>
        </tr>
        <tr>
            <td class="td1">Forecast Job ID</td>
            <td class="td2">Forecast Job ID as the basis for the Verification run.</td>
        </tr>
        <tr>
          <td class="td1">Verification Job ID</td>
          <td class="td2">This Verification job ID.</td>
        </tr>
        <tr>
            <td class="td1">Configuration</td>
            <td class="td2">Configuration selected for the forecast run.
            </td>
        </tr>
        <tr>
            <td class="td1">Cycle Date</td>
            <td class="td2">Cycle Date selected for the forecast run.
            </td>
        </tr>
        <tr>
            <td class="td1">Status</td>
            <td class="td2">
                Done
            </td>
        </tr>
        <tr>
            <td class="td1">Submit Time</td>
            <td class="td2">Date/Time the job was submitted to run.
            </td>
        </tr>
        <tr>
          <td class="td1">Elapsed Time</td>
          <td class="td2">Time elapsed since the job was submitted. Time is in days, HH:MM:SS</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
