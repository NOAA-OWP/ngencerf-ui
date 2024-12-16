<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <client-only>
    <div class="h-screen-inner pr-2">

      <div class="flex mt-2">
        <div class="w-full">
          <h1 class="pt-3 mb-8 text-3xl font-bold text-center">
            Calibration Runs<br />
            <span style="font-size: 12px;font-weight: normal;">
              Double click on a row to setup a forecast, or select row and right click for more options.
            </span>
          </h1>
        </div>
      </div>

      <div id="calibrationRunList">
        <div>
          <div id="CalTable">
            <div class="grid grid-cols-2 mb-5 gage-filter-wrapper">
              <div class="col-span-1">
                <div class="ml-10">
                  <label for="HeadwaterBasinGage">Headwater Basin Gage Filter</label><br>
                  <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter" v-model="uiGageId"
                    :options="forecastRunGageList" filter optionLabel="name" optionValue="name"
                    placeholder=""></Select>
                </div>
              </div>
            </div>
            <ConfirmDialog></ConfirmDialog>
            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
              :model="cmCalibrationRun"></ContextMenu>
            <DataTable id="CalibrationRunForForecastTable" :value="calibrationRunsForForecast" scrollable scroll-height="400px"
              sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
              v-model:selection="calibrationRunForForecast" selectionMode="single" :rowStyle="rowStyle"
              @rowSelect="onCalibrationRunForForecastRowSelect" @rowUnselect="onCalibrationRunForForecastRowUnSelect" @rowContextmenu="onRowContextMenu" class="boxed">
              <Column :pt="ptColumn" field="calibration_run_id" header="Job ID" sortable></Column>
              <Column :pt="ptColumn" field="status" header="Status" sortable></Column>
              <Column field="submit_date" header="Run Date" sortable>
                <template #body="slotProps">
                  {{ formatDateForDisplay(slotProps.data.created_at) }}
                </template>
              </Column>
              <Column :pt="ptColumn" field="formulation_name" header="Formulation Name" sortable></Column>
              <Column :pt="ptColumn" field="gage_id" header="Headwater Basin Gage" sortable></Column>
              <Column :pt="ptColumn" field="objective_function" header="Objective Function" sortable></Column>
              <Column :pt="ptColumn" field="optimization_algorithm" header="Optimization Algorithm" sortable></Column>
            </DataTable>
          </div>
        </div>
      </div>

    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import type { CalibrationRunForForecast, DataTableContextMenuOption } from "@/composables/NextGenModel";
import { ForecastTabs } from "@/composables/NextgenEnums";
import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { formatDateForDisplay } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';
import { storeToRefs } from "pinia";
import MessagesGroup from "@/components/Common/MessagesGroup.vue";

const { deleteCalibrationRun } = useCalibrationJobStore();

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();
const showMessagesGroup = ref<boolean>(false);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const forecastStore = useForecastStore();
const { getCalibrationJobsForForecast, resetUserSelectedForecastCalibrationRun } = forecastStore;


const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

//this model is for highlighting purpose
const selectedCalibrationRun = ref<CalibrationRunForForecast>();

const isLoading = ref(true);
const cmCalibrationRun = ref<DataTableContextMenuOption[]>([]);
const onRowContextMenu = (event: any) => {
  cmCalibrationRun.value = [];
  const crRowData = event.data as CalibrationRunForForecast; 
  if ( selectedCalibrationRun && selectedCalibrationRun.value?.calibration_run_id == crRowData.calibration_run_id ) {
    crContextMenu.value.show(event.originalEvent);
    //forecastJobId.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
    setSelectedCalibrationRunId( parseInt(event.originalEvent.currentTarget.children[0].textContent) );
    cmCalibrationRun.value.push( { label: 'Run New Forecast', icon: 'pi pi-fw-pisearch', command: () => navigateToSetupForecast() } );    
    cmCalibrationRun.value.push( { label: 'View Calibration Details', icon: 'pi pi-fw-pisearch', command: () => viewCalibrationDetails( crRowData.calibration_run_id ) } )
    //cmCalibrationRun.value.push( { label: 'Evaluate', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun() } );
    //cmCalibrationRun.value.push( { label: 'Show Setup', icon: 'pi pi-fw-pisearch', command: () => onCalibrationRunForForecastRowSelect() } );    
    cmCalibrationRun.value.push( { label: 'Delete Calibration Job', icon: 'pi pi-fw-pisearch', command: () => deleteSelectedCalibrationRun() } );
  }  
};

const {
  uiGageId,
  loadCalibrationDataComplete,
  userSelectedEvalCalibrationRunId,
} = storeToRefs(evaluationCalibrationRunStore);

const {
  fetchUserSelectedCalibrationValidationRunList,
  loadSelectedCalibrationRun,
  resetUserSelectedEvalCalibrationRun,
  resetUserSelectedEvalValidationRun,
  fetchUserValidatedCalibrationJobsListData,
} = evaluationCalibrationRunStore;

const { userCalibrationRunData } = storeToRefs(useUserDataStore());

const { calibrationRunsForForecast, calibrationRunForForecast, forecastRunGageList } = storeToRefs(useForecastStore());

const { setSelectedCalibrationRunId, resetSelectedCalibrationRunId } = useForecastStore();

onMounted(async () => {
  isLoading.value = true;
  hilightTab(ForecastTabs.tab_calibrationRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }
  //forecastJobId.value = 0;
  resetSelectedCalibrationRunId();
  //clear calibration data if user were on calibration tab and clear evaluation previous run data user may have selected
  resetUserSelectedEvalCalibrationRun();
  resetUserSelectedForecastCalibrationRun();
  await getCalibrationJobsForForecast();
  isLoading.value = false;
});

const viewCalibrationDetails = async ( calibration_run_id: number ) => {
  isLoading.value = true;  
  nextTick(async () => {  
    await loadSelectedCalibrationRun( calibration_run_id );
    isLoading.value = false;
    showMessagesGroup.value = true;
  })  
}

const onCalibrationRunForForecastRowSelect = async (event: any) => {
  //isLoading.value = true;
  const rowData = event.data as CalibrationRunForForecast; 
  setSelectedCalibrationRunId( rowData.calibration_run_id );
  //forecastJobId.value = rowData.calibration_run_id;
  //await loadSelectedCalibrationRun(forecastJobId.value as number);
  //await fetchUserSelectedCalibrationValidationRunList();
  //isLoading.value = false;
}

const onCalibrationRunForForecastRowUnSelect = async (event: DataTableRowClickEvent) => {
  //forecastJobId.value = 0;
  resetSelectedCalibrationRunId();
}

watch(() => userCalibrationRunData.value, (updatedRunData, initialRunData) => {
  if (updatedRunData !== undefined && Object.keys(updatedRunData).length > 0) {
    nextTick(() => {
      isLoading.value = false;
      loadCalibrationDataComplete.value = true;
    });
  }
});

const openSelectedCalibrationRun = async () => {
  console.log('openSelectedCalibrationRun');
  console.log('calibrationRunForForecast.value.calibration_run_id: ', calibrationRunForForecast.value?.calibration_run_id);
  isLoading.value = true;
  resetUserSelectedEvalValidationRun();
  console.log('calibrationRunForForecast.value.calibration_run_id: ', calibrationRunForForecast.value?.calibration_run_id);

  await loadSelectedCalibrationRun(calibrationRunForForecast.value?.calibration_run_id as number);
  await fetchUserSelectedCalibrationValidationRunList();
  navigateToSetupForecast();
  isLoading.value = false;
};

const navigateToSetupForecast = () => {
  if (calibrationRunForForecast?.value?.calibration_run_id && calibrationRunForForecast.value.calibration_run_id > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[ForecastTabs.tab_setupForecast];
    e.click();
  } else {
    toast.add({ severity: 'warn', summary: 'Missing Calibration Job', detail: 'Please select a calibration job first.', life: 6000 })
  }
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'white' }
  }
}

const confirmDelete = useConfirm();

const deleteSelectedCalibrationRun = () => {
  const selectedRunId = calibrationRunForForecast.value?.calibration_run_id as number;
  let confirmMessage = "Are you sure you want to delete this run?"
  confirmDelete.require({
    message: confirmMessage,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'DELETE RUN',
    },
    accept: () => acceptDelete(selectedRunId),
    reject: () => {
      //do nothing
    }
  })
};

const acceptDelete = (selectedRunId: number) => {
  deleteCalibrationRun(selectedRunId).then(response => {
    if (response.status === 200) {
      fetchUserValidatedCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        toast.add({ severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: 10000 });
      });
    }
  });
  selectedCalibrationRun.value = undefined;
};

const toggleMessagesGroup = () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#calibrationRunList {
  height: 80%;
}
#HeadwaterBasinGage {
  width: 300px;
}

#CalibrationRunForForecastTable,
.gage-filter-wrapper  {
  width: 1270px;
  margin: 0 auto;
}

.gage-filter-wrapper {
  margin-bottom: 1rem;
}

#MessagesGroupWindow {
  z-index: 9999;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}
</style>