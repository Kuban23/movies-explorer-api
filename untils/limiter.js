const rateLimit = require('express-rate-limit');

// Настраиваю защиту
const limiter = rateLimit({
  windowMs: 90000,
  max: 100,
});

module.exports = limiter;
