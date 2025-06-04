<template>
  <div class="_help-page">
    <div class="_help-title">Calibration - Calibration Runs Tab</div>
    <div class="_help-subtitle" style="text-align: center;">Displays list of calibration jobs</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>

    <p class="text-center">
      Sort table by clicking on the sort icon in a column.
    </p>

    <table class="_help-table" aria-label="Calibration Runs Tab Help Table">
      <thead>
        <tr>
          <th>Action</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td1">New Button</td>
          <td class="td2">Click to create a calibration setup from scratch.</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Filters</td>
          <td class="td2" style="vertical-align:top;">Filter by Headwater Basin Gage, 
            multi-select status, multi-select modules, and/or archived jobs. 
            Must click <b>Apply Filters</b> button to filter the table</td>
        </tr>
        <tr>
          <td class="td1">Clear Filters</td>
          <td class="td2 align-top">Clears/Resets the filters.</td>
        </tr>
        <tr>
          <td class="td1">Refresh List</td>
          <td class="td2 align-top">Refreshes the list of filtered jobs.</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Double Click</td>
          <td class="td2">Opens calibration job and takes user to the Status/Run tab.
            (Same as right click/Open)</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Right Click</td>
          <td class="td2 align-top"><strong>Shows a context menu with the following options</strong></td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Open<br /></td>
          <td class="td2">Loads the selected calibration job. User will be taken to the Run/Status tab.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Clone</td>
          <td class="td2">Use the data from the selected calibration job as a baseline for a new calibration that
            will be added at the top of the table. User will remain on this page.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Download</td>
          <td class="td2">Download all data associated with a Done calibration job.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Delete</td>
          <td class="td2">Permanently deletes the selected calibration job(s) from the system.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Archive/Unarchive</td>
          <td class="td2">Archive or Unarchive the selected calibration job(s). 
            Archived jobs will no longer appear in any Calibration Runs table unless the Archived filter is active.</td>
        </tr>
      </tbody>
    </table>
    <hr class="mt-3" style="height: 2px; background-color: black" />
    <div class="mt-3 text-center font-bold text-xl">Status Definitions</div>
    <table class="_help-table" aria-label="Status Definitions">
      <thead>
        <tr class="text-left">
          <th style="text-align:center;">Status</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td1"></td>
          <td class="td2"><strong></strong></td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Saved</td>
          <td class="td2 align-top">Calibration setup has begun, but not yet complete.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Ready</td>
          <td class="td2 align-top">Calibration setup complete, but not run. The word Calibration may be present.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Running</td>
          <td class="td2 align-top">Indicates the Calibration/Validation is running. User can view progress and iteration plots.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Done</td>
          <td class="td2 align-top">Calibration job completed without any errors.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Failed</td>
          <td class="td2 align-top">Calibration job failed.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Cancelled</td>
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

<style scoped>
._help-table .td1 {
  width: auto;
}

p {
  margin-left: 50px;
}
</style>

<style scoped>
/* Define the flashing animation */
@keyframes flashGreen {
    0% {
        background-color: green;
    }
    50% {
        background-color: white;
    }
    100% {
        background-color: green;
    }
}

/* Apply the animation to the <td> element */
.flash-green {
    animation: flashGreen 1s linear infinite;
}
</style>
