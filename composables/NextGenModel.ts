export interface user {
   uid: number,
   first_name: string,
   last_name: string,
   email: string
}

export interface footer_data {
   version: String,
   contact_email: String
 }

export interface CeatedCalibrationRun {
   message: string;
   calibration_run_id: number;
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
   gage: GageData;
   forcing_source: string;
   forcing_user_dir: string;
   forcing_dir_path: string;
   observational_source: string;
   observational_user_filename: string;
   observational_file_path: string;
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
   parameters: UserCalibrationRunParametersData[];
   objective_function: string;
   streamflow_threshold: number;
   peak_flow_threshold: number;
   optimization: string;
   optimization_inputs: OptimizationInputData[];
   plot_frequency: number;
   stop_criteria: number;
   status: string;
}

export interface UserCalibrationRunTimeRangeData {
   start_time: Date;
   end_time: Date;
}

export interface UserCalibrationRunCalibrationTimesData {
   calibration_start_time: Date;
   calibration_end_time: Date;
   simulation_start_time: Date;
   simulation_end_time: Date;
}

export interface UserCalibrationRunValidationTimesData {
   validation_start_time: Date;
   validation_end_time: Date;
   simulation_start_time: Date;
   simulation_end_time: Date;
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
   forcing_source_values: ForcingSourceValueData;
   observational_source_values: ObservationalSourceValueData;
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

export interface SaveGageTabResponse {
   message: string;
   calibration_run_id: number;
   status: string;
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

export interface FormulationSaveResponse {
  message: string;
  calibration_run_id: number;
  status: string;
}

export interface LoadTuningTabResponse {
  calibration_run_id: Number;
  modules: ModuleData[];
  status: String;
}

export interface SaveTuningTabRequestBody {
  calibration_run_id: Number;
  parameters: SaveTuningTabParameter[];
  calibration_times: CalibrationTimes;
  validation_times: ValidationTimes;
  automatic_validation: Boolean;
  output_variable_to_calibrate: {
    name: String;
    module: String;
  }
}

export interface SaveTuningTabResponse {
  message: String;
  calibration_run_id: Number;
  status: String;
}

/**
 * mode for misc UI input field
 */
export interface SelectOption {
  name: string;
  description: string;
  selected?: boolean;
}

export interface ModuleData { 
    name: String,
    parameters: ModuleParameter[];
    output_variables:  OutputVariable; // TODO: will we receive one or multiple output variables?
}

export interface OutputVariable {
  name: String;
  module: String;
}

export interface ModuleParameter {
  name: String;
  data_type: String;
  description: String
  minimum: Number;
  maximum: Number;
  initial_value: Number;
}

export interface SaveTuningTabParameter {
  name: String;
  minimum: Number;
  maximum: Number;
  initial_value: Number;
  module: String;
}

export interface module_output {
  description: name_description_type[]
}

export interface name_description_type {
  name: String,
  description: String,
  data_type: String
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

export interface OptimizationInputData {
   name: string;
   value: number;
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

export interface CalibrationProgress {
  headwater_basin_gage: Boolean;
  formulation: Boolean;
  start_and_end_times: Boolean;
  calibration_output_variable: Boolean;
  tuning_parameters: Boolean;
  optimization_algorithm: Boolean;
  objective_function: Boolean;
  calibration_stop_criteria: Boolean;
  metrics_plot_inteval: Boolean;
}

export interface EvaluationProgress {
  headwater_basin_gage: Boolean;
  formulation: Boolean;
  parameters_set: Boolean;
  calibration_output_variable: Boolean;
  metrics: Boolean;
  time_period: Boolean;
  output_variable: Boolean;
  reference_dataset: Boolean;
}

// export interface GageData {
//   agency: String;
//   station_name: String;
//   site_type: String;
//   latitude: String;
//   longitude: String;
//   altitude: String;
//   date_established:  String;
//   drainage_area: String;
//   huc:  String;  
// }

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

export interface CalibrationTimes {
  calibration_start_time: string;
  calibration_end_time: string;
  simulation_start_time: string;
  simulation_end_time: string;
}

export interface ValidationTimes {
  validation_start_time: string;
  validation_end_time: string;
  simulation_start_time: string;
  simulation_end_time: string;
}