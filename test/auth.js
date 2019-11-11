process.env.NODE_ENV = "test"

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);

const constants = require('../constants');

const userId = 1;
const serviceType = 1;


describe('/POST register', () => {
    it('it should add new auth', (done) => {
        chai.request(app)
            .post('/auth/register')
            .send({ USER_ID: userId, SERVICE_TYPE: serviceType })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('RET_CODE').eq(constants.RET_CODE.SUCCESS);
                res.body.should.have.property('ACCESS_TOKEN');
                res.body.should.have.property('REFRESH_TOKEN');
                done();
            });
    });
});

describe('/GET check', () => {
    let token = null;
    before('regist auth', (done)=>{
        chai.request(app)
            .post('/auth/register')
            .send({ USER_ID: userId, SERVICE_TYPE: serviceType })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('RET_CODE').eq(constants.RET_CODE.SUCCESS);
                res.body.should.have.property('ACCESS_TOKEN');
                res.body.should.have.property('REFRESH_TOKEN');
                token = res.body.ACCESS_TOKEN;
                done()
            });
    })

    it('it should check access token ', (done) => {
        chai.request(app)
            .get('/auth/check')
            .set('x-user-id',userId)
            .set('x-access-token',token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('RET_CODE').eq(constants.RET_CODE.SUCCESS);
                done();
            });
    });

    it('it should fail to check access token ', (done) => {
        chai.request(app)
            .get('/auth/check')
            .set('x-user-id',userId)
            .set('x-access-token',token+'a')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('RET_CODE').eq(constants.RET_CODE.FAIL_TO_TOKEN_VERIFY);
                done();
            });
    });
});

describe('/POST refresh', () => {
    let refreshToken = null;
    before('regist auth', (done)=>{
        chai.request(app)
            .post('/auth/register')
            .send({ USER_ID: userId, SERVICE_TYPE: serviceType })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('RET_CODE').eq(constants.RET_CODE.SUCCESS);
                res.body.should.have.property('ACCESS_TOKEN');
                res.body.should.have.property('REFRESH_TOKEN');
                refreshToken = res.body.REFRESH_TOKEN;
                done()
            });
    })

    it('it should refresh new token ', (done) => {
        chai.request(app)
            .post('/auth/refresh')
            .send({ USER_ID: userId, SERVICE_TYPE: serviceType, REFRESH_TOKEN:refreshToken })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('RET_CODE').eq(constants.RET_CODE.SUCCESS);
                res.body.should.have.property('ACCESS_TOKEN');
                done();
            });
    });

    it('it should fail to refresh new token ', (done) => {
        chai.request(app)
            .post('/auth/refresh')
            .send({ USER_ID: userId, SERVICE_TYPE: serviceType, REFRESH_TOKEN:refreshToken+'a' })
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('RET_CODE').eq(constants.RET_CODE.INVALID_REFRESH_TOKEN);
                done();
            });
    });
});
