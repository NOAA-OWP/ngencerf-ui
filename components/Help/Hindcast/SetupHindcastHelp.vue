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
                    To set up a hindcast, <strong>select one of the available hindcast configurations</strong> 
                    from the table. Once selected, you will be prompted to provide the following input 
                    fields for the hindcast. If using a saved state:
                </p>

                <ul class="list-disc list-outside space-y-0 ml-6">
                    <li><strong>Saved State</strong><span class="required-asterisk" aria-hidden="true">*</span></li>
                    <li><strong>Cycle Date<span class="required-asterisk" aria-hidden="true"> (will be set automatically)</li>
                    <li><strong>Interval Cycle<span class="required-asterisk" aria-hidden="true">*</span></strong></li>
                    <li><strong>Number of Intervals<span class="required-asterisk" aria-hidden="true">*</span></strong></li>
                </ul>

                <p>
                    If not using a saved state:
                </p>

                <ul class="list-disc list-outside space-y-0 ml-6">
                    <li><strong>Cold Start Date</strong></li>
                    <li><strong>Cold Start Hour</strong></li>
                    <li><strong>Cycle Date<span class="required-asterisk" aria-hidden="true">*</span></strong></li>
                    <li><strong>Cycle Hour<span class="required-asterisk" aria-hidden="true">*</span></strong></li>
                    <li><strong>Interval Cycle<span class="required-asterisk" aria-hidden="true">*</span></strong></li>
                    <li><strong>Number of Intervals<span class="required-asterisk" aria-hidden="true">*</span></strong></li>
                </ul>

                <p>
                    To configure your hindcast, enter all required fields.
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
