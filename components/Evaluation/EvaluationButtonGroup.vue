<template>
  <div id="BottomButtons" class="flex">
    <div>
      <div class="inline ngenButtonDiv bg-green mr-6" v-if="getEvaluationTabIndex() === 2">
        <button class="font-normal">Evaluate</button>
      </div>
      <div class="inline mr-3 ngenButtonDiv mr-6" v-if="getEvaluationTabIndex() >= 5">
        <button class="font-normal">Run</button>
      </div>
    </div>
    <div class="inline mr-3" v-if="getEvaluationTabIndex() >= 5">
      <button v-if="getEvaluationTabIndex() >= 5" class="c-blue font-normal underline">Cancel</button>
    </div>
    
    <div class="ml-auto">
    <!--
	    <div class="inline ngenButtonDiv c-gray-md" v-if="getEvaluationTabIndex() === 4">
	      <button v-if="getEvaluationTabIndex() === 4" class="prev actionBtnSmall font-normal">Prev</button>
	    </div>
	    <div class="inline ngenButtonDiv ml-6" v-if="getEvaluationTabIndex() === 3 || getEvaluationTabIndex() === 4">
	    	<button v-if="getEvaluationTabIndex() === 3 || getEvaluationTabIndex() === 4"
	        class="font-normal">Next</button>
	    </div>
	-->
    </div>

    <div class="col-span-2">
      <span v-if="getEvaluationTabIndex() === 1">
        <Button class="start actionBtn" @click.stop="EvaluateSelectedCalibration">Evaluate</Button>
        
        <Button v-if="loadUserSelectedCalibrationValidationRunList.length > 0" class="start actionBtn" @click.stop="EvalValidateCalibrateReset">Back</Button>
      </span>
      <!--
      <span v-if="getEvaluationTabIndex() >= 5">
        <button class="start actionBtn">Run</button>
      </span>
      -->
      <span v-if="getEvaluationTabIndex() === 2">
        <!-- <button class="start actionBtn">Evaluate</button> -->
      </span>
    </div>
    <div class="col-span-2">
      <!-- <button v-if="getEvaluationTabIndex() >= 5" class="stop actionBtn">Cancel</button> -->
    </div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-1"></div>
    <div class="col-span-2 text-right">
      <!-- <button v-if="getEvaluationTabIndex() === 4" class="prev actionBtnSmall">&#8678; Prev</button> -->
    </div>
    <div class="col-span-2">
      <!-- <button v-if="getEvaluationTabIndex() === 3 || getEvaluationTabIndex() === 4" class="next actionBtnSmall">Next
        <span>&#8680;</span></button> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useEvaluationCalibrationRunStore } from "~/stores/evaluation/EvaluationCalibrationRunStore";
import { useEvent } from "~/composables/UseEventBus";
import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
const { getEvaluationTabIndex } = generalStore();
const { loadUserSelectedCalibrationValidationRunList } = storeToRefs( useEvaluationCalibrationRunStore() )

const tabIndex = getEvaluationTabIndex();

const EvalValidateCalibrateReset = async ( e: Event ) => {
  useEvent( 'evaluateCalibrationRubTabAction', "ValidateListReset"  );
}

const EvaluateSelectedCalibration = async ( e: Event ) => {
  useEvent( 'evaluateCalibrationRubTabAction', "EvaluateCalibrationRun"  );
}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#BottomButtons {
  margin-left: 15px;
  color: #ffffff;
  font-weight: bold;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.disabled {
  opacity: 0.8;
}
</style>
