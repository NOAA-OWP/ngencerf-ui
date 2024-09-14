<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Workflow - Headwater Basin Gage Tab</div>
    <div class="_help-subtitle">&nbsp</div>

    <table class="_help-table">
      <tr>
        <td class="td1">Domain:</td>
        <td class="td2">Pull down to select the domain of interest. Choice are CONUS, Alaska, Hawaii and Puerto Rico/US
          Virgin Islands.</td>
      </tr>
      <tr>
        <td class="td1">Gage:</td>
        <td class="td2">Pull down to select a gage from the chosen domain. </td>
      </tr>
      <tr>
        <td class="td1">Forcing:</td>
        <td class="td2">ull down to select the source of the forcing data. As of PI-3, this is either Enterprise
          Hydrofabric Services (EHS) or Upload. Upload allows the user to specify their own csv file containing hourly
          time-series details of forcing data. This file must be in the following format, with the 1st line being the
          header identifying the following fields:<br />
          SAVE ButtonTime, LWDOWN, PFC, Q2D, RAINRATE, SWDOWN, T2D, U2D, V2D<br />
          <br >
          Example:<br />
          <img :src=image1 /><br />
          <img :src=image2 width="70%" class="mb-2"/>
        </td>
      </tr>
      <tr>
        <td class="td1">Observational:</td>
        <td class="td2">Pull down to select the source for the selected gage Observational Data. . As of PI-3, this is
          either EHS or Upload. Upload allows the user to use their own csv file hourly time-series details of observed
          gage streamflow data. This file must be in the following format, with the the 1st line being the header
          identifying the following fields:<br /><br />
          <span class="italic">dateTime, q_cms</span><br />
          Example:<br />
          <img :src=image3 /><br />
        </td>
      </tr>
      <tr>
        <td class="td1">GeoPackage:</td>
        <td class="td2">Pull down to select the source for the selected gage Observational Data. . As of PI-3, this is
          either Enterprise Hydrofabric Services (EHS) or Upload.</td>
      </tr>
      <tr>
        <td class="td1">SAVE Button:</td>
        <td class="td2">Save data from the tab. Partial saves are allowed.</td>
      </tr>
      <tr>
        <td class="td1">RESET Button:</td>
        <td class="td2">Reset data to default information for the Headwater Basin Tab only.</td>
      </tr>
      <tr>
        <td class="td1">NEXT Button:</td>
        <td class="td2">Move to the Formulation Tab. If there is any unsaved data, the user will first be prompted to
          save.</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import image1 from "@/assets/styles/img/forcingexample.png"
import image2 from "@/assets/styles/img/calworkhelp.png"
import image3 from "@/assets/styles/img/observationalexample.png"
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
._help-table .td1 {
  width: 150px;
}
</style>
