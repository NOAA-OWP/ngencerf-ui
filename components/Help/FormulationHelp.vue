<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Workflow - Formulation Tab</div>
    <div class="_help-subtitle">&nbsp;</div>

    <table class="_help-table">
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
        <td class="td2">Group list of the types of modelling available from the Formulation modules. Checkmarks show the
          groups covered by the users module selections.
        </td>
      </tr>
      <tr>
        <td class="td1">&nbsp;</td>
        <td class="td2">&nbsp;</td>
      </tr>
      <tr>
        <td class="td1"><span class="text-2xl">Selections</span></td>
        <td class="td2"></td>
      </tr>
      <tr>
        <td class="td1">Add SLoTH output Variables:</td>
        <td class="td2">Selecting this checkbox allows the user to add multiple SLoTH variables for use in the
          formulation. The use of SLoTH variables provides the ability to test a module without having all necessary
          upstream modules in the formulation. The user defines a SLoTH variable to hold expected output and maps it to
          the module variable requiring the data. </td>
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
