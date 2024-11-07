
/*
import { useGageStore } from "~/stores/calibration/GageStore";
import { useUserDataStore } from "~/stores/common/UserDataStore";
const { gageData, selectedDomainValue, selectedForcingValue, selectedGageValue, getGageOptionsList,
  selectedObservationalValue, selectedGeopackageValue, getGeopackageOptionsList, getDomainOptionsList, getForcingOptionsList,
  getObservationalOptionsList } = storeToRefs(useGageStore());
const { userCalibrationRunData } = storeToRefs(useUserDataStore());

export const validateHeadwaterBasinGageTab = () => {
  let err = false;
  let txt = [];
  if (!selectedDomainValue.value) {
    txt.push("No Domain was selected.");
    err = true;
  }
  if (!userCalibrationRunData?.value?.gage.gage_id) {output
    txt.push("No Gage was selected.")
    err = true;
  }
  if (!userCalibrationRunData?.value?.external_data_status?.forcing) {
    txt.push("Forcing Files: Missing.")
    err = true;
  }
  if (!userCalibrationRunData?.value?.external_data_status?.observational) {
    txt.push("Observational Data: None Selected.")
    err = true;
  }
  if (!userCalibrationRunData?.value?.external_data_status?.geopackage) {
    txt.push("Geo Package Data: None Selected.")
    err = true;
  }
  return { error: err, text: txt };
}

export const validateFormulationTab = () => {
  let err = false;
  let txt = [];
  if (!userCalibrationRunData?.value?.formulation_name) {
    txt.push("A Formulation Name is required.")
    err = true;
  }
  if (!userCalibrationRunData?.value?.modules.length) {
    txt.push("No Modules have been selected.")
    err = true;
  }
  if (userCalibrationRunData.value?.formulation_warning) {
    userCalibrationRunData.value?.formulation_warning.messages.forEach(element => {
      txt.push(element + ".");
    });
    err = true;
  }
  return { error: err, text: txt };
}

export const validateTuningControlsTab = () => {
  let err = false;
  let txt = [];

  if (
    !userCalibrationRunData?.value?.calibration_times?.calibration_start_time ||
    !userCalibrationRunData?.value?.calibration_times?.calibration_end_time ||
    !userCalibrationRunData?.value?.calibration_times?.simulation_start_time ||
    !userCalibrationRunData?.value?.calibration_times?.simulation_end_time) {
    txt.push("Calibration Time Controls have not been set.")
    err = true;
  }

  if (
    !userCalibrationRunData?.value?.validation_times?.validation_start_time ||
    !userCalibrationRunData?.value?.validation_times?.validation_end_time ||
    !userCalibrationRunData?.value?.validation_times?.simulation_start_time ||
    !userCalibrationRunData?.value?.validation_times?.simulation_end_time) {
    txt.push("Validation Time Controls have not been set.")
    err = true;
  }
  if (!userCalibrationRunData?.value?.output_variable_to_calibrate.module) {
    txt.push("No 'Output Variable To Calibrate' has been selected.")
    err = true;
  }
  return { error: err, text: txt };
}


export const validateOptimizationMetricssTab = () => {
  let err = false;
  let txt = [];

  if (
    !userCalibrationRunData?.value?.calibration_times?.calibration_start_time ||
    !userCalibrationRunData?.value?.calibration_times?.calibration_end_time ||
    !userCalibrationRunData?.value?.calibration_times?.simulation_start_time ||
    !userCalibrationRunData?.value?.calibration_times?.simulation_end_time) {
    txt.push("Calibration Time Controls have not been set.")
    err = true;
  }

  if (
    !userCalibrationRunData?.value?.validation_times?.validation_start_time ||
    !userCalibrationRunData?.value?.validation_times?.validation_end_time ||
    !userCalibrationRunData?.value?.validation_times?.simulation_start_time ||
    !userCalibrationRunData?.value?.validation_times?.simulation_end_time) {
    txt.push("Validation Time Controls have not been set.")
    err = true;
  }
  if (!userCalibrationRunData?.value?.output_variable_to_calibrate.module) {
    txt.push("No 'Output Variable To Calibrate' has been selected.")
    err = true;
  }
  return { error: err, text: txt };
}
  */
