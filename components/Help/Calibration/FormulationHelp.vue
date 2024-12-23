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
