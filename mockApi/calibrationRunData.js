export const mockedCalibrationRunData = () => {
  return [
    {
      runId: 123,
      formulationName: 'cfe_noah',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-03',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Done',
      objectiveFunction: "KGE",
      optimizationAlgorithm: "DDS",
      validationRuns: 3
    },
    {
      runId: 124,
      formulationName: 'cfe_noah_sft',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-05',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Failed',
      objectiveFunction: "KGE",
      optimizationAlgorithm: "DDS",
      validationRuns: 3
    },
    {
      runId: 265,
      formulationName: 'cfe_xaj_noah',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-10',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Cancelled',
      objectiveFunction: "KGE",
      optimizationAlgorithm: "DDS",
      validationRuns: 3
    },
    {
      runId: 258,
      formulationName: 'cfe_xaj_noah_sft',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-12',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Ready',
      objectiveFunction: "KGE",
      optimizationAlgorithm: "DDS",
      validationRuns: 3
    },
    {
      runId: 308,
      formulationName: 'lsam_noah_sft',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-17',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Saved',
      objectiveFunction: "KGE",
      optimizationAlgorithm: "DDS",
      validationRuns: 3
    },
    {
      runId: 401,
      formulationName: 'topmodel_noah',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-20',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Running',
      objectiveFunction: "KGE",
      optimizationAlgorithm: "DDS",
      validationRuns: 3
    },
  ]
}