<template>
  <div class="_help-page">
    <div class="_help-title">Hindcast - Results Tab</div>
    <p id="help-subtitle" class="_help-subtitle">
      Displays results for the selected hindcast run.
    </p>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>
    <hr class="my-6 border-black" />
    <p class="text-center font-medium">
        All times referenced are in Coordinated Universal Time (UTC).
    </p>
    <hr class="my-6 border-black" />
    <table class="_help-table" aria-describedby="help-subtitle">
      <thead>
            <tr>
            <th class="td1">Item</th>
            <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
               <td class="td1">Display</td>
                <td class="td2">Select the result to display in the main viewing area (e.g. time series or logs). 
                    <ul class="list-disc list-outside ml-6 space-y-0">
                        <li>Selecting <strong>Logs</strong> reveals a second pull-down to select a specific log.</li>
                        <li>Selecting <strong>Time Series</strong> shows a slider at the bottom to zoom in or out. 
                            The plot and slider default to fully zoomed out.</li>
                    </ul>
               </td>
            </tr>
            <tr>
                <td class="td1">Calibration Job ID</td>
                <td class="td2">Calibration Job ID used as the basis for this hindcast.</td>
            </tr>
            <tr>
                <td class="td1">Hindcast Job ID</td>
                <td class="td2">This hindcast job ID.</td>
            </tr>
            <tr>
                <td class="td1">Gage</td>
                <td class="td2">This hindcast gage.</td>
            </tr>
            <tr>
                <td class="td1">Location Name</td>
                <td class="td2">Location name for the gage.</td>
            </tr>
            <tr>
                <td class="td1">Results Pathname</td>
                <td class="td2">File system location containing all data for this job.</td>
            </tr>
            <tr>
                <td class="td1">Configuration</td>
                <td class="td2">Hindcast configuration used for this job.</td>
            </tr>
            <tr>
                <td class="td1">Cycle Date</td>
                <td class="td2">UTC Date and hour used for this hindcast job. </td>
            </tr>
            <tr>
                <td class="td1">Saved State Start Date</td>
                <td class="td2">UTC Cold start date if using a saved state.</td>
            </tr>
            <tr>
                <td class="td1">Cold Start Date</td>
                <td class="td2">UTC Cold start date if not using a saved state.</td>
            </tr>
            <tr>
                <td class="td1">Status</td>
                <td class="td2">Completion status of the hindcast job.</td>
            </tr>
            <tr>
                <td class="td1">Submit Time</td>
                <td class="td2">UTC Date/Time the job was submitted to run.</td>
            </tr>
            <tr>
                <td class="td1">Elapsed Time</td>
                <td class="td2">Total time the job took to run, displayed as days, HH:MM:SS.</td>
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
</style>
