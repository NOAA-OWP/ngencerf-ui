import mitt from 'mitt'
import type { CalibrationButtonGroupClickEvent } from './NextGenModel'
/**
 * define event groups
 */


/**
 * define events in NextGenModel and extend ApplicationEvents with & such as EventType1 & EventType2
 */
type ApplicationEvents = CalibrationButtonGroupClickEvent

const emitter = mitt<ApplicationEvents>()

export const useEvent = emitter.emit
export const useListen = emitter.on
export const emitterOff = emitter.off
export const emitterAll = emitter.all


type logoutEvents = LogoutEvent

const logoutEmitter = mitt<LogoutEvent>()

export const useLogout = logoutEmitter.emit
export const useLogoutListen = logoutEmitter.on
