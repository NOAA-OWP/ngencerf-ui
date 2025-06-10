<template>
    <div class="_help-page">
        <div class="_help-title">Evaluation - Calibration Runs Tab</div>
        <p class="_help-subtitle">
            Displays table of calibration jobs.<br />
            <br />
            Filters are provided to narrow list of jobs.<br />
            <br />
            Select a job then right click for a list of actions.<br />
            <br />
            If the Evaluate action selected has more that one validation run, the table is populated with
            a list of associated validation runs. Select a run, then right click for available actions.
        </p>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr />
        <p class="text-center">Filter by Headwater Basin Gage, multi-select status, multi-select modules, and/or
            archived jobs.<br />
            <b>Apply Filters</b> must be clicked to filter the table.
        </p>
        <br />
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
                    <td class="td1">Download</td>
                    <td class="td2">Download all the input and output data associated with a calibration run.</td>
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
