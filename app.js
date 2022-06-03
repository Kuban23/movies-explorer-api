require('dotenv').config();
// Подключаем express
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const routers = require('./routes/index');
const error = require('./errors/errors');
const limiter = require('./untils/limiter');

// Настраиваем и слушаем 3000 порт
const { PORT = 3000 } = process.env;

// Создаем приложение
const app = express();

// Подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb');

// Подключаю логгер запросов
app.use(requestLogger);

// Подключаю ограничитель запросов
app.use(limiter);

// Выбирваем методы для работы спакетами
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// Включаем защиту заголовков
app.use(helmet());

// Подключил мидлвар для работы с Cors
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Прописываю маршруты
app.use('/', routers);

// Подключаю логгер ошибок
app.use(errorLogger);

// Создал обработчик ошибок для celebrate
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
