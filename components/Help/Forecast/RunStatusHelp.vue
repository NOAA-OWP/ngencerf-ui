<template>
    <div class="_help-page">
        <div class="_help-title">Forecast - Run/Status Tab</div>
        <div class="_help-subtitle">
            This tab provides the ability to run the forecast.<br />
            First the real-time forcing data will be downloaded,
            which can take several minutes.<br />
            Once the forcing data is ready the forecast will automatically start.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr />
        <table class="_help-table" aria-label="Forecast Run / Status Help Table">
            <thead>
                <tr>
                    <th>Item</th>
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
                    <td class="td2">Calibration Job ID as the basis for the forecast run.</td>
                </tr>
                <tr>
                    <td class="td1">Forecast Job ID</td>
                    <td class="td2">This Forecast Job ID.</td>
                </tr>
                <tr>
                    <td class="td1">Gage</td>
                    <td class="td2">This forecast gage.</td>
                </tr>
                <tr>
                    <td class="td1">Station Name</td>
                    <td class="td2">Location name for the gage.</td>
                </tr>
                <tr>
                    <td class="td1">Results Pathname</td>
                    <td class="td2">Location on the file system containing all data pertaining to this job.</td>
                </tr>
                <tr>
                    <td class="td1">Configuration</td>
                    <td class="td2">Time elapsed since the job was submitted. Time is in days, HH:MM:SS</td>
                </tr>
                <tr>
                    <td class="td1">Cycle Date</td>
                    <td class="td2">UTC Date and hour of the forecast cycle which determines the real-time forcing data used.</td>
                </tr>
                <tr>
                    <td class="td1">Cold Start Date</td>
                    <td class="td2">Optional UTC Cold start date.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Status</td>
                    <td class="td2">
                        Ready - Click Run to start.<br />
                        Forcing Download Running<br />
                        Forecast Running<br />
                        Done
                    </td>
                </tr>
                <tr>
                    <td class="td1">Submit Time</td>
                    <td class="td2">UTC Date/Time the job was submitted to run.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Elapsed Time</td>
                    <td class="td2">Time elapsed since the job was submitted. Time is in days, HH:MM:SS</td>
                </tr>
                <tr>
                    <td class="td1">Global Logging</td>
                    <td class="td2">Enable or Disable the Error Warning and Trapping system for ngen and modules.</td>
                </tr>
                <tr>
                    <td class="td1">Log Levels</td>
                    <td class="td2">Set the individual log level for ngen and modules.</td>
                </tr>
                <tr>
                    <td class="td1">&nbsp;</td>
                    <td class="td2">&nbsp;</td>
                </tr>
                <tr>
                    <td class="td1">Previous Button</td>
                    <td class="td2">Go to the previous tab.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Run Button</td>
                    <td class="td2">Start the job. First the latest Forcing data is downloaded then the forecast is run.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Cancel Button</td>
                    <td class="td2">Stop/cancel the job before it has completed. Appears only when a job is running.
                    </td>
                </tr>
                <tr>
                    <td class="td1">View Results Button</td>
                    <td class="td2">View results of the forecast. Appears once the job is done.</td>
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
