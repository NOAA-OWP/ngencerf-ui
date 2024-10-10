export interface User {
  uid: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface FooterData {
  version: string;
  contact_email: string;
}

export interface CreatedCalibrationRun {
  message: string;
  calibration_run_id: number;
}

export interface GeneralApiSaveResponse {
  message: string;
  calibration_run_id: number;
  status: string;
}

export interface GeneralErrorResponse {
  response_type: string;
  message: string;
  validation_errors: ValidationErrorObject[];
}

export interface ValidationErrorObject {
  [key: string]: string
}

/**
 * model for calibration job list
 */
export interface JobsList {
  jobs: JobListItem[];
}

export interface JobListItem {
  calibration_run_id: number;
  gage_id: string;
  status: string;
  calibration_start_period: Date;
  calibration_end_period: Date;
  formulation_name: string;
  run_date: Date;
  owner: string;
}

/**
 * module for user input calibration tab data
 */
export interface UserCalibrationRunData {
  calibration_run_id: number;
  run_date: string; // e.g. "2024-09-13T05:50:22.334Z"
  gage: GageData;
  forcing_source: string;
  forcing_user_dir: string;
  forcing_dir_path: string;
  observational_source: string;
  observational_user_filename: string;
  observational_file_path: string;
  geopackage_source: string;
  external_data_status: ExternalDataStatus;
  geopackage_hydrofabric_file_path: string;
  geopackage_image_url: string;
  modules: string[];
  formulation_name: string;
  use_sloth: boolean;
  sloth_parameters: SlothParameterData[];
  automatic_validation: boolean;
  time_range: UserCalibrationRunTimeRangeData;
  calibration_times: UserCalibrationRunCalibrationTimesData;
  validation_times: UserCalibrationRunValidationTimesData;
  output_variable_to_calibrate: UserCalibrationRunOutputVariableToCalibrateData;
  parameters_selected: boolean;
  parameters: UserCalibrationRunParametersData[];
  objective_function: string;
  streamflow_threshold: number;
  peak_flow_threshold: number;
  optimization: string;
  optimization_inputs: UserCalibrationRunOptimizationInputData[];
  save_plot_iteration_frequency: number;
  save_output_iteration: boolean;
  stop_criteria: number;
  status: string;
}

export interface ExternalDataStatus {
  observational: boolean;
  forcing: boolean;
  geopackage: boolean;
}

export interface UserCalibrationRunTimeRangeData {
  start_time: string;
  end_time: string;
}

export interface UserCalibrationRunCalibrationTimesData {
  calibration_start_time: string;
  calibration_end_time: string;
  simulation_start_time: string;
  simulation_end_time: string;
}

export interface UserCalibrationRunValidationTimesData {
  validation_start_time: string;
  validation_end_time: string;
  simulation_start_time: string;
  simulation_end_time: string;
}

export interface UserCalibrationRunOutputVariableToCalibrateData {
  name: string;
  module: string;
}

export interface UserCalibrationRunParametersData {
  name: string;
  minimum: number;
  maximum: number;
  initial_value: number;
  module: string;
}

export interface UserCalibrationRunOptimizationInputData {
  name: string;
  value: number;
}

export interface SlothParameterData {
  param_name: string;
  param_count: number;
  param_type: string;
  param_units: string;
  param_location: string;
  param_value: number;
  maps_to_module: string;
  maps_to_variable_name: string;
}

/**
 * Model for Calibration's Headwater Basin Gage tab
 */
export interface GageTabData {
   status: string;
   calibration_run_id: number;
   forcing_source_values: ForcingSourceValueData[];
   observational_source_values: ObservationalSourceValueData[];
   geopackage_source_values: GeopackageSourceValueData[];
   gages: GageOptionData[];
   gage: GageData;
   geopackage_image_url: string;
   domain_values: DomainValueData[];
}

export interface GageOptionData {
  gage_id: string;
  nsw_id: string;
  domain: string;
  nwm_v3_calibrated: boolean;
}

export interface GageData {
  gage_id: string;
  agency: string;
  station_name: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface DomainValueData {
  name: string;
  description: string;
  is_active: boolean;
}

export interface ForcingSourceValueData {
  name: string;
  description: string;
  is_active: boolean;
}

export interface ObservationalSourceValueData {
  name: string;
  description: string;
  is_active: boolean;
}

export interface GeopackageSourceValueData {
  name: string;
  description: string;
}


export interface SaveGageTabResponse extends GeneralApiSaveResponse {
  geopackage_image: string;
}

/**
 * Model for Calibration's formulation tab
 */
export interface FormulationTabData {
  calibration_run_id: number;
  modules: FormulationModuleData[];
  status: string;
}

export interface FormulationModuleData {
  name: string;
  groups: string[];
  used_by_calibration_run: boolean;
}

export interface tuning_load {
  calibration_run_id: number;
  status: string;
  modules: module_data[];
  calibration_times: {
    calibration_start_time: string;
    calibration_end_time: string;
    simulation_start_time: string;
    simulation_end_time: string;
  }
  validation_times: {
    validation_start_time: string;
    validatoin_end_time: string;
    simulation_start_time: string;
    simulation_end_time: string;
  }
}

export interface tuning_save {
  calibration_run_id: number;
  automatic_valiation: boolean;
  output_variable_to_calibrate: {
    name: string;
    module: string;
  }
  module_output_variables: name_description_type[];
  parameters: module_params[];
  calibration_times: {
    calibration_start_time: string;
    calibration_end_time: string;
    simulation_start_time: string;
    simulation_end_time: string;
  }
  validation_times: {
    validation_start_time: string;
    validatoin_end_time: string;
    simulation_start_time: string;
    simulation_end_time: string;
  }
}

/**
 * mode for misc UI input field
 */
export interface SelectOption {
  name: string;
  description: string;
  selected?: boolean;
  groups: string[];
}

export interface module_data {
  name: string;
  groups: string[];
  parameters: module_params[];
  module_output_variables: module_params[];
}

export interface module_params {
  name: string;
  module: string;
  minimum: number;
  maximum: number;
  intial_value: 0;
}

export interface ModuleParameter {
  name: string;
  data_type: string;
  description: string;
  minimum: number;
  maximum: number;
  initial_value: number;
}

export interface SaveTuningTabParameter {
  name: string;
  minimum: number;
  maximum: number;
  initial_value: number;
  module: string;
}

export interface module_output {
  description: name_description_type[];
}

export interface name_description_type {
  name: string;
  description: string;
  data_type: string;
}

/**
 * Module for calibration's optimization tab
 */
export interface OptimizationTabData {
  calibration_run_id: number;
  status: string;
  metrics: OptimizationMetricData[];
  optimizations: OptimizationData[];
}

export interface OptimizationMetricData {
  name: string;
  description: string;
  is_active: boolean;
  categorical: boolean;
  event_based: boolean;
}

export interface OptimizationData {
  name: string;
  description: string;
  is_active: boolean;
  inputs: OptimizationDataInputData[];
}

export interface OptimizationDataInputData {
  name: string;
  description: string;
  data_type: string;
  is_active: boolean;
}

export interface CalibrationRun {
  runId: number;
  formulationName: string;
  headwaterBasinGage: string;
  runDate: string;
  calibrationPeriod: string;
  status: string;
}

export interface AlgorithmParameter {

}

export interface CalibrationTuningData {


}

/**
 * Model for Calibration Run Status tab
 */
export interface CalibrationRunStatusTabData {

}

export interface CalibrationStatus {
  message: string;
  calibration_run_id: number;
  status: string;
  errors: string[];
}

export interface CalibrationPlotListNamesData {
  calibration_run_id: number;
  plot_list: CalibrationPlotListData;
}

export interface CalibrationPlotListData extends SelectOption {
  filename: string;
}

/**
 * Event Bus Interface
 */
export type CalibrationButtonGroupClickEvent = {
  calibrationButtonSaveStart: string;
  calibrationButtonResetCancel: string;
  calibrationButtonPrev: string;
  calibrationButtonNext: string;
}

export type LogoutEvent = {
  logoutEvent: string;
}

export type AccountEvent = {
  accountEvent: string;
}

export const ValidationFormFields = {
  formulation_name: "Formulation Name",
  modules: "Formulation Modules",
  sloth_parameters: "Sloth Parameters",
  maps_to_module: "Sloth Parameter For Module",
  maps_to_variable_name: "Sloth Parameter Module Param",
  param_type: "Sloth Parameter Type",
  param_units: "Sloth Parameter Units",
  stop_criteria: "Stop Criteria",
  save_plot_iteration_frequency: "Plot Generation Frequency",
  streamflow_threshold: "Flow Threshold",
  peak_flow_threshold: "Peak Flow Threshold",
  objective_function: "Objective Function",
  optimization: "Optimization Algorithm"
}