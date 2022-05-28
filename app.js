// # создаёт пользователя с переданными в теле
// # email, password и name
// POST /signup

// # проверяет переданные в теле почту и пароль
// # и возвращает JWT
// POST /signin

// Подключаем express
const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const Error404 = require('./errors/Error404');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

// Настраиваем и слушаем 3000 порт
const { PORT = 3000 } = process.env;

// Создаем приложение
const app = express();

// Подключаю роуты
const usersRoute = require('./routes/users');
const moviesRoute = require('./routes/movies');

// Подключаем контроллеры
const { login, createUser } = require('./controllers/users');

// Подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb');
// mongoose.connect('mongodb://localhost:27017/moviesdb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Подключаю логгер запросов
app.use(requestLogger);

// Выбирваем методы для работы спакетами
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// Подключил мидлвар для работы с Cors
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Маршруты для регистрации и авторизации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

// Защита авторизацией всех маршрутов
app.use(auth);

// Прописываю маршруты
app.use(usersRoute);
app.use(moviesRoute);

// Обрабатываю некорректный маршрут
app.use('*', auth, (req, res, next) => {
  next(new Error404('Запрашиваемая страница не найдена'));
});

// Подключаю логгер ошибок
app.use(errorLogger);

// Создал обработчик ошибок для celebrate
app.use(errors());

// Обработка всех ошибок централизованно serverError
app.use((err, req, res, next) => {
  // serverError(err, req, res, next);
  const { message } = err;
  // console.log(message);
  const statusCode = err.statusCode || 500;
  // проверяем статус, отправляем сообщение в зависимости от статуса
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Ошибка на сервере'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
