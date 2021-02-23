export default class User {
  constructor(name) {
    this.id = `f${(+new Date()).toString(16)}`;
    this.name = name;
    this.isActive = true;
  }
}
