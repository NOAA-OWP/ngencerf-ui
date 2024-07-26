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
    }
  ]
}