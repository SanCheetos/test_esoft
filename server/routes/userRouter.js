const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const rootMiddleware = require('../middleware/rootMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/reg', rootMiddleware, userController.registration)
router.post('/login', userController.login)
router.post('/myExec', authMiddleware, userController.getMyExecutors)
router.post('/bosses', rootMiddleware, userController.getBosses)
router.get('/check', authMiddleware, userController.check)

module.exports = router