const winston = require('winston'); //로그처리 모듈
const winstonDaily = require('winston-daily-rotate-file');//로그 일별 처리 모듈
const moment = require('moment');

function timeStampFormat() {
  return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
  // ex) '2020-02-25 20:20:20.500 +0900'
};

const logger = winston.createLogger({
  transports : [
    new (winstonDaily)({
      name : 'info-file',
      filename: './log/server',
      datePattern: 'YYYY-MM-DD',
      colorize:false,
      maxsize: 50000000,
      maxFiles: 1000,
      level: 'info',
      showlevel: true,
      json:false,
      timestamp: timeStampFormat,

    }),
    new (winston.transports.Console)({
      name : 'debug-console',
      colorize: true,
      level: 'debug',
      showlevel: true,
      json:false,
      timestamp: timeStampFormat,
    })
  ],
  exceptionHandlers: [
    new (winstonDaily)({
      name : 'exception-file',
      filename: './log/exception',
      datePattern: 'YYYY-MM-DD',
      colorize:false,
      maxsize: 50000000,
      maxFiles: 1000,
      level: 'error',
      showlevel: true,
      json:false,
      timestamp: timeStampFormat,
    }),
    new (winston.transports.Console)({
      name : 'exception-console',
      colorize: true,
      level: 'debug',
      showlevel: true,
      json:false,
      timestamp: timeStampFormat,
    })
  ]
});
