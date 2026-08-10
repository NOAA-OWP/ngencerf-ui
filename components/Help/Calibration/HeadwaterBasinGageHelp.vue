<template>
    <div class="_help-page">
        <div class="_help-title" id="help-title">Calibration - Headwater Basin Gage Tab</div>
        <div class="_help-subtitle">Select the calibration gage for a headwater basin, along with the
            source for the Forcing Data, Observational Data and GeoPackage.
        </div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr class="my-6 border-black" />
        <p style="margin-left: 10px; font-size:0.9em; line-height: 20px;">
            <em>The Previous and Next buttons on each of the tabs are meant to guide the user through a calibration setup, 
                starting here at the Headwater Basin Gage tab. The user can also simply click a tab or a link in the Progress
                area to go to that specific setup tab.</em>
        </p>
        <table class="_help-table" aria-describedby="Headwater Basin Gage Tab Help Table">
            <thead>
                <tr>
                    <th scope="row">Item</th>
                    <th scope="row">Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td1">Job Name<span class="required-asterisk" aria-hidden="true">*</span></td>
                    <td class="td2">Enter name for the job. Alphanumeric characters, underscore (_) and dashes (-) are
                        allowed. <strong>Spaces are not allowed</strong>.</td>
                </tr>
                <tr>
                    <th scope="row" class="td1">Domain</th>
                    <td class="td2">Pull down to select the domain of interest. Choices are CONUS, Alaska, Hawaii and
                        Puerto
                        Rico/US Virgin Islands. This is optional.</td>
                </tr>
                <tr>
                    <th scope="row" class="td1">Gage<span class="required-asterisk" aria-hidden="true">*</span></th>
                    <td class="td2">Pull down to select a calibration gage. If a domain has been selected, only gages
                        from that domain will be avaialbe. Typing in this field shows predictive choices.
                        User must select the choice from the list.
                    </td>
                </tr>
                <tr>
                    <th scope="row" class="td1">Forcing<span class="required-asterisk" aria-hidden="true">*</span></th>
                    <td class="td2">Pull down to select Forcing data source for the selected gage.
                        Either AORC or NWM Retrospective.
                    </td>
                </tr>
                <tr>
                    <td class="td1">&nbsp;</td>
                    <td class="td2">&nbsp;</td>
                </tr>
                <tr>
                    <th scope="row" class="td1">Save Button</th>
                    <td class="td2">Save data from the tab. Partial saves are allowed.</td>
                </tr>
                <tr>
                    <th scope="row" class="td1">Revert Button</th>
                    <td class="td2">If the saved gage ID is changed, the Revert button will appear. When
                        clicked it will undo the change, reverting to the saved gage ID.</td>
                </tr>
                <tr>
                    <th scope="row" class="td1">Next Button</th>
                    <td class="td2">Move to the Formulation Tab. If there is any unsaved data, the user will first be
                        prompted to save.</td>
                </tr>
            </tbody>
        </table>
        <div class="required-hint mt-0 mb-4">
            <span class="required-asterisk">*</span> An asterisk next to a label indicates a required field
        </div>
        <hr class="my-6 border-black" />
        <p><strong>Note:</strong><br /> 
            Gage details are shown when a gage id is selected. The basin map is generated once
            the Save button is clicked.</p>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
