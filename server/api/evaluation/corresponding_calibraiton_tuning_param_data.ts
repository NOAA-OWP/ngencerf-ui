const tuningParamsData = [
  { iteration: "Best: 123", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", },
  { iteration: "0", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", },
  { iteration: "1", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", },
  { iteration: "2", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", },
  { iteration: "3", param_1: "", param_2: "", param_3: "", param_4: "", param_5: "", param_6: "", }
];

export default defineEventHandler( ( event ) => {
  return tuningParamsData;
});