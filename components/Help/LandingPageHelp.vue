<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Landing Page</div>
    <div class="_help-subtitle">Displays information about the user's previous runs.</div>

    <table class="_help-table">
      <tbody>
        <tr>
          <td class="td1"></td>
          <td class="td2"><strong>Displays the number of processes that are currently running</strong></td>
        </tr>
        <tr>
          <td class="td1"></td>
          <td class="td2"><strong>Displays the number of uncompleted calibration runs</strong></td>
        </tr>
        <tr>
          <td class="td1"></td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1"></td>
          <td class="td2">Click on <strong>Continue</strong> button to see a list of the abovementioned runs
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

._help-table .td1 {
  width: 200px;
}
</style>
