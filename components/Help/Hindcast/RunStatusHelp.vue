<template>
    <div class="_help-page">
        <div class="_help-title">Hindcast - Run/Status Tab</div>
        <div class="_help-subtitle">
            This tab provides the ability to run the hindcast.<br />
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr class="my-6 border-black" />
        <p class="text-center font-medium">
            All times referenced are in Coordinated Universal Time (UTC).
        </p>
        <hr class="my-6 border-black" />
        <table class="_help-table" aria-label="Hindcast Run / Status Help Table">
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
                            <li>Selecting <strong>Cold Start Logs</strong> or <strong>Hindcast Logs</strong> 
                                reveals a second pull-down to select a specific log.</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td class="td1">Calibration Job ID</td>
                    <td class="td2">Calibration Job ID as the basis for the hindcast run.</td>
                </tr>
                <tr>
                    <td class="td1">Hindcast Job ID</td>
                    <td class="td2">This Hindcast Job ID.</td>
                </tr>
                <tr>
                    <td class="td1">Gage</td>
                    <td class="td2">This hindcast gage.</td>
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
                    <td class="td2">The name of the configuration chosen for the hindcast.</td>
                </tr>
                <tr>
                    <td class="td1">Cycle Date</td>
                    <td class="td2">UTC Date and hour of the hindcast cycle which determines the real-time forcing data used.</td>
                </tr>
                <tr>
                    <td class="td1">Saved State Start Date</td>
                    <td class="td2">UTC Cold start date if using a saved state.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Cold Start Date</td>
                    <td class="td2">UTC Cold start date if not using a saved state.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Advance Interval</td>
                    <td class="td2">How far apart each cycle is spaced (e.g., every 6 hours).
                    </td>
                </tr>
                <tr>
                    <td class="td1">Number of Intervals</td>
                    <td class="td2">How many cycles to generate at that spacing.<br />For example:<br />
                        An Advance Interval of 6 hours with 12 Intervals produces 12 separate hindcast runs,
                        one every 6 hours, spanning a 72-hour period starting at your Cycle Date/Hour. Each of
                        those runs gets its own forecast window on top (per the configuration's Hindcast
                        Window).
                    </td>
                </tr>
                <tr>
                    <td class="td1">Status</td>
                    <td class="td2">
                        Ready - Click Run to start.<br />
                        Cold Start Running (if not using a saved state)<br />
                        Hindcast Running<br />
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
                    <td class="td2">Start the job.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Cancel Button</td>
                    <td class="td2">Stop/cancel the job before it has completed. Appears only when a job is running.
                    </td>
                </tr>
                <tr>
                    <td class="td1">View Results Button</td>
                    <td class="td2">View results of the hindcast. Appears once the job is done.</td>
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
