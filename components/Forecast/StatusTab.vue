<template>
  <div class="grid grid-rows-10">
      <div class="row-span-1">
          <div id="CalibrationRunId" class="mt-5">
              Calibration Run ID {{ 265 }}
          </div>
      </div>

      <div class="row-span-1 summaryRow">
          <div class="grid grid-cols-7">
              <div class="col-span-1 text-center">
                  Iteration: {{ 87 }}
              </div>
              <div class="col-span-2 line-left">
                  Output Var to Export: 
              </div>
              <div class="col-span-2 line-left">
                  Sim Start:<br />
                  Sim End:
              </div>
              <div class="col-span-2 line-left">
                  Validation Start:<br />
                  Validation End:
              </div>
          </div>
      </div>

      <div class="row-span-8">
          <div id="LoggingArea" class="boxed p-4">
              <p v-for="l in 20">Log Line...</p>
          </div>
      </div>

  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#CalibrationRunId {
  font-size: 2em;
  text-align: center;
}

#LoggingArea {
 // width: 1100px;
 width: 90%;
  margin: 10px auto;
}
.summaryRow {
      width: 1100px;
  margin: 10px auto;
}
.line-left {
  border-left: 1px solid black;
  padding-left: 5px;
}
</style>