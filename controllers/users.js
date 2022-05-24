const bcrypt = require('bcryptjs'); // импортируем bcrypt
const User = require('../models/user');
const Error400 = require('../errors/Error400');
const Error409 = require('../errors/Error409');
const Error404 = require('../errors/Error404');

// Получаю данные текущего пользователя
module.exports.getCurrentUser = (req, res, next) => { // ?
  // Ищу пользователя
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new Error400('Пользователь с указанным _id не найден'));
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

// Создаю нового пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400('Некорректные данные пользователя'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error409('Пользователь с таким email зарегистрирован'));
      } else {
        next(err);
      }
    });
};

// Обновляем профиль пользователя (email и имя) PATCH /users/me
module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  // ищем пользователя по id
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newUserInfo) => {
      if (!newUserInfo) {
        next(new Error404('Пользователь с указанным _id не найден'));
      }
      res.send({ data: newUserInfo });
    })
    .catch((err) => {
      if ((err.name === 'ValidationError' || err.name === 'CastError')) {
        next(new Error400('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
