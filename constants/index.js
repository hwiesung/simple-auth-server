exports.SERVICE_TYPE = {
    TPLACE:1,
    TPLACE_ADMIN:2
};


exports.RET_CODE = {
    SUCCESS:0,
    ERROR:1,

    INVALID_TOKEN : 1001,
    INVALID_REFRESH_TOKEN : 1002,
    FAIL_TO_TOKEN_GENERATE : 1003,

    INVALID_PARAMETER : 9000,
    FAIL_TO_DB_OPERATION : 9001,
}

exports.HEALTH_CHECK_PATH = __dirname +'/../public/healthCheck.html';