const user = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}];

user.push({name:'티아라', age:21});

const add = (a,b) => {
  return a+b;
};

user.push(add);

console.log(user.length);
console.log(user[0].name);
console.log(user[3](20,3));
