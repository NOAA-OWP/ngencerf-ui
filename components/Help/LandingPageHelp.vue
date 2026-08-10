<template>
    <div class="_help-page max-w-4xl mx-auto">
        <div class="_help-title text-center mb-4">ngenCERF</div>

        <p class="leading-relaxed mb-4">
            <strong>ngenCERF</strong> (<strong>ngen</strong> <strong>C</strong>alibration,
            <strong>E</strong>valuation, <strong>R</strong>eforecast, and
            <strong>F</strong>orecast) is a graphical user interface (GUI) for configuring,
            running, and analyzing ngen modeling workflows.
        </p>

        <p class="leading-relaxed mb-4">
            The GUI is organized into four primary workflows:
        </p>

        <ul class="list-disc ml-8 mb-6">
            <li><strong>Calibration</strong></li>
            <li><strong>Evaluation</strong></li>
            <li><strong>Forecast</strong></li>
            <li><strong>Verification</strong> (also known as reforecasting or hindcasting)</li>
        </ul>

        <p class="leading-relaxed mb-6">
            Each workflow consists of a series of tabs that guide you through setup,
            execution, and analysis. Contextual help is available throughout the
            application by clicking the <strong>question mark</strong> in the header
            of each workflow or tab. When job tables are displayed, additional
            actions and help are available via <strong>right-click menus</strong>.
        </p>

        <hr class="my-6 border-black" />

        <div class="text-center font-bold text-xl mb-3">Header Navigation Bar</div>

        <ul class="list-disc list-outside ml-8 space-y-0">
            <li>Click the <strong>ngenCERF</strong> logo to return to this landing page</li>
            <li>Use the <strong>Workflow buttons</strong> to navigate between workflows</li>
            <li>Click the <strong>Help button</strong> for workflow and tab specific contextual help</li>
            <li>Access the <strong>User avatar menu</strong> to:
                <ul class="list-disc list-outside ml-6 space-y-0">
                <li>View your User Profile</li>
                <li>View About ngenCERF (including Git commit information)</li>
                <li>Check session notifications</li>
                <li>View and Download the User’s Guide</li>
                <li>Logout</li>
                </ul>
            </li>
        </ul>

        <br />
        <hr class="my-6 border-black" />

        <div class="text-center font-bold text-xl mb-3">Workflows</div>

        <p><strong>Calibration</strong></p>
        <p class="mb-3">
            Guides you through configuring and running a calibration, followed by an automatic
            validation using the best calibrated parameter set. Users can monitor job progress in 
            real time by viewing logs and plots generated during both the calibration and validation runs. <br />
            <br />
            The Calibration Manager executes ngen iteratively, evaluating output after each run and refining
            calibration parameters until convergence criteria are met.
        </p>

        <p><strong>Evaluation</strong></p>
        <p class="mb-3">
            Provides tools to view and analyze job results, including plots, tables, time series, 
            images, and log files. Users may select alternate parameter sets to generate additional 
            plots for further analysis.
        </p>

        <p><strong>Forecast</strong></p>
        <p class="mb-3">
            Allows you to run a forecast using the best parameters generated from a
            previously completed calibration.
        </p>

        <p><strong>Verification</strong></p>
        <p>
            Enables verification of forecast results, often referred to as
            reforecasting or hindcasting.
        </p>
        <br />
        <hr/>
        <div class="mt-6">
            <div class="text-center font-bold text-l mb-4">Job Management Rules</div>
                
            <ul class="list-disc list-outside ml-6 space-y-0">
                <li>Job housekeeping is primarily performed in the
                    <strong>Calibration</strong> workflow.
                </li>
                <li>Jobs may be archived or deleted from other workflows,
                    unless they are locked.
                </li>
                <li><strong>Locked jobs</strong> cannot be archived or deleted.</li>
                <li><strong>Unlocked jobs</strong> may be archived for later retrieval
                    or permanently deleted.
                </li>
                <li><strong>Only the Calibration workflow</strong> allows archived jobs to be
                    restored and jobs to be locked or unlocked.
                </li>
            </ul>
        </div>
        <br />
        <hr class="my-6 border-black" />

        <div class="mt-2 ml-6">
            <div class="text-center font-bold text-xl mb-3">Dashboard</div>
            <p class="leading-relaxed text-center mb-6">
                A summary of your calibrations that are running, ready to run, or still in setup.
            </p>

            <hr class="my-6 border-grey" />

            <p class="leading-relaxed text-center mb-6">
            Click on a Workflow button to proceed.
            </p>
        </div>
    </div>
</template>


<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
