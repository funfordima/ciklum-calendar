export class User {
  constructor(name) {
    this.id = '1';
    this.name = name;
    this.isActive = true;
  }
}

export class Admin extends User {
  constructor() {
    super();
    this.isAdmin = true;
  }
}
