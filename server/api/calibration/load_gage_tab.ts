import { gage_data } from "~/composables/NextGenModel"

const gage_tab_data_list: gage_data[] = [
  {
    "calibration_run_id": 6,
    "status": "",
    "domain_source": "",
    "gage": {
      "gage_Id": "",
      "agency": "",
      "station_name": "",
      "latitude": 0,
      "longitude": 0,
      "altitude": 0
    },
    "forcing_user_dir": "",
    forcing_source: "",
    "forcing_values": [
      {
        "name":"AORC",
        "code":"aorc"
      },
      {
        "name":"Upload",
        "code":"upload"
      }      
    ],
    "forcing_user_filename": "",
    "observational_dir": "",
    observational_source: "",
    "observational_values": [
      {
        name:"USGS",
        code:"usgs"
      },
      {
        name:"USACE",
        code:"usace"
      },
      {
        name:"A DWR",
        code:"a_dwr"
      },
      {
        name:"Environment Canada",
        code:"env_canada"
      },
      {
        name:"Upload",
        code:"upload"
      }
    ],
    "observational_user_filename": "",
    "domain_values": [
      "CONUS",
      "ALASKA",
      "HAWAII",
      "PUERTO RICO"
    ],
    "gages": [
      {
        "gage_id": "01123000",
        "nsw_id": "01123000",
        "domain": "CONUS",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01238950",
        "nsw_id": "01238950",
        "domain": "CONUS",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01241550",
        "nsw_id": "01241550",
        "domain": "CONUS",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01239770",
        "nsw_id": "01239770",
        "domain": "ALASKA",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01538950",
        "nsw_id": "01538950",
        "domain": "ALASKA",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01249950",
        "nsw_id": "01249950",
        "domain": "ALASKA",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01649950",
        "nsw_id": "01649950",
        "domain": "ALASKA",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01323000",
        "nsw_id": "01323000",
        "domain": "HAWAII",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01438950",
        "nsw_id": "01438950",
        "domain": "HAWAII",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "02333300",
        "nsw_id": "02333300",
        "domain": "PUERTO RICO",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01249990",
        "nsw_id": "01249990",
        "domain": "PUERTO RICO",
        "nmnv3_calibrated_gage": false
      }
    ]
  },
  {
    "calibration_run_id": 10,
    "status": "saved",
    "domain_source": "CONUS",
    "gage": {
      "gage_Id": "01241550",
      "agency": "US Geological Survey",
      "station_name": "ITTLE RIVER NEAR HANNOVER, CT",
      "latitude": 0.1,
      "longitude": 0.1,
      "altitude": 0.1
    },
    "forcing_user_dir": "/my/forcing/data/dir/",
    "forcing_source": "aorc",
    "forcing_values": [
      {
        "name":"AORC",
        "code":"aorc"
      },
      {
        "name":"Upload",
        "code":"upload"
      }      
    ],
    "forcing_user_filename": "",
    "observational_dir": "",
    observational_source: "usace",
    "observational_values": [
      {
        name:"USGS",
        code:"usgs"
      },
      {
        name:"USACE",
        code:"usace"
      },
      {
        name:"A DWR",
        code:"a_dwr"
      },
      {
        name:"Environment Canada",
        code:"env_canada"
      },
      {
        name:"Upload",
        code:"upload"
      }
    ],
    "observational_user_filename": "/my/observational/data",
    "domain_values": [
      "CONUS",
      "ALASKA",
      "HAWAII",
      "PUERTO RICO"
    ],
    "gages": [
      {
        "gage_id": "01123000",
        "nsw_id": "01123000",
        "domain": "CONUS",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01238950",
        "nsw_id": "01238950",
        "domain": "CONUS",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01241550",
        "nsw_id": "01241550",
        "domain": "CONUS",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01239770",
        "nsw_id": "01239770",
        "domain": "ALASKA",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01538950",
        "nsw_id": "01538950",
        "domain": "ALASKA",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01249950",
        "nsw_id": "01249950",
        "domain": "ALASKA",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01649950",
        "nsw_id": "01649950",
        "domain": "ALASKA",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01323000",
        "nsw_id": "01323000",
        "domain": "HAWAII",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01438950",
        "nsw_id": "01438950",
        "domain": "HAWAII",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "02333300",
        "nsw_id": "02333300",
        "domain": "PUERTO RICO",
        "nmnv3_calibrated_gage": false
      },
      {
        "gage_id": "01249990",
        "nsw_id": "01249990",
        "domain": "PUERTO RICO",
        "nmnv3_calibrated_gage": false
      }
    ]
  }
]

export default defineEventHandler( async (event): Promise<gage_data | undefined> => {
  const { calibration_run_id } = await readBody(event);
  return gage_tab_data_list.find( ( gage_tab_data ) => gage_tab_data.calibration_run_id == calibration_run_id )
})