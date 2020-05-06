const user = [{name:'girls',age:20}, {name:'girlsDay', age:22}];
console.log('배열 원소의 개수 : ', user.length);

user.push({name:'tiara', age:23});
console.log('배열 원소의 개수 : ', user.length);

const elem = user.pop();
console.log('배열 원소의 개수 : ', user.length);
console.log('배열 원소의 개수 : ');
console.dir(elem);
