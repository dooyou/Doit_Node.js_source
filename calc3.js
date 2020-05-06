const util = require("util");
const EventEmitter = require("events").EventEmitter;

const calculator = function() {
    const self = this;
    this.on("stop", () => {
        console.log("calculator에 stop event 전달됨");
    });
};

util.inherits(calculator, EventEmitter);
//Calc 객체가 EventEmitter를 상속받음

calculator.prototype.add = (a, b) => {
    return a + b;
};
module.exports = calculator;
module.exports.title = "calculator 계산기 : ";
