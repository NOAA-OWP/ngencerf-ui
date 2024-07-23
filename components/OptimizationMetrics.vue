<template>
  <div id="OptimizationMetrics">
    <div class="grid grid-cols-2">
      <div class="grid col-span-1">
        <div class="grid grid-rows-3">
          <div class="row-span-1">
            <div id="OptAlg">
              Optimization Algorithm<br />
              name:
              <select>
                <option></option>
              </select>
            </div>
          </div>
          <div class="row-span-1">
            <div id="AlgParamtable">
              Algorithm Parameter(s)
              <table>
                <tr>
                  <td>[table]</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="row-span-1">
            <div id="CalStop">
              Calibration Stop Criteria:
              <input type="number" />
              Interations
            </div>
          </div>
        </div>
      </div>
      <div class="grid col-span-1">
        <div class="grid grid-rows-3">
          <div class="row-span-1">
            <div id="ObjFunct">Objective Function</div>
          </div>
          <div class="row-span-1"><div id="Metrics">Metrics</div></div>
          <div class="row-span-1">
            <div id="PlotGenFreq">Plot Generation Frequency (0 = off)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
h1 {
  margin-top: 20px;
  text-align: center;
}
</style>
