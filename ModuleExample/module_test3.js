const user = require('./user3');
//console.dir(user);

function showUser() {
  return user.getUser().name + ', '+user.group.name;
}

console.log('사용자 정보 : %s', showUser());

// exports에 객체를 그대로 할당하면 모듈 파일을 불러들인 쪽에서 그 객체를
// 참조할 수 없지만, module.exports에 객체를 그대로 할당하면
// 모듈 파일 안에서 할당한 객체를 참조할 수 있습니다.
// 이 때문에 아무런 오류가 발생하지 않습니다.
