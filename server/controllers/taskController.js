const { Op } = require("sequelize");
const ApiError = require("../error/ApiError")
const { User, Task } = require("../models/models")

const checkExecutor = async (userId, executor_id) => {
    const executor = await User.findOne({where: {id: executor_id}})
    return userId == executor.userId
}

class taskController {
    async getAll(req, res) {
        const sorting = req.query.ordering
        let nowDate = new Date()
        if (sorting.time == 'week'){
            nowDate.setDate(nowDate.getDate() + 7)
        }
        const stringNowDate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate()
        const task = await Task.findAll({
            where: {
                [Op.and]: [
                    req.user.login != 'root' &&
                    {
                        [Op.or]: [
                        {creator_id: req.user.id},
                        {executor_id: req.user.id}
                        ],
                    },

                    sorting.time != "week+" &&
                    {
                        dateComplete: {[Op.lte]: stringNowDate}
                    },
                    
                    sorting.executor != -1 &&
                    {
                        executor_id: sorting.executor
                    }

                ]
                    
            },
            include: [{
                model: User,
                as: 'Executor'
            }],
            order: [
                ['updatedAt', 'DESC']
            ],
        })
        return res.json(task)
    }
    async getOne(req, res) {
        const {id} = req.params
        const task = await Task.findOne({where: { id }})
        return res.json(task)
    }
    async update(req, res, next) {
        const userId = req.user.id
        const task = await Task.findOne({ where: { id: req.params.id }})
        if (req.body.onlyStatus){
            if (task.creator_id != userId && task.executor_id != userId){
                return next(ApiError.forbidden("Нет доступа для редактирования этой задачи!"))
            }
            await Task.update({status: req.body.status}, {where: {id: task.id}})
        }
        else{
            const {heading, desc, dateComplete, priority, status, executor_id} = req.body
            const isBoss = await checkExecutor(userId, executor_id)
            console.log(task.creator_id, userId)
            if (task.creator_id != userId){
                return next(ApiError.forbidden("Для редактирования данных полей нужно быть создателем задачи!"))
            }
            if (!isBoss){
                return next(ApiError.forbidden("Вы можете назначить задачу только подчиненному!"))
            }
            await Task.update({heading, desc, dateComplete, priority, status, executor_id}, {where: {id: task.id}})
        }
        return res.json({message: "Изменения прошли успешно"})
    }
    
    async new(req, res, next) {
        const userId = req.user.id
        const {heading, desc, dateComplete, priority, executor_id} = req.body
        const isBoss = await checkExecutor(userId, executor_id)
        if (!isBoss){
            return next(ApiError.forbidden("Вы можете назначить задачу только подчиненному!"))
        }
        try {
            await Task.create({heading, desc, dateComplete, priority, status: "К выполнению", creator_id: userId, executor_id})
        }
        catch(e){
            return next(ApiError.internal(e.message))
        }
        
        return res.json({message: "Изменения прошли успешно"})
    }
}

module.exports = new taskController()