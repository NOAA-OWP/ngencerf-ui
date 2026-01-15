<template>
    <div class="_help-page">
        <div class="_help-title">Calibration - Run/Status Tab</div>
        <div class="_help-subtitle">This tab provides the user the ability to review their calibration setup,
            run a calibration when status is Ready, view plots and logs during a run or after a run has finished.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr class="my-6 border-black" />
        <div class="ml-2 mb-6">
            <p class="text-center font-bold text-xl mb-2">General Job Progress and Status</p>
            <ul class="list-disc list-outside ml-6 space-y-2">
                <li>
                    The right side of each tab in the <strong>Calibration workflow</strong> displays progress toward completing a calibration setup and summarizes the choices made for the setup.
                </li>
                <li>
                    Once all required data has been entered, all checkmarks are set and the status becomes <strong>Ready</strong>. Otherwise, the status remains <strong>Saved</strong> or one of the finished statuses.
                </li>
                <li>
                    Clicking <strong>Run</strong> triggers the final subsetting and validation of acquired data. Depending on the size of the headwater basin, this may delay the start of the calibration run. Additional delays may occur while waiting for available resources.
                </li>
                <li> <strong>Normal status transitions:</strong>
                    <li style="list-style-type: none;padding-left: 10px;">
                        <strong>Calibration Ready -&gt; Submitted -&gt; Calibration Running -&gt; Calibration Done,
                            Validation Control
                            Running -&gt;
                            Calibration Done, Validation Best Running -&gt; Done </strong>
                    </li>
                </li>
                <li>
                    <p class="font-bold mb-2">Iteration, Logs and Plots</p>
                    <ul class="list-disc list-outside ml-6 space-y-2">
                        <li>
                            Logs are available as soon as the job starts running, but some logs may not appear until 
                            downstream processes start (ie. ngen). This allows you to monitor progress in real time.
                        </li>
                        <li>
                            <strong>Iteration</strong> indicates the completed iteration number. Iteration 0 is the control run.
                        </li>
                        <li>
                            Once Iteration 0 is complete in a running calibration job, plots become available and are automatically updated according to the user-specified plot interval.
                        </li>
                        <li>
                            When the calibration phase completes successfully, the Iteration title changes to <strong>Best Iteration</strong> to highlight the optimal results.
                        </li>
                    </ul>
                </li>
                <li>
                    A running job can be stopped at any time by clicking the <strong>Cancel</strong> button.
                </li>
                <li>
                    While a job is running or after it has finished, users can view plots and logs generated during the calibration and validation runs.
                </li>
                <li>
                    If a job fails during the calibration run:
                    <ol class="list-decimal list-outside ml-4">
                        <li>The <strong>ngen.log</strong> file is automatically displayed to help identify the problem.</li>
                        <li>If the issue is not clear, select <strong>Calibration logs</strong> from <strong>Display</strong> 
                            and scroll through the console output (stdout/stderr) to investigate further.</li>
                    </ol>
                </li>
            </ul>
        </div>
        <hr class="my-6 border-black" />
        <div id="filters" class="text-center font-bold text-xl mb-3">Calibration Job Controls and Indicators</div>
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
                    <td class="td2">
                        Use this pulldown to select a plot or log. A message appears if the selected item is not yet 
                        available. Go to the Evaluation workflow to review associated time series and other data.
                    </td>
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
