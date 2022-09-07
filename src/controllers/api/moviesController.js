const path = require('path');
const db = require('../../database/models');
const {checkID} = require("../../helpers")
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');

const {request, response} = require("express");
const { errorMonitor } = require('events');
const getUrl = (req = request) => req.protocol + `://` + req.get("host") + req.originalUrl

const moviesController = {
    list: async (req, res) => {

        try {
            let movies = await db.Movie.findAll({
                include: ['genre']
            })
            let response = {
                ok : true,
                meta : {
                    status : 200,
                    total : movies.length
                },
                data : movies,
            };

            return res.status(200).json(response)
        } catch (error) {
            
        }
    },
    detail: async (req, res) => {

        if (checkID(req.params.id)) {
            return res.status(400).json(checkID(req.params.id))
        }

        try {

            let movie = await db.Movie.findByPk(req.params.id, {
                    include : ['genre']
                })
            if (!movie) {
                response = {
                    ok : false,
                    meta : {
                        status : 404
                    },
                    msg : `No se encuentra una pelicula con ese ID`
                }
                return res.status(404).json(response)
            }
            response = {
                ok : true,
                meta : {
                    status : 200,
                },
                data : movie
            }
            return res.status(200).json(response)
        } catch (error) {
            console.log(error)
                let response = {
                    ok : false,
                    meta : {
                        status : 500
                    },
                    msg : error.message ? error.message : "Comuniquese con el administrador del sitio"
                }
                return res.status(error.statusCode || 500).json(response)
        }
    },
    new: async (req, res) => {
        
        try {
            let movies = await db.Movie.findAll({
                order : [
                    ['release_date', 'DESC']
                ],
                limit: +req.query.limit || 5
            })
            response = {
                ok : true,
                meta : {
                    status : 200,
                    total : movies.length
                },
                data : movies
            }
            return res.status(200).json(response)
        } catch (error) {
            console.log(error)
                let response = {
                    ok : false,
                    meta : {
                        status : 500
                    },
                    msg : error.message ? error.message : "Comuniquese con el administrador del sitio"
                }
                return res.status(error.statusCode || 500).json(response)
        }
    },
    recomended: async (req, res) => {
        
        try {
            let movies = await db.Movie.findAll({
                include: ['genre'],
                where: {
                    rating: {[db.Sequelize.Op.gte] : +req.query.rating || 8}
                },
                order: [
                    ['rating', 'DESC']
                ]
            })
            response = {
                ok : true,
                meta : {
                    status : 200,
                    total : movies.length
                },
                data : movies
            }
            return res.status(200).json(response)
        } catch (error) {
            console.log(error)
                let response = {
                    ok : false,
                    meta : {
                        status : 500
                    },
                    msg : error.message ? error.message : "Comuniquese con el administrador del sitio"
                }
                return res.status(error.statusCode || 500).json(response)
        }
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    create: async (req,res) => {
        
        const {title, rating, awards, release_date, length, genre_id} = req.body;

        try {
            let genres = await db.Genre.findAll();
            let genresIds = genres.map(genre => genre.id);
            if (!genresIds.includes(+genre_id)) {
                let error = new Error("ID de género inexistente");
                error.status = 404;
                throw error 
            }
            let newMovie = await db.Movie
            .create(
                {
                    title,
                    rating,
                    awards,
                    release_date,
                    length,
                    genre_id,
                }
            )
            
            if (newMovie) {
                response = {
                    ok : true,
                    meta : {
                        status : 200,
                        url : getURL(req) + "/" + newMovie.id
                    },
                    data : newMovie
                }
                return res.status(200).json(response)
            }
        } catch (error) {
            console.log(error);
            let errors = [];
            if (error.errors) {
                errors = error.errors.map(error => {
                    return {
                        path : error.path,
                        msg : error.message,
                        value : error.value
                    }
                })
            }
            let response = {
                ok : false,
                meta : {
                    status : 500
                },
                errors,
                msg : error.message ? error.message : "Comuniquese con el administrador del sitio"
            }
            return res.status(error.status || 500).json(response)
        }
    },
    update: async (req,res) => {
        
        if (checkID(req,params.id)) {
            return res.status(400).json(checkID(req.params.id))
        }
        
        const {title, rating, awards, release_date, length, genre_id} = req.body;
        
        try {
            
            let movies = await db.Movie.findAll();
            let moviesIds = movies.map (movie => movie.id)

            if (!moviesIds.includes(+genre_id)) {
                let error = new Error("ID de pelicula inexistente");
                error.status = 404;
                throw error
            }
            
            let statusUpdate = await db.Movie
            .update(
                {
                    title,
                    rating,
                    awards,
                    release_date,
                    length,
                    genre_id
                },
                {
                    where: {id: req.params.id}
                })
                
                let response;
                
                if (statusUpdate[0] === 1) {
                    response = {
                        ok : true,
                        meta : {
                            status : 201,
                        },
                        msg : "Los cambios fueron guardados con éxito"
                    }
                    return res.status(201).json(response)
                } else {
                    response = {
                        ok : true,
                        meta : {
                            status : 200,
                        },
                        msg : "No se realizaron cambios"
                    }
                    return res.status(200).json(response)
                }
        } catch (error) {
            console.log(error);
            let errors = [];
            if (error.errors) {
                errors = error.errors.map(error => {
                    return {
                        path : error.path,
                        msg : error.message,
                        value : error.value
                    }
                })
            }
            let response = {
                ok : false,
                meta : {
                    status : 500
                },
                errors,
                msg : error.message ? error.message : "Comuniquese con el administrador del sitio"
            }
            return res.status(error.status || 500).json(response)
        }
    },
    destroy: async (req,res) => {
        
        if (checkID(req,params.id)) {
            return res.status(400).json(checkID(req.params.id))
        }
        
        try {
            let movies = await db.Movie.findAll();
            let moviesIds = movies.map (movie => movie.id)
            
            if (!moviesIds.includes(+genre_id)) {
                let error = new Error("ID de pelicula inexistente");
                error.status = 404;
                throw error
            }
            
            let statusDestroy = await db.Movie.destroy({
                where : {
                    id : req.params.id
                },
                force : false
            });
            
            if (statusDestroy) {
                let response = {
                    ok : true,
                    meta : {
                        status : 100
                    },
                    msg : "La pelicula fue eliminada con éxito",
                }
                return res.status(100).json(response)
            } else {
                let response = {
                    ok : true,
                    meta : {
                        status : 100
                    },
                    msg : "No se hicieron cambios",
                }
                return res.status(100).json(response)
            }
        } catch (error) {
            console.log(error);
            let response = {
                ok : false,
                meta : {
                    status : 500
                },
                msg : error.message ? error.message : "Comuniquese con el administrador del sitio"
            }
            return res.status(error.status || 500).json(response)
        }

        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/movies')})
        .catch(error => res.send(error)) 
    }
}

module.exports = moviesController;