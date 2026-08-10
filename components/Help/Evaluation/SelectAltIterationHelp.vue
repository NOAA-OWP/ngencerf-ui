<template>
    <div class="_help-page">
        <div class="_help-title">Evaluation - Select Alternate Iteration</div>
        <div class="_help-subtitle">
            Use these tables to select the alternate iteration from the calibration job to 
            run a validation and generate the correspoding plots.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr />
        <p class="text-center">Sort table by clicking on the sort icon in a column.</p>
        <br />
        <p class="font-bold">Run Details Table</p>
        <p style="position: relative; left: 20px;">
            This table shows the metrics calculated for each iteration.
        </p>
        <ul style="list-style-type: disc;margin-left:100px;">
            <li>The first 2 rows are fixed.</li>
            <li>The first row, NWM 3.0, contains the metric values calculated
                from the NWM 3.0 retrospective data.</li>
            <li>The second row contains the metric values from the best iteration as
                determined by the calibration program.</li>
            <li>This table scrolls in unison with the Corresponding Calibration
                Tuning Parameters table.</li>
        </ul>
        <br />
        <p class="font-bold">Corresponding Calibration Tuning Parameters Table</p>
        <p style="position: relative; left: 20px;">
            This table shows the value of the tuning parameters for each iteration.
        </p>
        <ul style="list-style-type: disc;margin-left:100px;">
            <li>The first is fixed and contains the values from the best iteration as determined by the calibration
                program.</li>
            <li>This table scrolls in unison with the Run Details table.</li>
        </ul>
        <br />
        <p class="font-bold">Select the iteration and click Next.</p>
        <p style="position: relative; left: 20px;">You may have to scroll the tab down a bit to see the Next button.</p>
        <br />
        <p class="font-bold">HINTS</p>
        <p style="position: relative; left: 20px;">Iterations in grey have already been run and are unselectable.</p>
        <p style="position: relative; left: 20px;"><span style="color:orange">Orange-shaded</span> metric was used as the Objective Function.</p>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
