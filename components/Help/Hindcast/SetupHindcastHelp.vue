<template>
    <div class="_help-page">
        <div class="_help-title">Hindcast - Setup Hindcast Tab</div>
        <p id="help-subtitle" class="_help-subtitle">
        </p>
        <p class="text-center" style="color:#cc5500;font-size:0.8em;">
            WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
        </p>
        <hr class="my-6 border-black" />
        <p class="text-center font-medium">
            All times referenced are in Coordinated Universal Time (UTC), also known as Zulu (Z)
        </p>
        <hr class="my-6 border-black" />

        <div class="ml-2">
            <!-- Hindcast configuration details -->
            <div class="space-y-4">
                <p>
                    A hindcast (a.k.a. <strong>re-forecast</strong> — the "R" in ngenCERF) runs the model as
                    if it were forecasting at a point in the past, using historical inputs. This lets you
                    evaluate forecast skill against known outcomes.
                </p>
                <p>
                    To set up a hindcast, <strong>select a hindcast configuration</strong> from the table. 
                    After making a selection, you will be prompted to enter the required input fields.
                </p>

                <p>
                    If saved state options are available for the selected calibration job, you may choose one. 
                    If no saved states exist, this option will not be shown and you must enter cold start and cycle information manually.
                </p>

                <p><strong>Using a Saved State:</strong></p>
                <ul class="list-disc list-outside space-y-2 ml-6">
                    <li>
                        <strong>Saved State</strong><span class="required-asterisk" aria-hidden="true">*</span>
                        <div class="text-sm text-gray-700 mt-1">
                            Reuses a model state that was already computed and saved by a previous run,
                            instead of cold-starting. This skips the spin-up period, so the run is faster.
                        </div>
                    </li>
                    <li>
                        <strong>Cycle Date</strong> (automatically set)
                        <div class="text-sm text-gray-700 mt-1">
                            Equivalent to the end of the saved state run.
                        </div>
                    </li>
                    <li>
                        <strong>Advance Interval</strong><span class="required-asterisk" aria-hidden="true">*</span>
                        <div class="text-sm text-gray-700 mt-1">
                            How far apart each cycle is spaced (e.g., every 6 hours).
                        </div>
                    </li>
                    <li>
                        <strong>Number of Intervals</strong><span class="required-asterisk" aria-hidden="true">*</span>
                        <div class="text-sm text-gray-700 mt-1">
                            How many cycles to generate at that spacing.
                        </div>
                    </li>
                </ul>

                <p><strong>Without a Saved State (Cold Start):</strong></p>
                <ul class="list-disc list-outside space-y-2 ml-6">
                    <li>
                        <strong>Cold Start Date</strong> / <strong>Cold Start Hour</strong>
                        <div class="text-sm text-gray-700 mt-1">
                            The date/hour to begin building model state from scratch (soil moisture,
                            streamflow, channel storage, etc.), running forward through the Cycle Date/Hour
                            before the hindcast itself begins.
                        </div>
                    </li>
                    <li>
                        <strong>Cycle Date</strong><span class="required-asterisk" aria-hidden="true">*</span>
                        / <strong>Cycle Hour</strong><span class="required-asterisk" aria-hidden="true">*</span>
                        <div class="text-sm text-gray-700 mt-1">
                            The historical date/time you want to pretend you're standing at, to see what the
                            model would have forecast (T=0 for this hindcast).
                        </div>
                    </li>
                    <li>
                        <strong>Advance Interval</strong><span class="required-asterisk" aria-hidden="true">*</span>
                        <div class="text-sm text-gray-700 mt-1">
                            How far apart each cycle is spaced (e.g., every 6 hours).
                        </div>
                    </li>
                    <li>
                        <strong>Number of Intervals</strong><span class="required-asterisk" aria-hidden="true">*</span>
                        <div class="text-sm text-gray-700 mt-1">
                            How many cycles to generate at that spacing.
                        </div>
                    </li>
                </ul>

                <p>
                    <strong>Advance Interval</strong> and <strong>Number of Intervals</strong> let you generate
                    a <em>batch</em> of hindcast cycles in one submission, stepping forward in time
                    automatically, rather than running just one.
                </p>

                <p><strong>For example:</strong></p>
                <ul class="list-disc list-outside space-y-0 ml-6">
                    <li>
                        An Advance Interval of 6 hours with 12 Intervals produces 12 separate hindcast runs,
                        one every 6 hours, spanning a 72-hour period starting at your Cycle Date/Hour. Each of
                        those runs gets its own forecast window on top (per the configuration's Hindcast
                        Window).
                    </li>
                </ul>

                <p>
                    Enter all required fields to configure your hindcast.
                </p>

                <p class="text-center mt-2">
                    Click <strong>Next</strong> to review your settings and run the hindcast.
                </p>
                <div class="required-hint mt-2 mb-4">
                    <span class="required-asterisk">*</span> An asterisk next to a label indicates a required field
                </div>
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
