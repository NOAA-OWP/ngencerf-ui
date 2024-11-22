<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Runs Tab</div>
    <div class="_help-subtitle">Display Users Previous Calibration jobs.</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>

    <table class="_help-table">
      <tbody>
        <tr>
          <td class="td1">New Button</td>
          <td class="td2">Starts a new calibration setup.</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Double Click</td>
          <td class="td2">Loads the selected calibration job. User will be taken to the Run/Status tab. (Same as right click/open)</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Statuses</td>
          <td class="td2"><strong>Description</strong></td>
        </tr>
        <tr>
          <td class="td1">Saved:</td>
          <td class="td2">Calibration setup has begun, but not yet completed.</td>
        </tr>
        <tr>
          <td class="td1">Ready:</td>
          <td class="td2">Calibration setup complete, but not run.</td>
        </tr>
        <tr>
          <td class="td1">Running:</td>
          <td class="td2">Calibration is currently running.</td>
        </tr>
        <tr>
          <td class="td1">Complete:</td>
          <td class="td2">Calibration job completed without any errors.</td>
        </tr>
        <tr>
          <td class="td1">Failed:</td>
          <td class="td2">Calibration job failed.</td>
        </tr>
        <tr>
          <td class="td1">Cancelled:</td>
          <td class="td2">Calibration job cancelled by users.</td>
        </tr>
      </tbody>
    </table>

    <table class="_help-table">
      <tbody>
        <tr>
          <td class="td1">Right Click</td>
          <td class="td2"><strong>Provides a context menu with the following options</strong></td>
        </tr>
        <tr>
          <td class="td1">Open:<br /></td>
          <td class="td2">Loads the selected calibration job. User will be taken to the Run/Status tab.</td>
        </tr>
        <tr>
          <td class="td1">Clone:</td>
          <td class="td2">Use the data from the selected calibration job as a baseline for a new calibration that will be added to the table.</td>
        </tr>
        <tr>
          <td class="td1">Delete:</td>
          <td class="td2">Delete the selected calibration job and all it's associated validation jobs. User will remain on this page.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

._help-table .td1 {
  width: 150px;
}

p {
  margin-left: 50px;
}
</style>
