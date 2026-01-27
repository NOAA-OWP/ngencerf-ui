<template>
    <div class="_help-page">
        <div class="_help-title">Calibration - Optimization/Metrics Tab</div>
        <div class="_help-subtitle">This tab provides the ability to select the optimization algorithm, the
            objective function, the calibration stop criteria, the plot generation frequency and additional metrics to
            calculate. By default, the ngen-cal program does not calculate the Categorical Metrics, POD, CSI, and FAR or
            the Event Based Metrics, PKBIAS, PKTE, and EVBIAS but the user can opt to calculate these.<br />
            <br />
            This tab is not available when LSTM is a module in the formulation.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr />
        <p style="margin-left: 10px; font-size:0.9em; line-height: 20px;">
            <em>The Previous and Next buttons on each of the tabs are meant to guide the user through a calibration setup, 
                starting here at the Headwater Basin Gage tab. The user can also simply click a tab or a link in the Progress
                area to go to that specific setup tab.</em>
        </p>
        <table class="_help-table"  aria-describedby="Optimization/Metrics Tab Help Table">
            <thead>
            <tr>
                <th>Item</th>
                <th>Description</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td class="td1">Optimization Algorithm</td>
                <td class="td2">
                Select the optimization algorithm to use for calibration from the dropdown. Once selected,
                any required algorithm parameters will be automatically populated in the Algorithm Parameter table.
                </td>
            </tr>
            <tr>
                <td class="td1">Algorithm Parameters</td>
                <td class="td2">
                Each parameter name is listed. The user must provide the corresponding value.
                </td>
            </tr>
            <tr>
                <td class="td1">Calibration Stop Criteria</td>
                <td class="td2">
                Specifies the number of iterations each worker executes during calibration. DDS uses one worker, while GWO and PSO use 20 workers.
                </td>
            </tr>
            <tr>
                <td class="td1">Objective Function</td>
                <td class="td2">
                Select the metric to use as the objective function. All metrics in the table (MFDC, FBIAS, NSWwt) are valid choices.<br />
                - For Categorical metrics (POD, CSI, FAR), the Flow Threshold must be provided.<br />
                - For Event-based metrics (PKBIAS, PKTE, EVBIAS), the Peak Flow Threshold must be provided.
                </td>
            </tr>
            <tr>
                <td class="td1">Calculate Categorical Metrics</td>
                <td class="td2">
                Check this box to calculate Categorical Metrics if they are <strong>not</strong> selected as the Objective Function.  
                If a Categorical metric (POD, CSI, FAR) <strong>is selected as the Objective Function</strong>, this checkbox is automatically disabled.  
                The Flow Threshold must be entered when the checkbox is enabled.
                </td>
            </tr>
            <tr>
                <td class="td1">Calculate Event-Based Metrics</td>
                <td class="td2">
                    Check this box to calculate Event-Based Metrics if they are <strong>not</strong> selected as the Objective Function.  
                    If an Event-Based metric (PKBIAS, PKTE, EVBIAS) <strong>is selected as the Objective Function</strong>, this checkbox is automatically disabled.  
                    The Peak Flow Threshold must be entered when the checkbox is enabled.
                </td>
            </tr>
            <tr>
                <td class="td1">Save Button</td>
                <td class="td2">
                Saves data from the tab. Partial saves are allowed.
                </td>
            </tr>
            <tr>
                <td class="td1">Prev Button</td>
                <td class="td2">
                Moves to the Tuning Controls Tab. If there is unsaved data, the user is prompted to save or discard changes.
                </td>
            </tr>
            <tr>
                <td class="td1">Next Button</td>
                <td class="td2">
                Moves to the Run/Status Tab. If there is unsaved data, the user is prompted to save or discard changes.
                </td>
            </tr>
            </tbody>
        </table>
        <hr />
        <div class="mt-4">
            <p class="mb-2 text-center font-bold">Metric Definitions</p>
            <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-200 text-left text-sm" 
                    aria-label="Metrics table listing all calibration and evaluation metrics with descriptions">
                <thead class="bg-gray-300 font-bold">
                <tr>
                    <th class="px-4 py-1 font-bold">Metric Acronym</th>
                    <th class="px-4 py-1 font-bold">Description</th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">Corr</td>
                    <td class="px-4 py-1">Pearson Correlation</td>
                </tr>
                <tr class="bg-yellow-50 hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">CSI</td>
                    <td class="px-4 py-1">Critical Success Index (Categorical Metric)</td>
                </tr>
                <tr class="bg-blue-50 hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">EVBIAS</td>
                    <td class="px-4 py-1">Event Volume Bias (Event-Based Metric)</td>
                </tr>
                <tr class="bg-yellow-50 hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">FAR</td>
                    <td class="px-4 py-1">False Alarm Ratio (Categorical Metric)</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">HSEG_FDC</td>
                    <td class="px-4 py-1">Percent bias of high flow segment of flow duration curve</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">KGE</td>
                    <td class="px-4 py-1">Kling-Gupta Efficiency</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">LSEG_FDC</td>
                    <td class="px-4 py-1">Percent bias of low flow segment of flow duration curve</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">MAE</td>
                    <td class="px-4 py-1">Mean Absolute Error</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">NNSE</td>
                    <td class="px-4 py-1">Normalized NSE</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">NSE</td>
                    <td class="px-4 py-1">Nash-Sutcliffe Efficiency</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">NSELog</td>
                    <td class="px-4 py-1">NSE of logarithmic values</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">PBIAS</td>
                    <td class="px-4 py-1">Percent Bias</td>
                </tr>
                <tr class="bg-blue-50 hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">PKBIAS</td>
                    <td class="px-4 py-1">Event Absolute Peak Flow Bias (Event-Based Metric)</td>
                </tr>
                <tr class="bg-blue-50 hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">PKTE</td>
                    <td class="px-4 py-1">Event Peak Flow Timing Error (Event-Based Metric)</td>
                </tr>
                <tr class="bg-yellow-50 hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">POD</td>
                    <td class="px-4 py-1">Probability of Detection (Categorical Metric)</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">RMSE</td>
                    <td class="px-4 py-1">Root Mean Square Error</td>
                </tr>
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-1 font-bold">RSR</td>
                    <td class="px-4 py-1">Ratio of RMSE to standard deviation of observation</td>
                </tr>
                </tbody>
            </table>
            </div>
            <p class="mt-4 text-md font-semibold">Legend</p>
            <div class="overflow-x-auto mt-1">
            <table class="min-w-max border border-gray-200 text-left text-sm" aria-label="Legend table explaining metric types and corresponding background colors">
                <thead class="bg-gray-300 font-bold">
                <tr>
                    <th>&nbsp;</th> 
                    <th class="px-2 py-1 font-bold" scope="col">Metric Type</th>
                    <th class="px-2 py-1 font-bold" scope="col">Description</th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                    <td class="px-2 py-0.5">
                    <div class="w-5 h-5 bg-yellow-50 border border-gray-300"></div>
                    </td>
                    <td class="px-2 py-0.5 font-bold">Categorical Metric</td>
                    <td class="px-2 py-0.5">Metrics based on categorical event detection (e.g., POD, CSI, FAR)</td>
                </tr>
                <tr>
                    <td class="px-2 py-0.5">
                    <div class="w-5 h-5 bg-blue-50 border border-gray-300"></div>
                    </td>
                    <td class="px-2 py-0.5 font-bold">Event-Based Metric</td>
                    <td class="px-2 py-0.5">Metrics based on event flows, peaks, or volumes (e.g., EVBIAS, PKBIAS, PKTE)</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
