<template>
  <div id="ResultPage">
    <div class="grid grid-rows-10 pr-3">
      <div class="row-span-2">
        <div id="ResultsDisplay">
          <div class="grid grid-cols-2">
            <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">
              <table>
                <tbody>
                  <tr>
                    <td class="text-right"><label for="RunStatus">Status</label></td>
                    <td class="pl-5">
                      {{ validationStatus }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-right"><label for="DisplayOptions">Display</label></td>
                    <td class="pl-5">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-span-1">
              <table>
                <tbody>
                  <tr height="45px">
                    <td class="text-right font-bold">Start Time</td>
                    <td class="pl-5">{{ startTime ? formatDateForDisplay( startTime ) : '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="45px">
                    <td class="text-right font-bold">Running Time</td>
                    <td class="pl-5">{{ runningTime ? runningTime : '-'.repeat(30) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            

          </div>
        </div>
      </div>
    </div>


    <div class="grid grid-rows-1 ActionButtonsBox" id="HBCbuttons">
      <div class="row-span-1">
        <span v-if="validationStatus === 'Done'">
          <div id="ResultsArea" class="ngenButtonDiv row-span-1">
            <button class="font-normal" @click.stop="navigateToEvaluation">Go to Evaluation</button>
          </div>
          <div class="col-span-7">&nbsp;</div>
        </span>


        <span v-else>
          <div id="StausRunBottomButtons" class="grid grid-cols-8">
            <span v-if="userCalibrationRunData?.status !== 'Running'">
            <div class="col-span-1 ngenButtonDiv-green mr-6 h-8">
              <button class="font-normal" title="Run Button" aria-label="Run Button" @click="startRun()" :disabled="isStartDisabled()">
                Run
              </button>
            </div>
          </span>
          <span v-else>
            <div class="col-span-1 mr-6 h-8">&nbsp;</div>
          </span>
            <div class="col-span-1 mr-3">
              <button class="c-blue font-normal text-xl underline pt-1" title="Cancel Button" @click="cancelRun()" :disabled="isCancelDisabled()"
                aria-label="Cancel Button">Cancel</button>
            </div>
            <div class="col-span-4">&nbsp;</div>
            <div class="col-span-1">&nbsp;</div>
            <div class="col-span-1 mr-4">
            </div>
          </div>
        </span>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { generalStore } from '~/stores/common/GeneralStore';
import { useValidationRunStatusStore } from '~/stores/evaluation/ValidationRunStatusStore';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { calculateElapsedTime, formatDateForDisplay } from '~/utils/TimeHelpers';
import { useToast } from 'primevue/usetoast';
import type { CalibrationGetStatusValidationItem } from "~/composables/NextGenModel";

const userDataStore = useUserDataStore();
const validationRunStatusStore = useValidationRunStatusStore();
const toast = useToast();

const { evaluateValidationRunId } = storeToRefs(generalStore());
const { userCalibrationRunData } = storeToRefs(userDataStore);

const { startTime, startTimeDate, runningTime, validationStatus, iterationValidationRunId } = storeToRefs( validationRunStatusStore );
const { executeIterationValidationRun, queryIterationValidationRunStatus, isValidationRunStopped, executeCancelIterationValidationRun } = validationRunStatusStore;

const validationStatusCheckingInterval = ref<any>();
const validationRunningTimeInterval = ref<any>();

onMounted(async () => {
  toast.removeAllGroups();

  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }
});

const updateRunningTime = () => {
  const convertedStartTime = new Date( startTime.value );
  runningTime.value = calculateElapsedTime( convertedStartTime, new Date() );
}

const isStartDisabled = () => {
  let disabled = false;
  if ( validationStatus.value != null ) disabled = true;
  return disabled;
}

const isCancelDisabled = () => {
  let disabled = true;
  if ( validationStatus.value != null && !isValidationRunStopped( validationStatus.value ) ) {
    disabled = false;
  }
  return disabled;
}

const startRun = async () => {
  toast.removeAllGroups();

  executeIterationValidationRun().then( ( response ) => {
    if ( response.status == 201 ) {
      validationStatus.value = response?._data?.status;
      iterationValidationRunId.value = response?._data.validation_run_id;
      startTime.value = response?._data?.run_date;
      validationRunningTimeInterval.value = setInterval( updateRunningTime, 1000 );
    } else {
      toast.add({ severity: 'warn', summary: 'Unable to Create Validation' });
    }    
  });
}

watch( validationStatus, async ( newStatus, initialStatus ) => {
  if ( newStatus != null && !isValidationRunStopped( newStatus )) {
    validationStatusCheckingInterval.value = setInterval( async () => {
      queryIterationValidationRunStatus().then( response => {
        const find_validation_run = response._data.validations.filter( ( validation: CalibrationGetStatusValidationItem ) => {
          return validation.validation_run_id == iterationValidationRunId.value
        });
        if ( !find_validation_run ) {
          validationStatus.value = 'Fail';
        } else {
          // make sure we actually has validation run
          const validation_run = find_validation_run.shift();
          if ( !validation_run ) {
            validationStatus.value = 'Fail';
          } else {
            validationStatus.value = validation_run.status;
          }
        }
      })
    }, 3000 );
  } else {
    evaluateValidationRunId.value = iterationValidationRunId.value;
    clearInterval( validationStatusCheckingInterval.value );
    clearInterval( validationRunningTimeInterval.value );
  }
});

onUnmounted( () => {
  clearInterval( validationStatusCheckingInterval.value );
  clearInterval( validationRunningTimeInterval.value );
})

const cancelRun = async () => {
  clearInterval( validationStatusCheckingInterval.value );
  clearInterval( validationRunningTimeInterval.value );
  executeCancelIterationValidationRun().then( response => {
    validationStatus.value = response?._data.status;
  })
}

const navigateToEvaluation = ( event: any ) => {
  if ( evaluateValidationRunId.value > 0 ) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[ EvaluationTabs.tab_evaluate ];
    e.click();
  } else {
    toast.add({ severity: 'warn', summary: 'Missing Validation Job', detail: 'Pleasea select a validation job first.', life: 6000 })
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#ResultsDisplay {
  width: 50vw;
  margin: 20px auto;
  padding: 10px 10px 10px 20px;
  border-radius: 10px;
  height: 100px;
  border: 0px solid $ngwcp_neutral_gray_md;
  min-width: 750px;

}

#GraphArea {
  height: 40vh;
  width: 100%;
  margin: 8px auto 0 auto;
  border: 1px solid $ngwcp_neutral_gray_md;
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
