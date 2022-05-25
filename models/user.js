const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Error401 = require('../errors/Error401');

const EMAIL_VALIDATION_ERROR = 'Неправильный формат почты';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Invalid email'],
    unique: true,
    message: EMAIL_VALIDATION_ERROR,
  },
  password: {
    type: String,
    required: true,
    select: false, // для того чтобы API не возвращал хеш пароля
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Андрей',
  },
});

// В случае аутентификации хеш пароля нужен. Чтобы это реализовать,
// нужно добавить вызов метода select, передав ему строку +password
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error401('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error401('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
