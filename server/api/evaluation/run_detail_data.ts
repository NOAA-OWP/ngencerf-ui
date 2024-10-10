const run_detail_data = [
  { iteration: "NWM 3.0", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
  { iteration: "Best: 123", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
  { iteration: "0", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
  { iteration: "1", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
  { iteration: "2", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
  { iteration: "3", objective_function_value: "", metric_1: "", metric_2: "", metric_3: "", metric_4: "", metric_5: "", metric_6: "" },
];

export default defineEventHandler( ( event ) => {
  return run_detail_data;
});