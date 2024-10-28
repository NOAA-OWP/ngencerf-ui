
/**
 * Checks if Hydrofabric errors exist in Tuning Tab static data
 * 
 * @param data - Tuning Tab static data
 * @returns {string}  Error message
 */
export const ifHydrofabricErrorsExist = (data: any): string => {
  if (data.hydrofabric_errors) {
    const hydrofabricErrorMessage = data.hydrofabric_errors.message;

    // if the error message is that the connection failed or timed out, we return a specific message
    if (hydrofabricErrorMessage && hydrofabricErrorMessage.includes('failed to connect or timed out')) {
      return 'Calibration setup can not be completed because Hydrofabric is unavailable.'
    }

    // we don't know what the error is, so we just return the message
    if (hydrofabricErrorMessage) {
      return hydrofabricErrorMessage;
    }
  }

  return '';
};