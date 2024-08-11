import { formulation_tab_data } from "~/composables/NextGenModel";

const formulation_tab_data_list: formulation_tab_data[] = [
  {
    calibration_run_id: 6,
    formulation_name: "",
    module_sources: [],
    modules: [
      {
        name: "Sloth",
        groups: [
          "Glacier",
          "Soil Moisture"
        ]
      },
      {
        name: "GC2D",
        groups: [
          "Glacier",
          "Coastal"
        ]
      },
      {
        name: "TopFlow",
        groups: [
          "Rainfall / Runoff"
        ]
      },
      {
        name: "Noah-OWP",
        groups: [
          "Channel Routing",
          "Evapotranspiration",
          "Inject"
        ]
      },
      {
        name: "Snow-17",
        groups: [
          "Channel Routing",
          "Evapotranspiration",
          "Snowmelt"
        ]
      },
      {
        name: "UEB",
        groups: [
          "Inject"
        ]
      },
      {
        name: "CFE-S",
        groups: [
          "Soil Moisture",
          "Channel Routing",
        ]
      },
      {
        name: "CFE-X",
        groups: [
          "Soil Moisture",
          "Channel Routing",
        ]
      },
      {
        name: "TopModel",
        groups: [
          "Soil Moisture",
          "Inject"
        ]
      },
      {
        name: "Sac-SMA",
        groups: [
          "Soil Moisture",
          "Channel Routing",
          "Inject"
        ]
      },
      {
        name: "LASAM",
        groups: [
          "Soil Moisture",
          "Glacier",
          "Rainfall / Runoff"
        ]
      },
      {
        name: "SMP",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Rainfall / Runoff"
        ]
      },
      {
        name: "SoilFreezeThaw",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "T-Route",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "LSTM",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "SCHISM",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "SFINCS",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "Unit Hydrograph",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      }
    ],
    "use_sloth": false,
    "sloth_parameters": [],
    "status": ""
  },
  {
    calibration_run_id: 10,
    formulation_name: "formulation for id 10",
    module_sources: ["Sloth","Noah-OWP","CFE-X"],
    modules: [
      {
        name: "Sloth",
        groups: [
          "Glacier",
          "Soil Moisture"
        ]
      },
      {
        name: "GC2D",
        groups: [
          "Glacier",
          "Coastal"
        ]
      },
      {
        name: "TopFlow",
        groups: [
          "Rainfall / Runoff"
        ]
      },
      {
        name: "Noah-OWP",
        groups: [
          "Channel Routing",
          "Evapotranspiration",
          "Inject"
        ]
      },
      {
        name: "Snow-17",
        groups: [
          "Channel Routing",
          "Evapotranspiration",
          "Snowmelt"
        ]
      },
      {
        name: "UEB",
        groups: [
          "Inject"
        ]
      },
      {
        name: "CFE-S",
        groups: [
          "Soil Moisture",
          "Channel Routing",
        ]
      },
      {
        name: "CFE-X",
        groups: [
          "Soil Moisture",
          "Channel Routing",
        ]
      },
      {
        name: "TopModel",
        groups: [
          "Soil Moisture",
          "Inject"
        ]
      },
      {
        name: "Sac-SMA",
        groups: [
          "Soil Moisture",
          "Channel Routing",
          "Inject"
        ]
      },
      {
        name: "LASAM",
        groups: [
          "Soil Moisture",
          "Glacier",
          "Rainfall / Runoff"
        ]
      },
      {
        name: "SMP",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Rainfall / Runoff"
        ]
      },
      {
        name: "SoilFreezeThaw",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "T-Route",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "LSTM",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "SCHISM",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "SFINCS",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      },
      {
        name: "Unit Hydrograph",
        groups: [
          "Evapotranspiration",
          "Glacier",
          "Snowmelt"
        ]
      }
    ],
    "use_sloth": true,
    "sloth_parameters": [
      {
        "param_name": "sloth_ice_fraction_schoake",
        "param_count": 1,
        "param_type": "double",
        "param_units": "m",
        "param_location": "node",
        "param_value": 0.0,
        "maps_to_module": "CFE",
        "maps_to_variable_name": "ice_fraction_schoake"
      },
      {
        "param_name": "sloth_ice_fraction_xinanjiang",
        "param_count": 1,
        "param_type": "double",
        "param_units": "none",
        "param_location": "node",
        "param_value": 0.0,
        "maps_to_module": "CFE",
        "maps_to_variable_name": "ice_fraction_xinanjiang"
      },
      {
        "param_name": "sloth_smp",
        "param_count": 1,
        "param_type": "double",
        "param_units": "none",
        "param_location": "node",
        "param_value": 0.0,
        "maps_to_module": "CFE",
        "maps_to_variable_name": "soil_moisture_profile"
      },
    ],
    "status": "saved"
  }
]

export default defineEventHandler( async (event): Promise<formulation_tab_data | undefined> => {
  const { calibration_run_id } = await readBody(event);
  return formulation_tab_data_list.find( ( tab_data ) => tab_data.calibration_run_id == calibration_run_id )
})