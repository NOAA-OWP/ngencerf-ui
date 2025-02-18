<template>
  <div id="ErrorLog" ref="errorLog">
    <div class="mt-2">
      <div class="inline text-xl font-bold text-right ml-5 mt-5">Notifications</div>
      <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
        class="absolute cursor-pointer right-0 boxed mt-1 mr-1 inline-block" @click="closeErroLogBox" />
    </div>
    <div v-if="toastRecords.length === 0" class="text-lg font-bold text-center">
      There are no log records at this time.
    </div>
    <div id="TableWrapper" class="mt-5">

      <div class="flex flex-wrap gap-4 mb-5">
        <div class="flex items-center ml-5">
          Show notifications for
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="infoToast" inputId="infoToast" name="infoToast" value="info" binary/>
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

      <DataTable id="ErrorTable" :value="getToastArray" class="p-datatable-striped" scrollable scroller="true"
        scroll-height="500px">

        <Column :pt="ptColumn" header="" class="" style="width: 1%; text-align:center; vertical-align: top;">
          <template #body="scope">
            <div :style="{ backgroundColor: getColor(scope.data.severity) }">&nbsp;</div>
          </template>
        </Column>
        <Column :pt="ptColumn" field="datetime" header="Date" class="columnClass"
          style="width: 19%; text-align:center; vertical-align: top;">
        </Column>
        <Column :pt="ptColumn" field="severity" header="Severity" class="columnClass text-center"
          style="width: 8%; text-align:center; vertical-align: top;">
        </Column>
        <Column :pt="ptColumn" field="summary" header="Summary" class="columnClass text-center"
          style="width: 29%; text-align:left; vertical-align: top;">
        </Column>
        <Column :pt="ptColumn" field="detail" header="Detail" class="columnClass text-left"
          style="width: 43%; vertical-align: top;">
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

const getToastArray = computed(() => {
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
});

const getColor = (s: string) => {
  if (s === 'info') return "white";
  else if (s === 'warn') return "yellow";
  else if (s === 'error') return "red";
  else if (s === 'success') return "green";
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
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#ErrorLog {
  position: absolute;
  right: 5px;
  border: 5px solid #ccc;
  z-index: 9999;
  width: 975px;
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