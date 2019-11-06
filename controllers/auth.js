const jwt = require('jsonwebtoken')
var config = require('config');
const constants = require('../constants');
const db = require('../database').db;
const Auth = require('../database').Auth;

exports.register = async (req, res) => {
    const userId = req.body.USER_ID;
    const serviceType = req.body.SERVICE_TYPE;
    if(!userId || !serviceType ) {
        return res.status(403).json({
            RET_CODE: constants.RET_CODE.INVALID_PARAMETER,
            MSG: 'invalid input parameter'
        })
    }

    try{
        let token = await new Promise( (resolve, reject)=>{
            jwt.sign(
                {
                    SERVICE_TYPE: serviceType,
                    USER_ID: userId
                },
                req.app.get('jwt-secret'),
                {
                    expiresIn: config.jwt.token_life,
                    issuer: 'sktelecom.com',
                    subject: 'userInfo'
                }, (err, token) => {
                    if (err) reject(err)
                    resolve(token)
                })
        });

        let refreshToken = await new Promise( (resolve, reject)=>{
            jwt.sign(
                {
                    SERVICE_TYPE: serviceType,
                    USER_ID: userId
                },
                req.app.get('jwt-refresh-secret'),
                {
                    expiresIn: config.jwt.refresh_token_life,
                    issuer: 'sktelecom.com',
                    subject: 'userInfo'
                }, (err, token) => {
                    if (err) reject(err)
                    resolve(token)
                })
        });

        await db.sequelize.transaction((t)=>{
            return Auth.findOne(
                {
                    where: {USER_ID: userId, SERVICE_TYPE:serviceType},
                    limit: 1,
                    lock: true,
                    transaction: t
                }
            ).then((auth)=>{
                if(auth){
                    return Auth.update({REFRESH_TOKEN:refreshToken,EDIT_YMDT:new Date()
                    }, {where: {USER_ID: userId, SERVICE_TYPE:serviceType},transaction:t})
                }
                return Auth.create({SERVICE_TYPE:serviceType, USER_ID:userId, REFRESH_TOKEN:refreshToken},{transaction:t});
            })
        });

        res.json({
            RET_CODE: constants.RET_CODE.SUCCESS,
            token,
            refreshToken
        });
    } catch(err){
        console.log(err);
        res.status(403).json({
            RET_CODE:constants.RET_CODE.FAIL_TO_TOKEN_GENERATE,
            MSG: 'fail to generate token'
        })
    }
}


exports.check = async (req, res) => {
    // read the token from header or url
    const token = req.headers['x-access-token'] || req.query.token

    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            msg: 'not logged in'
        })
    }
    const secret = req.app.get('jwt-secret');

    try{
        // create a promise that decodes the token
        let decoded =  await new Promise((resolve, reject) => {
                jwt.verify(token, secret, (err, decoded) => {
                    if(err) {
                        console.log(err);
                        reject(err);
                    }
                    resolve(decoded)
                })
            }
        );
        console.log(decoded);

        res.json({
            success: true,
            info: token
        })
    } catch(err){
        res.status(403).json({
            success: false,
            message: 'fail to verify token'
        })
    }
};

exports.refresh = async (req, res) => {


};