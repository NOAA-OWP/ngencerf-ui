export interface create_calibration_run_response {
  message: string,
  calibration_run_id: number
}

export default defineEventHandler( async (event): Promise<create_calibration_run_response | undefined> => {
  return {
    message: "Calibration Run 6 created",
    calibration_run_id: 6
  }
})