export default class EventEmitter {
  constructor() {
    this.events = {};

    if (!EventEmitter.instance) {
      EventEmitter.instance = this;
    }
    return EventEmitter.instance;
  }

  subscribe(name, fn) {
    const event = this.events[name];

    if (event) {
      event.push(fn);
    } else {
      this.events[name] = [fn];
    }

    /* eslint no-return-assign: 0 */
    return () => (this.events[name] = this.events[name].filter((eventFn) => fn !== eventFn));
  }

  emit(name, ...data) {
    const event = this.events[name];
    if (event) {
      event.forEach((func) => func(...data));
    }
  }
}
