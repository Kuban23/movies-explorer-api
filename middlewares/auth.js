const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const Error401 = require('../errors/Error401');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // const { JWT_SECRET = 'strongest-key-ever' } = process.env;
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убедимся, что он есть и начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Error401('Необходима авторизация'));
  }
  // если токен есть, берем его
  const token = authorization.replace('Bearer ', '');
  let payload;

  // Чтобы поймать ошибки оборачиваем в try-catch
  try {
    // Вытаскиваем айди из токена
    // payload = jwt.verify(token, JWT_SECRET);
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b'}`);
  } catch (err) {
    next(new Error401('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
