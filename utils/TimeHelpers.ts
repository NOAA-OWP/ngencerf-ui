import { DateTime, Duration } from "luxon";


/**
 * Converts a string in ISO format or a Date object to a string in the format "yyyy-MM-dd HH:mm"
 * @param d 
 * @returns {string} string in the format "yyyy-MM-dd HH:mm"
 */
export const formatDateForDisplay = ( d: string | Date ): string => {
  let dateTime;

  // Check if the input is already in 'yyyy-MM-dd HH:mm' format
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(d)) {
    // If it's already in 'yyyy-MM-dd HH:00' format, return it directly
    return d;
  }

  // Handle ISO format strings or Date objects
  if (typeof d === 'string') {
    // Check if the string is in ISO format and parse it
    dateTime = DateTime.fromISO(d, { zone: 'utc' });
  } else {
    // Convert Date object to Luxon DateTime in UTC
    dateTime = DateTime.fromJSDate(d, { zone: 'utc' });
  }

  // Return the formatted date in 'yyyy-MM-dd HH:mm' format
  return dateTime.toFormat('yyyy-MM-dd HH:mm');
};

/**
 * Converts a Date object to a string in the format "MM-dd yyyy 'at' HH:mm:ss 'UTC'"
 * @param d
 * @returns {string} string in the format "MM-dd yyyy 'at' HH:mm:ss 'UTC'"
 */
export const formatDateForRunOnString = (d: Date): string => {
  const dateTime = DateTime.fromJSDate(d, { zone: 'utc' });
  return dateTime.toFormat("MM-dd yyyy 'at' HH:mm:ss 'UTC'");
};

/**
 * Takes a date object and converts it to a string in the specified timezone format
 * @param date
 * @param locale 
 * @returns string in the format "Sep 8, 2024 14:10:43"
 */
export const convertTimeZone = (date: Date, locale: string = 'en-US'): string => {
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });  
};

/**
 * This function is for creating a time range that encompasses the calibration and simulation times for testing
 * Currently set to pad the range by one month before and after
 * @param calibration_start_time
 * @param calibration_end_time
 * @param simulation_start_time
 * @param simulation_end_time
 * @returns {time_range} object with rangeStart and rangeEnd in ISO format
 */
export function calculateTimeRange(
  calibration_start_time: string,
  calibration_end_time: string,
  simulation_start_time: string,
  simulation_end_time: string
): { rangeStart: string; rangeEnd: string } {
  const startDates = [
    DateTime.fromISO(calibration_start_time),
    DateTime.fromISO(simulation_start_time),
  ];

  const endDates = [
    DateTime.fromISO(calibration_end_time),
    DateTime.fromISO(simulation_end_time),
  ];

  const minDate = DateTime.min(...startDates);
  const maxDate = DateTime.max(...endDates);

  // pad the range by one month before and after
  const paddedStart = minDate.minus({ months: 1 });
  const paddedEnd = maxDate.plus({ months: 1 });

  // convert a DateTime object to a string in ISO format
  const formatDate = (date: any): string => date.toISO();

  const rangeStart = formatDate(paddedStart);
  const rangeEnd = formatDate(paddedEnd);

  return { rangeStart, rangeEnd };
};

/**
 * Calculates the elapsed time between two Date objects
 * @param start_time Date object representing the start time
 * @param end_time Date object representing the end time
 * @returns {string} string of the elapsed time in 'd 'Days,' hh:mm:ss' format
 */
export function calculateElapsedTime(start_time: Date, end_time: Date): string {
  const start = DateTime.fromJSDate(start_time);
  const end = DateTime.fromJSDate(end_time);
  const diff = end.diff(start, ["days", "hours", "minutes", "seconds"]);
  
  return diff.toFormat("d 'Days,' hh:mm:ss");
};

/**
 * Format string representation of a Duration object from format 'hh:mm:ss.sss' to 'd 'Days,' hh:mm:ss'
 * @param elapsed_time string representation of a Duration object in the format 'hh:mm:ss.sss'
 * @returns {string} string representation of a Duration object in the format 'd 'Days,' hh:mm:ss'
 */
export function formatElapsedTime(elapsed_time: string): string {
  // parse out hours, minutes, and seconds from the elapsed_time string
  const [hours, minutes, seconds] = elapsed_time.split(':').map(Number);

  // convert elapsed_time string into a Duration object
  const formatted_elapsed_time = Duration.fromObject({
    hours: hours || 0,
    minutes: minutes || 0,
    seconds: Math.floor(seconds) // ignore fractions
  });

  return formatted_elapsed_time.toFormat("d 'Days,' hh:mm:ss");
};
