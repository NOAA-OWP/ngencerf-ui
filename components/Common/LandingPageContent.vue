<template>
    <!-- Middle: centers CenterBox -->
    <div class="flex items-center justify-center px-4 py-6">

        <div id="CenterBox" class="bg-white mx-auto px-6 py-6 rounded-[10px] max-w-screen-lg shadow-md">
            <!-- Page Title -->
            <div class="text-center mb-2">
                <h1 class="text-4xl font-bold">Next Generation Water Prediction Capability</h1>
                <div class="text-lg sm:text-xl text-gray-700 mt-1">
                Welcome <strong>{{ getUserFullName() }}</strong>
                </div>
            </div>

            <hr class="my-2 border-black" />

            <!-- Dashboard Section -->
            <div class="text-center font-bold text-2xl mb-2">Dashboard</div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                <!-- Running Processes Card -->
                <div class="bg-teal-100 text-teal-800 p-2 rounded-lg shadow-md flex flex-col items-center hover:cursor-pointer"
                    @click="gotoMenuAndFilter('MainMenuCalibration', 1, {'status': 'Running'})">
                    <i class="pi pi-sync text-teal-600 text-3xl mb-1"
                        :class="{ 'pi-spin': runningCalibrationJobs > 0 }"></i>
                        <div class="text-3xl sm:text-4xl font-extrabold text-teal-800">
                        {{ runningCalibrationJobs }}
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 mt-1">
                        Calibrations Running
                    </div>
                </div>

                <!-- Ready to Run Card -->
                <div class="bg-green-50 p-2 rounded-lg shadow-md flex flex-col items-center hover:cursor-pointer"
                    @click="gotoMenuAndFilter('MainMenuCalibration', 1, {'status': 'Ready'})">
                    <i class="pi pi-play-circle text-green-600 text-3xl mb-1"></i>
                    <div class="text-3xl sm:text-4xl font-extrabold text-green-600">
                        {{ readyCalibrationJobs }}
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 mt-1">
                        Calibrations Ready to Run
                    </div>
                </div>

                <!-- Setups to Complete Card -->
                <div class="bg-amber-50 p-2 rounded-lg shadow-md flex flex-col items-center hover:cursor-pointer"
                    @click="gotoMenuAndFilter('MainMenuCalibration', 1, {'status': 'Saved'})">
                    <i class="pi pi-sliders-h text-amber-600 text-3xl mb-1"></i>
                    <div class="text-3xl sm:text-4xl font-extrabold text-amber-600">
                        {{ savedCalibrationJobs }}
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 mt-1">
                        Calibrations In Setup
                    </div>
                </div>

                <!-- Running Forecasts Card -->
                <div class="bg-teal-100 text-teal-800 p-2 rounded-lg shadow-md flex flex-col items-center hover:cursor-pointer"
                    @click="gotoMenuAndFilter('MainMenuForecast', 2, {'status': 'Running'})">
                    <i class="pi pi-sync text-teal-600 text-3xl mb-1"
                        :class="{ 'pi-spin': runningForecastJobs > 0 }"></i>
                        <div class="text-3xl sm:text-4xl font-extrabold text-teal-800">
                        {{ runningForecastJobs }}
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 mt-1">
                        Forecasts Running
                    </div>
                </div>

                <!-- Completed Forecasts Card -->
                <div class="bg-blue-50 p-2 rounded-lg shadow-md flex flex-col items-center hover:cursor-pointer"
                    @click="gotoMenuAndFilter('MainMenuForecast', 2, {'status': 'Done'})">
                    <i class="pi pi-check text-blue-600 text-3xl mb-1"></i>
                    <div class="text-3xl sm:text-4xl font-extrabold text-blue-600">
                        {{ doneForecastJobs }}
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 mt-1">
                        Forecasts Completed
                    </div>
                </div>

                <!-- Placeholder -->
                <div></div>

                <!-- Running Hindcasts Card -->
                <div class="bg-teal-100 text-teal-800 p-2 rounded-lg shadow-md flex flex-col items-center hover:cursor-pointer"
                    @click="gotoMenuAndFilter('MainMenuHindcast', 2, {'status': 'Running'})">
                    <i class="pi pi-sync text-teal-600 text-3xl mb-1"
                        :class="{ 'pi-spin': runningHindcastJobs > 0 }"></i>
                        <div class="text-3xl sm:text-4xl font-extrabold text-teal-800">
                        {{ runningHindcastJobs }}
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 mt-1">
                        Hindcasts Running
                    </div>
                </div>

                <!-- Completed Hindcasts Card -->
                <div class="bg-blue-50 p-2 rounded-lg shadow-md flex flex-col items-center hover:cursor-pointer"
                    @click="gotoMenuAndFilter('MainMenuHindcast', 2, {'status': 'Done'})">
                    <i class="pi pi-check text-blue-600 text-3xl mb-1"></i>
                    <div class="text-3xl sm:text-4xl font-extrabold text-blue-600">
                        {{ doneHindcastJobs }}
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 mt-1">
                        Hindcasts Completed
                    </div>
                </div>

                <!-- Completed Hindcast Verifications Card -->
                <div class="bg-blue-50 p-2 rounded-lg shadow-md flex flex-col items-center hover:cursor-pointer"
                    @click="gotoMenuAndFilter('MainMenuHindcast', 6, {'status': 'Done'})">
                    <i class="pi pi-check text-blue-600 text-3xl mb-1"></i>
                    <div class="text-3xl sm:text-4xl font-extrabold text-blue-600">
                        {{ doneHindcastVerificationJobs }}
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 mt-1">
                        Hindcast Verifications Completed
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useUserDataStore } from '@/stores/common/UserDataStore';
import { useGageStore } from "@/stores/calibration/GageStore";
import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useOptimizationStore } from "@/stores/calibration/OptimizationStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { generalStore } from "~/stores/common/GeneralStore";

import { useToast } from "primevue/usetoast";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";
const toast = useToast();

const { popupActive } = storeToRefs(generalStore());

const { resetGageStore, loadGageTabStaticData } = useGageStore();
const { resetFormulationStore, loadFormulationModels } = useFormulationStore();
const { hardResetTuningStore } = useTuningStore();
const { resetOptimizationStore, loadOptimizationTabStaticData } = useOptimizationStore();
const { hardResetRunStatusStore } = useRunStatusStore();
const { addToastRecord, resetGeneralStore } = generalStore();

const formulationStore = useFormulationStore;
const { formulationTabData } = storeToRefs(formulationStore());
const { statusTypeFilterList, preFilterList, startTab } = storeToRefs(useUserDataStore());
const { fetchUserCalibrationJobCounts } = useUserDataStore();

const { getUserFullName } = useUserDataStore()

const runningCalibrationJobs = ref<number | null>(null);
const readyCalibrationJobs = ref<number | null>(null);
const savedCalibrationJobs = ref<number | null>(null);
const runningForecastJobs = ref<number | null>(null);
const doneForecastJobs = ref<number | null>(null);
const runningHindcastJobs = ref<number | null>(null);
const doneHindcastJobs = ref<number | null>(null);
const doneHindcastVerificationJobs = ref<number | null>(null);

onMounted(async () => {
  resetGeneralStore();
  preFilterList.value = {};
  resetGageStore();
  resetFormulationStore();
  resetOptimizationStore();
  hardResetRunStatusStore();
  hardResetTuningStore();
  await loadGageTabStaticData();
  await loadFormulationModels();
  await loadOptimizationTabStaticData();

  const jobCounts = await fetchUserCalibrationJobCounts();
  if (jobCounts?._data) {
    runningCalibrationJobs.value = jobCounts._data?.running_calibration_count;
    readyCalibrationJobs.value = jobCounts._data?.ready_calibration_count;
    savedCalibrationJobs.value = jobCounts._data?.saved_calibration_count;
    runningForecastJobs.value = jobCounts._data?.running_forecast_count;
    doneForecastJobs.value = jobCounts._data?.done_forecast_count;
    runningHindcastJobs.value = jobCounts._data?.running_hindcast_count;
    doneHindcastJobs.value = jobCounts._data?.done_hindcast_count;
    doneHindcastVerificationJobs.value = jobCounts._data?.done_hindcast_verification_count;
  } else {
    toast.removeAllGroups();
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Server Error', detail: 'Unable to retrieve job counts from server', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
})

const gotoMenuAndFilter = (menuElement: string, tabNumber: number, filterList: DynamicObject={}) => {
  preFilterList.value = filterList;
  startTab.value = tabNumber;
  const e = document.getElementById(menuElement);
  if (e) e.click();
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>