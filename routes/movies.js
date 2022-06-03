// Возвращает все сохраненные текущим пользователем фильмы GET /movies
// Удадяет сохраненные фильмы по id DELETE /movies/_id
// Создает фильм с переданными в теле country, director, duration, year, description, image,
// trailerLink, thumbnail, nameRU, nameEN, movieId   POST /movies

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getAllMovies, deleteMovie, createMovie } = require('../controllers/movies');
const urlValidator = require('../middlewares/urlValidator');

router.get('/', getAllMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator),
    trailerLink: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);

module.exports = router;
