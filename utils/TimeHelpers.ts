import { DateTime } from "luxon";


//https://moment.github.io/luxon/api-docs/index.html

export const formatTime = (time: string) => {
  return DateTime.fromISO(time).toUTC().toFormat("yyyy/MM/dd  HH:mm:ss");
};

// 2017-12-31T00:00:00Z => 2017-12-31 00:00
export const formatDateForDisplay = ( d: string ) => {
  return d.replace('T', ' ').replace("Z", "").substring(0, 16 );
  
}

function convertTimeZone(date: any, tzString: String) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}
