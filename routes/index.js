// # создаёт пользователя с переданными в теле
// # email, password и name
// POST /signup

// # проверяет переданные в теле почту и пароль
// # и возвращает JWT
// POST /signin
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const Error404 = require('../errors/Error404');

// Подключаю роуты
const usersRoute = require('./users');
const moviesRoute = require('./movies');

// Подключаем контроллеры
const { login, createUser } = require('../controllers/users');

// Маршруты для регистрации и авторизации
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

// Защита авторизацией всех маршрутов
router.use(auth);

// Прописываю маршруты
router.use('/users', usersRoute);
router.use('/movies', moviesRoute);

// Обрабатываю некорректный маршрут
router.use('*', auth, (req, res, next) => {
  next(new Error404('Запрашиваемая страница не найдена'));
});

module.exports = router;
