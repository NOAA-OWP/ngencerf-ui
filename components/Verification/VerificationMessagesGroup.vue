<template>
  <div id="Messages">
    <div class="grid grid-rows-12">
      <div class="row-span-3">
        <div class="grid grid-cols-2 gap=1">
          <div class="col-span-1">
            <p>Gage:</p>
            <p>Forcing Data:</p>
            <p>Formulation Name:</p>
            <p>Modules:</p>
          </div>
          <div class="col-span-1">
            <p>...</p>
            <p>Observational Data:</p>
          </div>
        </div>
      </div>
      <p>&nbsp;</p>
      <div class="row-span-9">
        <div class="grid grid-cols-2 gap=1">
          <div class="col-span-1">
            <p class="text-center">Calibration Run</p>
            <p>Sim Start :</p>
            <p>Sim End: </p>
            <p>Calib Start: </p>
            <p>Calib End:</p>
            <p>&nbsp;</p>
            <p>Cal Output Variable: </p>
            <p>Optimization Algorithm: </p>
            <p>Calibration Stop Criteria: </p>
            <p>Metrics: </p>

          </div>
          <div class="col-span-1">
            <p class="text-center">Validation Run</p>
            <p>Sim Start :</p>
            <p>Sim End: </p>
            <p>Val Start: </p>
            <p>Val End:</p>
            <p>&nbsp;</p>
            <p>Tuning Paramters: </p>
            <p>Objective Function: </p>
            <p>Plot Generation Frequency: </p>

          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Gage:  01123000
USGS      LITTLE RIVER HANOVER, CT
Forcing Data:  name.csv READY
Observational Data: READY
Formulation Name: cfe_noah
Modules:  SLoTH, Noah-OWP, CFE-S, T-Route
Sim Start:  2016-01-01 00:00:00
Calibration Run
Sim Start:   2010-01-01 00:00:00
Validation Run
Sim End:  2019-12-31 23:00:00
Sim End:  2013-12-31 23:00:00
Calib Start:  2017-01-01 00:00:00
Val Start:  2011-01-01 23:00:00
Calib End:  2019-12-31 23:00:00
Val End:  2013-12-31 23:00:00
Cal Output Variable: Q_OUT
Tuning Parameters: 2 Selected
Optimization Algorithm: DDS
Objective Function: KGE
Calibration Stop Criteria: 1000
Seed Value: 1024
Metrics: 2 Selected
Plot Generation Frequency: 5 -->
</template>
<script lang="ts" setup>
//
</script>

<style lang="scss" scoped>
#Messages {
  padding: 15px;
  font-size: 1.2em;
}

p {
  line-height: 1.4em;
}
</style>
