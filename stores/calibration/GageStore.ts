// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { useUserDataStore } from "~/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { makeProtectedApiCall } from "~/composables/UserAuth"
import type { SelectOption, GageTabData, GeneralApiSaveResponse, GeneralErrorResponse, SaveGageTabResponse, SaveGageTabPayload } from "~/composables/NextGenModel";

export const useGageStore = defineStore('GageStore', () => {
  /**
  * ref section
  */
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const userDataStore = useUserDataStore();
  const { userCalibrationRunData } = storeToRefs(userDataStore);

  const domainOptionsList = ref<SelectOption[]>([]);
  const gageOptionsList = ref<SelectOption[]>([]);
  const isNWMv3 = ref<boolean>(false);

  const gageTabData = ref<GageTabData>();
  const geopackageImageUrl = ref<string>("");
  const selectedDomainValue = ref<string>("");
  const selectedGageValue = ref<string>("");
  const selectedForcingValue = ref<string>("");
  const selectedObservationalValue = ref<string>("");
  const selectedGeopackageValue = ref<string>("");
  const gageData = ref<GageData>();

  const gageStore_data_loading = ref<boolean>(true);

  // Restore state from sessionStorage if available
  if (typeof window !== 'undefined') {
    let ls;
    ls = sessionStorage.getItem('domainOptionsList');
    if (ls !== "undefined") { domainOptionsList.value = ls ? JSON.parse(ls) : [] }
    ls = sessionStorage.getItem('gageOptionsList');
    if (ls !== "undefined") { gageOptionsList.value = ls ? JSON.parse(ls) : [] }
    ls = sessionStorage.getItem('gageTabData');
    if (ls !== "undefined") { gageTabData.value = JSON.parse(ls as string) }
    ls = sessionStorage.getItem('gageData');
    if (ls !== "undefined") { gageData.value = JSON.parse(ls as string) }

    geopackageImageUrl.value = sessionStorage.getItem('geopackageImageUrl') as string;
    selectedDomainValue.value = sessionStorage.getItem('formulatselectedDomainValueionNameInput') as string;
    selectedGageValue.value = sessionStorage.getItem('selectedGageValue') as string;
    selectedForcingValue.value = sessionStorage.getItem('formuselectedForcingValuelationNameInput') as string;
    selectedObservationalValue.value = sessionStorage.getItem('selectedObservationalValue') as string;
    selectedGeopackageValue.value = sessionStorage.getItem('selectedGeopackageValue') as string;

    isNWMv3.value = sessionStorage.getItem('isNWMv3') as string === "true";
    gageStore_data_loading.value = sessionStorage.getItem('gageStore_data_loading') as string === "true";
    console.log("GageStore restored");
  }

  watch(domainOptionsList, (domainOptionsList) => { sessionStorage.setItem('domainOptionsList', JSON.stringify(domainOptionsList)); })
  watch(gageOptionsList, (gageOptionsList) => { sessionStorage.setItem('gageOptionsList', JSON.stringify(gageOptionsList)); })
  watch(gageTabData, (gageTabData) => { sessionStorage.setItem('gageTabData', JSON.stringify(gageTabData)); })
  watch(gageData, (gageData) => { sessionStorage.setItem('gageData', JSON.stringify(gageData)); })
  watch(geopackageImageUrl, (geopackageImageUrl) => { sessionStorage.setItem('geopackageImageUrl', geopackageImageUrl); })
  watch(selectedDomainValue, (selectedDomainValue) => { sessionStorage.setItem('selectedDomainValue', selectedDomainValue); })
  watch(selectedGageValue, (selectedGageValue) => { sessionStorage.setItem('selectedGageValue',selectedGageValue ); })
  watch(selectedForcingValue, (selectedForcingValue) => { sessionStorage.setItem('selectedForcingValue', selectedForcingValue); })
  watch(selectedObservationalValue, (selectedObservationalValue) => { sessionStorage.setItem('selectedObservationalValue',selectedObservationalValue ); })
  watch(isNWMv3, (isNWMv3) => { sessionStorage.setItem('isNWMv3', JSON.stringify(isNWMv3)); })
  watch(gageStore_data_loading, (gageStore_data_loading) => { sessionStorage.setItem('gageStore_data_loading', JSON.stringify(gageStore_data_loading)); })
  


  const loadGageTabStaticData = () => {
    gageStore_data_loading.value = true
    makeProtectedApiCall<GageTabData>(`${ngencerfBaseUrl}/calibration/load_gage_tab/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    })
      .then((gageTabDataResult) => {
        gageTabData.value = gageTabDataResult?._data ?? undefined
        gageStore_data_loading.value = false
        console.log('gageTabData', gageTabData.value)
        //init ui model value
        geopackageImageUrl.value = userCalibrationRunData.value?.geopackage_image_url ?? ""
        setUserSelection()
      })
  }
  /**
  * get iser se;ected domain name based on the selected gage
  * @returns {string}
  */
  const getSavedDomainValue = computed(() => {
    if (userCalibrationRunData.value?.gage == undefined || userCalibrationRunData.value?.gage.gage_id == "") {
      return ""
    } else {
      let selected_gage_item = gageTabData.value?.gages.find((gage_item) => gage_item.gage_id == userCalibrationRunData.value?.gage.gage_id)
      return selected_gage_item?.domain
    }
  })

  /**
  * return list of domain options for Select input
  * @returns {SelectOption[]}
  */
  const getDomainOptionsList = computed(() => {
    domainOptionsList.value = []
    gageTabData.value?.domain_values.forEach((domain_value) => {
      domainOptionsList.value.push({
        name: domain_value.name,
        description: domain_value.description,
        selected: false,
        groups: []
      })
    })

    return domainOptionsList.value
  })

  /**
  * generate list of gage option for Select input based on the domain value and nwm_v3 filter
  * @returns {SelectOption[]}
  */
  const getGageOptionsList = computed(() => {
    gageOptionsList.value = []
    gageTabData.value?.gages.forEach((gage_value) => {
      if (selectedDomainValue.value == "" || gage_value.domain == selectedDomainValue.value) {
        if ((isNWMv3.value && gage_value.nwm_v3_calibrated) || isNWMv3.value) {
          gageOptionsList.value.push({
            name: gage_value.gage_id,
            description: gage_value.gage_id,
            selected: false,
            groups: []
          })
        }
      }
    })

    return gageOptionsList.value
  })

  const getForcingOptionsList = computed(() => {
    return gageTabData.value?.forcing_source_values
  })

  const getObservationalOptionsList = computed(() => {
    return gageTabData.value?.observational_source_values
  })

  const getGeopackageOptionsList = computed(() => {
    return gageTabData.value?.geopackage_source_values
  })

  /**
  *  fetch gage data based on the selected gage value
  *  @returns {void}
  */
  async function fetchSelectedGageData(): Promise<void> {
    const selectedGageDataResponse = await makeProtectedApiCall<GageData>(`${ngencerfBaseUrl}/calibration/get_gage/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        gage_id: selectedGageValue.value
      })
    })
    gageData.value = selectedGageDataResponse?._data ?? undefined
  }

  /**
  * return saving gage tab response from the server
  * @returns {SaveGageTabResponse}
  */
  async function saveGageTabData() {
    let savePayload = <SaveGageTabPayload>({});
    if (selectedGageValue.value) savePayload['gage_id'] = selectedGageValue.value;
    if (selectedForcingValue.value) savePayload['forcing_source'] = selectedForcingValue.value;
    if (selectedObservationalValue.value) savePayload['observational_source'] = selectedObservationalValue.value;
    if (selectedGeopackageValue.value) savePayload['geopackage_source'] = selectedGeopackageValue.value;

    if (Object.keys(savePayload).length > 0 && savePayload.hasOwnProperty("gage_id")) {
      savePayload['calibration_run_id'] = calibrationJobId.value;

      const saveGageTabDataResponse = await makeProtectedApiCall<SaveGageTabResponse>(`${ngencerfBaseUrl}/calibration/save_gage_tab/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(savePayload)
      })

      geopackageImageUrl.value = saveGageTabDataResponse?._data?.geopackage_image_url ?? ""

      return saveGageTabDataResponse
    } else {
      return Promise.resolve({
        _data: {
          message: "Please select a Gage ID before saving.",
          calibration_run_id: calibrationJobId.value,
          status: "error"
        },
        status: 400
      });
    }
  }

  /**
  * 
  * @param formData 
  * @returns {GeneralApiSaveResponse | GeneralErrorResponse}
  */
  async function saveUserForcingFiles(formData: FormData) {
    const saveUserForcingFilesResponse = await makeProtectedApiCall<GeneralApiSaveResponse | GeneralErrorResponse>(`${ngencerfBaseUrl}/calibration/upload_forcing_data/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`
      },
      body: formData
    })

    return saveUserForcingFilesResponse
  }

  /**
  * 
  * @param formData 
  * @returns {GeneralApiSaveResponse | GeneralErrorResponse}
  */
  async function saveUserObservationalFile(formData: FormData) {
    const saveUserObservationalFilesResponse = await makeProtectedApiCall<GeneralApiSaveResponse | GeneralErrorResponse>(`${ngencerfBaseUrl}/calibration/upload_observational_data/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`
      },
      body: formData
    })

    return saveUserObservationalFilesResponse
  }

  async function saveUserGeopackageFile(formData: FormData) {
    formData.append('return_geopackage_url', String(true))
    const saveUserGeopackageFilesResponse = await makeProtectedApiCall<GeneralApiSaveResponse | GeneralErrorResponse>(`${ngencerfBaseUrl}/calibration/upload_geopackage_data/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`
      },
      body: formData
    })

    return saveUserGeopackageFilesResponse
  }

  /**
  * private function for setting ui reactive field
  * @returns {void}
  */
  const setUserSelection = (): void => {
    selectedDomainValue.value = getSavedDomainValue.value ?? ""
    selectedGageValue.value = userCalibrationRunData.value?.gage?.gage_id ?? ""
    selectedForcingValue.value = userCalibrationRunData.value?.forcing_source ?? ""
    selectedObservationalValue.value = userCalibrationRunData.value?.observational_source ?? ""
    selectedGeopackageValue.value = userCalibrationRunData.value?.geopackage_source ?? ""
    gageData.value = userCalibrationRunData.value?.gage ?? undefined
  }

  /**
  * @returns {void}
  */
  const resetUserSelectionGage = (): void => {
    if (userCalibrationRunData.value?.gage) {
      setUserSelection()
    } else {
      resetGageStore()
    }
  }

  useLogoutListen('logoutEvent', () => {
    resetGageStore();
  })

  /**
  * @returns {void}
  */
  const resetGageStore = (): void => {
    selectedDomainValue.value = "";
    selectedForcingValue.value = "";
    selectedGageValue.value = "";
    selectedObservationalValue.value = "";
    selectedGeopackageValue.value = ""
    gageData.value = undefined;
    geopackageImageUrl.value = "";
    console.log("Gage Store Reset");
  }

  return {
    selectedDomainValue,
    selectedForcingValue,
    selectedGageValue,
    selectedObservationalValue,
    getSavedDomainValue,
    selectedGeopackageValue,
    gageTabData,
    getDomainOptionsList,
    getGageOptionsList,
    getForcingOptionsList,
    getObservationalOptionsList,
    getGeopackageOptionsList,
    saveGageTabData,
    isNWMv3,
    fetchSelectedGageData,
    gageData,
    gageStore_data_loading,
    geopackageImageUrl,
    userCalibrationRunData,
    resetUserSelectionGage,
    saveUserForcingFiles,
    saveUserObservationalFile,
    saveUserGeopackageFile,
    resetGageStore,
    loadGageTabStaticData
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
  import.meta.hot.accept(acceptHMRUpdate(useGageStore, import.meta.hot));
}