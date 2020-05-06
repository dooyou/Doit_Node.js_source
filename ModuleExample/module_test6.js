var require = function(path){
  const exports = {
    getUser: () => {
      return {id: 'test01', name: '강아지'};
    },
    group : {id:'group01', name:'고양이'}
  }
  return exports;
}

const user = require('...');

function showUser(){
  return user.getUser().name+', '+user.group.name;
}
console.log('사용자 정보 : %s ', showUser());
