import { ref } from "vue"
import type { ToastMessageOptions } from "primevue/toast";

import type { SlothParameterData, SaveFormulationTabPayload, FormulationTabSaveWarning, GageBasinApiSavedResponse, edsError } from "./NgencerfModels";

import { ValidationFormFields } from "./NgencerfEnums";

/**
 * @param requiredFields 
 * @returns Object{'field_name':[<string>message]}
 */
export const useCalibrationTabValidation = (requiredFields: any) => {
  const errors = ref<any>({})

  Object.keys(requiredFields).forEach(key => {
    let failed = false
    if (typeof requiredFields[key] === "string") {
      if (requiredFields[key] === "") failed = true
    } else if (Array.isArray(requiredFields[key])) {
      if (requiredFields[key].length === 0) failed = true
    }
    if (failed) {
      errors.value[key as keyof typeof errors] = ['field is required.']
    }
  });

  return {
    errors
  }
}

/**
 * 
 * @param savedResponse 
 * @returns {ToastMessageOptions[]}
 */
export const useProcessCalibrationGageSavedResponse = (savedResponse: GageBasinApiSavedResponse) => {
  const messages = ref<ToastMessageOptions[]>([]);
  messages.value.push({
    severity: 'success',
    summary: `Gage Data Saved`,
    detail: savedResponse.message,
    life: ToastTimeout.timeoutSuccess
  });

  if (savedResponse.hasOwnProperty('eds_errors') && savedResponse.eds_errors.length > 0) {
    savedResponse.eds_errors.forEach((eds_error: edsError) => {
      messages.value.push({
        severity: 'warn',
        summary: 'EDS Error',
        detail: eds_error.message,
        life: ToastTimeout.timeoutWarn
      });
    })
  }

  if (savedResponse.hasOwnProperty('warnings') && savedResponse.warnings.length > 0) {
    savedResponse.warnings.forEach((warning: string) => {
      messages.value.push({
        severity: 'warn',
        summary: 'AORC Error',
        detail: warning,
        life: ToastTimeout.timeoutWarn
      });
    })
  }

  return messages.value;
}

/**
 * @param SlothParameterData[] 
 * @returns [<string>messages]
 */
export const useCalibrationFormulationSlothTableValidation = (slothParameters: SlothParameterData[]) => {
  const BreakException = {};
  const errors = ref<any>({});

  try {
    slothParameters.forEach((slothParameter) => {
      Object.keys(slothParameter).forEach(key => {
        if (slothParameter[key as keyof SlothParameterData] === "") {
          throw new Error(key)
        }
      })
    });
  } catch (error: any) {
    errors.value[error?.message as keyof typeof errors] = ['All sloth parameter fields are required.'];
  }
  return errors;
}

export const useCalibrationFormulationTabSaveValidate = (savePayload: SaveFormulationTabPayload) => {
  const errors = ref<any>({});
  if (savePayload.hasOwnProperty("sloth_parameters") && !savePayload.hasOwnProperty("modules")) {
    errors.value['selectedModuleValues'] = ['Selecting module is required for Sloth Parameter.'];
  }
  if (savePayload.hasOwnProperty("sloth_parameters") && savePayload.hasOwnProperty("modules")) {
    const slothParametersValidation = useCalibrationFormulationSlothTableValidation(savePayload['sloth_parameters'] ?? []);
    for (const [key, messages] of Object.entries(slothParametersValidation.value)) {
      errors.value[`${key}`] = messages;
    }
  }

  return errors;
}

export const useCalibrationFormulationTabSaveWarning = (formulation_warning: FormulationTabSaveWarning) => {
  let warnings = <string[]>[];

  if (formulation_warning.hasOwnProperty("messages") && Array.isArray(formulation_warning.messages) && formulation_warning.messages.length > 0) {
    warnings = formulation_warning.messages;
  }

  return warnings;
}

/**
 * @param validationErrors 
 * @returns [<string>messages]
 */
export const useApiErrorResponseValidator = (validationErrors: any) => {
  let errors = <string[]>[];
  Object.keys(validationErrors).forEach(key => {
    let field_label = key;
    if (key in ValidationFormFields) field_label = ValidationFormFields[key as keyof typeof ValidationFormFields];
    validationErrors[key].forEach((validation_error: any) => {
      if (typeof validation_error === "string") {
        errors.push(`${field_label} ${validation_error}`);
      }
      if (typeof validation_error === "object") {
        let error_messages = useApiErrorResponseValidator(validation_error);
        errors = errors.concat(error_messages);
      }
    })
  })
  return errors;
}

/**
 * Preprocess API warning/error responses to extract relevant messages.
 * NOTE: This will return string from 'message' as an error although 'message' is not always an error.
 * So this function isn't safe to be used for all API responses, but we also want to capture 'message'
 * when the response is OK (200) as some warning messages occur during OK responses, so we cannot do both at the same time.
 * @param errorResponse The error response object from the API.
 * @returns An array of warning/error messages.
 */
export const useApiErrorResponsePreprocess = (errorResponse: any) => {
  let errors: string[] = [];

  // add fatal_errors if they exist
  if (errorResponse?._data?.fatal_errors) {
    errors.push(...errorResponse?._data?.fatal_errors);
  }

  // add validation_errors if they exist
  if (errorResponse?._data?.validation_errors) {
    // if there are validation errors, use the validator to extract messages
    errors.push(...useApiErrorResponseValidator(errorResponse?._data?.validation_errors));
  }

  // add errors if they exist
  if (errorResponse?._data?.errors) {
    errors.push(...errorResponse?._data?.errors);
  }

  // add message if no other errors are present
  // NOTE: This is not always an error, but we want to capture it as an error in some cases.
  // So this function isn't safe to be used for all API responses.
  // We should use this only when we know that the response is an error response.
  if (
    errorResponse?._data?.message &&
    typeof errorResponse._data.message === 'string' &&
    errorResponse._data.message.length > 0 &&
    errors.length === 0
  ) {
    // if there are no other errors, we can safely add the message as an error
    errors.push(errorResponse._data.message);
  }

return errors;
}

export const useApiResponseToastSeverityCode = (status: number) => {
  switch (status) {
    case 200:
      return "success";
    case 400:
    case 500:
      return "error";
    default:
      return "warn";
  }
}

export const useApiResponseToastSeverityLife = (status: number) => {
  switch (status) {
    case 200:
      return ToastTimeout.timeoutSuccess;
    case 400:
    case 500:
      return ToastTimeout.timeoutError;
    default:
      return ToastTimeout.timeoutWarn;
  }
}