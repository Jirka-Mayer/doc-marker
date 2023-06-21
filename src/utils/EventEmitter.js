/**
 * Implements event functionality for any system
 */
export class EventEmitter {
  constructor() {
    // key is event name, value is an array of listeners
    this.eventListeners = {}
  }

  _assert_listener_array(eventName) {
    if (!this.eventListeners.hasOwnProperty(eventName))
      this.eventListeners[eventName] = []
  }

  /**
   * Registers a new event listener for a given event
   * @param {string} eventName
   * @param {CallableFunction} listener
   */
  on(eventName, listener) {
    this._assert_listener_array(eventName)
    this.eventListeners[eventName].push(listener)
  }

  /**
   * Removes a listener from the event
   * @param {string} eventName
   * @param {CallableFunction} listener
   */
  off(eventName, listener) {
    this._assert_listener_array(eventName)
    this.eventListeners[eventName] = this.eventListeners[eventName].filter(
      l => l !== listener
    )
  }

  /**
   * Emits an event, calling all of its listeners
   * @param {string} eventName 
   * @param  {...any} args 
   */
  emit(eventName, ...args) {
    if (!this.eventListeners.hasOwnProperty(eventName))
      return
    
    this.eventListeners[eventName].forEach(l => {
      l(...args)
    })
  }
}