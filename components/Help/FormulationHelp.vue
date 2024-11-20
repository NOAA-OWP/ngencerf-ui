<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Workflow - Formulation Tab</div>
    <div class="_help-subtitle">&nbsp;</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
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
          <td class="td1">Group:</td>
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
          <td class="td1"><span class="text-2xl">SLoTH Variables</span></td>
          <td class="td2">Simple Logical Tautology Handler (SLoTH) variables enable testing a module without having all
            necessary upstream
            modules in the formulation. The user defines a SLoTH variable to hold expected output and maps it to
            the module variable requiring the data. For more details see
            <a href="https://github.com/NOAA-OWP/SLoTH" target="_blank" class="underline">NOAA-OWP SLoTH Repository</a>
            REAMDE file.<br />
          </td>
        </tr>
        <tr>
          <td class="td1">Add SLoTH output Variables Checkbox:</td>
          <td class="td2">Selecting this checkbox will present the user with a field to create the name SLoTH variable
            and a
            button to add it to the formulation.</td>
        </tr>
        <tr>
          <td class="td1">Add Button:</td>
          <td class="td2">Adds SLoTH variable name specified in the name field to the table of SLoTH Variables.
            User must supply all fields in the table row for the added variable.
          </td>
        </tr>
        <tr>
          <td class="td1">SLoTH Variable Table:</td>
          <td class="td2">Columns:<br>
            &nbsp;&nbsp; <b>SLoTH Output Var</b>: User defined name.<br />
            &nbsp;&nbsp; <b>Count</b>: Number of variables<br />
            &nbsp;&nbsp; <b>Type</b>: Data type of elements<br />
            &nbsp;&nbsp; <b>Units</b>: Dimensions<br />
            &nbsp;&nbsp; <b>Location</b>: node (always node)<br />
            &nbsp;&nbsp; <b>For Module</b>: Name of module to received SLoTH variable<br />
            &nbsp;&nbsp; <b>Module Param</b>: Module Parameter name to receive the SLoTH variable value<br />
            &nbsp;&nbsp; <b>Value</b>: Value of variable<br />
            <br />
          </td>
        </tr>
        <tr>
          <td class="td1">SAVE Button:</td>
          <td class="td2">Save data from the tab. Partial saves are allowed.</td>
        </tr>
        <tr>
          <td class="td1">RESET Button:</td>
          <td class="td2">Reset data to default information for the Forumlation Tab only.</td>
        </tr>
        <tr>
          <td class="td1">NEXT Button:</td>
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
