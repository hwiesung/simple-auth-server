const router = require('express').Router()
const controller = require('../controller/auth')

router.get('/check', controller.check)

router.post('/register', controller.register)


module.exports = router