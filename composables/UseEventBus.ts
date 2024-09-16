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


type logoutEvents = LogoutEvent

const logouEmitter = mitt<LogoutEvent>()

export const useLogout = logouEmitter.emit
export const useLogoutListen = logouEmitter.on
