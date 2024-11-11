<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Landing Page</div>
    <div class="_help-subtitle">Displays table of previous calibration run with some basic details.</div>
    <p class="text-center" style="color:orange;font-size:0.8em;">
      WARNING: Clicking the browser refresh button logs you out of ngenCERF, usually on your next action.
    </p>

    <table class="_help-table">
      <tbody>
        <tr>
          <td class="td1"></td>
          <td class="td2"><strong>New Button starts a new calibration setup.</strong></td>
        </tr>
        <tr>
          <td class="td1"></td>
          <td class="td2"><strong>Statuses:</strong></td>
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
          <td class="td1">&nbsp;</td>
          <td class="td2"><strong>User can right click on an entry in the table to:</strong></td>
        </tr>
        <tr>
          <td class="td1">Open:<br /></td>
          <td class="td2">If job is Ready, Running, Complete, Failed or Cancelled user will be taken to the Results tab,
            otherwise user will be taken to a setup tab..</td>
        </tr>
        <tr>
          <td class="td1">Clone:</td>
          <td class="td2">Use the data from the selected calibration job as a baseline for to setup a new calibration.
            User will be taken to the Headwater Basin Gage tab..</td>
        </tr>
        <tr>
          <td class="td1">Delete:</td>
          <td class="td2">Delete the selected job. User will remain on this page.</td>
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
