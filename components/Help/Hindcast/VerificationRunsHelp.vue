<template>
    <div class="_help-page">
        <div class="_help-title">Hindcast - Verification Runs Tab</div>
        <p id="help-subtitle" class="_help-subtitle">
            Displays table of previous verification runs with some basic details.
        </p>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Hindcast Runs tab.
        </p>
       <hr class="my-6 border-black" />

        <div id="filters" class="text-center font-bold text-xl mb-3">Filtering Verification Jobs</div>
        <div class="ml-2">
            <p class="mb-4">
            Use the filters at the top of the table to narrow down the list of Verification jobs. 
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
                <strong>Tip:</strong> You can use multiple filters together to narrow results further.
                If no jobs appear, try relaxing one or more filters.
            </p>

            <hr>
            <p><strong>Clear Filters</strong></p>
            <p class="mb-2">Clears/Resets the filters.</p>

            <p><strong>Refresh List</strong></p>
            <p class="mb-2">Refreshes the list of filtered jobs.</p>

        </div>

        <hr class="my-6 border-black" />
        <div id="calibration-jobs" class="text-center font-bold text-xl mb-3">Verification Runs Table</div>
        <p class="text-center">Sort table by clicking on the sort icon in a column.</p>
        <br />
        <p class="text-center"><strong>Right Click Actions</strong></p>
        <table class="_help-table" aria-describedby="help-subtitle">
            <thead>
                <tr>
                    <th class="td1">Item</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">View Status</td>
                    <td class="td2">View the status of a running job the job statistics from a completed job.</td>
                </tr>
                <tr>
                    <td class="td1">View Results</td>
                    <td class="td2">View results from this hindcast run.</td>
                </tr>
                <tr>
                    <td class="td1">Delete</td>
                    <td class="td2">Selecting this action will <strong>permanently delete the chosen calibration job</strong> along 
                        with all associated validation, forecast, hindcast, and verification jobs. All references to this 
                        job will also be removed from the database. <strong>This action cannot be undone.</strong> 
                        After deletion, you will remain on the current page.
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
