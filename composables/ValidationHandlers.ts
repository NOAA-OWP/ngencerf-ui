import { ref } from "vue"
import { ValidationFormFields } from "./NextGenModel";

/**
 * @param requiredFields 
 * @returns Object{'field_name':[<string>message]}
 */
export const useCalibrationTabValidation = ( requiredFields: any ) => {
   const errors = ref<any>({})

   Object.keys( requiredFields ).forEach( key => {
      let failed = false
      if ( typeof requiredFields[ key ] === "string" ) {
         if ( requiredFields[ key ] == "" ) failed = true
      } else if ( Array.isArray( requiredFields[ key ] ) ) {
         if ( requiredFields[ key ].length == 0 ) failed = true
      }
      if ( failed ) {
         errors.value[ key as keyof typeof errors] = ['field is required.']
      }
   });

   return {
      errors
   }
}

/**
 * @param validationErrors 
 * @returns [<string>messages]
 */
export const useApiErrorResponseValidator = ( validationErrors: any ) => {
   let errors = <String[]>[]
   Object.keys( validationErrors ).forEach( key => {
      let field_label = key
      if ( key in ValidationFormFields ) field_label = ValidationFormFields[ key as keyof typeof ValidationFormFields ]
      validationErrors[ key ].forEach( ( validation_error: any ) => {
         if ( typeof validation_error == "string" ) {
            errors.push( `${field_label} ${validation_error}`)
         }
         if ( typeof validation_error == "object" ) {
            let error_messages = useApiErrorResponseValidator( validation_error )
            errors = errors.concat( error_messages )
         }
      })
   })
   return errors
}