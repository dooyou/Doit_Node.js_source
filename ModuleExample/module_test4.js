const user = require('./user4');

function showUser() {
  return user().name + ', No Group ';
}

console.log('사용자 정보 : %s', showUser());

// require() 메소드를 호출하면 모듈 파일 안에서 module.exports에 할당한
// 익명 함수가 반환됩니다.
// 이 익명 함수를 user 변수에 할당했다면, user()와 같이 소괄호를 붙여 함수를
// 실행할 수 있습니다.
// user 변수에 할당한 함수를 실행하면 name 속성을 가진 객체가 반환되므로
// 그 객체의 name 속성을 참조할 수 있습니다.
