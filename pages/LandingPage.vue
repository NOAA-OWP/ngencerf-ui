<template>
  <client-only>
    <div class="h-full">
        <div class="grid grid-rows-3 h-full">

            <!-- Header -->
            <div class="row-span-1">
                <AppHeader />
            </div>

            <!-- Center Content -->
            <div class="row-span-1">
                <div
                id="CenterBox"
                class="bg-white mx-auto px-6 py-8 rounded-[10px] max-w-screen-lg shadow-md"
                >
                <!-- Page Title -->
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-bold">Next Generation Water Prediction Capability</h1>
                    <div class="text-lg sm:text-xl text-gray-700 mt-2">
                    Welcome <strong>{{ getUserFullName() }}</strong>
                    </div>
                </div>

                <hr class="my-6 border-black" />

                <!-- Dashboard Section -->
                <div class="text-center font-bold text-2xl mb-4">Dashboard</div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <!-- Running Processes Card -->
                    <div class="bg-teal-100 text-teal-800 p-6 rounded-lg shadow-md flex flex-col items-center">
                        <i class="pi pi-cog pi-spin text-teal-600 text-3xl mb-2"></i>
                            <div class="text-3xl sm:text-4xl font-extrabold text-teal-800">
                            {{ runningCalibrationJobs }}
                        </div>
                        <div class="text-sm sm:text-base text-gray-700 mt-2">
                            Calibrations Running
                        </div>
                    </div>

                    <!-- Ready to Run Card -->
                    <div class="bg-green-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                        <i class="pi pi-play-circle text-green-600 text-3xl mb-2"></i>
                        <div class="text-3xl sm:text-4xl font-extrabold text-green-600">
                            {{ readyCalibrationJobs }}
                        </div>
                        <div class="text-sm sm:text-base text-gray-700 mt-2">
                            Calibrations Ready to Run
                        </div>
                    </div>

                    <!-- Setups to Complete Card -->
                    <div class="bg-amber-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                        <i class="pi pi-sliders-h text-amber-600 text-3xl mb-2"></i>
                        <div class="text-3xl sm:text-4xl font-extrabold text-amber-600">
                            {{ savedCalibrationJobs }}
                        </div>
                        <div class="text-sm sm:text-base text-gray-700 mt-2">
                            Calibrations In Setup
                        </div>
                    </div>
                </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="row-span-1">
                <AppFooter />
            </div>
        </div>
    </div>
</client-only>

</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import AppHeader from '@/components/Common/AppHeader.vue';
import AppFooter from '@/components/Common/AppFooter.vue';

import { useUserDataStore } from '@/stores/common/UserDataStore';
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
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
const { addToastRecord } = generalStore();

const formulationStore = useFormulationStore;
const { formulationTabData } = storeToRefs(formulationStore())

const { savedCalibrationJobs, readyCalibrationJobs, runningCalibrationJobs } = storeToRefs(useCalibrationJobStore());
const { fetchUserCalibrationJobsListData, getUserFullName } = useUserDataStore()

onMounted(async () => {
  popupActive.value = false;
  resetGageStore();
  resetFormulationStore();
  resetOptimizationStore();
  hardResetRunStatusStore();
  hardResetTuningStore();
  await loadGageTabStaticData();
  await loadFormulationModels();
  await loadOptimizationTabStaticData();
  await fetchUserCalibrationJobsListData();
  /* if (!formulationTabData.value) {
    const tMsg: ToastMessageOptions = { severity: "error", summary: 'Server Error', detail: "Unable to Retrieve Module List", life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  } */
})

</script>
