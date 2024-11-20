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
                    <td class="pl-5">{{ '-'.repeat(30) }}</td>
                  </tr>
                  <tr height="32px">
                    <td class="text-right font-bold">Elapsed Time</td>
                    <td class="pl-5">{{ '-'.repeat(30) }}</td>
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

<script setup lang="ts">
import { hilightTab } from '~/composables/TabHilight';
const isLoading = ref<boolean>(false);
onMounted( () => {
  hilightTab(ForecastTabs.tab_runStatus);  
  isLoading.value = false;
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }
});


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

