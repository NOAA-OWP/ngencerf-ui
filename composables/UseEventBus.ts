import mitt from 'mitt'

/**
 * define event groups
 */
type ApplicationEvents = {
   'calibrationButtonGroup:buttonClick': string
}

const emitter = mitt<ApplicationEvents>()

export const useEvent = emitter.emit
export const useListen = emitter.on