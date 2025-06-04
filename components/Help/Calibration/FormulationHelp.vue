<template>
    <div class="_help-page">
        <div class="_help-title">Calibration - Formulation Tab</div>
        <div class="_help-subtitle">Provide a user defined formulation name for this calibration job and
            select the forumlation modules.</div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>

        <p style="margin-left: 10px; margin-top:20px;font-size:0.9em; line-height: 20px;">
            <strong>NOTE:</strong> <em>The Previous and Next buttons on each of the tabs are meant to guide the user
                through a calibration setup,
                starting at the Headwater Basin Gage tab. The user can also simply click a tab or a link in the Progress
                area to go to that specific setup tab.</em>
        </p>
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
                    <td class="td1">Formulation Name</td>
                    <td class="td2">Enter name for the formulation. Alphanumeric characters, underscore and dashes are
                        allowed. No spaces.</td>
                </tr>
                <tr>
                    <td class="td1">Select Modules</td>
                    <td class="td2">Select the modules to use in the formulation. When a module is selected,
                        the associated group(s) will be checked in the Groups Covered by Selections area.</td>
                </tr>
                <tr>
                    <td class="td1">Groups Filter</td>
                    <td class="td2">Pulldown filter to show only modules for the selected group type.
                    </td>
                </tr>
                <tr>
                    <td class="td1">Groups Covered by Selections</td>
                    <td class="td2">Group list of the types of modelling available from the Formulation modules.
                        Checkmarks show
                        the groups covered by the users module selections.
                    </td>
                </tr>
                <tr>
                    <td class="td1">&nbsp;</td>
                    <td class="td2">&nbsp;</td>
                </tr>
                <tr>
                    <td class="td1">Save Button</td>
                    <td class="td2">Save data from the tab. Partial saves are allowed.</td>
                </tr>
                <tr>
                    <td class="td1">Revert Button</td>
                    <td class="td2">If changes are made to the selected modules, the Revert button will appear. When
                        clicked it undo all the changes made to the list.</td>
                </tr>
                <tr>
                    <td class="td1">Prev Button</td>
                    <td class="td2">Move to the Headwater Basin Gage tab.</td>
                </tr>
                <tr>
                    <td class="td1">Next Button</td>
                    <td class="td2">Move to the Tuning Controls Tab. If there is any unsaved data, the user will first
                        be prompted
                        to save.</td>
                </tr>
            </tbody>
        </table>
        <div class="_help-title" style="padding-top: 20px;padding-bottom: 0px;">Formulation Rules</div>
        <div style="margin-left: 30px; margin-top:20px;">
            <ul style="list-style-type: disc;">
                <li>Only one module per process (except for SFT and SMP, which are always run together currently)</li>
                <li>Proceeses are Snowmelt, Evapotranspiration, Rainfall Runoff, Auxiliary Soil (aka Soil Moisture) and Routing</li>
                <li style="list-style-type: none;"> &nbsp;</li>
                <li><strong>Snowmelt Process</strong> (Optional)
                    <ul style="margin-left: 20px;">
                        <li style="font-style:italic">aka <strong>Snow Group</strong></li>
                        <li style="font-size:0.95em;"><strong>UEB:</strong></li>
                        <li style="margin-left: 15px;">
                            If selected, will override snowmelt component of nowah-owp-modular;
                            cannot be selected in conjunction with another snow model.
                        </li>
                        <li style="font-size:0.95em;"><strong>Snow-17</strong></li>
                        <li style="font-size:0.95em;"><strong>noah-owp-modular:</strong></li>
                        <li style="margin-left: 15px;margin-bottom:15px;">
                            If noah-owp-modular is selected for snowmelt, it is also selected
                            as the evapotranspiration module if another single purpose
                            evapotranspiration module has not been selected.
                        </li>
                        <li style="margin-left: 15px;">
                            If noah-owp-modular has been selected as the evapotranspiration module,
                            and another single purpose snow-melt module has been selected, the user will be warned
                            that there are two snow-melt modules selected and noah-owp-modular will not be used for
                            snow-melt.
                        </li>
                    </ul>
                </li>
                <li style="list-style-type: none;"> &nbsp;</li>
                <li><strong>Evapotranspiration Process</strong> (Required, except for LSTM)
                    <ul style="margin-left: 20px;">
                        <li style="font-style:italic">aka <strong>Evapotranspiration Group</strong></li>
                        <li style="font-size:0.95em;"><strong>noah-owp-modular:</strong></li>
                        <li style="margin-left: 15px;">
                            If noah-owp-modular is selected for evapotranspiration, it is also selected as
                            the snow model if another single purpose snow model has not been selected.
                        </li>
                        <li style="font-size:0.95em;"><strong>potential-evapotranspiration (PET):</strong></li>
                        <li style="margin-left: 15px;">
                            <span style="color:#cc5500;font-size:.9em;"><em>Not currently integrated in ngenCERF</em></span>
                        </li>
                    </ul>
                </li>
                <li><strong>Rainfall Runoff Process</strong> (Required)
                    <ul style="margin-left: 20px;">
                        <li style="font-style:italic">aka <strong>Rainfall Runoff Group</strong></li>
                        <li style="font-size:0.95em;"><strong>CFE-S, CFE-X</strong></li>
                        <li style="font-size:0.95em;"><strong>Sac-SMA</strong></li>
                        <li style="font-size:0.95em;"><strong>TopModel:</strong></li>
                        <li style="font-size:0.95em;"><strong>LASAM</strong></li>
                        <li style="font-size:0.95em;"><strong>LSTM:</strong></li>
                        <li style="font-size:0.95em;"><strong>noah-owp-modular:</strong></li>
                        <li style="margin-left: 15px;">
                            If LSTM is selected as the rainfall runoff model the snow-melt, evapotranspiration,
                            and auxiliary soil processes will be disabled.
                        </li>
                    </ul>
                </li>
                <li style="list-style-type: none;"> &nbsp;</li>
                <li><strong>Auxiliary Soil Process</strong> (Optional)
                    <ul style="margin-left: 20px;">
                        <li style="font-style:italic">aka <strong>Soil Moisture Group</strong></li>
                        <li style="font-size:0.95em;"><strong>sft/smp:</strong></li>
                        <li style="margin-left: 15px;">
                            SFT and SMP currently run together in ngen-cal.<br />
                            They require either CFE-(X, S) or LASAM.<br />
                            They share parameters with CFE and LASAM, so calibration of those parameters is done jointly.
                        </li>
                    </ul>
                </li>
                <li style="list-style-type: none;"> &nbsp;</li>
                <li><strong>Routing</strong> (Required)
                    <ul style="margin-left: 20px;">
                        <li style="font-size:0.95em;"><strong>T-Route</strong></li>
                    </ul>
                </li>
                <li style="list-style-type: none;"> &nbsp;</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
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
</style>
