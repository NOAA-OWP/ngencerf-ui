import { DateTime } from "luxon";
import Toast from "primevue/toast";


//https://moment.github.io/luxon/api-docs/index.html

export const formatTime = (time: string) => {
  return DateTime.fromISO(time).toUTC().toFormat("yyyy/MM/dd  HH:mm:ss");
};

// 2017-12-31T00:00:00Z => 2017-12-31 00:00
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
}

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
}


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
  // console.log("calibration_start_time", calibration_start_time);
  // console.log("calibration_end_time", calibration_end_time);
  // console.log("simulation_start_time", simulation_start_time);
  // console.log("simulation_end_time", simulation_end_time);

  const startDates = [
    DateTime.fromISO(calibration_start_time),
    DateTime.fromISO(simulation_start_time),
  ];

  const endDates = [
    DateTime.fromISO(calibration_end_time),
    DateTime.fromISO(simulation_end_time),
  ];

  const zStartDates = [
    new DateTime(calibration_start_time).toFormat("yyyy/MM/dd  HH:mm:ss"),
    new DateTime(simulation_start_time).toFormat("yyyy/MM/dd  HH:mm:ss")
  ];

  const zEendDates = [
    new DateTime(calibration_end_time).toFormat("yyyy/MM/dd  HH:mm:ss"),
    new DateTime(simulation_end_time).toFormat("yyyy/MM/dd  HH:mm:ss")
  ];

  const minDate = DateTime.min(...startDates);
  const maxDate = DateTime.max(...endDates);

  // pad the range by one month before and after
  const paddedStart = minDate.minus({ months: 1 });
  const paddedEnd = maxDate.plus({ months: 1 });

  // convert a DateTime object to a string in ISO format
  const formatDate = (date: DateTime): string => date.toISO();

  const rangeStart = formatDate(paddedStart);
  const rangeEnd = formatDate(paddedEnd);

  return { rangeStart, rangeEnd };
}

/**
 * Calculates the elapsed time between two Date objects
 * @param start_time Date object representing the start time
 * @param end_time Date object representing the end time
 * @returns {string} string of the elapsed time in '0 days, 01:23:45' format
 */
export function calculateElapsedTime(start_time: Date, end_time: Date): string {
  const start = DateTime.fromJSDate(start_time);
  const end = DateTime.fromJSDate(end_time);
  const diff = end.diff(start, ["days", "hours", "minutes", "seconds"]);
  
  return diff.toFormat("d 'Days,' hh:mm:ss");
}
