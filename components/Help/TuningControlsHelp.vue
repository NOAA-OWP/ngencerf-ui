<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Workflow - Tuning Controls Tab</div>
    <div class="_help-subtitle">
        This tab provides the user the ability to select the time periods to run the calibration, 
        the time periods for an automatic validation after calibration is complete based on the best set of parameters
        determined during the calibration process, and which module parameters for the selected formulation to tune during
        calibration.
    </div>
    <p class="text-center" style="color:orange;font-size:0.8em;">
      WARNING: Clicking the browser refresh button logs you out of ngenCERF, usually on your next action.
    </p>
    <p class="text-center" style="color:red;">
      NOTE: Times are hourly and must be specified to the top of the hour (hh:00).
    </p>
    <table class="_help-table">
      <tbody>
        <tr>
          <td class="td1">Entering Times:</td>
          <td class="td2">Times are UTC.<br >
            Times can be selected using the date picker or entered manually.<br />
            Manual Format: YYYY-MM-DD HH:MM<br />
            Cut and paste can be used.<br />
            When manually entering data, the <b>Enter</b> key must be hit otherwise data in that field will be discarded.
          </td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Range:</td>
          <td class="td2">Non-editable field displaying the available time range for running calibration and validation.
            This is determined by the time ranges available in the forcing and observational data selected in the
            Headwater Basin Gage tab. All time controls are constrained by this range.</td>
        </tr>
        <tr>
          <td class="td1">Calibration Time Controls :</td>
          <td class="td2">The user selects four times to run the calibration. The Simulation Start and End times reflect
            the period of time to perform the entire run. The Calibration Start and End reflect the period of time to
            actually calibrate using the tuning parameters. This allows for a “warm-up” period prior to performing the
            calibration.</td>
        </tr>
        <tr>
          <td class="td1">Validation Time Controls:</td>
          <td class="td2">Same rules as the Calibration Time Controls except the time range is further constrained to be
            outside of the time ranges chosen for the Calibration run.
          </td>
        </tr>
        <tr>
          <td class="td1">Output Variable to Calibrate:</td>
          <td class="td2">Dropdown field to select the output variable to calibratte based on the chosen formulation.
          </td>
        </tr>
        <tr>
          <td class="td1">Calibration Tuning Parameters</td>
          <td class="td2">Either upload from a file or select from the available calibratable parameters based on the
            formulation chosen.</td>
        </tr>
        <tr>
          <td class="td1">Load Params Button:</td>
          <td class="td2">Click this to upload calibration tuning parameters from text file.</td>
        </tr>
        <tr>
          <td class="td1">Name:</td>
          <td class="td2">Dropdown field of calibratable parameters.</td>
        </tr>
        <tr>
          <td class="td1">Parameter Table:</td>
          <td class="td2">Lists the calibratable parameters chosen. The source for these entries can be from the Name
            dropdown or uploaded from a file. User must supply the minimum, maximum and initial values.</td>
        </tr>
        <tr>
          <td class="td1">Save Button:</td>
          <td class="td2">Save data from the tab. Partial saves are allowed.</td>
        </tr>
        <tr>
          <td class="td1">Reset Link:</td>
          <td class="td2">Reset data to default information for the Tuning Controls Tab only.</td>
        </tr>
        <tr>
          <td class="td1">Next Button:</td>
          <td class="td2">Move to the Tuning Controls Tab. If there is any unsaved data, the user will first be prompted
            to save.</td>
        </tr>
        <tr>
          <td class="td1">Previous Button:</td>
          <td class="td2">Move to the Formulation Tab. If there is any unsaved data, the user will first be prompted to
            save.</td>
        </tr>
        <tr>
          <td class="td1">Mext Button:</td>
          <td class="td2">Move to the Tuning Controls Tab. If there is any unsaved data, the user will first be prompted
            to save.</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1"><strong>ERRORS:</strong></td>
          <td class="td2"></td>
        </tr>
        <tr>
          <td class="td1"><strong>Calibration Tuning Controls disabled</strong></td>
          <td class="td2">This means that either the observation data, the forcing data or both have not yet been
            selected. Go to the Headwater Basin Gage tab and make sure to this data is selected.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
</style>
