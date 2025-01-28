<template>
  <div class="_help-page">
    <div class="_help-title">Evaluation - Evaluate Tab</div>
    <div class="_help-subtitle">
      Examine plots, times series and other information related to a calibration.
    </div>

  </div>
  <hr class="mt-2 mb-4" />
  <table class="_help-table">
    <thead>
      <th class="td1">Item</th>
      <th>Description</th>
    </thead>
    <tbody>
        <tr>
          <td class="td1">New Validation Button</td>
          <td class="td2">Select an alternate iteration to run a validation to generate the associated plots.</td>
        </tr>
        <tr>
          <td class="td1">Show Calibration Details Link</td>
          <td class="td2">A window will be displayed summarizing the details for the calibration.</td>
        </tr>
      </tbody>
    </table>

  <hr class="mt-2 mb-4" />
  <p class="text-center" style="font-weight: bold;">Calibration Plots</p>
  <table class="_help-table">
    <thead>
      <th class="td1">Item</th>
      <th>Description</th>
    </thead>
    <tbody>
        <tr>
          <td class="td1">Hydrograph evolution</td>
          <td class="td2">Comparison of streamflow time series between observation and simulations from the control, last, and best runs. Associated data displayed in adjacent table.</td>
        </tr>
        <tr>
          <td class="td1">Objective Funtion evolution</td>
          <td class="td2">Scatter plot of objective function vs iteration number. Associated data displayed in adjacent table.</td>
        </tr>
        <tr>
          <td class="td1">Metric evolution</td>
          <td class="td2">Scatter plots of objective function and each other metric vs iteration number. Associated data displayed in adjacent table.</td>
        </tr>
        <tr>
          <td class="td1">Parameter evolution</td>
          <td class="td2">Scatter plot of each calibration parameter vs iteration number. Associated data displayed in adjacent table.</td>
        </tr>
        <tr>
          <td class="td1">Scatterplot streamflow</td>
          <td class="td2">Scatter plot of observed streamflow vs simulated streamflow from the control, best, and last runs. Associated data displayed in adjacent table.</td>
        </tr>
        <tr>
          <td class="td1">Metrics vs Objective Function</td>
          <td class="td2">Scatter plots of objective function and each other metric. Associated data displayed in adjacent table.</td>
        </tr>
        <tr>
          <td class="td1">Streamflow Precipitation</td>
          <td class="td2">Same as Hydrograph evolution but here precipitation time series is add at the top using inverted y-axis.
            Data for this plot is calcuated internally by the program and unavailable for table display.
          </td>
        </tr>
        <tr>
          <td class="td1">Flow Duration Curves</td>
          <td class="td2">Comparison of flow duration curve (FDC) between streamflow observation and simulations from the control, last, and best runs.
            Data for this plot is calcuated internally by the program and unavailable for table display.
          </td>
        </tr>
      </tbody>
    </table>
  <br />
  <p class="text-center" style="font-weight: bold;">Validation Plots</p>
  <table class="_help-table">
      <thead>
        <th class="td1">Item</th>
        <th>Description</th>
      </thead>
      <tbody>
        <tr>
          <td class="td1">Bar Chart Metrics</td>
          <td class="td2">Bar chart comparing metrics from best & control validation runs for each evaluation period (calib, valid. full). 
            Worker is also charted if evaluating an alternate iteration validation.
            Associated data displayed in adjacent table.
          </td>
        </tr>
        <tr>
          <td class="td1">Flow Duration Curves Validation</td>
          <td class="td2">Plot of flow duration curve comparing best & control validation runs with observation for each evaluation period (calib, valid, full).
            Data for this plot is calcuated internally by the program and unavailable for table display.
          </td>
        </tr>
        <tr>
          <td class="td1">Hydrograph Validation</td>
          <td class="td2">Plot comparing streamflow time series from best and control validation runs with observed streamflow.
            Data for this plot is calcuated internally by the program and unavailable for table display.
          </td>
        </tr>
        <tr>
          <td class="td1">Streamflow Validation Precipitation</td>
          <td class="td2">Same as Hydrograph Validation but with precipitation added at the top using inverted y-axis.
            Data for this plot is calcuated internally by the program and unavailable for table display.S</td>
        </tr>
      </tbody>
    </table>
  <br />
  <p class="text-center" style="font-weight: bold;">Tables</p>
  <table class="_help-table">
      <thead>
        <th class="td1">Item</th>
        <th>Description</th>
      </thead>
      <tbody>
        <tr>
          <td class="td1">Iteration Metrics Table</td>
          <td class="td2">Metrics for each iteration.</td>
        </tr>
        <tr>
          <td class="td1">Iteration Parameters Table</td>
          <td class="td2">Tuning Paremeters for each iteration.</td>
        </tr>
        <tr>
          <td class="td1">Performance Metrics Table</td>
          <td class="td2">Contains elapsed time, number of CPUs, CPU time (aka run time), maximum RSS, maximum disk read, 
            maximum disk write, reserved time (time waiting for resources) I/O throughput.</td>
        </tr>
      </tbody>
    </table>
  <br />
  <p class="text-center" style="font-weight: bold;">Logs</p>
  <table class="_help-table">
    <thead>
        <th class="td1">Item</th>
        <th>Description</th>
      </thead>
    <tbody>
      <tr>
        <td class="td1">Calibration</td>
        <td class="td2">Log outputs from ngen-cal and ngen calibration runs.</td>
      </tr>
      <tr>
        <td class="td1">Validation Logs</td>
        <td class="td2">Log outputs from ngen-cal and ngen validation run.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
