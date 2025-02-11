<template>
  <div id="ErrorLogOverlay">
    <div class="sticky top-0">
      <div class="inline text-xl font-bold text-right ml-5 mt-3">Error Log</div>
      <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
        class="absolute cursor-pointer right-0 boxed mt-1 mr-1 inline-block" @click="closeErroLogBox" />
    </div>
    <div v-if="toastRecords.length === 0" class="text-lg font-bold text-center">
      There are no log records at this time.
    </div>
    <div v-else>
      <table class="mt-5">
        <colgroup>
          <col span="1" style="width: 20%;">
          <col span="1" style="width: 10%;">
          <col span="1" style="width: 20%;">
          <col span="1" style="width: 30%;">
        </colgroup>
        <thead style="border-bottom: 1px solid #000">
          <tr>
            <th>Date</th>
            <th>Severity</th>
            <th>Summary</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in toastRecords" class="dataRow">
            <td class="dataCell">{{ t.datetime }}</td>
            <td class="dataCell">{{ t.severity }}</td>
            <td class="dataCell">{{ t.summary }}</td>
            <td>{{ t.detail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generalStore } from '~/stores/common/GeneralStore';

onMounted(() => {
  console.log(toastRecords.value)
});

const closeErroLogBox = () => {
  useAccountEvent("errorLogEvent", "");
}

const gstore = generalStore();
const { toastRecords } = storeToRefs(gstore);

</script>

<style lang="scss" scoped>
#ErrorLogOverlay {
  position: absolute;
  right: 5px;
  top: 90px;
  border: 5px solid #ccc;
  z-index: 9999;
  width: 888px;
  height: auto;
  min-height: 500px;
  background-color: white;
}

.dataCell {
  text-align:center;
  vertical-align: top;
}

.dataRow {
  border-bottom: 1px solid #4444;
}
</style>