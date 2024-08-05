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

export interface gage_data {
  calibration_run_id: Number,
  status: String,
  gage: {
    gage_Id: String,
    agency: String,
    station_name: String,
    latitude: Number,
    longitude: Number,
    altitude: Number
  },
  forcing_source: String,
  forcing_user_filename: String,
  gages: String[]
}

export interface gagetab_save {
    gage_id: String,
    forcing_source: String,
    forcing_user_filename: String,
    calibration_run_id: Number
}

export interface forumlation_save {
  calibration_run_id: Number,
  status: String,
  modules: module_data[],
  sloth_parameters: sloth_parameter_data,
  gages: String[]
}

export interface formulation_save {
    calibration_run_id: Number,
    formulation_name: String,
    modules: String[],
    sloth_parameters: sloth_parameter_data[]
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

export interface sloth_parameter_data {
  name: String,
  count: Number
  type: String,
  units: String,
  location: String,
  value: Number
  module: module_params[],
  module_param: String 
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

export interface Progress {
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
