const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware')



router.get('/', authMiddleware, taskController.getAll)
router.get('/:id', authMiddleware, taskController.getOne)
router.post('/update/:id', authMiddleware, taskController.update)
router.post('/new', authMiddleware, taskController.new)


module.exports = router