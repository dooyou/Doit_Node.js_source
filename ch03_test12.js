const user = [{name:'girls',age:20}, {name:'girlsDay', age:22}];
console.log('배열 원소의 개수 : ', user.length);

user.unshift({name:'tiara', age:23});
console.log('배열 원소의 개수 : ', user.length);
console.dir(user);

const elem = user.shift();
console.log('배열 원소의 개수 : ', user.length);
console.dir(user);
console.dir(elem);
