<template>
    <div id="ComparePermutationsPage">
        <h1>Compare Calibration Jobs for Gage {{ uiGageId }}</h1>

        <div>
            <b>Selected Jobs:</b>
        </div>
        <div v-for="job of selectedCalibrationCompareRuns">
            <b>Job ID:</b> {{ job.calibration_run_id }}<br/>
            <b>Formulation Name:</b> {{ job.formulation_name }}
        </div>
    </div>
    <div class="waitgif" v-if="isComparePermutationsLoading">
        <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import { useToast } from 'primevue/usetoast';
import { DateTime } from "luxon";


import type { DynamicObject } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";
import { formatISOStringOrDateToYYYYMMDD } from "@/utils/TimeHelpers";
import { isValidDate, isValidDateTime } from "@/utils/CommonHelpers";

import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { generalStore } from '@/stores/common/GeneralStore';
import { useRunStatusStore } from '@/stores/calibration/RunStatusStore';
import { useUserDataStore } from '@/stores/common/UserDataStore';

import MessagesGroup from "../Common/MessagesGroup.vue";

import { hilightTab } from '@/composables/TabHilight';

import * as Plot from "@observablehq/plot";

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();
const runStatusStore = useRunStatusStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const showMessagesGroup = ref<Boolean>(false);

const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const {
  uiGageId,
  selectedCalibrationCompareRuns
} = storeToRefs(evaluationCalibrationRunStore);

const isComparePermutationsLoading = ref<boolean>(false);

const expandPlotTable = ref<Boolean>(false);
const plotTables = ref<DynamicObject>({});
const plotTableList = ref<any[]>([]);
const selectedPlotTable = ref<string>('');
const plotTableData = ref<any[]>([]);
const plotTableColumns = ref<any[]>([]);
const plotTableErrorMessage = ref<string>('');

onMounted(() => {
    isComparePermutationsLoading.value = true;
    nextTick(async () => {
        hilightTab(EvaluationTabs.tab_compare);
    })
    isComparePermutationsLoading.value = false;
});

const toggleMessagesGroup = async () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

onUnmounted(() => {
  // make sure page clears all selected calibration runs when the user leaves
  selectedCalibrationCompareRuns.value = [];
  uiGageId.value = 'All';
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

</style>