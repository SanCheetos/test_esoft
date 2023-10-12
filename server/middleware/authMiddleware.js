const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization //Отделить токен от его типа
        if (!token) {
            return res.status(401).json({message: "Вы не авторизованы"})
        }
        const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
        console.log(decoded)
        req.user = decoded
        next()
    } catch (e) {
        res.status(401).json({message: e})
    }
}