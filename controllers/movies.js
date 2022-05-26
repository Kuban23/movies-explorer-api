// Возвращает все сохраненные текущим пользователем фильмы GET /movies
// Удадяет сохраненные фильмы по id DELETE /movies/_id
// Создает фильм с переданными в теле country, director, duration, year, description, image,
// trailer, nameRU, nameEN и thumbnail, movieId   POST /movies

const Movie = require('../models/movie');
const Error400 = require('../errors/Error400');
const Error404 = require('../errors/Error404');
const Error403 = require('../errors/Error403');

// Получаю все фильмы
module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(next);
};

// Создаю фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

// Удаляю фильм
module.exports.deleteMovie = (req, res, next) => {
  // Нахожу фильм и удаляю его
  Movie.findByIdAndRemove(req.params.movieId)
    .then((movie) => { // Если не нашли фильм, то кидаем ошибку и попадаем в catch
      if (!movie) {
        next(new Error404('Фильм с указанным _id не найден'));
      }
      // Делаем проверку, может ли пользователь удалить фильм
      // user._id имеет тип String, movie.owner иммет тип object, приводим его к строке
      if (req.user._id !== movie.owner.toString()) {
        next(new Error403('Невозможно удалить чужой фильм'));
      }
      return movie.remove()
        .then(() => res.status(200).send({ data: movie, message: 'Фильм успешно удален' }));
    })
    .catch(next);
};
