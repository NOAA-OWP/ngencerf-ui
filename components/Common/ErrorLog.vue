<template>
  <div id="ErrorLog">
    <div class="">
      <div class="inline text-xl font-bold text-right ml-5 mt-3">Error Log</div>
      <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
        class="absolute cursor-pointer right-0 boxed mt-1 mr-1 inline-block" @click="closeErroLogBox" />
    </div>
    <div v-if="toastRecords.length === 0" class="text-lg font-bold text-center">
      There are no log records at this time.
    </div>
    <!-- <div id="TableFixHead" class="tableFixHead"> -->
    <div class="mainframe">
      <div class="wrapper">
        <div class="allow-scroll">
          <table class="mt-5 w-full">
            <colgroup>
              <col span="1" style="width: 20%;">
              <col span="1" style="width: 6%;">
              <col span="1" style="width: 20%;">tableFixHead
              <col span="1" style="width: 34%;">
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
    </div>
  </div>
</template>
200pox
<script setup lang="ts">
import { generalStore } from '~/stores/common/GeneralStore';

onMounted(() => {
  //console.log(toastRecords.value)
  let ele = document.getElementById("ErrorLogOverlay");
  let ele1 = document.getElementsByClassName("mainframe");
  if( ele && ele1 ) {
    (ele1[0] as HTMLElement).style.height = ele.clientHeight + "px";    
  }

 // debugger;
});

const closeErroLogBox = () => {
  useAccountEvent("errorLogEvent", "");
}

const gstore = generalStore();
const { toastRecords } = storeToRefs(gstore);

</script>

<style lang="scss" scoped>
#ErrorLog {
  position: absolute;
  right: 5px;
  border: 5px solid #ccc;
  z-index: 9999;
  width: 888px;
  min-height: 500px;
  background-color: white;
  //overflow:hidden;
  //overflow-y: scroll;
}

.mainframe {
  overflow: hidden;
  position: fixed;
  height: 200px;
  width: 500px;
}

.wrapper {
  margin: 5%;
  width: 90%;
  height: 90%;
  background-color: red;
}

.allow-scroll {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  overflow-x: scroll;
  background-color: lime;
}

.dataCell {
  text-align: center;
  vertical-align: top;
}

.dataRow {
  border-bottom: 1px solid #4444;
}

.tableFixHead {
  //overflow: auto;
  //width: 100%;
}

// .tableFixHead thead th {
//   position: sticky;
//   top: 0;
//   z-index: 9999;
// }

// .tableFixHead tbody th {
//   position: sticky;
//   left: 0;
// }

// table {
//   border-collapse: collapse;
//   width: 100%;
// }

// th,
// td {
//   padding: 8px 16px;
//   white-space: nowrap;
// }

// th {
//   background: #eee;
// }</style>