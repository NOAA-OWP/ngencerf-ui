import { DateTime } from "luxon";

//https://moment.github.io/luxon/api-docs/index.html

export const formatTime = (time: string) => {
  return DateTime.fromISO(time).toUTC().toFormat("yyyy/MM/dd  HH:mm:ss");
};


function convertTimeZone(date: any, tzString: String) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}
