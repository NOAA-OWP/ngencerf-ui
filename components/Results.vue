<template>
  <div id="ResultPage">
    <div class="grid grid-rows-2">
      <div row-span-1>
        <div id="ResultsDisplay">
          <div class="grid grid-cols-2">
            <div class="col-span-1">
              <table>
                <tr>
                  <td class="text-right">Running Time:</td>
                  <td class="pl-5">{{ runningTime ? runningTime : dashes }}</td>
                </tr>
                <tr>
                  <td class="text-right">Start Time:</td>
                  <td class="pl-5">{{ startTime ? startTime : dashes }}</td>
                </tr>
                <tr>
                  <td class="text-right">Iteration:</td>
                  <td class="pl-5">{{ iteration ? iteration : dashes }}</td>
                </tr>
              </table>
            </div>

            <div class="col-span-1" style="border-left: 1px solid #000">
              <div class="mt-1">Status:</div>
              <div>Display:</div>
            </div>
          </div>
        </div>
      </div>
      <div row-span-1></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const dashes = "---------------------------";
const runningTime = ref();
const startTime = ref();
const iteration = ref();
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#ResultsDisplay {
  width: 50vw;
  //margin-left: 5vw;
  margin: 20px auto;
  background-color: $ngwcp_groupsbkg;
  padding: 10px 10px 10px 20px;
  border-radius: 20px;
  height: 100px;
  border: 1px solid $ngwcp_primary1;
}

.leftSideText {
  width: 135px;
  text-align: right;
  padding-right: 20px;
}
</style>
