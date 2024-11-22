<template>
  <div class="_help-page">
    <div class="_help-title">Calibration - Status/Run Tab</div>
    <div class="_help-subtitle">This tab provides the user the ability to review their calibration setup, run a Ready calibration
      and view plots during a run or after a run has finished.</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>
    <div style="margin-left: 75px; margin-top:20px;">
      <ul style="list-style-type: disc;">
        <li>The right side of each tab in the Calibration workflow shows the Progress towards completing a calibration setup
            and a summary of the choices made for the setup.</li>
        <li>Once all the required data has been entered, all checkmarks will be set 
            and the status will be Ready. Otherwise the status will be Saved or one of the finished status.</li>
        <li>Once the calibration job has started, after the 1st iteratoin, the user can view plots. These plots will be automatically updated
            based on the plot interval specified by the user.</li>
        <li>The user can stop a running job by clicking the Cancel button.</li>
        <li>For any status other than Saved and Ready, the user can view plots generated during the calibration and validation runs.</li>
      </ul>
    </div>
 
    <table class="_help-table">
      <tbody>
        <tr>
          <td class="td1">Submit Time</td>
          <td class="td2">Date/Time the job was submitted to run.</td>
        </tr>
        <tr>
          <td class="td1">Elapsed Time</td>
          <td class="td2">Time elapsed since the job was submitted.</td>
        </tr>
        <tr>
          <td class="td1">Iteration</td>
          <td class="td2">Iteration number completed.</td>
        </tr>
        <tr>
          <td class="td1">Status</td>
          <td class="td2">Job status.</td>
        </tr>
        <tr>
          <td class="td1">Display:</td>
          <td class="td2">Once at least one iteration has been completed, plots are available for monitoring the calibration 
            process. Use this pulldown to select the plot. A message will appear if the plot is not available yet. These plots
            are also available to view after the run is complete. Go to the Evaluation workflow to view the time series and other
            data associated with each plot.</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>

        <tr>
          <td class="td1">Run Button:</td>
          <td class="td2">Start the Calibration. Appears when job is in the Ready state.</td>
        </tr>
        <tr>
          <td class="td1">Cancel Button:</td>
          <td class="td2">Stop/cancel the calibration before it has completed. Appears only when a job is running.</td>
        </tr>

      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>
