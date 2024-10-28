<template>
  <div id="Messages">
    <div class="">
      <h2 class="mt-5">Calibration Run Setup</h2>

      <div class="grid grid-cols-2 gap=1 text-sm mt-4">
        <div class="col-span-1">
          <p v-if="calData?.gage?.gage_id"><span class="font-medium">Gage:</span> {{ calData?.gage?.gage_id }}</p>
          <p v-if="calData?.forcing_source"><span class="font-medium">Forcing Data:</span> {{ calData?.forcing_source
            }}</p>
          <p v-if="calData?.formulation_name"><span class="font-medium">Formulation Name:</span> {{
            calData?.formulation_name
            }}</p>
        </div>
        <div class="col-span-1">
          <p v-if="calData?.gage?.station_name"><span class="font-medium">{{ calData?.gage?.station_name }}</span></p>
          <p v-if="calData?.observational_source"><span class="font-medium">Observational Data:</span> {{
            calData?.observational_source }}</p>
        </div>
      </div>

      <div class="grid grid-cols=1 gap=1 text-sm mt-4">
        <div class="col-span-1">
          <p v-if="calData?.modules?.length"><span class="font-medium">Modules: </span>{{ getModuleList() }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap=1 text-sm text-left mt-4">
        <div class="col-span-1">
          <p v-if="calData?.calibration_times?.simulation_start_time"><span class="font-medium">Calibration Run</span>
          </p>
          <p v-if="calData?.calibration_times?.simulation_start_time"><span class="font-medium">Sim Start:</span>
          <div class="datePos">
            {{ formatDate(calData?.calibration_times?.simulation_start_time) }}</div>
          </p>
          <p v-if="calData?.calibration_times?.simulation_end_time"><span class="font-medium">Sim End:</span>
          <div class="datePos">
            {{ formatDate(calData?.calibration_times?.simulation_end_time) }}</div>
          </p>
          <p v-if="calData?.calibration_times?.calibration_start_time"><span class="font-medium">Calib Start:</span>
          <div class="datePos">
            {{ formatDate(calData?.calibration_times?.calibration_start_time) }}</div>
          </p>
          <p v-if="calData?.calibration_times?.calibration_end_time"><span class="font-medium">Calib End:</span>
          <div class="datePos">
            {{ formatDate(calData?.calibration_times?.calibration_end_time) }}</div>
          </p>
          <p>&nbsp;</p>
          <p v-if="calData?.output_variable_to_calibrate?.name"><span class="font-medium">Cal Output Variable:</span>
            {{ calData?.output_variable_to_calibrate?.name }}</p>
          <p v-if="calData?.optimization"><span class="font-medium">Optimization Algorithm:</span>
            {{ calData?.optimization }}</p>
          <p v-if="calData?.stop_criteria"><span class="font-medium">Calibration Stop Criteria:</span>
            {{ calData?.stop_criteria }}</p>
          <p v-if="false"><span class="font-medium">Metrics:</span> {{ null }}</p>

        </div>
        <div class="col-span-1">
          <p v-if="calData?.validation_times?.simulation_start_time"><span class="font-medium">Validation Run</span></p>
          <p v-if="calData?.validation_times?.simulation_start_time"><span class="font-medium">Sim Start:</span>
          <div class="datePos">
            {{ formatDate(calData?.validation_times?.simulation_start_time) }}</div>
          </p>
          <p v-if="calData?.validation_times?.simulation_end_time"><span class="font-medium">Sim End:</span>
          <div class="datePos">
            {{ formatDate(calData?.validation_times?.simulation_end_time) }}</div>
          </p>
          <p v-if="calData?.validation_times?.validation_start_time"><span class="font-medium">Val Start:</span>
          <div class="datePos">
            {{ formatDate(calData?.validation_times?.validation_start_time) }}</div>
          </p>
          <p v-if="calData?.validation_times?.validation_end_time"><span class="font-medium">Val End:</span>
          <div class="datePos">
            {{ formatDate(calData?.validation_times?.validation_end_time) }}</div>
          </p>
          <p>&nbsp;</p>
          <p v-if="userSelectedCalibrationTuningParameters">
            <span class="font-medium">Tuning Parameters:</span> 
            {{ userSelectedCalibrationTuningParameters.length }}</p>
          <p v-if="calData?.objective_function"><span class="font-medium">Objective Function:</span> 
            {{ calData?.objective_function }}</p>
          <p v-if="calData?.save_plot_iteration_frequency"><span class="font-medium">Plot Generation Frequency:</span>
            {{ calData?.save_plot_iteration_frequency }}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { useTuningStore } from "~/stores/calibration/TuningStore";
import { formatDateForDisplay } from '~/utils/TimeHelpers';

const calRunStore = useUserDataStore();
const { userCalibrationRunData } = storeToRefs(calRunStore);
const calData = ref(userCalibrationRunData);
const tuningStore = useTuningStore();
const { userSelectedCalibrationTuningParameters } = storeToRefs(tuningStore);

const getModuleList = () => {
  let modules = "";
  calData.value?.modules.forEach(element => {
    modules += element;
    if (calData.value?.modules[calData.value?.modules.length - 1] !== element) {
      modules += ", ";
    }
  });
  return modules;
};

const formatDate = (d: any) => {
  if ((d instanceof Date)) {
    console.log('Date');
  } else {
    return formatDateForDisplay(d);
  }
};

</script>

<style lang="scss" scoped>
#Messages {
  padding: 15px;
  font-size: 1.2em;
}

p {
  line-height: 1.5em;
}

.datePos {
  float: right;
  margin-right: 50px;
}
</style>
