const calibration_runs = [{
  "gage_id": "01123000",
  "forcing_source": "Upload",
  "forcing_hydrofabric_dir_path": null,
  "forcing_user_uploaded_dir_path": "/home/allan.yu/s3/ngwpc-dev/allan.yu/data/csv_basin_group1/Gage_01123000",
  "observational_source": "Upload",
  "observational_hydrofabric_file_path": null,
  "observational_user_uploaded_file_path": "/home/allan.yu/s3/ngwpc-dev/allan.yu/data/01123000_hourly_discharge.csv",
  "geopackage_source": "Upload",
  "geopackage_hydrofabric_file_path": null,
  "geopackage_user_uploaded_file_path": "/home/allan.yu/s3/ngwpc-dev/allan.yu/data/gauge_01123000.gpkg",
  "modules": [
      "Noah-OWP-Modular",
      "CFE-S",
      "T-Route"
  ],
  "formulation_name": "my-cfe-noah",
  "use_sloth": true,
  "sloth_parameters": [
      {
          "param_name": "sloth_ice_fraction_schaake",
          "param_count": 1,
          "param_type": "double",
          "param_units": "m",
          "param_location": "node",
          "param_value": 1.2,
          "maps_to_module": "CFE-S",
          "maps_to_variable_name": "ice_fraction_schaake"
      },
      {
          "param_name": "sloth_ice_fraction_xiananjiang",
          "param_count": 1,
          "param_type": "double",
          "param_units": "none",
          "param_location": "node",
          "param_value": 0.0,
          "maps_to_module": "CFE-S",
          "maps_to_variable_name": "ice_fraction_soil_fraction_xiananjiang"
      },
      {
          "param_name": "sloth_smp",
          "param_count": 1,
          "param_type": "double",
          "param_units": "none",
          "param_location": "node",
          "param_value": 0.0,
          "maps_to_module": "CFE-S",
          "maps_to_variable_name": "soil_moisture_profile"
      }
  ],
  "automatic_validation": true,
  "output_variable_to_calibrate": {
      "name": "QINSUR",
      "module": "Noah-OWP-Modular"
  },
  "calibration_times": {
      "calibration_start_time": "2018-01-01T00:00:00Z",
      "calibration_end_time": "2019-12-30T23:00:00Z",
      "simulation_start_time": "2017-12-31T00:00:00Z",
      "simulation_end_time": "2019-12-31T23:00:00Z"
  },
  "validation_times": {
      "validation_start_time": "2020-02-01T00:00:00Z",
      "validation_end_time": "2021-12-31T23:00:00Z",
      "simulation_start_time": "2020-01-31T00:00:00Z",
      "simulation_end_time": "2021-12-31T23:00:00Z"
  },
  "streamflow_threshold": 1.0,
  "peak_flow_threshold": 2.0,
  "parameters": [
      {
          "name": "MFSNO",
          "minimum": 1.234e-07,
          "maximum": 1.2545678912345,
          "initial_value": 1.24,
          "module": "Noah-OWP-Modular"
      },
      {
          "name": "CWPVT",
          "minimum": 120.1234,
          "maximum": 123.2345678912345,
          "initial_value": 123.1233,
          "module": "Noah-OWP-Modular"
      },
      {
          "name": "VCMX25",
          "minimum": 120.1234,
          "maximum": 123.2345678912345,
          "initial_value": 123.1233,
          "module": "Noah-OWP-Modular"
      }
  ],
  "objective_function": "KGE",
  "optimization_inputs": [
      {
          "name": "r",
          "value": 0.2
      }
  ],
  "optimization": "DDS",
  "save_plot_iteration_frequency": 5,
  "save_output_iteration": false,
  "stop_criteria": 2
}]

export default defineEventHandler( async ( event ) => {
  const { id } = await readBody(event);
  return calibration_runs.find( calibration_run => {
    calibration_run.gage_id == id;
  });
})
