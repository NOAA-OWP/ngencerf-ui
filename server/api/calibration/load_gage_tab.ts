import { gage_data, GageData } from "~/composables/NextGenModel"

const gage_tab_data_list: gage_data[] = [
  {
    "calibration_run_id": 10,
    "status": "saved",
    "gage": {
      "gage_Id": "1010101",
      "agency": "string",
      "station_name": "string",
      "latitude": 0.1,
      "longitude": 0.1,
      "altitude": 0.1
    },
    "forcing_user_dir": "/my/forcing/data/dir/",
    "forcing_source": "AORC",
    "forcing_user_filename": "",
    "observational_dir": "",
    "observational_source": "USGS",
    "observational_user_filename": "/my/observational/data",
    "domain_values": [
      "CONUS"
    ],
    "gages": [
      "1010101"
    ]
  }
]

export default defineEventHandler( async (event): Promise<gage_data | undefined> => {
  const { calibration_run_id } = await readBody(event);
  return gage_tab_data_list.find( ( gage_tab_data ) => gage_tab_data.calibration_run_id == calibration_run_id )
})