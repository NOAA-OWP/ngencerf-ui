<template>
    <div class="_help-page">
        <div class="_help-title">Calibration - Tuning Controls Tab</div>
        <div class="_help-subtitle">
            This tab provides the ability to select the time periods for calibration,
            the time periods for automatic validation using the best set of parameters
            determined during the calibration process, the output variable to calibrate and
            which module parameters for the selected formulation to tune during calibration.<br />
            <br />
            When LSTM is a module in the formulation, only Time Controls are required from this tab.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr />
        <p style="margin-left: 10px; font-size:0.9em; line-height: 20px;">
            <em>The Previous and Next buttons on each of the tabs are meant to guide the user through a calibration
                setup, starting here at the Headwater Basin Gage tab. The user can also simply click a tab or a link in the
                Progress area to go to that specific setup tab.</em>
        </p>
        <div style="margin-left: 25px; margin-top:20px;">
            <div class="text-center font-bold text-xl mb-3">General Rules</div>
            <div style="margin-left: 10px;">
                <ul style="list-style-type: disc;margin-left: 20px;">
                    <li>When entering data manually, press <strong>Enter</strong> to confirm each field;
                        otherwise, the value will be discarded.</li>
                    <li>When using the Date Time widget, click <strong>Select</strong> to confirm the field.</li>
                    <li>Forcing and observational data must have been selected on the Headwater Basin Gage
                        tab to enter Time Controls.</li>
                    <li>The formulation must have been saved on the Formulation tab to select the Output
                        Variable to Calibrate and Tuning Parameters.</li>
                    <li>Partial saves are allowed, but all fields in the Time Controls section 
                        must be completed before saving that section.</li>
                </ul>
            </div>
            <br />
            
            <div id="time-control-rules" class="mb-6">
                <div class="text-center font-bold text-xl mb-3">Time Control Rules</div>

                <!-- Rules -->
                <div class="ml-2 space-y-3">
                    <p><strong>1. Calibration Time Controls</strong></p>
                    <ul class="list-disc list-outside ml-9 space-y-0">
                        <li>Calibration period must fall within the <strong>Calibration Simulation</strong> period.</li>
                        <li>Calibration period cannot overlap the <strong>Validation</strong> period.</li>
                    </ul>

                    <p><strong>2. Validation Time Controls</strong></p>
                    <ul class="list-disc list-outside ml-9 space-y-0">
                        <li>Validation period must fall within the <strong>Validation Simulation</strong> period.</li>
                        <li>Validation Simulation period must encompass the entire <strong>Calibration</strong> period.</li>
                    </ul>

                    <p><strong>3. Hourly requirement</strong></p>
                    <ul class="list-disc list-outside ml-9 space-y-1">
                        <li>All times are in full hours and must be specified at the top of the hour (hh:00).</li>
                    </ul>
                </div>

                <!-- Example -->
                <div class="mt-4">
                    <p class="font-bold mb-2">Example</p>

                    <div class="ml-2 space-y-2">
                        <p><strong>Calibration Times:</strong></p>
                        <ul class="list-disc list-outside ml-6 space-y-0">
                            <li>Simulation period: 2015-10-01 00:00 → 2017-09-30 23:00</li>
                            <li>Calibration period: 2016-10-01 00:00 → 2017-09-30 23:00</li>
                        </ul>

                        <p><strong>Validation Times:</strong></p>
                        <ul class="list-disc list-outside ml-6 space-y-0">
                            <li>Simulation period: 2016-10-01 00:00 → 2020-09-30 23:00</li>
                            <li>Validation period: 2019-10-30 00:00 → 2020-09-30 23:00</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <br />
        <table class="_help-table" aria-describedby="Tuning Controls Tab Help Table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Entering Times</td>
                    <td class="td2">Times are UTC.<br>
                        Times can be selected using the date picker or entered manually.<br />
                        Manual Format: YYYY-MM-DD HH:MM<br />
                        Cut and paste can be used.<br />
                    </td>
                </tr>
                <tr>
                    <td class="td1">&nbsp;</td>
                    <td class="td2">&nbsp;</td>
                </tr>
                <tr>
                    <td class="td1">Range</td>
                    <td class="td2">Non-editable field displaying the available time range for running calibration and
                        validation. This is determined by the time ranges available in the forcing and observational 
                        data selected in the Headwater Basin Gage tab. All time controls are constrained by this range.</td>
                </tr>
                <tr>
                    <td class="td1">Calibration Time Controls</td>
                    <td class="td2">The user selects four times to run the calibration. The Simulation Start and End
                        times reflect the period of time to perform the entire run. The Calibration Start and End times
                        reflect the period of time to actually calibrate using the tuning parameters. This allows for 
                        a “warm-up” period prior to performing the calibration.</td>
                </tr>
                <tr>
                    <td class="td1">Validation Time Controls</td>
                    <td class="td2">Same rules as the Calibration Time Controls except the Validation time range is
                        further constrained in that it cannot overlap the Calibration time range.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Output Variable to Calibrate</td>
                    <td class="td2">Dropdown field to select the output variable to calibratte based on the chosen
                        formulation. Streamflow is the only option at this time.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Calibration Tuning Parameters</td>
                    <td class="td2">Either upload from a file or select from the available calibration parameters based
                        on the formulation chosen.</td>
                </tr>

                <tr>
                    <td class="td1">Load Parameters Button</td>
                    <td class="td2">Click this to upload calibration tuning parameters from text file<br />
                        <ul style="list-style-type: disc;margin-left: 20px;">
                            <li>File can be csv, space delimited or tab delimited</li>
                            <li>If a parameter already exists in the table, the value from the file will overwrite the
                                table value</li>
                            <li>Any parameters in the file that are not available for the fomulation will be discarded
                                and a warning message displayed</li>
                            <li>Valid model names: CFE-S, CFE-X, LASAM, Noah-OWP-Modular, Sac-SMA, SFT, SMP, Snow-17, T-Route, TopModel, UEB</li>
                        </ul>
                        Example:<br />
                        <img class="mx-auto" width="90%" :src="image1" alt="Example Load Parameter File Image" />
                    </td>
                </tr>
                <tr>
                    <td class="td1">Calibratable Parameters</td>
                    <td class="td2">Dropdown field of calibration parameters based on the formulation.</td>
                </tr>
                <tr>
                    <td class="td1">Add Button</td>
                    <td class="td2">Click this to add the selected parameter to the Paraemter Table. Any data provided
                        by Enterprise Data Services will be added as well.
                        The user must ensure all values for this parameter are entered in the table.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Parameter Table</td>
                    <td class="td2">Editable list of the calibration parameters chosen. The source for these entries can
                        be from the Calibratable Parameters dropdown or uploaded from a file.<br />
                        Minimum, maximum and initial values must be
                        provided.<br />
                        The initial value is used for the calibration control run, iteration 0, and may be outside the
                        min/max range.<br />
                        If it is outside the min/max range, the value is saved and a warning issued but the user may
                        proceed
                        or change the value and save again.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Right Click</td>
                    <td class="td2">Right click a parameters in the table to select Delete and remove it from the table.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Clear</td>
                    <td class="td2">Clear all entries in the parameters table.</td>
                </tr>
                <tr>
                    <td class="td1">Save Button</td>
                    <td class="td2">Save data from the tab. Partial saves are allowed.</td>
                </tr>
                <tr>
                    <td class="td1">Next Button</td>
                    <td class="td2">Move to the Optimization / Metrics Tab. If there is any unsaved data, the user will
                        first be prompted
                        to save.</td>
                </tr>
                <tr>
                    <td class="td1">Prev Button</td>
                    <td class="td2">Move to the Formulation Tab. If there is any unsaved data, the user will first be
                        prompted to
                        save.</td>
                </tr>
                <tr>
                    <td class="td1">&nbsp;</td>
                    <td class="td2">&nbsp;</td>
                </tr>
            </tbody>
        </table>

        <p><strong>HINTS</strong></p>
        <p><strong>Calibration Tuning Controls disabled</strong></p>
        <p style="margin-left:10px;">Either the observation data, the forcing data or both have not yet been
            selected. Go to the Headwater Basin Gage tab and make sure this data has selected, uploded if
            Upload
            selected, and saved.
        </p>
        <p><strong>Parameters disabled</strong></p>
        <p style="margin-left:10px;">The Formulation has not been chosen. Go to the Formulation tab and select the
            formulation.
        </p>
        <p><strong>No data in parameter file</strong></p>
        <p style="margin-left:10px;">The file may not exist, be empty, missing a required column or missing data.
        </p>
    </div>
</template>

<script setup lang="ts">
import image1 from "@/assets/styles/img/TuningParameterLoadFileExample.png"
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
