// exports는 속성으로, exports에 속성을 추가하면 모듈에서 접근하지만
// exports에 객체를 지정하면 자바스크립트에서 새로운 변수로 처리함.

exports = {
  getUser : function() {
    return {id:'test01', name:'강아지'};
  },
  group : {id:'group01', name:'고양이'}
}

// 이렇게 코드를 입력하면 getUser()함수와 group 객체를 속성으로 가진 객체를 만들어
// exports에 할당하게 됩니다. 따라서 exports 속성으로 getUser() 함수와 group 객체를
// 추가한 것과 같은 효과를 냅니다. 일반적 자바스크립트 코드에서는 user1.js파일의 코드와
// user2.js 파일의 코드가 같은 것처럼 보이는 것이죠.
// 그럼 이 코드가 정상적으로 동작하는지 module_test2.js파일을 만들고 확인해봅시다. 
