<template>
    <div class="_help-page">
        <div class="_help-title">Calibration - Calibration Runs Tab</div>
        <div class="_help-subtitle">Displays list of calibration jobs<br />
            <br />
            Select a job then right click for available actions.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr class="my-6 border-black" />

        <div class="text-center font-bold text-xl mb-3">New Button</div>
        <p class="text-center mb-2">Click to create a calibration setup from scratch.</p>

        <hr class="my-6 border-black" />

        <div class="text-center font-bold text-xl mb-3">Filtering Calibration Jobs</div>
        <div class="ml-2">
            <p class="mb-4">
            Use the filters at the top of the table to narrow down the list of calibration jobs. 
            You can use any combination of filters; only jobs that match <strong>all active filters</strong> will be shown. 
            The table updates automatically as you select filters.
            </p>

            <p><strong>Headwater Basin Gage</strong></p>
            <p class="mb-2">Select a single gage to show jobs for that basin.</p>

            <p><strong>Status</strong></p>
            <p class="mb-2">Multi-select filter. Jobs matching any selected status will be shown.</p>

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
        <div class="text-center font-bold text-xl mb-3">Calibration Jobs Table</div>
        <hr/>

        <div class="ml-2">
            <div class="text-center font-bold text-l mb-4">Bulk Actions</div>

            <p class="mb-4">
            The <strong>Bulk Actions</strong> dropdown allows you to perform actions on multiple calibration jobs at once.
            </p>

            <div class="mb-2">
            <p><strong>Selecting Jobs</strong></p>
            <ul class="list-disc list-outside ml-6 space-y-0">
                <li>Click a job to select a single job.</li>
                <li>Use <strong>Ctrl+Click</strong> to select or deselect multiple individual jobs.</li>
                <li>Use <strong>Shift+Click</strong> to select a range of jobs between the last selected job and the clicked job.</li>
            </ul>
            </div>

            <p><strong>Bulk Actions Dropdown</strong></p>
            <p class="mb-2">Once jobs are selected, use the dropdown to apply an action to all selected jobs. Only actions that can be applied 
                            to the selected jobs will be available.</p>

            <p class="mb-2">
            <strong>Select All Jobs / Deselect All Jobs</strong>
            </p>
            <ul class="list-disc list-outside ml-6 mb-4 space-y-0">
            <li><strong>Select All Jobs:</strong> Selects every job currently visible in the table.</li>
            <li><strong>Deselect All Jobs:</strong> Clears all current selections.</li>
            <li>These links are automatically <strong>enabled or disabled</strong> depending on the current selection state (for example, "Select All" is disabled if all jobs are already selected).</li>
            </ul>

            <p class="mt-2 italic">
            <strong>Tip:</strong> Bulk actions are applied only to the jobs you select, so make sure your selections are correct before applying an action.
            </p>
        </div>

        <hr/>

        <div class="text-center font-bold text-l mb-4">Table</div>
        <p class="text-center">Sort table by clicking on the sort icon in a column.</p>
        <hr />
        <table class="_help-table" aria-label="Calibration Runs Tab Help Table">
            <thead>
                <tr>
                    <th class="td1">Action</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1 align-top">Double Click</td>
                    <td class="td2 align-top">Opens calibration job and takes user to the Run/Status tab.
                        (Same as right click/Open)</td>
                </tr>
                <tr>
                    <td class="td1 align-top">&nbsp;</td>
                    <td class="td2 align-top">&nbsp;</td>
                </tr>
                <tr>
                    <td class="td1 align-top">Right Click</td>
                    <td class="td2 align-top"><strong>Shows a context menu with the following options</strong></td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Open<br /></td>
                    <td class="td2 align-top">Loads the selected calibration job. User will be taken to the Run/Status
                        tab.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Clone</td>
                    <td class="td2 align-top">Use the data from the selected calibration job as a baseline for a new
                        calibration that
                        will be added at the top of the table. User will remain on this page.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Download Results</td>
                    <td class="td2 align-top">Download all data associated with a Done calibration job.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Export Calibration Config</td>
                    <td class="td2 align-top">Export the Calibration Definition for used for CLI import command.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Delete</td>
                    <td class="td2 align-top">Selecting this action will <strong>permanently delete the chosen calibration job</strong> along 
                        with all associated validation, forecast, and verification jobs. All references to this 
                        job will also be removed from the database. <strong>This action cannot be undone.</strong> 
                        After deletion, you will remain on the current page.
                    </td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Archive/<br />Unarchive</td>
                    <td class="td2 align-top">Archive or Unarchive the selected calibration job(s).
                        Archived jobs will no longer appear in any Calibration Runs table unless the Archived filter is
                        active.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Lock/<br />UnLock</td>
                    <td class="td2 align-top">Lock/Unlock the selected calibration job(s). 
                        Locking a job prohibits deletion. Once locked the
                        job cannnot be deleted until unlocked.
                    </td>
                </tr>
            </tbody>
        </table>
        <hr class="mt-3" style="height: 2px; background-color: black" />
        <div class="mt-3 text-center font-bold text-xl">Status Definitions</div>
        <table class="_help-table" aria-label="Status Definitions">
            <thead>
                <tr class="text-left">
                    <th class="text-right" style="padding-right:30px;">Status</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1 align-top"></td>
                    <td class="td2 align-top"><strong></strong></td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Saved</td>
                    <td class="td2 align-top">Calibration setup has begun, but not yet complete.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Ready</td>
                    <td class="td2 align-top">Calibration setup complete, but not run. The word Calibration may be
                        present.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Running</td>
                    <td class="td2 align-top">Indicates the Calibration/Validation is running. User can view progress
                        and iteration plots.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Done</td>
                    <td class="td2 align-top">Calibration job completed without any errors.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Failed</td>
                    <td class="td2 align-top">Calibration job failed.</td>
                </tr>
                <tr>
                    <td class="td1 align-top" style="font-weight:normal;">Cancelled</td>
                    <td class="td2 align-top">Calibration job cancelled by user.</td>
                </tr>
                <tr>
                    <td class="td1" style="font-weight:normal;">Server Error</td>
                    <td class="td2 align-top">The server had an error before the job finished.</td>
                </tr>
            </tbody>
        </table>
        <hr class="mt-3" style="height: 2px; background-color: black" />
        <div class="mt-3 text-center font-bold text-xl">Table Color Coding</div>
        <p class="font-bold">The leftmost column is color coded by the status of the job</p>
        <table class="ml-28 w-auto" aria-label="Table Color Coding">
            <thead>
                <tr class="text-left">
                    <th>&nbsp;</th>
                    <th>&nbsp;&nbsp;</th>
                    <th>Color</th>
                    <th>&nbsp;&nbsp;</th>
                    <th>Job Status</th>
                </tr>
            </thead>
            <tbody>
                <tr class="leading-8">
                    <td style="background-color: yellow" class="pr-1">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>Yellow</td>
                    <td>&nbsp;</td>
                    <td>Saved</td>
                </tr>
                <tr class="leading-8">
                    <td style="background-color: green" class="pr-1">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>Green</td>
                    <td>&nbsp;</td>
                    <td>Ready</td>
                </tr>
                <tr class="leading-8">
                    <td style="background-color: green" class="pr-1 flash-green">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>Flashing Green</td>
                    <td>&nbsp;</td>
                    <td>Running</td>
                </tr>
                <tr class="leading-8">
                    <td style="background-color: blue" class="pr-1">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>Blue</td>
                    <td>&nbsp;</td>
                    <td>Done</td>
                </tr>
                <tr class="leading-8">
                    <td style="background-color: orange" class="pr-1">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>Orange</td>
                    <td>&nbsp;</td>
                    <td>Cancelled</td>
                </tr>
                <tr class="leading-8">
                    <td style="background-color: red" class="pr-1">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>Red</td>
                    <td>&nbsp;</td>
                    <td>Failed</td>
                </tr>
                <tr class="leading-8">
                    <td style="background-color: black" class="pr-1">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>Black</td>
                    <td>&nbsp;</td>
                    <td>Server error</td>
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

<style scoped>
/* Define the flashing animation */
@keyframes flashGreen {
    0% {
        background-color: white;
    }
    50% {
        background-color: green;
    }
    100% {
        background-color: white;
    }
}

/* Apply the animation to the <td> element */
.flash-green {
    animation: flashGreen 1.5s linear infinite;
}
</style>
