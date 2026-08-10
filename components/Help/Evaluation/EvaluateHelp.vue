<template>
    <div class="_help-page">
        <div class="_help-title">Evaluation - Evaluate Tab</div>
        <div class="_help-subtitle">
            Examine plots, times series and other information related to a calibration and validation run.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr />
        <p class="text-center font-bold" id="actionsSectionTitle">Available Actions</p>
        <table class="_help-table" aria-describedby="Evaluate Button and Link Action Help Table">
            <thead>
                <tr>
                    <th class="td1">Action</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">New Validation Button</td>
                    <td class="td2">Select an alternate iteration to run a validation to generate the associated plots.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Show Calibration Details Link</td>
                    <td class="td2">A window will be displayed summarizing the setup details for the calibration.</td>
                </tr>
            </tbody>
        </table>

        <hr class="mt-2 mb-4" />
        <p class="text-center font-bold" id="CaliPlotSectionTitle">Calibration Plots</p>
        <table class="_help-table" aria-describedby="Evaluate Calibration Plots Help Table">
            <thead>
                <tr>
                    <th class="td1">Item</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Hydrograph evolution</td>
                    <td class="td2">Comparison of streamflow time series between observation and simulations from the
                        control, last, and best runs. Associated data displayed in adjacent table.</td>
                </tr>
                <tr>
                    <td class="td1">Objective Funtion evolution</td>
                    <td class="td2">Scatter plot of objective function vs iteration number. Associated data displayed in
                        adjacent table.</td>
                </tr>
                <tr>
                    <td class="td1">Metric evolution</td>
                    <td class="td2">Scatter plots of objective function and each other metric vs iteration number.
                        Associated data displayed in adjacent table.</td>
                </tr>
                <tr>
                    <td class="td1">Parameter evolution</td>
                    <td class="td2">Scatter plot of each calibration parameter vs iteration number. Associated data
                        displayed in adjacent table.</td>
                </tr>
                <tr>
                    <td class="td1">Scatterplot streamflow</td>
                    <td class="td2">Scatter plot of observed streamflow vs simulated streamflow from the control, best,
                        and
                        last runs. Associated data displayed in adjacent table.</td>
                </tr>
                <tr>
                    <td class="td1">Metrics vs Objective Function</td>
                    <td class="td2">Scatter plots of objective function and each other metric. Associated data displayed
                        in
                        adjacent table.</td>
                </tr>
                <tr>
                    <td class="td1">Streamflow Precipitation</td>
                    <td class="td2">Same as Hydrograph evolution but here precipitation time series is add at the top
                        using
                        inverted y-axis.
                        Data for this plot is calcuated internally by the program and unavailable for table display.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Flow Duration Curves</td>
                    <td class="td2">Comparison of flow duration curve (FDC) between streamflow observation and
                        simulations
                        from the control, last, and best runs.
                        Data for this plot is calcuated internally by the program and unavailable for table display.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Snow Water Equivalent</td>
                    <td class="td2">View a time series of SWE data from the simulation run, historical SNODAS SWE and
                        SNOTEL
                        data.
                        <ul style="list-style-type: disc;padding-left:20px;">
                            <li>Use the slider at the bottom of the viewer to change the area of view.</li>
                            <li>Adjust the date range viewed by dragging the slider.</li>
                            <li>Adjust the size of viewable area by dragging the left or right edge.</li>
                            <li>Hover over a point on the graph to get specific details, such as source, date/time,
                                and depth.</li>
                            <li>Toggle the checkboxes to hide/show differnt plots</li>
                            <li>Customize the plot colors and points using <strong>Customize Viewer</strong>.</li>
                            <li>Click on a point on a graph to populate the <strong>Select Date</strong> field</li>
                            <li>Click <strong>Get Spatial Plots</strong> to generate and view the gridded
                                and basin average images of the SNODAS SWE next to the basin averaged image of the
                                simulated
                                SWE.
                                SNOTEL stations, if they are available, will be shown in the images.</li>
                            <li>Click <strong>Show SWE Time Series</strong> to return to the Time Series Viewer</li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
        <br />
        <p class="text-center font-bold" id="ValidatePlotSectionTitle">Validation Plots</p>
        <table class="_help-table" aria-describedby="Evaluate Validation Plots Help Table">
            <thead>
                <tr>
                    <th class="td1">Item</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Bar Chart Metrics</td>
                    <td class="td2">Bar chart comparing metrics from best & control validation runs for each evaluation
                        period (calib, valid. full).
                        Worker is also charted if evaluating an alternate iteration validation.
                        Associated data displayed in adjacent table.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Flow Duration Curves Validation</td>
                    <td class="td2">Plot of flow duration curve comparing best & control validation runs with
                        observation
                        for each evaluation period (calib, valid, full).
                        Data for this plot is calcuated internally by the program and unavailable for table display.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Hydrograph Validation</td>
                    <td class="td2">Plot comparing streamflow time series from best and control validation runs with
                        observed streamflow.
                        Data for this plot is calcuated internally by the program and unavailable for table display.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Streamflow Validation Precipitation</td>
                    <td class="td2">Same as Hydrograph Validation but with precipitation added at the top using inverted
                        y-axis.
                        Data for this plot is calcuated internally by the program and unavailable for table display.S
                    </td>
                </tr>
            </tbody>
        </table>
        <br />
        <p class="text-center font-bold" id="TableSectionTitle">Tables</p>
        <table class="_help-table" aria-describedby="Evaluate List of Displayabe Tables Help Table">
            <thead>
                <tr>
                    <th class="td1">Item</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Iteration Metrics Table</td>
                    <td class="td2">Metrics for each iteration.</td>
                </tr>
                <tr>
                    <td class="td1">Iteration Parameters Table</td>
                    <td class="td2">Tuning Paremeters for each iteration.</td>
                </tr>
                <tr>
                    <td class="td1">Performance Metrics Table</td>
                    <td class="td2"><strong>Metric:</strong>
                        <ul style="margin-left: 10px;">
                            <li><b>Elapsed Time</b> - <em>The job's elapsed time</em></li>
                            <li><b>Num Cpus</b> - <em>Total number of CPUs allocated to the job</em></li>
                            <li><b>Cpu Time </b>- <em>Elapsed time * CPU count</em></li>
                            <li><b>Max Rss</b> - <em>Maximum resident set size of all tasks in job</em></li>
                            <li><b>Max Disk Read</b> - <em>Maximum number of bytes read by all tasks in job</em></li>
                            <li><b>Max Disk Write</b> - <em>Maximum number of bytes written by all tasks in job</em>
                            </li>
                            <li><b>Reserved Time</b> - <em>How much wall clock time was used as planned time for this
                                    job.
                                    This is derived from how long a job was waiting in PW from eligible time to when it
                                    started or was cancelled.</em></li>
                            <li><b>Io Throughput</b> - <em> Computed: (Max Disk Read + Max Disk Write) / Elapsed
                                    Time</em>
                            </li>
                        </ul>
                        <p style="margin-top:12px;margin-left: 10px;"><strong>Note:</strong> <em>Elapsed time fields are
                                presented as</em>
                            [days-]hours:minutes:seconds[.microseconds]</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <br />
        <p class="text-center font-bold" id="LogSectionTitle">Logs</p>
        <table class="_help-table" aria-describedby="Evaluate Calibration and Validation Logs Help Table">
            <thead>
                <tr>
                    <th class="td1">Item</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Calibration</td>
                    <td class="td2">Output (stdout, stderr) from ngen-cal and ngen calibration runs.</td>
                </tr>
                <tr>
                    <td class="td1">Validation Logs</td>
                    <td class="td2">Outputs (stdout, stderr) from ngen-cal and ngen validation run.</td>
                </tr>
                <tr>
                    <td class="td1">Global Logs</td>
                    <td class="td2">Error Warning and Trapping System log from the last run of ngen.</td>
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
</style>
