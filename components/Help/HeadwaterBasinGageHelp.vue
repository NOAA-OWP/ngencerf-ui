<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Workflow - Headwater Basin Gage Tab</div>
    <div class="_help-subtitle">&nbsp</div>
    <p class="text-center" style="color:orange;font-size:0.8em;">
      WARNING: Clicking the browser refresh button logs you out of ngenCERF, usually on your next action.
    </p>

    <table class="_help-table">
      <tbody>
        <tr>
          <td class="td1">Domain:</td>
          <td class="td2">Pull down to select the domain of interest. Choices are CONUS, Alaska, Hawaii and Puerto
            Rico/US
            Virgin Islands.</td>
        </tr>
        <tr>
          <td class="td1">Gage:</td>
          <td class="td2">Pull down to select a gage from the chosen domain. Typing in this field shows predictive
            choices.
            A choice must be made from the pull down list. Required to upload Forcing, Observational or GeoPackage
            files.
          </td>
        </tr>
        <tr>
          <td class="td1">Forcing:</td>
          <td class="td2">Pull down to select Forcing data source for the selected gage. Either Data Services for Enterprise
            Data Services or Upload to upload from local computer. <br /> <br />
            A gage must have already been selected to upload a file. Upload allows the user to specify their own csv 
            tfile containing hourly time-series details of forcing data. The files (one per catchment in the headwater 
            basin for the selected gage)
            must be in the following format, with the 1st line being the header identifying the following fields:<br />
            Time, LWDOWN, PFC, Q2D, RAINRATE, SWDOWN, T2D, U2D, V2D<br />
            <br>
            Example:<br />
            <a :href=image1 target="_blank"><img :src=image1 /></a><br />
            <img :src=image2 width="90%" class="mb-2" />
          </td>
        </tr>
        <tr>
          <td class="td1">Observational:</td>
          <td class="td2">Pull down to select Observational Data source for the selected gage. Either Data Services for Enterprise
            Data Services or Upload to upload from local computer. <br /> <br />
            Upload allows the user to specify their own csv file hourly time-series details of observed gage streamflow data.
            A gage must have already been selected
            to upload a file. This file must be in the following format, with the the 1st line being the header
            identifying the following fields:<br /><br />
            <span class="italic">dateTime, q_cms</span><br />
            Example:<br />
            <img :src=image3 /><br />
          </td>
        </tr>
        <tr>
          <td class="td1">GeoPackage:</td>
          <td class="td2">Pull down to select the source for the selected gage GeoPackage file. Either Data Services for Enterprise
            Data Services or Upload to upload from local computer. <br /> <br />
            Upload allows the user to specify their own .gpkg file. A gage must have already been selected to upload a file.</td>
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
      </tbody>
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
