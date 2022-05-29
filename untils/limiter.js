const rateLimit = require('express-rate-limit');

// Настраиваю защиту
module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // лимит запросов с одного ip
});
