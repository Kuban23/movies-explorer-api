// Подключаем express
const express = require('express');
const mongoose = require('mongoose');

// Настраиваем и слушаем 3000 порт
const { PORT = 3000 } = process.env;

// Создаем приложение
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
