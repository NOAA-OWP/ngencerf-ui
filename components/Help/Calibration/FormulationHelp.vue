<template>
  <div class="_help-page">
    <div class="_help-title">Calibration - Formulation Tab</div>
    <div class="_help-subtitle">Select the forumlation for the calibration.</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>

    <p style="margin-left: 40px; margin-top:20px;font-size:0.9em; line-height: 20px;">
      <strong>NOTE:</strong> <em>The Previous and Next buttons on each of the tabs are meant to guide the user through a calibration setup,
        starting at the Headwater Basin Gage tab. The user can also simply click a tab or a link in the Progress area to go to that specific setup tab.</em>
    </p>

    <table class="_help-table">
      <tbody>
        <tr>
          <td class="td1">Formulation Name:</td>
          <td class="td2">Enter name for the formulation.</td>
        </tr>
        <tr>
          <td class="td1">Select Modules:</td>
          <td class="td2">Select the modules to use in the formulation. When a module is selected, it’s group will be
            checked in the Groups Covered by Selections area.</td>
        </tr>
        <tr>
          <td class="td1">Groups Filter:</td>
          <td class="td2">Pulldown filter to show only modules for the selected group type.
          </td>
        </tr>
        <tr>
          <td class="td1">Groups Covered by Selections:</td>
          <td class="td2">Group list of the types of modelling available from the Formulation modules. Checkmarks show
            the
            groups covered by the users module selections.
          </td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1"><span class="text-1xl" style="font-size:1.15em;">SLoTH Variables</span></td>
          <td class="td2">Simple Logical Tautology Handler (SLoTH) variables enable testing a module without having all
            necessary upstream
            modules in the formulation. The user defines a SLoTH variable to hold expected output and maps it to
            the module variable requiring the data. For more details see
            <a href="https://github.com/NOAA-OWP/SLoTH" target="_blank" class="underline">NOAA-OWP SLoTH Repository</a>
            REAMDE file.<br />
          </td>
        </tr>
        <tr>
          <td class="td1">Add SLoTH output variable for formulation:</td>
          <td class="td2">Selecting this checkbox will present the user with a field to create the name SLoTH variable
            and a
            button to add it to the formulation.</td>
        </tr>
        <tr>
          <td class="td1">SLoTH Name:</td>
          <td class="td2">SLoTH variable name to add to SLoTH table.
          </td>
        </tr>
        <tr>
          <td class="td1">Add Button:</td>
          <td class="td2">Adds SLoTH variable name specified in the name field to the table of SLoTH Variables.
            User must supply all fields in the table row for the added variable.
          </td>
        </tr>
        <tr>
          <td class="td1">SLoTH Variable Table:</td>
          <td class="td2">Columns: (All columns must be entered.)<br>
             <b>SLoTH Output Var</b>: User defined name.<br />
            <b>Count</b>: Number of variables<br />
            <b>Type</b>: Data type of elements<br />
            <b>Units</b>: Dimensions<br />
            <b>Location</b>: node (always node)<br />
            <b>For Module</b>: Name of module to received SLoTH variable<br />
            <b>Module Param</b>: Module Parameter name to receive the SLoTH variable value<br />
            <b>Value</b>: Value of variable<br />
            <b>HINT: </b>To change the variable name, right-click and delete it then Add a new variable.<br />
          </td>
        </tr>
        <tr>
          <td class="td1">Save Button:</td>
          <td class="td2">Save data from the tab. Partial saves are allowed.</td>
        </tr>
        <tr>
          <td class="td1">Prev Button:</td>
          <td class="td2">Move to the Headwater Basin Gage tab.</td>
        </tr>
        <tr>
          <td class="td1">Next Button:</td>
          <td class="td2">Move to the Tuning Controls Tab. If there is any unsaved data, the user will first be prompted
            to save.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

._help-table .td1 {
  width: 300px;
}
</style>
