<template>
    <div class="_help-page">
        <div class="_help-title">Calibration - Formulation Tab</div>
        <div class="_help-subtitle">Provide a user defined job name for this calibration job and
            select the forumlation modules.</div>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr class="my-6 border-black" />
        <p style="margin-left: 10px; font-size:0.9em; line-height: 20px;">
            <em>The Previous and Next buttons on each of the tabs are meant to guide the user through a calibration setup, 
                starting here at the Headwater Basin Gage tab. The user can also simply click a tab or a link in the Progress
                area to go to that specific setup tab.</em>
        </p>
        <hr class="my-6 border-black" />
        <div style="margin-left: 25px; margin-top:20px;">
            <div class="text-center font-bold text-xl mb-3">General Rules</div>
            <div style="margin-left: 10px;">
                <ul style="list-style-type: disc;margin-left: 20px;">
                    <li>When entering data manually, press <strong>Enter</strong> to confirm each field;
                        otherwise, the value will be discarded.</li>
                    <li>A <strong>gage</strong> is required before anything on this tab can be selected.</li>
                    <li>Selecting modules automatically:
                        <ul class="list-disc list-outside ml-6 space-y-0">
                            <li>Checks the corresponding hydrologic group.</li>
                            <li>Displays which NWM v3 output variables will and will not be generated.</li>
                            <li>Shows the CFE Rootzone checkbox when a CFE module is selected.</li>
                        </ul>
                    </li>
                    <li>A formulation is <strong>Calibratable</strong> if it meets the formulation rules defined below.</li>
                    <li>A formulation is  <strong>Complete</strong> if it is calibratable and produces all required 
                        NWM v3 Output Variables.</li>
                    <li>Partial saves are allowed.</li>
                </ul>
            </div>
        </div>
        <hr class="my-6 border-black mt-6" />
        <div style="margin-left: 25px; margin-top:20px;">
            <div class="text-center font-bold text-xl mb-3">General Rules</div>
            <table class="_help-table"  aria-describedby="Formulation Tab Help Table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="td1">Select Modules<span class="required-asterisk" aria-hidden="true">*</span></td>
                        <td class="td2">Select the modules to use in the formulation. When a module is selected,
                            the associated group(s) will be checked in the <strong>Groups Covered by Selections</strong> area.</td>
                    </tr>
                    <tr>
                        <td class="td1">Groups Filter</td>
                        <td class="td2">Pulldown filter to show only modules for the selected group type.
                        </td>
                    </tr>
                    <tr>
                        <td class="td1">Groups Covered by Selections</td>
                        <td class="td2">Groups list the types of modeling available.<br >
                            Checkmarks indicate which groups are covered by your current module selections.
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
                        <td class="td2">The Revert button appears when anything on the tab changes. Clicking it 
                            restores the previous saved state.</td>
                    </tr>
                    <tr>
                        <td class="td1">Prev Button</td>
                        <td class="td2">Move to the Headwater Basin Gage tab. If there are unsaved changes, you will 
                            be prompted to either remain on the current tab or discard the changes before continuing.</td>
                    </tr>
                    <tr>
                        <td class="td1">Next Button</td>
                        <td class="td2">Moves to the Tuning Controls tab. If there are unsaved changes, you will 
                            be prompted to either remain on the current tab or discard the changes before continuing.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="required-hint mt-0 mb-4">
            <span class="required-asterisk">*</span> An asterisk next to a label indicates a required field
        </div>
        <hr class="my-6 border-black" />
        <div class="_help-title mt-2" style="padding-top: 20px;padding-bottom: 0px;">Formulation Rules</div>
        <div style="margin-left: 30px; margin-top:20px;">
            <ul style="list-style-type: disc;">
                <li>Only one module per process (except for SFT and SMP, which are always run together currently)</li>
                <li>Processes are Snowmelt, Evapotranspiration, Rainfall Runoff, Auxiliary Soil (aka Soil Moisture) and
                    Routing</li>
                <li style="list-style-type: none;"> &nbsp;</li>
                <li><strong>Snowmelt Process</strong> (Optional)
                    <ul style="margin-left: 20px;">
                        <li style="font-style:italic">aka <strong>Snow Group</strong></li>
                        <li style="font-size:0.95em;"><strong>UEB:</strong></li>
                        <li style="margin-left: 15px;">
                            If selected, will override snowmelt component of noah-owp-modular;
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
                            If noah-owp-modular has been selected as the snow-melt module,
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
                            <span style="color:#cc5500;font-size:.9em;"><em>Not currently integrated in
                                    ngenCERF</em></span>
                        </li>
                    </ul>
                </li>
                <li style="list-style-type: none;"> &nbsp;</li>
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
                        <li>Generally required to produce all NWM output variables.</li>
                        <li style="font-size:0.95em;"><strong>SFT/SMP:</strong></li>
                        <li style="margin-left: 15px;">
                            <ul class="list-disc list-outside ml-6 space-y-0">
                                <li>SFT is paired with SMP (required).</li>
                                <li>They require a rainfall-runoff model for input (CFE-X/S, LASAM, and TopModel 
                                    currently have integrations).</li>
                                <li>They share parameters with CFE and LASAM, so when paired with either of those 
                                    modules the calibration of parameters is done jointly.</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li style="list-style-type: none;"> &nbsp;</li>
                <li><strong>Routing</strong> (Required)
                    <ul style="margin-left: 20px;">
                        <li style="font-size:0.95em;"><strong>T-Route</strong></li>
                    </ul>
                </li>
            </ul>
        </div>
        <hr class="my-6 border-black mt-6" />
        <div class="_help-title" style="padding-top: 20px;padding-bottom: 0px;">NWM v3 Output Variable Map</div>
        <div style="margin-left: 30px; margin-top:20px;">
            <div class="overflow-x-auto overflow-y-auto max-h-[80vh]">
                <table class="table-auto border-collapse border border-gray-300 text-sm" aria-label="NWM v3 Variable to Module Mapping Table">
                <thead class="sticky top-0 z-10 bg-gray-100">
                    <tr class="border-b border-gray-300">
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom bg-gray-100 text-left">NWM v3 Variable</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom rainfall-runoff">CFE</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom rainfall-runoff">LASAM</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom multiple">Noah-OWP-Modular</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom rainfall-runoff">Sac-SMA</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom soil-moisture">SFT</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom soil-moisture">SMP</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom snow">Snow17</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom rainfall-runoff">TopModel</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom multiple">TopoFlow</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom snow">UEB</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[85px] align-bottom routing">T-Route</th>
                    <th class="sticky top-0 z-10 border px-2 py-1 w-[200px] align-bottom bg-gray-100 text-left">Precedence</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-300">
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">sfcheadsubrt</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 routing text-center"></td>
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">inflow</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 routing text-center">•</td>
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">outflow</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 routing text-center">•</td>
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">reservoir_assimilated_value</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 routing text-center">•</td>
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">water_sfc_elev</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 routing text-center">•</td>
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">nudge</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 routing text-center">•</td>
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">qbucket</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 routing text-center"></td>
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">streamflow</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 routing text-center"></td>
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">velocity</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 soil-moisture text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>
                    <td class="border px-2 py-1 multiple text-center"></td>
                    <td class="border px-2 py-1 snow text-center"></td>
                    <td class="border px-2 py-1 routing text-center">•</td>
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">ACSNOM</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left">Snow 17</td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">SNOWT_AVG</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">SOILICE</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center">•</td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left">SFT</td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">SOILSAT_TOP</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center">•</td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left">SMP</td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">QRAIN</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left">Rainfall Runoff Module</td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">FSNO</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">SNOWH</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left">Snow17</td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">SNLIQ</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">SNEQV</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">QSNOW</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">SOIL_T</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center">•</td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left">SFT</td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">SOIL_M</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center">•</td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left">SMP</td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">SFCRNOFF</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center">•</td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">TRAD</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left">SFT</td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">LH</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">FIRA</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                    <tr>
                    <td class="border left-0 bg-white z-10 px-2 py-1 text-left">HFX</td>
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- CFE -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- LASAM -->
                    <td class="border px-2 py-1 multiple text-center">•</td>         <!-- Noah-OWP-Modular -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- Sac-SMA -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SFT -->
                    <td class="border px-2 py-1 soil-moisture text-center"></td>    <!-- SMP -->
                    <td class="border px-2 py-1 snow text-center"></td>             <!-- Snow17 -->
                    <td class="border px-2 py-1 rainfall-runoff text-center"></td>  <!-- TopModel -->
                    <td class="border px-2 py-1 multiple text-center"></td>         <!-- TopoFlow -->
                    <td class="border px-2 py-1 snow text-center">•</td>             <!-- UEB -->
                    <td class="border px-2 py-1 routing text-center"></td>          <!-- T-Route -->
                    <td class="border px-2 py-1 w-[200px] text-left"></td>
                    </tr>
                </tbody>
                </table>
            </div>   
            <div class="mt-6">
                <p class="text-md font-semibold">Legend</p>
                <table class="table-fixed border-separate border-spacing-0 border-gray-300" aria-label="NWM v3 Variable to Module Mapping Table Legend">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border pl-2 pr-2 pt-0 pb-0 w-1/3 text-left snow" style="font-size: small;">Snow</td>
                        <td class="border pl-2 pr-2 pt-0 pb-0 w-1/3 text-left soil-moisture" style="font-size: small;">Soil Moisture</td>
                        <td class="border pl-2 pr-2 pt-0 pb-0 w-1/3 text-left rainfall-runoff" style="font-size: small;">Rainfall Runoff</td>
                    </tr>
                    <tr>
                        <td class="border pl-2 pr-2 pt-0 pb-0 w-1/3 text-left routing" style="font-size: small;">Routing</td>
                        <td class="border pl-2 pr-2 pt-0 pb-0 w-1/3 text-left multiple" style="font-size: small;">Multiple</td>
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

.rainfall-runoff {
  @apply bg-green-400;
}
td.rainfall-runoff {
  @apply text-2xl;
}

.soil-moisture {
  @apply bg-orange-300;
}
td.soil-moisture {
  @apply text-2xl;
}

.multiple {
  @apply bg-fuchsia-400;
}
td.multiple {
  @apply text-2xl;
}

.routing {
  @apply bg-cyan-400;
}
td.routing {
  @apply text-2xl;
}

.snow {
  @apply bg-sky-200;
}
td.snow {
  @apply text-2xl;
}
</style>
