<template>
  <div id="ResultPage">
    <div class="grid grid-rows-12">
      <div class="row-span-2">
        <div id="ResultsDisplay">
          <div class="grid grid-cols-2">
            <div class="col-span-1">
              <table>
                <tr>
                  <td class="text-right">Running Time:</td>
                  <td class="pl-5">{{ runningTime ? runningTime : '-'.repeat(30) }}</td>
                </tr>
                <tr>
                  <td class="text-right">Start Time:</td>
                  <td class="pl-5">{{ startTime ? startTime : '-'.repeat(30) }}</td>
                </tr>
                <tr>
                  <td class="text-right">Iteration:</td>
                  <td class="pl-5">{{ iteration ? iteration : '-'.repeat(30) }}</td>
                </tr>
              </table>
            </div>

            <div class="col-span-1 pl-5" style="border-left: 1px solid #000">
              <div class="mt-1">
                Status: <span v-if="!progress">
                  <input class="dummyProgress ml-2" disabled style="width: 296px;" />
                </span>
                <span v-else>
                  <ProgressBar :value="progress"></ProgressBar>
                </span>
              </div>
              <div class="mt-4">Display:
                <select id="DisplayOptions">
                  <option>Parameters</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-span-10">
        <div id="GraphArea">
         Data Display

        </div>
      </div>
    </div>
    <div class="waitgif" v-if="loading">
      <img src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProgressBar from "primevue/progressbar";
const loading = ref(true);
const runningTime = ref();
const startTime = ref();
const iteration = ref();

const progress = ref(0);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#ResultsDisplay {
  width: 50vw;
  margin: 20px auto;
  background-color: $ngwcp_groupsbkg;
  padding: 10px 10px 10px 20px;
  border-radius: 20px;
  height: 100px;
  border: 1px solid $ngwcp_primary1;
  min-width: 750px;

}

#GraphArea {
  height: 500px;
  width: 900px;
  margin: 8px auto 0 auto;
  background-color: $ngwcp_groupsbkg;
}

#DisplayOptions {
  width: 60%;
  margin-left: 10px;
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
