<template>
    <div class="_help-page">
        <div class="_help-title">Forecast - Calibration Runs Tab</div>
        <p id="help-subtitle" class="_help-subtitle">
            Displays table of calibration jobs.<br />
            <br />
            Select a job then right click for available actions.
        </p>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr />
        <p class="text-center">Sort table by clicking on the sort icon in a column.</p>
        <br />
        <p class="text-center"><strong>Right Click Actions</strong></p>
        <table class="_help-table" aria-describedby="Forecast Calibration Runs Tab Help Table">
            <thead>
                <tr>
                    <th class="td1">Action</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Run New Forecast</td>
                    <td class="td2">Run a new foreast using this calibration as the basis for the job.</td>
                </tr>
                <tr>
                    <td class="td1">View Calibration Details</td>
                    <td class="td2">View more details about the calibration job than what is shown in the table.</td>
                </tr>
                <tr>
                    <td class="td1">Download Results</td>
                    <td class="td2">Download all the input and output data associated with a calibration run.</td>
                </tr>
                <tr>
                    <td class="td1">Export Calibration Config</td>
                    <td class="td2">Export the Calibration Definition for used for CLI import command.</td>
                </tr>
                <tr>
                    <td class="td1">Delete Calibration Job</td>
                    <td class="td2">Delete the selected calibration job and all it's associated validation jobs. User
                        will remain on this page.</td>
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

