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
       <hr class="my-6 border-black" />

        <div id="filters" class="text-center font-bold text-xl mb-3">Filtering Calibration Jobs</div>
        <div class="ml-2">
            <p class="mb-4">
            Use the filters at the top of the table to narrow down the list of calibration jobs. 
            You can use any combination of filters; only jobs that match <strong>all active filters</strong> will be shown. 
            The table updates automatically as you select filters.
            </p>

            <p><strong>Headwater Basin Gage</strong></p>
            <p class="mb-2">Select a single gage to show jobs for that basin.</p>

            <p><strong>Created After</strong></p>
            <p class="mb-2">Show jobs created on or after the selected date.</p>

            <p><strong>Created Before</strong></p>
            <p class="mb-2">Show jobs created on or before the selected date.</p>

            <p><strong>Job ID Start</strong></p>
            <p class="mb-2">Show jobs with ID greater than or equal to this number.</p>

            <p><strong>Job ID End</strong></p>
            <p class="mb-2">Show jobs with ID less than or equal to this number.</p>

            <p class="mt-4 mb-4 italic">
            <strong>Tip:</strong> You can use multiple filters together to narrow results further. If no jobs appear, try relaxing one or more filters.
            </p>

            <hr>
            <p><strong>Clear Filters</strong></p>
            <p class="mb-2">Clears/Resets the filters.</p>

            <p><strong>Refresh List</strong></p>
            <p class="mb-2">Refreshes the list of filtered jobs.</p>

        </div>

        <hr class="my-6 border-black" />
        <div id="calibration-jobs" class="text-center font-bold text-xl mb-3">Calibration Runs Table</div>
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
                <tr>
                    <td class="td1">Archive</td>
                    <td class="td2">Archive the selected calibration job(s).
                        Archived jobs will not longer appear in any Calibration Runs table.<br /><br />Archived jobs 
                        cannot be used directly to run a forecast. To use one, open the Calibration workflow and 
                        unarchive the job from the Calibration Runs tab.
                    </td>
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

