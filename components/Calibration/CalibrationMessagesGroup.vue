<template>
  <div id="Messages">
    <div class="grid grid-rows-12">

      <div class="row-span-2">
        <div class="grid grid-cols-2 gap=1">
          <div class="col-span-1">
            <p v-if="calData?.gage?.gage_id">Gage: &nbsp;<span class="font-medium">{{ calData?.gage?.gage_id }}</span></p>
            <p v-if="calData?.forcing_source">Forcing Data: &nbsp;<span class="font-medium">{{ calData?.forcing_source
                }}</span></p>
            <p v-if="calData?.formulation_name">Formulation Name: &nbsp;<span class="font-medium">{{
              calData?.formulation_name
                }}</span></p>
          </div>
          <div class="col-span-1">
            <p v-if="calData?.gage?.station_name"><span class="font-medium">{{ calData?.gage?.station_name }}</span></p>
            <p v-if="calData?.observational_source">Observational Data: &nbsp;<span class="font-medium">{{
              calData?.observational_source }}</span></p>
          </div>
        </div>
      </div>

      <div class="row-span-1">
        <div class="grid grid-cols=1">
          <div class="col-span-1">
            <p v-if="calData?.modules.length">Modules: &nbsp;<span class="font-medium">{{ getModuleList() }}</span></p>
          </div>
        </div>
      </div>


      <div class="row-span-9">
        <div class="grid grid-cols-2 gap=1">
          <div class="col-span-1">
            <p v-if="calData?.calibration_times.simulation_start_time" class="text-center">Calibration Run</p>
            <p v-if="calData?.calibration_times.simulation_start_time">&nbsp;&nbsp;Sim Start:
            <div class="datePos"><span class="font-medium">
                {{ formatDate(calData?.calibration_times.simulation_start_time) }}</span></div>
            </p>
            <p v-if="calData?.calibration_times.simulation_end_time">&nbsp;&nbsp;&nbsp;&nbsp;Sim End:
            <div class="datePos"><span class="font-medium">
                {{ formatDate(calData?.calibration_times.simulation_end_time) }}</span></div>
            </p>
            <p v-if="calData?.calibration_times.calibration_start_time">Calib Start:
            <div class="datePos"><span class="font-medium">
                {{ formatDate(calData?.calibration_times.calibration_start_time) }}</span></div>
            </p>
            <p v-if="calData?.calibration_times.calibration_end_time">&nbsp;&nbsp;Calib End:
            <div class="datePos"><span class="font-medium">
                {{ formatDate(calData?.calibration_times.calibration_end_time) }}</span></div>
            </p>
            <p>&nbsp;</p>
            <p v-if="calData?.output_variable_to_calibrate.name">Cal Output Variable: &nbsp;<span class="font-medium">
                {{ calData?.output_variable_to_calibrate.name }}</span></p>
            <p v-if="calData?.optimization">Optimization Algorithm: &nbsp;<span class="font-medium">
                {{ calData?.optimization }}</span></p>
            <p v-if="calData?.stop_criteria">Calibration Stop Criteria: &nbsp;<span class="font-medium">
                {{ calData?.stop_criteria }}</span></p>
            <p v-if="false">Metrics: &nbsp;<span class="font-medium">{{ null }}</span></p>

          </div>
          <div class="col-span-1">
            <p v-if="calData?.validation_times.simulation_start_time" class="text-center">Validation Run</p>
            <p v-if="calData?.validation_times.simulation_start_time">&nbsp;&nbsp;Sim Start:
            <div class="datePos"><span class="font-medium">
                {{ formatDate(calData?.validation_times.simulation_start_time) }}</span></div>
            </p>
            <p v-if="calData?.validation_times.simulation_end_time">&nbsp;&nbsp;&nbsp;&nbsp;Sim End:
            <div class="datePos"><span class="font-medium">
                {{ formatDate(calData?.validation_times.simulation_end_time) }}</span></div>
            </p>
            <p v-if="calData?.validation_times.validation_start_time">&nbsp;&nbsp;Val Start:
            <div class="datePos"><span class="font-medium">
                {{ formatDate(calData?.validation_times.validation_start_time) }}</span></div>
            </p>
            <p v-if="calData?.validation_times.validation_end_time">&nbsp;&nbsp;&nbsp;&nbsp;Val End:
            <div class="datePos"><span class="font-medium">
                {{ formatDate(calData?.validation_times.validation_end_time) }}</span></div>
            </p>
            <p>&nbsp;</p>
            <p v-if="calData?.objective_function">Tuning Parameters: &nbsp;<span class="font-medium">{{ null }}</span></p>
            <p v-if="calData?.objective_function">Objective Function: <span class="font-medium">{{
              calData?.objective_function }}</span></p>
            <p v-if="calData?.plot_frequency">Plot Generation Frequency: &nbsp;<span class="font-medium">{{
              calData?.plot_frequency }}</span></p>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useGageStore } from '~/stores/calibration/GageStore';
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { formatDateForDisplay } from '~/utils/TimeHelpers';

const gageStore = useGageStore();
const calRunStore = useUserDataStore();

const { gageData, gageTabData, selectedDomainValue, data_loading, selectedForcingValue, selectedGageValue, getGageOptionsList, selectedObservationalValue, getDomainOptionsList, getForcingOptionsList, getObservationalOptionsList } = storeToRefs(gageStore)
const { userCalibrationRunData } = storeToRefs(calRunStore);

const calData = ref(userCalibrationRunData);

const getModuleList = () => {
  let modules = "";
  calData.value?.modules.forEach(element => {
    modules += element;
    if (calData.value?.modules[calData.value?.modules.length - 1] !== element) {
      modules += ", ";
    }
  });
  return modules;
}

const formatDate = (d: any) => {
  if ((d instanceof Date)) {
    console.log('Date');
  } else {
    return formatDateForDisplay(d);
  }
}

</script>

<style lang="scss" scoped>
#Messages {
  padding: 15px;
  font-size: 1.1em;
}

p {
  line-height: 1.4em;
}

.datePos {
  float: right;
  margin-right: 50px;
}
</style>
