const ApiError = require('../error/ApiError')
const {User} = require('../models/models')
const { Op } = require("sequelize");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwt = (id, login, lastName, name, patronymic, isBoss) => {
    return jwt.sign(
        {id, login, lastName, name, patronymic, isBoss}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'})
}

class userController {
    async registration(req, res, next) {
        const {name, lastName, patronymic, login, password, userId} = req.body
        if (!login || !password) {
            return next(ApiError.badRequest('Некорректный логин или пароль!'))
        }
        const candidate = await User.findOne({where: {login}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким логином уже существует!'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        await User.create({name, lastName, patronymic, login, password: hashPassword, userId})
        return res.json({message: 'Пользователь успешно создан'})
    }

    async login(req, res, next) {
        const {login, password} = req.body
        const user = await User.findOne({where: {login}})
        if (!user){
            console.log('Без юзера')
            return next(ApiError.internal('Пользователь не найден...'))
        }
        let comparePass = bcrypt.compareSync(password, user.password)
        if (!comparePass) {
            return next(ApiError.internal('Неверный пароль'))
        }
        const token = generateJwt(user.id, user.login, user.lastName, user.name, user.patronymic, user.userId ? false : true)
        return res.json({token})
    }

    async getMyExecutors(req, res) {
        const bossId = req.user.id
        const users = await User.findAll({
            attributes: ['id', 'name', 'lastName', 'patronymic'], 
            where: {userId: bossId}
        })
        return res.json({users})
    }

    async getBosses(req, res) {
        const bossId = req.user.id
        const users = await User.findAll({
            attributes: ['id', 'name', 'lastName', 'patronymic'], 
            where: {
                [Op.and]: [
                    {userId: null},
                    {login: {[Op.ne]: 'root'}}
                ]
                
            }
        })
        return res.json({users})
    }

    async check(req, res) {
        console.log(req)
        const token = generateJwt(req.user.id, req.user.login, req.user.lastName, req.user.name, req.user.patronymic)
        return res.json({token})
    }
}

module.exports = new userController()