const router = require('express').Router()
const controller = require('../controllers/auth')

router.get('/check', controller.check)

router.post('/register', controller.register)


module.exports = router