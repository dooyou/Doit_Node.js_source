const user = [{name:'소녀시대', age:20}, {name:'걸스데이', age:22}];

user.push({name:'티아라', age:21});

const add = (a,b) => {
  return a+b;
};

user.push(add);

for(let i=0; i<user.length; i++){
  console.log('배열원소', i, ':', user[i].name);
}

user.forEach((item, i) => {
  console.log('배열원소', i, ':', item.name);
});
