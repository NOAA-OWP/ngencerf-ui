<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Landing Page</div>
    <div class="_help-subtitle">Displays table of previous calibration run with some basic details.</div>

    <table class="_help-table">
      <tr>
        <td class="td1"></td>
        <td class="td2"><strong>Displays status of any currently running job or jobs not yet ready to run.</strong></td>
      </tr>
      <tr>
        <td class="td1"></td>
        <td class="td2"><strong>User selects one of the available workflows from the header.</strong></td>
      </tr>
      <tr>
        <td class="td1"></td>
        <td class="td2">&nbsp;</td>
      </tr>
      <tr>
        <td class="td1">Calibration:</td>
        <td class="td2">Setup a new calibration, finish a saved calibration or review results of a previous calibration.
        </td>
      </tr>
      <tr>
        <td class="td1">Evaluation:</td>
        <td class="td2">Evaluate results from a previously run calibration and/or setup and execute a validation run.
        </td>
      </tr>
      <tr>
        <td class="td1">Forecast:</td>
        <td class="td2">Setup a forecast based on a formulation from a previously run calibration.</td>
      </tr>
      <tr>
        <td class="td1">Verification:</td>
        <td class="td2">CSetup a forecast verification run from a previously executed forecast run.</td>
      </tr>

    </table>
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
