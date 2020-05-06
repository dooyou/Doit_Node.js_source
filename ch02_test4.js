var calc = {};

calc.add = function(a,b) {
  return a+b;
};

calc.add2 = (c,d) => {
  return  c+d;
}

console.log('모듈로 분리하기 전 - calc.add : ' + calc.add(10,10));
console.log('모듈로 분리하기 전 - calc.add2 : ' + calc.add(30,30));
