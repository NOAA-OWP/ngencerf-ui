<template>
  <div id="ErrorLog" ref="errorLog">
    <div class="">
      <div class="inline text-xl font-bold text-right ml-5 mt-5">Application Log</div>
      <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
        class="absolute cursor-pointer right-0 boxed mt-1 mr-1 inline-block" @click="closeErroLogBox" />
    </div>
    <div v-if="toastRecords.length === 0" class="text-lg font-bold text-center">
      There are no log records at this time.
    </div>
    <div id="TableWrapper" class="mt-5">

      <div class="flex flex-wrap gap-4 mb-5">
        <div class="flex items-center gap-2 ml-5">
          <Checkbox v-model="infoToast" inputId="infoToast" name="infoToast" value="info" binary />
          <label for="infoToast">Information</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="warnToast" inputId="warnToast" name="warnToast" value="warn" binary />
          <label for="warnToast">Warnings</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="errorToast" inputId="errorToast" name="errorToast" value="error" binary />
          <label for="errorToast">Errors</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="successToast" inputId="successToast" name="successToast" value="success" binary />
          <label for="successToast">Success</label>
        </div>
      </div>
      <DataTable id="ErrorTable" :value="getToastArray()" class="p-datatable-striped" scrollable scroller="true"
        scroll-height="500px">
        <Column :pt="ptColumn" field="datetime" header="Date" class="columnClass" style="width: 20%; text-align:center">
        </Column>
        <Column :pt="ptColumn" field="severity" header="Severity" class="columnClass text-center"
          style="width: 10%; text-align:center">
        </Column>
        <Column :pt="ptColumn" field="summary" header="Summary" class="columnClass text-center"
          style="width: 28%; text-align:center">
        </Column>
        <Column :pt="ptColumn" field="detail" header="Detail" class="columnClass text-left" style="width: 45%;">
        </Column>
      </DataTable>
    </div>
  </div>
</template>ingredient

<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from 'primevue/checkbox';
import { generalStore } from '~/stores/common/GeneralStore';

const gstore = generalStore();
const { toastRecords } = storeToRefs(gstore);

const errorLog = ref<HTMLElement | null>(null);

const infoToast = ref<boolean>(true);
const warnToast = ref<boolean>(true);
const errorToast = ref<boolean>(true);
const successToast = ref<boolean>(true);

const toastsToDisplay = ref();

const getToastArray = () => {
  toastsToDisplay.value = [];
  toastRecords.value.forEach((item) => {
    if ((infoToast.value && item.severity === "info") ||
      (warnToast.value && item.severity === "warn") ||
      (errorToast.value && item.severity === "error") ||
      (successToast.value && item.severity === "success")
    ) {
      toastsToDisplay.value.push(item);
    }
  })
  return toastsToDisplay.value;
}

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  //bodyCell: { style: { "text-align": "center" } }
});

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
  background-color: white;
  height: 629px;
}

#ErrorTable {
  height: 500px;
  width: 100%;
}

.columnClass {
  vertical-align: top;
}
</style>