// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { SelectOption, CalibrationValidationRunData, ValidatedCalibrationRunList, DynamicTableColumn } from "~/composables/NextGenModel";
import { useCalibrationTabValidation } from "~/composables/ValidationHandlers";

export const useEvaluationAltIterationStore = defineStore('EvaluationAltIterationStor', () => {  

  const fetchCalibrationRunDetailDataList = () => {
    const { data } = useFetch('/api/evaluation/run_detail_data')
    return <any[]>data.value
  }

  const fetchTuningParametersDataList = () => {
    const { data } = useFetch('/api/evaluation/corresponding_calibraiton_tuning_param_data')
    return <any[]>data.value
  }

  return {
    fetchCalibrationRunDetailDataList,
    fetchTuningParametersDataList
  }
})

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationAltIterationStore, import.meta.hot));
}