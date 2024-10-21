import { DateTime } from "luxon";


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
 * @param var
 * @returns {boolean}
 */
export const isNotNullOrUndefined = (variable: any): boolean => {
  return variable !== null && variable !== undefined;
};
