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

    <DataTable :value="toastRecords" class="p-datatable-striped">
      <Column field="datetime" header="Date"></Column>
      <Column field="severity" header="Severity"></Column>
      <Column field="summary" header="Summary"></Column>
      <Column field="detail" header="Detail"></Column>
    </DataTable>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { generalStore } from '~/stores/common/GeneralStore';

const errorLog = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  console.log(toastRecords.value)
  // Example usage: add a listener and define the callback function
  // addVisibilityListener((isVisible) => {
  //   if (isVisible) {
  //     setTimeout(() => {
  //       console.log('Component is visible');
  //       let ele = document.getElementById("ErrorLog");
  //       let ele1 = document.getElementsByClassName("mainframe");
  //       if (ele && ele1) {
  //         (ele1[0] as HTMLElement).style.height = ele.clientHeight + "px";
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

// // Define the type for the callback function
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