<template>
    <div class="_help-page">
        <div class="_help-title">Veification - Forecast Runs Tab</div>
        <p id="help-subtitle" class="_help-subtitle">
            Displays table of forecast jobs.<br />
            <br />
            Select a job then right click for available actions.
        </p>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Forecast Runs tab.
        </p>
       <hr class="my-6 border-black" />

        <div id="filters" class="text-center font-bold text-xl mb-3">Filtering Forecast Jobs</div>
        <div class="ml-2">
            <p class="mb-4">
            Use the filters at the top of the table to narrow down the list of Forecast jobs. 
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
        <div class="text-center font-bold text-xl mb-3">Forecast Runs Table</div>
        <p class="text-center">Sort table by clicking on the sort icon in a column.</p>
        <br />
        <p class="text-center"><strong>Right Click Actions</strong></p>
        <table class="_help-table" aria-describedby="Verification Forecast Runs Tab Help Table">
            <thead>
                <tr>
                    <th class="td1">Action</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Run New Verification</td>
                    <td class="td2">Run a new verification using this forecast as the basis for the job.</td>
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

