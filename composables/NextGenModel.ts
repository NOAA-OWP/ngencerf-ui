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
  formulationName: string,
  headwaterBasinGage: string,
  runDate: string,
  calibrationPeriod: string,
  status: string
}

export interface SlothParameter {
  outputVar: string,
  metadata: string,
  module: string,
  moduleParam: string,
  value: number
}