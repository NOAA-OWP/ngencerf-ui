export interface user {
  uid: number,
  first_name: string,
  last_name: string,
  email: string,
}

export interface created_calibration_run {
  message: String,
  calibration_run_id: Number
}

export interface jobs_list {
  job_list_items: job_list_item[]
}

export interface job_list_item {
    run_date: String,
    formulation_name: String,
    calibration_run_id: Number,
    gage_id: String,
    status: string,
    calibration_start_period: String,
    calibration_end_period: String,
}

export interface footer_data {
  version: String,
  contact_email: String
}

export interface gage_option_data {
  gage_id: string,
  nsw_id: string,
  domain: string
  nwm_v3_calibrated: boolean
}

export interface gage_tab_data {
  status: string,
  calibration_run_id: number,
  forcing_source: string,
  observational_source: string,
  forcing_user_dir: string,
  forcing_source_values: forcing_source_value_data,
  observational_source_values: observational_source_value_data,
  observational_user_filename: string,
  gages: gage_option_data[]  
  gage: gage_data,
  domain_values: domain_value_data []
}

export interface gage_data {
  gage_id: string,
  agency: String,
  station_name: String,
  latitude: Number,
  longitude: Number,
  altitude: Number
}

export interface domain_value_data {
  name: string,
  description: string,
  is_active: true
}

export interface forcing_source_value_data {
  name: string,
  description: string,
  is_active: boolean
}

export interface observational_source_value_data {
  name: string,
  description: string,
  is_active: boolean
}

export interface save_gage_tab_payload {
   gage_id: String,
   forcing_source: String,
   forcing_user_filename: String,
   calibration_run_id: Number
}

export interface save_gage_tab_response {
  message: string,
  calibration_run_id: number,
  status: string,
  geopackage_image: string
}

/**
 * Model for Calibration's formulation tab
 */
export interface formulation_tab_data {
   calibration_run_id: number,
   formulation_name: string,
   modules: formulation_module_data[],
   use_sloth: boolean,
   sloth_parameters: sloth_parameter_data[],
   status: string
}

export interface formulation_module_data {
   name: string,
   groups: string[],
   used_by_calibration_run: boolean
}

export interface formulation_save {
   calibration_run_id: number,
   formulation_name: string,
   modules: string[],
   use_sloth: boolean,
   sloth_parameters: sloth_parameter_data[]
}

export interface formulation_save_response {
  message: string,
  calibration_run_id: number,
  status: string,
}

export interface tuning_load {

   calibration_run_id: Number,
   status: String,
   modules: module_data[],
   calibration_times: {
      calibration_start_time: String,
      calibration_end_time: String,
      simulation_start_time: String,
      simulation_end_time: String
   },
   validation_times: {
      validation_start_time: String,
      validatoin_end_time: String,
      simulation_start_time: String,
      simulation_end_time: String
   }
}

export interface tuning_save {
    calibration_run_id: Number,
    automatic_valiation: Boolean,
    output_variable_to_calibrate: {
      name: String,
      module: String
    },
    module_output_variables: name_description_type[],
    parameters: module_params[],
    calibration_times: {
      calibration_start_time: String,
      calibration_end_time: String,
      simulation_start_time: String,
      simulation_end_time: String
    },
    validation_times: {
      validation_start_time: String,
      validatoin_end_time: String,
      simulation_start_time: String,
      simulation_end_time: String
    }
}

export interface domain_gage_options {
  domain_value: string,
  gages: string[]
}

export interface select_option {
  name: string,
  description: string
  selected?: boolean
}

export interface sloth_parameter_data {
  param_name: string,
  param_count: number
  param_type: string,
  param_units: string,
  param_location: string,
  param_value: number
  maps_to_module: string,
  maps_to_variable_name: string
}

export interface module_data { 
    name: String,
    groups: String[],
    parameters: module_params[],
    module_output_variables:  module_params[]
}

export interface module_params {
    name: String,
    module: String,
    minimum: Number,
    maximum: Number,
    intial_value: 0
}

export interface module_output {
  description: name_description_type[]
}

export interface name_description_type {
  name: String,
  description: String,
  data_type: String
}

export interface optimization_tab_data {
  calibration_run_id: number,
  status: string,
  streamflow_threshold: number,
  peak_flow_threshold: number,
  metrics: optimization_metric_data[],
  optimization: string,
  optimization_inputs: optimization_input_data[],
  objective_function: string,
  optimizations: optimization_data[],
  plot_frequency: number,
  stop_criteria: string
}

export interface optimization_metric_data {
  name: string,
  description: string,
  is_active: boolean,
  categorical: boolean,
  event_based: boolean
}

export interface optimization_input_data {
  name: string,
  value: number
}

export interface optimization_data {
  name: string,
  description: string,
  is_active: boolean,
  inputs: optimization_data_input_data[]
}

export interface optimization_data_input_data {
  name: string,
  description: string,
  data_type: string,
  is_active: boolean
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
  runId: number,
  formulationName: String,
  headwaterBasinGage: String,
  runDate: String,
  calibrationPeriod: String,
  status: String
}

export interface AlgorithmParameter {

}

export interface CalibrationTuningData {
  
}
