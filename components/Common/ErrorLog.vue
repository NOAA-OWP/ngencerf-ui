<template>
  <div id="ErrorLog" ref="errorLog">
    <div class="">
      <div class="inline text-xl font-bold text-right ml-5 mt-3">Error Log</div>
      <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
        class="absolute cursor-pointer right-0 boxed mt-1 mr-1 inline-block" @click="closeErroLogBox" />
    </div>
    <div v-if="toastRecords.length === 0" class="text-lg font-bold text-center">
      There are no log records at this time.
    </div>
    <div class="mainframe">
      <div class="wrapper">
        <DataTable id="ErrorTable" :value="toastRecords" class="p-datatable-striped" scrollable scroller="true">
          <Column :pt="ptColumn" field="datetime" header="Date"></Column>
          <Column :pt="ptColumn" field="severity" header="Severity"></Column>
          <Column :pt="ptColumn" field="summary" header="Summary"></Column>
          <Column :pt="ptColumn" field="detail" header="Detail"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { generalStore } from '~/stores/common/GeneralStore';

const gstore = generalStore();
const { toastRecords } = storeToRefs(gstore);

const errorLog = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  console.log(toastRecords.value)
  //Example usage: add a listener and define the callback function
  // addVisibilityListener((isVisible) => {
  //   if (isVisible) {
  //     setTimeout(() => {
  //       console.log('Component is visible');
  //       let ele = document.getElementById("ErrorLog");
  //       let ele1 = document.getElementsByClassName("mainframe");
  //       let ele2 = document.getElementById('ErrorTable')
  //       if (ele && ele1) {
  //         (ele1[0] as HTMLElement).style.height = ele.clientHeight + "px";
  //         if( ele2) { ele2.style.height = ele.clientHeight + "px"; }
  //       }
  //       // Perform actions when the component is visible
  //     }, 0)
  //   } else {
  //     console.log('Component is not visible');
  //     // Perform actions when the component is not visible
  //   }
  // });

});

onBeforeUnmount(() => {
  // observer?.disconnect();
  // observer = null;
});

// Define the type for the callback function
// type VisibilityCallback = (isVisible: boolean) => void;

// // Define the event listener function with a callback parameter
// const addVisibilityListener = (callback: VisibilityCallback) => {
//   if (!errorLog.value) return;

//   observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       callback(entry.isIntersecting);
//     });
//   });

//   observer.observe(errorLog.value);
// };

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const scrollHeight = () => {
  let ele = document.getElementById("ErrorLog");
  return ele ? ele.style.height : "500px";
}

const closeErroLogBox = () => {
  useAccountEvent("errorLogEvent", "");
}

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
}

table {
  width: 97%;
}

table thead tr {
  position: sticky;
}

.mainframe {
  overflow: hidden;
  position: fixed;

  width: auto;
}

.wrapper {
  width: 95%;
  height: 95%;
}

.allow-scroll {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

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