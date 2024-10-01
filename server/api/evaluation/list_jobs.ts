const evaluation_jobs = [
  {
    "run_date": "2024-08-02T05:04:06.648Z",
    "formulation_name": "cfe-x",
    "calibration_run_id": 10,
    "gage_id": "1123000",
    "objective_function": "KGE",
    "optimization": "DDS",
    "validation_runs": "3"
  },
  {
    "run_date": "2024-06-23T05:04:06.648Z",
    "formulation_name": "cfe_noah",
    "calibration_run_id": 25,
    "gage_id": "1123000",
    "objective_function": "KGE",
    "optimization": "DDS",
    "validation_runs": ""
  },
  {
    "run_date": "2024-06-23T05:04:06.648Z",
    "formulation_name": "cfe_noah",
    "calibration_run_id": 77,
    "gage_id": "1010101",
    "objective_function": "KGE",
    "optimization": "DDS",
    "validation_runs": "2"
  },
  {
    "run_date": "2024-06-23T05:04:06.648Z",
    "formulation_name": "cfe_noah",
    "calibration_run_id": 120,
    "gage_id": "1123000",
    "objective_function": "KGE",
    "optimization": "DDS",
    "validation_runs": ""
  },
  {
    "run_date": "2024-06-23T05:04:06.648Z",
    "formulation_name": "lsam_noah_sft",
    "calibration_run_id": 121,
    "gage_id": "1123000",
    "objective_function": "KGE",
    "optimization": "DDS",
    "validation_runs": "3"
  },
  {
    "run_date": "2024-06-23T05:04:06.648Z",
    "formulation_name": "cfe_noah_sft",
    "calibration_run_id": 132,
    "gage_id": "1123000",
    "objective_function": "KGE",
    "optimization": "DDS",
    "validation_runs": "1"
  },
  {
    "run_date": "2024-06-23T05:04:06.648Z",
    "formulation_name": "cfe_noah_sft",
    "calibration_run_id": 135,
    "gage_id": "1123000",
    "objective_function": "KGE",
    "optimization": "DDS",
    "validation_runs": ""
  },
  {
    "run_date": "2024-06-23T05:04:06.648Z",
    "formulation_name": "topmodel_noah",
    "calibration_run_id": 136,
    "gage_id": "1123000",
    "objective_function": "KGE",
    "optimization": "DDS",
    "validation_runs": ""
  },
  {
    "run_date": "2024-06-23T05:04:06.648Z",
    "formulation_name": "topmodel_noah",
    "calibration_run_id": 140,
    "gage_id": "1123000",
    "objective_function": "KGE",
    "optimization": "DDS",
    "validation_runs": ""
  }
];

export default defineEventHandler( () => {
  return evaluation_jobs
})