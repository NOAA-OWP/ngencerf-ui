<template>
  <div class="_help-page">
    <div class="_help-title">Evaluation - Compare Permutations Tab</div>
    <div class="_help-subtitle">This tab provides the ability to compare perumations.</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>
    <hr />
    <div>
      <table class="_help-table" aria-label="Evaluation Run/Status Help Table">
        <thead>
            <tr>
            <th>&nbsp;</th>
            <th>&nbsp;</th>
            </tr>
        </thead>
        <tbody>
            <tr>
              <td class="td1">Display</td>
              <td class="td2">Select comparison to view.</td>
            </tr>
            <tr>
              <td class="td1 col-span-2">&nbsp;</td>
            </tr>
            <tr>
              <td class="td1">Calibration Metrics</td>
              <td class="td2">Displays 3 tables of best run metrics for comparison.</td>
            </tr>
            <tr>
              <td class="td1" style="font-weight: normal;">Calibration Period</td>
              <td class="td2">Calib Start Time to Calib End Time</td>
            </tr>
            <tr>
              <td class="td1" style="font-weight: normal;">Validation Period</td>
              <td class="td2">Validation Start Time to Validation End Time</td>
            </tr>
            <tr>
              <td class="td1" style="font-weight: normal;">Full Period Period</td>
              <td class="td2">Earliest of Calibration and Validation Start Times to<br />
                              Latest of Validation and Validation End Times</td>
            </tr>
            <tr>
              <td class="td1">Performance Metrics</td>
              <td class="td2">Displays the performance metrics for comparison.</td>
            </tr>
            <tr>
              <td class="td1"  style="font-weight: normal;">Elapsed Time</td>
              <td class="td2">The job's elapsed time</td>
            </tr>              
            <tr>
              <td class="td1"  style="font-weight: normal;">Num Cpus</td>
              <td class="td2">Total number of CPUs allocated to the job</td>
            </tr>              
            <tr>
              <td class="td1"  style="font-weight: normal;">Cpu Time</td>
              <td class="td2">Elapsed time * CPU count</td>
            </tr>              
            <tr>
              <td class="td1"  style="font-weight: normal;">Max Rss</td>
              <td class="td2">Maximum resident set size of all tasks in job</td>
            </tr>              
            <tr>
              <td class="td1"  style="font-weight: normal;">Max Disk Read</td>
              <td class="td2">Maximum number of bytes read by all tasks in job</td>
            </tr>              
            <tr>
              <td class="td1"  style="font-weight: normal;">Max Disk Write</td>
              <td class="td2">Maximum number of bytes written by all tasks in job</td>
            </tr>              
            <tr>
              <td class="td1"  style="font-weight: normal;">Reserved Time</td>
              <td class="td2">How much wall clock time was used as planned time for this
                              job. This is derived from how long a job was waiting in PW from eligible time to
                              when it started or was cancelled.</td>
            </tr>              
            <tr>
              <td class="td1"  style="font-weight: normal;">Io Throughput</td>
              <td class="td2">Computed: (Max Disk Read + Max Disk Write) / Elapsed Time</td>
            </tr>              
        </tbody>
      </table>
    </div>
    <p style="margin-top:12px;font-size: 0.9em;">
      <strong>Note:</strong><br />
      <em>Elapsed time fields are presented as</em> [days-]hours:minutes:seconds[.microseconds]</p>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
