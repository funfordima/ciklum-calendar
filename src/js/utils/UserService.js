export class User {
  constructor(name) {
    this.id = `f${(+new Date()).toString(16)}`;
    this.name = name;
    this.isActive = true;
  }
}

export class Admin extends User {
  constructor(name) {
    super(name);
    this.isAdmin = true;
  }
}
