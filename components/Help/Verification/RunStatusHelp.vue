<template>
    <div class="_help-page">
        <div class="_help-title">Verification - Run/Status Tab</div>
        <div class="_help-subtitle">
            This tab provides the ability to run the Verification.<br />
            First the real-time forcing data will be downloaded,
            which can take several minutes.<br />
            Once the forcing data is ready the Verification will automatically start.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr class="my-6 border-black" />
        <p class="text-center font-medium">
            All times referenced are in Coordinated Universal Time (UTC).
        </p>
        <hr class="my-6 border-black" />
        <table class="_help-table" aria-label="Verification Run / Status Help Table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Forecast Job ID</td>
                    <td class="td2">Forecast Job ID as the basis for the Verification run.</td>
                </tr>
                <tr>
                    <td class="td1">Verification Job ID</td>
                    <td class="td2">This Verification Job ID.</td>
                </tr>
                <tr>
                    <td class="td1">Submit Time</td>
                    <td class="td2">Date/Time the job was submitted to run.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Elapsed Time</td>
                    <td class="td2">Time elapsed since the job was submitted. Time is in days, HH:MM:SS</td>
                </tr>
                <tr>
                    <td class="td1">Status</td>
                    <td class="td2">
                        Ready - Click Run to start.<br />
                        Forcing Download Running<br />
                        Verification Running<br />
                        Done
                    </td>
                </tr>
                <tr>
                    <td class="td1">Results Pathname</td>
                    <td class="td2">Location on the file system containing all data pertaining to this job.</td>
                </tr>
                <tr>
                    <td class="td1">Run Button</td>
                    <td class="td2">Start the job. First the latest Forcing data is downloaded then the Verification is run.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Cancel Button</td>
                    <td class="td2">Stop/cancel the job before it has completed. Appears only when a job is running.
                    </td>
                </tr>
                <tr>
                    <td class="td1">View Results Button</td>
                    <td class="td2">View results of the verification. Appears once the job is done.</td>
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
