import { DateTime } from "luxon";


/**
 * Checks if an object is a valid DateTime object
 * @param obj
 * @returns {boolean}
 */
export const isValidDateTime = (obj: any): boolean => {
  return obj && DateTime.isDateTime(obj) && obj.isValid;
};
