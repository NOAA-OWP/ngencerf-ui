import { ref } from "vue"

export const useCalibrationTabValidation =( requiredFields: any ) => {
   const errors = ref<any[]>([])

   Object.keys( requiredFields ).forEach( key => {
      let failed = false
      if ( typeof requiredFields[ key ] === "string" ) {
         if ( requiredFields[ key ] == "" ) failed = true
      } else if ( Array.isArray( requiredFields[ key ] ) ) {
         if ( requiredFields[ key ].length == 0 ) failed = true
      }
      if ( failed ) errors.value.push( key )
   });

   return {
      errors
   }
}