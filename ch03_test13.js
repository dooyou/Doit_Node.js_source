const user = [{name:'girls',age:20}, {name:'girlsDay', age:22},{name:'tiara', age:23}];

delete user[1];
console.dir(user);

user.forEach((item, i) => {
  console.log('원소 #',i);
  console.dir(item);
});

user.splice(1,0, {name:'bodygroup', age:23});
console.dir(user);

user.splice(2,1);
console.dir(user);
