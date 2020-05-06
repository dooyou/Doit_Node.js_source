const user = require('./user9').user;
user.printUser();

// user 객체를 정의 하는 코드는 user8.js 파일과 같습니다.
// 다만, 마지막에 있는 module.exports에 인스턴스 객체를
// 직접할당했던 방식을 바꾸어여기에서는
// exports.user 속성으로 인스턴스 객체를 추가합니다.
