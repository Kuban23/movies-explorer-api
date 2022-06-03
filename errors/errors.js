// Обработка всех ошибок централизованно serverError
module.exports = ((err, req, res, next) => {
  const { message } = err;
  const statusCode = err.statusCode || 500;
  // проверяем статус, отправляем сообщение в зависимости от статуса
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Произошла ошибка на сервере'
      : message,
  });
  next();
});
