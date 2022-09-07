const db = require('../../database/models');
const {checkID} = require("../../helpers")
const sequelize = db.sequelize;
const {Op} = require('sequelize')

const genresController = {
    list: async (req, res) => {

        try {
            let genres = await db.Genre.findAll();
            let response = {
                ok : true,
                meta : {
                    status : 200,
                    total : genres.length
                },
                data : genres
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
                return res.status(500).json(response)
        }
    },
    detail: async (req, res) => {

        if (checkID(req.params.id)) {
            return res.status(400).json(checkID(req.params.id))
        }

        try {
            let genre = await db.Genre.findByPk(req.params.id)
            let response;
            
            if (!genre) {
                response = {
                    ok : false,
                    meta : {
                        status : 404
                    },
                    msg : `No se encuentra el genero`
                }
                return res.status(404).json(response)
            }
                response = {
                    ok : true,
                    meta : {
                        status : 200,
                    },
                    data : genre
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
    byName: async (req,res) => {
        try {
            let genre = await db.Genre.findOne({
                where : {
                    name : {[Op.substring] : req.params.name }
                }
            });
            let response;
            if (!genre) {
                response = {
                    ok : false,
                    meta : {
                        status : 404,
                    },
                    msg : `No hay genero con el nombre: ${req.params.name}`
                }
                return res.status(404).json(response)
            }
            response = {
                ok : true,
                meta : {
                    status : 200,
                },
                data : genre 
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
                return res.status(500).json(response)
        }
    }
}

module.exports = genresController;