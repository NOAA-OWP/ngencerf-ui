// @ts-check
import { defineStore, storeToRefs } from "pinia";

import type { SelectOption, CalibrationValidationRunData, ValidatedevaluationRunList, CalibrationValidationJobList, CalibrationRunValidationParameterData } from "@/composables/NgencerfModels";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { useBackendConfig } from "@/composables/UseBackendConfig";
import { makeProtectedApiCall } from "@/composables/UserAuth"
import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { fixFloatToFivePlaces } from "@/utils/CommonHelpers";

export const useEvaluationCalibrationRunStore = defineStore('EvaluationCalibrationRunStore', () => {
  const { calibrationJobId, evaluateValidationRunId, evaluateIterationRunId, evaluateValidationRunStatus } = storeToRefs(generalStore());
  const { fetchUserCalibrationRunData, clearUserCalibrationRunData, getAccessToken } = useUserDataStore();
  const evaluationRunList = ref<any[]>([]);
  const userSelectedEvalCalibrationRunId = ref<number>(0);
  const { ngencerfBaseUrl } = useBackendConfig();

  const uiCompareGageId = ref<string>("");
  const userSelectedEvalCalibrationRun = ref<any>();
  const loadCalibrationDataComplete = ref<boolean>(false);

  const { 
    modulesFilterList, 
    moduleOperator, 
    uiGageId, 
    uiGageList, 
    createdAtStart,
    createdAtEnd,
    minCreatedAt,
    maxCreatedAt,
    jobIdStart,
    jobIdEnd,
    minJobId,
    maxJobId,
    statusTypeFilterList,
    includeArchivedJobs
  } = storeToRefs(useUserDataStore());

  /**
   * list of calibration jobs with validation data
   */
  const userEvaluationRunListData = ref<ValidatedCalibrationRunListItem[]>([]);
  const evaluationRunListPageSize = ref<number>(50);
  const evaluationRunListCurrentPage = ref<number>(1);
  const evaluationRunListTotalPages = ref<number>(0);
  const evaluationRunListTotalSize = ref<number>(0);
  const evaluationRunListStartRow = ref<number>(1);
  const evaluationRunListEndRow = ref<number>(evaluationRunListPageSize.value);
  const evaluationRunListSort = ref<DynamicObject>({'field': 'calibration_run_id', 'direction': -1});
  /**
   * list of validation jobs of a selected calibration job id
   */
  const userSelectedCalibrationValidationRunList = ref<CalibrationValidationRunData[]>([]);

  const calibrationValidationRunListHeaders = ref<any[]>([]);
  const computedCalibrationValidationRunList = ref<CalibrationValidationJobData[]>([]);
  const displayCalibrationValidationRunList = ref<CalibrationValidationJobData[]>([]);

  const gageevaluationRunListHeaders = ref<any[]>([]);
  const computedGageCalibrationRunList = ref<CalibrationJobListItem[]>([]);

  const selectedCalibrationCompareRuns = ref<CalibrationJobListItem[]>([]);
  const selectedCalibrationModules = ref<string[] | undefined>([]);

  /**
  * @returns {SelectOption[]}
  */
  const evaluationCalibrationRunGageList = computed(() => {
    let gageOptionList = <SelectOption[]>[];
    gageOptionList.push({
      'name': "All",
      'description': "All"
    });
    userEvaluationRunListData.value.forEach(runItem => {
      const checkGageIndex = gageOptionList.findIndex(
        (gageOption) =>
          gageOption.name === runItem.gage_id
      ) !== -1;
      if (!checkGageIndex) {
        gageOptionList.push({
          'name': runItem.gage_id,
          'description': runItem.gage_id
        });
      }
    });
    return gageOptionList;
  });

  /**
  * @returns {SelectOption[]}
  */
  const compareCalibrationRunGageList = computed(() => {
    let gageOptionList = <SelectOption[]>[];
    evaluationCalibrationRunGageList.value.forEach(gage => {
      if (userEvaluationRunListData.value.filter((row) => (row as CalibrationJobListItem).gage_id === gage.name).length >= 2) {
        gageOptionList.push(gage);
      }
    });
    return gageOptionList;
  });

  /**
   * fetch user created calibration job list data
   * @return {void}
   */
  async function fetchUserValidatedCalibrationJobsListData() {
    let requestBody = {
      limit: evaluationRunListPageSize.value,
      offset: (evaluationRunListCurrentPage.value - 1) * evaluationRunListPageSize.value,
      sort: {
        field: evaluationRunListSort.value.field,
        direction: evaluationRunListSort.value.direction === -1 ? 'desc' : 'asc'
      },
      filters: {
        gage_id: uiGageId.value && uiGageId.value !== "All" ? uiGageId.value: "",
        module_filter: {
          modules: modulesFilterList.value,
          operator: moduleOperator.value === 'All' ? 'and' : 'or'
        },
        date_filter:
            (createdAtStart.value && createdAtEnd.value) ? {
              start_date: formatISOStringOrDateToYYYYMMDD(createdAtStart.value) + 'T00:00:00',
              end_date: formatISOStringOrDateToYYYYMMDD(createdAtEnd.value) + 'T23:59:59',
              operator: "between"
            } : createdAtStart.value ? {
              create_date: formatISOStringOrDateToYYYYMMDD(createdAtStart.value) + 'T00:00:00',
              operator: "after"
            } : createdAtEnd.value ? {
              create_date: formatISOStringOrDateToYYYYMMDD(createdAtEnd.value) + 'T23:59:59',
              operator: "before"
            } : {}
          ,
        id_filter:
          (jobIdStart.value && jobIdEnd.value) ? {
            start_id: jobIdStart.value,
            end_id: jobIdEnd.value,
            operator: "between"
          } : jobIdStart.value ? {
            id: jobIdStart.value,
            operator: "after"
          } : jobIdEnd.value ? {
            id: jobIdEnd.value,
            operator: "before"
          } : {}
        ,
        status: statusTypeFilterList.value,
        include_archived: includeArchivedJobs.value
      },
      get_gages: uiGageList.value.length === 0
    }
    const runListDataResult = await makeProtectedApiCall<ValidatedevaluationRunList>(`${ngencerfBaseUrl}/calibration/get_calibration_jobs_for_evaluation/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    userEvaluationRunListData.value = runListDataResult?._data?.jobs ?? [];

    if (userEvaluationRunListData.value && userEvaluationRunListData.value.length > 0) {
      userEvaluationRunListData.value.forEach((runItem: ValidatedCalibrationRunListItem) => {
        try {
          if (runItem.submit_date !== null) {
            if (runItem.status.toLowerCase() === 'done' && runItem.validations.length >= 1) {
              const validationControlJobStatus: string | undefined = runItem.validations?.find
                ((validation: CalibrationJobValidationItem) => validation.validation_type === 'valid_control')?.status;

              const validationBestJobStatus: string | undefined = runItem.validations?.find
                ((validation: CalibrationJobValidationItem) => validation.validation_type === 'valid_best')?.status;
              
              if (validationBestJobStatus && validationBestJobStatus.toLowerCase() === 'done') {
                // get the overall calibration/validation status
                const overallCalibrationValidationStatus: string = getOverallCalibrationValidationStatus(
                  runItem.status,
                  validationControlJobStatus,
                  validationBestJobStatus
                );
                
                runItem.status = overallCalibrationValidationStatus;
                // we don't need the control run as part of our list of validations - remove it before adding runItem to our list
                const filteredValidations = runItem.validations.filter(validation => validation.validation_type !== 'valid_control');
                runItem.validations = filteredValidations;
                runItem.validation_runs = filteredValidations.length;
                runItem.validation_run_ids = filteredValidations.map(validation => validation.validation_run_id);
              }
            }
          }
        } catch(err) {
          console.log('ERROR! ', err.message);
        }
      });
    }

    evaluationRunListTotalSize.value = runListDataResult?._data?.total_count ?? 0;
    evaluationRunListTotalPages.value = Math.ceil(evaluationRunListTotalSize.value / evaluationRunListPageSize.value);
    evaluationRunListStartRow.value = (evaluationRunListPageSize.value * (evaluationRunListCurrentPage.value - 1)) + 1;
    evaluationRunListEndRow.value = Math.min(evaluationRunListStartRow.value + (evaluationRunListPageSize.value - 1), evaluationRunListTotalSize.value);
    
    if (runListDataResult?._data?.gages) {
      uiGageList.value = runListDataResult?._data?.gages;
      uiGageList.value.sort();
    }
    if (runListDataResult?._data?.date_range && runListDataResult?._data?.date_range.length === 2) {
      minCreatedAt.value = runListDataResult?._data?.date_range[0];
      maxCreatedAt.value = runListDataResult?._data?.date_range[1];
    }
    if (runListDataResult?._data?.id_range && runListDataResult?._data?.id_range.length === 2) {
      minJobId.value = runListDataResult?._data?.id_range[0];
      maxJobId.value = runListDataResult?._data?.id_range[1];
    }
  }

  const fetchValidationRunListByCalibrationRun = async () => {
    const runListDataResult = await makeProtectedApiCall<CalibrationValidationJobList>(`${ngencerfBaseUrl}/calibration/get_validation_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: userSelectedEvalCalibrationRunId.value })
    });

    return runListDataResult._data?.validation_jobs as CalibrationValidationJobData[];
  }

  const fetchUserSelectedCalibrationValidationRunList = async () => {
    const runListDataResult = await makeProtectedApiCall<CalibrationValidationJobList>(`${ngencerfBaseUrl}/calibration/get_validation_jobs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: userSelectedEvalCalibrationRunId.value })
    });

    if (runListDataResult._data?.validation_jobs) {
      //if there is only 1 validation job, we automatically set the selected validation id to that validation job     
      if (runListDataResult._data?.validation_jobs.length === 1) {
        const defaultValidationJob = runListDataResult._data?.validation_jobs[0] as CalibrationValidationJobData;
        evaluateValidationRunId.value = defaultValidationJob.validation_run_id;
        evaluateValidationRunStatus.value = defaultValidationJob.status;
      }

      runListDataResult._data?.validation_jobs.forEach((validation_job: CalibrationValidationJobData) => {
        if (validation_job.best === true) {
          calibrationValidationRunListHeaders.value.push({ field: 'validation_run_id', header: "Validation Job ID" });
          calibrationValidationRunListHeaders.value.push({ field: 'iteration_num', header: "Iteration" });
          calibrationValidationRunListHeaders.value.push({ field: 'status', header: "Status" });
          calibrationValidationRunListHeaders.value.push({ field: 'submit_date', header: "Submit Date" });

          validation_job.parameters.forEach((parameter: CalibrationRunValidationParameterData) => {
            calibrationValidationRunListHeaders.value.push({ field: parameter.name, header: parameter.name });
          });
        }
        let rowData = <any>{};
        rowData['validation_run_id'] = validation_job.validation_run_id;
        rowData['iteration_num'] = (validation_job.best === true) ? validation_job.iteration_num.toString() + "*" : validation_job.iteration_num;
        rowData['status'] = validation_job.status;
        rowData['submit_date'] = formatISOStringOrDateToYYYYMMDDHHMM(validation_job.submit_date);
        validation_job.parameters.forEach((parameter: CalibrationRunValidationParameterData) => {
          rowData[parameter.name] = fixFloatToFivePlaces(parameter.value)
        });
        computedCalibrationValidationRunList.value.push(rowData);
      });
    }
  }
  const displayUserSelectedCalibrationValidationRunList = () => {
    computedCalibrationValidationRunList.value.forEach((validation: CalibrationValidationJobData) => {
      displayCalibrationValidationRunList.value.push(validation);
    }) 
  }
  
    /**
     * Get Calibration Plot Names for Comparison
     * @return {any}
     */
    const queryGetPlotNamesForComparison = async (): Promise<any> => {
      return makeProtectedApiCall<CalibrationPlotListNamesData>(`${ngencerfBaseUrl}/calibration/get_plot_names_for_comparison/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
          "Content-Type": 'application/json'
        },
      });
    };

  /**
   * Get Calibration Plots for Comparison
   * @return {any}
   */
  const queryGetPlotsForComparison = async (
    plotName: string,
    gage_id: string,
    start?: number,
    limit?: number
  ) => {
    const plotDataResult = await makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plots_for_comparison/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ 
        calibration_run_ids: selectedCalibrationCompareRuns.value.map(run => run.calibration_run_id),
        plot_name: plotName,
        gage_id: gage_id,
        start: start !== undefined ? start : 0,
        limit: limit !== undefined ? limit : 100
      })
    });
    return plotDataResult;
  };

  const setSelectedCalibrationRunId = (calibration_run_id: number): void => {
    userSelectedEvalCalibrationRunId.value = calibrationJobId.value = calibration_run_id;
  }

  /**
  * @returns {number}
  */
  const getValidationRunIdByCalibrationRunId = computed(() => {
    const find_validation_run = userEvaluationRunListData.value.filter((validation: ValidatedCalibrationRunListItem) => {
      return validation.calibration_run_id === calibrationJobId.value;
    });
    if (!find_validation_run) {
      return 0;
    } else {
      // make sure we actually has validation run
      const validation_run = find_validation_run.shift();
      return validation_run?.validation_run_ids[0] ?? 0;
    }
  });

  const loadSelectedCalibrationRun = async (calibration_run_id: number, include_gpkg_map: boolean = true) => {
    setSelectedCalibrationRunId(calibration_run_id);
    await fetchUserCalibrationRunData(include_gpkg_map);
  }

  const resetUserSelectedCalibrationValidationRunList = () => {
    userSelectedCalibrationValidationRunList.value = [];
  }

  const resetUserSelectedCalibrationCompareRunList = () => {
    userSelectedCalibrationCompareRunList.value = [];
  }

  /**
   * @returns {SelectOption[]}
   */
  const getReferenceDataSetOptions = computed(() => {
    let options = <SelectOption[]>[];
    if (userSelectedEvalCalibrationRunId.value > 0) {
      options.push({
        'name': 'nwm',
        'description': 'NWM v2.0 retrospective'
      })
    }
    return options;
  });

  /**
   * @return {void}
   */
  const resetUserSelectedEvalCalibrationRun = (): void => {
    userSelectedEvalCalibrationRunId.value = 0;
    userSelectedEvalCalibrationRun.value = undefined;
    loadCalibrationDataComplete.value = false;
    userSelectedCalibrationValidationRunList.value = [];
    resetUserSelectedEvalValidationRun();
    clearUserCalibrationRunData();
  }

  /**
   * @return {void}
   */
  const resetUserSelectedEvalValidationRun = (): void => {
    calibrationJobId.value = userSelectedEvalCalibrationRunId.value = evaluateIterationRunId.value = 0;
    evaluateValidationRunId.value = 0;
    calibrationValidationRunListHeaders.value = [];
    computedCalibrationValidationRunList.value = [];
    displayCalibrationValidationRunList.value = [];
    evaluateValidationRunStatus.value = '';
  }

  /**
   * @return {void}
   */
  const resetUserSelectedEvalCompareRun = (): void => {
    calibrationJobId.value = userSelectedEvalCalibrationRunId.value = evaluateIterationRunId.value = 0;
    computedGageCalibrationRunList.value = [];
  }

  /**
   * reset job filters
   */
  const resetFilters = () => {
    uiGageId.value = 'All';
    modulesFilterList.value = []; 
    moduleOperator.value = 'All';
    statusTypeFilterList.value = [];
    includeArchivedJobs.value = false;
    createdAtStart.value = null;
    createdAtEnd.value = null;
    minCreatedAt.value = null;
    maxCreatedAt.value = null;
    jobIdStart.value = null;
    jobIdEnd.value = null;
    minJobId.value = null;
    maxJobId.value = null;
  };

  useLogoutListen('logoutEvent', (evStr: string) => {
    if (evStr === "logout") {
      resetUserSelectedEvalCalibrationRun();
    }
  })

  return {
    uiCompareGageId,
    evaluationRunList,
    evaluationCalibrationRunGageList,
    compareCalibrationRunGageList,
    userSelectedEvalCalibrationRunId,
    loadCalibrationDataComplete,

    setSelectedCalibrationRunId,
    loadSelectedCalibrationRun,
    fetchUserValidatedCalibrationJobsListData,
    queryGetPlotNamesForComparison,
    queryGetPlotsForComparison,
    resetUserSelectedEvalCalibrationRun,
    getReferenceDataSetOptions,
    resetUserSelectedCalibrationValidationRunList,
    fetchUserSelectedCalibrationValidationRunList,
    displayUserSelectedCalibrationValidationRunList,
    resetUserSelectedCalibrationCompareRunList,
    resetUserSelectedEvalValidationRun,
    resetUserSelectedEvalCompareRun,
    clearUserCalibrationRunData,
    fetchValidationRunListByCalibrationRun,
    resetFilters,

    getValidationRunIdByCalibrationRunId,
    userEvaluationRunListData,
    evaluationRunListPageSize,
    evaluationRunListCurrentPage,
    evaluationRunListTotalPages,
    evaluationRunListTotalSize,
    evaluationRunListStartRow,
    evaluationRunListEndRow,
    evaluationRunListSort,
    calibrationValidationRunListHeaders,
    computedCalibrationValidationRunList,
    displayCalibrationValidationRunList,
    gageevaluationRunListHeaders,
    computedGageCalibrationRunList,
    selectedCalibrationCompareRuns,
    selectedCalibrationModules,
    evaluateValidationRunId,
    evaluateIterationRunId,
    evaluateValidationRunStatus,
    userSelectedEvalCalibrationRun,
    }
})

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationCalibrationRunStore, import.meta.hot));
}