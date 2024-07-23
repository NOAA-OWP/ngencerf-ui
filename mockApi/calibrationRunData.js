export const mockedCalibrationRunData = () => {
  return [
    {
      runId: 123,
      formulationName: 'cfe_noah',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-03',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Done'
    },
    {
      runId: 124,
      formulationName: 'cfe_noah_sft',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-05',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Failed'
    },
    {
      runId: 265,
      formulationName: 'cfe_xaj_noah',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-10',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Cancelled'
    },
    {
      runId: 258,
      formulationName: 'cfe_xaj_noah_sft',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-12',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Ready'
    },
    {
      runId: 308,
      formulationName: 'lsam_noah_sft',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-17',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Saved'
    },
    {
      runId: 401,
      formulationName: 'topmodel_noah',
      headwaterBasinGage: '01123000',
      runDate: '2024-06-20',
      calibrationPeriod: '2018-06-01 00:00 to 2022-12-31',
      status: 'Running'
    },
  ]
}