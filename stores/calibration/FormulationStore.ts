// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { generalStore } from "../common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import type { SelectOption, FormulationTabData, SlothParameterData, GeneralApiSaveResponse, SaveFormulationTabPayload } from "@/composables/NextGenModel";
import { useCalibrationFormulationTabSaveValidate } from "@/composables/ValidationHandlers";

export const useFormulationStore = defineStore('FormulationStore', () => {
  /**
  * define ref
  */
  const { calibrationJobId } = storeToRefs(generalStore())
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore()
  const userDataStore = useUserDataStore()
  const { userCalibrationRunData } = storeToRefs(userDataStore)

  const filterGroup = ref<string>("")
  const selectedModuleValues = ref<string[]>([])
  const formulationNameInput = ref<string>("")
  const slothParameterInputs = ref<SlothParameterData[]>([])
  const useSlothParameters = ref<boolean>(false)

  const formulationTabData = ref<FormulationTabData>()
  const formulationStore_data_loading = ref<boolean>(true)

  // Restore state from sessionStorage if available
  if (typeof window !== 'undefined') {
    let ls;
    ls = sessionStorage.getItem('slothParameterInputs');
    if (ls !== "undefined") { slothParameterInputs.value = ls ? JSON.parse(ls) : [] }
    ls = sessionStorage.getItem('selectedModuleValues');
    if (ls !== "undefined") { selectedModuleValues.value = ls ? JSON.parse(ls) : [] }
    ls = sessionStorage.getItem('formulationTabData');
    if (ls !== "undefined") { formulationTabData.value = JSON.parse(ls as string) }

    filterGroup.value = sessionStorage.getItem('filterGroup') as string;
    formulationNameInput.value = sessionStorage.getItem('formulationNameInput') as string;
    useSlothParameters.value = sessionStorage.getItem('useSlothParameters') as string === "true";
    formulationStore_data_loading.value = sessionStorage.getItem('formulationStore_data_loading') as string === "true";
  }

  watch(slothParameterInputs, (slothParameterInputs) => { sessionStorage.setItem('slothParameterInputs', JSON.stringify(slothParameterInputs)); })
  watch(selectedModuleValues, (selectedModuleValues) => { sessionStorage.setItem('selectedModuleValues', JSON.stringify(selectedModuleValues)); })
  watch(formulationTabData, (formulationTabData) => { sessionStorage.setItem('formulationTabData', JSON.stringify(formulationTabData)); })
  watch(filterGroup, (filterGroup) => { sessionStorage.setItem('filterGroup', filterGroup); })
  watch(formulationNameInput, (formulationNameInput) => { sessionStorage.setItem('formulationNameInput', formulationNameInput); })
  watch(useSlothParameters, (useSlothParameters) => { sessionStorage.setItem('useSlothParameters', JSON.stringify(useSlothParameters)); })
  watch(formulationStore_data_loading, (formulationStore_data_loading) => { sessionStorage.setItem('formulationStore_data_loading', JSON.stringify(formulationStore_data_loading)); })


  /**
  * load forumlation tab data and init ref data
  * @returns {void}
  */
  const loadFormulationTabStaticData = () => {
    formulationStore_data_loading.value = true
    makeProtectedApiCall<FormulationTabData>(`${ngencerfBaseUrl}/calibration/load_formulation_tab/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    }).then((formulationTabDataResult) => {
      formulationTabData.value = formulationTabDataResult?._data ?? undefined;
      setUserSelection();

      formulationStore_data_loading.value = false;
    })
  }

  const setUserSelection = (): void => {
    formulationNameInput.value = userCalibrationRunData.value?.formulation_name ?? "";
    //selectedModuleValues.value = getSavedModuleSelection.value ?? []
    selectedModuleValues.value = JSON.parse(JSON.stringify(userCalibrationRunData.value?.modules)) ?? [];
    useSlothParameters.value = userCalibrationRunData.value?.use_sloth ?? false;
    slothParameterInputs.value = JSON.parse(JSON.stringify(userCalibrationRunData.value?.sloth_parameters)) ?? [];
  }

  /**
  * return list of Module Options based on the filter selection
  * @returns {SelectOption[]}
  */
  const fetchFormulationModuleOptions = computed(() => {
    let modules_list = <SelectOption[]>[];
    let selected_mouldes_list = <SelectOption[]>[];
    formulationTabData.value?.modules.forEach((moduleData) => {
      if (!filterGroup.value || moduleData.groups.includes(filterGroup.value)) {
        const selectOptionItem = {
          name: moduleData.name,
          description: moduleData.name,
          selected: false,
          groups: moduleData.groups
        };
        if (userCalibrationRunData.value?.modules.includes(moduleData.name)) {
          selected_mouldes_list.push(selectOptionItem);
        } else {
          modules_list.push(selectOptionItem);
        }
      }
    });

    return selected_mouldes_list.slice().sort((a, b) => a.name.localeCompare(b.name)).concat(modules_list.slice().sort((a, b) => a.name.localeCompare(b.name)));
  })

  /**
  * return list of selected group names
  * @returns {string[]}
  */
  function selectedModuleCoveredGroups() {
    let selectedGroups = <string[]>[]
    formulationTabData.value?.modules.forEach((moduleData) => {
      if (selectedModuleValues.value.includes(moduleData.name)) {
        selectedGroups = selectedGroups.concat(moduleData.groups)
      }
    })
    return selectedGroups
  }

  /**
  * return list of selected module name
  * @returns {string[]}
  */
  // const getSavedModuleSelection = computed(() => {
  //   let selectedModules = <string[]>[]
  //   formulationTabData.value?.modules.forEach((moduleData) => {
  //     if (moduleData.used_by_calibration_run) selectedModules.push(moduleData.name)
  //   })
  //   return selectedModules
  // })

  /**
  * return list of group options for the group filter field
  * @returns {SelectOption[]}
  */
  const fetchFormulationModuleCoveredGroupFilterOptions = computed(() => {
    let groupOptionsList = <SelectOption[]>[{
      name: "",
      description: "ALL"
    }]
    //let groups_list = fetchModuleCoveredGroupList();
    formulationTabData.value?.module_groups.forEach((group) => {
      groupOptionsList.push({
        name: group,
        description: group,
        selected: false,
        groups: []
      })
    });

    return groupOptionsList
  })

  /**
  * return list of group options for the group listbox field
  * @returns {SelectOption[]}
  */
  const fetchFormulationModuleCoveredGroupOptions = computed(() => {
    let groupOptionsList = <SelectOption[]>[];
    const selectedGroups = selectedModuleCoveredGroups();
    formulationTabData.value?.module_groups.forEach((group) => {
      let option_data = {
        name: group,
        description: group,
        selected: false,
        groups: []
      };
      if (selectedGroups.includes(group)) option_data['selected'] = true;
      groupOptionsList.push(option_data);
    })
    return groupOptionsList;
  });

  /**
  * return hard coded list of sloth parameter type options
  * @returns {SelectOption[]}
  */
  const fetchFormulationSlothParameterTypeOptions = computed(() => {
    return [{
      name: 'integer',
      description: 'integer'
    }, {
      name: 'double',
      description: 'double'
    }]
  });

  /**
  * return hard coded list of sloth parameter unit options
  * @returns {SelectOption[]}
  */
  const fetchFormulationSlothParameterUnitOptions = computed(() => {
    return [{
      name: 'none',
      description: 'none'
    }, {
      name: 'm',
      description: 'm'
    }]
  });

  /**
  * return list of selected module options
  * @returns {SelectOption[]}
  */
  /**
 * return list of Module Options based on the filter selection
 * @returns {SelectOption[]}
 */
  const fetchSelectedFormulationModuleOptions = computed(() => {
    let modules_list = <SelectOption[]>[]
    selectedModuleValues.value.forEach((moduleName: string) => {
      modules_list.push({
        name: moduleName,
        description: moduleName,
        selected: false,
        groups: []
      });
    });

    return modules_list;
  })

  /**
  * add new sloth parameter with some default value
  * @param variable_name
  * @returns {void}
  */
  function addNewSlothVariable(variable_name: string): void {
    slothParameterInputs.value.push({
      "param_name": variable_name,
      "param_count": 1,
      "param_type": "",
      "param_units": "",
      "param_location": "node",
      "param_value": 0.0,
      "maps_to_module": "",
      "maps_to_variable_name": ""
    })
  }

  /**
  * delete sloth parameter matching sloth param name
  * @param variable_name
  * @returns {void}
  */
  function deleteSlothVariable(variable_name: string): void {
    slothParameterInputs.value = slothParameterInputs.value.filter(param => param.param_name !== variable_name)
  }

  /**
  * return save formulation tab response from the server
  * @returns {GeneralApiSaveResponse}
  */
  async function saveFormulationTabData() {
    const savePayload = ref<SaveFormulationTabPayload>({});

    savePayload.value.formulation_name = formulationNameInput.value ? formulationNameInput.value : "";
    savePayload.value.modules = selectedModuleValues.value.length > 0 ? selectedModuleValues.value : [];
    savePayload.value.sloth_parameters = slothParameterInputs.value.length > 0 ? slothParameterInputs.value : [];

    if (Object.keys(savePayload.value).length > 0) {
      const saveValidation = useCalibrationFormulationTabSaveValidate(savePayload.value);
      if (Object.keys(saveValidation.value).length > 0) {
        return Promise.resolve({
          _data: {
            message: "Unable to save formulation tab.",
            validation_errors: saveValidation.value,
            calibration_run_id: calibrationJobId.value,
            status: "error"
          },
          status: 400
        });
      } else {
        savePayload.value['calibration_run_id'] = calibrationJobId.value;
        savePayload.value['use_sloth'] = useSlothParameters.value;
        return await makeProtectedApiCall<GeneralApiSaveResponse>(`${ngencerfBaseUrl}/calibration/save_formulation_tab/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getAccessToken()}`,
            "Content-Type": 'application/json'
          },
          body: JSON.stringify(savePayload.value)
        });
      }
    } else {
      return Promise.resolve({
        _data: {
          message: "No formulation tab data to save.",
          validation_errors: { "Tab Error": ['Please update at least 1 field before saving.'] },
          calibration_run_id: calibrationJobId.value,
          status: "error"
        },
        status: 400
      });
    }
  }

  /**
  * @returns {void}
  */
  const resetUserSelectionFormulation = (): void => {
    setUserSelection();
  }

  useLogoutListen('logoutEvent', (evStr: string) => {
    if (evStr === "logout") {
      resetFormulationStore();
    }
  })

  /**
  * @return {void}
  */
  const resetFormulationStore = (): void => {
    formulationNameInput.value = "";
    selectedModuleValues.value = [];
    useSlothParameters.value = false;
    slothParameterInputs.value = [];
  }

  return {
    formulationTabData,
    filterGroup,
    useSlothParameters,
    selectedModuleValues,
    formulationNameInput,
    slothParameterInputs,
    fetchFormulationModuleOptions,
    fetchFormulationModuleCoveredGroupFilterOptions,
    fetchFormulationModuleCoveredGroupOptions,
    fetchFormulationSlothParameterTypeOptions,
    fetchFormulationSlothParameterUnitOptions,
    fetchSelectedFormulationModuleOptions,
    addNewSlothVariable,
    saveFormulationTabData,
    formulationStore_data_loading,
    resetUserSelectionFormulation,
    deleteSlothVariable,
    resetFormulationStore,
    loadFormulationTabStaticData
  }
},
  {
    persist: {
      storage: persistedState.sessionStorage
    },
  })

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormulationStore, import.meta.hot));
}