export interface save_formulation_tab_response {
  calibration_run_id: number,
  message: string,
  status: string,
}

export default defineEventHandler( async (event): Promise<save_formulation_tab_response | undefined> => {
  const { calibration_run_id, formulation_name } = await readBody(event);
  console.log( `calibration_run_id: ${calibration_run_id}, formulation_name: ${formulation_name}`)
  return {
    message: `Calibration Run ${calibration_run_id} saved`,
    calibration_run_id: calibration_run_id,
    status: "saved"
  }
})