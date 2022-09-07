const express = require('express');
const router = express.Router();
const moviesController = require('../../controllers/api/moviesController');

/* api/movies */
router
    .get('/', moviesController.list)
    .get('/new', moviesController.new)
    .get('/recommended', moviesController.recomended)
    .get('/detail/:id', moviesController.detail)
    .post('/', moviesController.create)
    .put('/:id?', moviesController.update)
    .delete('/:id?', moviesController.destroy)

module.exports = router;