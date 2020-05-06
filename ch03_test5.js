const person = {};

person['age'] = 20;
person['name'] = '소녀시대';

person.add = (a,b) => {
  return a+b;
}

console.log('나이 : %d', person.age);
console.log('이름 : %s', person.name);
console.log('더하기 :', person.add(10,1));
