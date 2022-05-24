const mongoose = require('mongoose');
const validator = require('validator');

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

module.exports = mongoose.model('user', userSchema);
