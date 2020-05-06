var nconf = require('nconf');
nconf.env();
var value = nconf.get('OS');
console.log('OS 환경변수의 값 : ', value);
