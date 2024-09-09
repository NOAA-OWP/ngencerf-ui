import { DateTime } from "luxon";


//https://moment.github.io/luxon/api-docs/index.html

export const formatTime = (time: string) => {
  return DateTime.fromISO(time).toUTC().toFormat("yyyy/MM/dd  HH:mm:ss");
};

// 2017-12-31T00:00:00Z => 2017-12-31 00:00
export const formatDateForDisplay = ( d: string ) => {
  return d.replace('T', ' ').replace("Z", "").substring(0, 16 );
  
}

export const convertTimeZone = (date: any, tzString: String) => {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
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
  console.log("calibration_start_time", calibration_start_time);
  console.log("calibration_end_time", calibration_end_time);
  console.log("simulation_start_time", simulation_start_time);
  console.log("simulation_end_time", simulation_end_time);
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
  const formatDate = (date: DateTime): string => date.toISO();

  const rangeStart = formatDate(paddedStart);
  const rangeEnd = formatDate(paddedEnd);

  return { rangeStart, rangeEnd };
}
