<template>
  <div id="ResultPage">
    <div class="grid grid-rows-10 pr-3">
      <div class="row-span-1">
        <div id="ResultsDisplay">
          <div class="grid grid-cols-2">
            <div class="col-span-1">
              <table>
                <tbody>
                  <tr height="40px">
                    <td class="text-right font-bold">Start Time</td>
                    <td class="pl-5">{{ startTime ? startTime : '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="32px">
                    <td class="text-right font-bold">Elapsed Time</td>
                    <td class="pl-5">{{ runningTime ? runningTime : '-'.repeat(30) }}</td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                  </tr>
                  <tr v-if="true" height="32px">
                    <td class="text-right font-bold">Results Pathname:</td>
                    <td class="pl-5">{{ '-'.repeat(30) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">

            </div>

          </div>
        </div>
      </div>

      <div class="row-span-9">
      </div>
    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please Wait..." ? src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { generalStore } from '~/stores/common/GeneralStore';
import { useRunStatusStore } from '~/stores/calibration/RunStatusStore';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { useToast } from 'primevue/usetoast';

const runStatusStore = useRunStatusStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const { calibrationJobId } = storeToRefs(generalStore());
const { getCalibrationTabIndex } = generalStore();
const {
  startTimeDate,
  startTime,
  runningTime,
  plotNames,
  plotList,
  selectedPlotName,
  selectedPlotFilename,
  selectedPlotFileUrl,
  iteration,
  stopCriteria,
  stopCriteriaMet,
  runningTimeIntervalId,
  calibrationStatusIntervalId,
  validationsStatusIntervalId,
  allValidationsDone
} = storeToRefs(runStatusStore);

const { userCalibrationRunData } = storeToRefs(userDataStore);
const { fetchUserCalibrationRunData } = userDataStore;

const {
  queryGetCalibrationStatus,
  queryGetPlotNames,
  queryGetPlot,
  executeRunCalibration,
  queryIteration,
  cancelCalibrationJob,
} = runStatusStore;

const isLoading = ref(false);

const calibrationStatus = computed(() => userCalibrationRunData?.value?.status);

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#ResultsDisplay {
  width: 40vw;
  min-width: 720px;
  margin: 5px auto;
  padding: 6px 10px 6px 20px;
  border-radius: 10px;
  height: 100px;
  border: 0px solid $ngwcp_neutral_gray_md;

}

#GraphArea {
  min-height: 40vh;
  width: 70%;
  margin: 0px auto 0 auto;
}

#RunStatus,
#DisplayOptions {
  width: 250px;
  margin-left: 0px;
}

.p-progressbar {
  display: inline-block;
  width: 200px;
  height: 25px;
}

.leftSideText {
  width: 135px;
  text-align: right;
  padding-right: 20px;
}
</style>

<style>
:root {
  .p-progressbar {
    background-color: yellow;
    vertical-align: text-bottom;
    margin-left: 10px;
    width: 80%;
  }

  .p-progressbar-value {
    color: green;
    background-color: green;
  }

  .p-progressbar-value {
    color: black;
  }

  .p-progressbar-label {
    color: white;
  }
}
</style>