export interface save_gage_tab_response {
  calibration_run_id: number,
  message: string,
  status: string,
  geopackage: string
}

export default defineEventHandler( async (event): Promise<save_gage_tab_response | undefined> => {
  const { gage_id, forcing_source, observational_source, calibration_run_id } = await readBody(event);
  console.log( `gage_id: ${gage_id}, forcing_source: ${forcing_source}, observational_source: ${observational_source}, calibration_run_id: ${calibration_run_id}`)
  return {
    message: `Calibration Run ${calibration_run_id} saved`,
    calibration_run_id: calibration_run_id,
    status: "saved",
    geopackage: ""
  }
})