<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Workflow - Run Status Tab</div>
    <div class="_help-subtitle">This tab provides the user the ability to review their calibration setup, which is shown
      in the summary area on the right side of the GUI.</div>
    <div class="_help-subtitle">The Status field will indicate if the required data has been
      entered.</div>
    <div class="_help-subtitle">If so the Status will be Ready and the Start button will be activated. Once the
      calibration run has started, the user can stop it before it completes by clicking the Stop button. 
      While a calibration is running, the running time is updated.</div>
    <div class="_help-subtitle">Plots will be generated at the user selected frequency which can be viewed while
      the calibration is being performed and when the calibration and validation run are complete.
    </div>
    <table class="_help-table">
      <tr>
        <td class="td1">START Button:</td>
        <td class="td2">Start the Calibration.</td>
      </tr>
      <tr>
        <td class="td1">STOP Button:</td>
        <td class="td2">Stop/cancel the calibration before it has completed.</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>
