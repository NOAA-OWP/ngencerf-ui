<template>
    <div class="_help-page">
        <div class="_help-title">Forecast - Setup Forecast Tab</div>
        <p id="help-subtitle" class="_help-subtitle">
            Select the type of forecast to run.<br />
            <br />
            Greyed out rows in the table are not yet available from the GUI. Use the ngenCERF CLI to run those
            cycles.
        </p>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr />
        <p class="text-center">
            <strong>IMPORTANT</strong><br />
            <strong>Short Range Forecast</strong> is for <strong>CONUS</strong> gages only.<br />
            Use the ngenCERF CLI for oCONUS Forecasts.<br />
            <br />
            <span style="color:red">Selecting an oCONUS gage will result in a Failed Forecast.</span>
        </p>
        <br />
        <p class="text-center">
            Once the forecast cycle is selected, click on the Next button to review and run the forecast.
        </p>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
