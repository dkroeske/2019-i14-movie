class User {
  
  constructor(email, password, username) {
    (this.email = this.validateEmail(email)),
    (this.password = this.validatePassword(password)),
    (this.username = this.validateUsername(username));
  }

  // Needs to be private ?
  validateEmail(email) {
    return email;
  }

  validatePassword(password) {
    return password;
  }

  validateUsername(username) {
    let regex = new RegExp("^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$");
    if (regex.test(username)) {
      return username;
    } else {
      throw new Error("Invalid Username: " + username);
    }
  }
}

module.exports = User;
