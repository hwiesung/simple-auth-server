const winston = require('winston');
require('winston-daily-rotate-file');

var moment = require('moment-timezone');
const myFormat =winston.format.printf((info)=>{
    info.timestamp = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    return JSON.stringify(info);
});
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(myFormat),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '30d'
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(myFormat)
    }));
}

module.exports = logger;