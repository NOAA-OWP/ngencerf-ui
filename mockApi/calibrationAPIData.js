export const mockCalibrationTuningData = () => {
  return [
    {
      parameter: "soil_param_depth",
      min: 1.00,
      max: 4.00,
      initValue: 2.10
    },
    {
      parameter: "alpha_fc",
      min: 0.00,
      max: 1.00,
      initValue: 0.35
    },
    {
      parameter: "Cgw",
      min: 0.00,
      max: 1.00,
      initValue: 0.0049999988842212
    },
    {
      parameter: "soil_param_depth",
      min: 1.00,
      max: 4.00,
      initValue: 2.10
    },
    {
      parameter: "alpha_fc",
      min: 0.00,
      max: 1.00,
      initValue: 0.35
    },
    {
      parameter: "Cgw",
      min: 0.00,
      max: 1.00,
      initValue: 0.0049999988842212
    }
  ]
}

export const mockAlogorithmParameterData = () => {
  return [
    {
      parameter: "r",
      initValue: 2000
    },
    {
      parameter: "r",
      initValue: 2000
    },
    {
      parameter: "r",
      initValue: 2000
    },
    {
      parameter: "r",
      initValue: 2000
    },
    {
      parameter: "r",
      initValue: 2000
    },
    {
      parameter: "r",
      initValue: 2000
    },
  ]
}

export const mockRunStatusMetricData = () => {
  return [
    {
      metric: 'RMSE'
    },
    {
      metric: 'PBIAS'
    }
  ]
}

export const mockRunStatusDependentInputData = () => {
  return [
    {
      name: 'root',
      value: 'true'
    }
  ]
}

export const mockedJobListItemData= () => {
  return [
    {
      "run_date": "2024-08-02T05:04:06.648Z",
      "formulation_name": "cfe-x",
      "calibration_run_id": 10,
      "gage_id": "1010101",
      "status": "saved",
      "calibration_start_period": "2024-08-02T05:04:06.648Z",
      "calibration_end_period": "2024-08-02T05:04:06.648Z"
    },
    {
      "run_date": "2024-06-23T05:04:06.648Z",
      "formulation_name": "cfe_noah",
      "calibration_run_id": 25,
      "gage_id": "1123000",
      "status": "saved",
      "calibration_start_period": "2024-08-02T05:04:06.648Z",
      "calibration_end_period": "2024-08-02T05:04:06.648Z"
    },
    {
      "run_date": "2024-06-23T05:04:06.648Z",
      "formulation_name": "cfe_noah",
      "calibration_run_id": 77,
      "gage_id": "1123000",
      "status": "saved",
      "calibration_start_period": "2024-08-02T05:04:06.648Z",
      "calibration_end_period": "2024-08-02T05:04:06.648Z"
    },
    {
      "run_date": "2024-06-23T05:04:06.648Z",
      "formulation_name": "cfe_noah",
      "calibration_run_id": 120,
      "gage_id": "1123000",
      "status": "saved",
      "calibration_start_period": "2024-08-02T05:04:06.648Z",
      "calibration_end_period": "2024-08-02T05:04:06.648Z"
    },
    {
      "run_date": "2024-06-23T05:04:06.648Z",
      "formulation_name": "lsam_noah_sft",
      "calibration_run_id": 121,
      "gage_id": "1123000",
      "status": "saved",
      "calibration_start_period": "2024-08-02T05:04:06.648Z",
      "calibration_end_period": "2024-08-02T05:04:06.648Z"
    },
    {
      "run_date": "2024-06-23T05:04:06.648Z",
      "formulation_name": "cfe_noah_sft",
      "calibration_run_id": 132,
      "gage_id": "1123000",
      "status": "saved",
      "calibration_start_period": "2024-08-02T05:04:06.648Z",
      "calibration_end_period": "2024-08-02T05:04:06.648Z"
    },
    {
      "run_date": "2024-06-23T05:04:06.648Z",
      "formulation_name": "cfe_noah_sft",
      "calibration_run_id": 135,
      "gage_id": "1123000",
      "status": "failed",
      "calibration_start_period": "2024-08-02T05:04:06.648Z",
      "calibration_end_period": "2024-08-02T05:04:06.648Z"
    },
    {
      "run_date": "2024-06-23T05:04:06.648Z",
      "formulation_name": "topmodel_noah",
      "calibration_run_id": 136,
      "gage_id": "1123000",
      "status": "saved",
      "calibration_start_period": "2024-08-02T05:04:06.648Z",
      "calibration_end_period": "2024-08-02T05:04:06.648Z"
    },
    {
      "run_date": "2024-06-23T05:04:06.648Z",
      "formulation_name": "topmodel_noah",
      "calibration_run_id": 140,
      "gage_id": "1123000",
      "status": "ready",
      "calibration_start_period": "2024-08-02T05:04:06.648Z",
      "calibration_end_period": "2024-08-02T05:04:06.648Z"
    }
  ]
}