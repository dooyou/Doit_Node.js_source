// module.exports에는 객체를 그대로 할당할 수 있음.
const user = {
  getUser : function() {
    return {id:'test01', name:'강아지'};
  },
  group : {id:'group01', name:'고양이'}
}

module.exports = user;

// 자바스크립트 코드를 만들 때 객체 안에 속성을 넣어 두는 경우가 많습니다.
// 따라서 모듈 파일에서 이 모듈을 불러들인 쪽으로 객체를 전달하는것이 훨씬
// 편할 수 있습니다. 그렇다면 객체를 그대로 할당하는 방법은 없을까요?
// exports가 아니라 module.exports를 사용하면 객체를 그대로 할당할 수 있습니다.

// getUser()메소드와 group 객체를 속성으로 갖는 객체를 새로 만들고 user 변수에 할당합니다.
// 이 user 변수는 다시 module.exports에 그대로 할당되었습니다. 
