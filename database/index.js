const path = require('path');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const config = require('config');

const db = {};
const sequelize = new Sequelize(
    config.database.database, config.database.username, config.database.password, {
        host: config.database.host,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false
        }
    }
);

class Auth extends Model {};

Auth.init({
    // attributes
    AUTH_ID: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    SERVICE_TYPE: {
        type: Sequelize.Sequelize.BIGINT,
        allowNull: false,
        unique: 'compositeIndex'
    },
    USER_ID: {
        type: Sequelize.Sequelize.BIGINT,
        allowNull: false,
        unique: 'compositeIndex'
    },
    REFRESH_TOKEN: {
        type: Sequelize.Sequelize.STRING,
        allowNull: false
    },
    REG_YMDT: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    EDIT_YMDT: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    DEL_YN:{
        type:Sequelize.BOOLEAN,
        defaultValue:false,
    },
    DEL_YMDT: {
        type: Sequelize.DATE
    }
}, {
    sequelize,
    modelName: 'auth'
    // options
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = {
    db,
    Auth
}