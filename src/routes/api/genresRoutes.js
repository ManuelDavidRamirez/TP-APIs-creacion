const express = require('express');
const router = express.Router();
const genresController = require('../../controllers/api/genresController');

/* api/genres */
router
    .get('/', genresController.list)
    .get('/name/:name', genresController.byName)
    .get('/:id', genresController.detail);


module.exports = router;