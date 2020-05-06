const user = require('./user2');
console.log('dir로 user 변수에 할당된 객체 확인 : ');
console.dir(user);

function showUser() {
  return user.getUser().name + ', '+ user.group.name;
}

console.log('사용자 정보 : %s', showUser());


// reason : user2.js 파일에서 exports에 객체를 할당하였으므로,
// require()를 호출할 때 자바스크립트에서 새로운 변수로 처리함.
// 결국 아무 속성도 없는 { } 객체가 반환됨.

// 왜 모듈을 불러와도 모듈 파일 안에서 exports에 할당한 객체가 보이지 않는 걸까요?
// 노드는 모듈을 처리할 때 exports를 속성으로 인식.
// 이 속성에 함수나 객체를 속성으로 추가하면 모듈을 불러들인 쪽에서
// exports에 추가된 속성들을 참조할 수 있습니다. 그러나
// exports에 객체를 할당하면 모듈 파일 안에서 선언한 exports는 모듈 시스템에서
// 처리할 수 있는 전역 변수가 아닌 단순 변수로 인식됩니다. 따라서
// 모듈을 불러들인 쪽에서 exports를 참조 할 수 없게되고, 결과적으로 모듈 파일을
// 불러들일 때 그 결과 객체에는 아무것도 들어 있지 않게 됩니다.
// 결국 user2.js파일에서 exports에 객체를 할당하면 전역 변수 exports와 무관한
// 모듈 파일 안의 변수가 되고 이 모듈을 불러들인 쪽에서는 비어 있는 exports 전역 변수만
// ㅜ참조하게 됩니다.
