const validated_calibration_runs = [
  {
    "run_date": "2024-08-02T05:04:06.648Z",
    "validation_id": 1,
    "calibration_run_id": 10,
    "validation_start": "2024-08-02T05:04:06.648Z",
    "validation_end": "2024-08-02T05:04:06.648Z"
  },
  {
    "run_date": "2024-08-02T05:04:06.648Z",
    "validation_id": 2,
    "calibration_run_id": 10,
    "validation_start": "2024-08-02T05:04:06.648Z",
    "validation_end": "2024-08-02T05:04:06.648Z"
  },
  {
    "run_date": "2024-08-02T05:04:06.648Z",
    "validation_id": 3,
    "calibration_run_id": 10,
    "validation_start": "2024-08-02T05:04:06.648Z",
    "validation_end": "2024-08-02T05:04:06.648Z"
  },
  {
    "run_date": "2024-08-02T05:04:06.648Z",
    "validation_id": 1,
    "calibration_run_id": 77,
    "validation_start": "2024-08-02T05:04:06.648Z",
    "validation_end": "2024-08-02T05:04:06.648Z"
  },
  {
    "run_date": "2024-08-02T05:04:06.648Z",
    "validation_id": 2,
    "calibration_run_id": 77,
    "validation_start": "2024-08-02T05:04:06.648Z",
    "validation_end": "2024-08-02T05:04:06.648Z"
  }
];

export default defineEventHandler( async ( event ) => {
  const { calibration_run_id } = await readBody(event);
  const filtered_validated_calibration_runs = validated_calibration_runs.filter( calibration_run => calibration_run.calibration_run_id === calibration_run_id )
  return filtered_validated_calibration_runs;
});