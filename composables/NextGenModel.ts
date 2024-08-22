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
  nmnv3_calibrated_gage: boolean
}

export interface gage_data {
  calibration_run_id: Number,
  status: String,
  domain_source: string,
  gage: gage,
  forcing_user_dir: string,
  forcing_source: string,
  forcing_user_filename: String,
  observational_dir: string,
  observational_source: string,
  observational_user_filename: string,
  domain_values: string [],
  gages: gage_option_data[],
  forcing_values: select_option[],
  observational_values: select_option[]
}

export interface gage {
  gage_id: string,
  agency: String,
  station_name: String,
  latitude: Number,
  longitude: Number,
  altitude: Number
}

export interface gagetab_save {
   gage_id: String,
   forcing_source: String,
   forcing_user_filename: String,
   calibration_run_id: Number
}

/**
 * Model for Calibration's formulation tab
 */
export interface formulation_tab_data {
   calibration_run_id: number,
   formulation_name: string,
   module_sources: string[],
   modules: formulation_module_data[],
   use_sloth: boolean,
   sloth_parameters: sloth_parameter_data[],
   status: string
}

export interface formulation_module_data {
   name: string,
   groups: string[]
}

export interface formulation_save {
   calibration_run_id: number,
   formulation_name: string,
   modules: string[],
   use_sloth: boolean,
   sloth_parameters: sloth_parameter_data[]
}

export interface load_tuning_tab_response {
  calibration_run_id: Number,
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
  },
  automatic_valiation: Boolean,
  output_variable_to_calibrate: {
    name: String,
    module: String
  },
  time_range?: {
    start_time: String,
    end_time: String
  },
  modules: module_data[],
  status: String
}

export interface save_tuning_tab_request_body {
  calibration_run_id: Number,
  parameters: save_tuning_tab_parameter[],
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
  },
  automatic_valiation: Boolean,
  output_variable_to_calibrate: {
    name: String,
    module: String
  }
}

export interface save_tuning_tab_response {
  message: String,
  calibration_run_id: Number,
  status: String
}

export interface domain_gage_options {
  domain_value: string,
  gages: string[]
}

export interface select_option {
  name: string,
  code: string
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
    parameters: module_params[],
    output_variables:  output_variable[]
}

export interface output_variable {
  name: String,
  module: String
}

export interface module_params {
  name: String,
  data_type: String,
  description: String,
  minimum: Number,
  maximum: Number,
  initial_value: Number
}

export interface save_tuning_tab_parameter {
  name: String,
  minimum: Number,
  maximum: Number,
  initial_value: Number
  module: String
}

export interface module_output {
  description: name_description_type[]
}

export interface name_description_type {
  name: String,
  description: String,
  data_type: String
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

export interface GageData {
  agency: String;
  station_name: String;
  site_type: String;
  latitude: String;
  longitude: String;
  altitude: String;
  date_established:  String;
  drainage_area: String;
  huc:  String;  
}

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
