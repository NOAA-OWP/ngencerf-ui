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
                    To set up a hindcast, <strong>select a hindcast configuration</strong> from the table. 
                    After making a selection, you will be prompted to enter the required input fields.
                </p>

                <p>
                    If saved state options are available for the selected calibration job, you may choose one. 
                    If no saved states exist, this option will not be shown and you must enter cold start and cycle information manually.
                </p>

                <p><strong>Using a Saved State:</strong></p>
                <ul class="list-disc list-outside space-y-0 ml-6">
                    <li><strong>Saved State</strong><span class="required-asterisk" aria-hidden="true">*</span></li>
                    <li><strong>Cycle Date</strong> (automatically set)</li>
                    <li><strong>Interval Cycle</strong><span class="required-asterisk" aria-hidden="true">*</span></li>
                    <li><strong>Number of Intervals</strong><span class="required-asterisk" aria-hidden="true">*</span></li>
                </ul>

                <p><strong>Without a Saved State (Cold Start):</strong></p>
                <ul class="list-disc list-outside space-y-0 ml-6">
                    <li><strong>Cold Start Date</strong></li>
                    <li><strong>Cold Start Hour</strong></li>
                    <li><strong>Cycle Date</strong><span class="required-asterisk" aria-hidden="true">*</span></li>
                    <li><strong>Cycle Hour</strong><span class="required-asterisk" aria-hidden="true">*</span></li>
                    <li><strong>Interval Cycle</strong><span class="required-asterisk" aria-hidden="true">*</span></li>
                    <li><strong>Number of Intervals</strong><span class="required-asterisk" aria-hidden="true">*</span></li>
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
