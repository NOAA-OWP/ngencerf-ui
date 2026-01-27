<template>
    <div class="_help-page">
        <div class="_help-title">Forecast - Setup Forecast Tab</div>
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
            <!-- Forecast configuration details -->
            <div class="space-y-4">
                <p>
                    To set up a forecast, <strong>select one of the available forecast configurations</strong> 
                    from the table. Once selected, you will be prompted to provide the following input 
                    fields for the forecast:
                </p>

                <ul class="list-disc list-outside space-y-0 ml-6">
                    <li><strong>Cold Start Date</strong></li>
                    <li><strong>Cold Start Hour</strong></li>
                    <li><strong>Cycle Date<span class="text-red-600">*</span></strong></li>
                    <li><strong>Cycle Hour<span class="text-red-600">*</span></strong></li>
                </ul>

                <p>
                    To configure your forecast, enter all required fields. At a minimum, you must provide the 
                    <strong>Cycle Date</strong> and <strong>Cycle Hour</strong>. The <strong>Next</strong> button
                    will appear only after all required information has been entered.
                </p>
                <p class="text-center mt-2">
                    Click <strong>Next</strong> to review your settings and run the forecast.
                </p>
                <p class="mt-4"><strong><span class="text-red-600">*</span></strong> Required Field</p>
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
