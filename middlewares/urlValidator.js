const validator = require('validator');
const Error400 = require('../errors/Error400');

const urlValidator = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  // Если условие некорректно, то выдаем ошибку 400
  throw new Error400('Введённый Вами URL некорректен');
};

module.exports = urlValidator;
