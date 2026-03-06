const mongoose = require('mongoose');

const UserModel = mongoose.model('User');

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async register() {
    const existingUser = await UserModel.findOne({ username: this.username });
    if (existingUser) {
      const error = new Error('User already exists');
      error.code = 'USER_EXISTS';
      throw error;
    }

    const user = new UserModel({
      username: this.username,
      password: this.password,
    });

    await user.save();
    return user;
  }

  async login() {
    const user = await UserModel.findOne({ username: this.username });

    if (!user || user.password !== this.password) {
      const error = new Error('Invalid username or password');
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    return user;
  }
}

module.exports = User;

