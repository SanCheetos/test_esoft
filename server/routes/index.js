const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const taskRouter = require('./taskRouter')

router.use('/user', userRouter)
router.use('/task', taskRouter)

module.exports = router