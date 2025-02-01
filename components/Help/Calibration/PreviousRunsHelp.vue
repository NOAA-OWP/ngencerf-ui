<template>
  <div class="_help-page">
    <div class="_help-title">Calibration - Calibration Runs Tab</div>
    <div class="_help-subtitle">Display list of users calibration jobs</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>

    <table class="_help-table">
      <thead>
        <th>Item</th>
        <th>Description</th>
      </thead>
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
          <td class="td1">Headwater Basin Gage Filter</td>
          <td class="td2" style="vertical-align:top;">Show only those jobs associated with the selected Gage ID</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Double Click</td>
          <td class="td2">Loads the selected calibration job. User will be taken to the Run/Status tab. (Same as right click/Open)</td>
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
          <td class="td1" style="font-weight:normal;">Saved</td>
          <td class="td2">Calibration setup has begun, but not yet completed.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Ready</td>
          <td class="td2">Calibration setup complete, but not run. The word Calibration may be present.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Running</td>
          <td class="td2">When Running is in the status, indicates the Calibration/Validation phase currently running.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Done</td>
          <td class="td2">Calibration job completed without any errors.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Failed</td>
          <td class="td2">Calibration job failed.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Cancelled</td>
          <td class="td2">Calibration job cancelled by user.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Server Error</td>
          <td class="td2">The server had an error before the job finished.</td>
        </tr>
      </tbody>
    </table>

    <table class="_help-table">
      <thead>
        <th>Menu Item</th>
        <th>Description</th>
      </thead>
      <tbody>
        <tr>
          <td class="td1">Right Click</td>
          <td class="td2"><strong>Provides a context menu with the following options</strong></td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Open<br /></td>
          <td class="td2">Loads the selected calibration job. User will be taken to the Run/Status tab.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Clone</td>
          <td class="td2">Use the data from the selected calibration job as a baseline for a new calibration that 
            will be added at the top of the table. User will remain on this page.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Delete</td>
          <td class="td2">Delete the selected calibration job and all it's associated validation jobs. User will remain on this page.</td>
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

._help-table .td1 {
  width: 150px;
}

p {
  margin-left: 50px;
}
</style>
