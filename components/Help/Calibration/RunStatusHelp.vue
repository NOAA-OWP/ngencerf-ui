<template>
    <div class="_help-page">
        <div class="_help-title">Calibration - Status/Run Tab</div>
        <div class="_help-subtitle">This tab provides the user the ability to review their calibration setup,
            run a calibration when status is Ready, view plots and logs during a run or after a run has finished.</div>
        <br />
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <div style="margin-left: 30px; margin-top:20px;">
            <ul style="list-style-type: disc;">
                <li>The right side of each tab in the Calibration workflow shows the Progress towards completing a
                    calibration
                    setup
                    and a summary of the choices made for the setup.</li>
                <li>Once all the required data has been entered, all checkmarks will be set
                    and the status will be Ready. Otherwise the status will be Saved or one of the finished statuses.
                </li>
                <li>When the user hits Run, the final subsetting and validation of acquired data occurs. Depending on the size of
                    the headwater basin, this could delay the actual start of the calibration run. Another delay can
                    occur while waiting for resources.
                </li>
                <li>Normal Status Transitions:</li>
                <li style="list-style-type: none;padding-left: 10px;">
                    <strong>Calibration Ready -&gt; Submitted -&gt; Calibration Running -&gt; Calibration Done,
                        Validation Control
                        Running -&gt;
                        Calibration Done, Validation Best Running -&gt; Done </strong>
                </li>
                <li>Once the calibration job has started, after the 1st iteratoin, the user can view plots. These plots
                    will be
                    automatically updated
                    while the job is running based on the plot interval specified by the user.</li>
                <li>The user can stop a running job by clicking the Cancel button.</li>
                <li>When a job is running or finished, the user can view plots and logs generated during the calibration
                    and
                    validation runs.</li>
                <li>If a job fails during the calibration run, the <strong>ngen.log</strong> file will be displayed to
                    aid understanding the failure.</li>
            </ul>
        </div>
        <br />
        <table class="_help-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Submit Time</td>
                    <td class="td2">Date/Time the job was submitted to run.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Elapsed Time</td>
                    <td class="td2">Time elapsed since the job was submitted. Time is in days, HH:MM:SS</td>
                </tr>
                <tr>
                    <td class="td1">Iteration</td>
                    <td class="td2">Iteration number completed. When both the calibration and validation jobs are
                        complete, This
                        represents the best iteration number from the calibration and the label changes.
                    </td>
                </tr>
                <tr>
                    <td class="td1">&nbsp;</td>
                    <td class="td2">&nbsp;</td>
                </tr>
                <tr>
                    <td class="td1">Status</td>
                    <td class="td2">Job status.</td>
                </tr>
                <tr>
                    <td class="td1">Run Button</td>
                    <td class="td2">Start the Calibration. Appears when job is in the Ready state.</td>
                </tr>
                <tr>
                    <td class="td1">Cancel Button</td>
                    <td class="td2">Stop/cancel the calibration before it has completed. Appears only when a job is
                        running.</td>
                </tr>
                <tr>
                    <td class="td1">Global Logging</td>
                    <td class="td2">Enable or Disable the Error Warning and Trapping system for ngen and modules.</td>
                </tr>
                <tr>
                    <td class="td1">Log Levels</td>
                    <td class="td2">Set the individual log level for ngen and modules.</td>
                </tr>
                <tr>
                    <td class="td1">&nbsp;</td>
                    <td class="td2">&nbsp;</td>
                </tr>
                <tr>
                    <td class="td1">Display</td>
                    <td class="td2">Once at least one iteration has been completed, plots are available for monitoring
                        the
                        calibration
                        process. Use this pulldown to select the plot. A message will appear if the plot is not
                        available yet. These
                        plots
                        are also available to view after the run is complete. Go to the Evaluation workflow to view the
                        time series
                        and other
                        data associated with each plot.</td>
                </tr>
                <tr>
                    <td class="td1">&nbsp;</td>
                    <td class="td2">&nbsp;</td>
                </tr>
                <tr>
                    <td class="td1">Evaluate Button</td>
                    <td class="td2">Go the Evaluation workflow to view more details about the run, including plots, plot
                        data,
                        performance metrics and logs.</td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

._help-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 14px;
}
._help-subtitle {
    font-size: 14 px;
    text-align: center;
    padding-bottom: 14px;
}
._help-table .td1 {
    width: auto;
    min-width: 130px;
    vertical-align: top;
}

p {
    margin-left: 50px;
}
</style>
