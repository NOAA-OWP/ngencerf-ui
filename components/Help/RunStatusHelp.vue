<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Workflow - Run Status Tab</div>
    <div class="_help-subtitle">This tab provides the user the ability to review their calibration setup, which is shown
      in the summary area on the right side of the GUI.</div>
    <div class="_help-subtitle">The Status field will indicate if the required data has been
      entered.</div>
    <div class="_help-subtitle">If the status is Ready, Click the Run button to begin the calibration run. Once the
      calibration job has started, the user can stop it before it completes by clicking the Stop button.
      While a calibration is running, the running time is updated.</div>
    <div class="_help-subtitle">Plots will be generated at the user selected frequency and can be viewed while
      the calibration is being performed as well as when the calibration and validation run are complete.
    </div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>

    <table class="_help-table">
      <tbody>
        <tr>
          <td class="td1">Run Button:</td>
          <td class="td2">Start the Calibration.</td>
        </tr>
        <tr>
          <td class="td1">CANCEL Button:</td>
          <td class="td2">Stop/cancel the calibration before it has completed.</td>
        </tr>
        <tr>
          <td class="td1">Display:</td>
          <td class="td2">Once at least one iteration has been completed, plots are available for monitoring the calibration 
            process. Use this pulldown to select the plot. A message will appear if the plot is not available yet. These plots
            are also available to view after the run is complete. Go to the Evaluation workflow to view the time series and other
            data associated with each plot.</td>
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
