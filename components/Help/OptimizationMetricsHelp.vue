<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Workflow - Optimization / Metrics Tab</div>
    <div class="_help-subtitle">This tab provides the user the ability to select the optimization algorithm, the objective
      function, the calibration stop criteria, the plot generation frequency and metrics. By default, the ngen-cal
      program does not calculate the Categorical Metrics, POD, CSI, and FAR or the Event Based Metrics, PKBIAS, PKTE,
      and EVBIAS.</div>

    <table class="_help-table">
      <tr>
        <td class="td1">Optimization Algorithm:</td>
        <td class="td2">Select from the dropdown which optimization algorithm to use for the calibration. Once one is
          selected any required algorithm parameters will be populated in the Parameter table. </td>
      </tr>
      <tr>
        <td class="td1">Algorithm Parameters:</td>
        <td class="td2">The parameter name is provided. The user must provide the value.</td>
      </tr>
      <tr>
        <td class="td1">Calibration Stop Criteria:</td>
        <td class="td2">The number of iterations for each worker to execute while performing calibration. DDS has one
          worker, but both GWO and PSO have 20 workers.
        </td>
      </tr>
      <tr>
        <td class="td1">Objective Function:</td>
        <td class="td2">If a Categorical metric is not selected as the objective function, the user can select to have
          the program also calculate the Categorical Metrics.
        </td>
      </tr>
      <tr>
        <td class="td1">Calculate Categorical Metrics</td>
        <td class="td2">If an Event Based metric is not selected as the objective function, the user can select to have
          the program also calculate the Event Based Metrics.</td>
      </tr>
      <tr>
        <td class="td1">SAVE Button:</td>
        <td class="td2">Save data from the tab. NEXTPartial saves are allowed.</td>
      </tr>
      <tr>
        <td class="td1">RESET Button:</td>&nbsp;
        <td class="td2">Reset data to default information for the Optimization and Metrics Tab only.</td>
      </tr>
      <tr>
        <td class="td1">Prev Button:</td>
        <td class="td2">Move to the Tuning Controls Tab. If there is any unsaved data, the user will first be prompted
          to save.</td>
      </tr>
      <tr>
        <td class="td1">Next Button:</td>
        <td class="td2">Move to the Run/Status Tab. If there is any unsaved data, the user will first be prompted
          to save.</td>
      </tr>
    </table>
    <div class="mt-4">
      <img class="mx-auto" width="70%" :src="image1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import image1 from "@/assets/styles/img/OptimizationMetricsTable.png"
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>
