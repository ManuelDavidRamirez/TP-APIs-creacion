const checkID = (id) => {
    if (isNaN(id)) {
        response = {
            ok : false,
            meta : {
                status : 400
            },
            msg : `Número de ID incorrecto`
        }
        return true
    }
    return false
}

module.exports = {
    checkID
}