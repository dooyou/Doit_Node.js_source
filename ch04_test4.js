const calculator = require("./calc3");

const calc1 = new calculator();
calc1.emit("stop");

console.log(calculator.title + "에 stop 이벤트 전달");
