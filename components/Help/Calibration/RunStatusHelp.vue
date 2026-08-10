<template>
    <div class="_help-page">
        <div class="_help-title">Calibration - Run/Status Tab</div>
        <div class="_help-subtitle">This tab provides the user the ability to review their calibration setup,
            run a calibration when status is Ready, view plots and logs during a run or after a run has finished.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr />
        <div style="margin-left: 30px; margin-top:10px;">
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
                    andvalidation runs.</li>
                <li>If a job fails during the calibration run, the <strong>ngen.log</strong> file will be displayed to
                    aid understanding the failure. If this log does not show the error, select Calibration logs from
                    Display and scroll to view output written to the console (stdout/stderr) to reveal the error</li>
            </ul>
        </div>
        <br />
        <table class="_help-table"  aria-describedby="Status / Run Tab Help Table">
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
    <br />
    <br />
    <hr />
    <div class="_help-title" style="padding-top: 20px;padding-bottom: 0px;">Job Statuses</div>
    <!-- Table -->
    <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden"
            aria-labelledby="status-table-caption" >
            <caption id="status-table-caption" class="sr-only" >
            Run Statuses
            </caption>

            <thead class="bg-gray-300">
            <tr>
                <th id="col-status" scope="col" class="px-4 py-3 text-left text-sm font-semibold text-gray-700 align-bottom border-r-2 border-gray-200">
                Status
                </th>
                <th id="col-description" scope="col" class="px-4 py-3 text-left text-sm font-semibold text-gray-700 align-bottom">
                Description
                </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <tr class="odd:bg-white even:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Saved
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                Some information has been saved, but the setup is not complete. Check the Progress checkmarks for missing items.
                Click on the item to go to the appropriate tab.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Ready
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                All the necessary information has been provided, and the job is ready to Run. Click the Run button to start the run.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Validating and Preparing Job Data
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                The backend is subsetting the data to the selected time range for the calibration/validation runs, running processes
                that validate/create the ngen realization file and the calibration manager input config file to submit the job for execution.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Submitted
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                Calibration has been submitted and waiting for resources from the cluster to begin execution.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Calibration Running
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                The calibration has begun. The iteration number reflects the last completed iteration run of ngen. 
                Iteration 0 is the control run executed by the calibration manager for metric calculations. 
                Logs are viewable once the calibration is in a running state. Calibration plots are viewable once 
                iteration 1 is complete. Validation plots are viewable once Validation Best is done.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Calibration Done, Validation Control Running
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                The calibration has completed the iterative running ngen. The calibration manager is currently 
                running the control run for validation metric calculations.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Calibration Done, Validation Best Running
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                Both the calibration run, and validation control run have completed successfully. 
                The validation best is running ngen with the best set of parameters determined during the calibration phase.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Done
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                Calibration and Validation runs of ngen have successfully completed. Results are viewable in both the 
                Calibration->Status/Run tab and the Evaluation workflow.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Calibration Failed
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                A failure occurred causing the Calibration Job to crash. Logs and Plots are viewable in the 
                Calibration->Status/Run tab. If running from within the GUI, the ngen.log file will be automatically 
                displayed in the UI. The user can also select to view the logs from the stdout/stdout runs of ngen 
                and the calibration manager, if they exist. Logs and Plots are viewable in the Calibration->Status/Run tab.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Calibration Done, Validation Control Failed
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                A failure occurred causing the Validation Control Job to crash. Logs and Plots are viewable in the 
                Calibration->Status/Run tab. If running from within the GUI, the ngen.log file will be automatically 
                displayed in the UI. The user can also select to view the logs from the stdout/stdout runs of ngen 
                and the calibration manager, if they exist.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Calibration Done, Validation Best Failed
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                A failure occurred causing the Validation Best Job to crash. Logs and Plots are viewable in the 
                Calibration->Status/Run tab. If running from within the GUI, the ngen.log file will be automatically 
                displayed in the UI. The user can also select to view the logs from the stdout/stdout runs of ngen
                and the calibration manager, if they exist.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Server Error
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                The server failed, interrupting the Calibration Job either during calibration, or one of the validation runs.
              </td>
            </tr>
            <tr class="odd:bg-white even:bg-gray-50  border-t-2 border-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-top border-r-2 border-gray-200">
                Cancelled
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 align-top">
                Calibration Job was cancelled by the user.
              </td>
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
