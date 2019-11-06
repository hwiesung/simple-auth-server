const fs = require('fs');
const constants = require('../constants');
const router = require('express').Router()


router.post('/change', (req, res, next)=> {
    const status = req.query.status;
    let ipV4 = req.connection.remoteAddress.replace(/^.*:/, '');
    console.log('healthChange from:'+ipV4);
    if(!req.headers['x-forwarded-for'] && (ipV4 === '1' || ipV4 === '127.0.0.1')){
        if(status === 'on'){
            fs.writeFileSync(constants.HEALTH_CHECK_PATH, '');
        }
        else if(status === 'off'){
            fs.unlinkSync(constants.HEALTH_CHECK_PATH);

        }
    }

    res.json({
        status:status
    });
});


module.exports = router