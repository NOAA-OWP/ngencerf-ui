import { DateTime } from "luxon";


/**
 * Checks if an object is a valid Date object
 * @param obj
 * @returns {boolean}
 */
export const isValidDate = (obj: any): boolean => {
  return obj && obj instanceof Date && !isNaN(obj.getTime());
};

/**
 * Checks if an object is a valid DateTime object
 * @param obj
 * @returns {boolean}
 */
export const isValidDateTime = (obj: any): boolean => {
  return obj && DateTime.isDateTime(obj) && obj.isValid;
};

/**
 * Checks if a variable is not null and not undefined
 * @param variable
 * @returns {boolean}
 */
export const isNotNullOrUndefined = (variable: any): boolean => {
  return variable !== null && variable !== undefined;
};

/**
 * Checks if Calibration job status is 'Saved' or 'Ready'
 * @param status
 * @returns {boolean}
 */
export const isCalibrationJobStatusSavedOrReady = (status?: string): boolean => {
  return status === 'Saved' || status === 'Ready';
};

/**
 * Check if Calibration job status is 'Done', 'Cancelled', 'Failed', or 'Server Error'
 * @param status
 * @returns {boolean}
 */
export const isCalibrationJobFinished = (status?: string): boolean => {
  return status === 'Done' || status === 'Cancelled' || status === 'Failed' || status === 'Server Error';
};
