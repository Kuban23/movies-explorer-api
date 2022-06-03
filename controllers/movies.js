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
  Movie.findById(req.params.movieId)
    .orFail(() => {
      // Если мы оказались здесь, то запрос в момент запроса ничего не нашлось
      throw new Error404('Фильм с заданным ID отсутствует');
    })
    .then((movie) => {
      // Делаю проверку может ли пользователь удалить фильм
      // movie.owner._id приходит с форматом object, user._id приходит с типом string,
      // привожу состояние к строке
      if (req.user._id !== movie.owner.toString()) {
        // выдаю ошибку, что пользователь не может это делать
        next(new Error403('Невозможно удалить чужой фильм'));
      }
      return movie.remove()
        .then(() => {
          res.send({ message: 'Фильм успешно удалён!' });
        });
    })
    .catch(next);
};
