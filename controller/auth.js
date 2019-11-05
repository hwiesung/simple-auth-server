const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
    const secret = req.app.get('jwt-secret')

    let user = {
        _id:'abc',
        username: 'hwiesung'
    };
    console.log(secret);

    let token = await new Promise( (resolve, reject)=>{
        jwt.sign(
            {
                _id: user._id,
                username: user.username
            },
            secret,
            {
                expiresIn: '7d',
                issuer: 'sktelecom.com',
                subject: 'userInfo'
            }, (err, token) => {
                if (err) reject(err)
                resolve(token)
            })
    });


    res.json({
        msg:'this router is working',
        token
    });
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


    // create a promise that decodes the token
    let decoded =  await new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    );
    console.log(decoded);

    res.json({
        success: true,
        info: token
    })


}