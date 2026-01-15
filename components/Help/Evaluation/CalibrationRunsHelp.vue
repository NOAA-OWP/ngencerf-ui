<template>
    <div class="_help-page">
        <div class="_help-title">Evaluation - Calibration Runs Tab</div>
        <p class="_help-subtitle">
            Displays table of calibration jobs.<br />
            <br />
            Select a job then right click for available actions.<br />
            <br />
            If the Evaluate action selected has more that one validation run, the table is populated with
            a list of associated validation runs. Select a run, then right click for available actions.
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

            <p><strong>Modules</strong></p>
            <p class="mb-2">Multi-select filter. If more than one module is selected, a Module Match pull-down appears.</p>
            <div class="ml-2">
                <p class="ml-4"><strong>Module Match</strong></p>
                <ul class="list-disc list-outside ml-8 mb-4 space-y-0">
                <li><strong>Match all selected modules:</strong> Shows only jobs that include <em>every</em> selected module.</li>
                <li><strong>Match any selected module:</strong> Shows jobs that include <em>at least one</em> of the selected modules.</li>
                </ul>
            </div>

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

            <p><strong>Include Archived</strong></p>
            <p class="mb-2">Check this box to include jobs that have been archived in the table.</p>
            <ul class="list-disc list-outside ml-6 mb-4 space-y-0.5">
                <li>When enabled, archived jobs will be shown along with active jobs.</li>
                <li>All other filters (Headwater Basin Gage, Status, Modules, Created Date, Job ID) will also apply to archived jobs.</li>
                <li>When disabled, only active (non-archived) jobs are displayed.</li>
            </ul>

        </div>
        
        <hr class="my-6 border-black" />
        <div id="calibration-jobs" class="text-center font-bold text-xl mb-3">Calibration Jobs Table</div>
        <hr/>
        <p class="text-center">Sort table by clicking on the sort icon in a column.</p>
        <hr />
        <p class="text-center"><strong>Right Click Actions</strong></p>
        <table class="_help-table" aria-describedby="Evalation Calibration Runs Tab Help Table">
            <thead>
                <tr>
                    <th class="td1">Action</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Evaluate</td>
                    <td class="td2">Shown when only one validation run has been performed. Selecting this will take the
                        user to
                        the Evaluate tab to view calibration and validation results.</td>
                </tr>
                <tr>
                    <td class="td1">Select Validation Run</td>
                    <td class="td2">Replaces Evaluate action when more than one validation run has been done. The job
                        validation runs table
                        is displayed.</td>
                </tr>
                <tr>
                    <td class="td1">Compare Permutations</td>
                    <td class="td2">When selected, a table with all permuations associated with the gage ID will be
                        shown.
                        Select up to 10 different permutations (aka formulations) to compare.</td>
                </tr>
                <tr>
                    <td class="td1">New Validation Run</td>
                    <td class="td2">Since only the control, last and best iteration runs data are saved, select this
                        action to
                        generate data for an alternate iteration from the calibration run.</td>
                </tr>
                <tr>
                    <td class="td1">View Valdiation Run Stats</td>
                    <td class="td2">View the status and some statics of the specific validation run.</td>
                </tr>
                <tr>
                    <td class="td1">View Calibration Details</td>
                    <td class="td2">View the setup details of the calibration run.</td>
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
                    <td class="td1">Delete</td>
                    <td class="td2">Delete the selected calibration job and all it's associated validation jobs. User
                        will remain on this page.</td>
                </tr>
            </tbody>
        </table>
        <br />
        <p class="text-center">The <strong>"View Calibrations Runs"</strong> button will appear for the<br />
            <strong>Compare Permutations</strong> and <strong>Validation Runs</strong> actions.<br />
            Clicking this button will populate the table with the list of calibration jobs.</p>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
