var calc = require('./calc');
console.log('모듈로 분리한후 - calc : %d', calc.add(20, 20));

var calc2 = require('./calc2');
console.log('모듈로 분리한후 - calc2 : %d', calc2.add(10, 10));
